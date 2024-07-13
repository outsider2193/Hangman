let mySql = require('mysql2/promise');

async function readUserFromDatabase() {
    let connection = await mySql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2024mysqlkushal",
        database: "hangman",
    });
    try {

        const [rows] = await connection.execute(`
           select * from \`user\` order by id desc limit 1`);

        console.log(rows[0]);
        return rows;
    } catch (err) {
        console.error("Error executing query", err);
    } finally {
        await connection.end();
    }

}

readUserFromDatabase()

