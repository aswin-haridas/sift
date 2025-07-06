"use client";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchInput({ searchQuery, setSearchQuery }) {
	return (
		<motion.div
			className="fixed bottom-6 inset-x-0 mx-auto w-72 max-w-[18rem] backdrop-blur-md bg-[#1E1E1E]/70 rounded-full shadow-lg border border-[#2A2A2A]/50"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="relative flex items-center">
				<Search className="absolute left-4 text-[#aaaaaa]" size={16} />
				<input
					type="text"
					placeholder="Search notes..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full py-2 px-5 pl-10 bg-transparent rounded-full focus:outline-none text-sm"
					aria-label="Search notes"
				/>
			</div>
		</motion.div>
	);
}
