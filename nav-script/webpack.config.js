module.exports = {
    entry: {
        index: "./src/index.tsx"
    },
    output: {
        filename: "index.js",
        path: __dirname + "/out"
    },
    mode: "production",
    devtool: false,
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
