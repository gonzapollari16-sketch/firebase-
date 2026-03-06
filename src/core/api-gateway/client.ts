"use client";

import { getClientApp } from "@/firebase/client";
import type { Firestore } from "firebase/firestore";

/**
 * @fileOverview API Gateway Client.
 * Refactored to use 100% dynamic imports for implementation code.
 * This prevents the 'undici/llhttp' and 'reading call' errors during SSR.
 */

export class ApiClient {
  private _db: Firestore | null = null;

  private async getDb(): Promise<Firestore> {
    if (!this._db) {
      const { getFirestore } = await import("firebase/firestore");
      const app = getClientApp();
      this._db = getFirestore(app);
    }
    return this._db;
  }

  async getProperties(tenantId: string) {
    const db = await this.getDb();
    const { collection, getDocs, query } = await import("firebase/firestore");
    const colRef = collection(db, "tenants", tenantId, "properties");
    const snapshot = await getDocs(query(colRef));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async logAISearch(userId: string, searchQuery: string, result: any) {
    const db = await this.getDb();
    const { collection, addDoc } = await import("firebase/firestore");
    const historyRef = collection(db, "users", userId, "search_history");
    return await addDoc(historyRef, {
      query: searchQuery,
      result,
      timestamp: new Date().toISOString(),
    });
  }

  async sendWhatsAppMessage(phone: string, template: string, vars: any) {
    console.log(`[API Gateway] Sending WhatsApp to ${phone} using ${template}`);
    return { status: "sent", timestamp: new Date().toISOString() };
  }
}

export const createApiClient = () => new ApiClient();
