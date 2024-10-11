export default function HomeSection({ currentView, view }) {
	return (
		<div
			className={`${
				currentView === view ? "flex" : "hidden"
			} flex-row h-full w-full gap-4`}
		>
            
			<div className="bg-gray-100 p-6 rounded-lg">
				<h1 className="text-3xl font-bold text-gray-900">
					Welcome to the Water Consumption Analytics Dashboard
				</h1>
				<p className="mt-4 text-lg text-gray-600">
					Explore interactive data visualizations and predictive
					models to gain deeper insights into water consumption
					patterns, environmental influences, and trends over time.
				</p>
				<p className="mt-2 text-lg text-gray-600">
					This dashboard provides valuable tools for planning,
					resource management, and understanding the relationship
					between water usage and environmental factors like rainfall,
					temperature, and population growth.
				</p>

				{/* Key Features Section */}
				<div className="mt-8">
					<h2 className="text-2xl font-semibold text-gray-900">
						Key Features
					</h2>
					<ul className="list-disc list-inside mt-4 text-gray-600">
						<li>
							<strong>Historical Data Analysis:</strong> View
							detailed water consumption statistics and climate
							patterns over time to understand key trends and
							seasonal variations.
						</li>
						<li className="mt-2">
							<strong>Forecasting Modeling:</strong> Leverage
							cutting-edge models like XGBoost, SARIMAX, and LSTM
							to forecast future water demand based on
							environmental factors.
						</li>
						<li className="mt-2">
							<strong>Custom Forecasting:</strong> Input your own
							environmental data to generate water consumption
							forecasts, helping you plan for various scenarios.
						</li>
						<li className="mt-2">
							<strong>Interactive Visualizations:</strong> Explore
							dynamic charts and graphs that provide insights into
							the correlations between climate variables and water
							consumption.
						</li>
					</ul>
				</div>

				{/* How to Use Section */}
				<div className="mt-8">
					<h2 className="text-2xl font-semibold text-gray-900">
						How to Use
					</h2>
					<p className="mt-4 text-gray-600">
						Navigate through the sections on the left-hand side to
						explore different features. The dashboard is divided
						into the following key areas:
					</p>
					<ul className="list-disc list-inside mt-4 text-gray-600">
						<li>
							<strong>Statistics:</strong> Explore historical
							water consumption and climate statistics.
						</li>
						<li className="mt-2">
							<strong>Data Visualizations:</strong> Interact with
							dynamic charts that visualize water usage trends and
							correlations.
						</li>
						<li className="mt-2">
							<strong>Future Forecasting:</strong> View
							model-based forecasts of water consumption for
							upcoming periods, helping with strategic planning.
						</li>
						<li className="mt-2">
							<strong>Custom Forecasting:</strong> Generate custom
							water consumption forecasts by inputting your own
							environmental data for specific dates.
						</li>
					</ul>
				</div>

				{/* Benefits Section */}
				<div className="mt-8">
					<h2 className="text-2xl font-semibold text-gray-900">
						Benefits
					</h2>
					<p className="mt-4 text-gray-600">
						With this dashboard, water management authorities,
						environmental planners, and other users can:
					</p>
					<ul className="list-disc list-inside mt-4 text-gray-600">
						<li>
							Identify seasonal and long-term water usage trends.
						</li>
						<li>
							Plan resource allocation and infrastructure projects
							based on future demand forecasts.
						</li>
						<li>
							Optimize water usage strategies by understanding the
							impact of climate factors like rainfall and
							temperature.
						</li>
						<li>
							Respond to extreme weather events with data-driven
							insights to mitigate water shortages or overuse.
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
