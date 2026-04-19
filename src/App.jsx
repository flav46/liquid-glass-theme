import React, { useEffect } from "react";
import WindowLayer from "./shell/ui/WindowLayer";
import { startBrightnessCycle } from "./os/brightness";
import "./shell/ui/style.css";

export default function App() {
  useEffect(() => {
    const timerId = startBrightnessCycle();
    return () => window.clearInterval(timerId);
  }, []);

  return <WindowLayer />;
}
