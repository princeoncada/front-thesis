import { useEffect, useRef } from "react"
import * as d3 from "d3"

type DataItem = {
  variable1: string;
  variable2: string;
  value: number;
};

export default function HeatMap({ data }: { readonly data: DataItem[] }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) {
			ref.current.innerHTML = "";
		}

        const variables = ["Rainfall", "MaxTemp", "MinTemp", "Humidity", "WindSpeed", "Consumption"];

        const margin = { top: 30, right: 30, bottom: 60, left: 75 },
          width = 500 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;
    
        // Create the SVG canvas
        const svg = d3.select(ref.current).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        // Create x-scale and y-scale
        const x = d3.scaleBand()
          .range([0, width])
          .domain(variables)
          .padding(0.05);
    
        const y = d3.scaleBand()
          .range([0, height])
          .domain(variables)
          .padding(0.05);
    
        // Create a color scale for the correlation values
        const colorScale = d3.scaleSequential(d3.interpolateRdBu)
          .domain([-1, 1]);  // Correlation values range from -1 to 1
    
        // Draw the X and Y axes
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");
    
        svg.append("g")
          .call(d3.axisLeft(y));
    
        // Create the heatmap squares
        svg.selectAll()
          .data(data)
          .enter()
          .append("rect")
          .attr("x", d => x(d.variable1))
          .attr("y", d => y(d.variable2))
          .attr("width", x.bandwidth())
          .attr("height", y.bandwidth())
          .style("fill", d => colorScale(d.value));
    
        // Add labels for correlation values inside each square
        svg.selectAll()
          .data(data)
          .enter()
          .append("text")
          .attr("x", d => x(d.variable1) + x.bandwidth() / 2)
          .attr("y", d => y(d.variable2) + y.bandwidth() / 2)
          .attr("dy", ".35em")
          .attr("class", "correlation-label")
          .text(d => d.value.toFixed(2))
          .style("text-anchor", "middle");
    });

    return <div ref={ref}></div>
}