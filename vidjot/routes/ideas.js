const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load helper
const {ensureAuthenticated} = require('./helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea Index Page //  app.get('/ideas', indexController.ideas)
router.get('/', ensureAuthenticated,(req, res) => {
    Idea.find({
            user: req.user.id
        })
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });

});

// Add Ideas Form // router.get('/ideas/add', indexController.add)
router.get('/add', ensureAuthenticated, (req, res) => {
    let title = 'Add';
    res.render('ideas/add', {
        title: title
    });
});

// Edit an idea // router.get('/ideas/edit/:id', indexController.edit)
router.get('/edit', ensureAuthenticated,(req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then((idea) => {
            res.render('ideas/edit', {
                idea: idea
            });
        });

});

// Edit an idea // router.get('/ideas/edit/:id', indexController.edit)
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then((idea) => {
            if (idea.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', {
                idea: idea
            });
            }
            
        });

});

//  Post Idea // router.post('/ideas', indexController.postidea)
router.post('/', (req, res) => {
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
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newIdea)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video idea added');
                res.redirect('/ideas');
            })
    }

});

//Edit Form Process // router.put('/ideas/:id', indexController.put)
router.put('/:id', (req, res) => {
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
});

// Delete the idea // app.delete('/ideas/:id', indexController.delete)
router.delete('/:id', (req, res) => {
    Idea.remove({
            _id: req.params.id

        })
        .then(() => {
            req.flash('success_msg', 'Video idea removed');
            res.redirect('/ideas');
        });
});

module.exports = router;