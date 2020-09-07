var path = require('path');


module.exports = {
	entry: './src/entry.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  output: {
	path: path.resolve(__dirname, 'dist'),
    filename: 'entry.min.js',
	libraryExport: 'Diagrammer',
	libraryTarget: 'umd'
  },
	externals: {
		lodash: {
		commonjs: 'lodash',
		commonjs2: 'lodash',
		amd: 'lodash',
		root: '_'
		}
	}
};
