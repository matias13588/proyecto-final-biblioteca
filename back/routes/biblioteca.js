const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.app.locals.db.collection('libros').find().toArray((err, data) => {
        if (err != undefined) {
            console.log(err);
            res.send({msg: 'ERROR: ' + err})
        } else {
            res.send(data)
        }
    })
});

router.post('/loan', (req, res) => {
    console.log(req.body.location);
    req.app.locals.db.collection('libros').findOne({"library_info.location": req.body.location}, (err, data) => {
        if (err != undefined) {
            console.log(err);
            res.send({msg: 'ERROR: ' + err})
        } else {
            res.send({msg: 'OK', data})
        }
    })
})

router.put('/loan/start', (req, res) => {
    console.log(req.body);
    req.app.locals.db.collection('libros').updateOne({"library_info.location": req.body.location}, {$set: 
        {
            "library_info.loans.current.dates.start": req.body.date,
            "library_info.loans.current.dates.end": "",
            "library_info.loans.current.lend": true,
            "library_info.loans.current.user": req.body.userID,
            "library_info.loans.past": [req.body.date + " " + req.body.userID]
        }
    }, function(err, data){
        if (err != undefined) {
            console.log('err');
            res.send({msg: 'ERROR: ' + err})
        } else {
            console.log(data);
            res.send({msg: 'Préstamo registrado', data})
        }
    })
});

router.put('/loan/end', (req, res) => {
    console.log(req.body);
    req.app.locals.db.collection('libros').updateOne({"library_info.location": req.body.location}, {$set: 
        {
            "library_info.loans.current.dates.start": "",
            "library_info.loans.current.dates.end": req.body.date,
            "library_info.loans.current.lend": false,
        }
    }, function(err, data){
        if (err != undefined) {
            console.log('err');
            res.send({msg: 'ERROR: ' + err})
        } else {
            console.log(data);
            res.send({msg: 'Devolución registrada', data})
        }
    })
});

router.put('/edit/book', (req, res) => {
    console.log(req.body);
    req.app.locals.db.collection('libros').updateOne({"library_info.location": req.body.location}, {$set: 
        {
            "book.reference.author.surname": req.body.authorSurname,
            "book.reference.author.name": req.body.authorName,
            "book.reference.title['book title']": req.body.title,
            "book.reference.title['original title']": req.body.original,
        }
    }, function(err, data){
        if (err != undefined) {
            console.log('err');
            res.send({msg: 'ERROR: ' + err})
        } else {
            console.log(data);
            res.send({msg: 'OK', data})
        }
    })
});

router.post('/nuevo', (req, res) => {
    console.log(req.body);
    req.app.locals.db.collection('libros').insertOne(req.body, (err, data) => {
        if (err != undefined) {
            console.log(err);
            res.send({msg: 'ERROR: ' + err})
        } else {
            res.send({msg: 'OK', data})
        }
    })
});

module.exports = router