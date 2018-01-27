const indexController = require('../controllers/indexControllers.js');

module.exports = (app)=> {
// Login   
    app.get('/users/login', indexController.login),
//  Register
    app.get('/users/register', indexController.register),

    // Register form POST
    app.post('/login', indexController.postLogin),

    // Post new User from register form
    app.post('/register', indexController.postRegister)

}