import { useState, useEffect } from 'react';
import './styles.css';

function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`glitch-wrapper ${className}`}>
      <span className="glitch" data-text={text}>{text}</span>
    </span>
  );
}

function ScanLines() {
  return <div className="scan-lines" aria-hidden="true" />;
}

function NoiseOverlay() {
  return <div className="noise" aria-hidden="true" />;
}

function FloatingGlitch({ delay, size, left, top }: { delay: number; size: number; left: string; top: string }) {
  return (
    <div
      className="floating-glitch"
      style={{
        animationDelay: `${delay}s`,
        width: size,
        height: size / 3,
        left,
        top,
      }}
    />
  );
}

function BrokenPixels() {
  const pixels = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 4,
    size: Math.random() * 100 + 20,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
  }));

  return (
    <div className="broken-pixels" aria-hidden="true">
      {pixels.map(p => (
        <FloatingGlitch key={p.id} {...p} />
      ))}
    </div>
  );
}

function ErrorCode() {
  const [code, setCode] = useState('ERR_0x4F2B');

  useEffect(() => {
    const codes = ['ERR_0x4F2B', 'ERR_0xDEAD', 'ERR_0xBEEF', 'ERR_0x1337', 'ERR_0xCAFE'];
    const interval = setInterval(() => {
      setCode(codes[Math.floor(Math.random() * codes.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return <span className="error-code">{code}</span>;
}

function LoadingBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 87) return 0;
        return p + Math.random() * 15;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-label">ATTEMPTING RECOVERY...</div>
      <div className="loading-bar">
        <div className="loading-progress" style={{ width: `${progress}%` }} />
      </div>
      <div className="loading-percent">{Math.floor(progress)}%</div>
    </div>
  );
}

function Terminal() {
  const [lines, setLines] = useState<string[]>([]);
  const messages = [
    '> Initializing recovery protocol...',
    '> ERROR: Memory address 0x7FFF corrupted',
    '> Attempting to rebuild index...',
    '> FATAL: Cannot locate main process',
    '> Retrying connection...',
    '> STATUS: All systems offline',
    '> WARNING: Data integrity compromised',
    '> Scanning for alternatives...',
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLines(prev => {
        const newLines = [...prev, messages[index % messages.length]];
        if (newLines.length > 5) newLines.shift();
        return newLines;
      });
      index++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal">
      <div className="terminal-header">
        <span className="terminal-dot red" />
        <span className="terminal-dot yellow" />
        <span className="terminal-dot green" />
        <span className="terminal-title">system_log.exe</span>
      </div>
      <div className="terminal-body">
        {lines.map((line, i) => (
          <div key={i} className="terminal-line" style={{ animationDelay: `${i * 0.1}s` }}>
            {line}
          </div>
        ))}
        <span className="cursor">_</span>
      </div>
    </div>
  );
}

function RetryButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    setClicks(c => c + 1);
  };

  return (
    <button
      className={`retry-button ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <span className="button-glitch" data-text={clicks > 0 ? `RETRY (${clicks})` : 'TRY AGAIN'}>
        {clicks > 0 ? `RETRY (${clicks})` : 'TRY AGAIN'}
      </span>
      <span className="button-underline" />
    </button>
  );
}

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`app ${mounted ? 'mounted' : ''}`}>
      <ScanLines />
      <NoiseOverlay />
      <BrokenPixels />

      <main className="main-content">
        <div className="error-container">
          <div className="error-icon">
            <svg viewBox="0 0 100 100" className="error-svg">
              <circle cx="50" cy="50" r="45" className="error-circle" />
              <line x1="35" y1="35" x2="65" y2="65" className="error-x" />
              <line x1="65" y1="35" x2="35" y2="65" className="error-x" />
            </svg>
          </div>

          <h1 className="error-title">
            <GlitchText text="SYSTEM" className="title-part" />
            <GlitchText text="FAILURE" className="title-part accent" />
          </h1>

          <p className="error-message">
            Sorry, I couldn't build that app right now.
            <br />
            <span className="error-submessage">Please try again later.</span>
          </p>

          <div className="error-details">
            <ErrorCode />
            <span className="separator">|</span>
            <span className="timestamp">{new Date().toISOString()}</span>
          </div>

          <LoadingBar />

          <RetryButton />
        </div>

        <Terminal />
      </main>

      <footer className="footer">
        <span>Requested by @aiob_me</span>
        <span className="footer-dot">·</span>
        <span>Built by @clonkbot</span>
      </footer>
    </div>
  );
}
