var app = require('koa')()
  , koa = require('koa-router')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror')
  , qiniu = require('qiniu')
  , config = require('./config.js');

var index = require('./routes/index');
var users = require('./routes/users');

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'ejs'
}));
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')(__dirname + '/public'));

// routes definition
koa.use('/', index.routes(), index.allowedMethods());
koa.use('/users', users.routes(), users.allowedMethods());

//用form表单上传
koa.get('/formUpload',function *(next){
  yield this.render('upload_form');
});

//异步上传
koa.get('/uploader',function *(next){
  yield this.render('uploader',{
    title:'异步上传',
    domain: config.Domain,
    uptoken_url: config.Uptoken_Url
  });
});

koa.get('/token',function *(next){
  //需要填写你的 Access Key 和 Secret Key
  qiniu.conf.ACCESS_KEY = config.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = config.SECRET_KEY;

  //获取请求的参数
  var requestParams = this.request.query;

  //要上传的空间
  bucket = 'pictures';

  //上传到七牛后保存的文件名
  key = requestParams.name;
  //生成上传 Token
  token = uptoken(bucket, key);

  //返回请求的结果
  yield this.body = {
    code:10000,
    data:{
      token:token
    }
  };
});


koa.get('/uptoken',function *(next){
//需要填写你的 Access Key 和 Secret Key
  qiniu.conf.ACCESS_KEY = config.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = config.SECRET_KEY;

  bucket = config.Bucket_Name;
  var token = uptoken(bucket);

  if(token){
    yield this.body = {
      uptoken : token
    };
    /*this.response.json({
      uptoken : token
    });*/
  }
});


// mount root routes
app.use(koa.routes());

app.on('error', function(err, ctx){
  logger.error('server error', err, ctx);
});


//构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
function uptoken(bucket) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket);
  // console.log(putPolicy.token());
  return putPolicy.token();
}

module.exports = app;
