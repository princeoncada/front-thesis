import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function LinePlot({ data }: { data: any[] }) {
	const svgRef = useRef<HTMLDivElement>(null);
	const [chartData, setChartData] = useState<any[]>([]);

	useEffect(() => {
		const formattedData = data.map((d) => ({
			date: d.date,
			waterConsumption: d.waterConsumption,
			estimatedPopulation: d.estimatedPopulation,
		}));

		setChartData(formattedData);
	}, [data]);

	useEffect(() => {
		if (chartData.length === 0) return;

		const margin = { top: 30, right: 75, bottom: 60, left: 75 },
			width = 500 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		const svg = d3
			.select(svgRef.current)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const xScale = d3.scaleTime().range([0, width]);
		const yScaleLeft = d3.scaleLinear().range([height, 0]);
		const yScaleRight = d3.scaleLinear().range([height, 0]);

		xScale.domain(d3.extent(chartData, (d) => d.date));
		yScaleLeft.domain([
			4000000,
			d3.max(chartData, (d) => d.waterConsumption),
		]);
		yScaleRight.domain([
			0,
			d3.max(chartData, (d) => d.estimatedPopulation),
		]);

		svg.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(xScale));

		svg.append("g")
			.call(d3.axisLeft(yScaleLeft).ticks(6).tickFormat(d3.format(".2s")))
			.append("text")
			.attr("y", -20)
			.attr("x", -30)
			.attr("text-anchor", "start")
			.text("Water Consumption");

		svg.append("g")
			.attr("transform", `translate(${width},0)`)
			.call(
				d3.axisRight(yScaleRight).ticks(8).tickFormat(d3.format(".2s"))
			)
			.append("text")
			.attr("y", 20)
			.attr("x", 30)
			.attr("text-anchor", "end")
			.text("Estimated Population");

		const lineWaterConsumption = d3
			.line()
			.x((d) => xScale(d.date))
			.y((d) => yScaleLeft(d.waterConsumption));

		const lineEstimatedPopulation = d3
			.line()
			.x((d) => xScale(d.date))
			.y((d) => yScaleRight(d.estimatedPopulation));

		svg.append("path")
			.datum(chartData)
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-width", 1.5)
			.attr("d", lineWaterConsumption);

		svg.append("path")
			.datum(chartData)
			.attr("fill", "none")
			.attr("stroke", "orange")
			.attr("stroke-width", 1.5)
			.attr("d", lineEstimatedPopulation);

		// Y-axis label
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -height / 2)
			.attr("y", -margin.left + 15)
			.attr("text-anchor", "middle")
			.attr("class", "axis-label")
			.text("Water Consumption (Liters)");

		// Y-axis label
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -height / 2)
			.attr("y", margin.right + 330)
			.attr("text-anchor", "middle")
			.attr("class", "axis-label")
			.text("Population");

		// X-axis label
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", height + margin.bottom - 15)
			.attr("text-anchor", "middle")
			.attr("class", "axis-label")
			.text("Date");

		// Cleanup on unmount
		return () => {
			d3.select(svgRef.current).selectAll("*").remove();
		};
	}, [chartData]);

	return (
		<div>
			<svg ref={svgRef}></svg>
		</div>
	);
}
