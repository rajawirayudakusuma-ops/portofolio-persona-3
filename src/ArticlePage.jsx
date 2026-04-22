import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import char1 from "./assets/char1.png";
import char2 from "./assets/char2.png";
import char3 from "./assets/char3.png";
import bgVideo from "./assets/main5.mp4";
import article1 from "./assets/article1.jpg";
import article2 from "./assets/article2.jpg";
import article3 from "./assets/article3.jpg";
import article4 from "./assets/article4.jpg";

const CHARS = [char1, char2, char3, char1];

const ROLES = [
  { text: "LEADER" },
  { text: "PARTY" },
  { text: "PARTY" },
  { text: "PARTY" },
];

const ARTICLES = [
  {
    id: "isolapos1",
    media: "ISOLAPOS",
    title: "Omong Kosong Kepedulian Isu Sampah Di Kampus Kita Sendiri",
    url: "https://isolapos.com/2026/04/12/omong-kosong-kepedulian-isu-sampah-di-kampus-kita-sendiri/",
    category: "OPINI",
    image: article1,
  },
  {
    id: "isolapos2",
    media: "ISOLAPOS",
    title: "Sekaratnya Semangat Berhimpunan: Masalah Generasi atau Kegagalan Relevansi?",
    url: "https://isolapos.com/2025/08/sekaratnya-semangat-berhimpunan-masalah-generasi-atau-kegagalan-relevansi/",
    category: "OPINI",
    image: article2,
  },
  {
    id: "bandung",
    media: "BANDUNG BERGERAK",
    title: "MAHASISWA BERSUARA: Sampah Bandung Mau Dibawa ke Mana?",
    url: "https://bandungbergerak.id/article/detail/1546036339/mahasiswa-bersuara-sampah-bandung-mau-dibawa-ke-mana",
    category: "OPINI",
    image: article3,
  },
  {
    id: "detik",
    media: "DETIK JABAR",
    title: "Merawat Tradisi Toleransi di Gang Luna Bandung",
    url: "https://www.detik.com/jabar/jabar-gaskeun/d-8273744/merawat-tradisi-toleransi-di-gang-luna-bandung",
    category: "KABAR KAMPUS",
    image: article4,
  },
];

export default function ArticlePage() {
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
      if (e.key === "ArrowDown") setActive(i => Math.min(ARTICLES.length - 1, i + 1));
      if (e.key === "Enter")     window.open(ARTICLES[active].url, "_blank");
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
          transform: "scaleX(1)",
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anton&display=swap');

        .art-root {
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

        .art-bar-outer {
          position: relative;
          flex-shrink: 0;
          transform: translateX(-100%);
          transition: transform 0.55s cubic-bezier(0.22,1,0.36,1);
          pointer-events: all;
        }
        .art-bar-outer:nth-child(1) { transition-delay: 0ms; }
        .art-bar-outer:nth-child(2) { transition-delay: 80ms; }
        .art-bar-outer:nth-child(3) { transition-delay: 160ms; }
        .art-bar-outer:nth-child(4) { transition-delay: 240ms; }
        .art-bar-outer.mounted { transform: translateX(0); }
        .art-bar-outer.active .art-bar { height: 90px; }
        .art-bar-outer.active .art-bar-red { opacity: 1; height: 90px; }

        .art-bar-red {
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

        .art-bar {
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

        .art-bar-fill {
          position: absolute;
          inset: 0;
          background: #fff;
          clip-path: polygon(100% 0, 100% 0, calc(100% - 32px) 100%, calc(100% - 32px) 100%);
          transition: clip-path 0.35s cubic-bezier(0.22,1,0.36,1);
          z-index: 0;
        }
        .art-bar-outer.active .art-bar-fill {
          clip-path: polygon(22% 0, 100% 0, calc(100% - 14px) 100%, calc(22% + 138px) 100%);
        }

        .art-bar-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }

        .art-role {
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

        .art-char {
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

        .art-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 4px;
          color: rgba(255,255,255,0.85);
          transition: color 0.2s ease;
          user-select: none;
          flex: 1;
          text-align: center;
        }
        .art-bar-outer.active .art-label { color: #111; }

        .art-category-tag {
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
        .art-bar-outer.active .art-category-tag {
          border-color: #111;
          color: #111;
          background: transparent;
        }

        /* Detail Panel */
        @keyframes art-panel-in {
          0%   { opacity: 0; transform: translateX(40px); }
          60%  { opacity: 1; transform: translateX(-4px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        .art-panel {
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
          animation: art-panel-in 0.38s cubic-bezier(0.22,1,0.36,1) both;
        }

        .art-panel-img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          flex-shrink: 0;
          display: block;
        }

        .art-panel-body {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .art-panel-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 2px;
          line-height: 1.3;
          color: #fff;
          user-select: none;
          margin-bottom: 8px;
        }

        .art-panel-media {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.6);
          flex: 1;
        }

        .art-panel-btn {
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
        .art-panel-btn:hover { background: #e83030; }

        /* Back button */
        .art-back-btn {
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
        .art-footer {
          position: fixed;
          bottom: 20px; right: 28px;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 5px;
          font-family: 'Bebas Neue', sans-serif;
          z-index: 50;
          opacity: 0;
          transition: opacity 0.4s ease 0.6s;
        }
        .art-footer.mounted { opacity: 1; }
        .art-footer-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; letter-spacing: 2px;
          color: rgba(255,255,255,0.85);
        }
        .art-footer-key {
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 3px;
          padding: 1px 6px; font-size: 11px;
        }
      `}</style>

      <button className="art-back-btn" onClick={() => navigate(-1)}>← BACK</button>

      <div className="art-root">
        {ARTICLES.map((article, i) => (
          <div
            key={article.id}
            className={`art-bar-outer${active === i ? " active" : ""}${mounted ? " mounted" : ""}`}
            onClick={() => {
              if (active === i) window.open(article.url, "_blank");
              else setActive(i);
            }}
            onMouseEnter={() => setActive(i)}
          >
            <div className="art-bar-red" />
            <div className="art-bar">
              <img className="art-char" src={CHARS[i]} alt="" />
              <div className="art-bar-fill" />
              <div className="art-bar-content">
                <div className="art-role">{ROLES[i].text}</div>
                <div className="art-label">{article.media}</div>
                <span className="art-category-tag">{article.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mounted && (
        <div className="art-panel" key={active}>
          <img
            className="art-panel-img"
            src={ARTICLES[active].image}
            alt={ARTICLES[active].title}
          />
          <div className="art-panel-body">
            <div className="art-panel-title">{ARTICLES[active].title}</div>
            <div className="art-panel-media">{ARTICLES[active].media}</div>
            <button
              className="art-panel-btn"
              onClick={() => window.open(ARTICLES[active].url, "_blank")}
            >
              READ ARTICLE →
            </button>
          </div>
        </div>
      )}

      <div className={`art-footer${mounted ? " mounted" : ""}`}>
        <div className="art-footer-row"><span className="art-footer-key">↑↓</span><span>SELECT</span></div>
        <div className="art-footer-row"><span className="art-footer-key">↵</span><span>OPEN</span></div>
        <div className="art-footer-row"><span className="art-footer-key">ESC</span><span>BACK</span></div>
      </div>
    </div>
  );
}