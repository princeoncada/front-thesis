import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

export default function Histogram({ data }) {
	const svgRef = useRef(null);
	const [histogramData, setHistogramData] = useState([]);

	useEffect(() => {
		const waterConsumption = data.map((d) => d.waterConsumption);
		const histogram = d3
			.bin()
			.domain([0, d3.max(waterConsumption)])
			.thresholds(100);
		const bins = histogram(waterConsumption);
		setHistogramData(bins);
	}, [data]);

	useEffect(() => {
		if (histogramData.length === 0) return;

		const margin = { top: 30, right: 30, bottom: 60, left: 75 },
			width = 500 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		const svg = d3
			.select(svgRef.current)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// Define scales
		const xScale = d3
			.scaleLinear()
			.domain([5000000, d3.max(histogramData, (d) => d.x1)])
			.range([0, width]);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(histogramData, (d) => d.length)])
			.range([height, 0]);

		// Add bars for the histogram
		svg.selectAll(".bar")
			.data(histogramData)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", (d) => xScale(d.x0))
			.attr("y", (d) => yScale(d.length))
			.attr("width", (d) => xScale(d.x1) - xScale(d.x0) - 1)
			.attr("height", (d) => height - yScale(d.length))
			.attr("fill", "steelblue");

		// Add x-axis
		svg.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(xScale).ticks(8).tickFormat(d3.format(".2s")));

		// Add y-axis
		svg.append("g").call(d3.axisLeft(yScale));

		// Y-axis label
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -height / 2)
			.attr("y", -margin.left + 15)
			.attr("text-anchor", "middle")
			.attr("class", "axis-label")
			.text("Frequency");

		// X-axis label
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", height + margin.bottom - 15)
			.attr("text-anchor", "middle")
			.attr("class", "axis-label")
			.text("Water Consumption (Liters)");

		// Cleanup on component unmount
		return () => {
			d3.select(svgRef.current).selectAll("*").remove();
		};
	}, [histogramData, data]);

	return (
		<div>
			<svg ref={svgRef}></svg>
		</div>
	);
}
