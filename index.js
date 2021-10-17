let getParams = require('./src/ultils/getParms');
let generate = require('./src/main/generateEq');
let paramsArr = process.argv;
let n = getParams(paramsArr, 'n'); // 获取生成的条数
let r = getParams(paramsArr, 'r'); // 获取数值的范围
// console.log(r);
generate(n, r);
