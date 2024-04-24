const { defineConfig } = require('@vue/cli-service')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const Timestamp = new Date().getTime()

module.exports = defineConfig({
  transpileDependencies: false,
  publicPath: '/vue3',
  productionSourceMap: process.env.NODE_ENV === 'production',
  devServer: {
    proxy: {
      '/wd': {
        target: 'http://127.0.0.1:8088',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/wd': '/wd'
        }
      },
    },
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV !== 'development') {
      config.plugins.push(new CssMinimizerWebpackPlugin())
      config.plugins.push(new TerserPlugin())
      const CompressionWebpackPlugin = require('compression-webpack-plugin')
      const productionGzipExtensions = ['js', 'css']
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 8192,
          minRatio: 0.8
        })
      )
    }
    // 接入sentry
    // if (process.env.NODE_ENV === 'production') {
    //   config.devtool = 'source-map'
    //   const { sentryWebpackPlugin } = require('@sentry/webpack-plugin')
    //   config.plugins.push(
    //     sentryWebpackPlugin({
    //       org: 'gitwd1998',
    //       project: 'vue3',
    //       authToken: '11212edbe6d34e66ba00b06a8243a13e96493b3cb45c476496ac1dfc3968dfdc'
    //     })
    //   )
    // }
  },
  
  chainWebpack(config) {
    // 首屏加载prefetch和preload过多
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')

    // filename 指列在entry 中，打包后输出的文件的名称。
    // chunkFilename 指未列在entry 中，却又需要被打包出来的文件的名称。
    config.output.filename(process.env.NODE_ENV !== 'development' ? `js/[name].[chunkhash].${Timestamp}.js` : `js/[name].[hash].${Timestamp}.js`)
    config.output.chunkFilename(process.env.NODE_ENV !== 'development' ? `js/[name].[chunkhash].${Timestamp}.js` : `js/[name].[hash].${Timestamp}.js`)
    config.optimization.runtimeChunk({
      name: 'single'
    })
    
    config.optimization.splitChunks({
      chunks: 'all', // 代码分割时对异步代码生效，all：所有代码有效，inital：同步代码有效
      minSize: 20000, // 代码分割最小的模块大小，引入的模块大于 30000B 才做代码分割
      maxSize: 0, // 代码分割最大的模块大小，大于这个值要进行代码分割，一般使用默认值
      minChunks: 1, // 引入的次数大于等于1时才进行代码分割
      maxAsyncRequests: 6, // 最大的异步请求数量,也就是同时加载的模块最大模块数量
      maxInitialRequests: Infinity, // 入口文件做代码分割最多分成 4 个 js 文件
      automaticNameDelimiter: '-', // 文件生成时的连接符
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 位于node_modules中的模块做代码分割
          priority: 10
        }, // 分割，，既满足 vendors，又满足 default，那么根据优先级会打包到 vendors 组中。
        elementplus: {
          test: /[\\/]node_modules[\\/]element-plus[\\/]/, // 位于node_modules中的模块做代码分割
          priority: 20
        },
        default: {
          // 没有 test 表明所有的模块都能进入 default 组，但是注意它的优先级较低。
          priority: -20, //  根据优先级决定打包到哪个组里,打包到优先级高的组里。
          reuseExistingChunk: true // 如果一个模块已经被打包过了,那么再打包时就忽略这个上模块
        }
      }
    })
  }
})
