"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "./Boot.css";

const BootPage = () => {
  const router = useRouter();
  const totalParticles = 300; // total particles
  const particleSize = "2px";
  const orbSize = "100px";
  const time = "14s";
  const accentColor = "#BB86FC"; // Changed to the requested accent color

  // Convert animation time to milliseconds for setTimeout
  const timeInMs = 14 * 1000; // 14 seconds in milliseconds
  // Set up navigation after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/editor");
    }, timeInMs);

    return () => clearTimeout(timer);
  }, [router]);

  // Generate keyframes dynamically
  useEffect(() => {
    let style = document.createElement("style");
    let keyframes = "";

    for (let i = 1; i <= totalParticles; i++) {
      keyframes += `
        @keyframes orbit${i} {
          20% {
            opacity: 1;
          }
          30% {
            transform: rotateZ(${Math.random() * 360}deg) rotateY(${
        Math.random() * 360
      }deg) translateX(${orbSize}) rotateZ(${Math.random() * 360}deg);
          }
          80% {
            transform: rotateZ(${Math.random() * 360}deg) rotateY(${
        Math.random() * 360
      }deg) translateX(${orbSize}) rotateZ(${Math.random() * 360}deg);
            opacity: 1;
          }
          100% {
            transform: rotateZ(${Math.random() * 360}deg) rotateY(${
        Math.random() * 360
      }deg) translateX(calc(${orbSize} * 3)) rotateZ(${Math.random() * 360}deg);
          }
        }
      `;
    }

    style.innerHTML = keyframes;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const particles = Array.from({ length: totalParticles }, (_, i) => i + 1);

  // Get HSL values from hex color #BB86FC
  const hexToHSL = (hex) => {
    // Remove the # if present
    hex = hex.replace(/^#/, "");

    // Parse the RGB components
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const { h: baseHue } = hexToHSL(accentColor);

  return (
    <div className="boot-container">
      <div
        className="wrap"
        style={{ animation: `rotate ${time} infinite linear` }}
      >
        {particles.map((i) => (
          <div
            key={i}
            className="c"
            style={{
              width: particleSize,
              height: particleSize,
              animationDelay: `${i * 0.01}s`,
              backgroundColor: `hsl(${
                baseHue + (i / totalParticles) * 40
              }, 100%, 70%)`,
              animationName: `orbit${i}`,
              animationDuration: time,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BootPage;
