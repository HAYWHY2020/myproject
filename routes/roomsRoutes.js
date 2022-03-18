var express = require('express');
var router = express.Router();
var rModel = require("../models/roomsModel");
var beats = { rock: 'scissors', scissors: 'paper', paper: 'rock' };

router.get('/', async function(req, res, next) {
    let result = await rModel.getAllRooms();
    res.status(result.status).send(result.result);
});
router.get('/filter', async function(req, res, next) {
  let filters = req.query;
  console.log("Get rooms filtered by:");
  console.log(filters);
  let result = await rModel.getRoomByNameOrTopCard(filters);
  res.status(result.status).send(result.result);
});
router.post('/:id/plays', async function(req, res, next) {
    let id = req.params.id;
    let cardPlayed = req.body.cardPlayed.toLowerCase();
    console.log(`Played card ${cardPlayed} on room with id ${id}`);
    let result = await rModel.play(id,cardPlayed);
    res.status(result.status).send(result.result);
  });
  module.exports.getRoomById = async function (id) {
    try {
      let sql = "Select * from room where roo_id = $1";
      let result = await pool.query(sql, [id]);
      if (result.rows.length > 0) {
        let room = result.rows[0];
        return { status: 200, result: room };
      } else {
        return { status: 404, result: { msg: "No room with that id" } };
      }
    } catch (err) {
      console.log(err);
      return { status: 500, result: err };
    }
  }
module.exports = router;