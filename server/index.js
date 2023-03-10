// Always require express and makes it a varible named app
const express = require('express')
const app = express()
const TodoGroup = require('./models/todogroup')


// DataBase configuration

// Require mongoose
const mongoose = require('mongoose')

// Mongoose config and name of the new database and path to connect with mongoDB
mongoose.connect('mongodb://localhost:27017/25NOW', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Just to check if the connection works
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});



// Routes
app.use(express.json()); // enable parsing of request body as JSON, add the res payload on the req body as keys


// Fetch data from DB
app.get('/api/todogroup', async (req, res) => {
    const todogroups = await TodoGroup.find()
    res.send(todogroups)
})

// Add New TodoGroup
app.post('/api/newtodogroup', async (req, res) => {
    const { Title } = req.body
    const newtodogroup = new TodoGroup({ Title: Title, Itens: [], isArchive: false })
    await newtodogroup.save();
    res.send(newtodogroup)
})

// Delete TodoGroup
app.delete('/api/deletetodogroup/:id', async (req, res) => {
    const { id } = req.params
    await TodoGroup.findByIdAndDelete(id)
    res.send('Made it')
})

//(New Todo Title, New Item, Delete Item, Delete TodoGrup)
app.put('/api/updatetodogroup/:id', async (req, res) => {
    const { id } = req.params
    await TodoGroup.findByIdAndUpdate(id, { ...req.body })
    console.log(req.body)
})







// Listen port always at the end
app.listen(5000, () => {
    console.log("Listening on port 5000!")
})