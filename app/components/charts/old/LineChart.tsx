import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface TimeSeriesData {
	DATE: string;
	WATER_CONSUMPTION: number;
}

interface LineChartProps {
	data: TimeSeriesData[];
}

export default function LineChart({ data }: Readonly<LineChartProps>) {
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
			.scaleUtc()
			.domain([
				new Date(data[0].DATE),
				new Date(data[data.length - 1].DATE),
			])
			.range([0, width]);

		const y = d3
			.scaleLinear()
			.domain([
				d3.min(data, (d) => d.WATER_CONSUMPTION) as number,
				d3.max(data, (d) => d.WATER_CONSUMPTION) as number,
			])
			.range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y)
              .tickFormat(d => (d / 1e6).toFixed(1) + "M"));

		const line = d3
			.line<TimeSeriesData>()
			.x((d) => x(new Date(d.DATE)))
			.y((d) => y(d.WATER_CONSUMPTION));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("d", line);
    });

	return <div ref={ref}></div>;
}
