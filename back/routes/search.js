const express = require('express');
const router = express.Router();

router.get('/:param', (req, res) => {
    req.app.locals.db.collection('libros').find(req.params).toArray((err, data) => {
        if (err != undefined) {
            console.log(err);
            res.send({msg: 'ERROR :' + err})
        } else {
            res.send(data)
        }
    })
});

router.get('/original', (req, res) => {});
router.get('/autor', (req, res) => {});
router.get('/categoria', (req, res) => {});

module.exports = router