import { runBuild } from '../core/builder';

export function buildCommand() {
  console.error('Building agent context files...');
  runBuild().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
  });
}
