# JanTcz marketplace

[![check](https://github.com/JanTcz/marketplace/actions/workflows/check.yml/badge.svg)](https://github.com/JanTcz/marketplace/actions/workflows/check.yml)

Plugins for coding agents, for **Claude Code** and **Codex** from one catalog.
Every plugin lives in its own repository; this one only lists them.

| Plugin | What it does | Repository |
|---|---|---|
| **microkanban** | A kanban board of Markdown files in your repository. The agent picks up a ticket, moves it through todo, doing, testing and done, ticks its acceptance criteria and writes down decisions. Skill + MCP server. | [JanTcz/cli-kanban](https://github.com/JanTcz/cli-kanban) |

## Install

### Claude Code

```
/plugin marketplace add JanTcz/marketplace
/plugin install microkanban@jantcz
```

or from a shell: `claude plugin marketplace add JanTcz/marketplace`, then
`claude plugin install microkanban@jantcz`.

### Codex

```bash
codex plugin marketplace add JanTcz/marketplace
```

then enable the plugin in the plugin list, or in `.codex/config.toml`:

```toml
[plugins."microkanban@jantcz"]
enabled = true
```

## Adding a plugin

1. The plugin's repository has a plugin folder with `.claude-plugin/plugin.json`
   and `.codex-plugin/plugin.json` (same `name` and `version`), its skills in
   `skills/<name>/SKILL.md` and MCP servers in `.mcp.json`.
2. Add an entry to both `.claude-plugin/marketplace.json` and
   `.agents/plugins/marketplace.json`, with a `git-subdir` source pointing at
   that folder. Codex wants `./` in front of the path and a `policy` and
   `category` on every entry.
3. `npm test` checks that both files list the same plugins and that each
   manifest exists where its source points, with the entry's name. CI runs it
   on every push and weekly.

```
.claude-plugin/marketplace.json   the catalog for Claude Code
.agents/plugins/marketplace.json  the catalog for Codex
scripts/check.mjs                 npm test
```

## License

[MIT](LICENSE). Each plugin has its own license in its repository.
