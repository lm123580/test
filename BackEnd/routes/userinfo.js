var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');


// 导入写好的用户信息控制器
const {
    responseUserSimpleInfo,
    responseUserInfo,
    updateUserInfoBasic,
    updateUserAvatar,
} = require('../public/javascripts/userinfo')

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
 * POST 信息请求
 * @param uid 用户ID
 */
router.post('/simple', (req, res, next) => {
    // 回应用户简单信息请求
    responseUserSimpleInfo(req, res)
});

/**
 * POST 信息请求
 * @param uid 用户ID
 */
router.post('/response', (req, res, next) => {
    // 回应用户信息请求
    responseUserInfo(req, res)
});


router.post('/basic', (req, res, next) => {
    // 回应用户信息请求
    updateUserInfoBasic(req, res)
});

// 设置 multer 中间件
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uid = req.auth && req.auth.uid;
    const file_path = `public/src/user/${uid}/avatar`;
    // console.log(fs.existsSync(file_path))
    if (!fs.existsSync(file_path)) {
        fs.mkdirSync(file_path, { recursive: true });
    }
    cb(null, path.join(__dirname, `../${file_path}`)); // 存储到 avatars 文件夹
  },
  filename: function (req, file, cb) {
    // 以 uid重命名，防止重复
    const ext = path.extname(file.originalname);
    
    // 随机生成一串字符串，作为文件名
    const randomString = Math.random().toString(36).substring(2, 10);
    const filename = `${randomString}${ext}`;

    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

router.post('/avatar', upload.single('avatar'), (req, res, next) => {
    // 更新用户头像
    updateUserAvatar(req, res)
});

module.exports = router;
