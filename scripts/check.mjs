// Both marketplaces list the same plugins, and every plugin's manifest exists
// where its source points and carries the entry's name.
import fs from 'node:fs';

const read = (p) => JSON.parse(fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const claude = read('.claude-plugin/marketplace.json');
const codex = read('.agents/plugins/marketplace.json');
const errors = [];
const fail = (msg) => errors.push(msg);

if (claude.name !== codex.name) fail(`marketplace names differ: ${claude.name} / ${codex.name}`);
const names = (m) => m.plugins.map((p) => p.name).sort().join(', ');
if (names(claude) !== names(codex)) fail(`plugins differ: Claude Code [${names(claude)}], Codex [${names(codex)}]`);

/** The raw URL of a file in a git-subdir source on GitHub. */
function rawUrl(source, file) {
  const m = /^(?:https:\/\/github\.com\/)?([\w.-]+\/[\w.-]+?)(?:\.git)?$/.exec(source.url);
  if (!m) throw new Error(`not a GitHub repository: ${source.url}`);
  const dir = source.path.replace(/^\.\//, '').replace(/\/$/, '');
  return `https://raw.githubusercontent.com/${m[1]}/${source.sha ?? source.ref ?? 'HEAD'}/${dir}/${file}`;
}

async function checkManifest(entry, manifest, agent) {
  const { source } = entry;
  if (typeof source !== 'object' || source.source !== 'git-subdir') {
    fail(`${agent} ${entry.name}: expected a git-subdir source`);
    return;
  }
  const url = rawUrl(source, manifest);
  const res = await fetch(url);
  if (!res.ok) return fail(`${agent} ${entry.name}: ${url} → HTTP ${res.status}`);
  const plugin = await res.json();
  if (plugin.name !== entry.name) fail(`${agent} ${entry.name}: the manifest is named "${plugin.name}"`);
  console.log(`ok  ${agent.padEnd(11)} ${entry.name}@${plugin.version}  ${url}`);
}

for (const entry of claude.plugins) await checkManifest(entry, '.claude-plugin/plugin.json', 'Claude Code');
for (const entry of codex.plugins) {
  if (!entry.policy?.installation || !entry.policy?.authentication || !entry.category) fail(`Codex ${entry.name}: policy and category are required`);
  await checkManifest(entry, '.codex-plugin/plugin.json', 'Codex');
}

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
