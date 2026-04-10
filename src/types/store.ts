/**
 * Store Types
 * Type definitions for MobX stores
 */

export interface AppStore {
  text: string;
  setText: (newText: string) => void;
}
