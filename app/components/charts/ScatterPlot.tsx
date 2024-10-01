import { useRef, useEffect } from "react";
import * as d3 from "d3";

function linearRegression(data) {
	const n = data.length;
	const sumX = d3.sum(data, (d) => d.avgTemp);
	const sumY = d3.sum(data, (d) => d.waterConsumption);
	const sumXY = d3.sum(data, (d) => d.avgTemp * d.waterConsumption);
	const sumX2 = d3.sum(data, (d) => d.avgTemp * d.temperature);

	const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
	const intercept = (sumY - slope * sumX) / n;

	return { slope, intercept };
}

export default function ScatterPlot({ data }) {
	const svgRef = useRef(null);

	useEffect(() => {
		const { slope, intercept } = linearRegression(data);

		const margin = { top: 30, right: 30, bottom: 60, left: 75 },
			width = 500 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		const svg = d3
			.select(svgRef.current)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr(
				"transform",
				"translate(" + margin.left + "," + margin.top + ")"
			);

		const x = d3
			.scaleLinear()
			.domain([
				d3.min(data, (d) => d.avgTemp),
				d3.max(data, (d) => d.avgTemp),
			])
			.nice()
			.range([0, width]);

		const y = d3
			.scaleLinear()
			.domain([
				d3.min(data, (d) => d.waterConsumption),
				d3.max(data, (d) => d.waterConsumption),
			])
			.nice()
			.range([height, 0]);

		svg.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(x));

		svg.append("g").call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

		svg.selectAll(".dot")
			.data(data)
			.enter()
			.append("circle")
			.attr("class", "dot")
			.attr("cx", (d) => x(d.avgTemp))
			.attr("cy", (d) => y(d.waterConsumption))
			.attr("r", 2)
			.attr("fill", "steelblue");

		// Add regression line
		const regressionLine = d3
			.line()
			.x((d) => x(d.avgTemp))
			.y((d) => y(slope * d.avgTemp + intercept));

		svg.append("path")
			.datum(data)
			.attr("class", "regression-line")
			.attr("d", regressionLine);

		// Y-axis label
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -height / 2)
			.attr("y", -margin.left + 15)
			.attr("text-anchor", "middle")
			.attr("class", "axis-label")
			.text("Water Consumption (Liters)");

		// X-axis label
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", height + margin.bottom - 15)
			.attr("text-anchor", "middle")
			.attr("class", "axis-label")
			.text("Average Temperature (°C)");

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
