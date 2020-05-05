type Radix =
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36;

type Dot = '.';

/**
 * 字符串转number类型(模拟parseFloat)
 * @param str {String} 字符串
 * @param radix {Radix} 进制
 * @returns {Number}
 */

export function convertStringToNumber(str: string, radix: Radix = 10) {
  const mapStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let i = str.length - 1;

  let total = 0;
  const dotIndex = str.indexOf('.');

  while (i >= 0) {
    if (i !== dotIndex) {
      let exp = 0;
      if (dotIndex >= 0) {
        exp = i < dotIndex ? dotIndex - i - 1 : dotIndex - i;
      } else {
        exp = str.length - i - 1;
      }

      const cur =
        mapStr.indexOf(str[i]) || mapStr.indexOf(str[i].toUpperCase());
      if (cur >= radix || cur === -1) {
        //  该进制下不可能存在的数值
        return NaN;
      }

      total += cur * radix ** exp;
    }
    i--;
  }

  return total;
}

/**
 * 数字转字符串
 * @param num {Number} 数字
 * @param radix {Radix} 进制
 * @param precision {number} 小数位有效精度
 * @returns {String}
 */
export function convertNumberToString(
  num: number,
  radix: Radix = 10,
  precision = 54,
) {
  const mapStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let ret: Array<number | Dot> = [];

  let int = Math.floor(num);
  let fraction = num - int;

  // 处理整数部分
  while (int >= radix) {
    let temp = int % radix;
    ret.unshift(temp);
    int = Math.floor(int - temp) / radix;
  }

  ret.unshift(int % radix);

  if (fraction !== 0) {
    // 存在小数位
    ret.push('.');

    let exp = 0;
    // 当前进制下最小的数值为 radix**-54
    while (fraction >= radix ** -55) {
      exp--;
      let temp = Math.floor(fraction / radix ** exp);
      ret.push(temp);
      fraction = fraction - temp * radix ** exp;
    }
  }

  return ret.map((v) => (v === '.' ? '.' : mapStr[v])).join('');
}
