var express = require('express');
const exec = require('child_process').exec;
const fs = require('fs');
const pathLib = require('path');
var app = express();
// 引入body-parser中间件，用来处理post请求体body中的数据
const bodyParser = require('body-parser')
    // 引入multer中间件，用于处理上传的文件数据
const multer = require('multer')


const server = app.listen(3000, function() {
    console.log("http://localhost:3000");
    console.log('express + multer 实现文件上传')
})

app.get('/', function(res, rep) {
    // rep.send('Hello, word!6666666');
    rep.sendFile(__dirname + '/src/index.html')

});

// 读取静态资源
app.use(express.static('public'))
    // 通过配置multer的dest属性， 将文件储存在项目下的tmp文件中
app.use(multer({
    dest: 'tmp/'
}).any())

// 访问index.html页面
app.get('index.html', function(req, res) {
    // 将public下的index.html文件返回去
    res.sendFile(__dirname + '/src/index.html')
})

// 文件上传接口
app.post('/fileUpload', function(req, res) {
    for (let i = 0; i < req.files.length; i++) {
        console.log(req.files[i])
        let filename = req.files[i].destination + new Date().getTime() + pathLib.parse(req.files[i].originalname).ext;
        fs.rename(req.files[i].path, filename, function(err) {
                if (err) {
                    res.send(err)
                } else {

                }
            })
            // res.send('upload successfully')

        //组合打印命令
        // let comd = __dirname + "\\src\\bin\\SumatraPDF.exe " + "-print-to-default " + __dirname + "/" + filename;

        //执行打印命令
        // exec(comd)
    }
    res.send('上传成功')
        // res.send()

    /* 
    // 上传的文件在req.files中
    console.log(req.files[0].filename)
    console.log(new Date().getTime())

    //设置上传路径+时间戳命名+文件扩展名
    let filename = req.files[0].destination + new Date().getTime() + pathLib.parse(req.files[0].originalname).ext;

    // const filename = req.files[0].path + pathLib.parse(req.files[0].originalname).ext
    // req.files.filename = new Date().Format("yyyy-MM-dd HH:mm:ss")
    // var file = new Date().getTime();
    // filename = timestamp;
    console.log(filename);
    fs.rename(req.files[0].path, filename, function(err) {
        if (err) {
            res.send(err)
        } else {
            res.send('upload successfully')

            // res.send('index.js')
        }
    })
    console.log(req.files)
    console.log(__dirname)


    //组合打印命令
    let comd = __dirname + "\\src\\bin\\SumatraPDF.exe " + "-print-to-default " + __dirname + "/" + filename;
    console.log(comd)

    //执行打印命令
    // exec(comd)

    /*  //删除临时文件
     fs.unlinkSync(filename, function(err) {
         if (err) {
             console.log(err)
         }
     }) */

})