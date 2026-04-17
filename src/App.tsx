import "./App.css";
import { Suspense, lazy } from "react";
import { BrowserRouter, StaticRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import componentMapper from "./utils/componentMapper";

const DisneyCustomMapModule = componentMapper.disneyCustomMapModule;
const DisneyMapModule = componentMapper.disneyMapModule;
//const DisneyCustomMapModule = lazy(() => import("./modules/DisneyCustomMapModule"));
//const DisneyMapModule = lazy(() => import("./modules/DisneyMapModule"));

const isClient = typeof document !== "undefined";

function App() {
  const routes = (
    <>
      <Nav />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<DisneyCustomMapModule />} />
          <Route path="/map2" element={<DisneyMapModule />} />
        </Routes>
      </Suspense>
    </>
  );

  return isClient ? (
    <BrowserRouter>{routes}</BrowserRouter>
  ) : (
    <StaticRouter location="/">{routes}</StaticRouter>
  );
}

export default App;
