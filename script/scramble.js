moves = ["R", "L", "U", "D", "F", "B"];
tail = ["", "2", "'"];
function genScramble(length = 18) {
    result = "";
    lastLetter = -1;
    llastLetter = -2;
    for (i = 0; i < length; i++) {
        let r1 = Math.floor(Math.random() * 6);
        if (r1 == lastLetter) {
            r1 = (r1 + 1) % 6
        }
        if (lastLetter >= 0 && llastLetter >= 0) {
            if (((lastLetter / 2) | 0) == ((llastLetter / 2) | 0)) {
                while (((lastLetter / 2) | 0) == ((r1 / 2) | 0)) {
                    r1 = Math.floor(Math.random() * 6);
                }
            }
        }
        llastLetter = lastLetter;
        lastLetter = r1;
        let r2 = Math.floor(Math.random() * 3);
        result += moves[r1] + tail[r2] + " ";
    }
    return result;
}