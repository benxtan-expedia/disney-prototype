import "./App.css";
import { BrowserRouter, StaticRouter, Routes, Route } from "react-router-dom";
import componentMapper from "./utils/componentMapper";
import Nav from "./components/Nav";

const DisneyCustomMapModule = componentMapper.disneyCustomMapModule;
const DisneyMapModule = componentMapper.disneyMapModule;

const isClient = typeof document !== "undefined";

function App() {
  const routes = (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<DisneyCustomMapModule />} />
        <Route path="/map2" element={<DisneyMapModule />} />
      </Routes>
    </>
  );

  return isClient ? (
    <BrowserRouter>{routes}</BrowserRouter>
  ) : (
    <StaticRouter location="/">{routes}</StaticRouter>
  );
}

export default App;
