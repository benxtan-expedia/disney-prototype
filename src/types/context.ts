/**
 * Context Types
 * These types define the shape of the application context data
 * that's provided through React Context and available in SSR
 */

export interface DeviceType {
  type: 'DESKTOP' | 'MOBILE' | 'TABLET';
}

export interface IdentityType {
  duaid: string;
  authState: 'AUTHENTICATED' | 'ANONYMOUS';
}

export interface AbacusOverride {
  id: string;
  bucket: number;
}

export interface DebugContext {
  abacusOverrides: AbacusOverride[];
}

export interface ContextData {
  siteId: number;
  locale: string;
  eapid: number;
  tpid: number;
  currency: string;
  device: DeviceType;
  identity: IdentityType;
  privacyTrackingState: string;
  debugContext: DebugContext;
}

export interface AppContextType {
  minimal: boolean;
  context: ContextData;
  viewSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  lineOfBusiness: string;
  theme: string | null;
  pageName: string;
  data: any[];
}
