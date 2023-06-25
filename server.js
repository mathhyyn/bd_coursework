const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

const urlencodedParser = bodyParser.urlencoded({
    extended: false,
});

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

const pool = require('./db/pool.js');

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


// app.post('/redirect', async (req, res) => { console.log(req.body); res.redirect(req.body.page); });

app.post('/user_sign_up', db_users.createUser);
app.post('/user_sign_in', db_users.authUser);
app.get('/logout', db_users.logoutUser);

const BodyData = require('./db/bodydata');
let db_bodydata = new BodyData();

app.post('/parameter_add', db_bodydata.createParameter);
app.post('/body_data_add', db_bodydata.addBodyData);
app.get('/body_data_get', db_bodydata.getBodyData);
app.get('/body_data', db_bodydata.getParametersList);