
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