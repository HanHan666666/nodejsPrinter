//文件上传路由
const express = require('express');
const router = express.Router();
const exec = require('child_process').exec;
const fs = require('fs');
const pathLib = require('path');
const process = require('process');



// 引入body-parser中间件，用来处理post请求体body中的数据
const bodyParser = require('body-parser')
    // 引入multer中间件，用于处理上传的文件数据
const multer = require('multer')



// 读取静态资源
router.use(express.static('public'));
// 通过配置multer的dest属性， 将文件储存在项目下的tmp文件中
router.use(multer({
    dest: process.cwd() + '/../tmp/'
}).any());

router.get('/', function(res, rep) {
    rep.send('文件上传接口');
    // rep.sendFile(__dirname + 'index4.ejs')

});


// 文件上传接口
router.post('/', function(req, res) {
    let printers = req.body.printers;
    let paperType = req.body.paperType;
    let paperOrientation = req.body.paperOrientation;
    let page = req.body.page;
    let copies = req.body.copies;
    for (let i = 0; i < req.files.length; i++) {
        console.log(req.files[i])
        let filename = req.files[i].destination + new Date().getTime() + pathLib.parse(req.files[i].originalname).ext;
        fs.rename(req.files[i].path, filename, function(err) {
            if (err) {
                res.send(err);
            } else {

            }
        })
        let exe = process.cwd() + "\\..\\src\\bin\\SumatraPDF.exe ";
        let printTo = "-print-to " + printers + " ";
        let printSetting = "-print-settings " + "paper=" + paperType + "," + paperOrientation + "," + page + " ";
        let printCopies = "-print-settings " + copies + "x ";

        //组合打印命令
        // let comd = __dirname + "\\..\\src\\bin\\SumatraPDF.exe " + "-print-to " + printers + " -print-settings " + paperType + " " + __dirname + "/" + filename;
        let comd = exe + printTo + printSetting + printCopies + filename;
        console.log(comd);
        //执行打印命令
        exec(comd)
    }
    res.send('上传成功\n');

})

module.exports = router;