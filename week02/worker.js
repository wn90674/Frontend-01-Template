/**
 * https://www.debuggex.com/
 * 写一个正则表达式 匹配所有 Number 直接量
 * 关于直接量的概念，特意搜索了一下，有的也叫字面量(literals), 就是直接定义的值。
 * 举个数组的例子，我们可以直接声明 arr = [],也可以使用new Array()来创建，第一种属于字面量赋值
 * 本提有个特殊的地方就是，数字类型还会有2进制(0b)、8进制(0O)、16(0x)进制需要考虑在内，而不仅仅是常见的十进制；
 */

// 数字正则 0 | 十进制(含小数) | 二进制 | 八进制 | 十六进制
export const regNumber = /(^0$)|(^[1-9][0-9]*\.?[0-9]*$)|(^0b[0-1]+$)|(^0O[0-7]+$)|(^0x[0|1|2|3|4|5|6|7|8|9|A|B|C|D|E]+$)/i;

// 字符串正则
export const regString = /^[a-z|\'|\"]+$/i;

// utf-8 encode
/**
 * 将字符串转为utf-8数组
 * @param {String} str
 * @returns Array
 */
export function encodeUTF8(str) {
  let ret = [];
  for (let i = 0; i < str.length; i++) {
    const _code = str.charCodeAt(i);
    // 补位处理
    const code = _code.toString(16).padStart(4, 0);

    ret.push(`\\u${code}`);
  }
  return ret;
}
