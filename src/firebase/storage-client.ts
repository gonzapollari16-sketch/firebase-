"use client";

import { getClientApp } from "./client";

/**
 * @fileOverview Isolated Firebase Storage Client.
 * Uses dynamic import to prevent bundling conflicts during SSR.
 */

export async function getClientStorage() {
  const { getStorage } = await import("firebase/storage");
  return getStorage(getClientApp());
}
