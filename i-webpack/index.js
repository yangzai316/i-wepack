const Webpack = require('./webpack');
const config = require('./../webpack.config');


const webpack = new Webpack(config);
webpack.run();