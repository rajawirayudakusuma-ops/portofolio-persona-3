import { useEffect, useMemo, useState } from 'react';
import './LoadingScreen.css';

const BLOCKS = Array.from({ length: 8 }, (_, index) => index);

export default function LoadingScreen({ progress, visible = true, reducedMotion = false }) {
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    if (!visible) {
      setPhase('exit');
      return;
    }

    setPhase('enter');
  }, [visible]);

  const litBlockCount = useMemo(() => {
    if (progress >= 100) return 8;
    if (progress >= 75) return 6;
    if (progress >= 50) return 4;
    if (progress >= 25) return 2;
    return 0;
  }, [progress]);

  return (
    <div className={`loading-screen ${visible ? 'visible' : 'hidden'} ${reducedMotion ? 'reduced-motion' : ''}`} aria-live="polite">
      <div className="loading-screen__backdrop" />
      <div className="loading-screen__scanlines" />
      <div className="loading-screen__grid" />
      <div className="loading-screen__stripes" />
      <div className="loading-screen__hud" />
      <div className="loading-screen__particles" aria-hidden="true">
        {BLOCKS.slice(0, 12).map((particle) => (
          <span key={particle} className="loading-screen__particle" style={{ ['--delay']: `${particle * 0.16}s` }} />
        ))}
      </div>
      <div className={`loading-screen__content ${phase}`}>
        <div className="loading-screen__title">ACCESSING TARTARUS DATABASE</div>
        <div className="loading-screen__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
          {BLOCKS.map((block) => (
            <span key={block} className={`loading-screen__block${block < litBlockCount ? ' active' : ''}`} />
          ))}
        </div>
        <div className="loading-screen__status">PLEASE WAIT...</div>
      </div>
    </div>
  );
}
