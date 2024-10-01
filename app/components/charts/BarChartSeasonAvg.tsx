import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BarChartSeasonAvg({ data }) {
	const svgRef = useRef(null);

	useEffect(() => {
		const rainySeasonData = data.filter((d) => d.isRainySeason === 1);
		const nonRainySeasonData = data.filter((d) => d.isRainySeason === 0);
		const avgRainySeasonConsumption = d3.mean(
			rainySeasonData,
			(d) => d.waterConsumption
		);
		const avgNonRainySeasonConsumption = d3.mean(
			nonRainySeasonData,
			(d) => d.waterConsumption
		);

		const barData = [
			{
				season: "Rainy Season",
				avgConsumption: avgRainySeasonConsumption,
			},
			{
				season: "Dry Season",
				avgConsumption: avgNonRainySeasonConsumption,
			},
		];

		const margin = { top: 30, right: 30, bottom: 60, left: 75 },
			width = 500 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		const svg = d3
			.select(svgRef.current)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const x = d3
			.scaleBand()
			.domain(barData.map((d) => d.season))
			.range([0, width])
			.padding(0.3);

		const y = d3
			.scaleLinear()
			.domain([
				d3.min(barData, (d) => d.avgConsumption) - 1000000,
				d3.max(barData, (d) => d.avgConsumption),
			])
			.nice()
			.range([height, 0]);

		svg.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(x));

		svg.append("g").call(
			d3.axisLeft(y).tickFormat((d) => (d / 1000000).toFixed(2) + "M")
		);

		svg.selectAll(".bar")
			.data(barData)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", (d) => x(d.season))
			.attr("y", (d) => y(d.avgConsumption))
			.attr("width", x.bandwidth())
			.attr("height", (d) => height - y(d.avgConsumption));

		svg.selectAll(".text-label")
			.data(barData)
			.enter()
			.append("text")
			.attr("class", "text-label")
			.attr("x", (d) => x(d.season) + x.bandwidth() / 2)
			.attr("y", (d) => y(d.avgConsumption) - 5)
			.text((d) => (d.avgConsumption / 1000000).toFixed(2) + "M")
			.attr("text-anchor", "middle");

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
			.text("Season");

		return () => {
			svg.selectAll("*").remove();
		};
	});

	return (
		<div>
			<svg ref={svgRef}></svg>
		</div>
	);
}
