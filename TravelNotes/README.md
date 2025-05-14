
重要文件说明 
├─app                       ----  前端页面放置目录  
│  │  +not-found.tsx  
│  │  _layout.tsx  
│  │  
│  ├─(auth)                  ---  登陆/注册身份验证页面  
│  │      login.tsx          ---  登陆页面  
│  │      register.tsx       ---  注册页面
│  │      _layout.tsx  
│  │  
│  ├─(notes)                 ---  和游记发布有关的页面  
│  │      add.tsx            ---  增加游记  
│  │      comment.tsx        ---  底部评论栏  
│  │      detail.tsx         ---  游记详情页面  
│  │      imagegaller.tsx    ---  游记详情页面的图像展示  
│  │      searchbar.tsx      ---  游记搜索栏  
│  │      _layout.tsx
│  │
│  ├─(person)                ---  个人信息展示有关页面  
│  │      editavaster.tsx    ---  修改头像的对话框  
│  │      editinfo.tsx       ---  修改个人信息页面  
│  │      login.tsx          ---  无token信息时，即未登陆时的个人页面  
│  │      profile.tsx        ---  详细个人信息预览页面  
│  │      _layout.tsx  
│  │  
│  └─(tabs)  
│          add.tsx           ---  发布游记空页面  
│          index.tsx         ---  首页  
│          profile.tsx       ---  个人页面
│          _layout.tsx  
|  
├─lib
│      config.js             ---  局域网内后端ip  
│      notes.ts              ---  游记相关与后端交互  
│      userAuth.ts           ---  用户登陆验证  
│      userInfo.ts           ---  用户个人信息  
│  
└─scripts  
        reset-project.js  
