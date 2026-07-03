import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useMedia from './hooks/useMedia'

export default function VideoPage({ src }) {
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'Escape' || e.key === 'Backspace') navigate(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <div style={{position:'relative',width:'100vw',height:'100vh',overflow:'hidden',background:'#04060f'}}>
      <VideoBackground src={src} />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}</style>

      {/* Tombol back — bisa diklik mouse */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position:'absolute',top:24,left:24,zIndex:20,
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:22,letterSpacing:3,
          color:'#fff',background:'rgba(0,0,0,0.55)',
          border:'1px solid rgba(255,255,255,0.25)',
          padding:'8px 24px',cursor:'pointer',
        }}
      >
        ← BACK
      </button>

      {/* Hint keyboard */}
      <div style={{
        position:'absolute',bottom:24,right:28,zIndex:20,
        display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5,
        fontFamily:"'Bebas Neue',sans-serif",
      }}>
        <div style={{display:'flex',alignItems:'center',gap:8,fontSize:13,letterSpacing:2,color:'rgba(255,255,255,0.35)'}}>
          <span style={{border:'1px solid rgba(255,255,255,0.2)',borderRadius:3,padding:'1px 6px',fontSize:11}}>ESC</span>
          <span>BACK</span>
        </div>
      </div>
    </div>
  )
}

function VideoBackground({ src }) {
  const { requestBackground, loading } = useMedia();
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) requestBackground(src, containerRef.current);
  }, [src, requestBackground]);

  const isReady = !loading.visible;

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />;
}