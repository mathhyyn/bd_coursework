const express = require('express');
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
        //let path = (str == '') ? '' : str + '/'; 
        console.log("aaa", str);
        res.render(str);
    });
}

['', 'sign_in', 'sign_up', 'uprofile', 'body_data'].forEach(loadPage);

// app.post('/redirect', async (req, res) => { console.log(req.body); res.redirect(req.body.page); });

app.post('/user_sign_up', db_users.createUser);
app.post('/user_sign_in', db_users.authUser);

const BodyData = require('./db/bodydata');
let db_bodydata = new BodyData();

app.post('/parameter_add', db_bodydata.createParameter);
app.post('/body_data_add', db_bodydata.addBodyData);
app.post('/body_data_get', db_bodydata.getBodyData);