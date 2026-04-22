import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import char1 from "./assets/char1.png";
import char2 from "./assets/char2.png";
import char3 from "./assets/char3.png";
import bgVideo from "./assets/main4.mp4";
import sideproj1 from "./assets/sideproj1.JPG";
import sideproj2 from "./assets/sideproj2.JPG";
import sideproj3 from "./assets/sideproj3.png";

const CHARS = [char1, char2, char3, char1];

const ROLES = [
  { text: "LEADER" },
  { text: "PARTY" },
  { text: "PARTY" },
  { text: "PARTY" },
];

const PROJECTS = [
  {
    id: "lumoland",
    category: "KEPANITIAAN",
    media: "LUMOLAND",
    title: "Panitia Lumoland Festival",
    description: "Festival Art Market Bandung",
    url: "https://www.instagram.com/lumoland.id/",
    image: sideproj1,
  },
  {
    id: "renjanamedia",
    category: "JURNALISTIK",
    media: "RENJANA MEDIA",
    title: "Video Berita RenjanaMedia",
    description: "Produksi dan liputan berita redaksi",
    url: "https://drive.google.com/file/d/1jgJ1lD0qamn_Ax6r3a2A7E7K2PW3zU2T/view?usp=sharing",
    image: sideproj3,
  },
  {
    id: "photoessay",
    category: "FOTOGRAFI",
    media: "FOTO ESAI",
    title: "Foto Esai Dokumentasi",
    description: "Karya foto esai dokumentasi kegiatan",
    url: "https://drive.google.com/file/d/10g9ST8-2uK_EA1EzM1VZ7udlzSomF32B/view?usp=sharing",
    image: sideproj2,
  },
  {
    id: "other",
    category: "LAINNYA",
    media: "SIDE PROJECT",
    title: "Project Lainnya",
    description: "Berbagai kegiatan dan project sampingan",
    url: "https://www.instagram.com/",
  },
];

export default function SideProjPage() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp")   setActive(i => Math.max(0, i - 1));
      if (e.key === "ArrowDown") setActive(i => Math.min(PROJECTS.length - 1, i + 1));
      if (e.key === "Enter")     window.open(PROJECTS[active].url, "_blank");
      if (e.key === "ArrowLeft" || e.key === "Escape" || e.key === "Backspace") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate]);

  return (
    <div id="menu-screen">
      <video
        src={bgVideo}
        autoPlay loop muted playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 1,
          zIndex: 0,
          pointerEvents: "none",
          transform: "scaleX(-1)",
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anton&display=swap');

        .sp-root {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: all;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding-top: 35vh;
          gap: 6px;
        }

        .sp-bar-outer {
          position: relative;
          flex-shrink: 0;
          transform: translateX(-100%);
          transition: transform 0.55s cubic-bezier(0.22,1,0.36,1);
          pointer-events: all;
        }
        .sp-bar-outer:nth-child(1) { transition-delay: 0ms; }
        .sp-bar-outer:nth-child(2) { transition-delay: 80ms; }
        .sp-bar-outer:nth-child(3) { transition-delay: 160ms; }
        .sp-bar-outer:nth-child(4) { transition-delay: 240ms; }
        .sp-bar-outer.mounted { transform: translateX(0); }
        .sp-bar-outer.active .sp-bar { height: 90px; }
        .sp-bar-outer.active .sp-bar-red { opacity: 1; height: 90px; }

        .sp-bar-red {
          position: absolute;
          top: 0; left: 0;
          width: 55vw;
          height: 64px;
          background: #c4001a;
          clip-path: polygon(50% 0, 100% 0, 100% 100%, calc(50% - 10px) 100%);
          transform: translateY(-7px);
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 0;
          pointer-events: none;
        }

        .sp-bar {
          position: relative;
          width: 55vw;
          height: 64px;
          background: #111;
          cursor: pointer;
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: 0 6px 24px rgba(0,0,0,0.65);
          transition: height 0.3s cubic-bezier(0.22,1,0.36,1);
          z-index: 1;
        }

        .sp-bar-fill {
          position: absolute;
          inset: 0;
          background: #fff;
          clip-path: polygon(100% 0, 100% 0, calc(100% - 32px) 100%, calc(100% - 32px) 100%);
          transition: clip-path 0.35s cubic-bezier(0.22,1,0.36,1);
          z-index: 0;
        }
        .sp-bar-outer.active .sp-bar-fill {
          clip-path: polygon(22% 0, 100% 0, calc(100% - 14px) 100%, calc(22% + 138px) 100%);
        }

        .sp-bar-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }

        .sp-role {
          font-family: 'Anton', sans-serif;
          font-size: 50px;
          letter-spacing: -2px;
          color: #fff;
          transform: rotate(-30deg);
          user-select: none;
          line-height: 1;
          padding: 0 16px 0 8px;
          flex-shrink: 0;
        }

        .sp-char {
          position: absolute;
          top: 0; left: 110px;
          height: 100%;
          width: auto;
          max-width: 160px;
          object-fit: cover;
          object-position: top;
          pointer-events: none;
          z-index: 3;
          clip-path: polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%);
        }

        .sp-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 4px;
          color: rgba(255,255,255,0.85);
          transition: color 0.2s ease;
          user-select: none;
          flex: 1;
          text-align: center;
        }
        .sp-bar-outer.active .sp-label { color: #111; }

        .sp-category-tag {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 11px;
          letter-spacing: 1.5px;
          padding: 4px 8px;
          border: 1px solid rgba(255,255,255,0.4);
          color: rgba(255,255,255,0.7);
          background: rgba(0,0,0,0.3);
          user-select: none;
          flex-shrink: 0;
          margin-right: 8px;
        }
        .sp-bar-outer.active .sp-category-tag {
          border-color: #111;
          color: #111;
          background: transparent;
        }

        /* Detail Panel */
        @keyframes sp-panel-in {
          0%   { opacity: 0; transform: translateX(40px); }
          60%  { opacity: 1; transform: translateX(-4px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        .sp-panel {
          position: absolute;
          top: 9.5vh;
          right: 4.5vw;
          width: min(39vw, 620px);
          min-height: 74vh;
          z-index: 40;
          padding: 0 0 0 0;
          background: linear-gradient(180deg, rgba(15,28,105,0.96) 0%, rgba(8,16,68,0.97) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(133,244,255,0.16), 16px 16px 0 rgba(0,6,30,0.55);
          overflow: hidden;
          pointer-events: all;
          display: flex;
          flex-direction: column;
          animation: sp-panel-in 0.38s cubic-bezier(0.22,1,0.36,1) both;
        }

        .sp-panel-img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          flex-shrink: 0;
          display: block;
        }

        .sp-panel-body {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .sp-panel-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 2px;
          line-height: 1.3;
          color: #fff;
          user-select: none;
          margin-bottom: 8px;
        }

        .sp-panel-media {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 8px;
        }

        .sp-panel-description {
          font-family: 'Montserrat', 'Anton', sans-serif;
          font-size: 16px;
          color: rgba(255,255,255,0.75);
          line-height: 1.5;
          margin-bottom: 16px;
          flex: 1;
        }

        .sp-panel-btn {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 3px;
          padding: 16px;
          background: #c4001a;
          color: #fff;
          border: none;
          cursor: pointer;
          width: 100%;
          margin-top: auto;
          transition: background 0.2s ease;
        }
        .sp-panel-btn:hover { background: #e83030; }

        /* Back button */
        .sp-back-btn {
          position: absolute;
          top: 20px; left: 20px;
          z-index: 50;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 3px;
          color: #fff;
          background: rgba(0,0,0,0.55);
          border: 1px solid rgba(255,255,255,0.3);
          padding: 8px 20px;
          cursor: pointer;
        }

        /* Footer */
        .sp-footer {
          position: fixed;
          bottom: 20px; right: 28px;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 5px;
          font-family: 'Bebas Neue', sans-serif;
          z-index: 50;
          opacity: 0;
          transition: opacity 0.4s ease 0.6s;
        }
        .sp-footer.mounted { opacity: 1; }
        .sp-footer-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; letter-spacing: 2px;
          color: rgba(255,255,255,0.85);
        }
        .sp-footer-key {
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 3px;
          padding: 1px 6px; font-size: 11px;
        }
      `}</style>

      <button className="sp-back-btn" onClick={() => navigate(-1)}>← BACK</button>

      <div className="sp-root">
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            className={`sp-bar-outer${active === i ? " active" : ""}${mounted ? " mounted" : ""}`}
            onClick={() => {
              if (active === i) window.open(project.url, "_blank");
              else setActive(i);
            }}
            onMouseEnter={() => setActive(i)}
          >
            <div className="sp-bar-red" />
            <div className="sp-bar">
              <img className="sp-char" src={CHARS[i]} alt="" />
              <div className="sp-bar-fill" />
              <div className="sp-bar-content">
                <div className="sp-role">{ROLES[i].text}</div>
                <div className="sp-label">{project.media}</div>
                <span className="sp-category-tag">{project.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mounted && (
        <div className="sp-panel" key={active}>
          <img
            className="sp-panel-img"
            src={PROJECTS[active].image}
            alt={PROJECTS[active].title}
          />
          <div className="sp-panel-body">
            <div className="sp-panel-title">{PROJECTS[active].title}</div>
            <div className="sp-panel-media">{PROJECTS[active].media}</div>
            <div className="sp-panel-description">{PROJECTS[active].description}</div>
            <button
              className="sp-panel-btn"
              onClick={() => window.open(PROJECTS[active].url, "_blank")}
            >
              VIEW PROJECT →
            </button>
          </div>
        </div>
      )}

      <div className={`sp-footer${mounted ? " mounted" : ""}`}>
        <div className="sp-footer-row"><span className="sp-footer-key">↑↓</span><span>SELECT</span></div>
        <div className="sp-footer-row"><span className="sp-footer-key">↵</span><span>OPEN</span></div>
        <div className="sp-footer-row"><span className="sp-footer-key">ESC</span><span>BACK</span></div>
      </div>
    </div>
  );
}
