var db = require('../db'); 
var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');

// 导入写好的用户信息控制器
const {
    responseBriefNotes,
    responseSearchBriefNotes,
    responseDetailedNotes,
    addNote,
} = require('../public/javascripts/notes')

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


// 设置 multer 中间件

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const uid = req.auth && req.auth.uid;
      if (!uid) return cb(new Error('用户未登录'), null);

      // 查询 userinfo 表中的 pubnotenum 字段
      const sql = 'SELECT pubnotenum FROM userinfo WHERE uid = ?';
      db.query(sql, [uid], (err, results) => {
        if (err) return cb(err, null);
        if (!results || !results[0]) return cb(new Error('用户不存在'), null);

        const pubnotenum = results[0].pubnotenum;
        const file_path = `public/src/user/${uid}/notes/${pubnotenum}`;
        if (!fs.existsSync(file_path)) {
          fs.mkdirSync(file_path, { recursive: true });
        }
        cb(null, path.join(__dirname, `../${file_path}`));
      });
    } catch (e) {
      cb(e, null);
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const randomString = Math.random().toString(36).substring(2, 10);
    const filename = `${randomString}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage: storage });

/**
 * POST/PUT 更新游记信息
 * @param avatar 用户头像地址
 */
router.post('/addNote', upload.array('images'), (req, res) => {
    // 更新用户头像
    addNote(req, res)
});

router.post('/getNoteDetail', (req, res) => {
    // 获取游记详情
    responseDetailedNotes(req, res)
});

router.post('/getBriefNotes', (req, res) => {
    // 获取游记列表
    responseBriefNotes(req, res)
});

router.post('/getSearchBriefNotes', (req, res) => {
    // 搜索游记列表
    responseSearchBriefNotes(req, res)
});

module.exports = router;