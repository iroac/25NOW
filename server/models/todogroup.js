const mongoose = require('mongoose');
const Schema = mongoose.Schema

const TodoGroupSchema = new Schema({
    Title: String,
    Itens: Array,
    isArchive: Boolean,
    author: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('TodoGroup', TodoGroupSchema)