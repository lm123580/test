// 导入数据库操作模块
const db = require('../../db/index')
// 导入 bcryptjs 加密包
const bcrypt = require('bcryptjs')
// 导入生成Token的包
const jwt = require('jsonwebtoken')
// 导入全局配置文件（里面有token的密钥）
const config = require('../../config')
 
/**
 * POST 用户注册
 * @param account  用户账号
 * @param password  用户密码
 */
exports.regUser = (req, res) => {
	// 获取客户端提交到服务器的用户信息
	const userInfo = req.body
	
	// 判断是手机号还是邮箱
	let field
	if (/^\d+$/.test(userInfo.account)) {
		field = 'phone'
	} else {
		field = 'email'
	}
	
	// 从user表中查询手机号或邮箱是否已存在
  	const sql_f = `SELECT * FROM user WHERE ${field} = ?`

	db.query(sql_f, [userInfo.account], (error, result) => {
		if (error) {
			return res.cc(error)
		}
		if (result.length > 0) {
			return res.cc('该账号已存在，可直接登录！')
		}

		// 生成用户ID
		db.query('SELECT COUNT(*) AS total FROM user', (err, results) => {
			if (err) { console.log(err); return res.cc('注册用户失败！') }

			let n_uid = (results[0].total + 1).toString().padStart(7, '0')
			let n_account = userInfo.account
			let n_password = bcrypt.hashSync(userInfo.password, 10)

			// 定义插入新用户的 SQL 语句
			let sql_insert = 'INSERT INTO user SET ?'
			db.query(sql_insert, {
				uid: n_uid,
				[field]: n_account,
				password: n_password
			}, (error, result) => {
				if (error) return res.cc(error)
				if (result.affectedRows !== 1) return res.cc('注册用户失败！')

				// 注册成功，生成用户信息表
				db.query('INSERT INTO userinfo SET ?', {
					uid: n_uid,
					nickname: n_uid,    // 可设为默认值，如手机号/email或随机名
					avatar: '',         // 默认头像
					bio: '',
					gender: '',
					birthday: null,
					occupation: '',
					region: '',
					school: ''
				}, (error, result) => {
					if (error) return res.cc('创建用户信息表失败！')
					return res.cc('注册用户成功', 0, {
						useraccount: userInfo.account
					})
				})
			})
		})
	})
}
 
/**
 * POST 登录的回调函数
 * @param account  用户名
 * @param password  用户密码
 */
exports.login = (req, res) => {
	// 接收表单的数据
	const userInfo = req.body

	// 判断是手机号还是邮箱
	let field
	if (/^\d+$/.test(userInfo.account)) {
		field = 'phone'
	} else {
		field = 'email'
	}
	
	// 定义 SQL 语句
	const sql = `SELECT * FROM user WHERE ${field} = ?`

	// 执行 SQL 语句，根据用户名查询用户的信息
	db.query(sql, [userInfo.account], (err, result) => {
		// 执行 SQL 语句失败
		if (err) return res.cc(err)
		
		// 执行 SQL 语句成功,但是获取的数据条数不为1 也是失败的
		if (result.length !== 1) return res.cc('用户账号不存在！')
		// 经过上方俩条判断条件，则证明执行 SQL 成功
 
		// TODO ：判断密码是否正确
		const comRes = bcrypt.compareSync(userInfo.password, result[0].password)
		if (!comRes) return res.cc('密码输入错误，请重新输入！')
		
		// 获取uid
		const uid = result[0].uid
			// 在服务器端生成 Token 字符串
		const user = {
			uid: uid
		}
		// 对用户的信息进行加密，生成 token 字符串 
		const tokenStr = jwt.sign(user, config.jwtSecretKey, {
			expiresIn: config.expiresIn //tonken 有效期
		})
		// 调用 res.send 将Token响应给客户端
		res.send({
			status: 0,
			data: {
				token: 'Bearer ' + tokenStr,
			},
			message: '登录成功！！！',
		})
	})
}