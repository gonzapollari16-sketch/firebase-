'use client';
import { useEffect } from 'react';

interface AuditEntry {
  ts: string;
  event: string;
  payload: Record<string, unknown>;
}

export default function SharePropertyPage() {
  
  useEffect(() => {
    /* ======================== MOCK DATA ======================== */
    let property = {
      id: "prop_9fa23d",
      title: "Venta PH Barrio Los Paraísos",
      description: "PH reciclado en venta Barrio Los Paraísos ubicado sobre calle Eduardo Marquino. Combina funcionalidad y excelente ubicación.",
      price: 135000,
      currency: "USD",
      operation: "Venta",
      type: "PH",
      bedrooms: 2,
      bathrooms: 1,
      areaTotal: 78,
      areaCovered: 65,
      status: "active", // active | reserved | sold | paused
      address: {
        street: "Eduardo Marquino",
        number: "1234",
        neighborhood: "Barrio Los Paraísos",
        city: "Córdoba",
        province: "Córdoba",
        geoConfidence: 0.96
      },
      coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
      broker: {
        name: "GVAMAX Inmobiliaria",
        phone: "+5493510000000",
        email: "info@gvamax.com.ar",
        website: "https://www.gvamax.com.ar",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Commons-logo.svg/512px-Commons-logo.svg.png"
      },
      plan: {
        allowUnbrandedLinks: true,
        allowMLSShare: true,
        allowWhiteLabel: false
      },
      mls: {
        canonicalId: "MLS-AR-CBA-0002983",
        adapters: ["argenprop", "zonaprop", "mercadolibre", "remax", "properati"]
      },
      version: 7,
      updatedAt: new Date().toISOString()
    };

    /* ======================== CONFIG ======================== */

    const CRUSHOME_DOMAIN = "https://crushome.ai";
    const SHARE_PATH = "/p/";
    const SHARE_VERSION = "v3";
    const MIN_GEO_CONFIDENCE = 0.7;

    /* ======================== STATE ======================== */

    let shareMode = "withBrand"; // withBrand | withoutBrand
    let currentShareLink = "";
    let auditLog: AuditEntry[] = [];

    /* ======================== DOM ======================== */

    const propertyImageEl = document.getElementById("propertyImage");
    const propertyTitleEl = document.getElementById("propertyTitle");
    const propertyLocationEl = document.getElementById("propertyLocation");
    const propertyPriceEl = document.getElementById("propertyPrice");
    const propertyMetaEl = document.getElementById("propertyMeta");
    const propertyStatusBadgeEl = document.getElementById("propertyStatusBadge");
    const geoConfidenceChipEl = document.getElementById("geoConfidenceChip");

    const btnWithBrand = document.getElementById("btnWithBrand");
    const btnWithoutBrand = document.getElementById("btnWithoutBrand");
    const shareLinkInput = document.getElementById("shareLinkInput");
    const copyBtn = document.getElementById("copyBtn");
    const whatsappBtn = document.getElementById("whatsappBtn");
    const nativeShareBtn = document.getElementById("nativeShareBtn");
    const emailBtn = document.getElementById("emailBtn");
    const qrBtn = document.getElementById("qrBtn");
    const copySecondaryBtn = document.getElementById("copySecondaryBtn");
    const openPreviewBtn = document.getElementById("openPreviewBtn");
    const auditBtn = document.getElementById("auditBtn");
    const regenerateBtn = document.getElementById("regenerateBtn");

    const logPanel = document.getElementById("logPanel");

    const qrModalBackdrop = document.getElementById("qrModalBackdrop");
    const qrCanvas = document.getElementById("qrCanvas");
    const closeQrBtn = document.getElementById("closeQrBtn");

    const adminToggle = document.getElementById("adminToggle");
    const adminPanel = document.getElementById("adminPanel");
    const adminTitleInput = document.getElementById("adminTitleInput") as HTMLInputElement;
    const adminPriceInput = document.getElementById("adminPriceInput") as HTMLInputElement;
    const adminStatusSelect = document.getElementById("adminStatusSelect") as HTMLSelectElement;
    const adminImageInput = document.getElementById("adminImageInput") as HTMLInputElement;
    const adminNeighborhoodInput = document.getElementById("adminNeighborhoodInput") as HTMLInputElement;
    const adminGeoConfidenceInput = document.getElementById("adminGeoConfidenceInput") as HTMLInputElement;
    const adminApplyBtn = document.getElementById("adminApplyBtn");

    /* ======================== UTILITIES ======================== */

    function formatPrice(value: number, currency: string) {
      const nf = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 0
      });
      return nf.format(value);
    }

    function slugify(text: string | number) {
      return text
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    function generateToken() {
      return Math.random().toString(36).substring(2, 12) +
             Math.random().toString(36).substring(2, 12);
    }

    function clamp(n: number, min: number, max: number) {
      return Math.max(min, Math.min(max, n));
    }

    function log(event: string, payload: Record<string, unknown> = {}) {
      const entry: AuditEntry = {
        ts: new Date().toISOString(),
        event,
        payload
      };
      auditLog.unshift(entry);
      if (auditLog.length > 200) auditLog.pop();
      renderLog();
      console.log("[CRUSHOME SHARE]", entry);
    }

    function renderLog() {
      if(!logPanel) return;
      logPanel.innerHTML = auditLog
        .slice(0, 50)
        .map(e => `<div class="log-entry"><span>${e.event}</span> — ${JSON.stringify(e.payload)}</div>`)
        .join("");
    }

    /* ======================== GEO CONFIDENCE ENGINE ======================== */

    function renderGeoConfidence(confidence: number) {
        if(!geoConfidenceChipEl) return;
      const pct = Math.round(confidence * 100);
      geoConfidenceChipEl.textContent = `📍 Barrio detectado ${pct}%`;

      geoConfidenceChipEl.classList.remove("confidence-high", "confidence-medium", "confidence-low");

      if (confidence >= 0.9) geoConfidenceChipEl.classList.add("confidence-high");
      else if (confidence >= MIN_GEO_CONFIDENCE) geoConfidenceChipEl.classList.add("confidence-medium");
      else geoConfidenceChipEl.classList.add("confidence-low");

      if (confidence < MIN_GEO_CONFIDENCE) {
        log("geo_confidence_block", { confidence });
      }
    }

    /* ======================== STATUS ENGINE ======================== */

    function renderStatus(status: string) {
      if(!propertyStatusBadgeEl) return;
      propertyStatusBadgeEl.classList.remove("status-active", "status-reserved", "status-sold");

      if (status === "active") {
        propertyStatusBadgeEl.textContent = "Activa";
        propertyStatusBadgeEl.classList.add("status-active");
      } else if (status === "reserved") {
        propertyStatusBadgeEl.textContent = "Reservada";
        propertyStatusBadgeEl.classList.add("status-reserved");
      } else if (status === "sold") {
        propertyStatusBadgeEl.textContent = "Vendida";
        propertyStatusBadgeEl.classList.add("status-sold");
      } else {
        propertyStatusBadgeEl.textContent = "Pausada";
        propertyStatusBadgeEl.classList.add("status-sold");
      }
    }

    /* ======================== SHARE LINK ENGINE ======================== */
    function generateShareLink(mode = "withBrand") {
      const base = `${CRUSHOME_DOMAIN}${SHARE_PATH}${property.id}`;
      const token = generateToken();
      const slug = slugify(property.title);

      const params = new URLSearchParams();

      params.set("v", SHARE_VERSION);
      params.set("slug", slug);
      params.set("token", token);
      params.set("ts", String(Date.now()));
      params.set("mode", mode);
      params.set("state", property.status);
      params.set("price", String(property.price));
      params.set("geo_conf", property.address.geoConfidence.toFixed(2));
      params.set("src", "share");
      params.set("brand", "crushome");

      if (mode === "withBrand") {
        params.set("broker", slugify(property.broker.name));
        if(property.broker.website) params.set("broker_site", property.broker.website);
      }

      if (mode === "withoutBrand") {
        params.set("mls", "true");
        if(property.mls.canonicalId) params.set("canonical", property.mls.canonicalId);
      }

      params.set("utm_source", "crushome");
      params.set("utm_medium", "share");
      params.set("utm_campaign", mode === "withBrand" ? "broker_share" : "mls_share");

      const link = `${base}?${params.toString()}`;

      log("share_link_generated", {
        mode,
        link,
        token,
        version: property.version
      });

      return link;
    }

    /* ======================== OPEN GRAPH ENGINE ======================== */

    function updateOpenGraph(link: string) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');

      if(ogTitle) ogTitle.setAttribute("content", property.title);
      if(ogDescription) ogDescription.setAttribute("content", property.description);
      if(ogImage) ogImage.setAttribute("content", property.coverImage);
      if(ogUrl) ogUrl.setAttribute("content", link);

      log("open_graph_updated", {
        title: property.title,
        image: property.coverImage,
        url: link
      });
    }

    /* ======================== QR ENGINE ======================== */

    function generateQRCode(text: string) {
      const canvas = document.createElement("canvas");
      const size = 200;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if(!ctx) return canvas;

      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#000";

      for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 21; x++) {
          if (Math.random() > 0.55) {
            ctx.fillRect(x * 9 + 10, y * 9 + 10, 7, 7);
          }
        }
      }

      return canvas;
    }

    /* ======================== SHARE HANDLERS ======================== */

    function copyToClipboard(text: string) {
      navigator.clipboard.writeText(text).then(() => {
        log("clipboard_copy", { link: text });
        alert("Link copiado al portapapeles");
      });
    }

    function openWhatsAppShare(link: string) {
      const msg = encodeURIComponent(`Mirá esta propiedad:\n${link}`);
      const url = `https://wa.me/?text=${msg}`;
      window.open(url, "_blank");
      log("share_whatsapp", { link });
    }

    function openEmailShare(link: string) {
      const subject = encodeURIComponent("Propiedad en CRUSHOME");
      const body = encodeURIComponent(`Te comparto esta propiedad:\n\n${link}`);
      window.open(`mailto:?subject=${subject}&body=${body}`);
      log("share_email", { link });
    }

    async function openNativeShare(link: string) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: property.title,
            text: "Mirá esta propiedad en CRUSHOME",
            url: link
          });
          log("share_native", { link });
        } catch (err) {
            if (err instanceof Error) {
                 log("share_native_cancel", { error: err.message });
            }
        }
      } else {
        copyToClipboard(link);
      }
    }

    /* ======================== UI RENDER ======================== */

    function renderProperty() {
      if(propertyImageEl) (propertyImageEl as HTMLElement).style.backgroundImage = `url('${property.coverImage}')`;
      if(propertyTitleEl) propertyTitleEl.textContent = property.title;
      if(propertyLocationEl) propertyLocationEl.textContent = `${property.address.neighborhood}, ${property.address.city}, ${property.address.province}`;
      if(propertyPriceEl) propertyPriceEl.textContent = formatPrice(property.price, property.currency);

      if(propertyMetaEl) propertyMetaEl.innerHTML = `
        <div class="meta-chip">${property.operation}</div>
        <div class="meta-chip">${property.type}</div>
        <div class="meta-chip">${property.bedrooms} dorm</div>
        <div class="meta-chip">${property.bathrooms} baño${property.bathrooms > 1 ? "s" : ""}</div>
        <div class="meta-chip">${property.areaTotal} m²</div>
      `;

      renderStatus(property.status);
      renderGeoConfidence(property.address.geoConfidence);

      updateShareLink();
    }

    /* ======================== SHARE MODE ======================== */

    function setShareMode(mode: string) {
      if (mode === "withoutBrand" && !property.plan.allowUnbrandedLinks) {
        alert("Tu plan no permite links sin marca.");
        log("share_mode_blocked_plan", { mode });
        return;
      }

      shareMode = mode;

      if(btnWithBrand) btnWithBrand.classList.toggle("active", mode === "withBrand");
      if(btnWithoutBrand) btnWithoutBrand.classList.toggle("active", mode === "withoutBrand");

      updateShareLink();
      log("share_mode_changed", { mode });
    }

    /* ======================== LINK UPDATE ======================== */

    function updateShareLink() {
      const shareLinkInputAsInput = shareLinkInput as HTMLInputElement;
      if (property.address.geoConfidence < MIN_GEO_CONFIDENCE) {
        if(shareLinkInputAsInput) shareLinkInputAsInput.value = "⚠️ Link bloqueado — baja confianza geográfica";
        log("share_link_blocked_geo_confidence", {
          confidence: property.address.geoConfidence
        });
        return;
      }

      const link = generateShareLink(shareMode);
      currentShareLink = link;
      if(shareLinkInputAsInput) shareLinkInputAsInput.value = link;
      updateOpenGraph(link);
    }
    
    /* ======================== ADMIN PANEL ======================== */

    function toggleAdminPanel() {
      if(adminPanel) adminPanel.style.display = adminPanel.style.display === "flex" ? "none" : "flex";
    }

    function applyAdminChanges() {
      const newTitle = adminTitleInput.value.trim();
      const newPrice = parseFloat(adminPriceInput.value);
      const newStatus = adminStatusSelect.value;
      const newImage = adminImageInput.value.trim();
      const newNeighborhood = adminNeighborhoodInput.value.trim();
      const newGeoConfidence = parseFloat(adminGeoConfidenceInput.value);

      const changes: Record<string, unknown> = {};

      if (newTitle) {
        property.title = newTitle;
        changes['title'] = newTitle;
      }

      if (!isNaN(newPrice) && newPrice > 0) {
        property.price = newPrice;
        changes['price'] = newPrice;
      }

      if (newStatus) {
        property.status = newStatus;
        changes['status'] = newStatus;
      }

      if (newImage) {
        property.coverImage = newImage;
        changes['coverImage'] = newImage;
      }

      if (newNeighborhood) {
        property.address.neighborhood = newNeighborhood;
        changes['neighborhood'] = newNeighborhood;
      }

      if (!isNaN(newGeoConfidence)) {
        property.address.geoConfidence = clamp(newGeoConfidence, 0, 1);
        changes['geoConfidence'] = property.address.geoConfidence;
      }

      if (Object.keys(changes).length > 0) {
        property.updatedAt = new Date().toISOString();
        property.version += 1;
        renderProperty();
        log("admin_property_updated", changes);
      }
    }

    /* ======================== EVENT LISTENERS ======================== */
    if (btnWithBrand) btnWithBrand.addEventListener("click", () => setShareMode("withBrand"));
    if (btnWithoutBrand) btnWithoutBrand.addEventListener("click", () => setShareMode("withoutBrand"));

    if (copyBtn) copyBtn.addEventListener("click", () => copyToClipboard(currentShareLink));
    if (copySecondaryBtn) copySecondaryBtn.addEventListener("click", () => copyToClipboard(currentShareLink));
    if (whatsappBtn) whatsappBtn.addEventListener("click", () => openWhatsAppShare(currentShareLink));
    if (emailBtn) emailBtn.addEventListener("click", () => openEmailShare(currentShareLink));
    if (nativeShareBtn) nativeShareBtn.addEventListener("click", () => openNativeShare(currentShareLink));
    if (qrBtn) qrBtn.addEventListener("click", () => {
      if(qrCanvas) qrCanvas.innerHTML = "";
      const qr = generateQRCode(currentShareLink);
      if(qrCanvas) qrCanvas.appendChild(qr);
      if(qrModalBackdrop) qrModalBackdrop.style.display = "flex";
      log("qr_opened", { link: currentShareLink });
    });
    if (closeQrBtn) closeQrBtn.addEventListener("click", () => {
      if(qrModalBackdrop) qrModalBackdrop.style.display = "none";
    });

    if (adminToggle) adminToggle.addEventListener("click", toggleAdminPanel);
    if (adminApplyBtn) adminApplyBtn.addEventListener("click", applyAdminChanges);

    /* ======================== INITIALIZATION ======================== */

    function initAdminInputs() {
      if(adminTitleInput) adminTitleInput.value = property.title;
      if(adminPriceInput) adminPriceInput.value = String(property.price);
      if(adminStatusSelect) adminStatusSelect.value = property.status;
      if(adminImageInput) adminImageInput.value = property.coverImage;
      if(adminNeighborhoodInput) adminNeighborhoodInput.value = property.address.neighborhood;
      if(adminGeoConfidenceInput) adminGeoConfidenceInput.value = String(property.address.geoConfidence);
    }

    function init() {
      renderProperty();
      initAdminInputs();
      log("share_module_initialized", {
        propertyId: property.id,
        version: property.version,
        plan: property.plan
      });
    }

    init();

  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --crushome-pink: #FF4FD8;
          --crushome-violet: #7B4DFF;
          --crushome-blue: #4F6BFF;
          --crushome-dark: #0E1026;
          --crushome-bg: #0b0d1c;
          --crushome-card: #12152a;
          --crushome-border: rgba(255,255,255,0.08);
          --crushome-text: #e6e6f0;
          --crushome-muted: #9aa0c3;
          --crushome-success: #3ddc97;
          --crushome-warning: #ffb020;
          --crushome-danger: #ff5c5c;
        }

        * {
          box-sizing: border-box;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .share-property-page {
          background: radial-gradient(1200px 600px at 20% -10%, #1a1d3a 0%, var(--crushome-bg) 55%);
          color: var(--crushome-text);
          min-height: 100vh;
        }

        h1,h2,h3,h4 {
          margin: 0;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .container {
          max-width: 1150px;
          margin: 0 auto;
          padding: 28px 20px 80px;
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }

        .brand-badge {
          padding: 6px 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--crushome-pink), var(--crushome-violet), var(--crushome-blue));
          color: white;
          font-weight: 700;
          letter-spacing: 0.06em;
          font-size: 12px;
          box-shadow: 0 6px 22px rgba(123,77,255,.35);
        }

        .brand-title {
          font-size: 20px;
          font-weight: 700;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }

        .card {
          background: linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.01));
          border: 1px solid var(--crushome-border);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 12px 30px rgba(0,0,0,.25);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .card-title {
          font-size: 16px;
          font-weight: 700;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
        }

        .status-active { background: rgba(61,220,151,.15); color: var(--crushome-success); border: 1px solid rgba(61,220,151,.35); }
        .status-reserved { background: rgba(255,176,32,.15); color: var(--crushome-warning); border: 1px solid rgba(255,176,32,.35); }
        .status-sold { background: rgba(255,92,92,.15); color: var(--crushome-danger); border: 1px solid rgba(255,92,92,.35); }

        .property-preview {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 16px;
          align-items: stretch;
        }

        @media (max-width: 600px) {
          .property-preview {
            grid-template-columns: 1fr;
          }
        }

        .property-image {
          border-radius: 12px;
          background-size: cover;
          background-position: center;
          min-height: 140px;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.05);
        }

        .property-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.45));
        }

        .property-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 10px;
        }

        .property-title {
          font-size: 17px;
          font-weight: 700;
          line-height: 1.2;
        }

        .property-location {
          font-size: 13px;
          color: var(--crushome-muted);
        }

        .property-price {
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--crushome-pink), var(--crushome-violet), var(--crushome-blue));
          -webkit-background-clip: text;
          color: transparent;
        }

        .property-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 12px;
          color: var(--crushome-muted);
        }

        .meta-chip {
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.03);
        }

        .share-section {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .share-mode-toggle {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .toggle-btn {
          flex: 1;
          min-width: 180px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid var(--crushome-border);
          background: rgba(255,255,255,.03);
          color: var(--crushome-text);
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: .18s ease;
          position: relative;
        }

        .toggle-btn:hover {
          transform: translateY(-1px);
          border-color: rgba(255,255,255,.2);
          background: rgba(255,255,255,.06);
        }

        .toggle-btn.active {
          background: linear-gradient(135deg, rgba(255,79,216,.18), rgba(123,77,255,.18), rgba(79,107,255,.18));
          border-color: rgba(123,77,255,.45);
          box-shadow: 0 6px 22px rgba(123,77,255,.25);
        }

        .toggle-sub {
          position: absolute;
          bottom: -16px;
          font-size: 10px;
          color: var(--crushome-muted);
          opacity: .85;
        }

        .link-box {
          display: flex;
          gap: 10px;
          align-items: stretch;
        }

        .link-input {
          flex: 1;
          background: rgba(0,0,0,.35);
          border: 1px solid var(--crushome-border);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 13px;
          color: var(--crushome-text);
          outline: none;
        }

        .link-input:focus {
          border-color: rgba(123,77,255,.5);
          box-shadow: 0 0 0 2px rgba(123,77,255,.2);
        }

        .btn {
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid var(--crushome-border);
          background: rgba(255,255,255,.06);
          color: white;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: .18s ease;
          white-space: nowrap;
        }

        .btn:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,.1);
          border-color: rgba(255,255,255,.25);
        }

        .btn.primary {
          background: linear-gradient(135deg, var(--crushome-pink), var(--crushome-violet), var(--crushome-blue));
          border: none;
          box-shadow: 0 10px 28px rgba(123,77,255,.35);
        }

        .btn.primary:hover {
          filter: brightness(1.05);
          transform: translateY(-1px) scale(1.01);
        }

        .btn.secondary {
          background: rgba(255,255,255,.04);
        }

        .btn.ghost {
          background: transparent;
        }

        .share-actions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        @media (max-width: 600px) {
          .share-actions {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .action-btn {
          padding: 12px 10px;
          border-radius: 12px;
          border: 1px solid var(--crushome-border);
          background: rgba(255,255,255,.04);
          color: white;
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: .16s ease;
          text-align: center;
        }

        .action-btn:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,.08);
          border-color: rgba(255,255,255,.25);
        }

        .action-btn.whatsapp {
          background: linear-gradient(135deg, #25D366, #1ebe5d);
          border: none;
          box-shadow: 0 8px 22px rgba(37,211,102,.35);
        }

        .action-btn.copy {
          background: linear-gradient(135deg, #00c2ff, #007bff);
          border: none;
          box-shadow: 0 8px 22px rgba(0,123,255,.35);
        }

        .action-btn.qr {
          background: linear-gradient(135deg, #ffb020, #ff7a18);
          border: none;
          box-shadow: 0 8px 22px rgba(255,176,32,.35);
        }

        .action-btn.email {
          background: linear-gradient(135deg, #ff4fd8, #7b4dff);
          border: none;
          box-shadow: 0 8px 22px rgba(123,77,255,.35);
        }

        .action-btn.share {
          background: linear-gradient(135deg, #4f6bff, #7b4dff);
          border: none;
          box-shadow: 0 8px 22px rgba(79,107,255,.35);
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
          margin: 10px 0;
        }

        .hint {
          font-size: 12px;
          color: var(--crushome-muted);
          line-height: 1.4;
        }

        .confidence-chip {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .04em;
          border: 1px solid rgba(255,255,255,.2);
          background: rgba(255,255,255,.05);
          color: var(--crushome-muted);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .confidence-high { color: var(--crushome-success); border-color: rgba(61,220,151,.4); background: rgba(61,220,151,.1); }
        .confidence-medium { color: var(--crushome-warning); border-color: rgba(255,176,32,.4); background: rgba(255,176,32,.1); }
        .confidence-low { color: var(--crushome-danger); border-color: rgba(255,92,92,.4); background: rgba(255,92,92,.1); }

        .qr-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.65);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .qr-modal {
          background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 16px;
          padding: 20px 22px 22px;
          max-width: 360px;
          width: 92%;
          box-shadow: 0 24px 60px rgba(0,0,0,.45);
          text-align: center;
        }

        .qr-modal h3 {
          margin-bottom: 8px;
        }

        .qr-canvas {
          margin: 16px auto 12px;
          width: 220px;
          height: 220px;
          background: white;
          border-radius: 10px;
          padding: 10px;
          box-shadow: 0 8px 22px rgba(0,0,0,.35);
        }

        .qr-modal .btn {
          margin-top: 10px;
          width: 100%;
        }

        .log-panel {
          background: rgba(0,0,0,.35);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 12px;
          padding: 14px;
          font-size: 11px;
          color: var(--crushome-muted);
          max-height: 160px;
          overflow-y: auto;
          line-height: 1.45;
        }

        .log-entry {
          margin-bottom: 4px;
        }

        .log-entry span {
          color: white;
          font-weight: 600;
        }

        .admin-panel {
          display: none;
          margin-top: 18px;
          border-top: 1px dashed rgba(255,255,255,.15);
          padding-top: 16px;
          gap: 12px;
          flex-direction: column;
        }

        .admin-toggle {
          font-size: 11px;
          color: var(--crushome-muted);
          cursor: pointer;
          text-decoration: underline;
          align-self: flex-end;
        }

        .admin-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        @media (max-width: 600px) {
          .admin-grid {
            grid-template-columns: 1fr;
          }
        }

        .admin-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .admin-field label {
          font-size: 11px;
          color: var(--crushome-muted);
        }

        .admin-field input, .admin-field select {
          background: rgba(0,0,0,.4);
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 10px;
          padding: 8px 10px;
          color: white;
          font-size: 12px;
          outline: none;
        }

        .admin-field input:focus, .admin-field select:focus {
          border-color: rgba(123,77,255,.5);
          box-shadow: 0 0 0 2px rgba(123,77,255,.2);
        }

        .footer {
          margin-top: 28px;
          font-size: 11px;
          color: var(--crushome-muted);
          text-align: center;
        }

        .footer span {
          font-weight: 700;
          background: linear-gradient(135deg, var(--crushome-pink), var(--crushome-violet), var(--crushome-blue));
          -webkit-background-clip: text;
          color: transparent;
        }
      `}</style>
      <div className="share-property-page">
        <div className="container">
          <div className="brand-header">
            <div className="brand-badge">CRUSHOME</div>
            <div className="brand-title">Compartir propiedad</div>
          </div>

          <div className="grid">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Vista previa de la propiedad</div>
                <div id="propertyStatusBadge" className="status-badge status-active">Activa</div>
              </div>

              <div className="property-preview">
                <div id="propertyImage" className="property-image" style={{backgroundImage: "url('')"}}></div>

                <div className="property-info">
                  <div>
                    <div id="propertyTitle" className="property-title"></div>
                    <div id="propertyLocation" className="property-location"></div>
                  </div>

                  <div className="property-price" id="propertyPrice"></div>

                  <div className="property-meta" id="propertyMeta"></div>

                  <div style={{display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center'}}>
                    <div id="geoConfidenceChip" className="confidence-chip confidence-high">
                      📍 Barrio detectado 96%
                    </div>
                    <div className="confidence-chip">
                      🔒 Link firmado
                    </div>
                    <div className="confidence-chip">
                      🧠 IA validada
                    </div>
                  </div>

                </div>
              </div>

              <div className="divider"></div>

              <div className="hint">
                Esta es la preview exacta que verá el receptor en WhatsApp, redes sociales y navegadores,
                incluyendo <b>foto de portada</b>, <b>título</b>, <b>precio</b> y <b>branding CRUSHOME</b>.
              </div>

              <div className="admin-toggle" id="adminToggle">Modo admin</div>

              <div id="adminPanel" className="admin-panel">
                <div className="admin-grid">
                  <div className="admin-field">
                    <label>Título propiedad</label>
                    <input id="adminTitleInput" />
                  </div>
                  <div className="admin-field">
                    <label>Precio</label>
                    <input id="adminPriceInput" />
                  </div>
                  <div className="admin-field">
                    <label>Estado</label>
                    <select id="adminStatusSelect">
                      <option value="active">Activa</option>
                      <option value="reserved">Reservada</option>
                      <option value="sold">Vendida</option>
                      <option value="paused">Pausada</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>URL imagen portada</label>
                    <input id="adminImageInput" />
                  </div>
                  <div className="admin-field">
                    <label>Barrio</label>
                    <input id="adminNeighborhoodInput" />
                  </div>
                  <div className="admin-field">
                    <label>Confidence geo (0–1)</label>
                    <input id="adminGeoConfidenceInput" type="number" step="0.01" min="0" max="1" />
                  </div>
                </div>
                <button id="adminApplyBtn" className="btn primary" style={{marginTop:'12px'}}>
                  Aplicar cambios (recalcula links + OG + tracking)
                </button>
              </div>
            </div>

            <div className="card share-section">
              <div className="card-header">
                <div className="card-title">Opciones de difusión</div>
              </div>

              <div className="share-mode-toggle">
                <div id="btnWithBrand" className="toggle-btn active">
                  🏢 Con datos inmobiliaria
                  <div className="toggle-sub">Broker / Marca visible</div>
                </div>
                <div id="btnWithoutBrand" className="toggle-btn">
                  🕶️ Sin datos inmobiliaria
                  <div className="toggle-sub">Modo colaboración MLS</div>
                </div>
              </div>

              <div className="link-box">
                <input id="shareLinkInput" className="link-input" readOnly />
                <button id="copyBtn" className="btn primary">📋 Copiar</button>
              </div>

              <div className="hint">
                El link incluye automáticamente:
                <b>foto portada</b>, <b>branding CRUSHOME</b>, <b>tracking UTM</b>,
                <b>token antifraude</b>, <b>modo MLS</b> y <b>versionado</b>.
              </div>

              <div className="share-actions">
                <button id="whatsappBtn" className="action-btn whatsapp">📲 WhatsApp</button>
                <button id="nativeShareBtn" className="action-btn share">📤 Compartir</button>
                <button id="emailBtn" className="action-btn email">✉️ Email</button>
                <button id="qrBtn" className="action-btn qr">🔳 QR</button>
                <button id="copySecondaryBtn" className="action-btn copy">📎 Copiar link</button>
                <button id="openPreviewBtn" className="action-btn">👁️ Preview</button>
                <button id="auditBtn" className="action-btn">🧾 Auditoría</button>
                <button id="regenerateBtn" className="action-btn">🔁 Regenerar</button>
              </div>

              <div className="divider"></div>

              <div>
                <div className="card-title" style={{fontSize:'13px',marginBottom:'6px'}}>Telemetría de difusión</div>
                <div id="logPanel" className="log-panel"></div>
              </div>
            </div>
          </div>

          <div className="footer">
            Powered by <span>CRUSHOME</span> · Smart Property Distribution Engine™
          </div>
        </div>

        <div id="qrModalBackdrop" className="qr-modal-backdrop">
          <div className="qr-modal">
            <h3>QR de la propiedad</h3>
            <div id="qrCanvas" className="qr-canvas"></div>
            <div className="hint">Escaneá para abrir la ficha pública de la propiedad.</div>
            <button id="closeQrBtn" className="btn secondary">Cerrar</button>
          </div>
        </div>
      </div>
    </>
  );
}
