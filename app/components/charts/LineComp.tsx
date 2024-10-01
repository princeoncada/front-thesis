import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function LineComp({ data }) {
	const svgRef = useRef(null);

	useEffect(() => {
		// Set dimensions and margins for the SVG canvas
		const margin = { top: 30, right: 60, bottom: 60, left: 75 };
		const width = 500 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;

		// Select or create the SVG element
		const svg = d3
			.select(svgRef.current)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// X scale for time (date)
		const x = d3
			.scaleTime()
			.domain(d3.extent(data, (d) => d.date))
			.range([0, width]);

		// Y scale for water consumption (left axis)
		const yConsumption = d3
			.scaleLinear()
			.domain([
				d3.min(data, (d) => d.waterConsumption) - 50000,
				d3.max(data, (d) => d.waterConsumption),
			])
			.range([height, 0]);

		// Y scale for rainfall (right axis)
		const yRainfall = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.rainfall)])
			.range([height, 0]);

		// Define line for water consumption
		const lineConsumption = d3
			.line()
			.x((d) => x(d.date))
			.y((d) => yConsumption(d.waterConsumption));

		// Define line for rainfall
		const lineRainfall = d3
			.line()
			.x((d) => x(d.date))
			.y((d) => yRainfall(d.rainfall));

		// Add X-axis
		svg.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(x).ticks(5));

		// Add Y-axis (left, for water consumption)
		svg.append("g").call(d3.axisLeft(yConsumption).tickFormat((d) => (d / 1000000).toFixed(2) + "M"));

		// Add Y-axis (right, for rainfall)
		svg.append("g")
			.attr("transform", `translate(${width}, 0)`)
			.call(d3.axisRight(yRainfall));

		// Add the water consumption line (left axis)
		svg.append("path")
			.datum(data)
			.attr("class", "line line-consumption")
			.attr("d", lineConsumption)
			.attr("stroke", "steelblue")
			.attr("fill", "none");

		// Add the rainfall line (right axis)
		svg.append("path")
			.datum(data)
			.attr("class", "line line-rainfall")
			.attr("d", lineRainfall)
			.attr("stroke", "orange")
			.attr("fill", "none");

		// X-axis label
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", height + margin.bottom - 15)
			.attr("class", "axis-label")
			.text("Date");

		// Y-axis label (left)
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -height / 2)
			.attr("y", -margin.left + 15)
			.attr("class", "axis-label")
			.text("Water Consumption (Liters)");

		// Y-axis label (right)
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -height / 2)
			.attr("y", width + margin.right - 15)
			.attr("class", "axis-label")
			.text("Rainfall (mm)");

		// Legend
		const legendData = [
			{ color: "steelblue", text: "Consumption" },
			{ color: "orange", text: "Rainfall" },
		];

		legendData.forEach((item, index) => {
			svg.append("circle")
				.attr("cx", width - 100)
				.attr("cy", 10 + index * 20)
				.attr("r", 6)
				.style("fill", item.color);
			svg.append("text")
				.attr("x", width - 90)
				.attr("y", 15 + index * 20)
				.text(item.text)
				.style("font-size", "12px")
				.attr("alignment-baseline", "middle");
		});

		// Cleanup function
		return () => {
			d3.select(svgRef.current).selectAll("*").remove();
		};
	}, [data]);

	return (
		<div>
			<svg ref={svgRef}></svg>
		</div>
	);
}
