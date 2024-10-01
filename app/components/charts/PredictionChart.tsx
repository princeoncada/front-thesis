import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function PredictionChart({ data }) {
	const ref = useRef(null);

	useEffect(() => {
        if (ref.current) {
			ref.current.innerHTML = "";
		}
		// Set dimensions and margins
        const margin = {top: 20, right: 30, bottom: 30, left: 50},
              width = 1300 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

        // Parse the date / time
        const parseTime = d3.timeParse("%Y-%m-%d");

        // Set up the SVG canvas
        const svg = d3.select(ref.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Set the scales for X and Y axes
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => parseTime(d.DATE)))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([d3.min(data, d => +d.WATER_CONSUMPTION), d3.max(data, d => +d.WATER_CONSUMPTION)])
            .range([height, 0]);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(d => (d / 1e6).toFixed(1) + "M"));

        // Define the line for actual data
        const lineActual = d3.line()
            .x(d => x(parseTime(d.DATE)))
            .y(d => y(+d.WATER_CONSUMPTION));

        // Define the line for predicted data
        const linePredicted = d3.line()
            .x(d => x(parseTime(d.DATE)))
            .y(d => y(+d.WATER_CONSUMPTION));

        // Plot the actual data (steelblue line)
        svg.append("path")
            .datum(data.filter(d => d.TYPE === 'actual'))
            .attr("class", "line-actual")
            .attr("d", lineActual);

        // Plot the predicted data (orange line)
        svg.append("path")
            .datum(data.filter(d => d.TYPE === 'predicted'))
            .attr("class", "line-predicted")
            .attr("d", linePredicted);
	});

	return <div ref={ref}></div>;
}
