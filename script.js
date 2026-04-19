const STORAGE_KEYS = {
  exercises: "gym-log-exercises",
  logs: "gym-log-entries",
  trainingPlan: "gym-log-training-plan",
};

const defaultExercises = [
  "Bankdrücken",
  "Kniebeugen",
  "Kreuzheben",
  "Schulterdrücken",
];

const trainingDays = [
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
let planEntries = readStorage(STORAGE_KEYS.trainingPlan, {});
let activeTrainingDay = trainingDays[0].id;

if (!Array.isArray(exercises) || exercises.length === 0) {
  exercises = [...defaultExercises];
}

if (!Array.isArray(logs)) {
  logs = [];
}

if (!planEntries || typeof planEntries !== "object" || Array.isArray(planEntries)) {
  planEntries = {};
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getTrainingDay(dayId) {
  return trainingDays.find((day) => day.id === dayId) ?? trainingDays[0];
}

function getPlanEntry(dayId, exerciseName) {
  return planEntries[dayId]?.[exerciseName] ?? { weight: "", reps: "" };
}

function savePlanField(dayId, exerciseName, field, value) {
  if (!planEntries[dayId]) {
    planEntries[dayId] = {};
  }

  const currentEntry = planEntries[dayId][exerciseName] ?? { weight: "", reps: "" };
  planEntries[dayId][exerciseName] = {
    ...currentEntry,
    [field]: value,
  };

  saveStorage(STORAGE_KEYS.trainingPlan, planEntries);
}

function renderDayTabs() {
  dayTabs.innerHTML = "";

  trainingDays.forEach((day) => {
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
  planExercises.innerHTML = "";

  activeDay.exercises.forEach((exercise) => {
    const fragment = planExerciseTemplate.content.cloneNode(true);
    const weightField = fragment.querySelector(".plan-weight-input");
    const repsField = fragment.querySelector(".plan-reps-input");
    const savedValues = getPlanEntry(activeDay.id, exercise.name);

    fragment.querySelector(".plan-exercise-name").textContent = exercise.name;
    fragment.querySelector(".plan-prescription").textContent = `${exercise.sets} ${exercise.reps}`;

    weightField.value = savedValues.weight ?? "";
    repsField.value = savedValues.reps ?? "";
    weightField.dataset.day = activeDay.id;
    weightField.dataset.exercise = exercise.name;
    weightField.dataset.field = "weight";
    repsField.dataset.day = activeDay.id;
    repsField.dataset.exercise = exercise.name;
    repsField.dataset.field = "reps";

    planExercises.append(fragment);
  });
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

dayTabs.addEventListener("click", (event) => {
  const dayButton = event.target.closest(".day-tab");

  if (!dayButton) {
    return;
  }

  activeTrainingDay = dayButton.dataset.day;
  renderDayTabs();
  renderTrainingPlan();
});

planExercises.addEventListener("input", (event) => {
  const input = event.target.closest("input");

  if (!input) {
    return;
  }

  savePlanField(input.dataset.day, input.dataset.exercise, input.dataset.field, input.value);
});

renderDayTabs();
renderTrainingPlan();
renderExercises();
renderLogs();
