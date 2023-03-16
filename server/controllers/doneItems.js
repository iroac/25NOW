const DoneItem = require('../models/doneitems')


exports.getAllDones = async (req, res) => {
    const doneTodos = await DoneItem.find({ author: req.user._id })
    res.send(doneTodos)
}


exports.newDone = async (req, res) => {
    const { data, items } = req.body
    const newItem = new DoneItem({ data: data, items: items, author: req.user._id })
    await newItem.save()
    res.send(newItem)
}

exports.updateDone = async (req, res) => {
    const { id } = req.params
    await DoneItem.findByIdAndUpdate(id, { ...req.body, author: req.user._id })
}


exports.deleteDone = async (req, res) => {
    const { id } = req.params
    await DoneItem.findByIdAndDelete(id)
}