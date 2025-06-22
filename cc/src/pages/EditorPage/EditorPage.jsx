import EditorComponent from "./Editor";
import SideBar from "./Sidebar";

const EditorPage = () => {
	return (
		<div className="flex w-[100%] h-screen">
			<div className="flex-1 w-full m-2 pr-10">
				<EditorComponent />
			</div>
			<SideBar />
		</div>
	);
};

export default EditorPage;
