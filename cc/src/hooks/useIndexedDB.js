import { useState, useEffect, useCallback } from "react";

// IndexedDB configuration
const DB_NAME = "nlx-database";
const DB_VERSION = 1;
const STORE_NAME = "app-data";

// Initialize IndexedDB
const initDB = () => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => {
			console.error("IndexedDB error:", request.error);
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onupgradeneeded = (event) => {
			const db = event.target.result;

			// Create object store if it doesn't exist
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				const store = db.createObjectStore(STORE_NAME, { keyPath: "key" });
				store.createIndex("key", "key", { unique: true });
			}
		};
	});
};

// Get value from IndexedDB
const getFromDB = async (key) => {
	try {
		const db = await initDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([STORE_NAME], "readonly");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.get(key);

			request.onsuccess = () => {
				resolve(request.result ? request.result.value : null);
			};

			request.onerror = () => {
				console.error("Error reading from IndexedDB:", request.error);
				reject(request.error);
			};
		});
	} catch (error) {
		console.error("Error accessing IndexedDB:", error);
		return null;
	}
};

// Set value in IndexedDB
const setInDB = async (key, value) => {
	try {
		const db = await initDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([STORE_NAME], "readwrite");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.put({ key, value });

			request.onsuccess = () => {
				resolve(request.result);
			};

			request.onerror = () => {
				console.error("Error writing to IndexedDB:", request.error);
				reject(request.error);
			};
		});
	} catch (error) {
		console.error("Error accessing IndexedDB:", error);
		throw error;
	}
};

// Delete value from IndexedDB
const deleteFromDB = async (key) => {
	try {
		const db = await initDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([STORE_NAME], "readwrite");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.delete(key);

			request.onsuccess = () => {
				resolve();
			};

			request.onerror = () => {
				console.error("Error deleting from IndexedDB:", request.error);
				reject(request.error);
			};
		});
	} catch (error) {
		console.error("Error accessing IndexedDB:", error);
		throw error;
	}
};

// Clear all data from IndexedDB
const clearDB = async () => {
	try {
		const db = await initDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([STORE_NAME], "readwrite");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.clear();

			request.onsuccess = () => {
				resolve();
			};

			request.onerror = () => {
				console.error("Error clearing IndexedDB:", request.error);
				reject(request.error);
			};
		});
	} catch (error) {
		console.error("Error accessing IndexedDB:", error);
		throw error;
	}
};

// Custom hook for IndexedDB
const useIndexedDB = (key, initialValue) => {
	const [storedValue, setStoredValue] = useState(initialValue);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// Load initial value from IndexedDB
	useEffect(() => {
		const loadValue = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const value = await getFromDB(key);
				setStoredValue(value !== null ? value : initialValue);
			} catch (err) {
				console.error("Error loading from IndexedDB:", err);
				setError(err);
				setStoredValue(initialValue);
			} finally {
				setIsLoading(false);
			}
		};

		loadValue();
	}, [key, initialValue]);

	// Set value function
	const setValue = useCallback(
		async (value) => {
			try {
				setError(null);
				const valueToStore =
					value instanceof Function ? value(storedValue) : value;
				setStoredValue(valueToStore);
				await setInDB(key, valueToStore);
			} catch (err) {
				console.error("Error saving to IndexedDB:", err);
				setError(err);
			}
		},
		[key, storedValue],
	);

	// Delete value function
	const deleteValue = useCallback(async () => {
		try {
			setError(null);
			setStoredValue(initialValue);
			await deleteFromDB(key);
		} catch (err) {
			console.error("Error deleting from IndexedDB:", err);
			setError(err);
		}
	}, [key, initialValue]);

	return [storedValue, setValue, deleteValue, isLoading, error];
};

// Utility functions for direct IndexedDB access
export const indexedDBUtils = {
	get: getFromDB,
	set: setInDB,
	delete: deleteFromDB,
	clear: clearDB,
	init: initDB,
};

export default useIndexedDB;
