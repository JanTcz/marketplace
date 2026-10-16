# JanTcz marketplace

[![check](https://github.com/JanTcz/marketplace/actions/workflows/check.yml/badge.svg)](https://github.com/JanTcz/marketplace/actions/workflows/check.yml)

Plugins for coding agents, for **Claude Code** and **Codex** from one catalog.
Every plugin lives in its own repository; this one only lists them.

| Plugin | What it does | Repository |
|---|---|---|
| **cli-kanban** | A kanban board of Markdown files in your repository. The agent picks up a ticket, moves it through todo, doing, testing and done, ticks its acceptance criteria and writes down decisions. Skill + MCP server. | [JanTcz/cli-kanban](https://github.com/JanTcz/cli-kanban) |
| **cli-test-summary** | Runs the project's tests and answers with one JSON: counts and every failure with file, line and message, for node:test, vitest, jest, pytest, go, cargo and dotnet. Re-runs failures alone to tell real from flaky. Skill + MCP server. | [JanTcz/cli-test-summary](https://github.com/JanTcz/cli-test-summary) |
| **cli-transcriber** | Skills and agents written once as YAML, with shared partials (parameters, nesting). The build checks that every partial, skill, agent and tool a source uses exists and is declared, then writes the Markdown. Skill + a Claude Code hook that stops edits to generated files. | [JanTcz/cli-transcriber](https://github.com/JanTcz/cli-transcriber) |

## Install

### Claude Code

```
/plugin marketplace add JanTcz/marketplace
/plugin install cli-kanban@jantcz
/plugin install cli-test-summary@jantcz
/plugin install cli-transcriber@jantcz
```

or from a shell: `claude plugin marketplace add JanTcz/marketplace`, then
`claude plugin install <plugin>@jantcz`.

### Codex

```bash
codex plugin marketplace add JanTcz/marketplace
```

then enable the plugin in the plugin list, or in `.codex/config.toml`:

```toml
[plugins."cli-kanban@jantcz"]
enabled = true

[plugins."cli-test-summary@jantcz"]
enabled = true

[plugins."cli-transcriber@jantcz"]
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
