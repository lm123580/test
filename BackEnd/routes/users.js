var express = require('express');
var router = express.Router();
// 导入写好的注册/登录函数
const {
	regUser,
	login
} = require('../public/javascripts/login')
 
/* GET users listing. */
router.get('/', function(req, res, next) {
	// 获取客户端提交到服务器的用户信息
	const userInfo = req.body
	if(req.user){
		return res.cc('获取成功', 0, req.user)
	}
	// 获取到中间件的时间
	res.send('GET 请求成功');
});

/**
 * POST 用户注册
 * @param account   用户账号
 * @param password  用户密码
 */
router.post('/register', (req, res, next) => {
	// 通过 req.body 获取请求体中包含的 url-encoded 格式的数据
	console.log(req.body)
	const userInfo = req.body
	//【步骤一】对客户端的数据进行校验
	if (userInfo.account == '' || userInfo.password == '') {
		return res.send({
			status: 1,
			msg: '用户名和密码不能为空'
		})
	}
	// 【步骤二】执行定义好的注册函数
	regUser(req, res)
});
 
/**
 * POST 用户登录
 * @param account   用户账号
 * @param password  用户密码
 */
router.post('/login', (req, res, next) => {
	// 通过 req.body 获取请求体中包含的 url-encoded 格式的数据
	// console.log(req.body)
	const userInfo = req.body
	//对客户端的数据进行校验
	if (userInfo.account == '' || userInfo.password == '') {
		return res.send({
			status: 1,
			msg: '用户名和密码不能为空'
		})
	}
	// 执行定义好的登录函数
	login(req, res)
});
 
/* 模板 */
// // 在这里挂载对应的路由
// router.get('/get', (req, res) => {
//   // 通过 req.query 获取客户端通过查询字符串，发送到服务器的数据
//   const query = req.query
//   // 调用 res.send() 方法，向客户端响应处理的结果
//   res.send({
//     status: 0, // 0 表示处理成功，1 表示处理失败
//     msg: 'GET 请求成功！', // 状态的描述
//     data: query, // 需要响应给客户端的数据
//   })
// })
 
// // 定义 POST 接口
// router.post('/post', (req, res) => {
//   // 通过 req.body 获取请求体中包含的 url-encoded 格式的数据
//   const body = req.body
//   // 调用 res.send() 方法，向客户端响应结果
//   res.send({
//     status: 0,
//     msg: 'POST 请求成功！',
//     data: body,
//   })
// })
 
// // 定义 DELETE 接口
// router.delete('/delete', (req, res) => {
//   res.send({
//     status: 0,
//     msg: 'DELETE请求成功',
//   })
// })
 
module.exports = router;