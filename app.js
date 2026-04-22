// ─── Workout Tracker App v2 ─────────────────────────────────────────
// LocalStorage-based, no dependencies, mobile-first
// v2: Auto-filled reps, custom plan builder

const DEFAULT_PLANS = [
    { id: "back", name: "Back", icon: "🔙", color: "#e74c3c",
      dayOfWeek: 1, exercises: [
        { name: "Deadlifts", sets: 4, reps: "10, 8, 8, then to failure", rest: "3 min", notes: "Progressive overload" },
        { name: "Bent-Over Rows", sets: 4, reps: "12, 10, 10, 8", rest: "2 min", notes: "" },
        { name: "Wide-Grip Lat Pulldowns", sets: 4, reps: "12-15", rest: "90 sec", notes: "or assisted pull-ups" },
        { name: "Straight-Arm Pulldowns", sets: 4, reps: "12-15", rest: "90 sec", notes: "" },
        { name: "Dumbbell Rows", sets: 4, reps: "15, 12, 10, 10", rest: "2 min", notes: "" },
        { name: "Machine Rows", sets: 3, reps: "20", rest: "90 sec", notes: "" },
        { name: "Hyperextensions", sets: 2, reps: "to failure", rest: "90 sec", notes: "Bodyweight or light weight" },
    ]},
    { id: "chest-biceps", name: "Chest & Biceps", icon: "💪", color: "#e67e22",
      dayOfWeek: 2, exercises: [
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
    { id: "hamstrings-glutes", name: "Hamstrings & Glutes", icon: "🦵", color: "#2ecc71",
      dayOfWeek: 3, exercises: [
        { name: "Lying Leg Curls", sets: 4, reps: "15", rest: "90 sec", notes: "" },
        { name: "Straight-Legged Deadlifts", sets: 4, reps: "15-20", rest: "2 min", notes: "" },
        { name: "Standing Leg Curls", sets: 2, reps: "4-5", rest: "2 min", notes: "Heavy, low reps" },
        { name: "Reverse Hack Squat", sets: 4, reps: "15-20", rest: "2 min", notes: "" },
        { name: "Glute Kickbacks", sets: 3, reps: "12-15", rest: "90 sec", notes: "Single-leg pushdowns or cable" },
    ]},
    { id: "shoulders-triceps", name: "Shoulders & Triceps", icon: "🏋️", color: "#3498db",
      dayOfWeek: 4, exercises: [
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
    { id: "quads", name: "Quads", icon: "🦵", color: "#9b59b6",
      dayOfWeek: 5, exercises: [
        { name: "Leg Extensions", sets: 3, reps: "15", rest: "90 sec", notes: "" },
        { name: "Squats", sets: 2, reps: "8", rest: "3 min", notes: "" },
        { name: "Leg Press", sets: 4, reps: "40, 30, 20, 10", rest: "2 min", notes: "Drop set scheme" },
        { name: "Leg Extensions", sets: 4, reps: "15", rest: "90 sec", notes: "Second block" },
        { name: "Standing Lunges", sets: 4, reps: "6-8", rest: "2 min", notes: "Each leg" },
    ]},
];

const ICONS = ["💪","🏋️","🦵","🔙","🏃","🎯","🧘","⚡","🔥","💥","👊","🦾","🦿","🤸","🏀","⛹️","🤾","🏌️","🎾","🥊","🏆","❤️","🧠","🦷","👁️","👂","👃","🧬","🫁","💀"];
const COLORS = ["#e74c3c","#e67e22","#f39c12","#2ecc71","#1abc9c","#3498db","#2980b9","#9b59b6","#8e44ad","#e84393","#fd79a8","#6c5ce7","#00b894","#fdcb6e","#e17055","#0984e3","#d63031","#a29bfe","#55efc4","#fab1a0"];

const STORAGE_KEY = "workout-tracker-v2";

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

function getPlans() {
    const data = loadData();
    return data.plans || DEFAULT_PLANS;
}

function savePlans(plans) {
    const data = loadData();
    data.plans = plans;
    saveData(data);
}

function getPlanForDay(dayOfWeek) {
    const plans = getPlans();
    return plans.find(p => p.dayOfWeek === dayOfWeek);
}

function getTodayData() {
    const data = loadData();
    const key = getDateKey();
    if (!data[key]) {
        const dow = new Date().getDay();
        const plan = getPlanForDay(dow);
        data[key] = {
            date: key,
            dayOfWeek: dow,
            planId: plan ? plan.id : null,
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

function getWorkoutLogs() {
    const data = loadData();
    const logs = [];
    for (const [date, entry] of Object.entries(data)) {
        if (entry.completed && entry.exercises) {
            const plan = getPlanById(entry.planId);
            logs.push({
                date,
                planName: plan ? plan.name : "Custom",
                planIcon: plan ? plan.icon : "📋",
                planColor: plan ? plan.color : "#95a5a6",
                exerciseCount: Object.keys(entry.exercises).length,
                totalSets: Object.values(entry.exercises).reduce((s, sets) => s + sets.length, 0),
                startTime: entry.startTime,
                endTime: entry.endTime,
            });
        }
    }
    return logs.sort((a, b) => b.date.localeCompare(a.date));
}

function getPlanById(id) { return getPlans().find(p => p.id === id); }

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

// ─── UI Rendering ────────────────────────────────────────────────────
function init() {
    const now = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    document.getElementById('today-date').textContent = now.toLocaleDateString('en-US', options);
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    document.getElementById('today-dayname').textContent = dayNames[now.getDay()];

    renderToday();
    renderPlan();
    renderLog();
    renderProgress();
    renderGoals();
    renderSettings();
    setupTabs();
}

function renderToday() {
    const today = getTodayData();
    const plan = getPlanById(today.planId) || getPlanForDay(today.dayOfWeek);
    const container = document.getElementById('today-workout');

    if (!plan || plan.exercises.length === 0) {
        container.innerHTML = `
            <div class="rest-day">
                <div class="rest-icon">😴</div>
                <h3>Rest Day</h3>
                <p>Recovery, mobility, walking, eating enough, sleeping well.</p>
                <div class="rest-tips">
                    <div class="rest-tip">🚶 Walk 8-10k steps</div>
                    <div class="rest-tip">🧘 Stretch 10-15 min</div>
                    <div class="rest-tip">💧 Hydrate well</div>
                    <div class="rest-tip">😴 Sleep 7-9 hours</div>
                </div>
                <button class="btn btn-rest" onclick="completeRestDay()">Mark Rest Day ✓</button>
            </div>`;
        return;
    }

    const completedExercises = Object.keys(today.exercises || {}).filter(k => {
        const sets = today.exercises[k];
        return sets && sets.length > 0;
    });
    const totalExercises = plan.exercises.length;
    const pct = Math.round((completedExercises.length / totalExercises) * 100);

    let html = `
        <div class="workout-header">
            <span class="workout-plan-name" style="color:${plan.color}">${plan.icon} ${plan.name}</span>
            <span class="workout-progress">${pct}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${plan.color}"></div></div>
        <p class="workout-meta">
            ${totalExercises} exercises · ${plan.exercises.reduce((s, e) => s + e.sets, 0)} total sets · 
            2-3 min rest between sets
        </p>`;

    plan.exercises.forEach((ex, idx) => {
        const log = getExerciseLog(getDateKey(), idx);
        const isDone = log && log.length > 0;
        const setsHtml = renderSets(ex, idx, log);

        html += `
            <div class="exercise-card" id="exercise-${idx}">
                <div class="exercise-header ${isDone ? 'done' : ''}" onclick="toggleExercise(${idx})">
                    <div>
                        <h3>${ex.name}</h3>
                        <p class="exercise-target">${ex.sets} sets × ${ex.reps} reps · ${ex.rest} rest</p>
                        ${ex.notes ? `<p class="exercise-notes">📝 ${ex.notes}</p>` : ''}
                    </div>
                    <span class="exercise-check">${isDone ? '✅' : '⬜'}</span>
                </div>
                <div class="exercise-body" id="exercise-body-${idx}" style="display:${isDone ? 'block' : 'none'}">
                    ${setsHtml}
                </div>
            </div>`;
    });

    container.innerHTML = html;

    if (today.startTime && !today.completed) {
        container.innerHTML += `<button class="btn btn-finish" onclick="finishWorkout()">🏁 Finish Workout</button>`;
    }
}

function renderSets(ex, idx, log) {
    // Reps auto-filled from plan! User only needs to enter weight
    let html = '<div class="sets-container">';
    for (let i = 0; i < ex.sets; i++) {
        const set = log ? log[i] : null;
        const weight = set ? set.weight : '';
        const reps = set ? set.reps : '';
        const rir = set ? set.rir : '';
        const done = set ? set.done : false;

        // Auto-fill reps from plan if not already logged
        const defaultReps = getSetReps(ex.reps, ex.sets, i);

        html += `
            <div class="set-row ${done ? 'set-done' : ''}" style="${done ? 'opacity:0.5' : ''}">
                <span class="set-num">Set ${i + 1}</span>
                <input type="number" class="set-input weight-input" placeholder="lbs" 
                    value="${weight}" oninput="autoSaveSet(${idx}, ${i}, 'weight', this.value)" 
                    ${done ? 'disabled' : ''}>
                <input type="number" class="set-input reps-input" placeholder="${defaultReps}" 
                    value="${reps}" oninput="autoSaveSet(${idx}, ${i}, 'reps', this.value)" 
                    ${done ? 'disabled' : ''}>
                <input type="number" class="set-input rir-input" placeholder="RIR" 
                    value="${rir}" oninput="autoSaveSet(${idx}, ${i}, 'rir', this.value)" 
                    ${done ? 'disabled' : ''}>
                <button class="btn-set ${done ? 'btn-done' : 'btn-check'}" 
                    onclick="toggleSet(${idx}, ${i})" ${done ? 'disabled' : ''}>
                    ${done ? '✓' : '○'}
                </button>
            </div>`;
    }
    html += '</div>';
    return html;
}

// Parse reps spec and return rep count for a given set index
// e.g. "15, 15, 12, 12, 10" → for set 0 returns "15"
// e.g. "12-15" → returns "12-15"
// e.g. "to failure" → returns "failure"
function getSetReps(repsSpec, totalSets, setIdx) {
    if (!repsSpec) return '';

    // Comma-separated: "15, 15, 12, 12, 10"
    if (repsSpec.includes(',')) {
        const parts = repsSpec.split(',').map(s => s.trim());
        return parts[setIdx] || parts[parts.length - 1];
    }

    // Range: "12-15"
    if (repsSpec.includes('-')) {
        return repsSpec;
    }

    // Single number: "15"
    if (!isNaN(repsSpec)) {
        return repsSpec;
    }

    // Special: "to failure", "4-5", etc.
    return repsSpec;
}

function renderPlan() {
    const plans = getPlans();
    const container = document.getElementById('plan-list');
    const dayNames = ['','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

    let html = '';
    plans.forEach(plan => {
        const totalSets = plan.exercises.reduce((s, e) => s + e.sets, 0);
        html += `
            <div class="day-card" style="border-left-color:${plan.color}">
                <div class="day-card-header">
                    <span class="day-icon">${plan.icon}</span>
                    <div>
                        <h3>${plan.name}</h3>
                        <p>${dayNames[plan.dayOfWeek] || 'Custom'} · ${plan.exercises.length} exercises · ${totalSets} sets</p>
                    </div>
                    <div class="day-actions">
                        <button class="btn btn-sm" onclick="openDayPlan('${plan.id}')">View</button>
                        <button class="btn btn-sm" onclick="editPlan('${plan.id}')">✏️</button>
                        ${!isDefaultPlan(plan.id) ? `<button class="btn btn-sm btn-danger" onclick="deletePlan('${plan.id}')">🗑</button>` : ''}
                    </div>
                </div>
            </div>`;
    });

    container.innerHTML = html;
}

function isDefaultPlan(id) {
    return DEFAULT_PLANS.some(d => d.id === id);
}

function renderLog() {
    const logs = getWorkoutLogs();
    const container = document.getElementById('log-list');

    if (logs.length === 0) {
        container.innerHTML = '<p class="muted">No workouts logged yet. Complete your first workout to see it here.</p>';
        return;
    }

    let html = '';
    logs.forEach(log => {
        html += `
            <div class="log-entry" style="border-left:3px solid ${log.planColor}">
                <div class="log-date">${log.planIcon} ${log.planName}</div>
                <div class="log-detail">${log.exerciseCount} exercises · ${log.totalSets} sets</div>
                <div class="log-time">${formatTime(log.startTime)}${log.endTime ? ' → ' + formatTime(log.endTime) : ''}</div>
            </div>`;
    });

    container.innerHTML = html;
}

function renderProgress() {
    const container = document.getElementById('progress-content');
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
            <div class="stat-card">
                <div class="stat-value">${totalWorkouts}</div>
                <div class="stat-label">Total Workouts</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalSets}</div>
                <div class="stat-label">Total Sets</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${weeklyCount}/${weeklyTarget}</div>
                <div class="stat-label">This Week</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${recentLogs.length}</div>
                <div class="stat-label">Last 30 Days</div>
            </div>
        </div>

        <div class="progress-section">
            <h3>Weekly Goal</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${weeklyPct}%"></div></div>
            <p class="progress-text">${weeklyCount} of ${weeklyTarget} workouts this week</p>
        </div>`;

    html += '<div class="activity-chart"><h3>Last 7 Days</h3><div class="bars">';
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split("T")[0];
        const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
        const log = logs.find(l => l.date === dateKey);
        const hasWorkout = !!log;
        html += `
            <div class="bar ${hasWorkout ? 'bar-active' : ''}">
                <div class="bar-fill" style="height:${hasWorkout ? '100%' : '10%'}"></div>
                <span class="bar-label">${dayName}</span>
            </div>`;
    }
    html += '</div></div>';

    container.innerHTML = html;
}

function renderGoals() {
    const container = document.getElementById('goals-content');
    const goals = getGoals();
    const weeklyTarget = goals.targetWorkoutsPerWeek;
    const weeklyCount = getWeeklyCount();
    const weeklyPct = Math.min(100, Math.round((weeklyCount / weeklyTarget) * 100));

    let html = `
        <div class="goal-item">
            <div class="goal-header">
                <span>🎯 Weekly Workout Target</span>
                <span class="goal-value">${weeklyCount}/${weeklyTarget}</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${weeklyPct}%"></div></div>
            <button class="btn btn-sm" onclick="editWeeklyTarget()">Edit target</button>
        </div>
        
        <div class="goal-item">
            <div class="goal-header">
                <span>⚖️ Current Bodyweight</span>
                <span class="goal-value">${goals.bodyweight ? goals.bodyweight + ' ' + goals.bodyweightUnit : 'Not set'}</span>
            </div>
            <button class="btn btn-sm" onclick="editBodyweight()">Update</button>
        </div>
        
        <div class="goal-item">
            <div class="goal-header">
                <span>📝 Goals & Notes</span>
            </div>
            <textarea class="notes-area" placeholder="e.g., Gain 10lbs on bench, drop to 15% bodyfat..." 
                onchange="saveGoalNotes(this.value)">${goals.notes || ''}</textarea>
        </div>`;

    container.innerHTML = html;
}

function renderSettings() {
    const container = document.getElementById('settings-content');
    const data = loadData();
    const logCount = Object.keys(data).filter(k => !['plans','goals'].includes(k)).length;

    let html = `
        <div class="setting-item">
            <span>📊 Total Entries</span>
            <span>${logCount} days logged</span>
        </div>
        <div class="setting-item">
            <span>💾 Storage</span>
            <span>${(new Blob([JSON.stringify(data)]).size / 1024).toFixed(1)} KB</span>
        </div>
        <div class="setting-item">
            <span>🔄 Export Data</span>
            <button class="btn btn-sm" onclick="exportData()">Download JSON</button>
        </div>
        <div class="setting-item">
            <span>📥 Import Data</span>
            <button class="btn btn-sm" onclick="document.getElementById('import-file').click()">Upload JSON</button>
            <input type="file" id="import-file" accept=".json" style="display:none" onchange="importData(event)">
        </div>
        <div class="setting-item">
            <span>📋 Reset Plans to Default</span>
            <button class="btn btn-sm" onclick="resetPlans()">Reset</button>
        </div>
        <div class="setting-item danger">
            <span>🗑️ Clear All Data</span>
            <button class="btn btn-sm btn-danger" onclick="clearAllData()">Reset Everything</button>
        </div>
        <p class="muted" style="margin-top:20px">Workout Tracker v2.0 — Data stored locally in your browser</p>`;

    container.innerHTML = html;
}

// ─── Actions ─────────────────────────────────────────────────────────
// Save without re-rendering (for oninput - keeps cursor position)
function autoSaveSet(exerciseIdx, setIdx, field, value) {
    const date = getDateKey();
    const log = getExerciseLog(date, exerciseIdx);
    const sets = log || [];
    if (!sets[setIdx]) sets[setIdx] = { done: false };
    sets[setIdx][field] = value;
    saveExerciseLog(date, exerciseIdx, sets);
}

function saveSet(exerciseIdx, setIdx, field, value, render = true) {
    const date = getDateKey();
    const log = getExerciseLog(date, exerciseIdx);
    const sets = log || [];

    if (!sets[setIdx]) {
        sets[setIdx] = { done: false };
    }
    sets[setIdx][field] = value;
    saveExerciseLog(date, exerciseIdx, sets);
    if (render) renderToday();
}

function toggleSet(exerciseIdx, setIdx) {
    const date = getDateKey();
    const log = getExerciseLog(date, exerciseIdx);
    const sets = log || [];

    if (!sets[setIdx]) {
        sets[setIdx] = { done: false };
    }
    sets[setIdx].done = !sets[setIdx].done;
    saveExerciseLog(date, exerciseIdx, sets);
    renderToday();
}

function toggleExercise(idx) {
    const body = document.getElementById(`exercise-body-${idx}`);
    body.style.display = body.style.display === 'none' ? 'block' : 'none';
}

function finishWorkout() {
    const today = getTodayData();
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
    const today = getTodayData();
    today.completed = true;
    const data = loadData();
    data[getDateKey()] = today;
    saveData(data);
    renderToday();
    renderLog();
    renderProgress();
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

function exportData() {
    const data = loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-tracker-${getDateKey()}.json`;
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
            // Merge: keep existing plans, add imported data
            const data = loadData();
            if (imported.plans) data.plans = imported.plans;
            if (imported.goals) data.goals = imported.goals;
            // Merge daily logs
            for (const [key, value] of Object.entries(imported)) {
                if (!['plans', 'goals'].includes(key) && typeof value === 'object') {
                    data[key] = value;
                }
            }
            saveData(data);
            init();
            alert('Data imported successfully!');
        } catch {
            alert('Invalid file format');
        }
    };
    reader.readAsText(file);
}

function clearAllData() {
    if (confirm('Are you sure? This will delete ALL workout data.')) {
        localStorage.removeItem(STORAGE_KEY);
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

// ─── Plan Editor ─────────────────────────────────────────────────────
function openCreatePlan() {
    const planEditorTitle = document.getElementById('plan-editor-title');
    planEditorTitle.textContent = 'New Plan';
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
    const body = document.getElementById('plan-editor-body');
    const isEditing = !!plan;

    const dayNames = ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const dayOptions = dayNames.map((d, i) => i === 0 ? '' : `<option value="${i}" ${plan && plan.dayOfWeek === i ? 'selected' : ''}>${d}</option>`).join('');
    const iconOptions = ICONS.map(icon => `<option value="${icon}" ${plan && plan.icon === icon ? 'selected' : ''}>${icon}</option>`).join('');
    const colorOptions = COLORS.map(color => `<option value="${color}" ${plan && plan.color === color ? 'selected' : ''}>${color}</option>`).join('');

    let exercisesHtml = '';
    const exercises = plan ? plan.exercises : [];
    exercises.forEach((ex, idx) => {
        exercisesHtml += renderExerciseRow(ex, idx);
    });

    body.innerHTML = `
        <div class="plan-form">
            <label>Plan Name
                <input type="text" id="pe-name" placeholder="e.g., Push Day" value="${plan ? plan.name : ''}">
            </label>
            <div class="plan-row">
                <label>Day
                    <select id="pe-day">${dayOptions}</select>
                </label>
                <label>Icon
                    <select id="pe-icon">${iconOptions}</select>
                </label>
                <label>Color
                    <select id="pe-color">${colorOptions}</select>
                </label>
            </div>

            <h4 style="margin-top:16px;margin-bottom:8px">Exercises</h4>
            <div id="pe-exercises">${exercisesHtml}</div>
            <button class="btn btn-sm" onclick="addExerciseRow()" style="margin-top:8px;width:100%">+ Add Exercise</button>

            <div style="display:flex;gap:8px;margin-top:16px">
                <button class="btn btn-primary" onclick="savePlan('${plan ? plan.id : ''}')" style="flex:1">
                    ${isEditing ? 'Save Changes' : 'Create Plan'}
                </button>
                ${isEditing ? `<button class="btn btn-sm btn-danger" onclick="deletePlan('${plan.id}');closePlanModal();">Delete</button>` : ''}
            </div>
        </div>`;
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

let exerciseRowCounter = 0;

function addExerciseRow() {
    const container = document.getElementById('pe-exercises');
    const idx = Date.now();
    exerciseRowCounter++;
    container.insertAdjacentHTML('beforeend', renderExerciseRow(null, idx));
}

function removeExerciseRow(idx) {
    const row = document.getElementById(`er-${idx}`);
    if (row) row.remove();
}

function savePlan(editId) {
    const name = document.getElementById('pe-name').value.trim();
    if (!name) { alert('Enter a plan name'); return; }

    const dayOfWeek = parseInt(document.getElementById('pe-day').value) || 0;
    const icon = document.getElementById('pe-icon').value;
    const color = document.getElementById('pe-color').value;

    const exerciseRows = document.querySelectorAll('#pe-exercises .exercise-row');
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

    if (editId) {
        // Edit existing
        const idx = plans.findIndex(p => p.id === editId);
        if (idx >= 0) {
            plans[idx] = { ...plans[idx], name, dayOfWeek, icon, color, exercises };
        }
    } else {
        // Create new
        plans.push({
            id: generateId(),
            name, dayOfWeek, icon, color, exercises,
        });
    }

    savePlans(plans);
    closePlanModal();
    renderPlan();
}

function deletePlan(planId) {
    if (!confirm('Delete this plan?')) return;
    const plans = getPlans().filter(p => p.id !== planId);
    savePlans(plans);
    renderPlan();
}

function openDayPlan(planId) {
    const plan = getPlanById(planId);
    if (!plan) return;
    const totalSets = plan.exercises.reduce((s, e) => s + e.sets, 0);
    const planText = plan.exercises.map(e => `${e.name} — ${e.sets}×${e.reps}`).join('\n');
    alert(`${plan.icon} ${plan.name}\n\n${planText}\n\nTotal: ${totalSets} sets`);
}

function formatTime(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function closeModal() { document.getElementById('modal').style.display = 'none'; }
function closePlanModal() { document.getElementById('plan-modal').style.display = 'none'; }

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
    if (e.target.id === 'modal') closeModal();
    if (e.target.id === 'plan-modal') closePlanModal();
});

// ─── Init ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
