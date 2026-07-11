const PLATE_SET = [10, 5, 2.5, 1.25, 0.5];

const PLANS = {
  "3x20": {
    label: "3 Day",
    desc: "20 min sessions, full body each day",
    minutes: 20,
    days: [
      { name:"Day 1", exercises:[
        {name:"Goblet Squat", target:"3 x 12", muscle:"legs"},
        {name:"DB Bench Press", target:"3 x 10", muscle:"chest"},
        {name:"Bent-Over DB Row", target:"3 x 10", muscle:"back", superset:"S1"},
        {name:"DB Shoulder Press", target:"2 x 12", muscle:"shoulders", superset:"S1"},
      ]},
      { name:"Day 2", exercises:[
        {name:"DB Romanian Deadlift", target:"3 x 12", muscle:"legs"},
        {name:"Incline DB Press", target:"3 x 10", muscle:"chest"},
        {name:"DB Renegade Row", target:"3 x 10", muscle:"back", superset:"S1"},
        {name:"DB Lunge (per leg)", target:"2 x 12", muscle:"legs", superset:"S1"},
      ]},
      { name:"Day 3", exercises:[
        {name:"DB Step-Up (per leg)", target:"3 x 12", muscle:"legs"},
        {name:"Flat DB Flye", target:"3 x 12", muscle:"chest"},
        {name:"One-Arm DB Row", target:"3 x 10", muscle:"back", superset:"S1"},
        {name:"DB Lateral Raise", target:"2 x 15", muscle:"shoulders", superset:"S1"},
      ]},
    ]
  },
  "4x30": {
    label: "4 Day",
    desc: "30 min sessions, upper/lower split",
    minutes: 30,
    days: [
      { name:"Upper A", exercises:[
        {name:"DB Bench Press", target:"4 x 10", muscle:"chest"},
        {name:"Bent-Over DB Row", target:"4 x 10", muscle:"back"},
        {name:"Incline DB Press", target:"3 x 10", muscle:"chest"},
        {name:"One-Arm DB Row", target:"3 x 10", muscle:"back", superset:"S1"},
        {name:"DB Shoulder Press", target:"3 x 12", muscle:"shoulders", superset:"S1"},
      ]},
      { name:"Lower A", exercises:[
        {name:"Goblet Squat", target:"4 x 12", muscle:"legs"},
        {name:"DB Romanian Deadlift", target:"4 x 10", muscle:"legs"},
        {name:"DB Walking Lunge (per leg)", target:"3 x 12", muscle:"legs"},
        {name:"DB Step-Up (per leg)", target:"3 x 12", muscle:"legs", superset:"S1"},
        {name:"DB Calf Raise", target:"3 x 15", muscle:"legs", superset:"S1"},
      ]},
      { name:"Upper B", exercises:[
        {name:"Flat DB Flye", target:"3 x 12", muscle:"chest"},
        {name:"DB Pullover", target:"3 x 12", muscle:"back"},
        {name:"DB Renegade Row", target:"3 x 10", muscle:"back"},
        {name:"DB Lateral Raise", target:"3 x 15", muscle:"shoulders", superset:"S1"},
        {name:"DB Rear Delt Flye", target:"3 x 15", muscle:"shoulders", superset:"S1"},
      ]},
      { name:"Lower B / Full", exercises:[
        {name:"Goblet Squat", target:"3 x 15", muscle:"legs"},
        {name:"DB Bench Press", target:"3 x 12", muscle:"chest"},
        {name:"Bent-Over DB Row", target:"3 x 12", muscle:"back"},
        {name:"DB Bicep Curl", target:"3 x 12", muscle:"arms", superset:"S1"},
        {name:"DB Overhead Tricep Extension", target:"3 x 12", muscle:"arms", superset:"S1"},
      ]},
    ]
  },
  "5x45": {
    label: "5 Day",
    desc: "45 min sessions, push/pull/legs split",
    minutes: 45,
    days: [
      { name:"Push", exercises:[
        {name:"DB Bench Press", target:"4 x 10", muscle:"chest"},
        {name:"Incline DB Press", target:"4 x 10", muscle:"chest"},
        {name:"DB Shoulder Press", target:"3 x 12", muscle:"shoulders"},
        {name:"Flat DB Flye", target:"3 x 12", muscle:"chest", superset:"S1"},
        {name:"DB Overhead Tricep Extension", target:"3 x 12", muscle:"arms", superset:"S1"},
      ]},
      { name:"Pull", exercises:[
        {name:"Bent-Over DB Row", target:"4 x 10", muscle:"back"},
        {name:"One-Arm DB Row", target:"4 x 10", muscle:"back"},
        {name:"DB Renegade Row", target:"3 x 10", muscle:"back"},
        {name:"DB Rear Delt Flye", target:"3 x 15", muscle:"shoulders", superset:"S1"},
        {name:"DB Bicep Curl", target:"3 x 12", muscle:"arms", superset:"S1"},
      ]},
      { name:"Legs", exercises:[
        {name:"Goblet Squat", target:"4 x 12", muscle:"legs"},
        {name:"DB Romanian Deadlift", target:"4 x 10", muscle:"legs"},
        {name:"DB Walking Lunge (per leg)", target:"3 x 12", muscle:"legs"},
        {name:"DB Step-Up (per leg)", target:"3 x 12", muscle:"legs", superset:"S1"},
        {name:"DB Calf Raise", target:"3 x 20", muscle:"legs", superset:"S1"},
      ]},
      { name:"Upper Accessory", exercises:[
        {name:"Incline DB Press", target:"3 x 12", muscle:"chest"},
        {name:"Bent-Over DB Row", target:"3 x 12", muscle:"back"},
        {name:"DB Lateral Raise", target:"3 x 15", muscle:"shoulders"},
        {name:"DB Bicep Curl", target:"3 x 12", muscle:"arms", superset:"S1"},
        {name:"DB Tricep Kickback", target:"3 x 12", muscle:"arms", superset:"S1"},
      ]},
      { name:"Full Body", exercises:[
        {name:"Goblet Squat", target:"3 x 15", muscle:"legs"},
        {name:"DB Bench Press", target:"3 x 15", muscle:"chest"},
        {name:"DB Renegade Row", target:"3 x 10", muscle:"back"},
        {name:"DB Thruster", target:"3 x 12", muscle:"legs", superset:"S1"},
        {name:"Plank-To-Row", target:"3 x 10", muscle:"core", superset:"S1"},
      ]},
    ]
  }
};

const SUBSTITUTIONS = {
  "DB Bench Press": ["Incline DB Press", "Flat DB Flye"],
  "Incline DB Press": ["DB Bench Press", "Flat DB Flye"],
  "Flat DB Flye": ["DB Bench Press", "Incline DB Press"],
  "Bent-Over DB Row": ["One-Arm DB Row", "DB Renegade Row"],
  "One-Arm DB Row": ["Bent-Over DB Row", "DB Renegade Row"],
  "DB Renegade Row": ["Bent-Over DB Row", "One-Arm DB Row"],
  "DB Pullover": ["Flat DB Flye", "Bent-Over DB Row"],
  "DB Shoulder Press": ["DB Lateral Raise"],
  "DB Lateral Raise": ["DB Shoulder Press", "DB Rear Delt Flye"],
  "DB Rear Delt Flye": ["DB Lateral Raise"],
  "Goblet Squat": ["DB Lunge (per leg)", "DB Step-Up (per leg)", "DB Walking Lunge (per leg)"],
  "DB Romanian Deadlift": ["Goblet Squat"],
  "DB Lunge (per leg)": ["Goblet Squat", "DB Step-Up (per leg)"],
  "DB Step-Up (per leg)": ["Goblet Squat", "DB Lunge (per leg)"],
  "DB Walking Lunge (per leg)": ["Goblet Squat", "DB Step-Up (per leg)"],
  "DB Bicep Curl": ["DB Overhead Tricep Extension"],
  "DB Overhead Tricep Extension": ["DB Tricep Kickback"],
  "DB Tricep Kickback": ["DB Overhead Tricep Extension"],
  "DB Thruster": ["Goblet Squat", "DB Shoulder Press"],
  "Plank-To-Row": ["DB Renegade Row"],
};

const QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "The only bad session is the one that didn't happen.",
  "Progress is slow until it isn't.",
  "Show up. The rest follows.",
  "Small weights added consistently beat big weights added rarely.",
  "Form first, ego last.",
  "You don't have to be great to start, you have to start to be great.",
];

const MUSCLE_GROUPS = ["chest", "back", "legs", "shoulders", "arms", "core"];

const BADGES = [
  { id:"first_session", label:"First Session", check: (s) => s.sessions.length >= 1 },
  { id:"ten_sessions", label:"10 Sessions", check: (s) => s.sessions.length >= 10 },
  { id:"fifty_sessions", label:"50 Sessions", check: (s) => s.sessions.length >= 50 },
  { id:"first_pr", label:"First PR", check: (s) => Object.keys(s.bests).length >= 1 },
  { id:"streak_4", label:"4 Day Streak", check: (s) => (s.streak || 0) >= 4 },
  { id:"streak_10", label:"10 Day Streak", check: (s) => (s.streak || 0) >= 10 },
  { id:"heavy_session", label:"1000kg Session", check: (s) => s.sessions.some(sess => (sess.volume || 0) >= 1000) },
  { id:"first_cardio", label:"First Conditioning Session", check: (s) => (s.cardioSessions || []).length >= 1 },
];

// Conditioning activities: sled/machine/cardio work that doesn't fit a weight x reps model.
const CARDIO_ACTIVITIES = [
  "Concept2 RowErg",
  "Concept2 SkiErg",
  "Concept2 BikeErg",
  "Sled Tow",
  "Sled Push",
  "Assault Bike",
  "Running",
  "Cycling",
  "Jump Rope",
  "Stair Climber",
  "Custom",
];

// Percentage of a working weight used to build a warm-up ramp, with target reps for each step.
const WARMUP_STEPS = [
  { pct: 0.5, reps: 8 },
  { pct: 0.7, reps: 5 },
  { pct: 0.85, reps: 3 },
];

// Training max reference table, percentage of e1RM mapped to typical rep range.
const TRAINING_MAX_PERCENTAGES = [100, 95, 90, 85, 80, 75, 70, 65, 60];

// ---------- Calisthenics ----------

// Exercises logged with reps only (weight field becomes optional added load).
const BODYWEIGHT_EXERCISES = new Set([
  "Push-Up","Knee Push-Up","Incline Push-Up","Decline Push-Up","Diamond Push-Up",
  "Archer Push-Up","Pike Push-Up","Wall Handstand Push-Up",
  "Pull-Up","Chin-Up","Negative Pull-Up","Australian Row",
  "Dip","Bench Dip",
  "Bodyweight Squat","Split Squat","Pistol Squat","Shrimp Squat","Glute Bridge","Nordic Curl",
  "Plank","Side Plank","Hollow Hold","L-Sit","Hanging Knee Raise","Hanging Leg Raise","Burpee"
]);

// Ordered easiest -> hardest. Shown in the Progression panel so the next
// harder variation is always one tap away once reps get easy.
const PROGRESSION_CHAINS = [
  ["Incline Push-Up","Knee Push-Up","Push-Up","Decline Push-Up","Diamond Push-Up","Archer Push-Up"],
  ["Pike Push-Up","Wall Handstand Push-Up"],
  ["Australian Row","Negative Pull-Up","Chin-Up","Pull-Up"],
  ["Bench Dip","Dip"],
  ["Bodyweight Squat","Split Squat","Shrimp Squat","Pistol Squat"],
  ["Glute Bridge","Nordic Curl"],
  ["Plank","Hollow Hold","L-Sit"],
  ["Hanging Knee Raise","Hanging Leg Raise"]
];

function progressionChainFor(exName){
  return PROGRESSION_CHAINS.find(chain => chain.includes(exName)) || null;
}

PLANS["cali3"] = {
  label: "Calisthenics 3 Day",
  minutes: 30,
  desc: "30 min sessions, bodyweight only, push/pull/legs+core",
  days: [
    { name: "Push", exercises: [
      { name: "Push-Up", target: "4 x 10", muscle: "chest" },
      { name: "Pike Push-Up", target: "3 x 8", muscle: "shoulders" },
      { name: "Bench Dip", target: "3 x 10", muscle: "arms" },
      { name: "Diamond Push-Up", target: "2 x 8", muscle: "arms" },
      { name: "Plank", target: "3 x 45", muscle: "core" }
    ]},
    { name: "Pull", exercises: [
      { name: "Pull-Up", target: "4 x 6", muscle: "back" },
      { name: "Australian Row", target: "3 x 10", muscle: "back" },
      { name: "Chin-Up", target: "2 x 6", muscle: "arms" },
      { name: "Hanging Knee Raise", target: "3 x 10", muscle: "core" }
    ]},
    { name: "Legs + Core", exercises: [
      { name: "Bodyweight Squat", target: "4 x 15", muscle: "legs" },
      { name: "Split Squat", target: "3 x 10", muscle: "legs" },
      { name: "Glute Bridge", target: "3 x 15", muscle: "legs" },
      { name: "Hollow Hold", target: "3 x 30", muscle: "core" },
      { name: "Burpee", target: "3 x 10", muscle: "core" }
    ]}
  ]
};
