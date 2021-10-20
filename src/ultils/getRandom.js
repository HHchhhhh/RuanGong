/**
 * 定义随机数的范围
 * @param {Number} number 
 * @returns 
 */
function getRandom(number) {
  let num = Math.floor(Math.random() * number);
  while(num === 0) {
    num = Math.floor(Math.random() * number);
  }
  return num
}
module.exports = getRandom;
