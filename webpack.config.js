"use strict";

var path = require("path");

module.exports = {
    debug: true,
    devtool: "inline-source-map",
    cache: true,
    node: {
        fs: "empty"
    },
    entry: {
        app: path.join(__dirname, "src/index.js")
    },
    output: {
        path: __dirname,
        filename: "content-script.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
                include: path.join(__dirname, "src")
            },
        ]
    },
    resolve: {
        root: [
            path.resolve(__dirname),
            path.resolve(__dirname, "node_modules")
        ],
        extensions: ["", ".js"]
    },
    resolveLoader: {
        root: path.join(__dirname, "node_modules")
    },
};
