// Optional Render Node web-service entrypoint. A Render Static Site needs no server.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.png':'image/png', '.woff2':'font/woff2', '.woff':'font/woff' };
createServer(async (req,res) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(process.env.RENDER === 'true')res.setHeader('Strict-Transport-Security','max-age=31536000');
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file = resolve(root,'.'+pathname);
    if(file !== root && !file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
    if(pathname.endsWith('/'))file=resolve(file,'index.html');
    try { if(!(await stat(file)).isFile())throw new Error('not a file'); }
    catch {res.writeHead(404);res.end('Not found');return;}
    const data=await readFile(file);
    res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':pathname.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache'});
    res.end(req.method==='HEAD'?undefined:data);
  }catch{res.writeHead(400);res.end('Bad request');}
}).listen(Number(process.env.PORT)||3000,'0.0.0.0');
