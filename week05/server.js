const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('content-type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  // writeHead中的配置会与setHead中的对象进行合并，相同情况下
  // writeHead 的配置优先
  const result = 'ok'
  res.writeHead(200, {
    'content-type': 'text/plain',
    // 如果不设置content-length，相应为Transfer-Encoding:chunked;
    'content-length': Buffer.byteLength(result)
  }).end(result);
});

server.listen(5800, () => console.log('listen 5800'));
