// Always require express and makes it a varible named app
const express = require('express')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const cookieParser = require('cookie-parser');
const User = require('./models/user')
const MongoStore = require('connect-mongo');
const cors = require('cors'); // pass reqs to the localhost:3001
require('dotenv').config();

const app = express()
app.set("trust proxy", 1);
// Cors config middleware
app.use(cors({ origin: ['https://25-now.vercel.app', 'https://25-now-git-master-iroac.vercel.app', 'https://25-now-iroac.vercel.app', 'http://localhost:3003'], credentials: true, methods: 'GET, POST, PUT, DELETE', allowedHeaders: 'Content-Type, Authorization' })) // enable cookies and sessions across domains}));

// DataBase configuration
// Require mongoose - ORM
const mongoose = require('mongoose')
mongoose.set('strictQuery', true) // mongoose warning to put this here
// Mongoose config and name of the new database and path to connect with mongoDB
mongoose.connect(`${process.env.MONGODB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Just to check if the connection works
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

// Security config - always before the routes
app.use(mongoSanitize())
app.use(helmet({ contentSecurityPolicy: false }))



// Session MiddleWare
app.use(cookieParser());
const sessionConfig = { secret: 'wjdijfaWISomecrazyvaribleherefjaifaw', store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL, mongooseConnection: mongoose.connection }), resave: false, saveUninitialized: true, cookie: { secure: true, sameSite: 'none' }, maxAge: 24 * 60 * 60 * 1000 }
app.use(session(sessionConfig))




// Passport configuration

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());
// Local strategy configuration
passport.use(new LocalStrategy(User.authenticate()));
// Serialize and deserialize user
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())





// Routes Config
app.use(express.json()); // enable parsing of request body as JSON, add the res payload on the req body as keys
const doneItemsRoutes = require('./routes/doneItemsRoutes')
const userRoutes = require('./routes/userRoutes')
const todoGroupRoutes = require('./routes/todoGroupRoutes')
app.use('/api', todoGroupRoutes, doneItemsRoutes, userRoutes)

app.get('/', (req, res) => {
    res.send('Hi')
})

// Error handle
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).send(message)
})

// Listen port always at the end
app.listen(5002, () => {
    console.log("Listening on port 5000!")
})