import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function CorrelationHeatmap({ correlationMatrix, variables }) {
	const svgRef = useRef(null);

	useEffect(() => {
		const margin = { top: 30, right: 30, bottom: 60, left: 75 },
			width = 500 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		const colorScale = d3
			.scaleSequential(d3.interpolateRdBu)
			.domain([-1, 1]);

		const svg = d3
			.select(svgRef.current)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const x = d3
			.scaleBand()
			.range([0, width])
			.domain(variables)
			.padding(0.05);

		const y = d3
			.scaleBand()
			.range([0, height])
			.domain(variables)
			.padding(0.05);

		svg.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(x))
			.selectAll("text")
			.attr("font-size", "8px")
            .attr("font-weight", "200")
			.attr("transform", "rotate(-45)")
			.style("text-anchor", "end");

		svg.append("g")
			.call(d3.axisLeft(y))
			.selectAll("text")
			.attr("font-size", "8px")
            .attr("font-weight", "200");

		svg.selectAll()
			.data(
				correlationMatrix.flatMap((row, i) =>
					row.map((val, j) => ({ val, i, j }))
				)
			)
			.enter()
			.append("rect")
			.attr("x", (d) => x(variables[d.j]))
			.attr("y", (d) => y(variables[d.i]))
			.attr("width", x.bandwidth())
			.attr("height", y.bandwidth())
			.style("fill", (d) => colorScale(d.val));

		svg.selectAll()
			.data(
				correlationMatrix.flatMap((row, i) =>
					row.map((val, j) => ({ val, i, j }))
				)
			)
			.enter()
			.append("text")
			.attr("x", (d) => x(variables[d.j]) + x.bandwidth() / 2)
			.attr("y", (d) => y(variables[d.i]) + y.bandwidth() / 2)
			.attr("dy", ".35em")
			.attr("class", "correlation-label")
			.text((d) => d.val.toFixed(2))
			.style("text-anchor", "middle");

        return () => {
            d3.select(svgRef.current).selectAll("*").remove();
        }
	}, [correlationMatrix, variables]);

	return (
		<div>
			<svg ref={svgRef} />
		</div>
	);
}
