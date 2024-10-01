import { useState } from "react";
import data_form from "../../utils/Form";
import axios from "axios";
import MetricsChart from "../charts/MetricsChart";

export default function PredictSection({ currentView, view }: { view: string }) {
	const [formData, setFormData] = useState(data_form);
	const [predictionResult, setPredictionResult] = useState<number>(0);

	function handleInputChange(
		e:
			| React.ChangeEvent<HTMLSelectElement>
			| React.ChangeEvent<HTMLInputElement>
	) {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	}

	function handlePredictionSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		axios
			.post("http://127.0.0.1:8000/custom-predict", {
				model: formData.model,
				date: formData.date,
				rainfall: formData.rainfall,
				temperature_max: formData.tmax,
				temperature_min: formData.tmin,
				relative_humidity: formData.rh,
				wind_speed: formData.wind_speed,
				wind_direction: formData.wind_direction,
				estimated_population: formData.estimated_population,
			})
			.then((response) => {
				setPredictionResult(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	return (
		<div
			className={`${
				currentView === view ? "flex" : "hidden"
			} flex-col gap-4 bg-gray-50`}
		>
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900">
					Custom Water Consumption Predictions
				</h1>
				<p className="text-lg text-gray-600">
					Input environmental factors and choose from multiple
					predictive models to make custom forcasts.
				</p>
			</div>

			{/* Form and Prediction Result Section */}
			<div className="flex flex-row gap-6">
				{/* Prediction Form */}
				<form
					onSubmit={handlePredictionSubmit}
					className="flex flex-col gap-4 flex-1 bg-white p-4 rounded-lg shadow-lg"
				>
					{/* Model Selection */}
					<div className="flex flex-col gap-2">
						<label
							htmlFor="model"
							className="text-gray-600 font-medium"
						>
							Choose Model:
						</label>
						<select
							name="model"
							id="model"
							className="p-2 rounded-lg text-gray-900 border border-gray-300 focus:border-blue-400 focus:outline-none bg-gray-50"
							value={formData.model}
							onChange={handleInputChange}
						>
							<option value="sarimax">SARIMAX</option>
							<option value="prophet">FBProphet</option>
							<option value="xgboost">XGBoost</option>
							<option value="lstm">LSTM</option>
							<option value="ensemble">Ensemble</option>
						</select>
					</div>

					{/* Date Selection */}
					<div className="flex flex-col gap-2">
						<label
							htmlFor="date"
							className="text-gray-600 font-medium"
						>
							Date:
						</label>
						<input
							type="date"
							name="date"
							id="date"
							className="p-2 rounded-lg text-gray-900 border border-gray-300 focus:border-blue-400 focus:outline-none bg-gray-50"
							value={formData.date}
							onChange={handleInputChange}
							required
						/>
					</div>

					{/* Input Fields for Rainfall and Humidity */}
					<div className="flex flex-row gap-4">
						<div className="flex flex-col flex-1 gap-2">
							<label
								htmlFor="rainfall"
								className="text-gray-600 font-medium"
							>
								Rainfall:
							</label>
							<input
								type="number"
								name="rainfall"
								id="rainfall"
								className="p-2 rounded-lg text-gray-900 border border-gray-300 focus:border-blue-400 focus:outline-none bg-gray-50"
								step="any"
								value={formData.rainfall}
								onChange={handleInputChange}
								required
							/>
						</div>
						<div className="flex flex-col flex-1 gap-2">
							<label
								htmlFor="rh"
								className="text-gray-600 font-medium"
							>
								Relative Humidity:
							</label>
							<input
								type="number"
								name="rh"
								id="rh"
								className="p-2 rounded-lg text-gray-900 border border-gray-300 focus:border-blue-400 focus:outline-none bg-gray-50"
								step="any"
								value={formData.rh}
								onChange={handleInputChange}
								required
							/>
						</div>
					</div>

					{/* Input Fields for Temperature Max and Min */}
					<div className="flex flex-row gap-4">
						<div className="flex flex-col flex-1 gap-2">
							<label
								htmlFor="tmax"
								className="text-gray-600 font-medium"
							>
								Temperature Max:
							</label>
							<input
								type="number"
								name="tmax"
								id="tmax"
								className="p-2 rounded-lg text-gray-900 border border-gray-300 focus:border-blue-400 focus:outline-none bg-gray-50"
								step="any"
								value={formData.tmax}
								onChange={handleInputChange}
								required
							/>
						</div>
						<div className="flex flex-col flex-1 gap-2">
							<label
								htmlFor="tmin"
								className="text-gray-600 font-medium"
							>
								Temperature Min:
							</label>
							<input
								type="number"
								name="tmin"
								id="tmin"
								className="p-2 rounded-lg text-gray-900 border border-gray-300 focus:border-blue-400 focus:outline-none bg-gray-50"
								step="any"
								value={formData.tmin}
								onChange={handleInputChange}
								required
							/>
						</div>
					</div>

					{/* Input Fields for Wind Speed and Wind Direction */}
					<div className="flex flex-row gap-4">
						<div className="flex flex-col flex-1 gap-2">
							<label
								htmlFor="wind_speed"
								className="text-gray-600 font-medium"
							>
								Wind Speed:
							</label>
							<input
								type="number"
								id="wind_speed"
								name="wind_speed"
								className="p-2 rounded-lg text-gray-900 border border-gray-300 focus:border-blue-400 focus:outline-none bg-gray-50"
								step="any"
								value={formData.wind_speed}
								onChange={handleInputChange}
								required
							/>
						</div>
						<div className="flex flex-col flex-1 gap-2">
							<label
								htmlFor="wind_direction"
								className="text-gray-600 font-medium"
							>
								Wind Direction:
							</label>
							<input
								type="number"
								id="wind_direction"
								name="wind_direction"
								className="p-2 rounded-lg text-gray-900 border border-gray-300 focus:border-blue-400 focus:outline-none bg-gray-50"
								step="any"
								value={formData.wind_direction}
								onChange={handleInputChange}
								required
							/>
						</div>
					</div>

					{/* Input for Estimated Population */}
					<div className="flex flex-col gap-2">
						<label
							htmlFor="estimated_population"
							className="text-gray-600 font-medium"
						>
							Estimated Population:
						</label>
						<input
							type="number"
							id="estimated_population"
							name="estimated_population"
							className="p-2 rounded-lg text-gray-900 border border-gray-300 focus:border-blue-400 focus:outline-none bg-gray-50"
							step="any"
							value={formData.estimated_population}
							onChange={handleInputChange}
							required
						/>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
					>
						Predict
					</button>

					{/* Prediction Result */}
					<div className="bg-gray-50 p-4 rounded-lg border border-gray-300 flex flex-col gap-1">
						<h3 className="text-lg font-semibold text-gray-700">
							Prediction Result:
						</h3>
						<p className="text-gray-900 text-lg font-base">
							{predictionResult} Liters
						</p>
					</div>
				</form>

				{/* Divider */}
				<div className="border-r-2"></div>

				{/* Metrics Chart Section */}
				<div className="flex flex-col text-center bg-white p-4 rounded-lg shadow-lg flex-1">
					<h2 className="text-lg font-semibold text-gray-700">
						Error Metrics
					</h2>
					<MetricsChart selectedModel={formData.model} />
				</div>
			</div>

			<div className="mt-12 bg-gray-100 p-6 rounded-lg">
				<h2 className="text-2xl font-semibold text-gray-900">
					Prediction Insights
				</h2>
				<p className="mt-2 text-gray-600">
					This custom prediction tool allows users to input specific
					environmental factors such as rainfall, temperature,
					humidity, wind speed, and estimated population to predict
					water consumption using multiple forecasting models. The
					predicted results can help guide decision-making in resource
					planning and infrastructure management.
				</p>

				{/* Section 1: Model Selection */}
				<h3 className="mt-4 text-xl font-semibold text-gray-900">
					Model Selection
				</h3>
				<p className="mt-2 text-gray-600">
					Several models are available for prediction, each with its
					strengths. SARIMAX models time series data and accounts for
					seasonality, FBProphet provides fast and reliable trend
					forecasting, LSTM is a neural network model for capturing
					long-term dependencies, and XGBoost excels in capturing
					non-linear relationships. The Ensemble model combines these
					to generate a comprehensive forecast.
				</p>
				<p className="mt-2 text-gray-600">
					Depending on the complexity of the scenario and the
					available data, different models may perform better in
					predicting water consumption. However, the XGBoost model has
					proven to be the most accurate, as indicated by the error
					metrics shown.
				</p>

				{/* Section 2: Understanding the Error Metrics */}
				<h3 className="mt-4 text-xl font-semibold text-gray-900">
					Understanding the Error Metrics
				</h3>
				<p className="mt-2 text-gray-600">
					Error metrics such as Mean Squared Error (MSE), Root Mean
					Squared Error (RMSE), Mean Absolute Error (MAE), and Mean
					Absolute Percentage Error (MAPE) are used to evaluate the
					accuracy of each model:
				</p>
				<ul className="mt-2 text-gray-600 list-disc list-inside">
					<li>
						<b>MSE:</b> Measures the average squared difference
						between actual and predicted values. Lower values
						indicate better accuracy.
					</li>
					<li>
						<b>RMSE:</b> Provides the square root of MSE, which
						allows the error to be interpreted in the same units as
						the predicted variable (liters in this case).
					</li>
					<li>
						<b>MAE:</b> Represents the average absolute difference
						between actual and predicted values, helping understand
						the prediction’s overall deviation.
					</li>
					<li>
						<b>MAPE:</b> Indicates the error as a percentage, which
						helps in comparing different models’ performance more
						intuitively.
					</li>
				</ul>
				<p className="mt-2 text-gray-600">
					In this prediction tool, XGBoost had the best error metrics,
					indicating it outperforms the other models in minimizing
					prediction errors.
				</p>

				{/* Section 3: Custom Predictions */}
				<h3 className="mt-4 text-xl font-semibold text-gray-900">
					Custom Predictions
				</h3>
				<p className="mt-2 text-gray-600">
					Users can make custom predictions by entering specific
					values for environmental factors such as rainfall,
					temperature, and estimated population. This tool generates a
					water consumption prediction based on the selected model. By
					comparing various scenarios, users can gain insights into
					how changes in environmental conditions might impact water
					consumption.
				</p>

				{/* Section 4: Decision-Making with Forecasts */}
				<h3 className="mt-4 text-xl font-semibold text-gray-900">
					Decision-Making with Forecasts
				</h3>
				<p className="mt-2 text-gray-600">
					The predictions provide valuable information for
					infrastructure planning, resource allocation, and
					conservation initiatives. By adjusting input values (e.g.,
					projected population growth or expected changes in climate
					conditions), users can assess how water demand might evolve
					and take proactive measures to ensure supply meets future
					demand.
				</p>
			</div>
		</div>
	);
}
