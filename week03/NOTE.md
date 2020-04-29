# 每周总结可以写在这里
###`generator`生成器
它的特殊之处是普通函数只能返回一次，它却可以使用`yeild`关键字多次返回结果。它可以多次通过 .next() 迭代的对象，例如:
```js
let g = function* () {
  yield 1;
  yield 2;
  return 3; // 
}

const iter = g()
console.log(iter.next()) // => { value: 1, done: false }
console.log(iter.next()) // => { value: 2, done: false }
console.log(iter.next()) // => { value: 3, done: true }
console.log(iter.next()) // => { value: undefined, done: true }
``` 


### `Symbol`类型
`Symbol`类型创建的时候不需要使用`new`关键字，而是直接使用，它用来创建一个独一无二的值:
```js
const a = Symbol('0');
const b = Symbol('0');
a === b // => false
```

### 区分`+0`和`-0`;
```
function getZeroSign(num) {
  if(1/num=== +Infinity) {
     return 1
  }else if(1/num=== -Infinity){
   return -1
   }
}
```