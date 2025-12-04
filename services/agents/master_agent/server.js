import express from 'express';
import { readFile } from 'node:fs/promises';
import messagesRouter from './routes/messages.js';
import conversationsRouter from './routes/conversations.js';
import inboundRouter from './routes/inbound.js';
import parserRouter from './routes/parser.js';
import 'dotenv/config';

const pkg = JSON.parse(
  await readFile(new URL('./package.json', import.meta.url), 'utf8')
);
const revision = process.env.K_REVISION || 'local';
const parserUrl = process.env.PARSER_URL;

if (process.env.NODE_ENV !== 'test' && !parserUrl) {
  throw new Error('PARSER_URL is required for master-agent startup');
}

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use((req, _res, next) => {
  console.log(`[master-agent] version=${pkg.version} revision=${revision} method=${req.method} url=${req.url}`);
  next();
});

app.use('/messages', messagesRouter);
app.use('/conversations', conversationsRouter);
app.use('/', inboundRouter);
app.use('/', parserRouter);
app.get('/health', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 8080;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(
      `master-agent listening on ${port} (version ${pkg.version}, revision ${revision}, parser_url=${parserUrl ? 'set' : 'missing'})`
    );
  });
}

export default app;
