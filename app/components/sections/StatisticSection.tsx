import { useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

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

export default function StatisticSection({ view, currentView }: { readonly view: string }) {
	const [fetchedData, setFetchedData] = useState<any[]>([]);

	const [startDate, setStartDate] = useState<Date>(new Date());
	const [endDate, setEndDate] = useState<Date>(new Date());

	const [filteredData, setfilteredData] = useState({
		rainfall: {
			average: 6.2722554144884235,
			max: 172.3,
			min: 0.0,
			variance: 195.44249470295213,
		},
		tmax: {
			average: 32.589387602688575,
			max: 36.9,
			min: 24.0,
			variance: 2.514610046824718,
		},
		tmin: {
			average: 24.915322379885488,
			max: 28.0,
			min: 20.8,
			variance: 0.8215278314627519,
		},
		rh: {
			average: 78.12372417226786,
			max: 96.0,
			min: 56.0,
			variance: 29.21406646029997,
		},
		wind_speed: {
			average: 2.0428180234005477,
			max: 6,
			min: 0,
			variance: 0.42346496513324344,
		},
		wind_direction: {
			average: 204.6773711725168,
			max: 360,
			min: 0,
			variance: 15665.418793087547,
		},
		consumption: {
			average: 6469461.744585511,
			max: 7862051.000000007,
			min: 5446657.0,
			daily_growth: 0.006888578289108081,
			monthly_growth: 0.23738219537372532,
			yearly_growth: 2.2120113052315693,
		},
		population: {
			average: 1768000.1391336813,
			max: 1989579.31726026,
			min: 1557435.0,
			daily_growth: 0.006097869877774056,
			monthly_growth: 0.18574989421484936,
			yearly_growth: 2.2585407179072714,
		},
		avg_wc_weekday: 6469261.48922525,
		avg_wc_weekend: 6470662.927870144,
		avg_wc_rainy: 6499237.87809376,
		avg_wc_dry: 6441202.590222515,
		avg_tmax_rainy: 32.283589886596026,
		avg_tmin_rainy: 24.770454545454548,
		avg_tmax_dry: 32.87960610471528,
		avg_tmin_dry: 25.05280975695823,
	});
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
		axios
			.post("http://127.0.0.1:8000/statistics", {
				start_date: startDate.toISOString().split("T")[0],
				end_date: endDate.toISOString().split("T")[0],
			})
			.then((response) => {
				setfilteredData(JSON.parse(response.data));
			})
			.catch((error) => {
				console.log(error);
			});
	}, [startDate, endDate]);

	useEffect(() => {
		const fetchData = () => {
			d3.csv("/data.csv", formatingData).then((csvData) => {
				setFetchedData(csvData);
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

			<div className="border-r-2"></div>
            
			<div className="flex flex-col gap-4 flex-1">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900">
						Historical Water Consumption & Climate Statistics
					</h1>
					<p className="text-lg text-gray-600">
						Key insights on water consumption and climate factors
						over time.
					</p>
				</div>

				{/* Statistics Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{/* Rainfall */}
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h3 className="text-xl font-semibold text-gray-800">
							Rainfall
						</h3>
						<ul className="mt-2 text-gray-600">
							<li>
								<strong>Average:</strong>{" "}
								{filteredData.rainfall.average.toFixed(2)} mm
							</li>
							<li>
								<strong>Min:</strong>{" "}
								{filteredData.rainfall.min.toFixed(2)} mm
							</li>
							<li>
								<strong>Max:</strong>{" "}
								{filteredData.rainfall.max.toFixed(2)} mm
							</li>
							<li>
								<strong>Variance:</strong>{" "}
								{filteredData.rainfall.variance.toFixed(2)}%
							</li>
						</ul>
					</div>

					{/* Maximum Temperature */}
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h3 className="text-xl font-semibold text-gray-800">
							Maximum Temperature
						</h3>
						<ul className="mt-2 text-gray-600">
							<li>
								<strong>Average:</strong>{" "}
								{filteredData.tmax.average.toFixed(2)} °C
							</li>
							<li>
								<strong>Min:</strong>{" "}
								{filteredData.tmax.min.toFixed(2)} °C
							</li>
							<li>
								<strong>Max:</strong>{" "}
								{filteredData.tmax.max.toFixed(2)} °C
							</li>
							<li>
								<strong>Variance:</strong>{" "}
								{filteredData.tmax.variance.toFixed(2)}%
							</li>
						</ul>
					</div>

					{/* Minimum Temperature */}
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h3 className="text-xl font-semibold text-gray-800">
							Minimum Temperature
						</h3>
						<ul className="mt-2 text-gray-600">
							<li>
								<strong>Average:</strong>{" "}
								{filteredData.tmin.average.toFixed(2)} °C
							</li>
							<li>
								<strong>Min:</strong>{" "}
								{filteredData.tmin.min.toFixed(2)} °C
							</li>
							<li>
								<strong>Max:</strong>{" "}
								{filteredData.tmin.max.toFixed(2)} °C
							</li>
							<li>
								<strong>Variance:</strong>{" "}
								{filteredData.tmin.variance.toFixed(2)}%
							</li>
						</ul>
					</div>

					{/* Humidity */}
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h3 className="text-xl font-semibold text-gray-800">
							Relative Humidity
						</h3>
						<ul className="mt-2 text-gray-600">
							<li>
								<strong>Average:</strong>{" "}
								{filteredData.rh.average.toFixed(2)}%
							</li>
							<li>
								<strong>Min:</strong>{" "}
								{filteredData.rh.min.toFixed(2)}%
							</li>
							<li>
								<strong>Max:</strong>{" "}
								{filteredData.rh.max.toFixed(2)}%
							</li>
							<li>
								<strong>Variance:</strong>{" "}
								{filteredData.rh.variance.toFixed(2)}%
							</li>
						</ul>
					</div>

					{/* Wind Direction */}
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h3 className="text-xl font-semibold text-gray-800">
							Wind Direction
						</h3>
						<ul className="mt-2 text-gray-600">
							<li>
								<strong>Average:</strong>{" "}
								{filteredData.wind_direction.average.toFixed(2)}
								°
							</li>
							<li>
								<strong>Min:</strong>{" "}
								{filteredData.wind_direction.min.toFixed(2)}°
							</li>
							<li>
								<strong>Max:</strong>{" "}
								{filteredData.wind_direction.max.toFixed(2)}°
							</li>
							<li>
								<strong>Variance:</strong>{" "}
								{filteredData.wind_direction.variance.toFixed(
									2
								)}
							</li>
						</ul>
					</div>

					{/* Wind Speed */}
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h3 className="text-xl font-semibold text-gray-800">
							Wind Speed
						</h3>
						<ul className="mt-2 text-gray-600">
							<li>
								<strong>Average:</strong>{" "}
								{filteredData.wind_speed.average.toFixed(2)} m/s
							</li>
							<li>
								<strong>Min:</strong>{" "}
								{filteredData.wind_speed.min.toFixed(2)} m/s
							</li>
							<li>
								<strong>Max:</strong>{" "}
								{filteredData.wind_speed.max.toFixed(2)} m/s
							</li>
							<li>
								<strong>Variance:</strong>{" "}
								{filteredData.wind_speed.variance.toFixed(2)}
							</li>
						</ul>
					</div>

					{/* Water Consumption */}
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h3 className="text-xl font-semibold text-gray-800">
							Water Consumption
						</h3>
						<ul className="mt-2 text-gray-600">
							<li>
								<strong>Average:</strong>{" "}
								{filteredData.consumption.average.toFixed(2)}{" "}
								liters
							</li>
							<li>
								<strong>Min:</strong>{" "}
								{filteredData.consumption.min.toFixed(2)} liters
							</li>
							<li>
								<strong>Max:</strong>{" "}
								{filteredData.consumption.max.toFixed(2)} liters
							</li>
							<li>
								<strong>Daily Growth:</strong>{" "}
								{filteredData.consumption.daily_growth.toFixed(
									3
								)}
								%
							</li>
							<li>
								<strong>Monthly Growth:</strong>{" "}
								{filteredData.consumption.monthly_growth.toFixed(
									3
								)}
								%
							</li>
							<li>
								<strong>Yearly Growth:</strong>{" "}
								{filteredData.consumption.yearly_growth.toFixed(
									3
								)}
								%
							</li>
						</ul>
					</div>

					{/* Population */}
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h3 className="text-xl font-semibold text-gray-800">
							Estimated Population
						</h3>
						<ul className="mt-2 text-gray-600">
							<li>
								<strong>Average:</strong>{" "}
								{filteredData.population.average.toFixed(2)}
							</li>
							<li>
								<strong>Min:</strong>{" "}
								{filteredData.population.min.toFixed(2)}
							</li>
							<li>
								<strong>Max:</strong>{" "}
								{filteredData.population.max.toFixed(2)}
							</li>
							<li>
								<strong>Daily Growth:</strong>{" "}
								{filteredData.population.daily_growth.toFixed(
									3
								)}
								%
							</li>
							<li>
								<strong>Monthly Growth:</strong>{" "}
								{filteredData.population.monthly_growth.toFixed(
									3
								)}
								%
							</li>
							<li>
								<strong>Yearly Growth:</strong>{" "}
								{filteredData.population.yearly_growth.toFixed(
									3
								)}
								%
							</li>
						</ul>
					</div>

					{/* Weekday vs Weekend Consumption */}
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h3 className="text-xl font-semibold text-gray-800">
							Average Weekday vs Weekend Consumption
						</h3>
						<ul className="mt-2 text-gray-600">
							<li>
								<strong>Weekday:</strong>{" "}
								{filteredData.avg_wc_weekday.toFixed(2)} liters
							</li>
							<li>
								<strong>Weekend:</strong>{" "}
								{filteredData.avg_wc_weekend.toFixed(2)} liters
							</li>
						</ul>
					</div>

					{/* Rainy vs Dry Season Consumption */}
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h3 className="text-xl font-semibold text-gray-800">
							Average Rainy vs Dry Season Consumption
						</h3>
						<ul className="mt-2 text-gray-600">
							<li>
								<strong>Rainy:</strong>{" "}
								{filteredData.avg_wc_rainy.toFixed(2)} liters
							</li>
							<li>
								<strong>Dry:</strong>{" "}
								{filteredData.avg_wc_dry.toFixed(2)} liters
							</li>
						</ul>
					</div>

					{/* Rainy vs Dry Season Temperatures */}
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h3 className="text-xl font-semibold text-gray-800">
							Average Rainy vs Dry Season Temperatures
						</h3>
						<ul className="mt-2 text-gray-600">
							<li>
								<strong>Rainy Max Temp:</strong>{" "}
								{filteredData.avg_tmax_rainy.toFixed(2)} °C
							</li>
							<li>
								<strong>Rainy Min Temp:</strong>{" "}
								{filteredData.avg_tmin_rainy.toFixed(2)} °C
							</li>
							<li>
								<strong>Dry Max Temp:</strong>{" "}
								{filteredData.avg_tmax_dry.toFixed(2)} °C
							</li>
							<li>
								<strong>Dry Min Temp:</strong>{" "}
								{filteredData.avg_tmin_dry.toFixed(2)} °C
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-12 bg-gray-100 p-6 rounded-lg">
					<h2 className="text-2xl font-semibold text-gray-900">
						Statistical Insights
					</h2>
					<p className="mt-2 text-gray-600">
						The historical water consumption and climate statistics
						offer key insights into the relationship between
						environmental factors and water usage patterns over
						time. Here&apos;s what the data reveals:
					</p>

					{/* Section 1: Seasonal Trends */}
					<h3 className="mt-4 text-xl font-semibold text-gray-900">
						Seasonal Trends
					</h3>
					<p className="mt-2 text-gray-600">
						<b>Water Consumption:</b> Seasonal differences in water
						consumption (e.g., higher usage during certain times of
						the year) are observable, with consumption patterns
						varying based on rainfall, temperature, and humidity.
					</p>
					<p className="mt-2 text-gray-600">
						<b>Rainfall Impact:</b> Significant rainfall during
						rainy seasons tends to correlate with fluctuating water
						usage, potentially due to increased agricultural
						activities or reduced household water demand.
					</p>

					{/* Section 2: Growth Patterns */}
					<h3 className="mt-4 text-xl font-semibold text-gray-900">
						Growth Patterns
					</h3>
					<p className="mt-2 text-gray-600">
						<b>Population and Consumption:</b> There is a clear
						relationship between population growth and increasing
						water consumption over the years. Understanding this
						trend helps forecast future water demand based on
						estimated population changes.
					</p>
					<p className="mt-2 text-gray-600">
						<b>Daily, Monthly, and Yearly Growth:</b> The data shows
						consistent growth in water consumption over daily,
						monthly, and yearly intervals. Monitoring these growth
						rates is essential for ensuring the sustainability of
						the water supply system.
					</p>

					{/* Section 3: Climate Variability */}
					<h3 className="mt-4 text-xl font-semibold text-gray-900">
						Climate Variability
					</h3>
					<p className="mt-2 text-gray-600">
						<b>Temperature and Humidity:</b> The statistics show how
						maximum and minimum temperatures, along with relative
						humidity, influence daily water consumption. Spikes in
						temperature during dry seasons can lead to higher water
						demand, especially in urban and agricultural areas.
					</p>
					<p className="mt-2 text-gray-600">
						<b>Wind Speed and Direction:</b> While these factors may
						not directly impact water consumption in significant
						ways, they can provide clues about weather patterns and
						broader climate shifts that might indirectly affect
						resource planning.
					</p>

					{/* Section 4: Actionable Insights */}
					<h3 className="mt-4 text-xl font-semibold text-gray-900">
						Actionable Insights
					</h3>
					<p className="mt-2 text-gray-600">
						<b>Water Resource Management:</b> The statistics provide
						crucial data for water resource management and
						conservation efforts. Seasonal variations, daily and
						yearly growth rates, and correlations with climate
						factors help in planning for future water supply needs.
					</p>
					<p className="mt-2 text-gray-600">
						<b>Infrastructure Planning:</b> As the population
						continues to grow, expanding infrastructure to handle
						increasing water demand becomes essential. These
						statistics highlight areas where additional resources
						may be needed in the future.
					</p>
				</div>
			</div>
		</div>
	);
}
