"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { Locality, setLocality } from "@/lib/features/weather/localitySlice";
import useLocalStorage from "@/hooks/useLocalStorage";
import WeatherCard from "@/components/WeatherCard";

function Recents({ locality }: { locality: Locality | null }) {
	const [recents, setRecents] = useState<Locality[]>([]);

	const { getRecentSearches } = useLocalStorage();

	useEffect(() => {
		const recentSearches: Locality[] | null = getRecentSearches();
		if (!recentSearches) return;

		setRecents(recentSearches.slice(1));
	}, [locality]);

	return (
		<div className=''>
			<span className="flex flex-row flex-wrap justify-evenly gap-4">
				{recents.map((recent: Locality) => (
					<span key={recent.localityId}>
						<WeatherCard locality={recent}></WeatherCard>
					</span>
				))}
			</span>
		</div>
	);
}

export default function WeatherPage() {
	const dispatch = useAppDispatch();
	const locality = useAppSelector(
		(state: RootState) => state.weather.locality
	);

	const { recentSearches } = useLocalStorage();
	
	useEffect(() => {
		if (!locality) {
			if (!recentSearches.length) return;
			dispatch(setLocality(recentSearches[0]));
		}
	}, [recentSearches]);

	return (
		<div className='container flex flex-col justify-start items-center mx-auto py-4'>
			<span className="flex justify-center w-full px-4">
				<WeatherCard locality={locality}></WeatherCard>
			</span>
			{recentSearches.length ? (
				<section className='my-4 p-4 w-full bg-white rounded-md'>
					<h1 className='text-4xl text-center mb-4'>Recents</h1>
					<Recents locality={locality}></Recents>
				</section>
			) : null}
		</div>
	);
}
