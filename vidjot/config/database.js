if(process.env.NODE_ENV === 'production'){
	module.exports = {
		mongoURI: 'mongodb://Greg:1234@ds139446.mlab.com:39446/vidjot-gtd-production'
	}
} else {
	module.exports = {
		mongoURI: 'mongodb://localhost/vidjot-dev'
	}
}

