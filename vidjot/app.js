const express = require('express');
const path = require('path');
const passport = require('passport');
const bodyParser = require("body-parser"); // allows to access variables in routes
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// const indexroutes = require('./routes/index.js')(app);
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

//Map Global Promise - get rid of warning
mongoose.Promise = global.Promise;
// connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
        useMongoClient: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Load Idea Model
// require('./models/Idea');
// const Idea = mongoose.model('ideas'); MOVED TO INDEX CONTROLLER

// =======Handlebars Middleware=======
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// =========Body Parsere Middleware==========
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// =========Setting up Static Folders=======
app.use(express.static(path.join(__dirname, 'public')));
// =========Method Override Middleware======
app.use(methodOverride('_method'));
// =========Express Session MiddleWare======
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));
//  ========Connect Flash Middleware========
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; // If user is logged in -> used ot hide
    next();
});



app.get('/', (req, res) => {
    let title = 'Welcome';
    res.render('index', {
        title: title
    });
});

//  About Page // app.get('/about', indexController.about)
app.get('/about', (req, res) => {
    let title = 'About';
    res.render('about', {
        title: title
    });
});


// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

// app.use(app.router);
// ideas.initialize(app);
// app.use('/users', users);
// app.use(app.router);
// user.initialize(app);



const port = 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});