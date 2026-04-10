import "./App.css";
import componentMapper from "./utils/componentMapper";

function App() {
  // Access the dynamically loaded components from the mapper
  const DisneyMapModule = componentMapper.disneyMapModule;

  return (
    <>
      <DisneyMapModule />
    </>
  );
}

export default App;
