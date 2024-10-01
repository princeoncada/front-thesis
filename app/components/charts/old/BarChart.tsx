import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface AverageByDayOfWeekData {
	Monday: number;
	Tuesday: number;
	Wednesday: number;
	Thursday: number;
	Friday: number;
	Saturday: number;
	Sunday: number;
}

interface BarChartProps {
	barData: AverageByDayOfWeekData;
}

export default function BarChart({ barData }: Readonly<BarChartProps>) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) {
			ref.current.innerHTML = "";
		}

		const margin = { top: 30, right: 30, bottom: 60, left: 75 },
			width = 500 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		const svg = d3
			.select(ref.current)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr(
				"transform",
				"translate(" + margin.left + "," + margin.top + ")"
			);

		const x = d3
			.scaleBand()
			.domain(Object.entries(barData).map((d) => d[0].toString())) // Set domain to month names
			.range([0, width])
			.padding(0.2); // Add padding between bars

		const y = d3
			.scaleLinear()
			.domain([
				d3.min(Object.entries(barData), (d) => d[1]) as number - 500,
				d3.max(Object.entries(barData), (d) => d[1]) as number,
			]) // Add padding to the max value
			.range([height, 0]);

		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x))
			.selectAll("text")
			.attr("transform", "rotate(-45)")
			.style("text-anchor", "end");

        svg.append("g")
            .call(d3.axisLeft(y)
              .tickFormat(d => (d / 1e6).toFixed(1) + "M"));

		svg.selectAll(".bar")
			.data(Object.entries(barData))
			.enter()
			.append("rect")
			.attr("fill", "steelblue")
			.attr("x", (d) => x(d[0].toString()))
			.attr("y", (d) => y(d[1]))
			.attr("width", x.bandwidth()) // Set the width based on the scale's bandwidth
			.attr("height", (d) => height - y(d[1]));

        svg.selectAll(".text")
        .data(Object.entries(barData))
            .enter()
            .append("text")
            .attr("x", d => x(d[0].toString()) + x.bandwidth() / 2)
            .attr("y", d => y(d[1]) - 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("dy", "0.01em")
            .text(d => d[1].toFixed(0));
	});

	return <div ref={ref}></div>;
}
