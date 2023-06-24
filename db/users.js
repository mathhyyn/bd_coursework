const pool = require('./pool.js');

class Users {
    a = 5;
    getUsers = (request, response) => {
        //response.sendFile(__dirname + '/login/index.html');
        /*pool.query('SELECT * FROM users', (error, results) => {
            if (error) { throw error; }
            response.status(200).json(results.rows);
            console.log(results.rows);
        });*/
    };

    createUser = async (request, response) => {
        console.log(request.body);
        if (!request.body) return response.sendStatus(400);

        const { user_login, user_password, user_name, user_date, user_email, gender } = request.body;

        await pool.query('INSERT INTO users (user_login, user_password, user_name, user_date, email, gender) \
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
                        //console.log(results);
                        if (!error)
                            response.json({ message: "You are registered with a login '" + results.rows[0].user_login + "'" });
                    });
                }
            });
    };

    authUser = async (request, response) => {
        console.log(request.body);
        if (!request.body) return response.sendStatus(400);

        const { user_login, user_email, user_password } = request.body;

        await pool.query('select * from get_user_login($1, $2, $3)',
            [user_login, user_email, user_password], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(401).json(error);
                } else {
                    if (results.rows.length)
                        response.json({ message: "You are authorized with a login '" + results.rows[0].login + "'" });
                    else
                        response.status(401).json({ name: 'error', detail: 'Invalid login or password entered' });
                }
            });
    };
}


module.exports = Users;

/* module.exports = {create, auth}; */