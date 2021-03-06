var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
//定义地址
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, './page/webs/src'); //__dirname 中的src目录，以此类推
var APP_FILE = path.resolve(APP_PATH, 'app'); //根目录文件app.jsx地址
var BUILD_PATH = path.resolve(ROOT_PATH, './page/main/dist'); //发布文件所存放的目录/main/dist/前面加/报错？


module.exports = {
    entry: {
        app: APP_FILE,
        common: [
            "react",
            'react-dom',
            'react-router',
            'redux',
            'react-redux',
            'redux-thunk',
            'redux-promise',
            'immutable'
        ]
    },
    output: {
        publicPath: './main/dist/', //编译好的文件，在服务器的路径,域名会自动添加到前面
        path: BUILD_PATH, //编译到当前目录
        filename: '[name].js', //编译后的文件名字
        chunkFilename: '[name].[chunkhash:5].min.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer'])
        }, {
            test: /\.less$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer', 'less'])
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer', 'sass'])
        }, {
            test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
            exclude: /node_modules/,
            loader: 'file-loader?name=[name].[ext]'
        }, {
            test: /\.(png|jpg|gif)$/,
            exclude: /node_modules/,
            loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
        }, {
            test: /\.jsx$/,
            exclude: /node_modules/,
            loaders: ['jsx', 'babel']
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production') //定义生产环境
            }
        }),
        new HtmlWebpackPlugin({  //根据模板插入css/js等生成最终HTML
            filename: '../../index.html', //生成的html存放路径，相对于 path
            template: './page/webs/src/template/index.html', //html模板路径
            inject: 'body',
            hash: true,
        }),
        new ExtractTextPlugin('[name].css'),
        //提取出来的样式和common.js会自动添加进发布模式的html文件中，原来的html没有
        new webpack.optimize.CommonsChunkPlugin("common", "common.bundle.js"),
        new ParallelUglifyPlugin({  //优化打包过慢
           cacheDir: BUILD_PATH,
           uglifyJS:{
             output: {
               comments: false
             },
             compress: {
               warnings: false
             }
           }
         })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.scss', '.css'] //后缀名自动补全
    }
};