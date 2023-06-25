const pool = require('./pool.js');

class Training {
    getTrainingList = async (request, response) => {
        let user_id = request.session.user;
        if (!user_id) return response.redirect('/');

        response.status(200).render('training')
    }
    createTraining = async (request, response) => {
    }
}


module.exports = Training;