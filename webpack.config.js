// var debug = process.env.NODE_ENV !== "production";
 var webpack = require('webpack');
const path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
// 拆分css样式的插件
let ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
  entry: "./src/index.js",
  // module: {
  //   rules: [
  //     {
  //       test: /\.js?$/,
  //       exclude: /(node_modules)/,
  //       use: "babel-loader",
  //       query: {
  //         presets: ["react", "es2015"],
  //         plugins: ["react-html-attrs"] //添加组件的插件配置
  //       }
  //     },
  //     //下面是使用 ant-design 的配置文件
  //     { test: /\.css$/, loader: "style-loader!css-loader" }
  //   ]
  // },
  output: {
    // 添加hash可以防止文件缓存，每次都会生成4位的hash串
    filename: "bundle.[hash:4].js",
    path: path.resolve("dist") // 打包后的目录，必须是绝对路径
  },
  plugins: [
      // 打包前先清空
      new CleanWebpackPlugin()  ,
        // 热更新，热更新不是刷新
      new webpack.HotModuleReplacementPlugin(),

    // 通过new一下这个类来使用插件
    new HtmlWebpackPlugin({
      // 用哪个html作为模板
      // 在src目录下创建一个index.html页面当做模板来用
      template: "./src/index.html",
      hash: true // 会在打包好的bundle.js后面加上hash串
    }),
    // 拆分后会把css文件放到dist目录下的css/style.css
    new ExtractTextWebpackPlugin("css/style.css")
  ],
  module: {
    rules: [
      {
        test: /\.css$/, // 解析css
        use: ExtractTextWebpackPlugin.extract({
          // 将css用link的方式引入就不再需要style-loader了
          use: "css-loader",
          publicPath: "../"
        })
        // use: ['style-loader', 'css-loader'] // 从右向左解析
        /* 
                    也可以这样写，这种方式方便写一些配置参数
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'}
                    ]
                */
      }, {
        test:/\.jsx?$/,
        use: [
          {
            loader: "babel-loader" 
          }
        ],
        // include: /src/,          // 只转化src目录下的js
        exclude: /node_modules/  // 排除掉node_modules，优化打包速度
    },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192, // 小于8k的图片自动转成base64格式，并且不会存在实体图片
              outputPath: "images/" // 图片打包后存放的目录
            }
          }
        ]
      },
      {
        test: /\.(htm|html)$/,
        use: "html-withimg-loader"
      },
      {
        test: /\.(eot|ttf|woff|svg)$/,
        use: 'file-loader'
    }
    ]
  },
  resolve: {
    // 别名
    // alias: {
    //     $: './src/jquery.js'
    // },
    // 省略后缀
    extensions: ['.js', '.json', '.css']
},
 
  devServer: {
    contentBase: './dist',
    host: 'localhost',      // 默认是localhost
    port: 3298,             // 端口
    open: true,             // 自动打开浏览器
    hot: true               // 开启热更新
}
 
};
