# koa_qiniu
koa作为后台服务器，上传文件到七牛网站上



### 文件目录结构
koa_qiniu
> bin

>> www

> public

>> images

>> javascripts

>> stylesheets

> routes

>> index.js

>> users.js

> views

>> error.ejs

>> index.ejs

>> upload_form.ejs

>> uploader.ejs

> README.md

> app.js

> config.js

> package.json



### 使用方法
```
> git clone git@github.com:ming25/koa_qiniu.git
> cd koa_qiniu

 # 修改config 配置
 1. 修改ACCESS_KEY值
 2. 修改SECRET_KEY值
 3. 修改Bucket_Name值
 4. 修改Uptoken_Url值
 5. 修改Domain值

> npm install
> npm start
```


### 访问
> `http://127.0.0.1:3000/uploader`




