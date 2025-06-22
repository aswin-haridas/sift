import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PageTransition from "./components/PageTransition";
import Brain from "./pages/BrainPage/Brain";
import EditorPage from "./pages/EditorPage/EditorPage";

function App() {
	return (
		<Router>
			<PageTransition>
				<Routes>
					{/* <Route path="/" element={<BootPage />} /> */}
					<Route path="/" element={<EditorPage />} />
					<Route path="/brain" element={<Brain />} />
				</Routes>
			</PageTransition>
			<Toaster
				position="bottom-right"
				toastOptions={{
					duration: 4000,
					style: {
						background: "#374151",
						color: "#ffffff",
						borderRadius: "8px",
						padding: "12px 16px",
						fontSize: "14px",
						fontWeight: "500",
						boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
						border: "1px solid #4B5563",
					},
					success: {
						style: {
							background: "#059669",
							color: "#ffffff",
						},
					},
					error: {
						style: {
							background: "#DC2626",
							color: "#ffffff",
						},
					},
				}}
			/>
		</Router>
	);
}

export default App;
