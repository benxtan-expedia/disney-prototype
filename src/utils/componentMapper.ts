/**
 * Component Mapper
 *
 * This mapper uses @loadable/component to dynamically load modules.
 *
 * Key features:
 * - Code splitting: Each module is a separate bundle loaded on demand
 * - SSR support: With ssr: true, components render on the server
 * - Fallback: Shows null (or a loading indicator) while loading
 *
 * How it works:
 * 1. Instead of importing modules directly, we use loadable()
 * 2. Each loadable() call creates a dynamic import
 * 3. Webpack detects these and creates separate bundles (chunks)
 * 4. @loadable/server collects which chunks are needed during SSR
 * 5. The server sends script tags for those specific chunks
 * 6. On the client, modules hydrate and become interactive
 *
 * Note: Each module is now organized in its own folder with:
 * - index.tsx (component logic)
 * - ModuleName.styled.ts (styled components)
 */

import loadable from "@loadable/component";
import { ComponentMapper } from "../types/components";

const componentMapper: ComponentMapper = {
  inputModule: loadable(() => import("../modules/InputModule"), {
    ssr: true,
  }),
  buttonModule: loadable(() => import("../modules/ButtonModule"), {
    ssr: true,
  }),
  testModule: loadable(() => import("../modules/TestModule"), {
    ssr: true,
  }),
  disneyMapModule: loadable(() => import("../modules/DisneyMapModule"), {
    ssr: false,
  }),
  disneyCustomMapModule: loadable(
    () => import("../modules/DisneyCustomMapModule"),
    { ssr: false }
  ),
};

export default componentMapper;
