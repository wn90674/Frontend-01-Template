/**
 * 暂无好的思路针对 相邻选择器 以及 伪类选择器 进行处理
 */

/**
 * id/class可以赋值多个，用数组存储
 * attrs暂时按照单赋值处理，直接使用字符串存储
 */
interface DOMAtrributes {
  tag?: string;
  id?: string[];
  class?: string[];
  [key: string]: string | string[];
}
/**
 * 每个单元规则的处理 div#content.cl1.cl-2.cl_3
 * @param {String} selector selector rules
 * @param {HTMLElement} element DOM
 * @returns {DOMAtrributes} 规则列表
 */
export function transUnitRules(selector: string): DOMAtrributes {
  const ruleList = selector.match(/([\.|#|\[]?[0-9|a-zA-Z|=|\-|_|\'|\"]+]?)/g);

  let ret: DOMAtrributes = {};
  for (const rule of ruleList) {
    if (rule.includes('#')) {
      if (!ret.id) {
        ret.id = [];
      }
      ret.id.push(rule.slice(1));
    } else if (rule.includes('.')) {
      if (!ret.class) {
        ret.class = [];
      }
      ret.class.push(rule.slice(1));
    } else if (rule.includes('=')) {
      const attrList = rule.slice(1, -1).split('=');
      // 去除引号
      ret[attrList[0]] = attrList[1].replace(/\"|\'/g, '');
    } else {
      ret.tag = rule.toUpperCase();
    }
  }

  return ret;
}

/**
 * 通过dom.attributes 检测当前元素的匹配性
 * @param domAttrs dom.attributes
 * @param dom
 */
function isMatchDom(domAttrs, dom: Element) {
  if (dom.parentElement === null) {
    return false;
  }

  const elAttrs: NamedNodeMap = dom.attributes;
  for (const key in domAttrs) {
    if (key === 'tag') {
      // tag不匹配
      if (domAttrs[key] !== dom.nodeName) {
        return isMatchDom(domAttrs, dom.parentElement);
      }
    } else {
      if (!elAttrs.getNamedItem(key)) {
        // 无对应的key，递归向上级查找
        return isMatchDom(domAttrs, dom.parentElement);
      } else {
        const { nodeValue } = elAttrs.getNamedItem(key);
        if (key === 'id' || key === 'class') {
          // selector中的class/id 有不在 class 的nodevalue中的项
          if (
            domAttrs[key].some((v) => nodeValue.split(/\s/).indexOf(v) === -1)
          ) {
            // key对应值不匹配递归向上级查找
            return isMatchDom(domAttrs, dom.parentElement);
          }
        } else if (nodeValue !== domAttrs[key]) {
          return isMatchDom(domAttrs, dom.parentElement);
        }
      }
    }
  }

  return true;
}

/**
 * 将选择器规则分解
 * @param selectors 选择器规则 div#app>div.cl.cl-2.cl_3[name=aaa][age="bbb"]
 * @returns {Array}
 */
export function match(selectors: string, dom: Element) {
  const selectorList = selectors.split(/\s|\>/g).filter((s) => !!s); // 过滤空字符串
  let { length } = selectorList;
  while (length--) {
    if (!isMatchDom(transUnitRules(selectorList[length]), dom)) {
      return false;
    }
    // 存在匹配后校验父级元素
    dom = dom.parentElement;
  }
  return true;
}

// https://www.w3.org/TR/?tag=css
// match('body#www-w3-org.w3c_public.w3c_javascript.w3c_handheld #w3c_container div.hierarchy.tMargin .container>#filters[method=get] fieldset input[name=title][type="text"]', document.querySelectorAll('#filters input#title')[0])
