const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { once } = require('events');
const { createClient } = require('@supabase/supabase-js');

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function writeJson(filePath, value) {
  await fs.promises.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function exportSmallTable(client, table, directory) {
  const { data, error, count } = await client
    .from(table)
    .select('*', { count: 'exact' })
    .order('id', { ascending: true });
  if (error) throw error;
  await writeJson(path.join(directory, `${table}.json`), data || []);
  return count || 0;
}

async function exportLogs(client, directory) {
  const output = fs.createWriteStream(path.join(directory, 'http_logs.ndjson.gz'));
  const gzip = zlib.createGzip({ level: 9 });
  gzip.pipe(output);

  const pageSize = 1000;
  let from = 0;
  let total = 0;
  while (true) {
    const { data, error } = await client
      .from('http_logs')
      .select('*')
      .order('id', { ascending: true })
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const row of data) {
      if (!gzip.write(`${JSON.stringify(row)}\n`)) await once(gzip, 'drain');
    }
    total += data.length;
    from += data.length;
    if (data.length < pageSize) break;
  }

  gzip.end();
  await once(output, 'finish');
  return total;
}

async function main() {
  loadLocalEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Brak zmiennych Supabase w .env.local');

  const client = createClient(url, key, { auth: { persistSession: false } });
  const directory = path.join(process.cwd(), '.backups', `supabase-${stamp()}`);
  await fs.promises.mkdir(directory, { recursive: true });

  const counts = {};
  counts.cars = await exportSmallTable(client, 'cars', directory);
  counts.subscribers = await exportSmallTable(client, 'subscribers', directory);
  counts.http_logs = await exportLogs(client, directory);

  await writeJson(path.join(directory, 'manifest.json'), {
    created_at: new Date().toISOString(),
    counts,
    note: 'Storage files were not copied or modified.',
  });
  console.log(JSON.stringify({ directory, counts }, null, 2));
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
