/**
 * Component Mapper Types
 * Type definitions for the dynamic component loading system
 */

import loadable from '@loadable/component';

export type LoadableComponent = ReturnType<typeof loadable>;

export type ComponentMapper = Record<string, LoadableComponent>;

export interface ModuleProps {
  // Add shared props for all modules here if needed
  [key: string]: any;
}
