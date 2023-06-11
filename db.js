const e = require('express');
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgrespw',
    port: 49153,
});

const getUsers = (request, response) => {
    //response.sendFile(__dirname + '/login/index.html');
    /*pool.query('SELECT * FROM users', (error, results) => {
        if (error) { throw error; }
        response.status(200).json(results.rows);
        console.log(results.rows);
    });*/
};

const createUser = (request, response, next) => {
    console.log(request.body);
    if (!request.body) return response.sendStatus(400);

    const { user_login, user_password, user_name, user_date, user_email, gender } = request.body;

    /*pool.query('INSERT INTO users (user_id,name,age) VALUES ($1, $2, $3)', [id, name, age], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).send(`User added with ID: ${results.insertId}`);
    });*/

    pool.query('INSERT INTO users (user_login, user_password, user_name, user_date, email, gender) \
                VALUES ($1, $2, $3, $4, $5, $6)',
        [user_login, user_password, user_name, user_date, user_email, gender], (error, results) => {
            if (error) {
                console.log(error);
                console.log("DETAILS ", error.detail);
                response.status(401).json(error);
                // next(error);
                // throw error;
            } else {
                pool.query('SELECT user_login from users where email = $1', [user_email], (error, results) => {
                    console.log(results);
                    if (!error)
                        response.json({ message: "You are registered with a login '" + results.rows[0].user_login + "'" });
                });
            }
            //response.status(201).send(`User added with ID: ${results.fields}`);
        });
};

module.exports = {
    getUsers,
    createUser,
}