const pool = require('./pool.js');

function getDateStr(date) {
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? '0' + d : d;
    return `${date.getFullYear()}-${m}-${d}`;
}
class Users {
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
                        if (!error) {
                            request.session.user = results.rows[0].user_login;
                            response.status(200).json({ message: "You are registered with a login '" + results.rows[0].user_login + "'" });
                        }
                            
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
                    if (results.rows.length) {
                        request.session.user = results.rows[0].login;
                        console.log(request.session.user);
                        response.status(200).json({ login: results.rows[0].login, message: "You are authorized with a login '" + results.rows[0].login + "'" });
                    }
                    else {
                        response.status(401).json({ name: 'error', detail: 'Invalid login or password entered' });
                    }
                        
                }
            });
    };

    /* async getUserByLogin(login) {
        let a = 5;
        await pool.query('select * from users where user_login = $1',
            [login], (error, results) => {
                a = 10;
                console.log(results.rows);
                if (error) return 0;
                else return results.rows[0];
            });
        console.log('wait', a);
    }; */

    loadProfilePage = async (req, res) => {
        if (req.session.user) {
            await pool.query('select * from users where user_login = $1',
                [req.session.user], (error, results) => {
                    if (error) res.render('profile');
                    else res.render('profile', { name: results.rows[0].user_name });
                });
        } else { res.redirect('/'); }
    }

    loadEditePage = async (req, res) => {
        if (req.session.user) {
            await pool.query('select * from users where user_login = $1',
                [req.session.user], (error, results) => {
                    if (error) res.render('profile_edit');
                    else {
                        results.rows[0].user_date = getDateStr(results.rows[0].user_date);
                        res.render('profile_edit', { user: results.rows[0] });
                    }
                });
        } else { res.redirect('/'); }
    }

    logoutUser = (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }

    editUser = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        console.log(request.body);
        if (!request.body) return response.sendStatus(400);

        const { user_login, user_password, user_name, user_date, user_email, gender } = request.body;

        await pool.query('update users \
                          set user_login = $1, user_password = $2, user_name = $3, user_date = $4, email = $5, gender = $6 \
                          where user_login = $7',
            [user_login, user_password, user_name, user_date, user_email, gender, user_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(400).json(error);
                } else {
                    response.status(200).json({ message: "Your profile is updated" });
                }
            });
    };

    deleteUser = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        await pool.query('delete from users where user_login = $1',
            [user_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(400).json(error);
                } else {
                    response.status(200).redirect('/');
                }
            });
    };
}


module.exports = Users;

/* module.exports = {create, auth}; */