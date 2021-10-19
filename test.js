const profiler = require('v8-profiler-node8')
const fs = require('fs')

profiler.startProfiling('', true)

// https://www.speedscope.app/
setTimeout(function () {
    let getParams = require('./src/ultils/getParms');
    let generate = require('./src/main/generateEq');
    let paramsArr = process.argv;
    let n = getParams(paramsArr, 'n'); // 获取生成的条数
    let r = getParams(paramsArr, 'r'); // 获取数值的范围
    generate(n, r);
    profiler.stopProfiling('')
        .export()
        .pipe(fs.createWriteStream('res.json'))
}, 200)
