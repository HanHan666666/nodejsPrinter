var express = require('express');
var router = express.Router();

var regedit = require('regedit');

var printer = require('printer');

// console.log(printer.getPrinters());

// console.log("666 = " + printer.getDefaultPrinterName());

/* GET home page. */
router.get('/', function(req, res, next) {

    res.send(printer.getPrinters());

});

module.exports = router;