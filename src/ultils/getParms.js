/**
 * 获取参数列表
 * @param {Array} arr 
 * @param {String} parmName 
 * @returns 
 */
function getParams(arr, parmName) {
  for (let i = 2; i < arr.length; i++) {
    let expression = arr[i];
    let expArr = expression.split('='); //分割等式左右的值
    if (expArr[0] === parmName) return expArr[1];
  }
}

module.exports = getParams;
