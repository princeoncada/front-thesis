import { useRef, useEffect, use } from "react";
import * as d3 from "d3";

const modelMetrics = {
	metrics: {
		xgboost: {
			MSE: 0.3348102863533037,
			RMSE: 0.5786279343008801,
			MAE: 0.4691359737594926,
			MAPE: 7.295494060158995e-6,
		},
		ensemble: {
			MSE: 186123.50115543837,
			RMSE: 431.42033002101135,
			MAE: 103.90517292475874,
			MAPE: 0.0016533319376943,
		},
		sarimax: {
			MSE: 8941668499.551926,
			RMSE: 94560.39604164063,
			MAE: 6885.250964041836,
			MAPE: 0.1086279975106831,
		},
		prophet: {
			MSE: 8851880617.246557,
			RMSE: 94084.43344808192,
			MAE: 69266.44157526104,
			MAPE: 1.0516206320430113,
		},
		lstm: {
			MSE: 12255698466.56163,
			RMSE: 110705.45816065995,
			MAE: 85271.15687111358,
			MAPE: 1.3108283282323263,
		},
	},
	minmax: {
		MSE: {
			minimum: 0.3348102863533037,
			maximum: 12255698466.56163,
		},
		RMSE: {
			minimum: 0.5786279343008801,
			maximum: 110705.45816065995,
		},
		MAE: {
			minimum: 0.4691359737594926,
			maximum: 85271.15687111358,
		},
		MAPE: {
			minimum: 7.295494060158995e-6,
			maximum: 1.3108283282323263,
		},
	},
};

let selectedModel = "xgboost";

export default function MetricsChart({ selectedModel }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) {
			ref.current.innerHTML = "";
		}

		const margin = { top: 40, right: 40, bottom: 50, left: 60 },
			width = 600 - margin.left - margin.right,
			height = 700 - margin.top - margin.bottom;

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
			.domain(Object.keys(modelMetrics.metrics[selectedModel]))
			.range([0, width])
			.padding(0.2);

		const y = d3
			.scaleLog()
			.domain([
				1e-7,
				d3.max(Object.values(modelMetrics.minmax), (d) => d.maximum),
			]) // Setting the y domain based on max values
			.range([height, 0]);

		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		svg.append("g").call(d3.axisLeft(y).ticks(10, "~s"));

		svg.selectAll(".bound-bar")
			.data(Object.entries(modelMetrics.minmax))
			.enter()
			.append("rect")
			.attr("class", "bound-bar")
			.attr("x", (d) => x(d[0]))
			.attr("y", (d) => y(d[1].maximum)) // Start at the max value
			.attr("width", x.bandwidth())
			.attr("height", (d) => y(d[1].minimum) - y(d[1].maximum)); // Height is the difference between max and min

		// Create bars for the actual metrics
		svg.selectAll(".bar")
			.data(Object.entries(modelMetrics.metrics[selectedModel]))
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", (d) => x(d[0]))
			.attr("y", (d) => y(d[1]))
			.attr("width", x.bandwidth())
			.attr("height", (d) => height - y(d[1]));

		// Add text labels to each bar
		svg.selectAll(".text")
			.data(Object.entries(modelMetrics.metrics[selectedModel]))
			.enter()
			.append("text")
			.attr("class", "text")
			.attr("x", (d) => x(d[0]) + x.bandwidth() / 2)
			.attr("y", (d) => y(d[1]) + 20)
			.text((d) => d3.format(".2s")(d[1]));

		// Add upper and lower bound text
		svg.selectAll(".bound-text-upper")
			.data(Object.entries(modelMetrics.minmax))
			.enter()
			.append("text")
			.attr("class", "text")
			.attr("x", (d) => x(d[0]) + x.bandwidth() / 2)
			.attr("y", (d) => y(d[1].maximum) - 5)
			.text((d) => d3.format(".2s")(d[1].maximum));

		svg.selectAll(".bound-text-lower")
			.data(Object.entries(modelMetrics.minmax))
			.enter()
			.append("text")
			.attr("class", "text")
			.attr("x", (d) => x(d[0]) + x.bandwidth() / 2)
			.attr("y", (d) => y(d[1].minimum) + 20)
			.text((d) => d3.format(".2s")(d[1].minimum));
	});

	return <div ref={ref}></div>;
}