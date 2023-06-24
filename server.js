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

app.use(express.static(path.join(__dirname, 'client')));

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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/user_sign_up', db_users.createUser);
app.post('/user_sign_in', db_users.authUser);

const BodyData = require('./db/bodydata');
let db_bodydata = new BodyData();

app.post('/parameter_add', db_bodydata.createParameter);
app.post('/body_data_add', db_bodydata.addBodyData);
app.post('/body_data_get', db_bodydata.getBodyData); 