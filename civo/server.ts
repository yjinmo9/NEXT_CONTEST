import fs from 'fs';
import https from 'https';
import next from 'next';

const port = 3000;
const hostname = '0.0.0.0'; // 외부 접속 허용
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem'),
};

app.prepare().then(() => {
  https.createServer(httpsOptions, (req, res) => {
    handle(req, res);
  }).listen(port, hostname, () => {
    console.log(`> Ready on https://${hostname}:${port}`);
  });
});
