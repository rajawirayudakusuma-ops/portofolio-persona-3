import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import menuVideo from '/Mainn.mp4'
import main1 from '/main1.mp4'
import main2 from '/main2.mp4'
import main3 from '/main3.mp4'
import main4 from '/main4.mp4'
import main5 from '/main5.mp4'
import main6 from '/main6.mp4'
import P3Menu from './P3Menu'
import VideoPage from './VideoPage'
import ResumePage from './ResumePage'
import PageTransition from './PageTransition'
import Socials from './Socials'
import AboutMe from './AboutMe'
import ArticlePage from './ArticlePage'
import SideProjPage from './SideProjPage'
import './App.css'

// Module-level persistent audio element
let bgmAudio = null;

function initializeBGM() {
  if (bgmAudio) return bgmAudio;
  
  bgmAudio = document.createElement('audio');
  bgmAudio.src = '/bgm.mp3';
  bgmAudio.loop = true;
  bgmAudio.volume = 0.3;
  bgmAudio.id = 'app-bgm-audio';
  document.body.appendChild(bgmAudio);
  
  return bgmAudio;
}

function startBGMPlayback() {
  if (!bgmAudio) bgmAudio = initializeBGM();
  
  if (bgmAudio.paused) {
    bgmAudio.play()
      .then(() => console.log('BGM started'))
      .catch(err => console.log('BGM autoplay blocked:', err));
  }
}

function stopBGMPlayback() {
  if (bgmAudio && !bgmAudio.paused) {
    bgmAudio.pause();
  }
}

function toggleBGM() {
  if (!bgmAudio) bgmAudio = initializeBGM();
  
  if (bgmAudio.paused) {
    startBGMPlayback();
  } else {
    stopBGMPlayback();
  }
}

function MuteButton() {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const handleToggle = () => {
      setIsMuted(prev => !prev);
      toggleBGM();
    };

    const btn = document.getElementById('bgm-mute-btn');
    if (btn) {
      btn.addEventListener('click', handleToggle);
      return () => btn.removeEventListener('click', handleToggle);
    }
  }, []);

  return (
    <button
      id="bgm-mute-btn"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 9999,
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '14px',
        letterSpacing: '2px',
        padding: '8px 14px',
        background: 'rgba(0, 0, 0, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.target.style.background = 'rgba(0, 0, 0, 0.9)';
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'rgba(0, 0, 0, 0.7)';
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
      }}
    >
      {isMuted ? '🔇 BGM' : '🔊 BGM'}
    </button>
  );
}

function MenuScreen() {
  const navigate = useNavigate()
  return (
    <div style={{position:'relative',width:'100vw',height:'100vh',overflow:'hidden',background:'#04060f'}}>
      <P3Menu onNavigate={(page) => navigate(`/${page}`)} />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition><MenuScreen /></PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition variant="about"><AboutMe /></PageTransition>
        } />
        <Route path="/resume" element={
          <PageTransition><ResumePage src={main6} /></PageTransition>
        } />
        <Route path="/socials" element={
          <PageTransition variant="socials"><Socials /></PageTransition>
        } />
        {/* Articles page */}
        <Route path="/articles" element={
          <PageTransition><ArticlePage src={main5} /></PageTransition>
        } />
        <Route path="/sideproj" element={
          <PageTransition><SideProjPage src={main4} /></PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  useEffect(() => {
    // Initialize audio on mount
    initializeBGM();

    // Try to play immediately
    startBGMPlayback();

    // Try on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startBGMPlayback();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Try on user interaction
    const handleUserInteraction = () => {
      startBGMPlayback();
      // Remove listeners after first interaction to avoid repeated attempts
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return (
    <>
      <AnimatedRoutes />
      <MuteButton />
    </>
  );
}
