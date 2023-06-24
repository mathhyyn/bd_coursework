const pool = require('./pool.js');

class BodyData {
    createParameter = (request, response) => {
        console.log(request.body);
        if (!request.body) return response.sendStatus(400);

        const { user_id, new_parameter } = request.body;

        pool.query("insert into body_data (user_id_ref, parameter_name) values ($1, $2) returning id",
            [user_id, new_parameter], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(401).json(error);
                } else {
                    let id = result.rows[0].id;
                    console.log(id);
                    response.json({ parameter_id: id, message: "Add parameter '" + new_parameter + "'" });
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
                    response.json({ message: "Add parameter '" + new_body_data + "'" });
                }
            });
    }

    getBodyData = async (request, response) => {
        console.log(request.body);
        if (!request.body) return response.sendStatus(400);

        const { parameter_id } = request.body;

        await pool.query("select * from parameter_data where body_data_ref = $1",
            [parameter_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(401).json(error);
                } else {
                    response.json(results.rows);
                }
            });
    }
}


module.exports = BodyData;

/* module.exports = {create, auth}; */