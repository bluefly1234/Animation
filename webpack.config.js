module.exports = {
	entry: {
		animation: "./js/animation.js"
	},
	output: {
		path: __dirname + '/build',
		filename: '[name].js',
		library: 'animation',
		libraryTarget: 'umd'
	}
};