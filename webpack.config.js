const path = require('path');
const pkg = require('./package.json');

const libraryName= pkg.name;

module.exports = {
  entry: path.join(__dirname, "src", "index.tsx"),
  output: {
    path:path.resolve(__dirname, "build"),     
    library: libraryName,
    libraryTarget: 'umd',
    publicPath: '/build/',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.?tsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', "@babel/typescript",]
          }
        }
      },
    ]
  },
}

