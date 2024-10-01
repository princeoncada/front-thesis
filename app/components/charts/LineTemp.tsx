import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function LineTemp({ data }) {
  const svgRef = useRef(null);

  useEffect(() => {
    // Set dimensions and margins for the SVG canvas
    const margin = { top: 30, right: 30, bottom: 60, left: 75 };
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Select the SVG element or append if necessary
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up the X scale for dates
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, (d) => d.date)) // Input domain based on date range
      .range([0, width]); // Output range within chart width

    // Set up the Y scale for temperature
    const yScale = d3.scaleLinear()
      .domain([
        d3.min(data, (d) => d.tMin) - 2,  // Ensure some padding below minimum
        d3.max(data, (d) => d.tMax) + 2   // Padding above maximum
      ])
      .range([height, 0]);

    // Define the line generator for max temperature
    const maxTempLine = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.tMax));

    // Define the line generator for min temperature
    const minTempLine = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.tMin));

    // Append X-axis
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(5));

    // Append Y-axis
    svg.append("g")
      .call(d3.axisLeft(yScale));

    // Draw the max temperature line
    svg.append("path")
      .datum(data) // Bind data
      .attr("class", "line-max")
      .attr("d", maxTempLine) // Use maxTempLine generator
      .attr("stroke", "steelblue")
      .attr("fill", "none")
      .attr("stroke-width", 2);

    // Draw the min temperature line
    svg.append("path")
      .datum(data) // Bind data
      .attr("class", "line-min")
      .attr("d", minTempLine) // Use minTempLine generator
      .attr("stroke", "orange")
      .attr("fill", "none")
      .attr("stroke-width", 2);

    // Add labels for X-axis and Y-axis
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 15)
      .attr("class", "axis-label")
      .text("Date");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("class", "axis-label")
      .text("Temperature (°C)");

    // Add a legend to explain the lines
    svg.append("circle")
      .attr("cx", width - 80)
      .attr("cy", 10)
      .attr("r", 6)
      .style("fill", "steelblue");
    svg.append("text")
      .attr("x", width - 70)
      .attr("y", 15)
      .text("Max Temp")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");

    svg.append("circle")
      .attr("cx", width - 80)
      .attr("cy", 30)
      .attr("r", 6)
      .style("fill", "orange");
    svg.append("text")
      .attr("x", width - 70)
      .attr("y", 35)
      .text("Min Temp")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");

    // Cleanup the SVG when the component unmounts
    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, [data]); // Run the effect when 'data' changes

  // Return the SVG container
  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
}
