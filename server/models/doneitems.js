const mongoose = require('mongoose');
const Schema = mongoose.Schema

const DoneItemsSchema = new Schema({
    data: String,
    items: Array,
    author: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('DoneItems', DoneItemsSchema)