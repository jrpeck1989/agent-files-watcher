import { startServer } from '../server';

export async function serveCommand(options: { stdio?: boolean }) {
  await startServer(options);
}
