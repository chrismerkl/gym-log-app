
const STORAGE_KEYS = {
  exercises: "gym-log-exercises",
  logs: "gym-log-entries",
  trainingPlanStructure: "gym-log-training-plan-structure",
  trainingPlanCurrentData: "gym-log-training-plan-current-data",
  trainingPlanLastData: "gym-log-training-plan-last-data",
  trainingHistory: "gym-log-training-history",
  legacyTrainingPlanData: "gym-log-training-plan",
  personalization: "gym-log-personalization",
};

const THEMES = [
  {
    id: "orange",
    label: "Orange",
    brand: "#ff7a1a",
    brandDark: "#d85f06",
    brandSoft: "rgba(255, 122, 26, 0.16)",
    swatch: "linear-gradient(135deg, #ffb26c, #ff7a1a)",
  },
  {
    id: "blue",
    label: "Blau",
    brand: "#52a7ff",
    brandDark: "#2f7fda",
    brandSoft: "rgba(82, 167, 255, 0.18)",
    swatch: "linear-gradient(135deg, #8dc7ff, #4f99ff)",
  },
  {
    id: "green",
    label: "Gruen",
    brand: "#52d98c",
    brandDark: "#2ba968",
    brandSoft: "rgba(82, 217, 140, 0.18)",
    swatch: "linear-gradient(135deg, #91f0b6, #46c97b)",
  },
  {
    id: "red",
    label: "Rot",
    brand: "#ff6b6b",
    brandDark: "#d94a4a",
    brandSoft: "rgba(255, 107, 107, 0.18)",
    swatch: "linear-gradient(135deg, #ff9f9f, #ff6b6b)",
  },
  {
    id: "violet",
    label: "Violett",
    brand: "#a978ff",
    brandDark: "#8056d8",
    brandSoft: "rgba(169, 120, 255, 0.18)",
    swatch: "linear-gradient(135deg, #caabff, #9b68ff)",
  },
];

const defaultExercises = [
  "Bankdrücken",
  "Kniebeugen",
  "Kreuzheben",
  "Schulterdrücken",
];

const DEFAULT_TRAINING_DAYS = [
  {
    id: "torso-a",
    label: "Torso A",
    exercises: [
      { name: "Seitheben KH", sets: "2x", reps: "6-10" },
      { name: "Brustpresse flach", sets: "2x", reps: "6-10" },
      { name: "Butterfly", sets: "2x", reps: "6-10" },
      { name: "Pullups Zusatzgewicht", sets: "3x", reps: "6-10" },
      { name: "Brustgestütztes Rudern breit", sets: "3x", reps: "6-10" },
      { name: "Seitheben Kabel", sets: "2x", reps: "6-10" },
      { name: "Reverse Butterfly", sets: "2x", reps: "6-10" },
    ],
  },
  {
    id: "limbs-a",
    label: "Limbs A",
    exercises: [
      { name: "Preacher Curls unilateral", sets: "3x", reps: "6-10" },
      { name: "Trizeps Pushdowns unilateral", sets: "3x", reps: "6-10" },
      { name: "Beinbeuger liegend", sets: "3x", reps: "6-10" },
      { name: "Beinpresse", sets: "2x", reps: "6-10" },
      { name: "Beinstrecker", sets: "2x", reps: "6-10" },
      { name: "Crunches Bauch", sets: "2x", reps: "6-10" },
    ],
  },
  {
    id: "torso-b",
    label: "Torso B",
    exercises: [
      { name: "Brustpresse schräg", sets: "2x", reps: "6-10" },
      { name: "Latzug breit", sets: "3x", reps: "6-10" },
      { name: "Brustgestütztes Rudern breit", sets: "3x", reps: "6-10" },
      { name: "Schulterdrücken Maschine", sets: "2x", reps: "6-10" },
      { name: "Seitheben KH", sets: "2x", reps: "6-10" },
      { name: "Butterfly", sets: "2x", reps: "6-10" },
      { name: "Reverse Butterfly", sets: "2x", reps: "6-10" },
    ],
  },
  {
    id: "limbs-b",
    label: "Limbs B",
    exercises: [
      { name: "Hammer Curls unilateral", sets: "3x", reps: "6-10" },
      { name: "Dips Trizeps Zusatzgewicht", sets: "3x", reps: "6-10" },
      { name: "Beinbeuger sitzend", sets: "3x", reps: "6-10" },
      { name: "Hackenschmidt Maschine", sets: "2x", reps: "6-10" },
      { name: "Beinstrecker", sets: "2x", reps: "6-10" },
      { name: "Crunches Bauch", sets: "2x", reps: "6-10" },
    ],
  },
];

const exerciseForm = document.querySelector("#exercise-form");
const exerciseInput = document.querySelector("#exercise-name");
const exerciseTags = document.querySelector("#exercise-tags");
const logForm = document.querySelector("#log-form");
const exerciseSelect = document.querySelector("#exercise-select");
const weightInput = document.querySelector("#weight-input");
const repsInput = document.querySelector("#reps-input");
const progressList = document.querySelector("#progress-list");
const progressTemplate = document.querySelector("#progress-item-template");
const dayTabs = document.querySelector("#day-tabs");
const activeDayLabel = document.querySelector("#active-day-label");
const activeDayTitle = document.querySelector("#active-day-title");
const planExercises = document.querySelector("#plan-exercises");
const planExerciseTemplate = document.querySelector("#plan-exercise-template");
const planForm = document.querySelector("#plan-form");
const planExerciseNameInput = document.querySelector("#plan-exercise-name");
const planExerciseSetsInput = document.querySelector("#plan-exercise-sets");
const planExerciseRepsInput = document.querySelector("#plan-exercise-reps");
const profileNameDisplay = document.querySelector("#profile-name-display");
const personalizationForm = document.querySelector("#personalization-form");
const profileNameInput = document.querySelector("#profile-name-input");
const themeOptions = document.querySelector("#theme-options");
const completeTrainingButton = document.querySelector("#complete-training-button");
const resetFeedback = document.querySelector("#reset-feedback");

function readStorage(key, fallback) {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.error(`Storage konnte nicht gelesen werden: ${key}`, error);
    return fallback;
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let exercises = readStorage(STORAGE_KEYS.exercises, defaultExercises);
let logs = readStorage(STORAGE_KEYS.logs, []);
let planDays = readStorage(
  STORAGE_KEYS.trainingPlanStructure,
  structuredClone(DEFAULT_TRAINING_DAYS),
);
let planCurrentEntries = readStorage(
  STORAGE_KEYS.trainingPlanCurrentData,
  readStorage(STORAGE_KEYS.legacyTrainingPlanData, {}),
);
let planLastEntries = readStorage(STORAGE_KEYS.trainingPlanLastData, {});
let trainingHistory = readStorage(STORAGE_KEYS.trainingHistory, []);
let activeTrainingDay = DEFAULT_TRAINING_DAYS[0].id;
let personalization = readStorage(STORAGE_KEYS.personalization, {
  name: "",
  theme: THEMES[0].id,
});
const chartInstances = new Map();
let resetFeedbackTimeoutId = null;

if (!Array.isArray(exercises) || exercises.length === 0) {
  exercises = [...defaultExercises];
}

if (!Array.isArray(logs)) {
  logs = [];
}

if (!planCurrentEntries || typeof planCurrentEntries !== "object" || Array.isArray(planCurrentEntries)) {
  planCurrentEntries = {};
}

if (!planLastEntries || typeof planLastEntries !== "object" || Array.isArray(planLastEntries)) {
  planLastEntries = {};
}

if (!Array.isArray(trainingHistory)) {
  trainingHistory = [];
}

if (!Array.isArray(planDays) || planDays.length === 0) {
  planDays = structuredClone(DEFAULT_TRAINING_DAYS);
}

if (!personalization || typeof personalization !== "object" || Array.isArray(personalization)) {
  personalization = { name: "", theme: THEMES[0].id };
}

activeTrainingDay = getTrainingDay(activeTrainingDay).id;

function savePlanStructure() {
  saveStorage(STORAGE_KEYS.trainingPlanStructure, planDays);
}

function saveCurrentPlanData() {
  saveStorage(STORAGE_KEYS.trainingPlanCurrentData, planCurrentEntries);
}

function saveLastPlanData() {
  saveStorage(STORAGE_KEYS.trainingPlanLastData, planLastEntries);
}

function saveTrainingHistory() {
  saveStorage(STORAGE_KEYS.trainingHistory, trainingHistory);
}

function savePersonalization() {
  saveStorage(STORAGE_KEYS.personalization, personalization);
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatHistoryDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getTrainingDay(dayId) {
  return planDays.find((day) => day.id === dayId) ?? planDays[0];
}

function getDefaultTrainingDay(dayId) {
  return DEFAULT_TRAINING_DAYS.find((day) => day.id === dayId) ?? null;
}

function getDefaultExercise(dayId, exerciseName) {
  const defaultDay = getDefaultTrainingDay(dayId);

  if (!defaultDay) {
    return null;
  }

  return defaultDay.exercises.find((exercise) => exercise.name === exerciseName) ?? null;
}

function getCurrentPlanEntry(dayId, exerciseName) {
  return planCurrentEntries[dayId]?.[exerciseName] ?? { sets: [] };
}

function getLastPlanEntry(dayId, exerciseName) {
  return planLastEntries[dayId]?.[exerciseName] ?? { sets: [] };
}

function getSetCount(exercise) {
  return Number.parseInt(exercise.sets, 10) || 1;
}

function normalizePlanEntry(exercise, entry) {
  const setCount = getSetCount(exercise);

  if (entry && Array.isArray(entry.sets)) {
    return {
      sets: Array.from({ length: setCount }, (_, index) => ({
        weight: entry.sets[index]?.weight ?? "",
        reps: entry.sets[index]?.reps ?? "",
      })),
    };
  }

  return {
    sets: Array.from({ length: setCount }, (_, index) => ({
      weight: index === 0 ? entry?.weight ?? "" : "",
      reps: index === 0 ? entry?.reps ?? "" : "",
    })),
  };
}

function getExerciseHistory(exerciseName) {
  return trainingHistory
    .filter((entry) => entry.uebung === exerciseName && Array.isArray(entry.saetze))
    .sort((a, b) => new Date(a.datum) - new Date(b.datum));
}

function getStoredTrainingHistory() {
  trainingHistory = readStorage(STORAGE_KEYS.trainingHistory, trainingHistory);
  return Array.isArray(trainingHistory) ? trainingHistory : [];
}

function getBestWeightFromSets(sets) {
  const numericWeights = sets
    .map((setEntry) => Number.parseFloat(setEntry.gewicht))
    .filter((weight) => !Number.isNaN(weight));

  if (numericWeights.length === 0) {
    return null;
  }

  return Math.max(...numericWeights);
}

function destroyPlanCharts() {
  chartInstances.forEach((chart) => chart.destroy());
  chartInstances.clear();
}

function renderExerciseChart(canvas, exerciseName) {
  const chartSection = canvas.closest(".plan-chart-section");
  const chartWrapper = canvas.closest(".plan-chart-wrapper");
  const history = getStoredTrainingHistory()
    .filter((entry) => entry.uebung === exerciseName && Array.isArray(entry.saetze))
    .sort((a, b) => new Date(a.datum) - new Date(b.datum));
  const chartData = history
    .map((entry) => ({
      datum: formatHistoryDate(entry.datum),
      bestesGewicht: getBestWeightFromSets(entry.saetze),
    }))
    .filter((entry) => entry.bestesGewicht !== null);

  if (chartData.length === 0 || typeof Chart === "undefined") {
    chartSection.classList.add("is-hidden");
    return;
  }

  chartSection.classList.remove("is-hidden");

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    chartSection.classList.add("is-hidden");
    return;
  }

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.map((entry) => entry.datum),
      datasets: [
        {
          label: "Gewicht",
          data: chartData.map((entry) => entry.bestesGewicht),
          borderColor: getComputedStyle(document.documentElement).getPropertyValue("--brand").trim(),
          backgroundColor: "rgba(249,115,22,0.2)",
          borderWidth: 3,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 5,
          pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--brand").trim(),
          pointBorderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#9ca3af",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
          },
        },
        y: {
          ticks: {
            color: "#9ca3af",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
          },
        },
      },
    },
  });

  chartInstances.set(canvas, chart);
}

function savePlanField(dayId, exercise, setIndex, field, value) {
  if (!planCurrentEntries[dayId]) {
    planCurrentEntries[dayId] = {};
  }

  const normalizedEntry = normalizePlanEntry(exercise, planCurrentEntries[dayId][exercise.name]);
  normalizedEntry.sets[setIndex] = {
    ...normalizedEntry.sets[setIndex],
    [field]: value,
  };

  planCurrentEntries[dayId][exercise.name] = normalizedEntry;

  saveCurrentPlanData();
}

function berechneFortschritt(alt, neu) {
  const altesGewicht = Number.parseFloat(alt.weight);
  const neuesGewicht = Number.parseFloat(neu.weight);
  const alteWdh = Number.parseInt(alt.reps, 10);
  const neueWdh = Number.parseInt(neu.reps, 10);

  if (!Number.isNaN(altesGewicht) && !Number.isNaN(neuesGewicht)) {
    const differenzGewicht = Number((neuesGewicht - altesGewicht).toFixed(2));

    if (differenzGewicht > 0) {
      return { text: `🔼 +${differenzGewicht} kg`, color: "better" };
    }

    if (differenzGewicht < 0) {
      return { text: `🔽 ${differenzGewicht} kg`, color: "worse" };
    }
  }

  if (!Number.isNaN(alteWdh) && !Number.isNaN(neueWdh)) {
    const differenzWdh = neueWdh - alteWdh;

    if (differenzWdh > 0) {
      return { text: `🔼 +${differenzWdh} Wdh`, color: "better" };
    }

    if (differenzWdh < 0) {
      return { text: `🔽 ${differenzWdh} Wdh`, color: "worse" };
    }

    return { text: "➖ Gleich", color: "equal" };
  }

  return null;
}

function renderPlanHistory(container, lastValues, currentValues) {
  container.innerHTML = "";

  const title = document.createElement("p");
  title.className = "plan-history-title";
  title.textContent = "Letztes Training";
  container.append(title);

  const filledSets = lastValues.sets.filter(
    (setEntry) => setEntry.weight !== "" || setEntry.reps !== "",
  );

  if (filledSets.length === 0) {
    const emptyText = document.createElement("p");
    emptyText.className = "plan-history-empty";
    emptyText.textContent = "Noch kein letztes Training gespeichert.";
    container.append(emptyText);
    return;
  }

  const historyList = document.createElement("div");
  historyList.className = "plan-history-list";

  lastValues.sets.forEach((setEntry, index) => {
    if (setEntry.weight === "" && setEntry.reps === "") {
      return;
    }

    const item = document.createElement("p");
    item.className = "plan-history-item";
    item.textContent = `Satz ${index + 1}: ${setEntry.weight || "-"}kg x ${setEntry.reps || "-"}`;
    historyList.append(item);
  });

  container.append(historyList);

  const progressList = document.createElement("div");
  progressList.className = "plan-progress-list";

  currentValues.sets.forEach((currentSet, index) => {
    const lastSet = lastValues.sets[index];

    if (!lastSet || (lastSet.weight === "" && lastSet.reps === "")) {
      return;
    }

    const fortschritt = berechneFortschritt(lastSet, currentSet);

    if (!fortschritt) {
      return;
    }

    const progressItem = document.createElement("div");
    progressItem.className = "plan-progress-item";

    const label = document.createElement("p");
    label.className = "plan-progress-label";
    label.textContent = `Fortschritt Satz ${index + 1}:`;
    progressItem.append(label);

    const badge = document.createElement("span");
    badge.className = `plan-progress-badge is-${fortschritt.color}`;
    badge.textContent = fortschritt.text;
    progressItem.append(badge);

    progressList.append(progressItem);
  });

  if (progressList.childElementCount > 0) {
    container.append(progressList);
  }
}

function getTheme(themeId) {
  return THEMES.find((theme) => theme.id === themeId) ?? THEMES[0];
}

function applyTheme(themeId) {
  const theme = getTheme(themeId);
  const root = document.documentElement;

  root.style.setProperty("--brand", theme.brand);
  root.style.setProperty("--brand-dark", theme.brandDark);
  root.style.setProperty("--brand-soft", theme.brandSoft);
}

function renderThemeOptions() {
  themeOptions.innerHTML = "";

  THEMES.forEach((theme) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-swatch";
    button.dataset.theme = theme.id;
    button.title = theme.label;
    button.setAttribute("aria-label", theme.label);
    button.style.background = theme.swatch;

    if (theme.id === personalization.theme) {
      button.classList.add("active");
    }

    themeOptions.append(button);
  });
}

function renderPersonalization() {
  const displayName = personalization.name.trim() || "Gym Log MVP";

  profileNameDisplay.textContent = displayName;
  profileNameInput.value = personalization.name ?? "";
  applyTheme(personalization.theme);
  renderThemeOptions();

  if (planExercises.childElementCount > 0) {
    renderTrainingPlan();
  }
}

function showResetFeedback() {
  if (!resetFeedback) {
    return;
  }

  resetFeedback.classList.add("is-visible");

  if (resetFeedbackTimeoutId) {
    clearTimeout(resetFeedbackTimeoutId);
  }

  resetFeedbackTimeoutId = setTimeout(() => {
    resetFeedback.classList.remove("is-visible");
  }, 2000);
}

function renderDayTabs() {
  dayTabs.innerHTML = "";

  planDays.forEach((day) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button day-tab";
    button.textContent = day.label;
    button.dataset.day = day.id;

    if (day.id === activeTrainingDay) {
      button.classList.add("active");
    }

    dayTabs.append(button);
  });
}

function renderTrainingPlan() {
  const activeDay = getTrainingDay(activeTrainingDay);

  activeDayLabel.textContent = "Aktiver Trainingstag";
  activeDayTitle.textContent = activeDay.label;
  destroyPlanCharts();
  planExercises.innerHTML = "";

  activeDay.exercises.forEach((exercise) => {
    const fragment = planExerciseTemplate.content.cloneNode(true);
    const setList = fragment.querySelector(".plan-set-list");
    const deleteButton = fragment.querySelector(".plan-delete-button");
    const historyBlock = fragment.querySelector(".plan-history");
    const chartCanvas = fragment.querySelector(".plan-chart");
    const currentValues = normalizePlanEntry(exercise, getCurrentPlanEntry(activeDay.id, exercise.name));
    const lastValues = normalizePlanEntry(exercise, getLastPlanEntry(activeDay.id, exercise.name));

    fragment.querySelector(".plan-exercise-name").textContent = exercise.name;
    fragment.querySelector(".plan-prescription").textContent = `${exercise.sets} ${exercise.reps}`;
    deleteButton.dataset.day = activeDay.id;
    deleteButton.dataset.exercise = exercise.name;

    currentValues.sets.forEach((setEntry, index) => {
      const row = document.createElement("div");
      row.className = "plan-set-row";

      const setLabel = document.createElement("p");
      setLabel.className = "plan-set-label";
      setLabel.textContent = `Satz ${index + 1}`;

      const weightLabel = document.createElement("label");
      weightLabel.className = "field";
      weightLabel.innerHTML = `
        <span>Gewicht (kg)</span>
        <input class="plan-set-input" type="number" min="0" step="0.5" placeholder="z. B. 22.5">
      `;

      const repsLabel = document.createElement("label");
      repsLabel.className = "field";
      repsLabel.innerHTML = `
        <span>Wiederholungen</span>
        <input class="plan-set-input" type="number" min="0" step="1" placeholder="z. B. 8">
      `;

      const weightField = weightLabel.querySelector("input");
      const repsField = repsLabel.querySelector("input");

      weightField.value = setEntry.weight ?? "";
      repsField.value = setEntry.reps ?? "";

      weightField.dataset.day = activeDay.id;
      weightField.dataset.exercise = exercise.name;
      weightField.dataset.setIndex = String(index);
      weightField.dataset.field = "weight";

      repsField.dataset.day = activeDay.id;
      repsField.dataset.exercise = exercise.name;
      repsField.dataset.setIndex = String(index);
      repsField.dataset.field = "reps";

      row.append(setLabel, weightLabel, repsLabel);
      setList.append(row);
    });

    renderPlanHistory(historyBlock, lastValues, currentValues);
    planExercises.append(fragment);
    requestAnimationFrame(() => renderExerciseChart(chartCanvas, exercise.name));
  });
}

function completeTrainingDay(dayId) {
  const day = getTrainingDay(dayId);

  if (!day) {
    return;
  }

  if (!planLastEntries[dayId]) {
    planLastEntries[dayId] = {};
  }

  day.exercises.forEach((exercise) => {
    const currentValues = normalizePlanEntry(exercise, getCurrentPlanEntry(dayId, exercise.name));
    const hasData = currentValues.sets.some(
      (setEntry) => setEntry.weight !== "" || setEntry.reps !== "",
    );

    if (!hasData) {
      return;
    }

    planLastEntries[dayId][exercise.name] = {
      sets: currentValues.sets.map((setEntry) => ({
        weight: setEntry.weight,
        reps: setEntry.reps,
      })),
    };

    trainingHistory.push({
      uebung: exercise.name,
      datum: getTodayDate(),
      saetze: currentValues.sets.map((setEntry) => ({
        gewicht: Number.parseFloat(setEntry.weight),
        wdh: Number.parseInt(setEntry.reps, 10),
      })),
    });
  });

  saveLastPlanData();
  saveTrainingHistory();

  if (planCurrentEntries[dayId]) {
    delete planCurrentEntries[dayId];
    saveCurrentPlanData();
  }

  renderTrainingPlan();
}

function addPlanExercise(dayId, exercise) {
  const day = getTrainingDay(dayId);

  if (!day) {
    return;
  }

  const trimmedName = exercise.name.trim();
  const trimmedReps = exercise.reps.trim() || "6-10";

  if (!trimmedName) {
    return;
  }

  const exists = day.exercises.some(
    (item) => item.name.toLowerCase() === trimmedName.toLowerCase(),
  );

  if (exists) {
    alert("Diese Übung ist im Trainingsplan bereits vorhanden.");
    return;
  }

  day.exercises = [
    ...day.exercises,
    {
      name: trimmedName,
      sets: exercise.sets,
      reps: trimmedReps,
    },
  ];

  savePlanStructure();
  renderTrainingPlan();
}

function deletePlanExercise(dayId, exerciseName) {
  const day = getTrainingDay(dayId);
  const defaultExercise = getDefaultExercise(dayId, exerciseName);

  if (!day) {
    return;
  }

  if (defaultExercise) {
    day.exercises = day.exercises.map((exercise) => {
      if (exercise.name !== exerciseName) {
        return exercise;
      }

      return structuredClone(defaultExercise);
    });
  } else {
    day.exercises = day.exercises.filter((exercise) => exercise.name !== exerciseName);
  }

  if (planCurrentEntries[dayId]?.[exerciseName]) {
    delete planCurrentEntries[dayId][exerciseName];
    saveCurrentPlanData();
  }

  if (planLastEntries[dayId]?.[exerciseName]) {
    delete planLastEntries[dayId][exerciseName];
    saveLastPlanData();
  }

  trainingHistory = trainingHistory.filter((entry) => entry.uebung !== exerciseName);
  saveTrainingHistory();

  savePlanStructure();
  renderTrainingPlan();
  showResetFeedback();
}

function renderExercises() {
  exerciseSelect.innerHTML = "";
  exerciseTags.innerHTML = "";

  exercises.forEach((exercise) => {
    const option = document.createElement("option");
    option.value = exercise;
    option.textContent = exercise;
    exerciseSelect.append(option);

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = exercise;
    exerciseTags.append(tag);
  });
}

function renderLogs() {
  progressList.innerHTML = "";

  if (logs.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "Noch keine Einträge vorhanden. Starte mit deinem ersten Satz.";
    progressList.append(emptyState);
    return;
  }

  const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

  sortedLogs.forEach((log) => {
    const fragment = progressTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".progress-card");
    const deleteButton = fragment.querySelector(".button-delete");

    card.dataset.id = log.id;
    fragment.querySelector(".progress-exercise").textContent = log.exercise;
    fragment.querySelector(".progress-meta").textContent = formatDate(log.date);
    fragment.querySelector(".stat-weight").textContent = `${log.weight} kg`;
    fragment.querySelector(".stat-reps").textContent = `${log.reps} Wdh`;
    deleteButton.dataset.id = log.id;
    progressList.append(fragment);
  });
}

function addExercise(name) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return;
  }

  const exists = exercises.some(
    (exercise) => exercise.toLowerCase() === trimmedName.toLowerCase(),
  );

  if (exists) {
    alert("Diese Übung ist bereits vorhanden.");
    return;
  }

  exercises = [...exercises, trimmedName];
  saveStorage(STORAGE_KEYS.exercises, exercises);
  renderExercises();
  exerciseSelect.value = trimmedName;
}

function addLogEntry({ exercise, weight, reps }) {
  const entry = {
    id: crypto.randomUUID(),
    exercise,
    weight,
    reps,
    date: new Date().toISOString(),
  };

  logs = [entry, ...logs];
  saveStorage(STORAGE_KEYS.logs, logs);
  renderLogs();
}

function deleteLogEntry(entryId) {
  logs = logs.filter((log) => log.id !== entryId);
  saveStorage(STORAGE_KEYS.logs, logs);
  renderLogs();
}

exerciseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addExercise(exerciseInput.value);
  exerciseForm.reset();
  exerciseInput.focus();
});

logForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedExercise = exerciseSelect.value;
  const weight = Number.parseFloat(weightInput.value);
  const reps = Number.parseInt(repsInput.value, 10);

  if (!selectedExercise || Number.isNaN(weight) || Number.isNaN(reps)) {
    alert("Bitte alle Felder korrekt ausfüllen.");
    return;
  }

  addLogEntry({
    exercise: selectedExercise,
    weight,
    reps,
  });

  logForm.reset();
  exerciseSelect.value = selectedExercise;
  weightInput.focus();
});

progressList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".button-delete");

  if (!deleteButton) {
    return;
  }

  deleteLogEntry(deleteButton.dataset.id);
});

planForm.addEventListener("submit", (event) => {
  event.preventDefault();

  addPlanExercise(activeTrainingDay, {
    name: planExerciseNameInput.value,
    sets: planExerciseSetsInput.value,
    reps: planExerciseRepsInput.value,
  });

  planForm.reset();
  planExerciseSetsInput.value = "3x";
  planExerciseRepsInput.value = "6-10";
  planExerciseNameInput.focus();
});

personalizationForm.addEventListener("input", (event) => {
  if (event.target !== profileNameInput) {
    return;
  }

  personalization.name = profileNameInput.value;
  savePersonalization();
  renderPersonalization();
});

dayTabs.addEventListener("click", (event) => {
  const dayButton = event.target.closest(".day-tab");

  if (!dayButton) {
    return;
  }

  activeTrainingDay = dayButton.dataset.day;
  renderDayTabs();
  renderTrainingPlan();
});

completeTrainingButton.addEventListener("click", () => {
  completeTrainingDay(activeTrainingDay);
});

planExercises.addEventListener("input", (event) => {
  const input = event.target.closest("input");

  if (!input) {
    return;
  }

  const day = getTrainingDay(input.dataset.day);
  const exercise = day.exercises.find((item) => item.name === input.dataset.exercise);

  if (!exercise) {
    return;
  }

  savePlanField(
    input.dataset.day,
    exercise,
    Number.parseInt(input.dataset.setIndex, 10),
    input.dataset.field,
    input.value,
  );

  const card = input.closest(".plan-card");

  if (!card) {
    return;
  }

  renderPlanHistory(
    card.querySelector(".plan-history"),
    normalizePlanEntry(exercise, getLastPlanEntry(input.dataset.day, input.dataset.exercise)),
    normalizePlanEntry(exercise, getCurrentPlanEntry(input.dataset.day, input.dataset.exercise)),
  );
});

planExercises.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".plan-delete-button");

  if (!deleteButton) {
    return;
  }

  deletePlanExercise(deleteButton.dataset.day, deleteButton.dataset.exercise);
});

themeOptions.addEventListener("click", (event) => {
  const swatch = event.target.closest(".theme-swatch");

  if (!swatch) {
    return;
  }

  personalization.theme = swatch.dataset.theme;
  savePersonalization();
  renderPersonalization();
});

renderPersonalization();
renderDayTabs();
renderTrainingPlan();
renderExercises();
renderLogs();
