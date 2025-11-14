import http from 'http';
import { Server } from 'socket.io';
import { makeApp } from './app';
import { getConfig } from './config';
import { applyMigrations } from './database/migrate';
import { makeQueries } from './database/queries';
import { makeLogger } from './logger';
import { makeMiddleware } from './middleware';

async function main() {
  const config = getConfig();

  await applyMigrations(config.databaseUrl);
  const logger = makeLogger();
  const queries = makeQueries(config.databaseUrl);
  const middleware = makeMiddleware(logger);
  const app = makeApp({ queries, middleware });

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  let visitorCount = 0;

  io.on('connection', (socket) => {
    visitorCount++;
    io.emit('visitorCount', visitorCount);

    socket.on('disconnect', () => {
      visitorCount--;
      io.emit('visitorCount', visitorCount);
    });
  });

  server.listen(config.port, () => {
    logger.info(`Server is up on port ${config.port}`);
  });
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
