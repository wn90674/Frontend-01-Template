/**
 * 字符串匹配'abababx'
 * @param {str}} str 源字符串
 */
export function matchString(str:string) {
  let state = start;
  for(const v of str) {
    state = state(v)
  }

  return state === end
}

function start(s) {
  return s === 'a' ? findA : start
}

function end() {
  return end
}

function findA(s) {
  return s === 'b' ? findB : start
}

function findB(s) {
  return s === 'a' ? findAA : start
}

function findAA (s) {
  return s === 'b' ? findBB : start
}


function findBB (s) {
  return s === 'a' ? findAAA : start
}

function findAAA (s) {
  return s === 'b' ? findBBB : start
}

function findBBB (s) {
  return s === 'x' ? end : start
}

console.log(matchString('abcde'))