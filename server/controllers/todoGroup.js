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
    const { Title, Itens } = req.body
    const newtodogroup = new TodoGroup({ Title: Title, Itens: Itens, isArchive: false })
    newtodogroup.author = req.user._id;
    console.log(newtodogroup)
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
    await TodoGroup.findByIdAndUpdate(id, { ...req.body, author: req.user._id }, { new: true })
}