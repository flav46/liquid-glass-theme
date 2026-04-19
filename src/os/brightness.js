export function setBrightness() {
  const hour = new Date().getHours();

  let brightness = 1;

  if (hour >= 6 && hour < 12) {
    brightness = 1.05;   // morning (soft light)
  } else if (hour >= 12 && hour < 18) {
    brightness = 1.0;    // normal daylight (Mac default feel)
  } else if (hour >= 18 && hour < 22) {
    brightness = 0.95;   // evening (warm dim)
  } else {
    brightness = 0.85;   // night (LCD safe mode)
  }

  document.documentElement.style.setProperty("--brightness", brightness);
}

export function startBrightnessCycle() {
  setBrightness();
  return window.setInterval(setBrightness, 60000);
}
