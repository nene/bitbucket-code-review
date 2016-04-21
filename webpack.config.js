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
        bitbucket: path.join(__dirname, "src/bitbucket.js"),
        jira: path.join(__dirname, "src/jira.js"),
        options: path.join(__dirname, "src/options.js"),
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
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
