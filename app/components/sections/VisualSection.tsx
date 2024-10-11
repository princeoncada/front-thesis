import { useEffect, useState } from "react";
import * as d3 from "d3";
import * as ss from "simple-statistics";

import WaterTimeSeries from "../charts/WaterTimeSeries";
import Histogram from "../charts/Histogram";
import CorrelationHeatmap from "../charts/CorrelationHeatmap";

import LinePlot from "../charts/LinePlot";
import ScatterPlot from "../charts/ScatterPlot";
import BoxPlot from "../charts/BoxPlot";
import SeasonalPlot from "../charts/SeasonalDecomposition";
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

export default function VisualSection({ view, currentView }: { readonly view: string }) {
	const [fetchedData, setFetchedData] = useState<any[]>([]);

	const [startDate, setStartDate] = useState<Date>(new Date());
	const [endDate, setEndDate] = useState<Date>(new Date());

	const [correlationMatrix, setCorrelationMatrix] = useState([]);
	const [filteredData, setfilteredData] = useState([]);
	const data = filteredData ?? fetchedData;

	useEffect(() => {
		if (fetchedData.length) {
			const minDate = d3.min(fetchedData, (d) => d.date);
			const maxDate = d3.max(fetchedData, (d) => d.date);
			setStartDate(minDate);
			setEndDate(maxDate);
		}
	}, [fetchedData.length]);

	useEffect(() => {
		const filtered = fetchedData.filter(
			(item) => item.date >= startDate && item.date <= endDate
		);
		setfilteredData(filtered);
	}, [startDate, endDate]);

	useEffect(() => {
		const fetchData = () => {
			d3.csv("/data.csv", formatingData).then((csvData) => {
				setFetchedData(csvData);

				const matrix = calculateCorrelationMatrix(csvData, variables);
				setCorrelationMatrix(matrix);
			});
		};

		fetchData();
	}, [startDate, endDate]);

	return (
		<div
        className={`${
            currentView === view ? "flex" : "hidden"
        } flex-row h-full w-full gap-4`}
		>
			{/* Date Selector Column */}
			<div className="min-w-[250px] bg-white p-4 rounded-lg shadow-md h-full">
				<div className="flex flex-col gap-4 sticky top-[2.33rem]">
					{/* Title */}
					<div className="text-lg font-semibold text-gray-800">
						Select a Date
					</div>

					{/* Date Input Container */}
					<div className="flex flex-col gap-4">
						{/* Start Date Input */}
						<div className="flex flex-col gap-1">
							<label
								htmlFor="start-date"
								className="text-gray-600 font-medium"
							>
								Start Date:
							</label>
							<input
								type="date"
								name="start-date"
								id="start-date"
								className="p-2 rounded-lg text-gray-900 border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-0 bg-gray-50"
								value={startDate.toISOString().split("T")[0]}
								onChange={(e) => {
									setStartDate(new Date(e.target.value));
								}}
								min={
									fetchedData.length
										? fetchedData[0].date
												.toISOString()
												.split("T")[0]
										: ""
								}
								max={
									fetchedData.length
										? fetchedData[
												fetchedData.length - 1
										  ].date
												.toISOString()
												.split("T")[0]
										: ""
								}
								required
							/>
						</div>

						{/* End Date Input */}
						<div className="flex flex-col gap-1">
							<label
								htmlFor="end-date"
								className="text-gray-600 font-medium"
							>
								End Date:
							</label>
							<input
								type="date"
								name="end-date"
								id="end-date"
								className="p-2 rounded-lg text-gray-900 border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-0 bg-gray-50"
								value={endDate.toISOString().split("T")[0]}
								onChange={(e) => {
									setEndDate(new Date(e.target.value));
								}}
								min={
									fetchedData.length
										? fetchedData[0].date
												.toISOString()
												.split("T")[0]
										: ""
								}
								max={
									fetchedData.length
										? fetchedData[
												fetchedData.length - 1
										  ].date
												.toISOString()
												.split("T")[0]
										: ""
								}
								required
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="border-r-2"></div>

			{/* Chart Section */}
			<div className="flex flex-col gap-4 flex-1">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900">
						Water Consumption & Climate Trends: Interactive Data
						Visualization
					</h1>
					<p className="text-lg text-gray-600">
						Explore key patterns and correlations between water
						usage and climate factors through dynamic charts.
					</p>
				</div>

				<div className="flex flex-col gap-10">
					{/* Row 1 - Time Series and Histogram */}
					<div className="flex flex-row gap-4 justify-between">
						<div className="flex flex-col gap-3">
							<div className="bg-white p-4 rounded-lg shadow-lg flex-1 flex flex-col gap-4">
								<h3 className="text-lg font-medium text-gray-700 mb-2 text-center">
									Water Consumption Over Time
								</h3>
								{data.length > 0 && (
									<WaterTimeSeries data={data} />
								)}
								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800">
										Description:
									</h4>
									<p className="text-gray-600">
										This line chart illustrates how water
										consumption has changed over time. The
										X-axis represents the date, and the
										Y-axis shows water consumption in
										liters.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Usage:
									</h4>
									<p className="text-gray-600">
										Use this chart to observe long-term
										trends in water consumption, detect
										seasonal fluctuations, and identify
										anomalies like sudden spikes or drops.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Insights:
									</h4>
									<p className="text-gray-600">
										The chart provides insights into how
										water consumption varies over time,
										making it useful for forecasting future
										demand and managing water resources
										efficiently. Seasonal variations or
										anomalies (e.g., droughts) can be easily
										identified.
									</p>
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-3">
							<div className="bg-white p-4 rounded-lg shadow-lg flex-1 flex flex-col gap-4">
								<h3 className="text-lg font-medium text-gray-700 mb-2 text-center">
									Water Consumption Frequency Distribution
								</h3>
								{data.length > 0 && <Histogram data={data} />}							
								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800">
										Description:
									</h4>
									<p className="text-gray-600">
										This histogram shows the distribution of
										water consumption levels. The X-axis
										represents consumption amounts, and the
										Y-axis shows the frequency of
										occurrences.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Usage:
									</h4>
									<p className="text-gray-600">
										Useful to understand the most common
										ranges of water consumption and detect
										any outliers or abnormal consumption
										patterns.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Insights:
									</h4>
									<p className="text-gray-600">
										Peaks indicate the most frequent
										consumption levels, while spread and
										gaps could hint at variations in usage
										due to external factors like population
										growth or weather events.
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-row gap-4 justify-between">
						<div className="flex flex-col gap-3">
							<div className="bg-white p-4 rounded-lg shadow-lg flex-1 flex flex-col gap-4">
								<h3 className="text-lg font-medium text-gray-700 mb-2 text-center">
									Water Consumption by Season
								</h3>
								{data.length > 0 && <BoxPlot data={data} />}							
								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800">
										Description:
									</h4>
									<p className="text-gray-600">
										This box plot compares water consumption
										across different seasons (Rainy vs.
										Dry). The plot shows the median,
										quartiles, and outliers for each season.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Usage:
									</h4>
									<p className="text-gray-600">
										Best used to detect seasonal patterns in
										water consumption, comparing typical
										consumption during rainy and dry
										seasons.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Insights:
									</h4>
									<p className="text-gray-600">
										A higher median or wider range of
										consumption during one season may
										indicate weather-related usage changes
										or other seasonal factors affecting
										consumption.
									</p>
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-3">
							<div className="bg-white p-4 rounded-lg shadow-lg flex-1 flex flex-col gap-4">
								<h3 className="text-lg font-medium text-gray-700 mb-2 text-center">
									Correlation Between Consumption and Climate
									Factors
								</h3>
								{data.length > 0 && (
									<CorrelationHeatmap
										correlationMatrix={correlationMatrix}
										variables={variables}
									/>
								)}							
								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800">
										Description:
									</h4>
									<p className="text-gray-600">
										This correlation heatmap shows the
										relationship between various climate
										variables (e.g., rainfall, temperature,
										humidity) and water consumption.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Usage:
									</h4>
									<p className="text-gray-600">
										Use this chart to identify which factors
										(e.g., temperature or rainfall) have the
										highest influence on water consumption.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Insights:
									</h4>
									<p className="text-gray-600">
										Strong positive or negative correlations
										will help identify which variables have
										the most significant impact on water
										usage.
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-row gap-4 justify-between">
						<div className="flex flex-col gap-3">
							<div className="bg-white p-4 rounded-lg shadow-lg flex-1 flex flex-col gap-4">
								<h3 className="text-lg font-medium text-gray-700 mb-2 text-center">
									Temperature vs. Water Consumption
								</h3>
								{data.length > 0 && <ScatterPlot data={data} />}							
								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800">
										Description:
									</h4>
									<p className="text-gray-600">
										This scatter plot shows the relationship
										between temperature (X-axis) and water
										consumption (Y-axis), with each point
										representing a day's data.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Usage:
									</h4>
									<p className="text-gray-600">
										This plot is useful for spotting whether
										higher or lower temperatures lead to
										changes in water consumption.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Insights:
									</h4>
									<p className="text-gray-600">
										Clusters or patterns can reveal whether
										extreme temperatures (e.g., heatwaves)
										have a significant impact on water
										usage, which is crucial for preparing
										for peak demand periods.
									</p>
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-3">
							<div className="bg-white p-4 rounded-lg shadow-lg flex-1 flex flex-col gap-4">
								<h3 className="text-lg font-medium text-gray-700 mb-2 text-center">
									Water Consumption and Population Growth
								</h3>
								{data.length > 0 && <LinePlot data={data} />}							
								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800">
										Description:
									</h4>
									<p className="text-gray-600">
										This dual-axis line chart shows water
										consumption (Y-axis on the left) and
										estimated population (Y-axis on the
										right) over time (X-axis).
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Usage:
									</h4>
									<p className="text-gray-600">
										Useful for visualizing how water
										consumption tracks population growth,
										highlighting periods of rapid
										consumption or population increases.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Insights:
									</h4>
									<p className="text-gray-600">
										A widening gap between population growth
										and water consumption could signal
										inefficiencies or the need for future
										capacity planning.
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-row gap-4 justify-between">
						<div className="flex flex-col gap-3">
							<div className="bg-white p-4 rounded-lg shadow-lg flex-1 flex flex-col gap-4">
								<h3 className="text-lg font-medium text-gray-700 mb-2 text-center">
									Average Water Consumption by Season
								</h3>
								{data.length > 0 && (
									<BarChartSeasonAvg data={data} />
								)}							
								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800">
										Description:
									</h4>
									<p className="text-gray-600">
										This bar chart compares the average
										water consumption during rainy and dry
										seasons.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Usage:
									</h4>
									<p className="text-gray-600">
										Use this chart to get a quick comparison
										of how much more or less water is used
										in different seasons.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Insights:
									</h4>
									<p className="text-gray-600">
										Significant differences in consumption
										across seasons can guide water-saving
										strategies during periods of expected
										higher usage.
									</p>
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-3">
							<div className="bg-white p-4 rounded-lg shadow-lg flex-1 flex flex-col gap-4">
								<h3 className="text-lg font-medium text-gray-700 mb-2 text-center">
									Seasonal Decomposition of Water Consumption
								</h3>
								{data.length > 0 && (
									<SeasonalPlot data={data} view={1} />
								)}							
								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800">
										Description:
									</h4>
									<p className="text-gray-600">
										This chart breaks down water consumption
										into its seasonal components, helping
										identify seasonal trends, cyclical
										patterns, and irregularities over time.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Usage:
									</h4>
									<p className="text-gray-600">
										Useful for identifying regular patterns
										in water consumption due to seasonal
										influences.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Insights:
									</h4>
									<p className="text-gray-600">
										Regular seasonal spikes could help in
										forecasting future consumption and
										planning for high-demand periods.
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-row gap-4 justify-between">
						<div className="flex flex-col gap-3">
							<div className="bg-white p-4 rounded-lg shadow-lg flex-1 flex flex-col gap-4">
								<h3 className="text-lg font-medium text-gray-700 mb-2 text-center">
									Rainfall vs. Water Consumption
								</h3>
								{data.length > 0 && (
									<ScatterWcVsRf data={data} />
								)}							
								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800">
										Description:
									</h4>
									<p className="text-gray-600">
										This scatter plot illustrates the
										relationship between daily rainfall
										(X-axis) and water consumption (Y-axis).
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Usage:
									</h4>
									<p className="text-gray-600">
										Best used to explore if increases in
										rainfall are associated with increased
										or decreased water consumption.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Insights:
									</h4>
									<p className="text-gray-600">
										Observing clusters or outliers helps in
										identifying any significant patterns
										between rainfall and water usage.
									</p>
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-3">
							<div className="bg-white p-4 rounded-lg shadow-lg flex-1 flex flex-col gap-4">
								<h3 className="text-lg font-medium text-gray-700 mb-2 text-center">
									Temperature Trends Over Time
								</h3>
								{data.length > 0 && <LineTemp data={data} />}							
								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800">
										Description:
									</h4>
									<p className="text-gray-600">
										This line chart tracks maximum and
										minimum temperatures over time. The blue
										line represents maximum temperature, and
										the orange line represents minimum
										temperature.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Usage:
									</h4>
									<p className="text-gray-600">
										This chart is useful for identifying
										long-term temperature trends and extreme
										weather conditions that may influence
										water consumption.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Insights:
									</h4>
									<p className="text-gray-600">
										Temperature spikes may be correlated
										with increased water demand during
										heatwaves.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* <div className="flex flex-row gap-4 justify-between">
						<div className="flex flex-col gap-3">
							<div className="bg-white p-4 rounded-lg shadow-lg flex-1 flex flex-col gap-4">
								<h3 className="text-lg font-medium text-gray-700 mb-2 text-center">
									Rainfall and Water Consumption Over Time
								</h3>
								{data.length > 0 && <LineComp data={data} />}							
								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800">
										Description:
									</h4>
									<p className="text-gray-600">
										This chart compares rainfall (orange
										line) and water consumption (blue line)
										over time.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Usage:
									</h4>
									<p className="text-gray-600">
										Use this chart to observe how rainfall
										impacts water consumption, identifying
										periods where consumption rises or falls
										in relation to rain.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Insights:
									</h4>
									<p className="text-gray-600">
										Sharp increases or decreases in water
										consumption following rain can guide
										predictions for water demand during wet
										or dry periods.
									</p>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-3">
							<div className="bg-white p-4 rounded-lg shadow-lg flex-1 flex flex-col gap-4">
								<h3 className="text-lg font-medium text-gray-700 mb-2 text-center">
									Rainfall and Water Consumption Over Time
								</h3>
								{data.length > 0 && <LineComp data={data} />}							
								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800">
										Description:
									</h4>
									<p className="text-gray-600">
										This chart compares rainfall (orange
										line) and water consumption (blue line)
										over time.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Usage:
									</h4>
									<p className="text-gray-600">
										Use this chart to observe how rainfall
										impacts water consumption, identifying
										periods where consumption rises or falls
										in relation to rain.
									</p>
								</div>

								<div className="flex flex-col gap-1">
									<h4 className="text-md font-semibold text-gray-800 mt-2">
										Insights:
									</h4>
									<p className="text-gray-600">
										Sharp increases or decreases in water
										consumption following rain can guide
										predictions for water demand during wet
										or dry periods.
									</p>
								</div>
							</div>
						</div>
					</div> */}
				</div>
				<div className="mt-12 bg-gray-100 p-6 rounded-lg">
					<h2 className="text-2xl font-semibold text-gray-900">
						Summary of Insights
					</h2>
					<p className="mt-2 text-gray-600">
						These visualizations provide detailed insights into the
						patterns of water consumption over time and its
						relationship with various climate factors. By analyzing
						water usage across seasons, temperature variations, and
						rainfall levels, these charts help uncover key trends
						that are vital for managing water demand and planning
						for future needs.
					</p>
					<p className="mt-2 text-gray-600">
						Correlation heatmaps highlight the impact of weather
						conditions like rainfall and temperature on water
						consumption, offering forecasting capabilities for
						periods of higher or lower demand. Other charts, such as
						scatter plots and box plots, are useful for identifying
						anomalies or outliers that can inform resource
						management and improve forecasting strategies.
					</p>
					<p className="mt-2 text-gray-600">
						Leveraging these insights can help stakeholders optimize
						water resource allocation, implement more effective
						water-saving strategies during peak seasons, and develop
						long-term plans for sustainable water usage.
					</p>
				</div>
			</div>
		</div>
	);
}
