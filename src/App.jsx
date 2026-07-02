import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { ROUTE_VIDEO_SRCS } from './mediaPaths'
import P3Menu from './P3Menu'
import ResumePage from './ResumePage'
import PageTransition from './PageTransition'
import Socials from './Socials'
import AboutMe from './AboutMe'
import ArticlePage from './ArticlePage'
import SideProjPage from './SideProjPage'
import { AudioProvider, useAudio } from './AudioProvider'
import './App.css'

function MuteButton() {
  const { isMuted, toggleMute } = useAudio();

  return (
    <button
      id="bgm-mute-btn"
      onClick={toggleMute}
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
  const { resumePlayback } = useAudio()
  
  useEffect(() => {
    const timer = window.setTimeout(() => {
      resumePlayback();
    }, 100);

    return () => window.clearTimeout(timer);
  }, [location.pathname, resumePlayback]);
  
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
          <PageTransition><ResumePage src={ROUTE_VIDEO_SRCS.main6} /></PageTransition>
        } />
        <Route path="/socials" element={
          <PageTransition variant="socials"><Socials /></PageTransition>
        } />
        {/* Articles page */}
        <Route path="/articles" element={
          <PageTransition><ArticlePage src={ROUTE_VIDEO_SRCS.main5} /></PageTransition>
        } />
        <Route path="/sideproj" element={
          <PageTransition><SideProjPage src={ROUTE_VIDEO_SRCS.main4} /></PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function AppShell() {
  const { resumePlayback } = useAudio();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resumePlayback();
      }
    };

    const handleUserInteraction = () => {
      resumePlayback();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [resumePlayback]);

  return (
    <>
      <AnimatedRoutes />
      <MuteButton />
    </>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <AppShell />
    </AudioProvider>
  );
}
