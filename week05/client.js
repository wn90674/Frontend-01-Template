/**
 * net模块创建客户端请求
 */
const net = require('net');

class Request {
  constructor(options) {
    this.method = options.method || 'GET';
    this.host = options.host || 'localhost';
    this.port = options.port || 80;
    this.path = options.path || '/';
    this.body = options.body || {};
    this.headers = options.headers || {};
    
    if(!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      this.bodyText = Object.keys(this.body).map(key=>`${key}=${encodeURIComponent(this.body[key])}`).join('&')
    }

    if(this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    }
    this.headers['Content-Length'] = Buffer.byteLength(this.bodyText)
  }

  toString() {
    return `
${this.method} ${this.path} HTTP/1.1
${Object.keys(this.headers).map(key=>`${key}: ${this.headers[key]}`).join('\r\n')}
\r
${this.bodyText}
    `
  }
  
  open() {

  }
  send() {

  }
}
const client = net.createConnection(
  {
    host: '127.0.0.1',  // 默认localhost
    port: 5800,
  },
  () => {
    // 'connect' listener.
    console.log('connected to server!');
    
    const request = new Request({
      method: 'POST',
      body:{
        id:1,
        name: 'test'
      } 
    })
    console.log(request.toString())
    // 内容需要顶头书写，否则报错，content-length的长度必须和传输的字符串字节数相同
    
//     client.write(`
// POST / HTTP/1.1
// Content-Type: application/x-www-form-urlencoded
// Content-Length: 14

// name=test&id=1`);
   client.write(request.toString())
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
