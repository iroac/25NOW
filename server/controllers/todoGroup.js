const TodoGroup = require('../models/todogroup')
const AppError = require('../utils/AppError')

exports.getAllTodos = async (req, res, next) => {
    try {
        const todogroups = await TodoGroup.find({ author: req.user._id })
        res.send(todogroups)
    } catch (err) {
        return next(new AppError('No possible to fetch lists right now', 500))
    }

}

exports.newTodoGroup = async (req, res) => {
    const { Title, Itens, isArchive, author } = req.body
    const newtodogroup = new TodoGroup({ Title, Itens, isArchive, author })
    await newtodogroup.save();
    res.send(newtodogroup)
}

exports.deleteTodoGroup = async (req, res) => {
    const { id } = req.params
    await TodoGroup.findByIdAndDelete(id)
    res.send('Made it')
}


exports.updateTodoGroup = async (req, res) => {
    const { id } = req.params
    console.log(req.body)
    await TodoGroup.findByIdAndUpdate(id, { ...req.body }, { new: true })
}