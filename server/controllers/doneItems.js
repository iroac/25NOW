const DoneItem = require('../models/doneitems')


exports.getAllDones = async (req, res) => {
    const doneTodos = await DoneItem.find({ author: req.user._id })
    res.send(doneTodos)
}


exports.newDone = async (req, res) => {
    const newItem = new DoneItem({ ...req.body })
    await newItem.save()
    res.send(newItem)
}

exports.updateDone = async (req, res) => {
    const { id } = req.params
    await DoneItem.findByIdAndUpdate(id, { ...req.body })
}


exports.deleteDone = async (req, res) => {
    const { id } = req.params
    await DoneItem.findByIdAndDelete(id)
}