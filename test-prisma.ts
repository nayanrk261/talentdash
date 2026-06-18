import 'dotenv/config';

async function main() {
  const { prisma } = await import('./lib/db');
  const result = await prisma.$queryRaw`SELECT 1`;
  console.log('Success:', result);
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
