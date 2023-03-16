const express = require("express")
const router = express.Router();
const todoGroupController = require('../controllers/todoGroup');
const { validateTodoGroup } = require("../middleware");

// Fetch data from DB
router.get('/todogroup', todoGroupController.getAllTodos)

// Add New TodoGroup
router.post('/newtodogroup', validateTodoGroup, todoGroupController.newTodoGroup)

// Delete TodoGroup
router.delete('/deletetodogroup/:id', todoGroupController.deleteTodoGroup)

//(New Todo Title, New Item, Delete Item, Delete TodoGrup)
router.put('/updatetodogroup/:id', validateTodoGroup, todoGroupController.updateTodoGroup)

module.exports = router