const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 处理模板页面
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 打包css文件
const pages = require("./pages"); // 加载多页配置

// 获取入口配置
function getEntry() {
    const entry = {};
    for (const key in pages) {
        entry[key] = pages[key].ts;
    }
    return entry;
}

// 获取针对多页的 HtmlWebpackPlugin 配置
function getHtmlPlugins() {
    const plugins = [];
    for (const key in pages) {
        plugins.push(
            new HtmlWebpackPlugin({
                chunks: [key], // 使用的chunk
                template: path.resolve(__dirname, pages[key].html),
                filename: pages[key].out,
                title: pages[key].title,
            })
        );
    }
    return plugins;
}

// webpack的基本配置
module.exports = {
    entry: getEntry(), // 获取入口配置
    output: {
        filename: "js/[name].[chunkhash:5].js", // js 输出到 dist/js/xxx
        publicPath: "/", // 公用的公共路径 /
        path: path.resolve(__dirname, "dist"), // 输出目录为 dist
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"), // 别名 @ = src目录
            _: __dirname, // 别名 _ = 工程根目录
        },
        extensions: ['.ts', '.js'],
    },
    stats: {
        colors: true, // 打包时使用不同的颜色区分信息
        modules: false, // 打包时不显示具体模块信息
        entrypoints: false, // 打包时不显示入口模块信息
        children: false, // 打包时不显示子模块信息
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }, {
                test: /\.glsl$/,
                type: 'asset/source'
            }, {
                // 各种图片、字体文件，均交给 url-loader 处理
                test: /\.(png)|(gif)|(jpg)|(svg)|(bmp)|(eot)|(woff)|(ttf)$/i,
                type: 'asset',
                generator: {
                    filename: 'static/[hash][ext][query]'
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024 // 4kb
                    }
                }
            },
            {
                // 所有的 css 和 pcss 文件均交给 postcss 处理
                test: /\.(css)$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            }
        ],
    },
    plugins: [
        ...getHtmlPlugins(), // 应用所有页面模板，输出到指定的目录
        new MiniCssExtractPlugin({
            // 打包 css 代码 到文件中
            filename: "css/[name].css",
            chunkFilename: "css/common.[hash:5].css" // 针对公共样式的文件名
        }),
    ],
};

