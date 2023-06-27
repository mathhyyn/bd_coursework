const pool = require('./pool.js');

class Parameters {

    getParametersList = async (request, response) => {
        // const user_id = request.query.user_id;
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        await pool.query("select * from body_data where user_id_ref = $1 order by updated_at desc",
            [user_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(404).render('body_data', { parameters: [] });
                } else {
                    response.status(200).render('body_data', { parameters: results.rows });
                }
            });
    }

    createParameter = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        console.log(request.body);
        if (!request.body) return response.sendStatus(400);

        const { new_parameter } = request.body;

        await pool.query("insert into body_data (user_id_ref, parameter_name) values ($1, $2) returning id",
            [user_id, new_parameter], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(404).json(error);
                } else {
                    let id = results.rows[0].id;
                    console.log(id);
                    response.status(200).json({ parameter_id: id, message: "Add parameter '" + new_parameter + "'" });
                }
            });
    }
}


module.exports = Parameters;

/* module.exports = {create, auth}; */