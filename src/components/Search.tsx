"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useAppDispatch } from "@/lib/hooks";
import { setLocality, Locality } from "@/lib/features/weather/localitySlice";
import localities from "@/docs/localities.json";

interface SearchProps {
	className?: string;
}

function localityFinder(): (searchString: string) => Locality[] {
	const memoizedResults: Map<string, Locality[]> = new Map();

	return function (searchString: string): Locality[] {
		if (!searchString.length) return [];
		searchString = searchString.toLowerCase();

		const memoizedResult: Locality[] | undefined =
			memoizedResults.get(searchString);
		if (memoizedResult !== undefined) return memoizedResult;

		const results: Locality[] = [];

		for (let i: number = 0; i < localities.length; i++) {
			if (
				localities[i].localityName.toLowerCase().includes(searchString)
			) {
				results.push(localities[i]);
			}

			if (results.length === 10) break;
		}

		if (memoizedResults.size === 1024) {
			const firstEntry: string = memoizedResults.keys().next().value;
			memoizedResults.delete(firstEntry);
		}

		memoizedResults.set(searchString, results);

		return results;
	};
}

export default function Search({ className }: SearchProps) {
	const router = useRouter();
	const pathname = usePathname();

	const dispatch = useAppDispatch();

	const searchContainerRef = useRef<HTMLSpanElement | null>(null);
	const searchbarRef = useRef<HTMLSpanElement | null>(null);
	const searchInputRef = useRef<HTMLInputElement | null>(null);

	const [expandSearch, setExpandSearch] = useState<boolean>(false);
	const [searchString, setSearchString] = useState<string>("");
	const [searchResults, setSearchResults] = useState<Locality[]>([]);

	const { recentSearches, updateRecentSearches, removeFromRecentSearches } =
		useLocalStorage();

	const searchLocalities = useMemo(() => localityFinder(), []);

	const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!expandSearch) setExpandSearch(true);
		setSearchString(event.target.value);
	};

	const handleKeyboardEnter = (
		event: React.KeyboardEvent<HTMLInputElement>
	) => {
		const key: string = event.key;
		if (key === "Enter") {
			handleSelectLocality(0);
		} else if (key === "Escape") {
			const searchInput = searchInputRef.current;
			searchInput?.blur();
			setExpandSearch(false);
		};
	};

	const handleClear = () => {
		setSearchString("");
	};

	const handleSelectLocality = (localityIndex: number) => {
		setExpandSearch(false);

		const isRecent: boolean = !searchString.length;
		let targetLocality: Locality;

		if (isRecent) {
			targetLocality = recentSearches[localityIndex];
			if (!targetLocality) return;
			updateRecentSearches(targetLocality, localityIndex);
		} else {
			targetLocality = searchResults[localityIndex];
			if (!targetLocality) return;
			updateRecentSearches(targetLocality);
		}

		dispatch(setLocality(targetLocality));

		if (pathname.includes("/weather")) return;
		router.push("/weather");
	};

	const handleRemoveLocality = (localityIndex: number) => {
		removeFromRecentSearches(localityIndex);
	};

	const clickEventListener = (event: MouseEvent) => {
		const targetElement = event.target as Node | null;

		const searchbar = searchbarRef.current;
		if (!searchbar) return;
		if (searchbar.contains(targetElement)) {
			searchInputRef.current?.focus();
			return;
		}

		const searchContainer = searchContainerRef.current;
		if (!searchContainer) return;
		if (
			targetElement === searchContainer ||
			searchContainer.contains(targetElement)
		)
			return;

		setExpandSearch(false);
	};

	useEffect(() => {
		const results: Locality[] = searchLocalities(searchString);
		setSearchResults(results);
	}, [searchString]);

	useEffect(() => {
		document.addEventListener("click", clickEventListener);
		return () => {
			document.removeEventListener("click", clickEventListener);
		};
	}, []);

	return (
		<span
			ref={searchContainerRef}
			className={`${
				className ?? ""
			} box-border relative flex flex-col justify-start items-center w-[calc(100%-2rem)] md:w-[32rem] min-h-12 mx-auto bg-white ${
				expandSearch ? "shadow-md" : ""
			} hover:shadow-md rounded-[24px] outline outline-1 outline-gray-300`}
		>
			<span
				ref={searchbarRef}
				className='flex flex-row flex-shrink-0 justify-stretch items-center w-full h-full px-1'
			>
				<span className='material-symbols-outlined text-gray-400 px-2 select-none'>
					search
				</span>
				<input
					ref={searchInputRef}
					className='w-full h-12 outline-none'
					type='text'
					value={searchString}
					onChange={handleInput}
					onFocus={() => setExpandSearch(true)}
					onKeyUp={handleKeyboardEnter}
				/>
				<span
					className={`material-symbols-outlined text-gray-400 px-2 select-none cursor-pointer ${
						!searchString.length ? "invisible" : ""
					}`}
					onClick={handleClear}
				>
					close
				</span>
				<span
					className={`w-[1px] h-6 bg-gray-300 ${
						!searchString.length ? "invisible" : ""
					}`}
				></span>
				<span className='material-symbols-outlined text-gray-400 px-2 select-none cursor-pointer'>
					mic
				</span>
			</span>
			<span
				className={`${
					expandSearch ? "relative" : "hidden"
				} w-full pb-6 after:content-[''] after:absolute after:top-0 after:left-4 after:w-[calc(100%-2rem)] after:h-[1px] after:bg-gray-300`}
			>
				<p className='text-xs text-gray-400 cursor-default px-4 py-2'>
					{!searchString.length
						? "Recent searches"
						: "Search results"}
				</p>
				<ul>
					{!searchString.length
						? recentSearches.map(
								(locality: Locality, index: number) => (
									<li
										key={index}
										className='flex flex-row justify-between cursor-default px-4 py-1 hover:bg-gray-100 rounded-sm'
									>
										<button
											className='inline text-left w-full'
											onClick={() =>
												handleSelectLocality(index)
											}
										>
											{locality.localityName}
										</button>
										<button
											className='material-symbols-outlined text-gray-400 px-2 select-none cursor-pointer'
											onClick={() =>
												handleRemoveLocality(index)
											}
										>
											close
										</button>
									</li>
								)
						  )
						: searchResults.map(
								(locality: Locality, index: number) => (
									<li
										key={index}
										className='cursor-default px-4 py-1 hover:bg-gray-100 rounded-sm'
									>
										<button
											className='inline text-left w-full'
											onClick={() =>
												handleSelectLocality(index)
											}
										>
											{locality.localityName}
										</button>
									</li>
								)
						  )}
				</ul>
			</span>
		</span>
	);
}
