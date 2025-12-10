let edge_turn = {
    "U": [
        [1, 0, 2],
        [0, 1, 2],
        [1, 2, 2],
        [2, 1, 2]
    ],
    "D": [
        [1, 0, 0],
        [2, 1, 0],
        [1, 2, 0],
        [0, 1, 0],
    ],
    "F": [
        [1, 0, 2],
        [2, 0, 1],
        [1, 0, 0],
        [0, 0, 1]
    ],
    "B": [
        [1, 2, 2],
        [0, 2, 1],
        [1, 2, 0],
        [2, 2, 1],
    ],
    "L": [
        [0, 0, 1],
        [0, 1, 0],
        [0, 2, 1],
        [0, 1, 2]
    ],
    "R": [
        [2, 0, 1],
        [2, 1, 2],
        [2, 2, 1],
        [2, 1, 0],
    ]
}

let corner_turn = {
    "U": [
        [0, 0, 2],
        [0, 2, 2],
        [2, 2, 2],
        [2, 0, 2]
    ],
    "D": [
        [0, 0, 0],
        [2, 0, 0],
        [2, 2, 0],
        [0, 2, 0]
    ],
    "R": [
        [2, 0, 0],
        [2, 0, 2],
        [2, 2, 2],
        [2, 2, 0]
    ],
    "L": [
        [0, 0, 0],
        [0, 2, 0],
        [0, 2, 2],
        [0, 0, 2]
    ],
    "F": [
        [0, 0, 0],
        [0, 0, 2],
        [2, 0, 2],
        [2, 0, 0]
    ],
    "B": [
        [0, 2, 0],
        [2, 2, 0],
        [2, 2, 2],
        [0, 2, 2]
    ]
}
class Edge {
    constructor(pos = [1, 0, 2], face = 0, colors = ["white", "green"]) {
        this.postion = pos; // (1, 0, 2)
        this.colors = colors; // ["yellow", "red"]
        this.face = face; // 0 or 1
        this.origin = pos.slice();
    }
    reset() {
        this.face = 0;
        this.postion = this.origin.slice();
    }

    matchMe(pos) {
        return arraysEqual(this.postion, pos);
    }

    getColor(s) {
        switch (s) {
            case "U":
            case "D":
                return this.colors[this.face];
            case "F":
            case "B":
                if (this.postion[2] == 2 || this.postion[2] == 0)
                    return this.colors[(this.face + 1) % 2];
                else
                    return this.colors[this.face];
            case "L":
            case "R":
                return this.colors[(this.face + 1) % 2];
        }
    }

    turn(scramble) {
        const scram = scramble.trimEnd(' ').split(' ');
        scram.forEach(e => {
            let s = e;
            let t = s.charAt(0);
            let d = 1;
            if (s.length > 1)
                if (s.charAt(1) == "2") {
                    d = 2;
                } else {
                    d = 3;
                }
            for (let i = 0; i < d; i++) {
                if (getIndex(edge_turn[t], this.postion) >= 0) {
                    this.postion = edge_turn[t][(getIndex(edge_turn[t], this.postion) + 1) % 4];
                    if (t == "F" || t == "B") {
                        this.face = mod(this.face + 1, 2);
                    }
                }
            }
        });
    }
}

class Corner {
    constructor(pos = [0, 0, 2], face = 0, colors = ["white", "green", "orange"]) {
        this.postion = pos;
        this.colors = colors;
        this.face = face;
        this.origin = pos.slice();
    }

    reset(){
        this.postion = this.origin.slice();
        this.face = 0;
    }

    getColor(s) {
        switch (s) {
            case "U":
            case "D":
                return this.colors[mod(- this.face, 3)];
            case "F":
                if (this.postion[0] == this.postion[2])
                    return this.colors[mod(2 - this.face, 3)];
                else
                    return this.colors[mod(1 - this.face, 3)];
            case "B":
                if (this.postion[0] == this.postion[2])
                    return this.colors[mod(1 - this.face, 3)];
                else
                    return this.colors[mod(2 - this.face, 3)];
            case "L":
                if (this.postion[1] == this.postion[2])
                    return this.colors[mod(1 - this.face, 3)];
                else
                    return this.colors[mod(2 - this.face, 3)];
            case "R":
                if (this.postion[1] == this.postion[2])
                    return this.colors[mod(2 - this.face, 3)];
                else
                    return this.colors[mod(1 - this.face, 3)];

        }
    }

    matchMe(pos) {
        return arraysEqual(this.postion, pos);
    }

    turn(scramble) {
        const scram = scramble.trimEnd(' ').split(' ');
        scram.forEach(e => {
            let s = e;
            let t = s.charAt(0);
            let d = 1;
            if (s.length > 1)
                if (s.charAt(1) == "2") {
                    d = 2;
                } else {
                    d = 3;
                }
            for (let i = 0; i < d; i++) {
                if (getIndex(corner_turn[t], this.postion) >= 0) {
                    this.postion = corner_turn[t][(getIndex(corner_turn[t], this.postion) + 1) % 4];
                    if (t == "R") {
                        if (this.postion[1] + this.postion[2] == 2) {
                            this.face = (this.face + 2) % 3;
                        } else {
                            this.face = mod(this.face - 2, 3);
                        }
                    } else if (t == "L") {
                        if (this.postion[1] + this.postion[2] == 2) {
                            this.face = mod(this.face + 1, 3);
                        } else {
                            this.face = mod(this.face - 1, 3);
                        }
                    }
                    if (t == "F") {
                        if (this.postion[0] + this.postion[2] == 2) {
                            this.face = (this.face + 2) % 3;
                        } else {
                            this.face = mod(this.face - 2, 3);
                        }
                    } else if (t == "B") {
                        if (this.postion[0] + this.postion[2] == 2) {
                            this.face = mod(this.face + 1, 3);
                        } else {
                            this.face = mod(this.face - 1, 3);
                        }
                    }
                }
            }
        });
    }
}

class Cube3x3 {
    constructor(edges, corners) {
        this.edges = edges;
        this.corners = corners;
    }

    findEdge(pos) {
        for (let i = 0; i < 12; i++) {
            if (this.edges[i].matchMe(pos))
                return this.edges[i];
        }
    }
    findCorner(pos) {
        for (let i = 0; i < 8; i++) {
            if (this.corners[i].matchMe(pos))
                return this.corners[i];
        }
    }

    turn(s) {
        edges.forEach(e => {
            e.turn(s);
        });
        corners.forEach(c => {
            c.turn(s);
        })
        this.print();
    }

    print() {
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (this.findEdge([x, y, 2]))
                    document.getElementById("u" + (y * 3 + x)).style.backgroundColor = this.findEdge([x, y, 2]).getColor("U");
                if (this.findCorner([x, y, 2])) {
                    document.getElementById("u" + (y * 3 + x)).style.backgroundColor = this.findCorner([x, y, 2]).getColor("U");
                }
            }
        }
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (this.findEdge([x, y, 0]))
                    document.getElementById("d" + (y * 3 + x)).style.backgroundColor = this.findEdge([x, y, 0]).getColor("D");
                if (this.findCorner([x, y, 0]))
                    document.getElementById("d" + (y * 3 + x)).style.backgroundColor = this.findCorner([x, y, 0]).getColor("D");
            }
        }
        for (let x = 0; x < 3; x++) {
            for (let z = 0; z < 3; z++) {
                if (this.findEdge([x, 0, z]))
                    document.getElementById("f" + (z * 3 + x)).style.backgroundColor = this.findEdge([x, 0, z]).getColor("F");
                if (this.findCorner([x, 0, z]))
                    document.getElementById("f" + (z * 3 + x)).style.backgroundColor = this.findCorner([x, 0, z]).getColor("F");
            }
        }
        for (let x = 0; x < 3; x++) {
            for (let z = 0; z < 3; z++) {
                if (this.findEdge([x, 0, z]))
                    document.getElementById("b" + (z * 3 + x)).style.backgroundColor = this.findEdge([x, 2, z]).getColor("B");
                if (this.findCorner([x, 0, z])) {
                    document.getElementById("b" + (z * 3 + x)).style.backgroundColor = this.findCorner([x, 2, z]).getColor("B");
                }
            }
        }
        for (let y = 0; y < 3; y++) {
            for (let z = 0; z < 3; z++) {
                if (this.findEdge([0, y, z]))
                    document.getElementById("l" + (z * 3 + y)).style.backgroundColor = this.findEdge([0, y, z]).getColor("L");
                if (this.findCorner([0, y, z]))
                    document.getElementById("l" + (z * 3 + y)).style.backgroundColor = this.findCorner([0, y, z]).getColor("L");
            }
        }
        for (let y = 0; y < 3; y++) {
            for (let z = 0; z < 3; z++) {
                if (this.findEdge([2, y, z]))
                    document.getElementById("r" + (z * 3 + y)).style.backgroundColor = this.findEdge([2, y, z]).getColor("R");
                if (this.findCorner([2, y, z]))
                    document.getElementById("r" + (z * 3 + y)).style.backgroundColor = this.findCorner([2, y, z]).getColor("R");
            }
        }

    }
    reset() {
        this.edges.forEach(e => {
            e.reset();
        });
        this.corners.forEach(e => {
            e.reset();
        });
        this.print();
    }
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

function getIndex(Arr, arr) {
    let index = -1;
    for (let i = 0; i < Arr.length; i++) {
        if (arraysEqual(Arr[i], arr))
            index = i;
    }
    return index;
}

// cube.print();
// cube.turn("L2 R' U' L' U L D' L2 U2 L2 R2 D' R L' D L2 D L' ");

function mod(a, b) {
    return ((a % b) + b) % b;
}

function drawScramble(s) {
    let inputElement = document.getElementById("s1");
    cube.turn(inputElement.value);
}

function reset() {
    cube.reset();
    cube.print();
}