/**
 * Store Context Provider
 * 
 * This provides the MobX store through React Context.
 * Components can access the store using the useStore hook.
 * 
 * The store is created once per request on the server,
 * and once on the client during hydration.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { AppStore } from '../types/store';

// Create the context (initially undefined, must be provided)
const StoreContext = createContext<AppStore | undefined>(undefined);

interface StoreProviderProps {
  children: ReactNode;
  store: AppStore;
}

/**
 * Provider component that wraps the app with the MobX store
 * @param children - Child components
 * @param store - The MobX store instance
 */
export const StoreProvider: React.FC<StoreProviderProps> = ({ children, store }) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

/**
 * Custom hook to access the MobX store
 * Usage: const store = useStore();
 * Then: store.text, store.setText('new text')
 */
export const useStore = (): AppStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return store;
};
