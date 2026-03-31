/**
 * @fileOverview Client-side Image Watermarking Engine for CRUSHOME
 * Processes images via HTML5 Canvas before uploading to Firebase Storage.
 */

export const applyWatermark = async (
  imageFile: File,
  watermarkUrl: string = '/images/watermark.png' // Ruta por defecto del logo en public folder
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const watermark = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve(imageFile); // Fallback: no canvas support
      return;
    }

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Dibujar imagen original
      ctx.drawImage(img, 0, 0);

      watermark.crossOrigin = 'Anonymous';
      watermark.onload = () => {
        // Redimensionar Watermark a un tamaño proporcional (ej: 20% del ancho base de la foto)
        const scaleFactor = 0.20;
        let watermarkWidth = img.width * scaleFactor;
        
        // Prevenir logos minúsculos en imágenes chicas
        if (watermarkWidth < 150) watermarkWidth = 150; 
        
        const ratio = watermark.width / watermark.height;
        const watermarkHeight = watermarkWidth / ratio;
        
        const paddingX = 40; // px desde borde
        const paddingY = 40;
        
        // Posicionar Abajo a la Derecha (Bottom-Right)
        const x = canvas.width - watermarkWidth - paddingX;
        const y = canvas.height - watermarkHeight - paddingY;

        // Efecto Translúcido Profesional (75% Opacidad)
        ctx.globalAlpha = 0.75;
        
        // Sombra suave para que el loco blanco de CRUSHOME asalte bien sobre paredes blancas
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Imprimir Sello Magnético
        ctx.drawImage(watermark, x, y, watermarkWidth, watermarkHeight);
        
        // Reset efectos
        ctx.globalAlpha = 1.0;
        ctx.shadowColor = "transparent";

        // Convertir lienzo sellado nuevamente en Archivo File
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resultingFile = new File([blob], `wm_${imageFile.name}`, {
                type: imageFile.type,
                lastModified: Date.now()
              });
              resolve(resultingFile);
            } else {
              resolve(imageFile); // Fallback silencioso vital
            }
          },
          imageFile.type,
          0.90 // Compresión ligera en JPEG/WEBP
        );
      };

      watermark.onerror = () => {
        // Si no existe logo o hay bloqueo CORS (desarrollo), se omite
        console.warn("Watermark fail - bypassing.");
        resolve(imageFile);
      };

      watermark.src = watermarkUrl;
    };

    img.onerror = () => {
      resolve(imageFile); // Proteger experiencia del broker
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) img.src = e.target.result as string;
    };
    reader.readAsDataURL(imageFile);
  });
};
