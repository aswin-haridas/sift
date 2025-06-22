import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTransition = ({ children }) => {
	const [isVisible, setIsVisible] = useState(false);
	const location = useLocation();

	useEffect(() => {
		setIsVisible(false);
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 50);
		return () => clearTimeout(timer);
	}, [location.pathname]);

	return (
		<div
			style={{
				opacity: isVisible ? 1 : 0,
				transition: "opacity 1s ease-in-out",
			}}
		>
			{children}
		</div>
	);
};

export default PageTransition;
