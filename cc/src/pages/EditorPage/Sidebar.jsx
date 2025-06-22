import { Brain, House, Save, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMemory from "../../core/store";

export const SideBar = () => {
	const story = useMemory((state) => state.story);
	const setStory = useMemory((state) => state.setStory);
	const [openDropdown, setOpenDropdown] = useState(null);
	const dropdownRef = useRef(null);
	const [apiAvailable, setApiAvailable] = useState(false);

	useEffect(() => {
		// Check if window.api is available
		if (window.api && typeof window.api.summarize === "function") {
			setApiAvailable(true);
			console.log("API is available in the renderer process");
		} else {
			console.error(
				"API is not available in renderer. window.api:",
				window.api,
			);
		}

		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setOpenDropdown(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const navigate = useNavigate();

	const toggleDropdown = (index) =>
		setOpenDropdown(openDropdown === index ? null : index);

	const handleKeyDown = (event, action) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			action();
		}
	};

	const icons = [
		{ icon: House, onClick: () => navigate("/"), label: "Home" },
		{
			icon: Sparkles,
			onClick: null,
			dropdown: true,
			label: "Text Actions",
			options: [
				{ label: "Summarize", action: () => summarizeText(story, setStory) },
				// { label: "Expand", action: () => expandText(story, setStory) },
				// { label: "Shorten", action: () => shortenText(story, setStory) },
			],
		},
		{ icon: Save, onClick: () => saveText(story), label: "Save" },
		{ icon: Brain, onClick: () => navigate("/brain"), label: "Brain" },
	];

	const summarizeText = async (text, setStory) => {
		try {
			console.log("Renderer: Attempting to summarize text");

			// Check if window.api is available at runtime
			if (!window.api || typeof window.api.summarize !== "function") {
				throw new Error("API not available or summarize function not found");
			}

			const summary = await window.api.summarize(text);
			setStory(summary); // Update the story with the summary
			console.log("Summary received:", summary);
		} catch (error) {
			console.error("Error summarizing text:", error);
		}
	};

	// Placeholder for save function that might not be implemented yet
	const saveText = (text) => {
		console.log("Save text function called", text);
		// Implementation for saving text would go here
	};

	return (
		<div className="fixed right-0 h-screen">
			<div className="h-full flex flex-col items-center justify-center">
				<div className="space-y-5 bg-[#121212] p-3 m-2 rounded-md">
					{!apiAvailable && (
						<div className="text-red-500 text-xs p-1 mb-2">
							API Not Available
						</div>
					)}
					{icons.map((item, index) => (
						<div
							key={`icon-${index}-${item.icon.name}`}
							className="relative"
							ref={item.dropdown ? dropdownRef : null}
						>
							{item.dropdown ? (
								<>
									<button
										type="button"
										className="p-1 hover:bg-[#3e3e3e] rounded-md cursor-pointer border-none bg-transparent"
										onClick={() => toggleDropdown(index)}
										onKeyDown={(e) =>
											handleKeyDown(e, () => toggleDropdown(index))
										}
										aria-label={item.label}
										aria-expanded={openDropdown === index}
										aria-haspopup="true"
									>
										<item.icon className="hover:text-[#BB86FC]" size={20} />
									</button>
									{openDropdown === index && (
										<div className="absolute right-10 top-0 bg-[#333] rounded-md shadow-md z-10 w-36 py-2 text-white">
											{item.options.map((option) => (
												<button
													key={`${item.label}-${option.label}`}
													type="button"
													className="w-full text-left px-4 py-2 hover:bg-[#444] cursor-pointer border-none bg-transparent text-white"
													onClick={() => {
														option.action();
														setOpenDropdown(null);
													}}
													onKeyDown={(e) =>
														handleKeyDown(e, () => {
															option.action();
															setOpenDropdown(null);
														})
													}
													aria-label={option.label}
												>
													{option.label}
												</button>
											))}
										</div>
									)}
								</>
							) : (
								<button
									type="button"
									className="p-1 hover:bg-[#3e3e3e] rounded-md cursor-pointer border-none bg-transparent"
									onClick={item.onClick}
									onKeyDown={(e) => handleKeyDown(e, item.onClick)}
									aria-label={item.label}
								>
									<item.icon className="hover:text-[#BB86FC]" size={20} />
								</button>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SideBar;
