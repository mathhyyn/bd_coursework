const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(express.json());

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

app.listen(port, () => {
    console.log("listen server " + port);
});

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
// ['body_data'].forEach(loadPrivatePage);
app.get('/uprofile', db_users.loadProfilePage);


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

const Training = require('./db/training');
let db_training = new Training();
app.get('/training', db_training.getTrainingList);
app.post('/training_add', db_training.createTraining);
