let startTime = null;
let running = false;
let intervalId = null;
let isReady = false;
let scramble = genScramble();
let results = [];
let sorted_result = [];
let locked = false;
let goal = 10;
let mode = "ao5"; // or "mo3"
// let current_result = -1

let timer_block = document.getElementById("timer");
let scramble_block = document.getElementById("scramble");
let table_block = document.getElementById("results");
let notice_block = document.getElementById("notice");

// colors:
let c_ready = "green";
let c_normal = "white";
let c_bg = "#222"

let theme_list = null;

let current_result = new Result(0);
let current_round = new Round(5, goal);

function updateTimer() {
    const now = performance.now();
    const elapsed = (now - startTime) / 1000;
    current_result.changeTime(elapsed);
    timer_block.textContent = current_result.displayTime();
}

let lastKey = null;
document.addEventListener("keydown", (e) => {
    if (running) {
        stopTimer();
    }
    else {
        if (locked) {
            return;
        }
        if (e.code === "Space") {
            e.preventDefault();  // Prevent rolling
            if (!running) {
                timer_block.style.color = c_ready;
                isReady = true;
                hideElements();
            }
        }
        if (e.code == "KeyR") {
            current_round.reset();
            timer_block.textContent = "0.00";
        }
        if (lastKey != "KeyT" && e.code == "KeyD") {
            switchDNF();
        }
        if (e.code == "ArrowRight") {
            nextScramble();
        }

        if (e.code == "KeyH") {
            notice_block.textContent = "T: Theme; G: Goal; 0: Exit";
        }

        if (e.code == "Digit0") {
            notice_block.textContent = "";
        }

        if (e.code == "KeyT") {
            notice_block.textContent = "Select Theme: P - Pink, D - Dark, B - Blue";
        }
        else if (lastKey == "KeyT") {
            if (e.code == "KeyP") {
                changeTheme("pink");
                notice_block.textContent = "";
            } else if (e.code == "KeyD") {
                changeTheme("default");
                notice_block.textContent = "";
            } else if (e.code == "KeyB") {
                changeTheme("blue");
                notice_block.textContent = "";
            } else {
                notice_block.textContent = "";
            }
        }

        if (e.code == "KeyG") {
            const input = prompt(`Change your goal from ${goal.toFixed(2)} to:`);
            if (input && input > 0 && !isNaN(Number(input))) {
                goal = Number(input);
                changeStorage("goal", goal);
            }
        }

        if (e.code == "KeyM") {
            notice_block.textContent = "Select Mode: 5 - ao5, 3 - mo3";
        }

        else if (lastKey == "KeyM") {
            if (e.code == "Digit5") {
                changeMode("ao5");
                notice_block.textContent = "";
            } else if (e.code == "Digit3") {
                changeMode("mo3");
                notice_block.textContent = "";
            } else {
                notice_block.textContent = "";
            }
        }

        lastKey = e.code;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
        e.preventDefault();  // 阻止页面滚动
        if (!running && isReady) {
            startTimer();
        }
    }
});

scramble_block.textContent = scramble;

function stopTimer() {
    clearInterval(intervalId);
    running = false;
    isReady = false;
    showElements();
    scramble_block.textContent = genScramble();
    current_round.addResult(current_result);
    locked = true;
    setTimeout(() => {
        locked = false;
    }, 500);
}

function startTimer() {
    timer_block.style.color = c_normal;
    startTime = performance.now();
    intervalId = setInterval(updateTimer, 10);
    running = true;
}

function nextScramble() {
    scramble_block.textContent = genScramble();
}

function hideElements() {
    scramble_block.style.display = "none";
    table_block.style.display = "none";
}

function showElements() {
    scramble_block.style.display = "block";
    table_block.style.display = "block";
}

function switchDNF() {
    const index = this.round.length - 1;
    if (timer_block.textContent != "DNF") {
        timer_block.textContent = "DNF";
        this.round[index] = "DNF";
        document.getElementById("att" + String(index + 1)).textContent = "DNF";
    } else {
        timer_block.textContent = current_result.toFixed(2);
        document.getElementById("att" + String(index + 1)).textContent = current_result.toFixed(2);
        this.round[index] = current_result;
    }
}

function clearTextContent(e) {
    if (e)
        e.textContent = "";
}

function resetTheme() {
    document.body.style.background = c_bg;
    document.body.style.color = c_normal;
    timer_block.style.color = c_normal;
}

function printResults(avg) {
    console.log(`${this.round[0].toFixed(2)}\t${this.round[1].toFixed(2)}\t${this.round[2].toFixed(2)}\t${this.round[3].toFixed(2)}\t${this.round[4].toFixed(2)}\nao5: ${avg}`);
}

function changeTheme(t) {
    c_ready = theme_list[t]["ready"];
    c_normal = theme_list[t]["normal"];
    c_bg = theme_list[t]["background"];
    resetTheme();
    changeStorage("theme", t);
    // console.log(`Theme changed to ${t}`);
}

function changeMode(m) {
    current_round.reset();
    mode = m;
    if (m == "mo3") {
        current_round = new Round(3, goal);
        document.getElementById("col4").style.display = "none";
        document.getElementById("col5").style.display = "none";
        document.getElementById("target_title").style.display = "none";
        document.getElementById("target").style.display = "none";
        document.getElementById("att4").style.display = "none";
        document.getElementById("att5").style.display = "none";

    } else if (m == "ao5") {
        current_round = new Round(5, goal);
        document.getElementById("col4").style.display = "table-cell";
        document.getElementById("col5").style.display = "table-cell";
        document.getElementById("target_title").style.display = "table-cell";
        document.getElementById("target").style.display = "table-cell";
        document.getElementById("att4").style.display = "table-cell";
        document.getElementById("att5").style.display = "table-cell";
    }
    changeStorage("mode", m);
}

function changeStorage(setting, value) {
    localStorage.setItem(setting, value);
}

function getVariable(setting) {
    return localStorage.getItem(setting);
}

function getObject(obj) {
    return JSON.parse(localStorage.getItem(obj));
}

async function loadConfig() {
    const response = await fetch("./settings/config.json");
    const config = await response.json();
    theme_list = config.theme;
}

window.addEventListener("DOMContentLoaded", async () => {
    await loadConfig();

    const theme = getVariable("theme");
    if (theme) {
        changeTheme(theme);
    }

    const g = getVariable("goal");
    if (g) {
        goal = Number(g);
    }

    const m = getVariable("mode");
    if (m) {
        changeMode(m);
    }
});