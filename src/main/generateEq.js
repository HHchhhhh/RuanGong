let getRandom = require('../ultils/getRandom');
const { operators } = require('../constant/constant');
let fs = require('fs');
let calculate = require('../ultils/calculate');
/**
 * 生成等式并写入json文件
 * @param {Number} n 生成题目的条数
 * @param {Number} r 每个数值的范围
 * @returns {null}
 */
function generate(n, r) {
  let exercises = []; // 作为参数到计算结果的练习题
  let answers = [];
  let data = []
  for (let i = 0; i < n; i++) {
    let expression = ifLogical(r, exercises); //判断表达式是否符合逻辑 如果符合逻辑，就返回一个表达式
    let answer = calculate(expression);
    // exercises.push({ key: i, expression });
    // answers.push({ key: i, answer });
    let ex = ''
    for(let j = 0; j < expression.length; j++) {
      if(expression[j] === '×') {
        ex += '*'
        continue
      }
      if(expression[j] === '÷') {
        ex += '/'
        continue
      }
      ex += expression[j]
    }
    let e = eval(ex)
    data.push({
      key: i + 1,
      expression,
      answer,
      eval: e,
    })
  }
  fs.writeFileSync('exercises.json', JSON.stringify(data));
}
module.exports = generate;

/**
 * 生成运算符数组：根据生成的随机数来随机选取其中一个操作符
 * @param {Number} n 需要生成的运算符个数
 * @returns {Array} 返回一个包含运算符的数组
 */
function getOperators(n) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    let random = getRandom(4);
    arr.push(operators[random]);
  }
  return arr;
}

/**
 * 根据传入的运算符数组 生成一条表达式
 * @param {Number} r 每个数值的范围 
 * @param {Array} opArr 运算符数组
 * @returns {String} 一个表达式字符串
 */
function generateEq(r, opArr) {
  // 等式
  let eq = ''; 
  let eqArr = [];
  // 生成随机数作为表达式中的数值
  let orginNum = getRandom(r);

  if (opArr.length === 0) {
    return;
  } else {
    eqArr.push(orginNum);
    for (let i = 0; i < opArr.length; i++) {
      eqArr.push(opArr[i]);
      if (opArr[i] === '÷') {
        // 如果除号前面的数字等于r-1 要重新生成 因为等于r-1的话没办法得到真分数
        while (eqArr[2 * i] === r - 1) {
          eqArr[2 * i] = getRandom(r);
        }
        let rightNum = ifDevision(eqArr, i, r);
        eqArr.push(rightNum);
      }
      // else if (opArr === '-') {
      //   let rightNum = ifSubtract(eqArr, i, r);
      //   eqArr.push(rightNum);
      // }
      else if(opArr[i] === '*') {
        while (eqArr[2 * i] === 1) {
          eqArr[2 * i] = getRandom(r);
        }
        let rightNum = getRandom(r)
        while(rightNum === 1) {
          rightNum = getRandom(r)
        }
        eqArr.push(rightNum)
      }
      else {
        let rightNum = getRandom(r);
        eqArr.push(rightNum);
      }
    }
  }
  return eqArr.join('');
}

/**
 * 如果操作符是除法，需要进行判断
 * @param {Array} eqArr 当前的表达式数组 
 * @param {Number} i 目前操作符的下标
 * @param {Number} r 数值的范围
 * @returns 
 */
function ifDevision(eqArr, i, r) {
  let flag = true;
  let rightNum = getRandom(r);
  // 需要替换的值在eqArr中的下标
  let index = i * 2; 
  while (flag) {
    if (rightNum === 0 || eqArr[index] >= rightNum || rightNum === 1) {
      rightNum = getRandom(r);
    } else {
      // 当满足之后，flag为false 跳出循环
      flag = false; 
    }
  }
  return rightNum;
}

//如果操作符是减法
function ifSubtract(eqArr, i, r) {
  let flag = true;
  let index = i * 2;
  // console.log(index);
  let rightNum = getRandom(r);
  while (flag) {
    if (rightNum > eqArr[index]) {
      // console.log(index);
      rightNum = getRandom(eqArr[index]);
    } else {
      flag = false;
    }
  }
  return rightNum;
}

// 判断生成的表达式是否合理(其实就是判断是否生成了负数，表达式是否相同) 如果合法，就将表达式返回
function ifLogical(r, exercises) {
  // 获取运算符个数
  let operatorNum = getRandom(4); 
  // 如果运算符个数为0 不符合条件 继续获取 operatorNum
  while (operatorNum === 0) {
    operatorNum = getRandom(4);
  }
  // 得到运算符数组
  let opArr = getOperators(operatorNum);
  // 生成运算表达式 
  let expression = generateEq(r, opArr);
  let flag = true;
  while (flag) {
    let newExp = expression.replace(/\÷/g, '/').replace(/\×/g, '*');
    let answer = eval(newExp);
    // console.log(answer);
    // console.log(newExp);
    // let answer = calculate(expression);
    // console.log(answer);
    if (answer < 0 || isCommon(exercises, expression)) {
      // if (answer < 0) {
      let operatorNum = getRandom(4);
      opArr = getOperators(operatorNum);
      expression = generateEq(r, opArr);
    } else {
      flag = false;
    }
  }
  return expression;
}

// 判断表达式是否相同
function isCommon(exercises, expression) {
  // console.log(exercises, expression);
  let answer = calculate(expression);
  let res = false;
  exercises.forEach((exercise) => {
    let exp = exercise.expression;
    let answer1 = calculate(exp);
    if (answer1 === answer) {
      // console.log(exp);
      // 判断答案是否相同，如果相同，判断运算符号是否相同
      if (isOperatorCommon(exp, expression)) {
        //如果操作符相同，继续判断数字是否相同
        if (isNumberCommon(exp, expression)) {
          res = true;
          return;
        }
      }
    }
  });
  // 如果进行循环后都没有返回true 就返回false
  return res;
}

// 判断数字是否相同
function isNumberCommon(exp1, exp2) {
  let expArr1 = Array.from(exp1);
  let expArr2 = Array.from(exp2);
  if (expArr1.length === expArr2.length) {
    //如果数组长度相同，则进行判断里面的字符是否一样
    let expNumArr1 = expArr2Num(expArr1);
    let expNumArr2 = expArr2Num(expArr2);
    for (let i = 0; i < expNumArr1.length; i++) {
      if (expNumArr2.indexOf(expNumArr1[i]) === -1) {
        //如果找不到 说明不一样
        return false;
      }
    }
    // 循环后都没有返回false 说明有找到 所以返回true
    return true;
  } else {
    return false;
  }
}

//通过表达式获取数字
function expArr2Num(expArr) {
  // console.log(expArr);
  let arr = [];
  for (let i = 0; i < (expArr.length + 1) / 2; i++) {
    arr.push(expArr[2 * i]);
  }
  // console.log(arr);
  return arr;
}

//判断操作符是否相同
function isOperatorCommon(exp1, exp2) {
  let expArr1 = Array.from(exp1);
  let expArr2 = Array.from(exp2);
  if (expArr1.length === expArr2.length) {
    // 如果两个表达式的长度相等，继续判断
    let opArr1 = exp2OpArr(expArr1);
    let opArr2 = exp2OpArr(expArr2);
    // console.log(opArr1, '表达式1的运算符数组');
    // console.log(opArr2, '表达式2的运算符数组');
    for (let i = 0; i < opArr1.length; i++) {
      //判断两个数组是否相同
      if (opArr2.indexOf(opArr1[i]) === -1) {
        return false;
      }
    }
    //如果经历了一次for循环 都能找到 则返回true
    return true;
  } else {
    return false;
  }
}
//将表达式截取出运算符数组并返回
function exp2OpArr(expArr) {
  let opArr = [];
  let i = 0;
  for (i = 2 * i + 1; i < expArr.length; i = 2 * i + 1) {
    opArr.push(expArr[i]);
  }
  // console.log(opArr);
  return opArr;
}