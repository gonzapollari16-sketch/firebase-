'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const avatars = {
  assistant: {
    label: "Asistente IA",
    video: "/VID-20260203-WA0022.mp4",
    response: "Perfecto, te ayudo con eso paso a paso. ¿Qué parte querés entender mejor?"
  },
  crushia: {
    label: "Buscador IA",
    video: "/VID-20260203-WA0023.mp4",
    response: "Genial 😊 Decime zona, presupuesto y tipo de propiedad que buscás."
  }
};

export default function AiAvatarsPage() {
  const [activeAvatar, setActiveAvatar] = useState('assistant');
  const [text, setText] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const switchAvatar = () => {
    const nextAvatar = activeAvatar === "assistant" ? "crushia" : "assistant";
    setActiveAvatar(nextAvatar);
  };

  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.src = avatars[activeAvatar as keyof typeof avatars].video;
        videoRef.current.play().catch(error => console.error("Video play failed:", error));
    }
  }, [activeAvatar]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-AR";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('La síntesis de voz no es soportada en este navegador.');
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;
    speak(avatars[activeAvatar as keyof typeof avatars].response);
  };

  return (
    <>
      <style jsx global>{`
        body, html {
          overflow: hidden !important;
        }
        .ai-avatar-page-container {
          margin: -2rem; /* Counteract parent padding */
        }
      `}</style>
       <style jsx>{`
        .container {
          width: 100vw;
          height: calc(100vh - 4rem); /* Adjust for header height */
          overflow: hidden;
          position: relative;
        }
        video {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: translate(-50%, -50%);
          z-index: 0;
        }
        #label {
          position: fixed;
          top: 80px; /* Adjusted for header */
          left: 15px;
          font-size: 14px;
          opacity: 0.85;
          z-index: 2;
          background: rgba(0,0,0,0.4);
          padding: 6px 10px;
          border-radius: 6px;
          color: white;
        }
        #ui {
          position: fixed;
          bottom: 20px;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 10px;
          z-index: 2;
          padding: 0 1rem;
        }
        input {
          width: 55%;
          max-width: 600px;
          padding: 12px;
          border-radius: 8px;
          border: none;
          font-size: 16px;
          outline: none;
          color: #333;
        }
        button {
          padding: 12px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          background: #5c7cfa;
          color: white;
          font-size: 16px;
        }
        button:hover {
          background: #4c6ef5;
        }
      `}</style>

      <div className="ai-avatar-page-container">
        <div className="container">
            <div id="label">
            Avatar activo: <span>{avatars[activeAvatar as keyof typeof avatars].label}</span>
            </div>

            <video ref={videoRef} id="avatarVideo" autoPlay muted loop playsInline key={activeAvatar}>
            <source src={avatars[activeAvatar as keyof typeof avatars].video} type="video/mp4" />
            Tu navegador no soporta video.
            </video>

            <div id="ui">
            <input
                id="text"
                placeholder="Escribí tu consulta..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Hablar</button>
            <button onClick={switchAvatar}>Cambiar avatar</button>
            <Link href="/"><button>Volver al Dashboard</button></Link>
            </div>
        </div>
      </div>
    </>
  );
}
