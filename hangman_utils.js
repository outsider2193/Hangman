function getObscuredWord(word, userInputArray) {
    let output = "";
    for (let i = 0; i < word.length; i++) {
        if (userInputArray.includes(word[i])) {
            output = output + word[i];
        }
        else {
            output = output + "_";
        }
    }
    return output;
}

function isGuessCorrect(word, userGameInput) {

    for (let i = 0; i < word.length; i++) {
        if (userGameInput === word[i]) {
            return true;
        }

    }
    return false;

}

function isInputSingleCharAndLowerCaseEnglishCharOnly(inp) {
    if (inp.length != 1) {
        return false;
    }

    if (inp.charCodeAt(0) > 122 || inp.charCodeAt(0) < 97) {
        return false;
    }
    return true;
}
const jwt = require('jsonwebtoken');
const secretKey = 'your-very-secure-secret-key';
function validateToken(bearerToken) {
    if (bearerToken) {
        try {
            const token = bearerToken.replace("Bearer ", "");
            const decoded = jwt.verify(token, secretKey);

            return decoded;
        } catch (err) {
            return null;
        }
    }
    return null;


}

module.exports = { getObscuredWord, isGuessCorrect, isInputSingleCharAndLowerCaseEnglishCharOnly, validateToken }