// Renderer-only (NO Electron imports)

const liquidGlass = {
  container: null,
  backgroundColor: '#333',
  gradientColors: ['#00ffcc', '#0066ff'],
};

function createGradient() {
  if (!liquidGlass.container) return;

  const gradient = `linear-gradient(135deg, ${liquidGlass.gradientColors.join(', ')})`;
  liquidGlass.container.style.backgroundImage = gradient;
}

function init() {
  liquidGlass.container = document.getElementById('liquid-glass-container');
  createGradient();

  setInterval(() => {
    // simple animation shift
    liquidGlass.gradientColors.reverse();
    createGradient();
  }, 2000);
}

export default { init };
