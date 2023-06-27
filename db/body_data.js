const pool = require('./pool.js');

function getDateStr(date) {
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? '0' + d : d;
    let h = date.getHours();
    h = h < 10 ? '0' + h : h;
    let min = date.getMinutes();
    min = min < 10 ? '0' + min : min;
    let s = date.getSeconds();
    s = s < 10 ? '0' + s : s;
    return `${date.getFullYear()}-${m}-${d}T${h}:${min}:${s}`;
}

class BodyData {

    addBodyData = async (request, response) => {
        if (!request.session.user) return response.redirect('/');

        let parameter_id = request.session.parameter;
        if (!parameter_id) return response.redirect('/parameters');

        console.log(request.body);
        if (!request.body) return response.sendStatus(400);

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
        if (!parameter_id && !request.session.parameter) {
            return response.sendStatus(400);
        }
        if (!parameter_id) {
            return response.redirect('/body_data?parameter_id=' + request.session.parameter);
        }
        request.session.parameter = parameter_id;

        await pool.query("select * from get_body_data_list($1, $2)",
            [request.session.user, parameter_id], async (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(404).json(error.detail);
                } else {
                    await pool.query("select parameter_name from body_data where id = $1", [parameter_id], (e, r) => {
                        // console.log(results.rows) // if (e) ..
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



    loadEditPage = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        let bodydata_id = request.query.bodydata_id;
        request.session.bodydata_id = bodydata_id;
        if (!bodydata_id) {
            return response.sendStatus(400);
        }

        if (request.session.user) {
            await pool.query('select * from parameter_data where id = $1',
                [bodydata_id], (error, results) => {
                    if (error) response.render('bodydata_edit');
                    else {
                        results.rows[0].created_at = getDateStr(results.rows[0].created_at);
                        response.render('bodydata_edit', { data: results.rows[0] });
                    }
                });
        } else { response.redirect('/'); }
    }

    editBodyData = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        let bodydata_id = request.session.bodydata_id;

        console.log(request.body);
        if (!request.body) return response.sendStatus(400);

        const { value, date } = request.body;

        await pool.query('update parameter_data \
                          set value = $1, created_at = $2 \
                          where id = $3',
            [value, date, bodydata_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(400).json(error);
                } else {
                    response.status(200).json({ message: "Body data is updated" });
                }
            });
    };

    deleteBodyData = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        let bodydata_id = request.query.bodydata_id;
        if (!bodydata_id) {
            return response.sendStatus(400);
        }

        await pool.query('delete from parameter_data where id = $1',
            [bodydata_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(400).json(error);
                } else {
                    response.status(200).redirect('/body_data');
                }
            });
    };
}


module.exports = BodyData;

/* module.exports = {create, auth}; */