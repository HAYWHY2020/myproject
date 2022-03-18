var express = require('express');
var router = express.Router();
var rModel = require("../models/roomsModel");
module.exports.play = async function (id, value) {
  try {
    if (!parseInt(id)) {
      return { status: 400, result: { msg: "Room id must be a number" } };      
    }
    let sql = `select * from room, card
      where room.roo_id = $1 and
      room.roo_topcard_id = card.crd_winsover_id 
      and card.crd_name ILIKE $2;`
    let result = await pool.query(sql, [id,value]);
    if (result.rows.length == 0) {
      let sqlr = `select * from room, card where room.roo_id = $1 
                  and room.roo_topcard_id = card.crd_id`;
      let resultr = await pool.query(sqlr, [id]);
      let room = resultr.rows[0];
      if (!room) {
        return { status: 404, result: { msg: "No room with that id" } };
      } else {
        return {
          status: 200,
          result: {
            victory: false,
            msg: "You Lost! That card does not beat the top card.",
            current_topcard: room.crd_name         
          }
        };
      }
    }
    let card_id =  result.rows[0].crd_id;
    let card_name = result.rows[0].crd_name;
    let sql2 = "UPDATE room SET roo_topcard_id = $1 WHERE roo_id = $2";
    let result2 = await pool.query(sql2, [  card_id, id  ]);
    if (result2.rowCount == 0) {
      return { status: 500, 
               result: { msg: "Not able to update. Many possible reasons (ex: room was deleted during play)" } };
    }
    return {
      status: 200,
      result: {
        victory: true,
        msg: "You Won!",
        current_topcard: card_name
      }
    };
  } catch (err) {
    console.log(err);
    return { status: 500, result: err };
  }
}    

router.get('/', async function(req, res, next) {
    let result = await rModel.getAllRooms();
    res.status(result.status).send(result.result);
});

router.get('/:id', async function(req, res, next) {
  let id = req.params.id;
  console.log("Get room with id "+id)
  let result = await rModel.getRoomById(id);
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
  
module.exports = router;