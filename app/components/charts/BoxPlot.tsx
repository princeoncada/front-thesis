import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BoxPlot({ data }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) {
			ref.current.innerHTML = "";
		}

		const margin = { top: 30, right: 30, bottom: 60, left: 75 },
			width = 500 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		// Create SVG canvas
		const svg = d3
			.select(ref.current)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr(
				"transform",
				"translate(" + margin.left + "," + margin.top + ")"
			);

		// Group the data into rainy season and dry season
		const seasons = ["Rainy Season", "Dry Season"];
		const groupedData = {
			"Rainy Season": data
				.filter((d) => d.isRainySeason === 1)
				.map((d) => d.waterConsumption),
			"Dry Season": data
				.filter((d) => d.isRainySeason === 0)
				.map((d) => d.waterConsumption),
		};

		// Calculate summary statistics (quartiles, median, IQR, min, max)
		function calculateBoxPlotValues(data) {
			const q1 = d3.quantile(data, 0.25);
			const median = d3.quantile(data, 0.5);
			const q3 = d3.quantile(data, 0.75);
			const iqr = q3 - q1;
			const min = Math.max(d3.min(data), q1 - 1.5 * iqr);
			const max = Math.min(d3.max(data), q3 + 1.5 * iqr);
			return { q1, median, q3, min, max };
		}

		// Get box plot values for each season
		const boxValues = seasons.map((season) =>
			calculateBoxPlotValues(groupedData[season])
		);

		// Create x-scale (Rainy Season and Dry Season)
		const x = d3.scaleBand().domain(seasons).range([0, width]).padding(0.5);

		// Create y-scale for water consumption
		const y = d3
			.scaleLinear()
			.domain([
				d3.min(data, (d) => d.waterConsumption) - 50000,
				d3.max(data, (d) => d.waterConsumption) + 50000,
			])
			.range([height, 0]);

		// Add the x-axis
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		// Add the y-axis
		svg.append("g").call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

		// Add X-axis label
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", height + margin.bottom - 10)
			.attr("class", "axis-label")
			.text("Season");

		// Add Y-axis label
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -height / 2)
			.attr("y", -margin.left + 15)
			.attr("class", "axis-label")
			.text("Water Consumption (liters)");

		// Draw the box plot for each season
		svg.selectAll(".box")
			.data(boxValues)
			.enter()
			.append("rect")
			.attr("class", "box")
			.attr("x", (d, i) => x(seasons[i]))
			.attr("y", (d) => y(d.q3))
			.attr("width", x.bandwidth())
			.attr("height", (d) => y(d.q1) - y(d.q3));

		// Draw the median line
		svg.selectAll(".median")
			.data(boxValues)
			.enter()
			.append("line")
			.attr("class", "median")
			.attr("x1", (d, i) => x(seasons[i]))
			.attr("x2", (d, i) => x(seasons[i]) + x.bandwidth())
			.attr("y1", (d) => y(d.median))
			.attr("y2", (d) => y(d.median));

		// Draw the whiskers (min and max lines)
		svg.selectAll(".whisker")
			.data(boxValues)
			.enter()
			.append("line")
			.attr("class", "whisker")
			.attr("x1", (d, i) => x(seasons[i]) + x.bandwidth() / 2)
			.attr("x2", (d, i) => x(seasons[i]) + x.bandwidth() / 2)
			.attr("y1", (d) => y(d.min))
			.attr("y2", (d) => y(d.max));

		// Draw the min and max caps
		svg.selectAll(".whisker-cap")
			.data(boxValues)
			.enter()
			.append("line")
			.attr("class", "whisker")
			.attr("x1", (d, i) => x(seasons[i]) + x.bandwidth() / 4)
			.attr("x2", (d, i) => x(seasons[i]) + (3 * x.bandwidth()) / 4)
			.attr("y1", (d) => y(d.min))
			.attr("y2", (d) => y(d.min));

		svg.selectAll(".whisker-cap")
			.data(boxValues)
			.enter()
			.append("line")
			.attr("class", "whisker")
			.attr("x1", (d, i) => x(seasons[i]) + x.bandwidth() / 4)
			.attr("x2", (d, i) => x(seasons[i]) + (3 * x.bandwidth()) / 4)
			.attr("y1", (d) => y(d.max))
			.attr("y2", (d) => y(d.max));

        // Cleanup on component unmount
        return () => {
            d3.select(ref.current).selectAll("*").remove();
        }
	});
	return (
		<div>
			<svg ref={ref}></svg>
		</div>
	);
}
