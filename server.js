const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

const urlencodedParser = bodyParser.urlencoded({
    extended: false,
});

app.use(express.json());

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
app.post('/user_sign_up', db_users.createUser);
app.post('/user_sign_in', db_users.authUser);
app.post('/parameter_add', db_users.createParameter);
app.post('/body_data_add', db_users.addBodyData);