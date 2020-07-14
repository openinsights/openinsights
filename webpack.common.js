const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        // TODO: May need to change this depending on the permanent name chosen
        // for the project
        library: "openInsights",
        libraryTarget: "window",
    }
};
