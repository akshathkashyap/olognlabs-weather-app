"use client";

import React, { useEffect, useState } from "react";
import { Locality } from "@/lib/features/weather/localitySlice";

export default function useLocalStorage() {
	const [recentSearches, setRecentSearches] = useState<Locality[]>([]);
	
	const getRecentSearches = (): Locality[] | null => {
		const savedRecentSearchesString: string | null = localStorage.getItem("recentSearches");
		if (savedRecentSearchesString) {
			return JSON.parse(savedRecentSearchesString);
		}
		return null;
	};

	const updateRecentSearches = (locality: Locality, index: number = -1) => {
		if (!index) return;

		const recentSearchesCopy = [...recentSearches];

		if (index > 0) recentSearchesCopy.splice(index, 1);

		const duplicateIndexes: number[] = [];
		recentSearchesCopy.forEach((savedLocality, index) => {
			if (savedLocality.localityId === locality.localityId) {
				duplicateIndexes.unshift(index);
			}
		});
		duplicateIndexes.forEach((duplicateIndex) => {
			recentSearchesCopy.splice(duplicateIndex, 1);
		});

		recentSearchesCopy.unshift(locality);

		if (recentSearchesCopy.length > 10) recentSearchesCopy.pop();

		setRecentSearches(recentSearchesCopy);
		localStorage.setItem("recentSearches", JSON.stringify(recentSearchesCopy));
	};

	const removeFromRecentSearches = (index: number) => {
		const recentSearchesCopy = [...recentSearches];
		recentSearchesCopy.splice(index, 1);

		setRecentSearches(recentSearchesCopy);
		localStorage.setItem("recentSearches", JSON.stringify(recentSearchesCopy));
	};

	useEffect(() => {
		if (typeof window === "undefined") return;

		const savedRecentSearchesString: string | null = localStorage.getItem("recentSearches");
		if (savedRecentSearchesString) {
			const savedRecentSearches: Locality[] = JSON.parse(savedRecentSearchesString);
			setRecentSearches(savedRecentSearches);
		}
    }, []);

	return { recentSearches, getRecentSearches, updateRecentSearches, removeFromRecentSearches };
}
