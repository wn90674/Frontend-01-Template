# 每周总结可以写在这里
### BNF范式
BNF就是巴科特·瑙尔式的缩写，这位大师的其中一个成就就是发明了高级语言`FORTRAN`;
纪念他老人家，我们把他提出的这一套描述编程语言的方法叫做BNF;

BNF中的基本内容：
- 在双引号中的字("word")代表着这些字符本身。而double_quote用来代表双引号。
- 在双引号外的字（有可能有下划线）代表着语法部分。
- 尖括号( < > )内包含的为必选项。
- 方括号( [ ] )内包含的为可选项。
- 大括号( { } )内包含的为可重复0至无数次的项。
- 竖线( | )表示在其左右两边任选一项，相当于"OR"的意思。
- ::= 是"被定义为"的意思。

```
<Number> = "0" | "1" | "2" | ..... | "9"

<DecimalNumber> = "0" | (("1" | "2" | ..... | "9") <Number>* )

<PrimaryExpression> = <DecimalNumber> |
    "(" <LogicalExpression> ")"

<MultiplicativeExpression> = <PrimaryExpression> | 
    <MultiplicativeExpression> "*" <PrimaryExpression>| 
    <MultiplicativeExpression> "/" <PrimaryExpression>

<AdditiveExpression> = <MultiplicativeExpression> | 
    <AdditiveExpression> "+" <MultiplicativeExpression>| 
    <AdditiveExpression> "-" <MultiplicativeExpression>

<LogicalExpression> = <AdditiveExpression> | 
    <LogicalExpression> "||" <AdditiveExpression> | 
    <LogicalExpression> "&&" <AdditiveExpression>
```    

```
// [lua版本](https://www.bilibili.com/video/BV1Us411h72K?from=search&seid=17665706219357746407)
<syntax>          ::= <rule> | <rule> <syntax>
<rule>            ::= <opt-whitespace> "<" <rule-name> ">" <opt-whitespace> "::=" <opt-whitespace> <expression> <line-end>
<opt-whitespace>  ::= " " <opt-whitespace> | ""
<expression>      ::= <list> | <list> <opt-whitespace> "|" <opt-whitespace> <expression>
<line-end>        ::= <opt-whitespace> <EOL> | <line-end> <line-end>
<list>            ::= <term> | <term> <opt-whitespace> <list>
<term>            ::= <literal> | "<" <rule-name> ">"
<literal>         ::= '"' <text1> '"' | "'" <text2> "'"
<text1>           ::= "" | <character1> <text1>
<text2>           ::= "" | <character2> <text>
<character1>      ::= <character> | "'"
<character2>      ::= <character> | '"'
<character>       ::= <letter> | <digit> | <symbol>
<letter>          ::=  "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R"|"S"|"T"|"U"|"V"|"W"|"X"|"Y"|"Z"
<digit>           ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<symbol>          ::= "|"|" "|"~"|"!"|"@"|"#"|"$"|"%"|"&"|"("|")"|"*"|"+"|","|"-"|"."|":"|"/"|";"|"<"|">"|"?"
<rule-name>       ::= <letter> | <rule-name> <rule-char>
<rule-char>       ::= <letter> | <digit> | "-"
```

```
// [js版本](https://github.com/dhconnelly/prettybnf)
<empty> ::= "";

<space> ::= " " | "\n" | "\t";
<letter> ::= "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j"
           | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t"
           | "u" | "v" | "w" | "x" | "y" | "z"
           | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J"
           | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T"
           | "U" | "V" | "W" | "X" | "Y" | "Z";
<digit> ::= "0" | "1" | "2" | "3" | "4"
          | "5" | "6" | "7" | "8" | "9";
<delim> ::= "-" | "_" | "|" | ":" | "=" | ";" | " ";
<escaped> ::= "\\\"" | "\\n" | "\\t" | "\\\\";
<char> ::= <letter> | <digit> | <delim> | <escaped>;
<terminal_char> ::= <char> | "<" | ">";

<ws> ::= <space> <ws> | <empty>;
<text> ::= <char> <text> | <empty>;
<terminal_text> ::= <terminal_char> <terminal_text> | <empty>;
<term> ::= <terminal> | <nonterminal>;
<terminal> ::= "\"" <terminal_text> "\"";
<nonterminal> ::= "<" <text> ">";
<expression> ::= <term> <ws> <expression> | <term> <ws>;
<expressions> ::= <expression> "|" <ws> <expressions> | <expression>;
<production> ::= <nonterminal> <ws> "::=" <ws> <expressions> ";";
<grammar> ::= <production> <ws> <grammar> | <production> <ws>;
```

通过上面的两个案例可以看出，语法支持递归，所以也具备了图灵完备性；


### 字符编码规范
`UNICODE`与`ASCII`这两个概念经常容易搞混。
早期人们用 8 位二进制来编码英文字母(最前面的一位是 0)，也就是说，将英文字母和一些常用的字符和这128种二进制 0、1 串一一对应起来。
比如说 大写字母“A”所对应的二进制01000001，转换为十六进制为 41; 转换为十进制就是65:
```
String.fromCharCode(0b01000001)  => 'A'
String.fromCharCode(65)  => 'A'
String.fromCharCode(0x41) => 'A
```
但是随着语言的发展，不仅仅需要支持这128种字符，因此需要扩充这个范围，并保证每个字符都有唯一的数字编号，于是就出现了**Unicode**,这个编号范围从 0x000000 到 0x10FFFF (十六进制)，有 110 多万，每个字符都有一个唯一的 Unicode 编号，这个编号一般写成 16 进制，在前面加上 U+;使用时候可以直接使用转义+16进制，比如汉字的范围[/u4e00-/u9fa5]，其中`\u4E00`就是代表`一`;
> - 大多数情况下，都是不建议使用汉字作为`js`声明的变量，如果必须使用的话，就可以使用`let \u4E00 = 'a'`这种方式，其结果就等价于`ley 一 = 'a'`；
> - `fromCharCode`只能对不大于0xFFFF的码点才有效，如果我们要打印一个emoji表情，其Unicode编码是1f601，超出了FFFF，如果使用`fromCharCode`在控制台只能输入一个"";
 为了解决这个问题，ES6新增了一个`fromCodePoint`方法，使用后就可以打印出一个"😁"，且此方法还可以传入多个参数，结果会自动进行字符串拼接;
### js中的IEEE 754
源于一道很经典的面试题:"为何在js中 0.1+0.2!=0.3";
在浏览器中打印`0.1+0.2=0.30000000000000004`;
##### 原因分析
原来JavaScript采用 IEEE 754 标准双精度浮点（64），64位中 1位浮点数中符号，11存储指数，52位存储浮点数的有效数字;**一些小数在二进制中表示是无限的(类似除不尽的分数，得到的结果是无限循环小数，无法用有限的位数来表示)**，所以从53位开始就会舍入（舍入规则是0舍1入），这样就造成了“浮点精度问题”（由于舍入规则有时大点，有时小点）;
为此,ES6在Number对象上增加了一个极小误差Number.EPSILON，用来表示最小精度。最小精度的值为1与大于1最小的浮点数之差。
对于64位精度来说，大于1的最小浮点数位：1.000……0001，小数点后面有51个0，这个值减去1，为2^(-52)，所以Number.EPSILON=2^(-52)。在计算过程中，误差小于这个值的时候，可以认为不存在误差，因为已经超出了计算机的处理范围。
执行`0.1+0.2-0.3<Number.EPSILON`后结果为`true`

> 关于使用`typeArray`的分析实现，一些内存分配的概念，暂未明白，以后补充。

##### 解决方法
一般最常见的处理方式就是将小数扩大倍数，将其变为整数后，转换二进制时候不会出现误差，此时的计算就比较符合预期结果，然后在计算完成后，再将结果
缩小到原来的倍数，即：
`(0.1 * 10 + 0.2 * 10) / 10 === 0.3`
>需要注意的是js的数值不仅有最小误差精度丢失，超出一定的上限(`Number.MAX_SAFE_INTEGER`),此时也会有出现偏差的风险。尤其是在涉及金额方面的业务时候，
如果后台返回了一个long类型数据的接口, 在`JSON.parse`处理返回数据的时候，就会出现丢失精度，目前找到的解决方案有2个: 1、后台更改为string返回；2、使用第三方库或者自定义parser来替代`JSON.parse`；