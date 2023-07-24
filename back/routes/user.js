const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

let pass;

router.post('/register', (req, res) => {
    pass = bcrypt.hashSync(req.body.psw, 10);
    req.body.psw = pass
    req.app.locals.db.collection('users').insertOne(req.body, function(err, data){
        if (err != undefined) {
            console.log('err');
            res.send({message: 'ERROR ' + err})
        } else {
            res.send(data)
        }
    })
})

router.post('/login', (req, res) => {
    // console.log(req.body);
    // let userMail = req.body.contact_info.email;
    // console.log(userMail);
    // let userPsw = req.body.psw;
    // console.log(userPsw);
    req.app.locals.db.collection('users').findOne({"contact_info.email": req.body.email}, function(err, data){
        console.log(data);
        if (err !== undefined) {
            console.log(err);
            res.send({msg: 'ERROR: ' + err})
        } else {
            let comparePsw = bcrypt.compareSync(req.body.psw, data.psw);
            if (comparePsw) {
                console.log('Psw correct');
                res.send({msg: 'USER LOGGED', data});
            } else {
                res.send({msg: 'ERROR: Incorrect password'})
            }
        }
    })
})

router.put('/edit', (req, res) => {
    req.app.locals.db.collection('users').updateOne({"id_info.id": req.body.id_info.id}, {$set: 
        {
            "contact_info.address.street": req.body.contact_info.address.street,
            "contact_info.address.city": req.body.contact_info.address.city,
            "contact_info.address.province": req.body.contact_info.address.province,
            "contact_info.address.postal_code": req.body.contact_info.address.postal_code,
            "contact_info.phone.type": req.body.contact_info.phone.type,
            "contact_info.phone.number": req.body.contact_info.phone.number,
        }
    }, function(err, data){
        if (err != undefined) {
            console.log('err');
            res.send({msg: 'ERROR: ' + err})
        } else {
            res.send({msg: 'INFORMACION ACTUALIZADA'})
        }
    })
});

router.post('/sanction', (req, res) => {
    req.app.locals.db.collection('users').findOne({"id_info.id": req.body.id}, (err, data) => {
        if (err != undefined) {
            console.log(err);
            res.send({msg: 'ERROR: ' + err})
        } else {
            res.send({msg: 'LECTOR ENCONTRADO', data})
        }
    })
});

router.put('/sanction/add', (req, res) => {
    req.app.locals.db.collection('users').updateOne({"id_info.id": req.body.id}, {$inc: 
        {
            "library_records.sanctions.current": 1
        }
    }, function(err, data){
        if (err != undefined) {
            console.log('err');
            res.send({msg: 'ERROR: ' + err})
        } else {
            res.send({msg: 'OK', data})
        }
    })
});

router.put('/suspension/add', (req, res) => {
    req.app.locals.db.collection('users').updateOne({"id_info.id": req.body.id}, {$set: 
        {
            "library_records.sanctions.banned": true
        }
    }, function(err, data){
        if (err != undefined) {
            console.log('err');
            res.send({msg: 'ERROR: ' + err})
        } else {
            res.send({msg: 'OK', data})
        }
    })
});

router.put('/suspension/lift', (req, res) => {
    req.app.locals.db.collection('users').updateOne({"id_info.id": req.body.id}, {$set: 
        {
            "library_records.sanctions.banned": false
        }
    }, function(err, data){
        if (err != undefined) {
            console.log('err');
            res.send({msg: 'ERROR: ' + err})
        } else {
            res.send({msg: 'OK', data})
        }
    })
});

module.exports = router