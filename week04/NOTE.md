### 换行符`\n\r`
'\r'是回车，前者使光标到行首，（carriage return）
'\n'是换行，后者使光标下移一格，（line feed）
\r 是回车，return
\n 是换行，newline
对于换行这个动作，unix下一般只有一个0x0A表示换行("\n")，windows下一般都是0x0D和0x0A两个字符("\r\n")，苹果机(MAC OS系统)则采用回车符CR表示下一行(\r)
Unix系统里，每行结尾只有“<换行>”，即“\n”；

Windows系统里面，每行结尾是“<回车><换行>”，即“\r\n”；

Mac系统里，每行结尾是“<回车>”,即“\r”。

>在net模块使用`write`模拟客户端请求时候，如果没有使用正确的换行方式,将会出现`400 bad request`
