var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('drills', { title: 'LLG - Labyrinthus' });
});

module.exports = router;