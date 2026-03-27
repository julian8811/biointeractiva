/**
 * BioInteractiva - Core Module
 * Manejo de estado global y persistencia
 */

// Estado global de la aplicación
export const state = {
  completed: {
    cli: false,
    db: false,
    genomics: false,
    phylo: false
  },
  score: 0,
  // Nuevos campos para seguimiento de progreso
  cliProgress: {
    commandsMastered: [],
    exercisesCompleted: [],
    labsCompleted: []
  }
};

export const STORAGE_KEY = "biointeractiva_progress_v2";

// Guardar estado en localStorage
export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Cargar estado desde localStorage
export function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      state.completed = { ...state.completed, ...parsed.completed };
      state.score = Number.isFinite(parsed.score) ? parsed.score : 0;
      if (parsed.cliProgress) {
        state.cliProgress = { ...state.cliProgress, ...parsed.cliProgress };
      }
    }
  } catch (e) {
    console.warn("Error al cargar estado:", e);
  }
}

// Actualizar UI de progreso
export function updateProgressUI() {
  const completedCount = Object.values(state.completed).filter(Boolean).length;
  const total = 4;
  
  document.getElementById("completedCount").textContent = String(completedCount);
  document.getElementById("scoreValue").textContent = String(state.score);
  
  const pct = Math.round((completedCount / total) * 100);
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    progressBar.style.width = `${pct}%`;
  }
}

// Marcar módulo como completado
export function markModuleDone(moduleKey) {
  if (!state.completed[moduleKey]) {
    state.completed[moduleKey] = true;
    state.score += 25;
    saveState();
    updateProgressUI();
  }
}

// Inicializar la aplicación
export function initApp() {
  loadState();
  updateProgressUI();
  console.log("BioInteractiva inicializado v2");
}

// Renderizado de lista de módulos
export function renderModulesList() {
  const container = document.getElementById("moduleContent");
  container.classList.add("hidden");
  container.innerHTML = "";
  container.style.display = "";
}

// Exportar para uso global
window.state = state;
window.saveState = saveState;
window.loadState = loadState;
window.updateProgressUI = updateProgressUI;
window.markModuleDone = markModuleDone;
window.renderModulesList = renderModulesList;
