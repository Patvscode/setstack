// ─── Workout Tracker v3.2: Plans → Routines → Exercises ────
// Data hierarchy: Plans → Routines → Exercises
//
// Features:
//   - Quick set entry: ⚡ weight presets, Enter auto-advance, arrow keys navigate
//   - Rest timer: auto-starts on set complete, countdown, vibration + visual alert
//   - Last workout comparison: shows "Last: 225×12" next to set input
//   - Edit completed sets: tap a checked set to adjust weight/reps
//   - Plans: create/edit/delete multi-month training programs
//   - Auto-fill reps from plan spec
//   - All input saves instantly to localStorage

const DEFAULT_PLANS = [
    {
        id: "hype", name: "Hype — 5 Day Split", icon: "🔥", color: "#e74c3c",
        duration: "8-12 weeks", phase: "bulking",
        routines: [
            { id: "hype-back", name: "Back", dayOfWeek: 1, exercises: [
                { name: "Deadlifts", sets: 4, reps: "10, 8, 8, then to failure", rest: "3 min", notes: "Progressive overload" },
                { name: "Bent-Over Rows", sets: 4, reps: "12, 10, 10, 8", rest: "2 min", notes: "" },
                { name: "Wide-Grip Lat Pulldowns", sets: 4, reps: "12-15", rest: "90 sec", notes: "or assisted pull-ups" },
                { name: "Straight-Arm Pulldowns", sets: 4, reps: "12-15", rest: "90 sec", notes: "" },
                { name: "Dumbbell Rows", sets: 4, reps: "15, 12, 10, 10", rest: "2 min", notes: "" },
                { name: "Machine Rows", sets: 3, reps: "20", rest: "90 sec", notes: "" },
                { name: "Hyperextensions", sets: 2, reps: "to failure", rest: "90 sec", notes: "Bodyweight or light" },
            ]},
            { id: "hype-chest", name: "Chest & Biceps", dayOfWeek: 2, exercises: [
                { name: "Incline DB Bench Press", sets: 5, reps: "15, 15, 12, 12, 10", rest: "2-3 min", notes: "" },
                { name: "Smith Machine Bench Press", sets: 4, reps: "12, 10, 8, 8", rest: "2 min", notes: "" },
                { name: "Incline DB Flyes", sets: 3, reps: "15, 12, 12", rest: "90 sec", notes: "" },
                { name: "Cable Flyes", sets: 3, reps: "12-15", rest: "90 sec", notes: "" },
                { name: "Push-Ups", sets: 3, reps: "to failure", rest: "90 sec", notes: "Finisher" },
                { name: "Barbell Curls", sets: 3, reps: "15", rest: "60 sec", notes: "" },
                { name: "Reverse Barbell Curls", sets: 3, reps: "to failure", rest: "60 sec", notes: "" },
                { name: "Machine Preacher Curls", sets: 3, reps: "10-12", rest: "60 sec", notes: "" },
                { name: "Hammer Curls", sets: 2, reps: "8-10", rest: "60 sec", notes: "" },
            ]},
            { id: "hype-hams", name: "Hamstrings & Glutes", dayOfWeek: 3, exercises: [
                { name: "Lying Leg Curls", sets: 4, reps: "15", rest: "90 sec", notes: "" },
                { name: "Straight-Legged Deadlifts", sets: 4, reps: "15-20", rest: "2 min", notes: "" },
                { name: "Standing Leg Curls", sets: 2, reps: "4-5", rest: "2 min", notes: "Heavy, low reps" },
                { name: "Reverse Hack Squat", sets: 4, reps: "15-20", rest: "2 min", notes: "" },
                { name: "Glute Kickbacks", sets: 3, reps: "12-15", rest: "12-15", notes: "Single-leg pushdowns or cable" },
            ]},
            { id: "hype-shoulders", name: "Shoulders & Triceps", dayOfWeek: 4, exercises: [
                { name: "DB Lateral Raises", sets: 3, reps: "15", rest: "60 sec", notes: "" },
                { name: "DB Shoulder Press", sets: 3, reps: "12", rest: "2 min", notes: "" },
                { name: "Barbell Front Raises", sets: 3, reps: "12", rest: "90 sec", notes: "" },
                { name: "Single-Arm Cable Raise", sets: 4, reps: "20, 15, 12, 12", rest: "60 sec", notes: "" },
                { name: "Upright Rows", sets: 3, reps: "15, 12, 12", rest: "90 sec", notes: "" },
                { name: "Rope Face Pulls", sets: 3, reps: "15, 12, 12", rest: "90 sec", notes: "" },
                { name: "Machine Lateral Raises", sets: 3, reps: "15", rest: "60 sec", notes: "" },
                { name: "Bench Dips", sets: 4, reps: "12-15", rest: "90 sec", notes: "" },
                { name: "EZ-Bar Skull Crushers", sets: 4, reps: "12-15", rest: "90 sec", notes: "" },
                { name: "Reverse-Grip Skull Crushers", sets: 4, reps: "8-10", rest: "90 sec", notes: "" },
                { name: "Single-Arm Cable Kickbacks", sets: 3, reps: "12, 10, 8", rest: "60 sec", notes: "" },
            ]},
            { id: "hype-quads", name: "Quads", dayOfWeek: 5, exercises: [
                { name: "Leg Extensions", sets: 3, reps: "15", rest: "90 sec", notes: "" },
                { name: "Squats", sets: 2, reps: "8", rest: "3 min", notes: "" },
                { name: "Leg Press", sets: 4, reps: "40, 30, 20, 10", rest: "2 min", notes: "Drop set scheme" },
                { name: "Leg Extensions", sets: 4, reps: "15", rest: "90 sec", notes: "Second block" },
                { name: "Standing Lunges", sets: 4, reps: "6-8", rest: "2 min", notes: "Each leg" },
            ]},
        ]
    },
];

const ICONS = ["💪","🏋️","🦵","🔙","🏃","🎯","🧘","⚡","🔥","💥","👊","🦾","🦿","🤸","🏀","⛹️","🤾","🏌️","🎾","🥊","🏆","❤️","🧠","🦷","👁️","👂","👃","🧬","🫁","💀"];
const COLORS = ["#e74c3c","#e67e22","#f39c12","#2ecc71","#1abc9c","#3498db","#2980b9","#9b59b6","#8e44ad","#e84393","#fd79a8","#6c5ce7","#00b894","#fdcb6e","#e17055","#0984e3","#d63031","#a29bfe","#55efc4","#fab1a0"];

const STORAGE_KEY = "workout-tracker-v3";
const TIMER_STORAGE_KEY = "rest-timer";

// ─── Data Layer ──────────────────────────────────────────────────────
function loadData() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function getDateKey() { return new Date().toISOString().split("T")[0]; }

// ─── Plans & Routines ────────────────────────────────────────────────
function getPlans() {
    const data = loadData();
    return data.plans || DEFAULT_PLANS;
}

function savePlans(plans) {
    const data = loadData();
    data.plans = plans;
    saveData(data);
}

function getPlanById(id) { return getPlans().find(p => p.id === id); }
function getDefaultPlans() { return DEFAULT_PLANS; }
function isDefaultPlan(id) { return getDefaultPlans().some(d => d.id === id); }

function getTodayRoutine() {
    const plans = getPlans();
    const dow = new Date().getDay();
    for (const plan of plans) {
        const routine = plan.routines.find(r => r.dayOfWeek === dow);
        if (routine) return { plan, routine };
    }
    for (const plan of plans) {
        for (const routine of plan.routines) {
            if (routine.dayOfWeek === dow) return { plan, routine };
        }
    }
    return null;
}

// ─── Workout Entries ─────────────────────────────────────────────────
function getTodayEntry() {
    const data = loadData();
    const key = getDateKey();
    if (!data[key]) {
        const dow = new Date().getDay();
        const today = getTodayRoutine();
        data[key] = {
            date: key, dayOfWeek: dow,
            planId: today ? today.plan.id : null,
            routineId: today ? today.routine.id : null,
            routineName: today ? today.routine.name : null,
            planName: today ? today.plan.name : null,
            planColor: today ? today.plan.color : "#95a5a6",
            exercises: {},
            completed: false,
            startTime: null,
            endTime: null,
            totalTime: null,
        };
        saveData(data);
    }
    return data[key];
}

function getExerciseLog(date, exerciseIdx) {
    const data = loadData();
    const key = date;
    if (!data[key]) return null;
    return data[key].exercises[exerciseIdx];
}

function saveExerciseLog(date, exerciseIdx, sets) {
    const data = loadData();
    const key = date;
    if (!data[key]) return;
    data[key].exercises[exerciseIdx] = sets;
    saveData(data);
}

// Get previous workout data for the same exercise (most recent completed)
function getPreviousExerciseData(exerciseName) {
    const data = loadData();
    const completedDays = Object.entries(data)
        .filter(([key, val]) => val.completed && val.exercises && val.routineName)
        .sort((a, b) => b[0].localeCompare(a[0]));

    for (const [, entry] of completedDays) {
        if (entry.exercises) {
            for (let idx = 0; idx < entry.exercises.length; idx++) {
                const exRoutine = findExerciseByName(entry, exerciseName, idx);
                if (exRoutine) {
                    return { entry, sets: entry.exercises[idx], exerciseName };
                }
            }
        }
    }
    return null;
}

function findExerciseByName(entry, name, startIdx) {
    const routine = entry.routineId ? getRoutineForExercise(entry, name) : null;
    if (routine) {
        const idx = Object.keys(entry.exercises).find(k => {
            const sets = entry.exercises[k];
            return sets && sets.some(s => s.weight || s.reps);
        });
        if (idx !== undefined) return parseInt(idx);
    }
    // Fallback: just return first non-empty exercise
    for (const [k, sets] of Object.entries(entry.exercises)) {
        const i = parseInt(k);
        if (i >= startIdx && sets && sets.some(s => s.weight || s.reps)) return i;
    }
    return null;
}

function getRoutineForExercise(entry, exerciseName) {
    const plan = getPlanById(entry.planId);
    if (!plan) return null;
    for (const routine of plan.routines) {
        if (routine.exercises.some(e => e.name === exerciseName)) return routine;
    }
    return null;
}

function getPreviousSetData(exerciseName, setIndex) {
    const prev = getPreviousExerciseData(exerciseName);
    if (!prev) return null;
    const set = prev.sets[setIndex];
    if (!set) return null;
    return {
        weight: set.weight || set.reps || '',
        reps: set.reps || '',
        rir: set.rir || '',
    };
}

function getWorkoutLogs() {
    const data = loadData();
    const logs = [];
    for (const [date, entry] of Object.entries(data)) {
        if (entry.completed && entry.exercises) {
            logs.push({
                date,
                planName: entry.planName || "Custom",
                routineName: entry.routineName || "Workout",
                planColor: entry.planColor || "#95a5a6",
                exerciseCount: Object.keys(entry.exercises).length,
                totalSets: Object.values(entry.exercises).reduce((s, sets) => s + sets.length, 0),
                startTime: entry.startTime,
                endTime: entry.endTime,
            });
        }
    }
    return logs.sort((a, b) => b.date.localeCompare(a.date));
}

// ─── Goals ───────────────────────────────────────────────────────────
function getGoals() {
    const data = loadData();
    return data.goals || {
        targetWorkoutsPerWeek: 5,
        currentWeekStart: getWeekStart(),
        bodyweight: null,
        bodyweightUnit: "lbs",
        notes: "",
    };
}

function saveGoals(goals) {
    const data = loadData();
    data.goals = goals;
    saveData(data);
}

function getWeekStart() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diff);
    return monday.toISOString().split("T")[0];
}

function getWeeklyCount() {
    const logs = getWorkoutLogs();
    const weekStart = getGoals().currentWeekStart;
    return logs.filter(l => l.date >= weekStart).length;
}

// ─── Quick Weight Presets ────────────────────────────────────────────
const WEIGHT_PRESETS = [5, 7.5, 10, 15, 20, 25, 35, 45, 90];

function getWeightPresets() {
    const data = loadData();
    return data.weightPresets || WEIGHT_PRESETS;
}

function saveWeightPresets(presets) {
    const data = loadData();
    data.weightPresets = presets;
    saveData(data);
}

// ─── Rest Timer ──────────────────────────────────────────────────────
let restTimerInterval = null;
let restTimerRemaining = 0;
let restTimerTarget = 0;

function parseRestTime(restStr) {
    if (!restStr) return 90;
    restStr = restStr.toLowerCase().trim();
    const minMatch = restStr.match(/(\d+)\s*min/);
    const secMatch = restStr.match(/(\d+)\s*sec/);
    if (minMatch) return parseInt(minMatch[1]) * 60;
    if (secMatch) return parseInt(secMatch[1]);
    // "2-3 min" -> use lower bound
    const rangeMatch = restStr.match(/(\d+)\s*-\s*(\d+)\s*min/);
    if (rangeMatch) return parseInt(rangeMatch[1]) * 60;
    return 90; // default 90 seconds
}

function startRestTimer(exerciseIdx, setIdx) {
    stopRestTimer();

    const routine = getTodayRoutine();
    if (!routine) return;
    const ex = routine.routine.exercises[exerciseIdx];
    if (!ex) return;

    const seconds = parseRestTime(ex.rest);
    restTimerRemaining = seconds;
    restTimerTarget = seconds;

    saveTimerState(exerciseIdx, setIdx, seconds);
    renderTimer();
    updateStatusStrip();
}

function stopRestTimer() {
    if (restTimerInterval) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
    }
    clearTimerState();
}

function tickRestTimer() {
    restTimerRemaining--;
    renderTimer();

    if (restTimerRemaining <= 0) {
        // Timer done!
        triggerRestAlert();
        return;
    }

    if (restTimerRemaining <= 3 && restTimerRemaining > 0) {
        // Vibration countdown
        if (navigator.vibrate) navigator.vibrate(100);
    }
}

function triggerRestAlert() {
    stopRestTimer();
    updateStatusStrip();

    // Visual: flash the status strip
    const strip = document.getElementById('status-strip');
    if (strip) {
        strip.style.background = 'rgba(129, 199, 132, 0.3)';
        setTimeout(() => { strip.style.background = ''; }, 1500);
    }

    // Sound: beep via oscillator
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        gain.gain.value = 0.3;
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
        setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.frequency.value = 1000;
            gain2.gain.value = 0.3;
            osc2.start();
            osc2.stop(ctx.currentTime + 0.3);
        }, 350);
    } catch (e) { /* audio not available */ }

    // Vibration pattern
    if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
}

function resumeRestTimer() {
    const state = loadTimerState();
    if (state && state.remaining > 0) {
        restTimerRemaining = state.remaining;
        restTimerTarget = state.target;
        restTimerInterval = setInterval(tickRestTimer, 1000);
        updateStatusStrip();
    }
}

function saveTimerState(exIdx, setIdx, remaining) {
    const state = { exIdx, setIdx, remaining, target: remaining, startedAt: Date.now() };
    try { localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function loadTimerState() {
    try {
        const s = localStorage.getItem(TIMER_STORAGE_KEY);
        return s ? JSON.parse(s) : null;
    } catch { return null; }
}

function clearTimerState() {
    try { localStorage.removeItem(TIMER_STORAGE_KEY); } catch {}
}

function renderTimer() {
    if (restTimerRemaining <= 0) return;
    const mins = Math.floor(restTimerRemaining / 60);
    const secs = restTimerRemaining % 60;
    const display = `${mins}:${secs.toString().padStart(2, '0')}`;

    const timerBtn = document.getElementById('rest-timer-btn');
    if (timerBtn) {
        timerBtn.innerHTML = `⏱ <span id="timer-display">${display}</span>`;
        timerBtn.style.borderColor = 'var(--accent)';
        timerBtn.style.color = 'var(--accent)';
    }

    const progressFill = document.getElementById('timer-progress-fill');
    if (progressFill) {
        const pct = Math.max(0, (restTimerRemaining / restTimerTarget) * 100);
        progressFill.style.width = pct + '%';
    }
}

function toggleRestTimer() {
    if (restTimerRemaining > 0 && restTimerInterval) {
        // Pause
        stopRestTimer();
        updateStatusStrip();
    } else {
        // Resume or start fresh
        resumeRestTimer();
    }
}

function dismissRestTimer() {
    stopRestTimer();
    updateStatusStrip();
}

// ─── UI Rendering ────────────────────────────────────────────────────
function init() {
    const now = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    document.getElementById('today-date').textContent = now.toLocaleDateString('en-US', options);
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    document.getElementById('today-dayname').textContent = dayNames[now.getDay()];

    renderToday();
    renderPlans();
    renderLog();
    renderProgress();
    renderGoals();
    renderSettings();
    setupTabs();

    // Restore rest timer if workout was in progress
    resumeRestTimer();
}

// ─── TODAY VIEW ──────────────────────────────────────────────────────
function renderToday() {
    const today = getTodayEntry();
    const todayRoutine = getTodayRoutine();

    updateStatusStrip();

    if (!todayRoutine) {
        document.getElementById('today-workout').innerHTML = `
            <div class="rest-day">
                <div class="rest-icon">😴</div>
                <h3>Rest Day</h3>
                <p>No routine scheduled for today. Go to Plans to set up your training.</p>
                <button class="btn btn-rest" onclick="completeRestDay()">Mark Rest Day ✓</button>
            </div>`;
        return;
    }

    const routine = todayRoutine.routine;
    const plan = todayRoutine.plan;
    const exercises = routine.exercises;
    const totalSets = exercises.reduce((s, e) => s + e.sets, 0);
    const completedSets = Object.values(today.exercises || {}).reduce((s, sets) => s + sets.filter(x => x.done).length, 0);
    const pct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

    let html = `
        <div class="workout-header">
            <span class="workout-plan-name" style="color:${plan.color}">${plan.icon} ${plan.name}</span>
            <span class="workout-progress">${pct}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${plan.color}"></div></div>
        <p class="workout-meta">
            ${routine.name} · ${exercises.length} exercises · ${totalSets} sets · ${completedSets}/${totalSets} sets done
        </p>`;

    exercises.forEach((ex, idx) => {
        const log = getExerciseLog(getDateKey(), idx);
        const setsDone = log ? log.filter(s => s.done).length : 0;
        const allDone = setsDone === ex.sets;

        html += `
            <div class="exercise-card" id="exercise-${idx}">
                <div class="exercise-header ${allDone ? 'done' : ''}" onclick="toggleExerciseBody(${idx})">
                    <div>
                        <h3>${ex.name}</h3>
                        <p class="exercise-target">${ex.sets} sets × ${ex.reps} · ${ex.rest} rest</p>
                        ${ex.notes ? `<p class="exercise-notes">📝 ${ex.notes}</p>` : ''}
                    </div>
                    <div class="exercise-check">
                        <span class="sets-counter">${setsDone}/${ex.sets}</span>
                    </div>
                </div>
                <div class="exercise-body" id="exercise-body-${idx}" style="display:block">
                    ${renderSets(ex, idx, log)}
                </div>
            </div>`;
    });

    if (completedSets > 0 && !today.completed) {
        html += `<button class="btn btn-finish" onclick="finishWorkout()">🏁 Finish Workout</button>`;
    }

    document.getElementById('today-workout').innerHTML = html;
}

function renderSets(ex, idx, log) {
    let html = '<div class="sets-container">';

    // Get previous workout data for comparison
    const prevData = getPreviousSetData(ex.name, 0);

    for (let i = 0; i < ex.sets; i++) {
        const set = log ? log[i] : null;
        const weight = set ? set.weight : '';
        const reps = set ? set.reps : '';
        const rir = set ? set.rir : '';
        const done = set ? set.done : false;

        const defaultReps = getSetReps(ex.reps, ex.sets, i);

        // Get previous set's data for this specific set index
        const prevSetData = getPreviousSetData(ex.name, i);
        const prevWeight = prevSetData ? prevSetData.weight : '';
        const prevReps = prevSetData ? prevSetData.reps : '';

        html += `
            <div class="set-row ${done ? 'set-done' : ''}" id="set-${idx}-${i}">
                <span class="set-num">Set ${i + 1}</span>
                <div class="set-inputs">
                    <input type="number" class="set-input weight-input" placeholder="lbs"
                        value="${weight}" oninput="autoSaveSet(${idx}, ${i}, 'weight', this.value)"
                        onkeydown="handleSetKey(event, ${idx}, ${i}, ${ex.sets})"
                        ${done ? 'disabled' : ''} aria-label="Weight">
                    <button class="btn-weight-preset" onclick="openWeightPreset(${idx},${i})" title="Quick weights">⚡</button>
                    <input type="number" class="set-input reps-input" placeholder="${defaultReps}"
                        value="${reps}" oninput="autoSaveSet(${idx}, ${i}, 'reps', this.value)"
                        onkeydown="handleSetKey(event, ${idx}, ${i}, ${ex.sets})"
                        ${done ? 'disabled' : ''} aria-label="Reps">
                    <input type="number" class="set-input rir-input" placeholder="RIR"
                        value="${rir}" oninput="autoSaveSet(${idx}, ${i}, 'rir', this.value)"
                        onkeydown="handleSetKey(event, ${idx}, ${i}, ${ex.sets})"
                        ${done ? 'disabled' : ''} aria-label="RIR" title="Reps in reserve">
                </div>
                <div class="set-actions">
                    <button class="btn-set ${done ? 'btn-done' : 'btn-check'}"
                        onclick="toggleSet(${idx}, ${i})" ${done ? 'disabled' : ''}>
                        ${done ? '✓' : '○'}
                    </button>
                    ${!done ? `<button class="btn-set-next" onclick="advanceToSet(${idx}, ${i})" title="Next set">⏭</button>` : ''}
                    ${done ? `<button class="btn-set-edit" onclick="editSet(${idx}, ${i})" title="Edit">✏️</button>` : ''}
                </div>
            </div>
            ${prevWeight || prevReps ? `
            <div class="prev-set" data-prev-idx="${idx}" data-prev-set="${i}">
                ${prevWeight ? `<span class="prev-weight">Last: ${prevWeight}${prevReps ? '×' + prevReps : ''}</span>` : ''}
            </div>` : ''}
        `;
    }

    html += '</div>';
    return html;
}

// ─── Quick Set Entry Helpers ─────────────────────────────────────────
function handleSetKey(event, exerciseIdx, setIdx, totalSets) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const setRow = document.getElementById(`set-${exerciseIdx}-${setIdx}`);
        if (setRow) {
            const doneBtn = setRow.querySelector('.btn-check');
            if (doneBtn) {
                doneBtn.click();
                if (setIdx < totalSets - 1) {
                    setTimeout(() => advanceToSet(exerciseIdx, setIdx), 100);
                }
            }
        }
    }
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        advanceToSet(exerciseIdx, setIdx);
    }
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (setIdx > 0) {
            const prevRow = document.getElementById(`set-${exerciseIdx}-${setIdx - 1}`);
            if (prevRow) {
                const input = prevRow.querySelector('.weight-input, .reps-input, .rir-input:not(:disabled)');
                if (input) input.focus();
            }
        }
    }
}

function advanceToSet(exerciseIdx, currentSetIdx) {
    const nextIdx = currentSetIdx + 1;
    const nextRow = document.getElementById(`set-${exerciseIdx}-${nextIdx}`);
    if (nextRow) {
        const input = nextRow.querySelector('.weight-input:not(:disabled)');
        if (input) input.focus();
    }
}

function setWeight(exerciseIdx, setIdx, weight) {
    autoSaveSet(exerciseIdx, setIdx, 'weight', weight);
    closeWeightModal();
    setTimeout(() => renderToday(), 50);
}

function openWeightPreset(exerciseIdx, setIdx) {
    const presets = getWeightPresets();
    const body = document.getElementById('weight-preset-body');

    let html = '<div class="preset-grid">';
    presets.forEach(w => {
        html += `<button class="preset-btn" onclick="setWeight(${exerciseIdx}, ${setIdx}, ${w})">${w} lbs</button>`;
    });
    html += '</div>';

    html += `
        <div class="preset-custom">
            <label>Custom presets (comma separated):
                <input type="text" class="preset-input" value="${presets.join(',')}"
                    onchange="updatePresets(this.value)">
            </label>
        </div>`;

    body.innerHTML = html;
    document.getElementById('weight-modal').style.display = 'flex';
}

function updatePresets(value) {
    const presets = value.split(',').map(s => {
        const n = parseInt(s.trim());
        return isNaN(n) ? 0 : n;
    }).filter(n => n > 0);
    saveWeightPresets(presets);
}

function getSetReps(repsSpec, totalSets, setIdx) {
    if (!repsSpec) return '';
    if (repsSpec.includes(',')) {
        const parts = repsSpec.split(',').map(s => s.trim());
        return parts[setIdx] || parts[parts.length - 1];
    }
    if (repsSpec.includes('-')) return repsSpec;
    if (!isNaN(repsSpec)) return repsSpec;
    return repsSpec;
}

function autoSaveSet(exerciseIdx, setIdx, field, value) {
    const date = getDateKey();
    const log = getExerciseLog(date, exerciseIdx);
    const sets = log || [];
    if (!sets[setIdx]) sets[setIdx] = { done: false };
    sets[setIdx][field] = value;
    saveExerciseLog(date, exerciseIdx, sets);
    updateSetCount(exerciseIdx);
}

function toggleSet(exerciseIdx, setIdx) {
    const date = getDateKey();
    const log = getExerciseLog(date, exerciseIdx);
    const sets = log || [];
    if (!sets[setIdx]) sets[setIdx] = { done: false };
    sets[setIdx].done = !sets[setIdx].done;
    saveExerciseLog(date, exerciseIdx, sets);

    const row = document.getElementById(`set-${exerciseIdx}-${setIdx}`);
    if (row) {
        row.classList.toggle('set-done', sets[setIdx].done);
        const btn = row.querySelector('.btn-set');
        if (btn) {
            btn.className = `btn-set ${sets[setIdx].done ? 'btn-done' : 'btn-check'}`;
            btn.innerHTML = sets[setIdx].done ? '✓' : '○';
            btn.disabled = sets[setIdx].done;
            const nextBtn = row.querySelector('.btn-set-next');
            if (nextBtn) nextBtn.style.display = sets[setIdx].done ? 'inline-flex' : 'none';
        }
        // Show edit button if done
        let editBtn = row.querySelector('.btn-set-edit');
        if (!sets[setIdx].done && editBtn) {
            editBtn.remove();
        } else if (sets[setIdx].done && !editBtn) {
            row.querySelector('.set-actions').insertAdjacentHTML('beforeend',
                '<button class="btn-set-edit" onclick="editSet(' + exerciseIdx + ', ' + setIdx + ')" title="Edit">✏️</button>');
        }
        // Disable inputs
        row.querySelectorAll('.set-input:not(:disabled)').forEach(inp => {
            if (sets[setIdx].done) inp.disabled = true;
        });
    }

    updateSetCount(exerciseIdx);
    updateExerciseHeader(exerciseIdx);
    updateOverallProgress();

    // Start rest timer when set is checked
    if (sets[setIdx].done) {
        startRestTimer(exerciseIdx, setIdx);
    } else {
        stopRestTimer();
    }
}

function editSet(exerciseIdx, setIdx) {
    const date = getDateKey();
    const log = getExerciseLog(date, exerciseIdx);
    const sets = log || [];
    const set = sets[setIdx] || { done: false, weight: '', reps: '', rir: '' };

    const weight = prompt('Weight (lbs):', set.weight || '');
    if (weight === null) return;
    const reps = prompt('Reps:', set.reps || '');
    if (reps === null) return;
    const rir = prompt('RIR (optional):', set.rir || '');
    if (rir === null) return;

    sets[setIdx] = { done: true, weight, reps, rir: rir || '' };
    saveExerciseLog(date, exerciseIdx, sets);
    renderToday();
    updateOverallProgress();
}

function updateSetCount(exerciseIdx) {
    const ex = getTodayRoutine()?.routine?.exercises[exerciseIdx];
    if (!ex) return;
    const log = getExerciseLog(getDateKey(), exerciseIdx);
    const done = log ? log.filter(s => s.done).length : 0;
    const counter = document.querySelector(`#exercise-${exerciseIdx} .sets-counter`);
    if (counter) counter.textContent = `${done}/${ex.sets}`;
}

function updateExerciseHeader(exerciseIdx) {
    const header = document.querySelector(`#exercise-${exerciseIdx} .exercise-header`);
    if (!header) return;
    const ex = getTodayRoutine()?.routine?.exercises[exerciseIdx];
    if (!ex) return;
    const log = getExerciseLog(getDateKey(), exerciseIdx);
    const done = log ? log.filter(s => s.done).length : 0;
    const allDone = done === ex.sets;
    header.classList.toggle('done', allDone);
}

function updateOverallProgress() {
    const today = getTodayEntry();
    const routine = getTodayRoutine();
    if (!routine) return;
    const totalSets = routine.routine.exercises.reduce((s, e) => s + e.sets, 0);
    const completedSets = Object.values(today.exercises || {}).reduce((s, sets) => s + sets.filter(x => x.done).length, 0);
    const pct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

    const fill = document.querySelector('#view-today .progress-fill');
    const progressSpan = document.querySelector('.workout-progress');
    const meta = document.querySelector('.workout-meta');
    if (fill) fill.style.width = pct + '%';
    if (progressSpan) progressSpan.textContent = pct + '%';
    if (meta) meta.textContent = `${routine.routine.name} · ${routine.routine.exercises.length} exercises · ${totalSets} sets · ${completedSets}/${totalSets} sets done`;

    updateStatusStrip();

    const existing = document.querySelector('.btn-finish');
    if (completedSets > 0 && !today.completed && !existing) {
        document.getElementById('today-workout').insertAdjacentHTML('beforeend',
            '<button class="btn btn-finish" onclick="finishWorkout()">🏁 Finish Workout</button>');
    }
}

// ─── Status Strip ──────────────────────────────────────────────────────
function updateStatusStrip() {
    const strip = document.getElementById('status-strip');
    if (!strip) return;

    const today = getTodayEntry();
    const todayRoutine = getTodayRoutine();

    if (todayRoutine && !today.completed) {
        const routine = todayRoutine.routine;
        const plan = todayRoutine.plan;
        const totalSets = routine.exercises.reduce((s, e) => s + e.sets, 0);
        const completedSets = today.exercises ? Object.values(today.exercises).reduce((s, sets) => s + sets.filter(x => x.done).length, 0) : 0;
        const pct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

        document.getElementById('status-name').textContent = `${plan.icon} ${routine.name}`;
        document.getElementById('status-detail').textContent = `${completedSets}/${totalSets} sets`;
        document.getElementById('status-progress').textContent = pct + '%';
        document.getElementById('status-progress-fill').style.width = pct + '%';

        // Show rest timer if active
        const timerBtn = document.getElementById('rest-timer-btn');
        if (restTimerRemaining > 0 && restTimerInterval) {
            if (timerBtn) {
                const mins = Math.floor(restTimerRemaining / 60);
                const secs = restTimerRemaining % 60;
                timerBtn.innerHTML = `⏱ ${mins}:${secs.toString().padStart(2, '0')}`;
                timerBtn.style.borderColor = 'var(--accent)';
                timerBtn.style.color = 'var(--accent)';
                timerBtn.style.display = 'inline-flex';
            }
        } else if (timerBtn) {
            timerBtn.style.display = 'none';
        }

        strip.classList.add('visible');
    } else if (today.completed) {
        document.getElementById('status-name').textContent = '✅ Workout Complete';
        document.getElementById('status-detail').textContent = today.totalTime ? today.totalTime + ' min' : '';
        document.getElementById('status-progress').textContent = '100%';
        document.getElementById('status-progress-fill').style.width = '100%';
        strip.classList.add('visible');
    } else {
        strip.classList.remove('visible');
    }
}

function toggleExerciseBody(idx) {
    const body = document.getElementById(`exercise-body-${idx}`);
    if (body) body.style.display = body.style.display === 'none' ? 'block' : 'none';
}

// ─── Finish Workout ──────────────────────────────────────────────────
function finishWorkout() {
    stopRestTimer();
    const today = getTodayEntry();
    today.endTime = new Date().toISOString();
    today.completed = true;
    if (today.startTime) {
        const start = new Date(today.startTime);
        const end = new Date(today.endTime);
        today.totalTime = Math.round((end - start) / 60000);
    }
    const data = loadData();
    data[getDateKey()] = today;
    saveData(data);
    renderToday();
    renderLog();
    renderProgress();
}

function completeRestDay() {
    const today = getTodayEntry();
    today.completed = true;
    const data = loadData();
    data[getDateKey()] = today;
    saveData(data);
    renderToday();
    renderLog();
    renderProgress();
}

// ─── PLANS VIEW ──────────────────────────────────────────────────────
function renderPlans() {
    const plans = getPlans();
    const container = document.getElementById('plan-list');
    const dayNames = ['','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

    let html = '';
    plans.forEach(plan => {
        const totalRoutines = plan.routines.length;
        const totalExercises = plan.routines.reduce((s, r) => s + r.exercises.length, 0);
        const totalSets = plan.routines.reduce((s, r) => s + r.exercises.reduce((ss, e) => ss + e.sets, 0), 0);
        const phaseLabel = plan.phase ? ` · ${plan.phase}` : '';
        const durLabel = plan.duration ? ` · ${plan.duration}` : '';

        html += `
            <div class="plan-card" style="border-left-color:${plan.color}">
                <div class="plan-card-header">
                    <div class="plan-icon">${plan.icon}</div>
                    <div>
                        <h3>${plan.name}</h3>
                        <p>${totalRoutines} routines · ${totalExercises} exercises · ${totalSets} sets${phaseLabel}${durLabel}</p>
                    </div>
                    <div class="plan-actions">
                        <button class="btn btn-sm" onclick="openRoutineSelector('${plan.id}')">Routines</button>
                        <button class="btn btn-sm" onclick="editPlan('${plan.id}')">✏️</button>
                        ${!isDefaultPlan(plan.id) ? `<button class="btn btn-sm btn-danger" onclick="deletePlan('${plan.id}')">🗑</button>` : ''}
                    </div>
                </div>
            </div>`;
    });

    container.innerHTML = html;
}

function openRoutineSelector(planId) {
    const plan = getPlanById(planId);
    if (!plan) return;
    const dayNames = ['','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

    let html = `
        <div class="routine-selector">
            <h3>${plan.icon} ${plan.name} — Routines</h3>
            ${plan.routines.map(r => {
                const totalSets = r.exercises.reduce((s, e) => s + e.sets, 0);
                const today = new Date().getDay();
                const isToday = r.dayOfWeek === today;
                return `
                    <div class="routine-item ${isToday ? 'routine-today' : ''}"
                         style="${isToday ? 'border-left:3px solid var(--accent)' : ''}">
                        <div>
                            <strong>${r.name} ${isToday ? '📍 Today' : ''}</strong>
                            <p>${dayNames[r.dayOfWeek]} · ${r.exercises.length} exercises · ${totalSets} sets</p>
                        </div>
                        <div class="routine-actions">
                            <button class="btn btn-sm" onclick="openRoutineEditor('${plan.id}','${r.id}')">Edit</button>
                            <button class="btn btn-sm btn-primary" onclick="previewRoutine('${plan.id}','${r.id}')">Preview</button>
                            ${!isDefaultPlan(planId) ? `<button class="btn btn-sm btn-danger" onclick="deleteRoutine('${plan.id}','${r.id}')">🗑</button>` : ''}
                        </div>
                    </div>`;
            }).join('')}
            <button class="btn btn-primary" onclick="openRoutineEditor('${plan.id}',null)" style="width:100%;margin-top:12px">+ Add Routine</button>
        </div>`;

    document.getElementById('plan-list').innerHTML = html + '<button class="btn btn-sm" onclick="renderPlans()" style="margin-top:12px">← Back to Plans</button>';
}

function previewRoutine(planId, routineId) {
    const plan = getPlanById(planId);
    if (!plan) return;
    const routine = plan.routines.find(r => r.id === routineId);
    if (!routine) return;
    const totalSets = routine.exercises.reduce((s, e) => s + e.sets, 0);
    const text = routine.exercises.map(e => `${e.name} — ${e.sets}×${e.reps}`).join('\n');
    alert(`${routine.name}\n\n${text}\n\nTotal: ${totalSets} sets`);
}

// ─── Routine Editor ──────────────────────────────────────────────────
let currentRoutineEdit = { planId: null, routineId: null };

function openRoutineEditor(planId, routineId) {
    const plan = getPlanById(planId);
    currentRoutineEdit = { planId, routineId };

    const isEditing = !!routineId;
    const routine = isEditing ? plan.routines.find(r => r.id === routineId) : null;

    document.getElementById('routine-editor-title').textContent = isEditing ? `Edit: ${routine.name}` : 'New Routine';

    const dayNames = ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const dayOptions = dayNames.map((d, i) => i === 0 ? '' : `<option value="${i}" ${routine && routine.dayOfWeek === i ? 'selected' : ''}>${d}</option>`).join('');

    let exercisesHtml = '';
    (routine ? routine.exercises : []).forEach((ex, idx) => {
        exercisesHtml += renderExerciseRow(ex, idx);
    });

    document.getElementById('routine-editor-content').innerHTML = `
        <div class="routine-form">
            <label>
                Routine Name
                <input type="text" id="re-name" placeholder="e.g., Back Day" value="${routine ? routine.name : ''}">
            </label>
            <label>
                Day of Week
                <select id="re-day">${dayOptions}</select>
            </label>

            <h4 style="margin-top:16px;margin-bottom:8px">Exercises</h4>
            <div id="re-exercises">${exercisesHtml}</div>
            <button class="btn btn-sm" onclick="addExerciseRow()" style="width:100%">+ Add Exercise</button>

            <div style="display:flex;gap:8px;margin-top:16px">
                <button class="btn btn-primary" onclick="saveRoutine()" style="flex:1">
                    ${isEditing ? 'Save Changes' : 'Create Routine'}
                </button>
                ${isEditing ? `<button class="btn btn-sm btn-danger" onclick="deleteRoutine('${planId}','${routineId}');goBackFromRoutine();">Delete</button>` : ''}
            </div>
            <button class="btn btn-sm" onclick="goBackFromRoutine()" style="width:100%;margin-top:8px">Cancel</button>
        </div>`;

    showView('routine-editor');
}

function goBackFromRoutine() {
    renderPlans();
    showView('plans');
}

function renderExerciseRow(ex, idx) {
    ex = ex || { name: '', sets: 3, reps: '', rest: '90 sec', notes: '' };
    return `
        <div class="exercise-row" id="er-${idx}">
            <input type="text" class="exercise-name-input" placeholder="Exercise name" value="${ex.name}">
            <input type="number" class="exercise-sets-input" placeholder="Sets" value="${ex.sets}" min="1" max="20">
            <input type="text" class="exercise-reps-input" placeholder="Reps (15,12,10)" value="${ex.reps}">
            <input type="text" class="exercise-rest-input" placeholder="Rest" value="${ex.rest}">
            <button class="btn btn-sm btn-danger" onclick="removeExerciseRow(${idx})">✕</button>
        </div>`;
}

function addExerciseRow() {
    const container = document.getElementById('re-exercises');
    const idx = Date.now();
    container.insertAdjacentHTML('beforeend', renderExerciseRow(null, idx));
}

function removeExerciseRow(idx) {
    const row = document.getElementById(`er-${idx}`);
    if (row) row.remove();
}

function saveRoutine() {
    const name = document.getElementById('re-name').value.trim();
    if (!name) { alert('Enter a routine name'); return; }

    const dayOfWeek = parseInt(document.getElementById('re-day').value) || 0;
    const exerciseRows = document.querySelectorAll('#re-exercises .exercise-row');
    const exercises = [];

    exerciseRows.forEach(row => {
        const exName = row.querySelector('.exercise-name-input').value.trim();
        if (!exName) return;
        exercises.push({
            name: exName,
            sets: parseInt(row.querySelector('.exercise-sets-input').value) || 3,
            reps: row.querySelector('.exercise-reps-input').value.trim(),
            rest: row.querySelector('.exercise-rest-input').value.trim() || '90 sec',
            notes: '',
        });
    });

    if (exercises.length === 0) { alert('Add at least one exercise'); return; }

    const plans = getPlans();
    const planIdx = plans.findIndex(p => p.id === currentRoutineEdit.planId);
    if (planIdx < 0) return;

    if (currentRoutineEdit.routineId) {
        const rIdx = plans[planIdx].routines.findIndex(r => r.id === currentRoutineEdit.routineId);
        if (rIdx >= 0) {
            plans[planIdx].routines[rIdx] = { ...plans[planIdx].routines[rIdx], name, dayOfWeek, exercises };
        }
    } else {
        plans[planIdx].routines.push({
            id: generateId(),
            name, dayOfWeek, exercises,
        });
    }

    savePlans(plans);
    renderPlans();
    renderToday();
}

function deleteRoutine(planId, routineId) {
    if (!confirm('Delete this routine?')) return;
    const plans = getPlans();
    const planIdx = plans.findIndex(p => p.id === planId);
    if (planIdx < 0) return;
    plans[planIdx].routines = plans[planIdx].routines.filter(r => r.id !== routineId);
    savePlans(plans);
    renderPlans();
}

// ─── Plan Editor Modal ───────────────────────────────────────────────
function openCreatePlan() {
    document.getElementById('plan-editor-title').textContent = 'New Plan';
    renderPlanEditor(null);
    document.getElementById('plan-modal').style.display = 'flex';
}

function editPlan(planId) {
    const plan = getPlanById(planId);
    if (!plan) return;
    document.getElementById('plan-editor-title').textContent = 'Edit Plan: ' + plan.name;
    renderPlanEditor(plan);
    document.getElementById('plan-modal').style.display = 'flex';
}

function renderPlanEditor(plan) {
    const isEditing = !!plan;
    const iconOptions = ICONS.map(icon => `<option value="${icon}" ${plan && plan.icon === icon ? 'selected' : ''}>${icon}</option>`).join('');
    const colorOptions = COLORS.map(color => `<option value="${color}" ${plan && plan.color === color ? 'selected' : ''}>${color}</option>`).join('');

    document.getElementById('plan-editor-body').innerHTML = `
        <div class="plan-form">
            <label>Plan Name
                <input type="text" id="pe-name" placeholder="e.g., Bulking Phase 2026" value="${plan ? plan.name : ''}">
            </label>
            <div class="plan-row">
                <label>Icon
                    <select id="pe-icon">${iconOptions}</select>
                </label>
                <label>Color
                    <select id="pe-color">${colorOptions}</select>
                </label>
                <label>Phase
                    <input type="text" id="pe-phase" placeholder="bulking/cutting/sport" value="${plan ? plan.phase || '' : ''}">
                </label>
            </div>
            <label>Duration (e.g., 8-12 weeks)
                <input type="text" id="pe-duration" placeholder="e.g., 8-12 weeks" value="${plan ? plan.duration || '' : ''}">
            </label>

            <div style="display:flex;gap:8px;margin-top:16px">
                <button class="btn btn-primary" onclick="savePlan('${plan ? plan.id : ''}')" style="flex:1">
                    ${isEditing ? 'Save Changes' : 'Create Plan'}
                </button>
                ${isEditing ? `<button class="btn btn-sm btn-danger" onclick="deletePlan('${plan.id}');closePlanModal();">Delete</button>` : ''}
            </div>
        </div>`;
}

function savePlan(editId) {
    const name = document.getElementById('pe-name').value.trim();
    if (!name) { alert('Enter a plan name'); return; }

    const icon = document.getElementById('pe-icon').value;
    const color = document.getElementById('pe-color').value;
    const phase = document.getElementById('pe-phase').value.trim();
    const duration = document.getElementById('pe-duration').value.trim();

    const plans = getPlans();

    if (editId) {
        const idx = plans.findIndex(p => p.id === editId);
        if (idx >= 0) {
            plans[idx].name = name;
            plans[idx].icon = icon;
            plans[idx].color = color;
            plans[idx].phase = phase;
            plans[idx].duration = duration;
        }
    } else {
        plans.push({
            id: generateId(),
            name, icon, color,
            phase, duration,
            routines: [],
        });
    }

    savePlans(plans);
    closePlanModal();
    renderPlans();
}

function deletePlan(planId) {
    if (!confirm('Delete this plan and all its routines?')) return;
    const plans = getPlans().filter(p => p.id !== planId);
    savePlans(plans);
    renderPlans();
}

function closePlanModal() { document.getElementById('plan-modal').style.display = 'none'; }
function closeWeightModal() { document.getElementById('weight-modal').style.display = 'none'; }

// ─── LOG VIEW ────────────────────────────────────────────────────────
function renderLog() {
    const logs = getWorkoutLogs();
    const container = document.getElementById('log-list');

    if (logs.length === 0) {
        container.innerHTML = '<p class="muted">No workouts logged yet.</p>';
        return;
    }

    container.innerHTML = logs.map(log => `
        <div class="log-entry" style="border-left:3px solid ${log.planColor}">
            <div class="log-date">${log.planName} — ${log.routineName}</div>
            <div class="log-detail">${log.exerciseCount} exercises · ${log.totalSets} sets</div>
            <div class="log-time">${formatTime(log.startTime)}${log.endTime ? ' → ' + formatTime(log.endTime) : ''}</div>
        </div>
    `).join('');
}

// ─── PROGRESS VIEW ───────────────────────────────────────────────────
function renderProgress() {
    const logs = getWorkoutLogs();
    const goals = getGoals();
    const weeklyTarget = goals.targetWorkoutsPerWeek;
    const weeklyCount = getWeeklyCount();
    const weeklyPct = Math.min(100, Math.round((weeklyCount / weeklyTarget) * 100));
    const totalWorkouts = logs.length;
    const totalSets = logs.reduce((s, l) => s + l.totalSets, 0);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentLogs = logs.filter(l => new Date(l.date) >= thirtyDaysAgo);

    let html = `
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-value">${totalWorkouts}</div><div class="stat-label">Total Workouts</div></div>
            <div class="stat-card"><div class="stat-value">${totalSets}</div><div class="stat-label">Total Sets</div></div>
            <div class="stat-card"><div class="stat-value">${weeklyCount}/${weeklyTarget}</div><div class="stat-label">This Week</div></div>
            <div class="stat-card"><div class="stat-value">${recentLogs.length}</div><div class="stat-label">Last 30 Days</div></div>
        </div>
        <div class="progress-section">
            <h3>Weekly Goal</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${weeklyPct}%"></div></div>
            <p class="progress-text">${weeklyCount} of ${weeklyTarget} workouts this week</p>
        </div>
        <div class="activity-chart"><h3>Last 7 Days</h3><div class="bars">`;

    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateKey = d.toISOString().split("T")[0];
        const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
        const hasWorkout = logs.some(l => l.date === dateKey);
        const barHeight = hasWorkout ? 100 : 8;
        html += `<div class="bar ${hasWorkout ? 'bar-active' : ''}"><div class="bar-fill" style="height:${barHeight}%"></div><span class="bar-label">${dayName}</span></div>`;
    }

    html += '</div></div>';
    document.getElementById('progress-content').innerHTML = html;
}

// ─── GOALS VIEW ──────────────────────────────────────────────────────
function renderGoals() {
    const goals = getGoals();
    const weeklyTarget = goals.targetWorkoutsPerWeek;
    const weeklyCount = getWeeklyCount();
    const weeklyPct = Math.min(100, Math.round((weeklyCount / weeklyTarget) * 100));

    document.getElementById('goals-content').innerHTML = `
        <div class="goal-item">
            <div class="goal-header">
                <span>🎯 Weekly Workout Target</span>
                <span class="goal-value">${weeklyCount}/${weeklyTarget}</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${weeklyPct}%"></div></div>
            <button class="btn btn-sm" onclick="editWeeklyTarget()">Edit</button>
        </div>
        <div class="goal-item">
            <div class="goal-header">
                <span>⚖️ Current Bodyweight</span>
                <span class="goal-value">${goals.bodyweight ? goals.bodyweight + ' ' + goals.bodyweightUnit : 'Not set'}</span>
            </div>
            <button class="btn btn-sm" onclick="editBodyweight()">Update</button>
        </div>
        <div class="goal-item">
            <div class="goal-header"><span>📝 Goals & Notes</span></div>
            <textarea class="notes-area" placeholder="e.g., Gain 10lbs on bench, drop to 15% bodyfat..."
                onchange="saveGoalNotes(this.value)">${goals.notes || ''}</textarea>
        </div>`;
}

function editBodyweight() {
    const goals = getGoals();
    const val = prompt('Enter your bodyweight (lbs):', goals.bodyweight || '');
    if (val && !isNaN(val)) {
        goals.bodyweight = parseFloat(val);
        saveGoals(goals);
        renderGoals();
    }
}

function editWeeklyTarget() {
    const goals = getGoals();
    const val = prompt('Weekly workout target:', goals.targetWorkoutsPerWeek);
    if (val && !isNaN(val)) {
        goals.targetWorkoutsPerWeek = parseInt(val);
        saveGoals(goals);
        renderGoals();
        renderProgress();
    }
}

function saveGoalNotes(notes) {
    const goals = getGoals();
    goals.notes = notes;
    saveGoals(goals);
}

// ─── SETTINGS VIEW ───────────────────────────────────────────────────
function renderSettings() {
    const data = loadData();
    const logCount = Object.keys(data).filter(k => !['plans','goals','weightPresets'].includes(k)).length;

    document.getElementById('settings-content').innerHTML = `
        <div class="setting-item"><span>📊 Total Entries</span><span>${logCount} days logged</span></div>
        <div class="setting-item"><span>💾 Storage</span><span>${(new Blob([JSON.stringify(data)]).size / 1024).toFixed(1)} KB</span></div>
        <div class="setting-item"><span>🔄 Export Data</span><button class="btn btn-sm" onclick="exportData()">Download JSON</button></div>
        <div class="setting-item"><span>📥 Import Data</span><button class="btn btn-sm" onclick="document.getElementById('import-file').click()">Upload JSON</button><input type="file" id="import-file" accept=".json" style="display:none" onchange="importData(event)"></div>
        <div class="setting-item"><span>📋 Reset Plans to Default</span><button class="btn btn-sm" onclick="resetPlans()">Reset</button></div>
        <div class="setting-item danger"><span>🗑️ Clear All Data</span><button class="btn btn-sm btn-danger" onclick="clearAllData()">Reset Everything</button></div>
        <p class="muted" style="margin-top:20px">SetStack v3.2 — Data stored locally in your browser</p>`;
}

function exportData() {
    const data = loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `setstack-${getDateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            const data = loadData();
            if (imported.plans) data.plans = imported.plans;
            if (imported.goals) data.goals = imported.goals;
            if (imported.weightPresets) data.weightPresets = imported.weightPresets;
            for (const [key, value] of Object.entries(imported)) {
                if (!['plans','goals','weightPresets'].includes(key) && typeof value === 'object') data[key] = value;
            }
            saveData(data);
            init();
            alert('Data imported successfully!');
        } catch { alert('Invalid file format'); }
    };
    reader.readAsText(file);
}

function clearAllData() {
    stopRestTimer();
    if (confirm('Are you sure? This will delete ALL workout data.')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TIMER_STORAGE_KEY);
        init();
    }
}

function resetPlans() {
    if (confirm('Reset plans to default? Your custom plans will be lost.')) {
        const data = loadData();
        data.plans = JSON.parse(JSON.stringify(DEFAULT_PLANS));
        saveData(data);
        init();
    }
}

// ─── Helpers ─────────────────────────────────────────────────────────
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const tab = document.querySelector(`.tab[data-view="${viewId}"]`);
    if (tab) tab.classList.add('active');

    const strip = document.getElementById('status-strip');
    if (strip && viewId !== 'today') strip.classList.remove('visible');
}

function formatTime(isoStr) {
    if (!isoStr) return '';
    return new Date(isoStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// ─── Tab Navigation ──────────────────────────────────────────────────
function setupTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            tab.classList.add('active');
            const view = tab.dataset.view;
            document.getElementById(`view-${view}`).classList.add('active');
        });
    });
}

// Close modals on backdrop click
document.addEventListener('click', (e) => {
    if (e.target.id === 'plan-modal') closePlanModal();
    if (e.target.id === 'weight-modal') closeWeightModal();
});

// ─── Init ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
