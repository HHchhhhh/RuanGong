
function calculate(ex) {
    // let arr = ex.split(/\+|\-|\×|\÷/)
    let arr = []
    arr[0] = ''
    let j = 0
    for(let i = 0; i < ex.length; i++) {
        if(ex[i] === '×' || ex[i] === '÷' || ex[i] === '+' || ex[i] === '-') {
            j++
            arr[j] = ex[i]
            j++
            arr[j] = ''
        }else{
            arr[j] += ex[i]
        }
    }
    for(let i = 0; i < arr.length; i += 2) {
        arr[i] = [Number(arr[i]), 1]
    }
    let numStk = []
    let fStk = []
    for(let i = 0; i < arr.length; i++) {
        // console.log(arr[i])
        if(i % 2) {
            if(arr[i] === '×') {
                let pre = numStk.pop()
                let next = arr[i + 1]
                numStk.push([pre[0] * next[0], pre[1] * next[1]])
                i++
            }
            if(arr[i] === '÷') {
                let pre = numStk.pop()
                let next = arr[i + 1]
                numStk.push([pre[0] * next[1], pre[1] * next[0]])
                i++
            }
            if(arr[i] === '+' || arr[i] === '-') {
                fStk.push(arr[i])
            }
        }else{
            numStk.push(arr[i])
        }
    }
    while(fStk.length) {
        let f = fStk.pop()
        let next = numStk.pop()
        let pre = numStk.pop()
        if(f === '+') {
            numStk.push([
                pre[0] * next[1] + next[0] * pre[1], 
                pre[1] * next[1]
            ])
        }else{
            numStk.push([
                pre[0] * next[1] - next[0] * pre[1], 
                pre[1] * next[1]
            ])
        }
    }
    let res = numStk.pop()
    return yuefen(res[0], res[1])
}

module.exports = calculate

/**
 * 将假分数化成真分数并进行约分
 * @param {Number} top 
 * @param {Number} bot 
 * @returns 
 */
function yuefen(top, bot) {
    if(top / bot === Math.floor(top / bot)) {
        return '' + (top / bot) + ''
    }
    let s = ''
    if(top > bot) {
        s += Math.floor(top / bot)
        s += "'"
        top = top % bot
    }
    let divisor = countDivior(top, bot)
    s += (top / divisor) + '/' + (bot / divisor)
    return s
}


/**
 * 求最大公约数
 * @param  {...any} arr 
 * @returns 
 */
function countDivior(...arr) {
    let data = [].concat(...arr);
    const helperGcd = (x, y) => (!y ? x : countDivior(y, x % y));
    return data.reduce((a, b) => helperGcd(a, b));
  };
// function calculate(formula) {
//     // formula = formula.replace(/\-\-/g, '+')
//     let chengchu = false;
//     let jiajian = false;
//     if(formula.indexOf('×') > -1 || formula.indexOf('÷') > -1) {
//         chengchu = true;
//     }
//     if(formula.indexOf('+') > -1 || formula.indexOf('-') > -1) {
//         jiajian = true;
//     }
//     //既有乘除又有加减
//     if(chengchu && jiajian) {
//         //轮流找加减号
//         //每找到一个加减号切割成两个子公式
//         //每个子公式递归得出结果
//         let symbol = [...formula.matchAll(/\+|\-/g)];
//         console.log(symbol)
//         symbol = symbol[symbol.length - 1]
//         //拿到一个子公式
//         let firstFormula = formula.slice(0, symbol.index);
//         //拿到第二个子公式
//         let secondFormula = formula.slice(symbol.index + 1);
//         if(symbol[0] == '+') {
//             return calculate(`${calculate(firstFormula)}+${calculate(secondFormula)}`)
//         } else {
//             return calculate(`${calculate(firstFormula)}-${calculate(secondFormula)}`)
//         }
//     } else if(chengchu) {   //只有乘除
//         return chengchuCalculate(formula);
//     } else if(jiajian) {    //只有加减
//         return jiajianCalculate(formula)
//     } else {    //纯数字
//         return parseInt(formula);
//     }
// }


// module.exports = calculate;


// // 乘除法
// function chengchuCalculate(formula) {
//     let symbol;
//     let firstNum;
//     let secondNum;
//     let nextSymbol;
//     let result = parseInt(formula);
//     while(formula.length > 0) {
//         //先找出第一个运算符
//         symbol = formula.match(/\×|\÷/);
//         //拿到一个数字
//         firstNum = formula.slice(0, symbol.index);
//         //把第一个数组和第一个运算符从字符串中去掉
//         formula = formula.slice(symbol.index + 1);
//         //拿到第二个运算符
//         nextSymbol = formula.match(/\×|\÷/);
//         //如果第二个运算符存在，则拿到第二个数字进行运算并继续循环
//         if(nextSymbol) {
//             secondNum = formula.slice(0, nextSymbol.index);
//             formula = formula.slice(nextSymbol.index)
//             result = simpleChengchuCalculate(symbol[0], result, secondNum)
//         } else {    //如果后面没有运算符了则直接返回结果
//             result = simpleChengchuCalculate(symbol[0], result, formula);
//             formula = ''
//         }
//     }
//     //获取真分数
//     return (result + '').indexOf('/') > -1 ? getRealFenshu(result) : result;
// }

// //加减法
// function jiajianCalculate(formular) {
//     formular.replace(/\-\-/g, '+')
//     let symbol = formular.match(/\+|\-/);
//     let firstNum = formular.slice(0, symbol.index);
//     let secondNum = formular.slice(symbol.index + 1);
//     let firstFakeNum = getFakeFenshu(firstNum);
//     let secondFakeNum = getFakeFenshu(secondNum);
//     if(firstNum.indexOf('/') > -1 && secondNum.indexOf('/') > -1) {
//         let firstSon = firstFakeNum.slice(0, firstFakeNum.indexOf('/'));
//         let firstMum = firstFakeNum.slice(firstFakeNum.indexOf('/') + 1);
//         let secondSon = secondFakeNum.slice(0, secondFakeNum.indexOf('/'));
//         let secondMum = secondFakeNum.slice(secondFakeNum.indexOf('/') + 1);
//         let mum = firstMum * secondMum;
//         let son;
//         if(symbol[0] == '+') {
//             son = firstSon * secondMum + secondSon * firstMum; 
//         }  else {
//             son = firstSon * secondMum - secondSon * firstMum;
//         }
//         return getRealFenshu(`${son}/${mum}`);
//     } else if(firstNum.indexOf('/') > -1) {
//         let firstSon = firstFakeNum.slice(0, firstFakeNum.indexOf('/'));
//         let firstMum = firstFakeNum.slice(firstFakeNum.indexOf('/') + 1);
//         let son = parseInt(firstSon) + parseInt(secondNum * firstMum);
//         return getRealFenshu(`${son}/${firstMum}`);
//     } else if(secondNum.indexOf('/') > -1) {
//         let secondSon = secondFakeNum.slice(0, secondFakeNum.indexOf('/'));
//         let secondMum = secondFakeNum.slice(secondFakeNum.indexOf('/') + 1);
//         let son = parseInt(secondSon) + parseInt(firstNum * secondMum);
//         return getRealFenshu(`${son}/${secondMum}`);
//     } else {
//         return eval(formular);
//     }
// }


// //计算简单乘除法
// function simpleChengchuCalculate(symbol, firstNum, secondNum) {
//     firstNum = '' + firstNum
//     let result;
//     //两位数都是分数
//     if(firstNum.indexOf('/') > -1 && secondNum.indexOf('/') > -1) {
//         let firstSon = firstNum.slice(0, firstNum.indexOf('/'));    //第一个数的分子
//         let secondSon = secondNum.slice(0, secondNum.indexOf('/')); //第二个数的分子
//         let firstMum = firstNum.slice(firstNum.indexOf('/') + 1);         //第一个数的分母
//         let secondMum = secondNum.slice(secondNum.indexOf('/') + 1);    //第二个数的分母
//         if(symbol == '×') {
//             result = `${(firstSon * secondSon)}/${firstMum * secondMum}`;
//         } else {
//             result = `${firstSon * secondMum}/${firstMum * secondSon}`;
//         }
//     } else if(firstNum.indexOf('/') > -1) {     //只有第一位数是分数
//         let firstSon = firstNum.slice(0, firstNum.indexOf('/'));    //第一个数的分子
//         let firstMum = firstNum.slice(firstNum.indexOf('/') + 1);         //第一个数的分母
//         if(symbol == '×') {
//             let son = firstSon * secondNum;
//             result = `${son}/${firstMum}`;
//         } else {
//             let mum = firstMum * secondNum;
//             result = `${firstSon}/${mum}`
//         }
//     } else if(secondNum.indexOf('/') > -1) {    //只有第二位数是分数
//         let secondSon = secondNum.slice(0, secondNum.indexOf('/'));    //第二个数的分子
//         let secondMum = secondNum.slice(secondNum.indexOf('/') + 1);         //第二个数的分母
//         if(symbol == '×') {
//             let son = firstNum * secondSon;
//             result = `${son}/${secondMum}`;
//         } else {
//             let son = firstNum * secondMum;
//             result = `${son}/${secondSon}`;
//         }
//     } else {    //两位数都是整数
//         if(symbol == '×') {
//             result = firstNum * secondNum;
//         } else {
//             result = `${firstNum}/${secondNum}`
//         }
//     }
//     return result;
// }

// //转化为真分数
// function getRealFenshu(fenshu) {
//     if(fenshu.indexOf('-') > -1) return; //如果是负分数则直接返回
//     let son = parseInt(fenshu.slice(0, fenshu.indexOf('/')));     //分子
//     let mum = parseInt(fenshu.slice(fenshu.indexOf('/') + 1));    //分母
//     let result;
//     if(son > mum) {
//         let zheng = Math.floor(son/mum);
//         let zi = son - zheng * mum;
//         if(zi == 0) {
//             result = `${zheng}`
//         } else {
//             result = `${zheng}'${zi}/${mum}`   
//         }
//     } else {
//         result = `${son}/${mum}`
//     }
//     return result;
// }

// //转化为假分数
// function getFakeFenshu(fenshu) {
//     //如果是假分数
//     if(fenshu.indexOf("'") > -1) {
//         let firstSite = fenshu.indexOf("'");
//         let secondSite = fenshu.indexOf("/");
//         let zheng = fenshu.slice(0, firstSite);
//         let son = fenshu.slice(firstSite + 1, secondSite);
//         let mum = fenshu.slice(secondSite + 1);
//         let result = `${parseInt(zheng * mum) + parseInt(son)}/${mum}`
//         return result;
//     }
//     return fenshu;
// }