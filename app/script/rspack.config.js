const path = require('path');
/**
 * @type {import('@rspack/core').Configuration}
 */
module.exports = {
    devtool: false,
    entry: {
        main: './src/index.ts',
    },
    output: {
        filename: 'chat.min.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        }
    }
};