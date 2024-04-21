const config = {
  mode: 'production',
  entry: {
    index: './src/js/index.js',
    shop: './src/js/shop.js',
  },
  output: {
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}

module.exports = config
