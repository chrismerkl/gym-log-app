const STORAGE_KEYS = {
  trainingPlanStructure: "gym-log-training-plan-structure-v2",
  trainingPlanCurrentData: "gym-log-training-plan-current-data",
  trainingPlanLastData: "gym-log-training-plan-last-data",
  trainingHistory: "gym-log-training-history",
  legacyTrainingPlanData: "gym-log-training-plan",
  personalization: "gym-log-personalization",
};

const DEFAULT_TRAINING_DAYS = [
  {
    id: "torso-a",
    label: "Torso A",
    exercises: [
      { name: "Nautilus Shoulder Press", sets: "3x", reps: "6-10", pause: "2-3 Min", note: "Rücken fest anlehnen, Brust leicht raus – oben nicht brutal einrasten." },
      { name: "Chest Press flach", sets: "2x", reps: "6-10", pause: "2-3 Min", note: "Schulter nicht nach vorne kippen. Langsam ablassen, sauber drücken." },
      { name: "Latzug breit", sets: "3x", reps: "6-10", pause: "2-3 Min", note: "Erst Schulterblätter runter, dann ziehen. Kein Reißen." },
      { name: "Brustgestütztes Rudern Upperback", sets: "2x", reps: "6-10", pause: "2 Min", note: "Oberer Rücken, Haltung, hintere Schulter." },
      { name: "Seitheben Kabel einarmig", sets: "3x", reps: "10-15", pause: "60-90 Sek", note: "2 Sek. hoch, kurz halten, 2-3 Sek. runter. Kein Trapez-Ziehen." },
      { name: "Reverse Butterfly", sets: "3x", reps: "10-15", pause: "60-90 Sek", note: "Bewegung aus hinterer Schulter – nicht aus Schwung oder Nacken." },
      { name: "Butterfly", sets: "2x", reps: "8-12", pause: "60-90 Sek", note: "Nur Brust-Finisher. Wenn müde: 1 Satz reicht." },
    ],
  },
  {
    id: "limbs-a",
    label: "Limbs A",
    exercises: [
      { name: "Preacher Curls unilateral", sets: "3x", reps: "6-10", pause: "90-120 Sek", note: "Sauberer Bizepsfokus, kein Schwung." },
      { name: "Trizeps Pushdown unilateral", sets: "3x", reps: "6-10", pause: "90-120 Sek", note: "Ellenbogen stabil, unten bewusst strecken." },
      { name: "Hammer Curls", sets: "2x", reps: "8-12", pause: "90 Sek", note: "Brachialis und Unterarm – Arm wirkt dicker." },
      { name: "Overhead-Trizeps Kabel", sets: "2x", reps: "8-12", pause: "90 Sek", note: "Langer Trizepskopf – sehr wichtig für Armvolumen." },
      { name: "Beinpresse", sets: "2x", reps: "6-10", pause: "2-3 Min", note: "Kontrolliert, nicht ins Becken kippen." },
      { name: "Beinbeuger sitzend", sets: "3x", reps: "6-10", pause: "2 Min", note: "Hamstrings sauber voll machen." },
      { name: "Waden sitzend", sets: "2x", reps: "8-12", pause: "60-90 Sek", note: "Unten dehnen, oben kurz halten." },
    ],
  },
  {
    id: "torso-b",
    label: "Torso B",
    exercises: [
      { name: "Latzug breit oder neutral", sets: "3x", reps: "6-10", pause: "2-3 Min", note: "Rückenbreite, sauberer Zug." },
      { name: "Rudern Maschine / brustgestützt", sets: "3x", reps: "6-10", pause: "2-3 Min", note: "Rückenmitte, Kontrolle, kein Reißen." },
      { name: "Nautilus Shoulder Press", sets: "2x", reps: "8-10", pause: "2 Min", note: "Moderater Schulterreiz – nicht maximal erzwingen." },
      { name: "Seitheben Kabel einarmig", sets: "3x", reps: "10-15", pause: "60-90 Sek", note: "Prioritätsübung für Schulterbreite." },
      { name: "Reverse Butterfly", sets: "3x", reps: "10-15", pause: "60-90 Sek", note: "Hintere Schulter und Haltung." },
      { name: "Chest Press leicht / Butterfly", sets: "2x", reps: "10-12", pause: "60-90 Sek", note: "Nur Erhaltung – kein Brust-Massaker." },
      { name: "Bauchmaschine / Cable Crunch", sets: "2x", reps: "8-12", pause: "60-90 Sek", note: "Rumpf und Optik." },
    ],
  },
  {
    id: "limbs-b",
    label: "Limbs B",
    exercises: [
      { name: "Overhead-Trizeps Kabel", sets: "3x", reps: "8-12", pause: "90-120 Sek", note: "Langer Trizepskopf zuerst." },
      { name: "Preacher Curl / Kabelcurl", sets: "3x", reps: "8-12", pause: "90-120 Sek", note: "Bizeps sauber und kontrolliert." },
      { name: "Trizeps Pushdown", sets: "2x", reps: "8-12", pause: "90 Sek", note: "Zusatzreiz – komplett strecken." },
      { name: "Hammer Curls", sets: "2x", reps: "8-12", pause: "90 Sek", note: "Arm wirkt voller und stärker." },
      { name: "Beinstrecker", sets: "2x", reps: "8-12", pause: "90-120 Sek", note: "Quad-Fokus, gute Ergänzung zur Beinpresse." },
      { name: "Beinbeuger sitzend", sets: "2x", reps: "8-12", pause: "90-120 Sek", note: "Hamstrings erhalten." },
      { name: "Waden sitzend", sets: "2x", reps: "8-12", pause: "60-90 Sek", note: "Langsam, volle Bewegung." },
    ],
  },
];

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
const exportDataButton = document.querySelector("#export-data-button");
const completeTrainingButton = document.querySelector("#complete-training-button");
const resetFeedback = document.querySelector("#reset-feedback");
const planResetHint = document.querySelector(".plan-reset-hint");

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
});
const chartInstances = new Map();
let resetFeedbackTimeoutId = null;
let editingExercise = null;
let planCompletedToday = {};

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

trainingHistory = normalizeTrainingHistoryEntries(trainingHistory);

if (!personalization || typeof personalization !== "object" || Array.isArray(personalization)) {
  personalization = { name: "" };
} else {
  personalization = { name: personalization.name ?? "" };
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

function isExerciseCompleted(dayId, exerciseName) {
  const completedList = planCompletedToday[dayId];
  return Array.isArray(completedList) && completedList.indexOf(exerciseName) !== -1;
}

function completeExercise(dayId, exerciseName) {
  const day = getTrainingDay(dayId);
  const exercise = day.exercises.find((item) => item.name === exerciseName);

  if (!exercise) {
    return;
  }

  const currentValues = normalizePlanEntry(exercise, getCurrentPlanEntry(dayId, exerciseName));
  const hasData = currentValues.sets.some(
    (setEntry) => setEntry.weight !== "" || setEntry.reps !== "",
  );

  if (hasData) {
    if (!planLastEntries[dayId]) {
      planLastEntries[dayId] = {};
    }

    planLastEntries[dayId][exerciseName] = {
      sets: currentValues.sets.map((setEntry) => ({
        weight: setEntry.weight,
        reps: setEntry.reps,
      })),
    };

    const exerciseId = getExerciseId(dayId, exerciseName);
    const today = getTodayDate();
    trainingHistory = trainingHistory.filter(
      (entry) => !(entry.exerciseId === exerciseId && entry.datum === today),
    );

    trainingHistory.push({
      exerciseId: exerciseId,
      uebung: exerciseName,
      datum: today,
      saetze: currentValues.sets.map((setEntry) => ({
        gewicht: Number.parseFloat(setEntry.weight),
        wdh: Number.parseInt(setEntry.reps, 10),
      })),
    });

    saveLastPlanData();
    saveTrainingHistory();
  }

  if (!Array.isArray(planCompletedToday[dayId])) {
    planCompletedToday[dayId] = [];
  }

  if (planCompletedToday[dayId].indexOf(exerciseName) === -1) {
    planCompletedToday[dayId].push(exerciseName);
  }

  renderTrainingPlan();
}

function editPlanExercise(dayId, oldName, newName, newSets, newReps, newPause, newNote) {
  const day = getTrainingDay(dayId);

  if (!day) {
    return;
  }

  const trimmedNewName = newName.trim();
  const trimmedNewReps = newReps.trim() || "6-10";

  if (!trimmedNewName) {
    return;
  }

  const nameChanged = trimmedNewName !== oldName;

  if (nameChanged) {
    const exists = day.exercises.some(
      (item) => item.name.toLowerCase() === trimmedNewName.toLowerCase() && item.name !== oldName,
    );

    if (exists) {
      alert("Diese Übung ist im Trainingsplan bereits vorhanden.");
      return;
    }
  }

  day.exercises = day.exercises.map((exercise) => {
    if (exercise.name !== oldName) {
      return exercise;
    }

    return {
      name: trimmedNewName,
      sets: newSets,
      reps: trimmedNewReps,
      pause: newPause !== undefined ? newPause : (exercise.pause || ""),
      note: newNote !== undefined ? newNote : (exercise.note || ""),
    };
  });

  if (nameChanged) {
    if (planCurrentEntries[dayId] && planCurrentEntries[dayId][oldName] !== undefined) {
      planCurrentEntries[dayId][trimmedNewName] = planCurrentEntries[dayId][oldName];
      delete planCurrentEntries[dayId][oldName];
      saveCurrentPlanData();
    }

    if (planLastEntries[dayId] && planLastEntries[dayId][oldName] !== undefined) {
      planLastEntries[dayId][trimmedNewName] = planLastEntries[dayId][oldName];
      delete planLastEntries[dayId][oldName];
      saveLastPlanData();
    }

    const oldExerciseId = getExerciseId(dayId, oldName);
    const newExerciseId = getExerciseId(dayId, trimmedNewName);
    trainingHistory = trainingHistory.map((entry) => {
      if (entry.exerciseId !== oldExerciseId) {
        return entry;
      }
      return { ...entry, exerciseId: newExerciseId, uebung: trimmedNewName };
    });
    saveTrainingHistory();

    if (Array.isArray(planCompletedToday[dayId])) {
      const idx = planCompletedToday[dayId].indexOf(oldName);
      if (idx !== -1) {
        planCompletedToday[dayId][idx] = trimmedNewName;
      }
    }
  }

  savePlanStructure();
  editingExercise = null;
  renderTrainingPlan();
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

function getExerciseId(dayId, exerciseName) {
  return `${dayId}-${exerciseName}`;
}

function normalizeTrainingHistoryEntries(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }

  let hasChanges = false;
  const normalizedEntries = entries.map((entry) => {
    if (
      !entry
      || typeof entry !== "object"
      || entry.exerciseId
      || typeof entry.uebung !== "string"
    ) {
      return entry;
    }

    const matchingDays = planDays.filter((day) =>
      day.exercises.some((exercise) => exercise.name === entry.uebung),
    );

    if (matchingDays.length !== 1) {
      return entry;
    }

    hasChanges = true;

    return {
      ...entry,
      exerciseId: getExerciseId(matchingDays[0].id, entry.uebung),
    };
  });

  if (hasChanges) {
    saveStorage(STORAGE_KEYS.trainingHistory, normalizedEntries);
  }

  return normalizedEntries;
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

function getExerciseHistory(exerciseId) {
  return trainingHistory
    .filter((entry) => entry.exerciseId === exerciseId && Array.isArray(entry.saetze))
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

function renderExerciseChart(canvas, exerciseId) {
  const chartSection = canvas.closest(".plan-chart-section");
  getStoredTrainingHistory();
  const history = getExerciseHistory(exerciseId);
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

function renderPersonalization() {
  const displayName = personalization.name.trim() || "Gym Log MVP";

  profileNameDisplay.textContent = displayName;
  profileNameInput.value = personalization.name ?? "";

  if (planExercises.childElementCount > 0) {
    renderTrainingPlan();
  }
}

function renderResetTexts() {
  if (planResetHint) {
    planResetHint.textContent = "Hinweis: Standard-Übungen werden beim Zurücksetzen nur auf den Originalzustand gesetzt.";
  }

  if (resetFeedback) {
    resetFeedback.textContent = "Übung zurückgesetzt";
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

function buildExportData() {
  return {
    exportedAt: new Date().toISOString(),
    trainingsplan: readStorage(STORAGE_KEYS.trainingPlanStructure, planDays),
    fortschritt: {
      aktuelleDaten: readStorage(STORAGE_KEYS.trainingPlanCurrentData, planCurrentEntries),
      letztesTraining: readStorage(STORAGE_KEYS.trainingPlanLastData, planLastEntries),
      logEintraege: readStorage(STORAGE_KEYS.logs, logs),
    },
    history: readStorage(STORAGE_KEYS.trainingHistory, trainingHistory),
  };
}

function exportDataAsJson() {
  const exportData = buildExportData();
  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = `gym-log-export-${getTodayDate()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
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

  const totalExercises = activeDay.exercises.length;
  const completedList = Array.isArray(planCompletedToday[activeDay.id])
    ? planCompletedToday[activeDay.id]
    : [];
  const completedCount = completedList.length;
  const pct = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  const progressCounter = document.createElement("div");
  progressCounter.className = "plan-progress-counter";
  const progressTextEl = document.createElement("p");
  progressTextEl.className = "plan-progress-text";
  progressTextEl.textContent = completedCount + " / " + totalExercises + " Übungen erledigt";
  const progressBarEl = document.createElement("div");
  progressBarEl.className = "plan-progress-bar";
  const progressFillEl = document.createElement("div");
  progressFillEl.className = "plan-progress-fill";
  progressFillEl.style.width = pct + "%";
  progressBarEl.append(progressFillEl);
  progressCounter.append(progressTextEl, progressBarEl);
  planExercises.append(progressCounter);

  activeDay.exercises.forEach(function (exercise, exerciseIndex) {
    const exerciseId = getExerciseId(activeDay.id, exercise.name);
    const isCompleted = isExerciseCompleted(activeDay.id, exercise.name);
    const isEditing = editingExercise !== null
      && editingExercise.dayId === activeDay.id
      && editingExercise.name === exercise.name;
    const orderNum = exerciseIndex + 1;

    if (isEditing) {
      const card = document.createElement("article");
      card.className = "plan-card is-editing";
      card.innerHTML = "<div class=\"plan-card-top\"><div class=\"plan-card-info\"><span class=\"plan-order-badge\">" + orderNum + "</span><div><p class=\"plan-exercise-name\"></p></div></div></div><div class=\"plan-edit-form\"><label class=\"field plan-edit-label\"><span>Name</span><input class=\"plan-edit-name\" type=\"text\" maxlength=\"60\"></label><div class=\"plan-edit-fields\"><label class=\"field\"><span>Sätze</span><select class=\"plan-edit-sets\"><option value=\"2x\">2x</option><option value=\"3x\">3x</option></select></label><label class=\"field\"><span>Wdh.-Bereich</span><input class=\"plan-edit-reps\" type=\"text\" maxlength=\"10\"></label><label class=\"field\"><span>Pause</span><input class=\"plan-edit-pause\" type=\"text\" maxlength=\"20\" placeholder=\"z. B. 90 Sek\"></label></div><label class=\"field\"><span>Notiz / Cue</span><input class=\"plan-edit-note\" type=\"text\" maxlength=\"140\" placeholder=\"Technik-Hinweis...\"></label><div class=\"plan-edit-actions\"><button type=\"button\" class=\"button button-primary plan-edit-save-button\"><span>Speichern</span></button><button type=\"button\" class=\"button button-cancel plan-edit-cancel-button\"><span>Abbrechen</span></button></div></div>";
      card.querySelector(".plan-exercise-name").textContent = exercise.name;
      card.querySelector(".plan-edit-name").value = exercise.name;
      card.querySelector(".plan-edit-sets").value = exercise.sets;
      card.querySelector(".plan-edit-reps").value = exercise.reps;
      card.querySelector(".plan-edit-pause").value = exercise.pause || "";
      card.querySelector(".plan-edit-note").value = exercise.note || "";
      card.querySelector(".plan-edit-save-button").dataset.day = activeDay.id;
      card.querySelector(".plan-edit-save-button").dataset.exercise = exercise.name;
      planExercises.append(card);
      return;
    }

    const isDefaultExercise = getDefaultExercise(activeDay.id, exercise.name) !== null;
    const currentValues = normalizePlanEntry(exercise, getCurrentPlanEntry(activeDay.id, exercise.name));
    const lastValues = normalizePlanEntry(exercise, getLastPlanEntry(activeDay.id, exercise.name));

    const card = document.createElement("article");
    card.className = isCompleted ? "plan-card is-completed" : "plan-card";

    const deleteClass = isDefaultExercise
      ? "button button-delete plan-delete-button"
      : "button button-delete plan-delete-button button-delete-custom";
    const deleteTitle = isDefaultExercise
      ? "Standard-Übungen werden nur zurückgesetzt."
      : "Übung löschen";
    const deleteLabel = isDefaultExercise
      ? "Zurücksetzen"
      : "Löschen";
    const deleteAriaLabel = isDefaultExercise
      ? "Übung zurücksetzen"
      : "Übung löschen";
    const deleteSvgPaths = isDefaultExercise
      ? "<path d=\"M20 11a8 8 0 1 1-2.34-5.66\"></path><path d=\"M20 4v7h-7\"></path>"
      : "<path d=\"M3 6h18\"></path><path d=\"M19 6l-1 14H6L5 6\"></path><path d=\"M8 6V4h8v2\"></path>";

    card.innerHTML = "<div class=\"plan-card-top\"><div class=\"plan-card-info\"><span class=\"plan-order-badge\">" + orderNum + "</span><div><p class=\"plan-exercise-name\"></p><div class=\"plan-meta-row\"><p class=\"plan-prescription\"></p><span class=\"plan-pause-badge\"></span></div><p class=\"plan-note\"></p></div></div><div class=\"plan-card-actions\"><button type=\"button\" class=\"button button-edit\"><span class=\"button-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"></path><path d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\"></path></svg></span><span>Bearbeiten</span></button><button class=\"" + deleteClass + "\" title=\"\" aria-label=\"\"><span class=\"button-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\">" + deleteSvgPaths + "</svg></span><span></span></button></div></div><div class=\"plan-set-list\"></div><div class=\"plan-history\"></div><div class=\"plan-chart-section\"><p class=\"plan-chart-title\">Verlauf</p><div class=\"plan-chart-wrapper\"><canvas class=\"plan-chart\"></canvas></div></div>";

    card.querySelector(".plan-exercise-name").textContent = exercise.name;
    card.querySelector(".plan-prescription").textContent = exercise.sets + " × " + exercise.reps;

    const pauseBadgeEl = card.querySelector(".plan-pause-badge");
    if (exercise.pause) {
      pauseBadgeEl.textContent = "⏱ " + exercise.pause;
    } else {
      pauseBadgeEl.style.display = "none";
    }

    const noteEl = card.querySelector(".plan-note");
    if (exercise.note) {
      noteEl.textContent = exercise.note;
    } else {
      noteEl.style.display = "none";
    }

    const editBtn = card.querySelector(".button-edit");
    editBtn.dataset.day = activeDay.id;
    editBtn.dataset.exercise = exercise.name;

    const deleteBtn = card.querySelector(".plan-delete-button");
    deleteBtn.dataset.day = activeDay.id;
    deleteBtn.dataset.exercise = exercise.name;
    deleteBtn.title = deleteTitle;
    deleteBtn.setAttribute("aria-label", deleteAriaLabel);
    deleteBtn.querySelector("span:last-child").textContent = deleteLabel;

    const setList = card.querySelector(".plan-set-list");
    const historyBlock = card.querySelector(".plan-history");
    const chartCanvas = card.querySelector(".plan-chart");

    currentValues.sets.forEach(function (setEntry, index) {
      const row = document.createElement("div");
      row.className = "plan-set-row";

      const setLabel = document.createElement("p");
      setLabel.className = "plan-set-label";
      setLabel.textContent = "Satz " + (index + 1);

      const weightLabel = document.createElement("label");
      weightLabel.className = "field";
      weightLabel.innerHTML = "<span>Gewicht (kg)</span><input class=\"plan-set-input\" type=\"number\" min=\"0\" step=\"0.5\" placeholder=\"z. B. 22.5\">";

      const repsLabel = document.createElement("label");
      repsLabel.className = "field";
      repsLabel.innerHTML = "<span>Wiederholungen</span><input class=\"plan-set-input\" type=\"number\" min=\"0\" step=\"1\" placeholder=\"z. B. 8\">";

      const weightField = weightLabel.querySelector("input");
      const repsField = repsLabel.querySelector("input");

      weightField.value = setEntry.weight || "";
      repsField.value = setEntry.reps || "";

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

    if (isCompleted) {
      const badge = document.createElement("p");
      badge.className = "plan-completed-badge";
      badge.textContent = "✓ Erledigt";
      card.append(badge);
    } else {
      const completeBtn = document.createElement("button");
      completeBtn.type = "button";
      completeBtn.className = "button button-complete-exercise";
      completeBtn.dataset.day = activeDay.id;
      completeBtn.dataset.exercise = exercise.name;
      completeBtn.innerHTML = "<span class=\"button-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M5 12l4 4L19 6\"></path></svg></span><span>Übung abschließen</span>";
      card.append(completeBtn);
    }

    planExercises.append(card);
    requestAnimationFrame(function () { renderExerciseChart(chartCanvas, exerciseId); });
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
      exerciseId: getExerciseId(dayId, exercise.name),
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

  const exerciseId = getExerciseId(dayId, exerciseName);
  trainingHistory = trainingHistory.filter((entry) => entry.exerciseId !== exerciseId);
  saveTrainingHistory();

  savePlanStructure();
  renderTrainingPlan();
  showResetFeedback();
}

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

exportDataButton.addEventListener("click", () => {
  exportDataAsJson();
});

dayTabs.addEventListener("click", (event) => {
  const dayButton = event.target.closest(".day-tab");

  if (!dayButton) {
    return;
  }

  activeTrainingDay = dayButton.dataset.day;
  planCompletedToday = {};
  editingExercise = null;
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
  const editButton = event.target.closest(".button-edit");
  const saveEditButton = event.target.closest(".plan-edit-save-button");
  const cancelEditButton = event.target.closest(".plan-edit-cancel-button");
  const completeButton = event.target.closest(".button-complete-exercise");

  if (deleteButton) {
    deletePlanExercise(deleteButton.dataset.day, deleteButton.dataset.exercise);
    return;
  }

  if (editButton) {
    editingExercise = { dayId: editButton.dataset.day, name: editButton.dataset.exercise };
    renderTrainingPlan();
    return;
  }

  if (cancelEditButton) {
    editingExercise = null;
    renderTrainingPlan();
    return;
  }

  if (saveEditButton) {
    const card = saveEditButton.closest(".plan-card");
    const newName = card.querySelector(".plan-edit-name").value;
    const newSets = card.querySelector(".plan-edit-sets").value;
    const newReps = card.querySelector(".plan-edit-reps").value;
    const newPause = card.querySelector(".plan-edit-pause")?.value ?? "";
    const newNote = card.querySelector(".plan-edit-note")?.value ?? "";
    editPlanExercise(saveEditButton.dataset.day, saveEditButton.dataset.exercise, newName, newSets, newReps, newPause, newNote);
    return;
  }

  if (completeButton) {
    completeExercise(completeButton.dataset.day, completeButton.dataset.exercise);
    return;
  }
});

renderResetTexts();
renderPersonalization();
renderDayTabs();
renderTrainingPlan();

