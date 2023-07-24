const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    req.app.locals.db.collection('libros').insertOne(req.body, function(err, data){
        if (err != undefined) {
            console.log(err);
            res.send({mensaje: 'ERROR: ' + err})
        } else {
            res.send(data);
        }
    })
});

module.exports = router