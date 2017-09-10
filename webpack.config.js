const path=require("path");
const webpack=require("webpack");
const hotMiddlewareSrcipt='webpack-hot-middleware/client?reload=true';

module.exports={
	entry:{
		index:['./src/pages/index.js',hotMiddlewareSrcipt]
	},
	output:{
		path:path.join(__dirname,'./public'),
		filename:'bundle.js'
	},
	module:{
		loaders:[
			{
				test:/\.js$/,
				loader:'babel-loader',
				query:{
					presets:['react','es2015']
				}
			},
			{
				test:/\.scss$/,
				loader:'style-loader!css-loader!sass-loader'
			},
			{
				test:/\.css$/,
				loader:'style-loader!css-loader'
			}
		]
	},
	plugins:[
		new webpack.HotModuleReplacementPlugin()
	]
}