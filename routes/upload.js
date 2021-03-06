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
    dest: process.cwd() + '/tmp/'
}).any());

router.get('/', function(res, rep) {
    rep.send('文件上传接口');
    // rep.sendFile(__dirname + 'index4.ejs')

});


// 文件上传接口
router.post('/', function(req, res) {
    let printers = req.body.printerName;
    let paperType = req.body.paperType;
    let paperOrientation = req.body.paperDirection;

    //设置纸张页码范围
    let pageBegin = req.body.firstPageNumber;
    let pageEnd = req.body.secondPageNumber;
    if (pageBegin == "undefined" || pageEnd == "undefined") {
        var page = "";
    } else {
        var page = "-print-settings \"" + pageBegin + "-" + pageEnd + "\" ";
    }

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
        let exe = process.cwd() + "\\src\\SumatraPDF.exe ";

        //设置打印机名称
        let printTo = "-silent -print-to " + "\"" + printers + "\"" + " ";

        //设置纸张类型
        let printSetting = "-print-settings \"" + "paper=" + paperType + "," + paperOrientation + "\" ";
        let printCopies = "-print-settings " + copies + "x ";
        if (copies == "1") {
            printCopies = "";
        }


        //组合打印命令
        let comd = exe + printTo + printSetting + page + printCopies + filename;
        console.log(comd);
        //执行打印命令
        exec(comd)
    }
    res.send('上传成功\n');

})

module.exports = router;