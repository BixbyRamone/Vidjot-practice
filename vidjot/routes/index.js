const indexController = require('../controllers/indexControllers.js');

module.exports = (app)=> {

	// Home page (HTML)
    app.get('/', indexController.home),

    // About page (HTML)
    app.get('/about', indexController.about)

}