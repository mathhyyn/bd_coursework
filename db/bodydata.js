const pool = require('./pool.js');

class BodyData {
    createParameter = async (request, response) => {
        let user_id = request.session.user;
        console.log('for', user_id);
        if (!user_id) return response.redirect('/');

        console.log(request.body);
        if (!request.body) return response.sendStatus(404);

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

    addBodyData = async (request, response) => {
        console.log(request.session.user);
        if (!request.session.user) return response.redirect('/');

        let parameter_id = request.session.parameter;
        if (!parameter_id) return response.redirect('/body_data');

        console.log(request.body);
        if (!request.body) return response.sendStatus(404);

        const { new_body_data } = request.body;

        await pool.query("insert into parameter_data (body_data_ref, value) values ($1, $2)",
            [parameter_id, new_body_data], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(404).json(error);
                } else {
                    response.status(200).json({ message: "Add parameter '" + new_body_data + "'" });
                }
            });
    }

    getParametersList = async (request, response) => {
        // console.log(request.query.user_id);
        // request.session.user = 'user1'; //ВРЕМЕННО
        let user_id = request.session.user;
        console.log('for', user_id);
        console.log("loadPage :", '/body_data');
        if (!request.session.user) return response.redirect('/');
        /*if (!user_id) {
            response.redirect('/');
            return;
        }*/ 
        
        // const user_id = request.query.user_id;

        await pool.query("select * from body_data where user_id_ref = $1 order by updated_at desc",
            [user_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(404).render('body_data');
                } else {
                    response.status(200).render('body_data', {paramenters: results.rows});
                }
            });
    }

    getBodyData = async (request, response) => {
        console.log(request.session.user);
        if (!request.session.user) return response.redirect('/');
        let parameter_id = request.query.parameter_id;
        request.session.parameter = parameter_id;
        console.log(parameter_id);
        if (!parameter_id) {
            return response.sendStatus(404);
        }

        await pool.query("select * from get_body_data_list($1, $2)",
            [request.session.user, parameter_id], async (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(404).json(error.detail);
                } else {
                    await pool.query("select parameter_name from body_data where id = $1", [parameter_id], (e, r) => {
                        // console.log(results.rows)
                        response.render('parameter_data', {parameter_name: r.rows[0].parameter_name, data_list: results.rows});
                    });
                }
            });
    }
}


module.exports = BodyData;

/* module.exports = {create, auth}; */