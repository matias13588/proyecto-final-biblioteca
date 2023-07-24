const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');

const app = express();
const MongoClient = mongodb.MongoClient;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

let biblioteca = require('./routes/biblioteca');
let search = require('./routes/search');
let user = require('./routes/user');
let admin = require('./routes/admin');

app.use('/biblioteca', biblioteca);
app.use('/search', search);
// app.use('/nuevo', nuevo);
app.use('/user', user);
app.use('/admin', admin);

app.listen(8000);

MongoClient.connect("mongodb://127.0.0.1/27017", (err, client) => {
    if (err != undefined) {
        console.log(err);
    } else {
        app.locals.db = client.db('biblioteca')
    }
});