const MinifyPlugin = require("babel-minify-webpack-plugin")

module.exports = {
  entry: './src/app.js',
  devtool: 'inline',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new MinifyPlugin()
  ]
}
