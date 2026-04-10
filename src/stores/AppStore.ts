/**
 * MobX App Store
 *
 * This store manages the application state using MobX.
 * Key concepts demonstrated:
 * - makeObservable: Makes properties observable
 * - observable: Marks state that triggers re-renders when changed
 * - action: Marks methods that modify state
 *
 * MobX automatically tracks which components use which observables
 * and re-renders only the affected components when state changes.
 */

import { makeObservable, observable, action } from "mobx";
import { AppStore } from "../types/store";

export class AppStoreImpl implements AppStore {
  // Observable state - when this changes, components will re-render
  text: string = "Hello World! Click a button to change this text.";

  constructor(initialState?: Partial<AppStore>) {
    // Make properties observable and actions modifiable
    makeObservable(this, {
      text: observable,
      setText: action,
    });

    // If initial state is provided (from SSR), use it
    if (initialState?.text) {
      this.text = initialState.text;
    }
  }

  /**
   * Action to update text
   * Actions are the only way to modify observable state in strict mode
   * @param newText - The new text value to set
   */
  setText = (newText: string): void => {
    this.text = newText;
  };
}

/**
 * Factory function to create a new store instance
 * This allows us to create fresh stores for SSR and hydration
 */
export const createAppStore = (initialState?: Partial<AppStore>): AppStore => {
  return new AppStoreImpl(initialState);
};
