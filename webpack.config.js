const MinifyPlugin = require("babel-minify-webpack-plugin")

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new MinifyPlugin()
  ]
}
