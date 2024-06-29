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

module.exports={getObscuredWord}