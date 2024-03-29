const { request, response } = require('express');
const pool = require('./pool.js');

class Workout {
    createWorkout = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        console.log(request.body);
        if (!request.body) return response.sendStatus(400);

        const { name, info } = request.body;

        await pool.query("insert into workout (name, owner_id, info) values ($1, $2, $3) returning id",
            [name, user_id, { description: info }], async (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(400).json(error);
                } else {
                    let id = results.rows[0].id;
                    response.status(200).json({ workout_id: id, message: "Workout '" + name + "' is created" });
                }
            });
    }

    getAllWorkouts = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        let order = request.query.order ? request.query.order : 'desc';
        let by = request.query.by ? request.query.by : 'created_at';

        await pool.query(`select * from workout \
            where id not in (select workout.id \
            from workout \
            join user_workouts on workout.id = user_workouts.workout_id \
            where user_workouts.user_id = $1 ) \
            order by ${by} ${order}`,
            [user_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(404).render('workout_search', { workouts: [] });
                } else {
                    response.status(200).render('workout_search', { user_id: user_id, workouts: results.rows, order: order, by: by })
                }
            });


    }
    

    addWorkout = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        let workout_id = request.query.id;
        if (!workout_id) {
            return response.sendStatus(400);
        }

        await pool.query("insert into user_workouts (user_id, workout_id) values ($1, $2)",
            [user_id, workout_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(400).json(error);
                } else {
                    response.status(200).redirect('/workout_search');

                }
            });
    }

    deleteWorkout = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        let workout_id = request.query.id;
        if (!workout_id) {
            return response.sendStatus(400);
        }

        await pool.query("delete from user_workouts where user_id = $1 and workout_id = $2",
            [user_id, workout_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(400).json(error);
                } else {
                    response.status(200).redirect('/workout');
                }
            });
    }

    removeWorkout = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        let workout_id = request.query.id;
        if (!workout_id) {
            return response.sendStatus(400);
        }

        await pool.query("delete from workout where id = $1",
            [workout_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(400).json(error);
                } else {
                    response.status(200).redirect('/workout_search');
                }
            });
    }

    getUserWorkouts = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        await pool.query("select workout.* \
        from workout \
        join user_workouts on workout.id = user_workouts.workout_id \
        where user_workouts.user_id = $1 \
        order by created_at desc",
            [user_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(404).render('workout', { workouts: [] });
                } else {
                    request.session.workouts = results.rows;
                    response.status(200).render('workout', { workouts: results.rows })
                }
            });
    }
}


module.exports = Workout;