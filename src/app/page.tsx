"use client";

import React from "react";
import Search from "@/components/Search";

export default function Home() {
	return (
		<main className='flex justify-center items-center w-screen h-screen'>
			<section className='flex justify-center items-start h-[635px]'>
				<div>
					<h1 className='text-4xl md:text-9xl mx-auto py-8 w-max'>
						Weather
						<span className='material-symbols-outlined !text-4xl md:!text-9xl'>
							partly_cloudy_day
						</span>
					</h1>
					<div className='w-max mx-auto'>
						<Search></Search>
					</div>
				</div>
			</section>
		</main>
	);
}
