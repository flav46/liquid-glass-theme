import { useState } from "react";
import Desktop from "./components/Desktop";
import BootScreen from "./components/BootScreen";
import "./styles.css";

function App() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      <BootScreen onComplete={() => setBooted(true)} />
      {booted && <Desktop />}
    </>
  );
}

export default App;
