const { request, response } = require('express');
const pool = require('./pool.js');

class Workout {
    createWorkout = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        console.log(request.body);
        if (!request.body) return response.sendStatus(400);

        const { name } = request.body;

        await pool.query("insert into workout (name, owner_id) values ($1, $2) returning id",
            [name, user_id], async (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(400).json(error);
                } else {
                    let id = results.rows[0].id;
                    console.log(id);
                    response.status(200).json({ workout_id: id, message: "Workout '" + name + "' is created" });
                }
            });
    }

    getAllWorkouts = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        await pool.query("select * from workout order by created_at desc",
            [], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(404).render('workout_search', {workouts: []});
                } else {
                    
                    response.status(200).render('workout_search', { user_id: user_id,  workouts: results.rows })
                }
            });

        
    }

    addWorkout = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        await pool.query("insert into user_workouts (user_id, workout_id) values ($1, $2) returning id",
            [user_id, workout_id], (error, results) => {
                if (error) {
                    console.log(error);
                    console.log("DETAILS ", error.detail);
                    response.status(400).json(error);
                } else {
                    response.status(200).json({ workout_id: id, message: "Add workout '" + workout_id + "'" });
                }
            });
    }
    getUserWorkouts = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        response.status(200).render('workout')
    }
}


module.exports = Workout;