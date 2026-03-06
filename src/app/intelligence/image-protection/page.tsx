'use client';

export default function ImageProtectionPage() {
  return (
    <>
      <style jsx>{`
        .image-protection-page { 
            font-family: Inter, Arial, sans-serif; 
            background:#0f1115; 
            color:#eaeaf0; 
            line-height:1.6; 
            padding:40px; 
        }
        h1,h2,h3 { color:#7dd3fc; }
        h1 { font-size: 2rem; margin-bottom: 1rem; }
        h2 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; }
        section { margin-bottom:48px; }
        .card { background:#151923; border-radius:14px; padding:24px; margin-top:16px; box-shadow:0 10px 30px rgba(0,0,0,.35); }
        code, pre { background:#0b0d12; color:#c7d2fe; padding:12px; border-radius:10px; display:block; overflow-x:auto; }
        ul { padding-left: 1.5rem; }
        ul li { margin-bottom:10px; }
        .tag { display:inline-block; background:#1e293b; color:#93c5fd; padding:4px 10px; border-radius:999px; font-size:12px; margin-right:6px; }
      `}</style>
      <div className="image-protection-page">
        <h1>CRUSHOME – Sistema de Protección de Imágenes & Watermarking</h1>
        <p>Este documento define la implementación operativa real del sistema de descarga de imágenes con protección de activos visuales para CRUSHOME.</p>

        <section>
          <h2>Pipeline obligatorio de entrega de imágenes</h2>
          <div className="card">
            <pre>{`User → CDN → Image Gateway → Watermark Engine → Forensic Logger → Signed Output`}</pre>
            <p><span className="tag">Backend obligatorio</span><span className="tag">No bypass</span><span className="tag">Anti-scraping</span></p>
          </div>
        </section>

        <section>
          <h2>1️⃣ Watermark visible + invisible (esteganográfico)</h2>
          <div className="card">
            <ul>
              <li>Overlay visible con logo CRUSHOME (opacidad y posición variable).</li>
              <li>Marca invisible esteganográfica con ID de usuario, propiedad y timestamp.</li>
              <li>Persistente ante resize y recompression.</li>
            </ul>
            <pre>{`WM_VISIBLE + WM_STEGANOGRAPHIC(user_id, property_id, hash)`}</pre>
          </div>
        </section>

        <section>
          <h2>2️⃣ Forensic tracking por hash</h2>
          <div className="card">
            <ul>
              <li>Hash SHA-256 generado por imagen entregada.</li>
              <li>Registro en tabla forensic_logs.</li>
              <li>Permite rastrear filtraciones externas.</li>
            </ul>
            <pre>{`{ image_id, user_id, hash, ip, timestamp }`}</pre>
          </div>
        </section>

        <section>
          <h2>3️⃣ Variación dinámica anti-crop</h2>
          <div className="card">
            <ul>
              <li>Posición del watermark rotada aleatoriamente.</li>
              <li>Opacidad variable entre 20% y 40%.</li>
              <li>Escala dependiente del formato final.</li>
            </ul>
            <pre>{`gravity = random(["southeast","center","northwest"])}`}</pre>
          </div>
        </section>

        <section>
          <h2>4️⃣ Nunca servir el original</h2>
          <div className="card">
            <ul>
              <li>El archivo original queda en cold storage.</li>
              <li>Siempre se genera una versión rasterizada derivada.</li>
              <li>Bloqueo total de URLs públicas.</li>
            </ul>
            <pre>{`original.jpg ❌ → derived_wm_v3.jpg ✅`}</pre>
          </div>
        </section>

        <section>
          <h2>5️⃣ Detección automática de leaks</h2>
          <div className="card">
            <ul>
              <li>Escaneo periódico en Google Lens / Bing Visual Search.</li>
              <li>Matching por fingerprint perceptual.</li>
              <li>Alertas automáticas al dashboard admin.</li>
            </ul>
            <pre>{`cron → reverse_search → match → alert`}</pre>
          </div>
        </section>

        <section>
          <h2>6️⃣ Watermark contextual por tenant / campaña</h2>
          <div className="card">
            <ul>
              <li>Logo CRUSHOME + branding del tenant.</li>
              <li>Texto dinámico por campaña o listing.</li>
              <li>Soporte multi-idioma.</li>
            </ul>
            <pre>{`CRUSHOME | Inmobiliaria X | Campaña Premium`}</pre>
          </div>
        </section>

        <section>
          <h2>7️⃣ Rate limit de descargas</h2>
          <div className="card">
            <ul>
              <li>Límites por usuario, IP y propiedad.</li>
              <li>Protección contra scraping masivo.</li>
              <li>Bloqueos progresivos.</li>
            </ul>
            <pre>{`5 descargas / 10 min / propiedad`}</pre>
          </div>
        </section>

        <section>
          <h2>8️⃣ Fricción frontend anti-guardado</h2>
          <div className="card">
            <ul>
              <li>Deshabilitar click derecho.</li>
              <li>Canvas rendering sin src directo.</li>
              <li>Overlay informativo de propiedad intelectual.</li>
            </ul>
            <pre>{`event.preventDefault()`}</pre>
          </div>
        </section>

        <section>
          <h2>Estado final del sistema</h2>
          <div className="card">
            <ul>
              <li>Protección legal y técnica de activos visuales.</li>
              <li>Branding persistente CRUSHOME.</li>
              <li>Auditoría y rastreo forense completo.</li>
              <li>Listo para producción enterprise.</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
