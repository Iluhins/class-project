
var config = {
    entry: './main.js',
    output: {
        path: '/',
        filename: 'index.js',
    },
    devServer: {
        inline: true,
        port: 8080,
        proxy: {
            '/api': 'http://localhost:8081'
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
        
    },
    devtool: 'inline-source-map'
}
module.exports = config;