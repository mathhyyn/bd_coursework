const pool = require('./pool.js');

class Workout {
    getWorkoutList = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        response.status(200).render('workout')
    }
    createWorkout = async (request, response) => {
    }
}


module.exports = Workout;