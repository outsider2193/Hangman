// let mySql = require('mysql2/promise');
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'hangman';
const { ObjectId } = require('mongodb');


async function addWordFromDatabase(wordObject) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("words");

    try {

        const result = await collection.insertOne({
            word: wordObject.word,
            description: wordObject.description,
            difficulty: wordObject.difficulty
        })

    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await client.close();
    }



}

async function deleteWordFromDatabase(word) {

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("words");
    try {
        const data = await collection.deleteOne({ word: word })
        return data;
    } catch (error) {
        console.error("Error deleting word", error);
        return false;
    } finally {
        await client.close();
    }
}

async function readWordsFromDatabase(difficulty) {

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("words");



    try {
        let query = {};
        if (difficulty) {
            query = { difficulty: difficulty }
        }
        const result = await collection.find(query, { projection: { _id: 0 } }).toArray();
        return result;
    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await client.close();
    }


}
async function wordExistsinDatabase(newWord) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("words");

    try {

        const response = await collection.findOne({ word: newWord })
        return response ? true : false;
    } catch (error) {
        console.error("Error checking in db", error);
        return false;
    } finally {
        await client.close();
    }
}

async function getRandomWordObject(difficulty) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("words");


        const data = await collection.aggregate([
            { $match: { difficulty: difficulty } },
            { $sample: { size: 1 } }
        ]).toArray();
        return data[0];

    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await client.close();
    }

}
async function addnewMatchToDatabase(newMatch) {

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("matches");

        const data = await collection.insertOne(
            {
                player_id: newMatch.player_id,
                word: newMatch.word,
                remaining_lives: newMatch.remaining_lives,
                status: newMatch.status
            });

        const rows = await collection.aggregate([
            { $match: { _id: data.insertedId } }
        ]).toArray();
        return rows[0];
        // return await collection.findOne({ _id: result.insertedId });

    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await client.close();
    }



}

async function addnewUsertoDatabase(userInfo) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("user");

        const data = await collection.insertOne(
            {
                first_name: userInfo.firstName,
                last_name: userInfo.lastName,
                email_id: userInfo.email,
                password: userInfo.password,
                role: userInfo.role,
                score: 0
            }

        )
        const newUser = await collection.findOne({ _id: data.insertedId });
        if (newUser) {
            newUser._id = newUser._id.toString();
        }
        return newUser;
    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await client.close();
    }


    // try {
    //     const data = await connection.execute(`insert into \`user\` (first_name ,last_name,email_id,password,role) values ('${userInfo.firstName}', '${userInfo.lastName}','${userInfo.email}','${userInfo.password}','${userInfo.role}' ); `)
    //     const insertId = (data[0].insertId);
    //     const [rows] = await connection.execute("select *from \`user\` where id=?", [insertId]);
    //     return rows[0];

    // } 

}



// async function readMatchFromDatabase(matchId) {
//     try {

//         await client.connect();
//         const db = client.db(dbName);
//         const collection = db.collection("matches");
//         console.log(matchId);
//         const data = await collection.aggregate([
//             {
//                 $match: { _id: new ObjectId(matchId) }

//             },
//             {
//                 $lookup: {
//                     from: "words",
//                     localField: "word",
//                     foreignField: "word",
//                     as: "wordDetails"
//                 }
//             },

//             { $unwind: "$wordDetails" },
//             {
//                 $lookup: {
//                     from: "user",
//                     localField: "player_id",
//                     foreignField: "_id",
//                     as: "userInfo"
//                 }
//             },
//             {
//                 $addFields: {
//                     player_id: { $toObjectId: "$player_id" } // convert player_id to ObjectId
//                 }
//             },

//             { $unwind: "$userInfo" },

//             {
//                 $project: {
//                     _id: 1,
//                     player_id: 1,
//                     word: 1,
//                     description: "$wordDetails.description",
//                     remaining_lives: 1,
//                     status: 1,
//                     score: "$userInfo.score"

//                 }
//             }

//         ]).toArray();
//         const match = data[0];

//         if (match) {
//             match._id = match._id.toString();
//             match.player_id = match.player_id.toString();
//         }
//         return match;
//     } catch (error) {
//         console.error("Error fetching match from mongoDB", error);
//     } finally {
//         await client.close();
//     }
// }



async function readMatchFromDatabase(matchId) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("matches");

        console.log(matchId);

        const data = await collection.aggregate([
            {
                $match: { _id: new ObjectId(matchId) }
            },
            {
                $lookup: {
                    from: "words",
                    localField: "word",
                    foreignField: "word",
                    as: "wordDetails"
                }
            },
            { $unwind: "$wordDetails" },


            {
                $addFields: {
                    player_id: { $toObjectId: "$player_id" }
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "player_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },

            {
                $project: {
                    _id: 1,
                    player_id: 1,
                    word: 1,
                    description: "$wordDetails.description",
                    remaining_lives: 1,
                    status: 1,
                    score: "$userInfo.score"
                }
            }
        ]).toArray();

        const match = data[0];

        if (match) {
            match._id = match._id.toString();
            match.player_id = match.player_id.toString();
        }

        return match;

    } catch (error) {
        console.error("Error fetching match from MongoDB", error);
    } finally {
        await client.close();
    }
}






async function readGuessesFromDatabase(matchId) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("guesses");

        const data = await collection.find({ matchId: new ObjectId(matchId) }, { projection: { guess: 1, _id: 0 } }).toArray();
        return data;
    } catch (error) {
        console.error("Error fetching guess from the mongoDb document", error)
    } finally {
        await client.close();
    }

    // const data = await connection.execute(`select guess from  guesses where match_id=?`, [matchId]);
    // return data[0];
}

async function addNewGuesstoDatabase(guessWord, matchId) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("guesses");

        const data = await collection.insertOne(
            {
                guess: guessWord.guess,
                matchId: new ObjectId(matchId)
            })
        return { insertedId: data.insertedId }
    } catch (error) {
        console.error("Error inserting guesses into database", error);
    } finally {
        await client.close();
    }

    // const data = await connection.execute("insert into guesses (guess, match_id) VALUES (?, ?)",
    //     [guessWord.guess, matchId]
    // )



}

async function readUserFromDatabase(playerId) {

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("user");

        const data = await collection.findOne({ _id: new ObjectId(playerId) });
        if (data) {
            data._id = data._id.toString();
        }
        return data;
    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await client.close();
    }

    // try {

    //     const [rows] = await connection.execute
    //         (`
    //     SELECT * FROM \`user\`where id=?
    //         `, [playerId]);
    //     // console.log(rows);
    //     return rows[0];

}

async function updateScoreToDatabase(score, playerId) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("user");

        const data = await collection.updateOne({ _id: new ObjectId(playerId) }, { $set: { score: score } })
        return data;
    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await client.close();
    }

    // try {
    //     const [rows] = await connection.execute(`
    //         update \`user\` 
    //         set score=?
    //         where id=? `, [score, playerId])
    //     return rows;



}
async function updateStatustoDatabase(matchId, status) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("matches");

        const data = await collection.updateOne({ _id: new ObjectId(matchId) }, { $set: { status: status } })
        return data;

    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await client.close();
    }

    // try {
    //     const [rows] = await connection.execute(
    //         `UPDATE \`match\` set status= ? WHERE id= ?`,
    //         [status, matchId]

    //     );
    //     return rows;
}



async function updateRemainingLivestoDatabase(matchId, remainingLives) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("matches");

        const data = await collection.updateOne({ _id: new ObjectId(matchId) }, { $set: { remaining_lives: remainingLives } });
        return data;
    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await client.close();
    }

    // try {
    //     const [rows] = await connection.execute(
    //         `UPDATE \`match\` SET remaining_lives = ? WHERE id = ?`,
    //         [remainingLives, matchId]
    //     );
    //     return rows;

}


async function readUserFromDatabaseByEmail(email) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("user");

        const data = await collection
            .find({ email_id: email }).sort({ _id: -1 }).limit(1)
            .toArray();

        return data.length > 0 ? data[0] : null;

    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await client.close();
    }
    // try {

    //     const [rows] = await connection.execute(`
    //         SELECT * FROM \`user\`
    //         WHERE email_id = ?
    //         ORDER BY id DESC
    //         LIMIT 1`, [email]);


    //     return rows.length > 0 ? rows[0] : null;
}

async function getMatchFromDatabase(playerId) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("matches");

        const data = await collection.find({ player_id: playerId }).toArray();
        return data;
        // try {
        //     const [data] = await connection.execute(`SELECT * FROM \`match\` where player_id=?`, [playerId]);
        //     return data;

    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await client.close();
    }
}

async function getLeaderBoardFromDatabase() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("user");

        const data = await collection.aggregate([

            {
                $addFields: {
                    _id: { $toString: "$_id" }
                }
            },
            {
                $lookup: {
                    from: "matches",
                    localField: "_id",
                    foreignField: "player_id",
                    as: "playerMatches"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: { $concat: ["$first_name", " ", "$last_name"] },
                    score: 1,
                    total_matches: { $size: "$playerMatches" }
                }
            },
            {
                $sort:
                {
                    score: -1

                }
            }
        ]).toArray();
        return data;
    } catch (error) {
        console.error("Error fetching data from MongoDB", error);
    } finally {
        await client.close();
    }

}





module.exports = {
    addWordFromDatabase, deleteWordFromDatabase, wordExistsinDatabase,
    readWordsFromDatabase, getRandomWordObject, addnewMatchToDatabase,
    addnewUsertoDatabase, addNewGuesstoDatabase, readMatchFromDatabase,
    readGuessesFromDatabase, updateRemainingLivestoDatabase, updateStatustoDatabase,
    readUserFromDatabaseByEmail, readUserFromDatabase, updateScoreToDatabase, getMatchFromDatabase,
    getLeaderBoardFromDatabase
};