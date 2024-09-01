"use client";

import React, { useEffect, useMemo, useState } from "react";
import useFetchWeather from "@/hooks/useFetchWeather";
import { Locality } from "@/lib/features/weather/localitySlice";

interface WeatherCardProps {
	locality: Locality | null;
}

function WeatherCardLoader() {
	const [loadingText, setLoadingText] = useState<string>("cloud");

	const textCirculator = () => {
		const loadingTexts: string[] = [
			"partly_cloudy_day",
			"rainy",
			"cloud",
			"partly_cloudy_night",
			"clear_day",
			"ac_unit",
			"air",
		];
		let loadingTextIndex: number = 0;

		return () => {
			loadingTextIndex = loadingTextIndex % loadingTexts.length;
			setLoadingText(loadingTexts[loadingTextIndex]);
			loadingTextIndex++;
		};
	};

	const circulate = useMemo(() => textCirculator(), []);

	useEffect(() => {
		const circulatorTimer = setInterval(() => {
			circulate();
		}, 100);

		return () => clearInterval(circulatorTimer);
	}, []);

	return (
		<div className='relative py-4 w-full md:w-[32rem] h-[25.5rem] md:h-80 bg-white shadow-md rounded-[24px] outline outline-1 outline-gray-300'>
			<span className='flex justify-center items-center w-[calc(100%-2rem)] h-full mx-auto'>
				<span className='material-symbols-outlined !text-9xl'>
					{loadingText}
				</span>
			</span>
		</div>
	);
}

export default function WeatherCard({ locality }: WeatherCardProps) {
	const { setLocalityId, weatherData, isFetched } = useFetchWeather();

	const [currentTime, setCurrentTime] = useState<string>("");

	const getWeatherSymbolString = (): string => {
		if (weatherData) {
			if (weatherData.locality_weather_data.rain_intensity > 150) {
				return "rainy";
			}

			if (weatherData.locality_weather_data.wind_speed > 13) {
				return "air";
			}
		}

		const hours: number = new Date().getHours();
		if (hours < 18 && hours > 6) {
			return "clear_day";
		}
		return "bedtime";
	};

	useEffect(() => {
		if (!locality) return;
		setLocalityId(locality.localityId);
	}, [locality]);

	useEffect(() => {
		const clockTimerInterval = setInterval(() => {
			const date = new Date();
			const formatter = new Intl.DateTimeFormat("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			});
			const formattedTime = formatter.format(date);

			setCurrentTime(formattedTime);
		}, 1000);

		return () => clearInterval(clockTimerInterval);
	}, []);

	if (!locality) return;

	if (!isFetched) return <WeatherCardLoader />;

	return (
		<div className='relative py-4 w-full md:w-[32rem] min-h-80 bg-white shadow-md rounded-[24px] outline outline-1 outline-gray-300'>
			<span className='block w-[calc(100%-2rem)] mx-auto'>
				<span className='flex flex-row justify-between items-center pb-2 border-b-[1px]'>
					<p>Current Weather</p>
					<p>{currentTime}</p>
				</span>
				<span className='relative flex flex-col-reverse md:flex-row justify-center items-center py-4 mb-4'>
					<span className='block w-full md-1/2'>
						<h3 className='text-4xl font-bold mb-1'>
							{weatherData?.locality_weather_data.temperature}°C
						</h3>
						<h4 className='text-2xl'>
							{locality?.localityName}, {locality?.cityName}
						</h4>
					</span>
					<span className='flex justify-center items-center w-full md-1/2'>
						<span className='material-symbols-outlined !text-7xl'>
							{getWeatherSymbolString()}
						</span>
					</span>
				</span>
				<span className='relative block'>
					<span className='relative flex flex-row justify-between items-start'>
						<span className='w-1/2'>
							<p className='border-b-[1px]'>Humidity</p>
							<p className='border-b-[1px]'>Wind Speed</p>
							<p className='border-b-[1px]'>Wind Direction</p>
						</span>
						<span className='w-1/2'>
							<p className='border-b-[1px]'>
								{weatherData?.locality_weather_data.humidity}%
							</p>
							<p className='border-b-[1px]'>
								{weatherData?.locality_weather_data.wind_speed}
								m/s
							</p>
							<p className='border-b-[1px]'>
								{
									weatherData?.locality_weather_data
										.wind_direction
								}
								°
							</p>
						</span>
					</span>
					<span className='relative flex flex-row justify-between items-start'>
						<span className='w-1/2'>
							<p className='border-b-[1px]'>Rain Intensity</p>
							<p>Rain Accumulation</p>
						</span>
						<span className='w-1/2'>
							<p className='border-b-[1px]'>
								{
									weatherData?.locality_weather_data
										.rain_intensity
								}
								mm/min
							</p>
							<p>
								{
									weatherData?.locality_weather_data
										.rain_accumulation
								}
								(mm) today from 12 AM IST
							</p>
						</span>
					</span>
				</span>
			</span>
		</div>
	);
}
