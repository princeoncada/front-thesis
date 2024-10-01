import { useEffect, useState } from "react";
import * as d3 from "d3";
import * as ss from "simple-statistics";

import WaterTimeSeries from "../charts/WaterTimeSeries";
import BoxPlot from "../charts/BoxPlot";
import CorrelationHeatmap from "../charts/CorrelationHeatmap";
import SeasonalDecomposition from "../charts/SeasonalDecomposition";
import ScatterPlot from "../charts/ScatterPlot";
import LinePlot from "../charts/LinePlot";
import BarChartSeasonAvg from "../charts/BarChartSeasonAvg";
import ScatterWcVsRf from "../charts/ScatterWcVsRf";
import LineTemp from "../charts/LineTemp";
import LineComp from "../charts/LineComp";

const variables = [
	"tMax",
	"tMin",
	"rainfall",
	"rh",
	"windSpeed",
	"waterConsumption",
];

function formatingData(d) {
	return {
		date: d3.timeParse("%Y-%m-%d")(d.DATE),
		waterConsumption: +d.WATER_CONSUMPTION,
		rainfall: +d.RAINFALL,
		tMax: +d.TMAX,
		tMin: +d.TMIN,
		avgTemp: (Number(d.TMAX) + Number(d.TMIN)) / 2,
		rh: +d.RH,
		windSpeed: +d.WIND_SPEED,
		windDirection: +d.WIND_DIRECTION,
		estimatedPopulation: +d.ESTIMATED_POPULATION,
		isWeekend: +d.IS_WEEKEND,
		isRainySeason: +d.IS_RAINY_SEASON,
	};
}

function calculateCorrelationMatrix(data, variables) {
	const correlationMatrix = [];
	variables.forEach((var1, i) => {
		correlationMatrix[i] = [];
		variables.forEach((var2, j) => {
			const var1Values = data.map((d) => d[var1]);
			const var2Values = data.map((d) => d[var2]);
			correlationMatrix[i][j] = ss.sampleCorrelation(
				var1Values,
				var2Values
			);
		});
	});
	return correlationMatrix;
}

export default function ReportSection({ currentView, view }) {
	const [fetchedData, setFetchedData] = useState([]);
	const [correlationMatrix, setCorrelationMatrix] = useState([]);

	useEffect(() => {
		const fetchData = () => {
			d3.csv("/data.csv", formatingData).then((csvData) => {
				setFetchedData(csvData);

				const matrix = calculateCorrelationMatrix(csvData, variables);
				setCorrelationMatrix(matrix);
			});
		};

		fetchData();
	}, []);

	const data = [
		{
			key: "TimeSeries",
			question:
				"What is the overall trend in water consumption over the analyzed time period?",
			statistics: {
				avgConsumption: "6,620,236 liters",
				dailyGrowth: "0.01%",
				monthlyGrowth: "0.20%",
				yearlyGrowth: "1.79%",
			},
			charts: [
				{
					key: "TimeSeries",
					chart: <WaterTimeSeries data={fetchedData} />,
				},
			], // Placeholder for a line chart
			explanation:
				"From the statistics, we see that water consumption is growing steadily at a yearly rate of 1.79%. The line chart visually confirms this upward trend with some seasonal fluctuations, aligning with climate variations.",
		},
		{
			key: "Scatter",
			question: "How does rainfall affect water consumption?",
			statistics: {
				avgRainfall: "6.59 mm",
				rainySeasonConsumption: "6,626,935.57 liters",
				drySeasonConsumption: "6,613,753.73 liters",
				rainfallVariance: "216.72%",
			},
			charts: [
				{
					key: "Scatter",
					chart: <ScatterWcVsRf data={fetchedData} />,
				},
				{
					key: "Heatmap",
					chart: (
						<CorrelationHeatmap
							correlationMatrix={correlationMatrix}
							variables={variables}
						/>
					),
				},
			], // Placeholder for scatter plot and heat map
			explanation:
				"There is a weak correlation between rainfall and water consumption (+0.11). This can be seen in the scatter plot and heatmap. While rainy season consumption is slightly higher than dry season, other factors such as temperature or population play a larger role.",
		},
		{
			key: "BarChart",
			question:
				"Is there a significant difference in water consumption during the rainy vs. dry seasons?",
			statistics: {
				rainyConsumption: "6,626,935.57 liters",
				dryConsumption: "6,613,753.73 liters",
			},
			charts: [
				{
					key: "BarChart",
					chart: <BarChartSeasonAvg data={fetchedData} />,
				},
				{
					key: "SeasonalDecomposition",
					chart: (
						<SeasonalDecomposition data={fetchedData} view={1} />
					),
				},
			], // Placeholder for bar chart and trend chart
			explanation:
				"The difference between rainy and dry season water consumption is minimal, with rainy season consumption being slightly higher. The bar chart shows this small variance, while the seasonal trend chart helps us visualize the periodic increase in consumption during the rainy season.",
		},
		{
			key: "Line",
			question:
				"How do changes in temperature influence water consumption over time?",
			statistics: {
				avgMaxTemp: "32.74°C",
				avgMinTemp: "24.99°C",
				tempWaterConsumptionCorrelation: "+0.23",
			},
			charts: [
				{
					key: "Line",
					chart: <LineTemp data={fetchedData} />,
				},
				{
					key: "Scatter",
					chart: <ScatterPlot data={fetchedData} />,
				},
			], // Placeholder for scatter plot and line chart
			explanation:
				"The correlation between temperature and water consumption is moderate (+0.23). This is observed in the scatter plot, where higher water consumption tends to coincide with higher temperatures. The line chart shows how temperature fluctuations affect consumption trends, particularly during hot seasons.",
		},
		{
			key: "Lines",
			question:
				"Has population growth influenced water consumption patterns over time?",
			statistics: {
				avgPopulation: "1,773,415",
				yearlyPopGrowth: "2.02%",
				yearlyWaterGrowth: "1.79%",
			},
			charts: [
				{
					key: "Line",
					chart: <LineComp data={fetchedData} />,
				},
			], // Placeholder for a line chart showing population and water consumption trends
			explanation:
				"Population growth has a strong influence on water consumption. The yearly population growth rate of 2.02% closely mirrors the yearly water consumption growth rate of 1.79%, as seen in the line chart. This indicates a clear relationship between the two variables.",
		},
		{
			key: "BoxPlot",
			question:
				"Are there any notable outliers or anomalies in the data (e.g., sudden spikes in water consumption)?",
			statistics: {
				consumptionVariance: "0.01%",
				rainfallVariance: "216.72%",
				tempVariance: "2.47%",
			},
			charts: [
				{
					key: "BoxPlot",
					chart: <BoxPlot data={fetchedData} />,
				},
				{
					key: "Line",
					chart: <LinePlot data={fetchedData} />,
				},
			], // Placeholder for box plot and line chart showing anomalies
			explanation:
				"The box plot reveals a few notable outliers in water consumption, typically occurring during periods of extreme weather. For instance, sudden spikes in rainfall are often followed by sharp increases in consumption, as shown in the line chart.",
		},
	];

	return (
		<div
			className={`${
				currentView === view ? "flex" : "hidden"
			} flex-col h-full w-full gap-4`}
		>
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900">
					Water Consumption & Climate Insights: Reports
				</h1>
				<p className="text-lg text-gray-600">
					Data-Driven Answers for Key Water Management Questions
				</p>
				<p className="mt-4 text-sm text-gray-500">
					This section provides detailed answers to important
					questions about water consumption and climate factors, using
					both the Statistics and Visualization tabs. Each answer is
					designed to help users at all levels, especially beginners,
					understand how data and visual analysis work together.
				</p>
			</div>

			{/* Questions and Answers */}
			<div className="flex flex-col gap-8">
				{data.map((item) => (
					<div
						key={item.key}
						className="bg-white rounded-lg shadow-lg p-6"
					>
						<h2 className="text-xl font-semibold text-gray-800">
							{item.question}
						</h2>

						{/* Statistics Section */}
						<div className="mt-4">
							<h3 className="text-lg font-medium text-gray-700">
								Key Statistics:
							</h3>
							<ul className="list-disc list-inside text-gray-600 mt-2">
								{Object.keys(item.statistics).map(
									(stat, idx) => (
										<li key={stat + idx}>
											<span className="font-semibold capitalize">
												{stat.replace(
													/([A-Z])/g,
													" $1"
												)}
												:{" "}
											</span>
											{item.statistics[stat]}
										</li>
									)
								)}
							</ul>
						</div>

						{/* Explanation Section */}
						<div className="mt-4">
							<h3 className="text-lg font-medium text-gray-700">
								Explanation:
							</h3>
							<p className="mt-2 text-gray-600">
								{item.explanation}
							</p>
						</div>

						{/* Charts Section */}
						<div className="mt-4">
							<h3 className="text-lg font-medium text-gray-700">
								Visualizations:
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
								{/* Placeholder for charts, which could be actual chart components */}
								{item.charts.map((chart) => (
									<div
										key={chart.key}
										className="bg-gray-100 rounded-md flex text-gray-700 p-4"
									>
										{/* Render chart component here instead of text */}
										{chart.chart}
									</div>
								))}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Conclusion */}
			<div className="mt-12 bg-gray-100 p-6 rounded-lg">
				<h2 className="text-2xl font-semibold text-gray-900">
					Overall Observations
				</h2>
				<p className="mt-2 text-gray-600">
					By examining trends in water consumption over time, several
					insights can be drawn. There is a strong relationship
					between population growth and increased water demand,
					suggesting that urban planning and water resource management
					must account for future population increases.
				</p>
				<p className="mt-2 text-gray-600">
					Seasonal variations, such as the rainy vs. dry season
					comparison, indicate minimal differences in consumption,
					although spikes during extreme weather events could drive up
					demand temporarily. Temperature also shows a moderate
					correlation with consumption, with higher temperatures
					generally leading to higher usage.
				</p>
				<p className="mt-2 text-gray-600">
					Finally, rainfall, while playing a role, is less directly
					impactful on consumption than factors like population or
					temperature, though specific rainfall events can cause
					anomalies in usage patterns. These insights can be used to
					guide resource allocation and demand forecasting in future
					water management planning.
				</p>
			</div>
		</div>
	);
}
