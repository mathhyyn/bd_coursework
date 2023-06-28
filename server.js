const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log("listen server " + port);
});

app.use(express.json());

const session = require('express-session');
app.use(
    session({
        secret: 'you secret key',
        resave: false,
        saveUninitialized: false,
    })
);

//app.use(express.static(path.join(__dirname, 'static')));

app.use(express.static('static'));
app.set('view engine', 'ejs');
app.set('views', './templates');

/*app.get('/', (request, response) => {
    //response.sendFile(__dirname + '/index.html');
    /*response.send('Привет, мир!');
    response.json({ info: 'Node.js, Express, and Postgres API' })
});*/

const Users = require('./db/users');
let db_users = new Users();

// app.use(express.static('login'));
//app.get('/users', urlencodedParser, db.getUsers);
//app.post('/users', urlencodedParser, db.createUser)

function loadPage(str) {
    app.get('/' + str, (req, res) => {
        console.log("loadPage :", '/' + str);
        res.render(str);
    });
}


function loadPrivatePage(str) {
    app.get('/' + str, async (req, res) => {
        console.log('for', req.session.user);
        console.log("loadPage :", '/' + str);
        if (req.session.user) {
            res.render(str);
        } else { res.redirect('/'); }
    });
}

['', 'sign_in', 'sign_up'].forEach(loadPage);
app.get('/uprofile', db_users.loadProfilePage);
app.get('/profile_edit', db_users.loadEditPage);
app.put('/uprofile', db_users.editUser);
app.get('/delete_user', db_users.deleteUser);

app.post('/sign_up', db_users.createUser);
app.post('/sign_in', db_users.authUser);
app.get('/logout', db_users.logoutUser);

const Parameters = require('./db/parameters');
let db_params = new Parameters();
app.get('/parameters', db_params.getParametersList);
app.post('/parameters', db_params.createParameter);

const BodyData = require('./db/body_data');
let db_bodydata = new BodyData();
app.get('/body_data', db_bodydata.getBodyData);
app.post('/body_data', db_bodydata.addBodyData);
app.get('/body_data_cashe', db_bodydata.getCasheBodyData);
app.get('/bodydata_edit', db_bodydata.loadEditPage);
app.get('/bodydata_delete', db_bodydata.deleteBodyData);
app.put('/body_data', db_bodydata.editBodyData);


const Workout = require('./db/workout');
let db_workout = new Workout();
app.get('/workout', db_workout.getUserWorkouts);
app.get('/workout_add', db_workout.addWorkout);
app.get('/workout_delete', db_workout.deleteWorkout);
app.get('/workout_remove', db_workout.removeWorkout);
app.get('/workout_search', db_workout.getAllWorkouts);
app.post('/workout_search', db_workout.createWorkout);


