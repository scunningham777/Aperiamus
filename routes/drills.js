var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('drills', { title: 'Aperiamus - Labyrinthus' });
});

module.exports = router;
