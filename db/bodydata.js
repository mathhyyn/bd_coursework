const pool = require('./pool.js');

class BodyData {
    createParameter = async (request, response) => {
        console.log(request.body);
        if (!request.body) return response.sendStatus(400);

        const { user_id, new_parameter } = request.body;

        await pool.query("insert into body_data (user_id_ref, parameter_name) values ($1, $2) returning id",
            [user_id, new_parameter], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(401).json(error);
                } else {
                    let id = result.rows[0].id;
                    console.log(id);
                    response.status(200).json({ parameter_id: id, message: "Add parameter '" + new_parameter + "'" });
                }
            });
    }

    addBodyData = async (request, response) => {
        console.log(request.body);
        if (!request.body) return response.sendStatus(400);

        const { parameter_id, new_body_data } = request.body;

        await pool.query("insert into parameter_data (body_data_ref, value) values ($1, $2)",
            [parameter_id, new_body_data], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(401).json(error);
                } else {
                    response.status(200).json({ message: "Add parameter '" + new_body_data + "'" });
                }
            });
    }

    getParametersList = async (request, response) => {
        // console.log(request.query.user_id);
        let user_id = request.session.user;
        console.log('for', user_id);
        console.log("loadPage :", '/body_data');
        /*if (!user_id) {
            response.redirect('/');
            return;
        }*/ //ВРЕМЕННО

        user_id = 'user2';

        // if (!request.query.user_id) return response.sendStatus(400);
        // const user_id = request.query.user_id;

        await pool.query("select * from body_data where user_id_ref = $1",
            [user_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(401).render('body_data');
                } else {
                    response.status(200).render('body_data', {paramenters: results.rows});
                }
            });
    }

    getBodyData = async (request, response) => {
        console.log(request.session.user);
        console.log(request.query.parameter_id);
        if (!request.query.parameter_id) return response.sendStatus(400);

        const parameter_id = request.query.parameter_id;

        await pool.query("select * from parameter_data where body_data_ref = $1",
            [parameter_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(401).json(error);
                } else {
                    response.status(200).json(results.rows);
                }
            });
    }
}


module.exports = BodyData;

/* module.exports = {create, auth}; */