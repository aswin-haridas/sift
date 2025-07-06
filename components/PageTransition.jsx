"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PageTransition = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

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
