import PredictionChart from "../charts/PredictionChart";
import { useEffect, useState } from "react";
import data_prediction from "../../utils/Prediction";

export default function FutureSection({ currentView, view }: { view: string }) {
	const [data, setData] = useState([]);

	useEffect(() => {
		setData(data_prediction);
	}, []);

	return (
		<div
			className={`${
				currentView === view ? "flex" : "hidden"
			} flex flex-col gap-4 bg-gray-50`}
		>
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900">
					Forecasting Water Consumption
				</h1>
				<p className="text-lg text-gray-600">
					Explore model-driven forecasting to anticipate future water
					usage and climate behavior, providing valuable insights for
					proactive decision-making.
				</p>
			</div>

			{/* Prediction Chart */}
			<div className="bg-white  p-6 rounded-lg shadow-lg">
				<h2 className="text-center text-lg font-semibold text-gray-700 mb-4">
					Forecasting Chart
				</h2>
				<PredictionChart data={data} />
			</div>

			{/* Action Buttons */}
			<div className="flex gap-4">
				<button className="flex-1 bg-blue-500 hover:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors duration-200">
					Actual Data
				</button>
				<button className="flex-1 bg-orange-500 hover:bg-orange-400 text-white py-3 rounded-lg font-medium transition-colors duration-200">
					Forecasted Data
				</button>
				<div className="flex-1 border py-3 rounded-lg text-center">
					Model: XGBoost
				</div>
			</div>

			{/* Divider */}
			<div className="border-b-2"></div>

			{/* Prediction Statistics */}
			<div className="flex flex-col gap-6">
				<h2 className="text-center text-lg font-semibold text-gray-700">
					Forecasting Assumptions
				</h2>

				{/* Statistics Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Rainfall */}
					<div className="bg-white  p-6 rounded-lg shadow-lg">
						<h3 className="text-gray-700 text-lg font-semibold">
							Rainfall
						</h3>
						<p className="text-gray-600">Mean: 5.41 mm/day</p>
						<p className="text-gray-600">Variance: 3396.93%</p>
					</div>

					{/* Maximum Temperature */}
					<div className="bg-white  p-6 rounded-lg shadow-lg">
						<h3 className="text-gray-700 text-lg font-semibold">
							Maximum Temperature
						</h3>
						<p className="text-gray-600">Mean: 32.56°C</p>
						<p className="text-gray-600">Variance: 8.33%</p>
					</div>

					{/* Minimum Temperature */}
					<div className="bg-white  p-6 rounded-lg shadow-lg">
						<h3 className="text-gray-700 text-lg font-semibold">
							Minimum Temperature
						</h3>
						<p className="text-gray-600">Mean: 24.91°C</p>
						<p className="text-gray-600">Variance: 3.48%</p>
					</div>

					{/* Relative Humidity */}
					<div className="bg-white  p-6 rounded-lg shadow-lg">
						<h3 className="text-gray-700 text-lg font-semibold">
							Relative Humidity
						</h3>
						<p className="text-gray-600">Mean: 78.11%</p>
						<p className="text-gray-600">Variance: 37.99%</p>
					</div>

					{/* Wind Direction */}
					<div className="bg-white  p-6 rounded-lg shadow-lg">
						<h3 className="text-gray-700 text-lg font-semibold">
							Wind Direction
						</h3>
						<p className="text-gray-600">Mean: 204.68°</p>
						<p className="text-gray-600">Variance: 7651.81%</p>
					</div>

					{/* Wind Speed */}
					<div className="bg-white  p-6 rounded-lg shadow-lg">
						<h3 className="text-gray-700 text-lg font-semibold">
							Wind Speed
						</h3>
						<p className="text-gray-600">Mean: 2.04 m/s</p>
						<p className="text-gray-600">Variance: 20.72%</p>
					</div>
				</div>

				{/* Growth Statistics */}
				<div className="bg-white  p-6 rounded-lg shadow-lg">
					<h3 className="text-gray-700 text-lg font-semibold">
						Daily Growth Percentage
					</h3>
					<p className="text-gray-600">Population: 0.01%</p>
				</div>
			</div>

			<div className="mt-12 bg-gray-100 p-6 rounded-lg">
				<h2 className="text-2xl font-semibold text-gray-900">
					Forecasting Insights
				</h2>
				<p className="mt-2 text-gray-600">
					The forecasts are generated using various predictive models,
					with assumptions based on the statistics from the existing
					historical data. These forecasts provide insights into
					future water consumption patterns and their relationship
					with climate variables like temperature, humidity, and
					rainfall.
				</p>

				{/* Section 1: Predictive Modeling and Model Selection */}
				<h3 className="mt-4 text-xl font-semibold text-gray-900">
					Predictive Modeling and Model Selection
				</h3>
				<p className="mt-2 text-gray-600">
					Several advanced models were employed to forecast water
					consumption, including SARIMAX, FBProphet, LSTM, XGBoost,
					and an Ensemble model. After comprehensive model evaluation,
					including error metric comparisons, the XGBoost model showed
					the highest accuracy.
				</p>
				<p className="mt-2 text-gray-600">
					The XGBoost model, after optimization using particle swarm
					optimization (PSO), produced the best error metrics.
					Therefore, it was selected for making the final forecasts.
					This model&apos;s strength lies in its ability to handle large
					datasets and capture non-linear relationships between water
					consumption and climate variables.
				</p>

				{/* Section 2: Prediction Assumptions Based on Historical Data */}
				<h3 className="mt-4 text-xl font-semibold text-gray-900">
					Forecast Assumptions Based on Historical Data
				</h3>
				<p className="mt-2 text-gray-600">
					The forecasts are grounded in the assumption that future
					climate conditions will behave similarly to historical
					patterns. The forecasts assumptions are calculated from the
					statistics of the historical dataset, including key
					variables such as rainfall, temperature, relative humidity,
					and wind speed. For example, the average rainfall is
					projected based on the historical mean of 5.41 mm/day with a
					variance of 3396.93%.
				</p>
				<p className="mt-2 text-gray-600">
					By leveraging these historical assumptions, the model
					anticipates water consumption trends while accounting for
					daily, monthly, and yearly changes in both climate and
					population growth.
				</p>

				{/* Section 3: Climate Influence on Water Demand */}
				<h3 className="mt-4 text-xl font-semibold text-gray-900">
					Climate Influence on Water Demand
				</h3>
				<p className="mt-2 text-gray-600">
					The predictive model highlights how climate factors, such as
					spikes in temperature or sudden rainfall, impact water
					consumption. Dry periods may drive increased water demand
					for agricultural and urban needs, while rainy periods may
					either reduce or shift water consumption patterns.
				</p>
				<p className="mt-2 text-gray-600">
					This insight is crucial for decision-makers to adjust water
					supply strategies based on forecasted climate conditions.
				</p>

			</div>
		</div>
	);
}
