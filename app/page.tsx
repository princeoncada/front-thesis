"use client";

import React, { useState } from "react";
import VisualSection from "./components/sections/VisualSection";
import StatisticSection from "./components/sections/StatisticSection";
import FutureSection from "./components/sections/FutureSection";
import PredictSection from "./components/sections/PredictSection";
import ReportSection from "./components/sections/ReportSection";
import HomeSection from "./components/sections/HomeSection";

export default function Home() {
	const [view, setView] = useState("0");

	function handleViewChange(num: string) {
		setView(num);
	}

	return (
		<div className="w-full flex flex-col max-w-[1440px] h-full py-10">
			<div className="flex flex-row h-full">
				<div className="flex flex-col gap-2 h-full sticky top-4 p-4">
					<button
						className={`${
							view === "0" ? "bg-gray-300" : "bg-blue-500"
						} text-4xl text-gray-50 flex items-center justify-center p-2 rounded-lg transition-colors duration-200 hover:bg-blue-300`}
						onClick={() => {
							handleViewChange("0");
						}}
					>
						<i className='bx bxs-home'></i>
					</button>
					<button
						className={`${
							view === "1" ? "bg-gray-300" : "bg-blue-500"
						} text-4xl text-gray-50 flex items-center justify-center p-2 rounded-lg transition-colors duration-200 hover:bg-blue-300`}
						onClick={() => {
							handleViewChange("1");
						}}
					>
						<i className="bx bx-stats"></i>
					</button>
					<button
						className={`${
							view === "2" ? "bg-gray-300" : "bg-blue-500"
						} text-4xl text-gray-50 flex items-center justify-center p-2 rounded-lg transition-colors duration-200 hover:bg-blue-300`}
						onClick={() => {
							handleViewChange("2");
						}}
					>
						<i className="bx bxs-bar-chart-alt-2"></i>
					</button>
					<button
						className={`${
							view === "3" ? "bg-gray-300" : "bg-blue-500"
						} text-4xl text-gray-50 flex items-center justify-center p-2 rounded-lg transition-colors duration-200 hover:bg-blue-300`}
						onClick={() => {
							handleViewChange("3");
						}}
					>
						<i className="bx bxs-report"></i>
					</button>
					<button
						className={`${
							view === "4" ? "bg-gray-300" : "bg-blue-500"
						} text-4xl text-gray-50 flex items-center justify-center p-2 rounded-lg transition-colors duration-200 hover:bg-blue-300`}
						onClick={() => {
							handleViewChange("4");
						}}
					>
						<i className="bx bxs-cloud"></i>
					</button>
					<button
						className={`${
							view === "5" ? "bg-gray-300" : "bg-blue-500"
						} text-4xl text-gray-50 flex items-center justify-center p-2 rounded-lg transition-colors duration-200 hover:bg-blue-300`}
						onClick={() => {
							handleViewChange("5");
						}}
					>
						<i className="bx bxs-cog"></i>
					</button>
				</div>
				<div className="border-r-2"></div>
				<div className="p-4 flex flex-col justify-start flex-1">
					<HomeSection view={"0"} currentView={view} />
					<StatisticSection view={"1"} currentView={view} />
					<VisualSection view={"2"} currentView={view} />
					<ReportSection view={"3"} currentView={view} />
					<FutureSection view={"4"} currentView={view} />
					<PredictSection view={"5"} currentView={view} />
				</div>
			</div>
		</div>
	);
}
