"use client";
import { expand, saveText, shorten, summarize } from "@/app/api/route";
import useMemory from "@/core/store";
import { Brain, House, Save, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  MouseEventHandler,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

interface DropdownOption {
  label: string;
  action: () => void;
}

interface SidebarIcon {
  icon: React.ElementType;
  onClick: (() => void) | null;
  label: string;
  dropdown?: boolean;
  options?: DropdownOption[];
}

export const SideBar = (): ReactElement => {
  const story = useMemory((state) => state.story);
  const setStory = useMemory((state) => state.setStory);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  // Create refs container to handle multiple dropdowns
  const dropdownRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      let clickedInside = false;
      dropdownRefs.current.forEach((ref) => {
        if (ref && ref.contains(event.target as Node)) {
          clickedInside = true;
        }
      });

      if (!clickedInside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const router = useRouter();

  const toggleDropdown = (index: number): void => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent,
    action: () => void
  ): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  const icons: SidebarIcon[] = [
    { icon: House, onClick: () => router.push("/"), label: "Home" },
    {
      icon: Sparkles,
      onClick: () => {
        toggleDropdown(1); // Index 1 for the Sparkles/AI icon
      },
      dropdown: true,
      label: "Ai",
      options: [
        {
          label: "Summarize",
          action: () => {
            if (story) summarize(story);
          },
        },
        {
          label: "Expand",
          action: () => {
            if (story) expand(story);
          },
        },
        {
          label: "Shorten",
          action: () => {
            if (story) shorten(story);
          },
        },
      ],
    },
    { icon: Save, onClick: () => saveText(story), label: "Save" },
    { icon: Brain, onClick: () => router.push("/brain"), label: "Brain" },
  ];

  return (
    <div className="fixed top-0 right-0 h-full flex flex-col items-center justify-center">
      <div className="rounded-lg bg-[#121212] relative">
        {icons.map((item, index) => (
          <div
            key={`icon-${index}`}
            className="p-2 flex items-center justify-center bg-[#121212] hover:bg-[#1e1e1e] rounded-lg relative"
          >
            <button
              type="button"
              onClick={item.onClick as MouseEventHandler<HTMLButtonElement>}
              onKeyDown={(e) => item.onClick && handleKeyDown(e, item.onClick)}
              aria-label={item.label}
              className="flex flex-col items-center gap-1"
            >
              <item.icon size={25} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
            {item.dropdown && openDropdown === index && (
              <div
                ref={(el) => {
                  if (el) {
                    dropdownRefs.current.set(index, el);
                  } else {
                    dropdownRefs.current.delete(index);
                  }
                }}
                className="absolute right-full mr-2 bg-[#1a1a1a] rounded-lg shadow-lg py-1 min-w-[120px] z-10"
              >
                {item.options?.map((option, optIndex) => (
                  <button
                    key={`dropdown-${index}-${optIndex}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      option.action();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
