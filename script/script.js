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
let current_result = -1

let timer_block = document.getElementById("timer");
let scramble_block = document.getElementById("scramble");
let table_block = document.getElementById("results");
let notice_block = document.getElementById("notice");

// colors:
let c_ready = "green";
let c_normal = "white";
let c_bg = "#222"

let theme_list = null;

function updateTimer() {
    const now = performance.now();
    const elapsed = (now - startTime) / 1000;
    timer_block.textContent = elapsed.toFixed(2);
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
            reset();
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
    r = Number(timer_block.textContent);
    current_result = r;
    addResult(r);
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

function addResult(t) {
    let n;
    if (mode == "ao5")
        n = 5;
    else if (mode == "mo3")
        n = 3;

    if (results.length < n) {
        results.push(t);
        // sorted_result = results.slice().sort((a, b) => a - b);
        sorted_result = mysort(results);
        document.getElementById("att" + String(results.length)).textContent = t.toFixed(2);
        document.getElementById("target").textContent = getTarget();
        // document.getElementById("bpa").textContent = getBPA();
        // document.getElementById("wpa").textContent = getWPA();
        document.getElementById("average").textContent = getAverage(mode);

        // add ( ) to results (max and min)
        if (results.length == n && mode == "ao5") {
            maxR = sorted_result[n - 1];
            minR = sorted_result[0];
            let flagMax = false;
            let flagMin = false;
            for (let i = 1; i <= 5; i++) {
                if (!flagMax && document.getElementById("att" + String(i)).textContent == maxR) {
                    document.getElementById("att" + String(i)).textContent =
                        `(${document.getElementById("att" + String(i)).textContent})`;
                    flagMax = true;
                } else if (!flagMin && document.getElementById("att" + String(i)).textContent == minR) {
                    document.getElementById("att" + String(i)).textContent =
                        `(${document.getElementById("att" + String(i)).textContent})`;
                    flagMin = true;
                }
            }
        }
    } else {
        results = [];
        document.getElementById("average").textContent = "";
        for (i = 1; i <= n; i++) {
            document.getElementById("att" + String(i)).textContent = "";
        }
        results.push(t);
        document.getElementById("att" + String(results.length)).textContent = t.toFixed(2);
    }
}

function getBPA() {
    if (results.length < 4 || results.length == 5) {
        return ""
    } else if (results.length == 4) {
        if (sorted_result[3] == "DNF" && sorted_result[2] == "DNF") {
            return "DNF";
        }
        return ((sorted_result[0] + sorted_result[1] + sorted_result[2]) / 3).toFixed(2);
    }
}

function getWPA() {
    if (results.length < 4 || results.length == 5) {
        return ""
    } else if (results.length == 4) {
        if (sorted_result[3] == "DNF" && sorted_result[2] == "DNF") {
            return "DNF";
        }
        return ((sorted_result[3] + sorted_result[1] + sorted_result[2]) / 3).toFixed(2);
    }
}

function getTarget() {
    if (mode == "mo3") {
        return "";
    }
    if (results.length < 4 || results.length == 5) {
        return ""
    } else {
        if (Number(getWPA()) <= goal) {
            return "Guaranteed!";
        } else if (getBPA() == "DNF" || Number(getBPA()) > goal) {
            return "Impossible!";
        } else {
            return (goal * 3 - sorted_result[1] - sorted_result[2]).toFixed(2);
        }
    }
}

function getAverage(mode = "ao5") {
    if (mode == "ao5") {
        if (results.length < 5) {
            return "";
        }
        let count_dnf = 0;
        let r = [];
        for (let i of results) {
            if (i === "DNF") {
                count_dnf++;
            } else {
                r.push(i);
            }
        }
        r.sort((a, b) => a - b);
        let avg = 0;
        if (count_dnf > 1) {
            return "DNF";
        } else if (count_dnf == 1) {
            avg = ((sorted_result[3] + sorted_result[1] + sorted_result[2]) / 3).toFixed(2);
        }
        avg = ((sorted_result[3] + sorted_result[1] + sorted_result[2]) / 3).toFixed(2);
        // printResults(avg);
        return avg;
    } else if (mode == "mo3") {
        if (results.length < 3) {
            return "";
        }
        for (let i of results) {
            if (i === "DNF") {
                return "DNF";
            }
        }
        return ((results[0] + results[1] + results[2]) / 3).toFixed(2);
    }
}

function mysort(r) {
    let count_dnf = 0;
    let list = [];
    for (let i of r) {
        if (i == "DNF") {
            count_dnf++;
        } else {
            list.push(i);
        }
    }
    list.sort((a, b) => a - b);
    for (let a = 0; a < count_dnf; a++) {
        list.push("DNF");
    }
    return list;
}

function reset() {
    timer_block.textContent = "0.00";
    results = [];
    for (i = 1; i <= 5; i++) {
        clearTextContent(document.getElementById("att" + String(i)));
    }
    clearTextContent(document.getElementById("bpa"));
    clearTextContent(document.getElementById("wpa"));
    clearTextContent(document.getElementById("average"));
}

function switchDNF() {
    const index = results.length - 1;
    if (timer_block.textContent != "DNF") {
        timer_block.textContent = "DNF";
        results[index] = "DNF";
        document.getElementById("att" + String(index + 1)).textContent = "DNF";
    } else {
        timer_block.textContent = current_result.toFixed(2);
        document.getElementById("att" + String(index + 1)).textContent = current_result.toFixed(2);
        results[index] = current_result;
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
    console.log(`${results[0].toFixed(2)}\t${results[1].toFixed(2)}\t${results[2].toFixed(2)}\t${results[3].toFixed(2)}\t${results[4].toFixed(2)}\nao5: ${avg}`);
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
    reset();
    mode = m;
    if (m == "mo3") {
        document.getElementById("col4").style.display = "none";
        document.getElementById("col5").style.display = "none";
        document.getElementById("target_title").style.display = "none";
        document.getElementById("target").style.display = "none";
        document.getElementById("att4").style.display = "none";
        document.getElementById("att5").style.display = "none";

    } else if (m == "ao5") {
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