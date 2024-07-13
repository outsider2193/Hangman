const guesses = [{
    guess: "a"
},
{
    guess: "b"
},
{
    guess: "c"
}
]

// output=["a","b","c"]
newformat=[];
for(let i=0;i<guesses.length;i++){
    arrofstr= guesses[i].guess;
    newformat.push(arrofstr);
}
console.log(newformat);

for (let i = 0; i < newGuess.length; i++) {
    let guess = newGuess[i];
    if (isInputSingleCharAndLowerCaseEnglishCharOnly(guess)) {
        if (!isGuessCorrect(match.word, guess)) {
            match.remaining_lives--;
            if (match.remaining_lives === 0) {
                return res.status(200).json({ message: "You lost!" });
            }
        }
    } else {
        return res.status(400).json({ message: "Invalid guess: must be a single lowercase English character" });
    }
}