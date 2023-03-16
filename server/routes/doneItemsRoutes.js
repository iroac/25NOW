const express = require("express")
const router = express.Router();
const DoneItem = require('../models/doneitems')
const doneController = require('../controllers/doneItems')

router.get('/getdonetodo', doneController.getAllDones);
router.post('/newdonetodo', doneController.newDone)
router.put('/updatedonetodo/:id', doneController.updateDone);
router.delete('/deletetododone/:id', doneController.deleteDone)

module.exports = router