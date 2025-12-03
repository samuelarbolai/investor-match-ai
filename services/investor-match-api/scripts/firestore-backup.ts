import { spawnSync } from 'child_process';

const projectId = process.env.FIREBASE_PROJECT_ID;
if (!projectId) {
  console.error('FIREBASE_PROJECT_ID is required to run the backup.');
  process.exit(1);
}

const bucket = process.env.FIRESTORE_BACKUP_BUCKET || `${projectId}-firestore-backups`;
const prefix =
  process.env.FIRESTORE_BACKUP_PREFIX ||
  `firestore-backup-${new Date().toISOString().replace(/[:.]/g, '-')}`;
const destination = `gs://${bucket}/${prefix}`;

console.log(`Starting Firestore export to ${destination}`);

const result = spawnSync('gcloud', ['firestore', 'export', destination, '--project', projectId], {
  stdio: 'inherit'
});

if (result.error) {
  console.error('gcloud command failed', result.error);
  process.exit(1);
}

if (result.status !== 0) {
  console.error('Firestore export failed');
  process.exit(1);
}

console.log('Firestore export completed successfully.');
