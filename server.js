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

app.get('/', (request, response) => {
    //response.sendFile(__dirname + '/index.html');
    /*response.send('Привет, мир!');
    response.json({ info: 'Node.js, Express, and Postgres API' })*/
});

app.listen(port, () => {
    console.log("listen server " + port);
});

const db = require('./db');

// app.use(express.static('login'));

//app.get('/users', urlencodedParser, db.getUsers);
//app.post('/users', urlencodedParser, db.createUser)
app.post('/users', db.createUser);

/*fetch('/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: 4,
        name: 'user',
        age: 10
    })
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));*/