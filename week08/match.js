"use strict";
/**
 * 暂无好的思路针对 相邻选择器 以及 伪类选择器 进行处理
 */
// exports.__esModule = true;
/**
 * 每个单元规则的处理 div#content.cl1.cl-2.cl_3
 * @param {String} selector selector rules
 * @param {HTMLElement} element DOM
 * @returns {DOMAtrributes} 规则列表
 */
function transUnitRules(selector) {
    var ruleList = selector.match(/([\.|#|\[]?[0-9|a-zA-Z|=|\-|_|\'|\"]+]?)/g);
    var ret = {};
    for (var _i = 0, ruleList_1 = ruleList; _i < ruleList_1.length; _i++) {
        var rule = ruleList_1[_i];
        if (rule.includes('#')) {
            if (!ret.id) {
                ret.id = [];
            }
            ret.id.push(rule.slice(1));
        }
        else if (rule.includes('.')) {
            if (!ret["class"]) {
                ret["class"] = [];
            }
            ret["class"].push(rule.slice(1));
        }
        else if (rule.includes('=')) {
            var attrList = rule.slice(1, -1).split('=');
            // 去除引号
            ret[attrList[0]] = attrList[1].replace(/\"|\'/g, '');
        }
        else {
            ret.tag = rule.toUpperCase();
        }
    }
    return ret;
}
// exports.transUnitRules = transUnitRules;
/**
 * 通过dom.attributes 检测当前元素的匹配性
 * @param domAttrs dom.attributes
 * @param dom
 */
function isMatchDom(domAttrs, dom) {
    if (dom.parentElement === null) {
        return false;
    }
    var elAttrs = dom.attributes;
    var _loop_1 = function (key) {
        if (key === 'tag') {
            // tag不匹配
            if (domAttrs[key] !== dom.nodeName) {
                return { value: isMatchDom(domAttrs, dom.parentElement) };
            }
        }
        else {
            if (!elAttrs.getNamedItem(key)) {
                return { value: isMatchDom(domAttrs, dom.parentElement) };
            }
            else {
                var nodeValue_1 = elAttrs.getNamedItem(key).nodeValue;
                if (key === 'id' || key === 'class') {
                    // selector中的class/id 有不在 class 的nodevalue中的项
                    if (domAttrs[key].some(function (v) { return nodeValue_1.split(/\s/).indexOf(v) === -1; })) {
                        return { value: isMatchDom(domAttrs, dom.parentElement) };
                    }
                }
                else if (nodeValue_1 !== domAttrs[key]) {
                    return { value: isMatchDom(domAttrs, dom.parentElement) };
                }
            }
        }
    };
    for (var key in domAttrs) {
        var state_1 = _loop_1(key);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return true;
}
/**
 * 将选择器规则分解
 * @param selectors 选择器规则 div#app>div.cl.cl-2.cl_3[name=aaa][age="bbb"]
 * @returns {Array}
 */
function match(selectors, dom) {
    var selectorList = selectors.split(/\s|\>/g).filter(function (s) { return !!s; }); // 过滤空字符串
    var length = selectorList.length;
    while (length--) {
        if (!isMatchDom(transUnitRules(selectorList[length]), dom)) {
            return false;
        }
        // 存在匹配后校验父级元素
        dom = dom.parentElement;
    }
    return true;
}
// exports.match = match;

// https://www.w3.org/TR/?tag=css
// match('body#www-w3-org.w3c_public.w3c_javascript.w3c_handheld #w3c_container div.hierarchy.tMargin .container>#filters[method=get] fieldset input[name=title][type="text"]', document.querySelectorAll('#filters input#title')[0])
