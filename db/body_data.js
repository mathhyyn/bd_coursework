const pool = require('./pool.js');

class BodyData {

    addBodyData = async (request, response) => {
        if (!request.session.user) return response.redirect('/');

        let parameter_id = request.session.parameter;
        if (!parameter_id) return response.redirect('/parameters');

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


    getBodyData = async (request, response) => {
        if (!request.session.user) return response.redirect('/');
        let parameter_id = request.query.parameter_id;
        request.session.parameter = parameter_id;
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
                        request.session.parameter_name = r.rows[0].parameter_name;
                        request.session.data = results.rows;
                        response.render('parameter_data', { parameter_name: r.rows[0].parameter_name, data_list: results.rows });
                    });
                }
            });
    }

    getCasheBodyData = (request, response) => {
        if (!request.session.user) {
            response.redirect('/');
            return;
        }
        if (!request.session.parameter) return response.redirect('/parameters');
        response.json({ data_list: request.session.data, parameter_name: request.session.parameter_name });
    }
}


module.exports = BodyData;

/* module.exports = {create, auth}; */