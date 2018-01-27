const indexController = require('../controllers/indexControllers.js');

module.exports = (app)=> {

    app.get('/ideas', indexController.ideas),

    // Add Idea Form (HTML)
    app.get('/ideas/add', indexController.add),

    app.get('/ideas/edit/:id', indexController.edit),

    // Post from add-idea form (API)
    app.post('/ideas', indexController.postidea),

    // Edit form Process
    app.put('/ideas/:id', indexController.put),

    app.delete('/ideas/:id', indexController.delete)

}