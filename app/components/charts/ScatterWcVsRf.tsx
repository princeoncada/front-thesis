import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function ScatterPlotRainfallVsWC({ data }) {
  const svgRef = useRef(null);

  useEffect(() => {
    // Set dimensions and margins for the SVG canvas
    const margin = { top: 30, right: 30, bottom: 60, left: 75 },
            width = 500 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

    // Create or select the SVG canvas
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale for rainfall
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.rainfall)])  // Set domain based on max rainfall
      .range([0, width]);

    // Y scale for water consumption
    const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.waterConsumption) - 50000, d3.max(data, d => d.waterConsumption)])
      .range([height, 0]);

    // Add X-axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add Y-axis
    svg.append("g")
      .call(d3.axisLeft(y).tickFormat(d => (d / 1000000).toFixed(2) + "M"));

    // X-axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 15)
      .attr("class", "axis-label")
      .text("Rainfall (mm)");

    // Y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("class", "axis-label")
      .text("Water Consumption (Liters)");

    // Add dots for scatter plot
    svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.rainfall))
      .attr("cy", d => y(d.waterConsumption))
      .attr("r", 2)
      .attr("fill", "steelblue")

    // Cleanup function to remove existing SVG elements when component re-renders
    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  return <div>
    <svg ref={svgRef}></svg>
  </div>;
}
