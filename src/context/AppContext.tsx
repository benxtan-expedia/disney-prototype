/**
 * App Context Provider
 * 
 * This provides application-wide configuration and data through React Context.
 * The context includes site configuration, locale, currency, device type, etc.
 * 
 * This data is typically set during SSR based on the request,
 * and then hydrated on the client side.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { AppContextType } from '../types/context';

// Default context value matching the required structure
const defaultContextValue: AppContextType = {
  minimal: false,
  context: {
    siteId: 1,
    locale: 'en_US',
    eapid: 0,
    tpid: 1,
    currency: 'USD',
    device: { type: 'DESKTOP' },
    identity: {
      duaid: '1234567890abcdef',
      authState: 'AUTHENTICATED',
    },
    privacyTrackingState: 'CAN_TRACK',
    debugContext: {
      abacusOverrides: [
        { id: '59765', bucket: 1 },
        { id: '61819', bucket: 1 },
      ],
    },
  },
  viewSize: 'SMALL',
  lineOfBusiness: 'UNKNOWN',
  theme: null,
  pageName: 'studio_landing',
  data: [],
};

// Create the context
const AppContext = createContext<AppContextType>(defaultContextValue);

interface AppContextProviderProps {
  children: ReactNode;
  value: AppContextType;
}

/**
 * Provider component that wraps the app
 * @param children - Child components
 * @param value - The context value to provide
 */
export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children, value }) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Custom hook to use the app context
 * Usage: const appContext = useAppContext();
 * Then access: appContext.context.locale, appContext.context.currency, etc.
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};

// Export the default value for SSR
export { defaultContextValue };
