import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

function movingAverage(data, windowSize) {
	let result = [];
	for (let i = 0; i < data.length - windowSize + 1; i++) {
		let window = data.slice(i, i + windowSize);
		let avg = window.reduce((acc, val) => acc + val, 0) / windowSize;
		result.push(avg);
	}
	return result;
}

export default function SeasonalDecomposition({ data, view }) {
	const [decomposedData, setDecomposedData] = useState({
		trend: [],
		seasonal: [],
		residual: [],
	});
	const svgRefs = {
		trend: useRef(),
		seasonal: useRef(),
		residual: useRef(),
	};

	useEffect(() => {
		const formattedData = data.map((d) => ({
			date: d.date,
			waterConsumption: +d.waterConsumption,
		}));

		// Extract just the water consumption for STL decomposition
		const values = formattedData.map((d) => d.waterConsumption);

		// Perform STL decomposition
		const trend = movingAverage(values, 15);

		// 3. Detrend the data
		let seasonal = values.map(
			(val, idx) => val - (trend[idx] || trend[trend.length - 1])
		);

		let seasonality = [0, 2, -2];

		// 5. Residual
		let residual = values.map(
			(val, idx) => val - seasonality[idx % seasonality.length]
		);

		// Store the decomposed data in state
		setDecomposedData({
			trend: formattedData.map((d, i) => ({
				date: d.date,
				value: trend[i],
			})),
			seasonal: formattedData.map((d, i) => ({
				date: d.date,
				value: seasonal[i],
			})),
			residual: formattedData.map((d, i) => ({
				date: d.date,
				value: residual[i],
			})),
		});
	}, [data]);

	useEffect(() => {
		if (decomposedData.trend.length === 0) return;

		const margin = { top: 30, right: 30, bottom: 60, left: 75 },
			width = 500 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		const plotLine = (svgRef, dataKey, title) => {
			// Set up the scales
			const xScale = d3.scaleTime().range([0, width]);
			const yScale = d3.scaleLinear().range([height, 0]);

			// Set domains
			xScale.domain(d3.extent(decomposedData[dataKey], (d) => d.date));
			yScale.domain([
				d3.min(decomposedData[dataKey], (d) => d.value),
				d3.max(decomposedData[dataKey], (d) => d.value),
			]);

			// SVG container
			const svg = d3
				.select(svgRef.current)
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", `translate(${margin.left},${margin.top})`);

			// X Axis
			svg.append("g")
				.attr("transform", `translate(0,${height})`)
				.call(d3.axisBottom(xScale));

			// Y Axis
			svg.append("g").call(d3.axisLeft(yScale));

			// Line generator
			const line = d3
				.line()
				.x((d) => xScale(d.date))
				.y((d) => yScale(d.value));

			// line path
			svg.append("path")
				.datum(decomposedData[dataKey])
				.attr("fill", "none")
				.attr("stroke", "steelblue")
				.attr("stroke-width", 1.5)
				.attr("d", line);

            // add x label for seasonal
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 15)
                .attr("text-anchor", "middle")
                .attr("class", "axis-label")
                .text("Date");

            // add y label for seasonal
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -margin.left + 15)
                .attr("text-anchor", "middle")
                .attr("class", "axis-label")
                .text(title + " Variance" +" (Liters)");
		};

		// Render the trend, seasonal, and residual plots
		plotLine(svgRefs.trend, "trend", "Trend");
		plotLine(svgRefs.seasonal, "seasonal", "Seasonality");
		plotLine(svgRefs.residual, "residual", "Residuals");

		// Cleanup on unmount
		return () => {
			Object.values(svgRefs).forEach((ref) => {
				d3.select(ref.current).selectAll("*").remove();
			});
		};
	}, [decomposedData]);

	return (
		<div>
			<svg
				ref={svgRefs.trend}
				className={view === 0 ? "block" : "hidden"}
			></svg>
			<svg
				ref={svgRefs.seasonal}
				className={view === 1 ? "block" : "hidden"}
			></svg>
			<svg
				ref={svgRefs.residual}
				className={view === 2 ? "block" : "hidden"}
			></svg>
		</div>
	);
}
