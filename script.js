let startTime = null;
let running = false;
let intervalId = null;
let isReady = false;
let scramble = genScramble();
let results = [];
let sorted_result = [];
let locked = false;
let goal = 10;

let timer_block = document.getElementById("timer");
let scramble_block = document.getElementById("scramble");
let table_block = document.getElementById("results");
let notice_block = document.getElementById("notice");

// colors:
let c_ready = "green";
let c_normal = "white";
let c_bg = "#222"

let theme = null;

fetch("./settings/config.json")
    .then(r => r.json())
    .then(config => {
        theme = config.theme;
        changeTheme("default");
    });

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
        if (e.code === "Space") {
            if (locked) {
                return;
            }
            e.preventDefault();  // 阻止页面滚动
            if (!running) {
                timer_block.style.color = c_ready;
                isReady = true;
                hideElements();
            }
        }
        if (e.code == "KeyR") {
            reset();
        }
        if (e.code == "ArrowRight") {
            nextScramble();
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
    addResult(r);
    locked = true;
    setTimeout(() => {
        locked = false;
    }, 1000);
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
    if (results.length < 5) {
        results.push(t);
        sorted_result = results.slice().sort((a, b) => a - b);
        document.getElementById("att" + String(results.length)).textContent = t.toFixed(2);
        document.getElementById("target").textContent = getTarget();
        // document.getElementById("bpa").textContent = getBPA();
        // document.getElementById("wpa").textContent = getWPA();
        document.getElementById("average").textContent = getAverage();
        if (results.length == 5) {
            maxR = sorted_result[4];
            minR = sorted_result[0];
            for (let i = 1; i <= 5; i++) {
                if (Number(document.getElementById("att" + String(i)).textContent) == maxR ||
                    Number(document.getElementById("att" + String(i)).textContent) == minR) {
                    document.getElementById("att" + String(i)).textContent =
                        `(${document.getElementById("att" + String(i)).textContent})`;
                }
            }
        }
    } else {
        results = [];
        document.getElementById("average").textContent = "";
        for (i = 1; i <= 5; i++) {
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
        return ((sorted_result[0] + sorted_result[1] + sorted_result[2]) / 3).toFixed(2);
    }
}

function getWPA() {
    if (results.length < 4 || results.length == 5) {
        return ""
    } else if (results.length == 4) {
        return ((sorted_result[3] + sorted_result[1] + sorted_result[2]) / 3).toFixed(2);
    }
}

function getTarget() {
    if (results.length < 4 || results.length == 5) {
        return ""
    } else {
        if (Number(getWPA()) <= goal) {
            return "Guaranteed!";
        } else if (Number(getBPA()) > goal) {
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
        let avg = ((sorted_result[3] + sorted_result[1] + sorted_result[2]) / 3).toFixed(2);
        printResults(avg);
        return avg;
    } else if (mode == "mo3") {
        if (results.length < 3) {
            return "";
        }
        return ((results[0] + results[1] + results[2]) / 3).toFixed(2);
    }
}

function reset() {
    timer_block.textContent = "0.00";
    results = [];
    for (i = 1; i <= 5; i++) {
        document.getElementById("att" + String(i)).textContent = "";
    }
    document.getElementById("bpa").textContent = "";
    document.getElementById("wpa").textContent = "";
    document.getElementById("average").textContent = "";
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
    c_ready = theme[t]["ready"];
    c_normal = theme[t]["normal"];
    c_bg = theme[t]["background"];
    resetTheme();
}