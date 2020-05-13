/**
 * net模块创建客户端请求
 */
const net = require('net');
const client = net.createConnection(
  {
    host: '127.0.0.1',  // 默认localhost
    port: 5800,
  },
  () => {
    // 'connect' listener.
    console.log('connected to server!');
    // 内容需要顶头书写，否则报错，content-length的长度必须和传输的字符串字节数相同
    client.write(`
POST / HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 14

name=测试&id=1`);
  },
);
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
client.on('error', (err) => {
  console.log('error', err);
  client.end();
});
