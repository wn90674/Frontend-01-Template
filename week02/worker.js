/**
 * https://www.debuggex.com/
 * 写一个正则表达式 匹配所有 Number 直接量
 * 关于直接量的概念，特意搜索了一下，有的也叫字面量(literals), 就是直接定义的值。
 * 举个数组的例子，我们可以直接声明 arr = [],也可以使用new Array()来创建，第一种属于字面量赋值
 * 本提有个特殊的地方就是，数字类型还会有2进制(0b)、8进制(0O)、16(0x)进制需要考虑在内，而不仅仅是常见的十进制；
 */

// 数字正则 0 | 十进制(含小数) | 二进制 | 八进制 | 十六进制
export const regNumber = /(^0$)|(^[1-9][0-9]*\.?[0-9]*$)|(^0b[0-1]+$)|(^0O[0-7]+$)|(^0x[0|1|2|3|4|5|6|7|8|9|A|B|C|D|E]+$)/i

// 字符串正则
export const regString = /^[a-z|\'|\"]+$/i

// utf-8 encode
export  function encodeUTF8(str) {
    let ret = '';
    for(const i of str) {
        const code = i.codePointAt(0);
            if(code < 128) {
                ret += i;
            } else if(code > 127 && code < 2048) {
                ret += String.fromCharCode((code >> 6) | 192, (code & 63) | 128);
            } else if(code > 2047 && code < 65536) {
                ret += String.fromCharCode((code >> 12) | 224, ((code >> 6) & 63) | 128, (code & 63) | 128);
            } else if(code > 65536 && code < 1114112) {
                ret += String.fromCharCode((code >> 18) | 240, ((code >> 12) & 63) | 128, ((code >> 6) & 63) | 128, (code & 63) | 128);
        }
    }
    return ret;
}