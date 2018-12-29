module.exports = {
    entry: {
        index: "./src/index.tsx"
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/out"
    },
    mode: "development",
    devtool: "eval",
    module: {
        rules: [
            {
                test: /\.ts(x)?$/,
                use: [
                    { loader: "babel-loader" },
                    "ts-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    }
}
