"use client";

import React, { useEffect, useState } from "react";

interface WeatherData {
	status: number;
	message: string;
	device_type: number;
	locality_weather_data: {
		temperature: number;
		humidity: number;
		wind_speed: number;
		wind_direction: number;
		rain_intensity: number;
		rain_accumulation: number;
	};
}

const API_KEY: string = process.env.NEXT_PUBLIC_WEATHER_API_KEY ?? "";

export default function useFetchWeather() {
	const [localityId, setLocalityId] = useState<string>("");
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
	const [isFetched, setIsFetched] = useState<boolean>(false);

	const sendWeatherAPIRequest = async () => {
		if (!localityId.length) {
			setWeatherData(null);
			return;
		}

		try {
			const result = await fetch(
				`https://www.weatherunion.com/gw/weather/external/v0/get_locality_weather_data?locality_id=${localityId}`,
				{
					headers: {
						"X-Zomato-Api-Key": API_KEY,
					},
				}
			);

			if (result.status !== 200) {
				const resultData: { status: number; message: string } =
					await result.json();
				throw new Error(resultData.message);
			}

			const resultData: WeatherData = await result.json();
			setWeatherData(resultData);
			setIsFetched(true);
		} catch (error) {
			setWeatherData(null);
			console.error(error);
		}
	};

	useEffect(() => {
		setIsFetched(false);
		sendWeatherAPIRequest();
	}, [localityId]);

	return { setLocalityId, weatherData, isFetched };
}
