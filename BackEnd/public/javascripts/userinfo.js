// 导入数据库操作模块
const db = require('../../db/index')



/**
 * POST 获取用户简单信息
 * @param uid 用户ID
 * 支持通过uid获取用户信息
 */
exports.responseUserSimpleInfo = (req, res) => {
    // 从请求体中获取uid
    const uid = req.body.uid
    if (!uid) return res.cc('缺少用户ID！')

    // 查询用户信息
    const sql = 'SELECT nickname, avatar FROM userinfo WHERE uid = ?'
    db.query(sql, [uid], (err, result) => {
        if (err) return res.cc(err)
        if (result.length !== 1) return res.cc('用户信息不存在！')
            
        res.send({
            status: 0,
            data: result[0],
            message: '获取用户信息成功！'
        })
    })
}


// 获取用户信息资源请求
/**
 * POST 获取用户信息
 * @param uid 用户ID
 * 支持通过uid获取用户信息
 */
exports.responseUserInfo = (req, res) => {
    // 从请求参数或token中获取uid
    const uid = req.auth.uid
    if (!uid) return res.cc('缺少用户ID！')

    // 查询用户信息
    const sql = 'SELECT * FROM userinfo WHERE uid = ?'
    db.query(sql, [uid], (err, result) => {
        if (err) return res.cc(err)
        if (result.length !== 1) return res.cc('用户信息不存在！')
            
        res.send({
            status: 0,
            data: result[0],
            message: '获取用户信息成功！'
        })
    })
}

/**
 * POST/PUT 更新用户信息
 * @param uid 用户ID
 * @param nickname 昵称
 * @param bio 个人简介
 * @param gender 性别
 * @param birthday 生日
 * @param occupation 职业
 * @param region 地区
 * @param school 学校
 */
exports.updateUserInfoBasic = (req, res) => {
    // 从token解析uid，防止越权
    const uid = req.auth && req.auth.uid
    if (!uid) return res.cc('用户未登录！')

    // 构造更新对象
    const updateData = { ...req.body }
    delete updateData.uid // 禁止直接修改uid

    // 更新用户信息
    const sql = 'UPDATE userinfo SET ? WHERE uid = ?'
    db.query(sql, [updateData, uid], (err, result) => {
        if (err) return res.cc(err)
        if (result.affectedRows !== 1) return res.cc('更新用户信息失败！')
        res.cc('更新用户信息成功！', 0)
    })
}

/**
 * POST/PUT 更新用户信息
 * @param avatar 用户头像地址
 */
exports.updateUserAvatar = (req, res) => {
  // 获取用户 id
  const uid = req.auth && req.auth.uid;
  if (!uid) return res.cc('用户未登录！')

  // 获取文件信息
  const file = req.file;
  if (!file) return res.cc('未上传文件！')

  // 构造文件 url
  const fileUrl = `/src/user/${uid}/avatar/${file.filename}`
//   console.log('fileUrl:', fileUrl)

  // 将 url 存入数据库
  const sql = 'UPDATE userinfo SET avatar = ? WHERE uid = ?'
  db.query(sql, [fileUrl, uid], (err, result) => {
    if (err) return res.cc(err)
    if (result.affectedRows !== 1) return res.cc('更新头像失败！')
    res.cc('上传头像成功！', 0, { avatarUrl: fileUrl })
  });
};
