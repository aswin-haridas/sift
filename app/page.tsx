"use client";
import SideBar from "@/components/Sidebar";
import EditorComponent from "./editor/Editor";

export default function Home() {
  return (
    <div className="flex w-[100%] h-screen">
      <div className="flex-1 w-full m-2 pr-10">
        <EditorComponent />
      </div>
      <SideBar />
    </div>
  );
}
