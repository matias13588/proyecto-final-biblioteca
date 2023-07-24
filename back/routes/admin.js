const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

let pass;

router.post('/register', (req, res) => {
    pass = bcrypt.hashSync(req.body.psw, 10);
    req.body.psw = pass
    req.app.locals.db.collection('admin').insertOne(req.body, function(err, data){
        if (err != undefined) {
            console.log('err');
            res.send({message: 'ERROR ' + err})
        } else {
            res.send(data)
        }
    })
});

router.post('/login', (req, res) => {
    // console.log(req.body);
    // let adminMail = req.body.contact_info.email;
    // console.log(adminMail);
    // let adminPsw = req.body.psw;
    // console.log(adminPsw);
    req.app.locals.db.collection('admin').findOne({"email": req.body.email}, function(err, data){
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

module.exports = router