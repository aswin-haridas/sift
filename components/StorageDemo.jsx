import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Database,
	HardDrive,
	ArrowRight,
	CheckCircle,
	AlertCircle,
} from "lucide-react";
import useStorage, {
	getStorageMethod,
	getStorageInfo,
} from "../hooks/useStorageMigration";

const StorageDemo = () => {
	const [storageInfo, setStorageInfo] = useState(null);
	const [demoText, setDemoText] = useState("");

	// Example usage of the new storage hook with migration
	const [notes, setNotes, deleteNotes, isLoading, error] = useStorage(
		"demo-notes",
		[],
		{
			enableMigration: true,
			migrationKeys: ["story", "brain-notes"], // Keys to migrate from localStorage
			forceLocalStorage: false,
		},
	);

	// Example usage for simple text storage
	const [text, setText, deleteText, textLoading, textError] = useStorage(
		"demo-text",
		"",
	);

	useEffect(() => {
		const loadStorageInfo = async () => {
			const info = await getStorageInfo();
			setStorageInfo(info);
		};
		loadStorageInfo();
	}, []);

	const addNote = () => {
		const newNote = {
			id: Date.now(),
			title: `Note ${notes.length + 1}`,
			content: `This is note ${notes.length + 1} stored in ${getStorageMethod()}`,
			createdAt: new Date().toISOString(),
		};
		setNotes([...notes, newNote]);
	};

	const removeNote = (id) => {
		setNotes(notes.filter((note) => note.id !== id));
	};

	const clearAllData = async () => {
		deleteNotes();
		deleteText();
		setDemoText("");
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-[#1E1E1E] rounded-lg p-6 mb-6"
			>
				<h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
					<Database className="text-purple-400" />
					Storage System Demo
				</h2>

				{/* Storage Method Info */}
				<div className="bg-[#2A2A2A] rounded-lg p-4 mb-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							{storageInfo?.method === "indexeddb" ? (
								<Database className="text-green-400" size={20} />
							) : (
								<HardDrive className="text-yellow-400" size={20} />
							)}
							<span className="text-white font-medium">
								Using: {storageInfo?.method?.toUpperCase() || "Loading..."}
							</span>
						</div>
						<div className="text-sm text-gray-400">
							{storageInfo?.itemCount || 0} items stored
						</div>
					</div>

					{storageInfo?.error && (
						<div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
							<AlertCircle size={16} />
							Error: {storageInfo.error}
						</div>
					)}
				</div>

				{/* Loading States */}
				{(isLoading || textLoading) && (
					<div className="text-purple-400 text-sm mb-4">
						Loading data from {getStorageMethod()}...
					</div>
				)}

				{/* Error States */}
				{(error || textError) && (
					<div className="text-red-400 text-sm mb-4">
						Error: {error?.message || textError?.message}
					</div>
				)}

				{/* Text Input Demo */}
				<div className="mb-6">
					<h3 className="text-lg font-semibold text-white mb-3">
						Text Storage Demo
					</h3>
					<div className="flex gap-2">
						<input
							type="text"
							value={demoText}
							onChange={(e) => setDemoText(e.target.value)}
							placeholder="Enter some text to store..."
							className="flex-1 px-3 py-2 bg-[#2A2A2A] border border-[#4B5563] rounded-lg text-white focus:outline-none focus:border-purple-400"
						/>
						<button
							onClick={() => setText(demoText)}
							className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
						>
							Save
						</button>
						<button
							onClick={() => {
								setText("");
								setDemoText("");
							}}
							className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
						>
							Clear
						</button>
					</div>
					{text && (
						<div className="mt-2 p-3 bg-[#2A2A2A] rounded-lg">
							<span className="text-gray-400 text-sm">Stored text:</span>
							<p className="text-white">{text}</p>
						</div>
					)}
				</div>

				{/* Notes Demo */}
				<div className="mb-6">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-lg font-semibold text-white">
							Notes Storage Demo
						</h3>
						<button
							onClick={addNote}
							className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
						>
							Add Note
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{notes.map((note) => (
							<motion.div
								key={note.id}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="bg-[#2A2A2A] rounded-lg p-4"
							>
								<div className="flex items-start justify-between mb-2">
									<h4 className="text-white font-medium">{note.title}</h4>
									<button
										onClick={() => removeNote(note.id)}
										className="text-red-400 hover:text-red-300 text-sm"
									>
										×
									</button>
								</div>
								<p className="text-gray-300 text-sm mb-2">{note.content}</p>
								<p className="text-gray-500 text-xs">
									{new Date(note.createdAt).toLocaleString()}
								</p>
							</motion.div>
						))}
					</div>

					{notes.length === 0 && (
						<div className="text-center py-8 text-gray-400">
							No notes yet. Click "Add Note" to create one!
						</div>
					)}
				</div>

				{/* Migration Info */}
				<div className="bg-[#2A2A2A] rounded-lg p-4">
					<h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
						<ArrowRight className="text-purple-400" />
						Migration Features
					</h3>
					<ul className="text-gray-300 text-sm space-y-1">
						<li className="flex items-center gap-2">
							<CheckCircle className="text-green-400" size={14} />
							Automatic migration from localStorage to IndexedDB
						</li>
						<li className="flex items-center gap-2">
							<CheckCircle className="text-green-400" size={14} />
							Fallback to localStorage if IndexedDB is not supported
						</li>
						<li className="flex items-center gap-2">
							<CheckCircle className="text-green-400" size={14} />
							Better performance and larger storage capacity
						</li>
						<li className="flex items-center gap-2">
							<CheckCircle className="text-green-400" size={14} />
							Async operations with loading states
						</li>
					</ul>
				</div>

				{/* Clear All Button */}
				<div className="mt-6 text-center">
					<button
						onClick={clearAllData}
						className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
					>
						Clear All Data
					</button>
				</div>
			</motion.div>
		</div>
	);
};

export default StorageDemo;
