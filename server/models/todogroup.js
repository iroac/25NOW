const mongoose = require('mongoose');
const Schema = mongoose.Schema

const TodoGroupSchema = new Schema({
    Title: String,
    Itens: Array,
    isArchive: Boolean
});

module.exports = mongoose.model('TodoGroup', TodoGroupSchema)