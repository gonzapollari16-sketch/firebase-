'use client';

/**
 * @fileOverview Custom error handling for Firestore with safe auth detection.
 * Uses dynamic implementation checking to remain SSR-safe.
 */

type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

interface SecurityRuleRequest {
  auth: any | null;
  method: string;
  path: string;
  resource?: {
    data: any;
  };
}

/**
 * A custom error class designed to be consumed by an LLM for debugging.
 * It structures the error information to mimic the request object
 * available in Firestore Security Rules.
 */
export class FirestorePermissionError extends Error {
  public readonly request: SecurityRuleRequest;

  constructor(context: SecurityRuleContext) {
    const requestObject: SecurityRuleRequest = {
      auth: null, // Auth info is populated asynchronously if needed
      method: context.operation,
      path: `/databases/(default)/documents/${context.path}`,
      resource: context.requestResourceData ? { data: context.requestResourceData } : undefined,
    };
    
    super(`Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
${JSON.stringify(requestObject, null, 2)}`);
    
    this.name = 'FirebaseError';
    this.request = requestObject;
  }
}
