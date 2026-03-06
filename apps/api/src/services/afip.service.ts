/**
 * @fileOverview Integración AFIP (Mock Implementation).
 * Reemplaza la dependencia fallida 'afip.js' para asegurar la compilación del build.
 */

export class AfipService {
  /**
   * Genera un CAE simulado para factura electrónica legal en Argentina.
   */
  async generateCAE(data: {
    cuitCliente: string;
    monto: number;
    tipoCbte: number;
    puntoVenta: number;
  }) {
    // Simulación de interacción con WSFEv1
    const caeResponse = {
      cae: `CAE${Math.random().toString().substring(2, 12)}`,
      vencimiento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      nroFactura: Math.floor(Math.random() * 100000),
      status: 'approved'
    };

    console.log(`[AFIP MOCK] CAE generado para CUIT ${data.cuitCliente}: ${caeResponse.cae}`);
    
    return caeResponse;
  }

  /**
   * Emite factura electrónica (Mock para compatibilidad de servicios).
   */
  async emitirFacturaElectronica(data: {
    cuitCliente: string;
    monto: number;
    tipoCbte: number;
    puntoVenta: number;
  }) {
    return this.generateCAE(data);
  }
}
