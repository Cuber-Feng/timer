class Result {
    constructor(t, d = false, two = false, b = false) {
        this.t = Number(t);
        this.miniute = (this.t / 60) | 0;
        this.second = this.t % 60;
        this.isDNF = d;
        this.isPlusTwo = two;
        this.isBracket = b;
    }
    displayTime() {
        let s = "";
        if (this.isDNF) {
            s = "DNF";
        } else if (this.miniute == 0) {
            s = this.t.toFixed(2);
        } else {
            s = `${this.miniute}:${this.second.toFixed(2).padStart(5, '0')}`;
        }
        if (this.isBracket) {
            s = '(' + s + ')';
        }
        return s;
    }
    changeTime(T) {
        this.t = Number(T);
        this.miniute = (this.t / 60) | 0;
        this.second = this.t % 60;
    }
    compareTo(other) {
        if (!(other instanceof Result)) {
            throw new Error("Only Compare to Result");
        }
        if ((!this.isDNF) && (!other.isDNF)) {
            let t1 = this.t + (this.isPlusTwo ? 2 : 0);
            let t2 = other.t + (other.isPlusTwo ? 2 : 0);
            return t1 - t2;
        } else if (!this.isDNF) {
            return -1;
        } else if (!other.isDNF) {
            return 1;
        } else {
            return 0;
        }
    }
    clone() {
        return new Result(this.t, this.isDNF, this.isPlusTwom, this.isBracket);
    }
}

class Round {
    constructor(n = 5, g = 10) {
        this.m_length = n;
        this.round = [];
        this.sorted_round = [];
        this.target = null;
        this.avg = null;
        this.best = null;
        this.goal = g;
    }

    getBest() {
        if (this.round.length == 0){
            return "";
        }
        let best = new Result(this.sorted_round[0].t);
        return best.displayTime();
    }
    getAverage() {
        let avg;
        if (this.m_length == 5) {
            if (this.round.length < 5) {
                return "";
            }
            if (this.sorted_round[3].isDNF) {
                return "DNF";
            } else {
                avg = new Result((this.sorted_round[1].t + this.sorted_round[2].t + this.sorted_round[3].t) / 3);
                return avg.displayTime();
            }
        } else if (this.m_length == 3) {
            if (this.round.length < 3) {
                return "";
            }
            if (this.sorted_round[2].isDNF) {
                return "DNF";
            } else {
                avg = new Result((this.sorted_round[0].t + this.sorted_round[1].t + this.sorted_round[2].t) / 3);
                return avg.displayTime();
            }
        }
    }

    addResult(r) {
        let tmp = r.clone();
        if (this.round.length < this.m_length) {
            this.round.push(tmp);
            this.sorted_round = this.round.slice().sort((a, b) => a.compareTo(b));
            this.addBrackets();
            this.printTable();
        } else {
            this.reset();
            this.round.push(tmp);
            this.sorted_round = this.round.slice().sort((a, b) => a.compareTo(b));
            this.printTable();
        }
    }

    addBrackets() {
        if (this.round.length < 5) {
            return;
        }
        for (let i = 0; i < 5; i++) {
            this.round[i].isBracket = false;
        }
        let flag_min = false;
        let flag_max = false;
        for (let i = 0; i < 5; i++) {
            if (this.round[i].compareTo(this.sorted_round[0]) == 0 && !flag_min) {
                this.round[i].isBracket = true;
                flag_min = true;
            } else if (this.round[i].compareTo(this.sorted_round[4]) == 0 && !flag_max) {
                this.round[i].isBracket = true;
                flag_max = true;
            }
        }
    }
    printTable() {
        document.getElementById("target").textContent = "";
        document.getElementById("average").textContent = "";
        document.getElementById("best").textContent = "";
        for (let i = 0; i < this.m_length; i++) {
            document.getElementById("att" + String(i + 1)).textContent = "";
        }
        for (let i = 0; i < this.round.length; i++) {
            document.getElementById("att" + String(i + 1)).textContent = this.round[i].displayTime();
        }
        document.getElementById("target").textContent = this.getTarget();
        document.getElementById("average").textContent = this.getAverage();
        document.getElementById("best").textContent = this.getBest();
    }

    getWPA() {
        if (this.round.length < 4 || this.round.length == 5) {
            return ""
        } else if (this.round.length == 4) {
            if (this.sorted_round[3].isDNF && this.sorted_round[2].isDNF) {
                return "DNF";
            }
            return ((this.sorted_round[1].t + this.sorted_round[2].t + this.sorted_round[3].t) / 3);
        }
    }

    getBPA() {
        if (this.round.length < 4 || this.round.length == 5) {
            return ""
        } else if (this.round.length == 4) {
            if (this.sorted_round[3].isDNF && this.sorted_round[2].isDNF) {
                return "DNF";
            }
            return ((this.sorted_round[0].t + this.sorted_round[1].t + this.sorted_round[2].t) / 3);
        }
    }

    getTarget() {
        if (this.m_length != 5) {
            return "";
        }
        if (this.round.length < 4 || this.round.length == 5) {
            return ""
        } else {
            if (this.getWPA() != "DNF" && Number(this.getWPA()) <= goal) {
                return "Guaranteed!";
            } else if (this.getBPA() == "DNF" || Number(this.getBPA()) > goal) {
                return "Impossible!";
            } else {
                let tmp = new Result(this.goal * 3 - this.sorted_round[1].t - this.sorted_round[2].t)
                return tmp.displayTime();
            }
        }
    }

    reset() {
        this.round = [];
        this.sorted_round = [];
        this.target = null;
        this.avg = null;
        this.best = null;
        this.printTable();
    }
}