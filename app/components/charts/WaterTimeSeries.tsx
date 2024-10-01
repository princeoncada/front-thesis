import { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function WaterTimeSeries({ data }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const margin = { top: 30, right: 30, bottom: 60, left: 75 },
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // set up scales
    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    // line generator
    const line = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.waterConsumption));

    //SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // domains
    xScale.domain(d3.extent(data, (d) => d.date));
    yScale.domain([5000000, d3.max(data, (d) => d.waterConsumption)]);

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Y Axis
    svg.append("g")
      .call(d3.axisLeft(yScale).tickFormat(d3.format(".2s")));

    // X-axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 15)
      .attr("text-anchor", "middle")
      .attr("class", "axis-label")
      .text("Date");

    // Y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .attr("class", "axis-label")
      .text("Water Consumption (Liters)");

    // line path
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

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
