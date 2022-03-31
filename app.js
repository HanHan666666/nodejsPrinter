var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const fs = require('fs'); // 引入文件系统模块
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fileUpload = require('./routes/upload');
var getPrinter = require('./routes/getPrinter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/fileUpload', fileUpload);
app.use('/getPrinter', getPrinter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler                               
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

/**
 * 
 * 删除某一个包下面的需要符合格式的文件。
 * @param  {String} url  文件路径，绝对路径
 * @param  {String} name 需要删除的文件名称
 * @return {Null}   
 * @author huangh 20170123
 * @Url https://huanghui8030.github.io/node/delete.html
 */
function deleteFile(url, name) {
    var files = [];

    if (fs.existsSync(url)) { //判断给定的路径是否存在

        files = fs.readdirSync(url); //返回文件和子目录的数组

        files.forEach(function(file, index) {

            var curPath = path.join(url, file);

            if (fs.statSync(curPath).isDirectory()) { //同步读取文件夹文件，如果是文件夹，则函数回调
                deleteFile(curPath, name);
            } else {

                if (file.indexOf(name) > -1) { //是指定文件，则删除
                    fs.unlinkSync(curPath);
                    // console.log("删除文件：" + curPath);
                }
            }
        });
    } else {
        // console.log("给定的路径不存在！");
    }

}
/**
 * 每次启动删除临时文件目录下的所有文件
 */
deleteFile('./tmp/', '');

module.exports = app;