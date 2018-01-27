// Load Idea Model
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('../models/Idea');
const Idea = mongoose.model('ideas');
require('../models/User');
const User = mongoose.model('users');


module.exports = {

    // Home Page // app.get('/', indexController.home)
    home: (req, res) => {
        let title = 'Welcome';
        res.render('index', {
            title: title
        });
    },

    //  About Page // app.get('/about', indexController.about)
    about: (req, res) => {
        let title = 'About';
        res.render('about', {
            title: title
        });
    },

    // Idea Index Page //  app.get('/ideas', indexController.ideas)
    ideas: (req, res) => {
        Idea.find({})
            .sort({ date: 'desc' })
            .then(ideas => {
                res.render('ideas/index', {
                    ideas: ideas
                });
            });

    },

    // Add Ideas Form // app.get('/ideas/add', indexController.add)
    add: (req, res) => {
        let title = 'Add';
        res.render('ideas/add', {
            title: title
        });
    },

    // Edit an idea // app.get('/ideas/edit/:id', indexController.edit)
    edit: (req, res) => {
        Idea.findOne({
                _id: req.params.id
            })
            .then((idea) => {
                res.render('ideas/edit', {
                    idea: idea
                });
            });

    },

    //  Post Idea // app.post('/ideas', indexController.postidea)
    postidea: (req, res) => {
        //BackEnd Error Checking
        let errors = [];

        if (!req.body.title) {
            errors.push({ text: 'Please add a title' });
        }
        if (!req.body.details) {
            errors.push({ text: 'Please add details' });
        }

        if (errors.length > 0) {
            res.render('ideas/add', {
                errors: errors,
                title: req.body.title,
                details: req.body.details
            });
        } else {
            let newIdea = {
                title: req.body.title,
                details: req.body.details
            }
            new Idea(newIdea)
                .save()
                .then(idea => {
                    req.flash('success_msg', 'Video idea added');
                    res.redirect('/ideas');
                })
        }

    },

    //Edit Form Process // app.put('/ideas/:id', indexController.put)
    put: (req, res) => {
        Idea.findOne({
                _id: req.params.id
            })
            .then(idea => {
                // new values
                idea.title = req.body.title;
                idea.details = req.body.details;

                idea.save()
                    .then(idea => {
                        req.flash('success_msg', 'Video idea updated');
                        res.redirect('/ideas')
                    })
            })
    },

    // Delete the idea // app.delete('/ideas/:id', indexController.delete)
    delete: (req, res) => {
        Idea.remove({
                _id: req.params.id

            })
            .then(() => {
                req.flash('success_msg', 'Video idea removed');
                res.redirect('/ideas');
            });
    },

    // Login GET route // app.get('/users/login', indexController.login)
    login: (req, res) => {
        res.render('users/login');
    },

    // User Regist route // app.get('/users/register', indexController.register)
    register: (req, res) => {
        res.render('users/register');
    },

    // Login Form POST
    postLogin: (req, res,  next) => {
        passport.authenticate('local', {
            successRedirect: '/ideas',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);
    },

    // Register Form POST // app.post('/register', indexController.postRegister)
    postRegister: (req, res) => {
        let errors = [];

        if (req.body.password !== req.body.password2) {
            errors.push('Passwords do not match');
        }
        if (req.body.password.length < 4) {
            errors.push('Password must be at least 4 characters');
        }
        if (errors.length > 0) {
            console.log(errors);
            res.render('users/register', {
                errors: errors,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                password2: req.body.password2
            });
        } else {
            User.findOne({ email: req.body.email })
                .then(user => {
                    if (user) {
                        req.flash('error_msg', 'Email already registered');
                        res.redirect('users/register');
                    } else {
                        let newUser = new User({
                            name: req.body.name,
                            email: req.body.email,
                            password: req.body.password,
                        });

                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw (err);
                                newUser.password = hash;
                                User(newUser)
                                    .save()
                                    .then(idea => {
                                        req.flash('success_msg', 'You are now registered');
                                        res.redirect('users/login');
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return;
                                    });
                            });
                        });

                    }
                });


        }
    }
}