// 导入数据库操作模块
const db = require('../../db/index')

/**
 * POST/PUT 更新用户信息
 * @param avatar 用户头像地址
 */
exports.addNote = (req, res) => {
  const uid = req.auth && req.auth.uid;
  if (!uid) return res.cc('用户未登录！');

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ status: 1, message: '标题和内容不能为空！' });
  }

  const files = req.files; // 数组
  if (!files || files.length === 0) {
    return res.status(400).json({ status: 1, message: '未上传图片！' });
  }

  // 查询 pubnotenum
  const getNumSql = 'SELECT pubnotenum FROM userinfo WHERE uid = ?';
  db.query(getNumSql, [uid], (err, results) => {
    if (err) return res.cc(err);
    if (!results || !results[0]) return res.cc('用户不存在！');
    const pubnotenum = results[0].pubnotenum || 0;

    // 插入游记表
    const insertNoteSql = 'INSERT INTO notes (uid, title, content) VALUES (?, ?, ?)';
    db.query(insertNoteSql, [uid, title, content], (err2, result) => {
      if (err2) return res.cc(err2);
      if (result.affectedRows !== 1) return res.cc('发布游记失败！');
      const nid = result.insertId;

      // 处理图片路径，和 pubnotenum 保持一致
      const imageUrls = files.map(file => {
        return `/src/user/${uid}/notes/${pubnotenum}/${file.filename}`;
      });

      // 批量插入图片表
      const insertImagesSql = 'INSERT INTO noteimages (nid, image_url) VALUES ?';
      const values = imageUrls.map(url => [nid, url]);
      db.query(insertImagesSql, [values], (err3, result3) => {
        if (err3) return res.cc(err3);

        //  pubnotenum + 1
        const updateNumSql = 'UPDATE userinfo SET pubnotenum = pubnotenum + 1 WHERE uid = ?';
        db.query(updateNumSql, [uid], (err4, result4) => {
          if (err4) return res.cc(err4);

          res.json({
            status: 0,
            message: '发布成功！',
            data: {
              nid: nid,
              imageUrls
            }
          });
        });
      });
    });
  });
};

exports.responseDetailedNotes = (req, res) => {
  const uid = req.auth && req.auth.uid;
  if (!uid) return res.cc('用户未登录！');

  const { nid } = req.body;
  // console.log('nid:', nid);
  if (!nid) {
    return res.status(400).json({ status: 1, message: '缺少游记ID！' });
  }

  // 查询游记详情
  const getNoteSql = 'SELECT * FROM notes WHERE nid = ?';
  db.query(getNoteSql, [nid], (err, results) => {
    if (err) return res.cc(err);
    if (!results || !results[0]) return res.cc('游记不存在！');

    const note = results[0];

    // 查询图片
    const getImagesSql = 'SELECT image_url FROM noteimages WHERE nid = ?';
    db.query(getImagesSql, [nid], (err2, results2) => {
      if (err2) return res.cc(err2);

      const images = results2.map(row => row.image_url);

      res.json({
        status: 0,
        message: '获取游记详情成功！',
        data: {
          ...note,
          images
        }
      });
    });
  });
}

exports.responseBriefNotes = (req, res) => {
    const { notenum } = req.body;
    if (!notenum) {
      return res.status(400).json({ status: 1, message: '缺少需要游记数量！' });
    }
    // 随机获取游记
  try {
    db.query(
      `
        SELECT 
          n.nid, n.title, 
          MIN(ni.image_url) AS image, 
          u.nickname, u.avatar,
          FLOOR(RAND() * 100) AS likes
        FROM 
          notes n
        JOIN 
          noteimages ni ON n.nid = ni.nid
        JOIN 
          userinfo u ON n.uid = u.uid
        GROUP BY n.nid
        ORDER BY RAND()
        LIMIT ?
      `,
      [Number(notenum)],
      function(err, rows) {
        if (err) {
          console.error(err);
          res.status(500).json({ status: 1, message: '服务器错误' });
          return;
        }
        res.status(200).json({ status: 0, data: rows });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 1, message: '服务器错误（同步）' });
  }
};


exports.responseSearchBriefNotes = (req, res) => {
  const { searchText } = req.body;
  if (!searchText) {
    return res.status(400).json({ status: 1, message: '搜索内容为空！' });
  }
  try {
    db.query(
      `
        SELECT 
          n.nid, n.title, 
          MIN(ni.image_url) AS image, 
          u.nickname, u.avatar,
          FLOOR(RAND() * 100) AS likes
        FROM 
          notes n
        JOIN 
          noteimages ni ON n.nid = ni.nid
        JOIN 
          userinfo u ON n.uid = u.uid
        WHERE
          n.title LIKE ?
        GROUP BY n.nid
        ORDER BY RAND()
      `,
      [`%${searchText}%`],
      function(err, rows) {
        if (err) {
          console.error(err);
          res.status(500).json({ status: 1, message: '服务器错误' });
          return;
        }
        res.status(200).json({ status: 0, data: rows });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 1, message: '服务器错误（同步）' });
  }
};