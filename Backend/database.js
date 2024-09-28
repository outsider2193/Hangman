let mySql = require('mysql2/promise');

async function addWordFromDatabase(word) {

    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });

    try {

        const data = await connection.execute('INSERT INTO word (word, description, difficulty) VALUES (?, ?, ?)', [word.word, word.description, word.difficulty]);



    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        (await connection).end();
    }



}

async function deleteWordFromDatabase(word) {

    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });


    const [data] = await connection.execute('DELETE FROM word WHERE word=?', [word.word]);
    return data;
}
async function readWordsFromDatabase(difficulty) {

    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });



    try {
        let query = "SELECT * from word";
        let queryParams = [];

        if (difficulty) {
            query += " where difficulty = ?";
            queryParams.push(difficulty);
        }
        const [rows] = await connection.execute(query, queryParams);
        console.log("Fetched Words:", rows);
        return rows;
    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        (await connection).end();
    }


}
async function wordExistsinDatabase(newWord) {

    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });
    try {

        const response = await connection.execute("SELECT * from word WHERE word= ?", [newWord]);
        rows = response[0];
        if (rows.length == 0) {
            return false;
        }
        else {
            return true;

        }
    } catch (error) {
        console.error("Error checking in db", error);
        return false;
    } finally {
        (await connection).end();
    }
}

async function getRandomWordObject(difficulty) {
    // return words[Math.floor(Math.random() * words.length)];
    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });

    try {
        const [rows] = await connection.execute("SELECT * FROM  word where difficulty=? ORDER BY RAND() LIMIT 1; ", [difficulty]);
        // console.log(rows[0]);
        return rows[0];

    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        (await connection).end();
    }

}
async function addnewMatchToDatabase(newMatch) {

    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });

    try {
        // const data = await connection.execute("insert into my_words (word,Description) values('" + word.word + "','" + word.description + "');");
        const data = await connection.execute(`insert into \`match\` (player_id,word,remaining_lives,status) values (${newMatch.player_id}, '${newMatch.word}',${newMatch.remaining_lives},'${newMatch.status}');`)
        const insertId = (data[0].insertId);
        const [rows] = await connection.execute("select *from \`match\` where id=?", [insertId]);
        // console.log(rows);
        return rows[0];

    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        (await connection).end();
    }



}

async function addnewUsertoDatabase(userInfo) {
    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });


    try {
        const data = await connection.execute(`insert into \`user\` (first_name ,last_name,email_id,password,role) values ('${userInfo.firstName}', '${userInfo.lastName}','${userInfo.email}','${userInfo.password}','${userInfo.role}' ); `)
        const insertId = (data[0].insertId);
        const [rows] = await connection.execute("select *from \`user\` where id=?", [insertId]);
        return rows[0];

    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        (await connection).end();
    }
}

async function addNewGuesstoDatabase(guessWord, matchId) {
    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });

    const data = await connection.execute("insert into guesses (guess, match_id) VALUES (?, ?)",
        [guessWord.guess, matchId]
    )
    return data;


}

async function readMatchFromDatabase(matchId) {
    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });

    const data = await connection.execute(`SELECT \`match\`.*, word.description 
    FROM \`match\` 
INNER JOIN word ON \`match\`.word = word.word 
WHERE \`match\`.id = ?;
`, [matchId]);
    return data[0];
}

async function readGuessesFromDatabase(matchId) {
    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });

    const data = await connection.execute(`select guess from  guesses where match_id=?`, [matchId]);
    return data[0];
}

async function updateRemainingLivestoDatabase(matchId, remainingLives) {
    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });
    try {
        const [rows] = await connection.execute(
            `UPDATE \`match\` SET remaining_lives = ? WHERE id = ?`,
            [remainingLives, matchId]
        );
        return rows;
    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await connection.end();
    }
}
async function updateStatustoDatabase(matchId, status) {
    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });

    try {
        const [rows] = await connection.execute(
            `UPDATE \`match\` set status= ? WHERE id= ?`,
            [status, matchId]

        );
        return rows;
    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await connection.end();
    }

}

async function readUserFromDatabaseByEmail(email) {
    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });

    try {

        const [rows] = await connection.execute(`
            SELECT * FROM \`user\`
            WHERE email_id = ?
            ORDER BY id DESC
            LIMIT 1`, [email]);


        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await connection.end();
    }

}

async function readUserFromDatabase(playerId) {
    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });

    try {

        const [rows] = await connection.execute
            (`
        SELECT * FROM \`user\`where id=?
            `, [playerId]);
        // console.log(rows);
        return rows[0];
    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await connection.end();
    }

}


async function updateScoreToDatabase(score, playerId) {
    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });

    try {
        const [rows] = await connection.execute(`
            update \`user\` 
            set score=?
            where id=? `, [score, playerId])
        return rows;
    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await connection.end();
    }


}

async function getMatchFromDatabase(playerId) {
    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });

    try {
        const [data] = await connection.execute(`SELECT * FROM \`match\` where player_id=?`, [playerId]);
        return data;

    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await connection.end();
    }
}




module.exports = {
    addWordFromDatabase, deleteWordFromDatabase, wordExistsinDatabase,
    readWordsFromDatabase, getRandomWordObject, addnewMatchToDatabase,
    addnewUsertoDatabase, addNewGuesstoDatabase, readMatchFromDatabase,
    readGuessesFromDatabase, updateRemainingLivestoDatabase, updateStatustoDatabase,
    readUserFromDatabaseByEmail, readUserFromDatabase, updateScoreToDatabase, getMatchFromDatabase
};