# Task Master AI - Agent Integration Guide

## Essential Commands

### Core Workflow Commands

```bash
# Project Setup
task-master init                                    # Initialize Task Master in current project
task-master parse-prd .taskmaster/docs/prd.txt      # Generate tasks from PRD document
task-master models --setup                        # Configure AI models interactively

# Daily Development Workflow
task-master list                                   # Show all tasks with status
task-master next                                   # Get next available task to work on
task-master show <id>                             # View detailed task information (e.g., task-master show 1.2)
task-master set-status --id=<id> --status=done    # Mark task complete

# Task Management
task-master add-task --prompt="description" --research        # Add new task with AI assistance
task-master expand --id=<id> --research --force              # Break task into subtasks
task-master update-task --id=<id> --prompt="changes"         # Update specific task
task-master update --from=<id> --prompt="changes"            # Update multiple tasks from ID onwards
task-master update-subtask --id=<id> --prompt="notes"        # Add implementation notes to subtask

# Analysis & Planning
task-master analyze-complexity --research          # Analyze task complexity
task-master complexity-report                      # View complexity analysis
task-master expand --all --research               # Expand all eligible tasks

# Dependencies & Organization
task-master add-dependency --id=<id> --depends-on=<id>       # Add task dependency
task-master move --from=<id> --to=<id>                       # Reorganize task hierarchy
task-master validate-dependencies                            # Check for dependency issues
task-master generate                                         # Update task markdown files (usually auto-called)
```

## Key Files & Project Structure

### Core Files

- `.taskmaster/tasks/tasks.json` - Main task data file (auto-managed)
- `.taskmaster/config.json` - AI model configuration (use `task-master models` to modify)
- `.taskmaster/docs/prd.txt` - Product Requirements Document for parsing
- `.taskmaster/tasks/*.txt` - Individual task files (auto-generated from tasks.json)
- `.env` - API keys for CLI usage

### Claude Code Integration Files

- `CLAUDE.md` - Auto-loaded context for Claude Code (this file)
- `.claude/settings.json` - Claude Code tool allowlist and preferences
- `.claude/commands/` - Custom slash commands for repeated workflows
- `.mcp.json` - MCP server configuration (project-specific)

### Directory Structure

```
project/
├── .taskmaster/
│   ├── tasks/              # Task files directory
│   │   ├── tasks.json      # Main task database
│   │   ├── task-1.md      # Individual task files
│   │   └── task-2.md
│   ├── docs/              # Documentation directory
│   │   ├── prd.txt        # Product requirements
│   ├── reports/           # Analysis reports directory
│   │   └── task-complexity-report.json
│   ├── templates/         # Template files
│   │   └── example_prd.txt  # Example PRD template
│   └── config.json        # AI models & settings
├── .claude/
│   ├── settings.json      # Claude Code configuration
│   └── commands/         # Custom slash commands
├── .env                  # API keys
├── .mcp.json            # MCP configuration
└── CLAUDE.md            # This file - auto-loaded by Claude Code
```

## MCP Integration

Task Master provides an MCP server that Claude Code can connect to. Configure in `.mcp.json`:

```json
{
  "mcpServers": {
    "task-master-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "your_key_here",
        "PERPLEXITY_API_KEY": "your_key_here",
        "OPENAI_API_KEY": "OPENAI_API_KEY_HERE",
        "GOOGLE_API_KEY": "GOOGLE_API_KEY_HERE",
        "XAI_API_KEY": "XAI_API_KEY_HERE",
        "OPENROUTER_API_KEY": "OPENROUTER_API_KEY_HERE",
        "MISTRAL_API_KEY": "MISTRAL_API_KEY_HERE",
        "AZURE_OPENAI_API_KEY": "AZURE_OPENAI_API_KEY_HERE",
        "OLLAMA_API_KEY": "OLLAMA_API_KEY_HERE"
      }
    }
  }
}
```

### Essential MCP Tools

```javascript
help; // = shows available taskmaster commands
// Project setup
initialize_project; // = task-master init
parse_prd; // = task-master parse-prd

// Daily workflow
get_tasks; // = task-master list
next_task; // = task-master next
get_task; // = task-master show <id>
set_task_status; // = task-master set-status

// Task management
add_task; // = task-master add-task
expand_task; // = task-master expand
update_task; // = task-master update-task
update_subtask; // = task-master update-subtask
update; // = task-master update

// Analysis
analyze_project_complexity; // = task-master analyze-complexity
complexity_report; // = task-master complexity-report
```

## Claude Code Workflow Integration

### Standard Development Workflow

#### 1. Project Initialization

```bash
# Initialize Task Master
task-master init

# Create or obtain PRD, then parse it
task-master parse-prd .taskmaster/docs/prd.txt

# Analyze complexity and expand tasks
task-master analyze-complexity --research
task-master expand --all --research
```

If tasks already exist, another PRD can be parsed (with new information only!) using parse-prd with --append flag. This will add the generated tasks to the existing list of tasks..

#### 2. Daily Development Loop

```bash
# Start each session
task-master next                           # Find next available task
task-master show <id>                     # Review task details

# During implementation, check in code context into the tasks and subtasks
task-master update-subtask --id=<id> --prompt="implementation notes..."

# Complete tasks
task-master set-status --id=<id> --status=done
```

#### 3. Multi-Claude Workflows

For complex projects, use multiple Claude Code sessions:

```bash
# Terminal 1: Main implementation
cd project && claude

# Terminal 2: Testing and validation
cd project-test-worktree && claude

# Terminal 3: Documentation updates
cd project-docs-worktree && claude
```

### Custom Slash Commands

Create `.claude/commands/taskmaster-next.md`:

```markdown
Find the next available Task Master task and show its details.

Steps:

1. Run `task-master next` to get the next task
2. If a task is available, run `task-master show <id>` for full details
3. Provide a summary of what needs to be implemented
4. Suggest the first implementation step
```

Create `.claude/commands/taskmaster-complete.md`:

```markdown
Complete a Task Master task: $ARGUMENTS

Steps:

1. Review the current task with `task-master show $ARGUMENTS`
2. Verify all implementation is complete
3. Run any tests related to this task
4. Mark as complete: `task-master set-status --id=$ARGUMENTS --status=done`
5. Show the next available task with `task-master next`
```

## Tool Allowlist Recommendations

Add to `.claude/settings.json`:

```json
{
  "allowedTools": [
    "Edit",
    "Bash(task-master *)",
    "Bash(git commit:*)",
    "Bash(git add:*)",
    "Bash(npm run *)",
    "mcp__task_master_ai__*"
  ]
}
```

## Configuration & Setup

### API Keys Required

At least **one** of these API keys must be configured:

- `ANTHROPIC_API_KEY` (Claude models) - **Recommended**
- `PERPLEXITY_API_KEY` (Research features) - **Highly recommended**
- `OPENAI_API_KEY` (GPT models)
- `GOOGLE_API_KEY` (Gemini models)
- `MISTRAL_API_KEY` (Mistral models)
- `OPENROUTER_API_KEY` (Multiple models)
- `XAI_API_KEY` (Grok models)

An API key is required for any provider used across any of the 3 roles defined in the `models` command.

### Model Configuration

```bash
# Interactive setup (recommended)
task-master models --setup

# Set specific models
task-master models --set-main claude-3-5-sonnet-20241022
task-master models --set-research perplexity-llama-3.1-sonar-large-128k-online
task-master models --set-fallback gpt-4o-mini
```

## Task Structure & IDs

### Task ID Format

- Main tasks: `1`, `2`, `3`, etc.
- Subtasks: `1.1`, `1.2`, `2.1`, etc.
- Sub-subtasks: `1.1.1`, `1.1.2`, etc.

### Task Status Values

- `pending` - Ready to work on
- `in-progress` - Currently being worked on
- `done` - Completed and verified
- `deferred` - Postponed
- `cancelled` - No longer needed
- `blocked` - Waiting on external factors

### Task Fields

```json
{
  "id": "1.2",
  "title": "Implement user authentication",
  "description": "Set up JWT-based auth system",
  "status": "pending",
  "priority": "high",
  "dependencies": ["1.1"],
  "details": "Use bcrypt for hashing, JWT for tokens...",
  "testStrategy": "Unit tests for auth functions, integration tests for login flow",
  "subtasks": []
}
```

## Claude Code Best Practices with Task Master

### Context Management

- Use `/clear` between different tasks to maintain focus
- This CLAUDE.md file is automatically loaded for context
- Use `task-master show <id>` to pull specific task context when needed

### Iterative Implementation

1. `task-master show <subtask-id>` - Understand requirements
2. Explore codebase and plan implementation
3. `task-master update-subtask --id=<id> --prompt="detailed plan"` - Log plan
4. `task-master set-status --id=<id> --status=in-progress` - Start work
5. Implement code following logged plan
6. `task-master update-subtask --id=<id> --prompt="what worked/didn't work"` - Log progress
7. `task-master set-status --id=<id> --status=done` - Complete task

### Complex Workflows with Checklists

For large migrations or multi-step processes:

1. Create a markdown PRD file describing the new changes: `touch task-migration-checklist.md` (prds can be .txt or .md)
2. Use Taskmaster to parse the new prd with `task-master parse-prd --append` (also available in MCP)
3. Use Taskmaster to expand the newly generated tasks into subtasks. Consdier using `analyze-complexity` with the correct --to and --from IDs (the new ids) to identify the ideal subtask amounts for each task. Then expand them.
4. Work through items systematically, checking them off as completed
5. Use `task-master update-subtask` to log progress on each task/subtask and/or updating/researching them before/during implementation if getting stuck

### Git Integration

Task Master works well with `gh` CLI:

```bash
# Create PR for completed task
gh pr create --title "Complete task 1.2: User authentication" --body "Implements JWT auth system as specified in task 1.2"

# Reference task in commits
git commit -m "feat: implement JWT auth (task 1.2)"
```

### Parallel Development with Git Worktrees

```bash
# Create worktrees for parallel task development
git worktree add ../project-auth feature/auth-system
git worktree add ../project-api feature/api-refactor

# Run Claude Code in each worktree
cd ../project-auth && claude    # Terminal 1: Auth work
cd ../project-api && claude     # Terminal 2: API work
```

## Troubleshooting

### AI Commands Failing

```bash
# Check API keys are configured
cat .env                           # For CLI usage

# Verify model configuration
task-master models

# Test with different model
task-master models --set-fallback gpt-4o-mini
```

### MCP Connection Issues

- Check `.mcp.json` configuration
- Verify Node.js installation
- Use `--mcp-debug` flag when starting Claude Code
- Use CLI as fallback if MCP unavailable

### Task File Sync Issues

```bash
# Regenerate task files from tasks.json
task-master generate

# Fix dependency issues
task-master fix-dependencies
```

DO NOT RE-INITIALIZE. That will not do anything beyond re-adding the same Taskmaster core files.

## Important Notes

### AI-Powered Operations

These commands make AI calls and may take up to a minute:

- `parse_prd` / `task-master parse-prd`
- `analyze_project_complexity` / `task-master analyze-complexity`
- `expand_task` / `task-master expand`
- `expand_all` / `task-master expand --all`
- `add_task` / `task-master add-task`
- `update` / `task-master update`
- `update_task` / `task-master update-task`
- `update_subtask` / `task-master update-subtask`

### File Management

- Never manually edit `tasks.json` - use commands instead
- Never manually edit `.taskmaster/config.json` - use `task-master models`
- Task markdown files in `tasks/` are auto-generated
- Run `task-master generate` after manual changes to tasks.json

### Claude Code Session Management

- Use `/clear` frequently to maintain focused context
- Create custom slash commands for repeated Task Master workflows
- Configure tool allowlist to streamline permissions
- Use headless mode for automation: `claude -p "task-master next"`

### Multi-Task Updates

- Use `update --from=<id>` to update multiple future tasks
- Use `update-task --id=<id>` for single task updates
- Use `update-subtask --id=<id>` for implementation logging

### Research Mode

- Add `--research` flag for research-based AI enhancement
- Requires a research model API key like Perplexity (`PERPLEXITY_API_KEY`) in environment
- Provides more informed task creation and updates
- Recommended for complex technical tasks

---

_This guide ensures Claude Code has immediate access to Task Master's essential functionality for agentic development workflows._

---

# Project-Specific Context: notionfly-iii

This section contains project-specific documentation to provide context for the AI assistant.

## Development Best Practices

- **TDD (Test-Driven Development):** New features should be developed following the Red-Green-Refactor cycle.
- **Validation:** After a feature or fix is implemented, and after the user's approval, run the project's tests and linter to ensure code quality and correctness.
  - To run tests: `npm test`
  - To run linter: `npx eslint .`

---

## Expo Development Guidelines

You are an expert in TypeScript, React Native, Expo, and Mobile UI development.

Code Style and Structure

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Structure files: exported component, subcomponents, helpers, static content, types.
- Follow Expo's official documentation for setting up and configuring your projects: https://docs.expo.dev/

Naming Conventions

- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Favor named exports for components.

TypeScript Usage

- Use TypeScript for all code; prefer interfaces over types.
- Avoid enums; use maps instead.
- Use functional components with TypeScript interfaces.
- Use strict mode in TypeScript for better type safety.

Syntax and Formatting

- Use the "function" keyword for pure functions.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use declarative JSX.
- Use Prettier for consistent code formatting.

UI and Styling

- Use Expo's built-in components for common UI patterns and layouts.
- Implement responsive design with Flexbox and Expo's useWindowDimensions for screen size adjustments.
- Use styled-components or Tailwind CSS for component styling.
- Implement dark mode support using Expo's useColorScheme.
- Ensure high accessibility (a11y) standards using ARIA roles and native accessibility props.
- Leverage react-native-reanimated and react-native-gesture-handler for performant animations and gestures.

Safe Area Management

- Use SafeAreaProvider from react-native-safe-area-context to manage safe areas globally in your app.
- Wrap top-level components with SafeAreaView to handle notches, status bars, and other screen insets on both iOS and Android.
- Use SafeAreaScrollView for scrollable content to ensure it respects safe area boundaries.
- Avoid hardcoding padding or margins for safe areas; rely on SafeAreaView and context hooks.

Performance Optimization

- Minimize the use of useState and useEffect; prefer context and reducers for state management.
- Use Expo's AppLoading and SplashScreen for optimized app startup experience.
- Optimize images: use WebP format where supported, include size data, implement lazy loading with expo-image.
- Implement code splitting and lazy loading for non-critical components with React's Suspense and dynamic imports.
- Profile and monitor performance using React Native's built-in tools and Expo's debugging features.
- Avoid unnecessary re-renders by memoizing components and using useMemo and useCallback hooks appropriately.

Navigation

- Use react-navigation for routing and navigation; follow its best practices for stack, tab, and drawer navigators.
- Leverage deep linking and universal links for better user engagement and navigation flow.
- Use dynamic routes with expo-router for better navigation handling.

State Management

- Use React Context and useReducer for managing global state.
- Leverage react-query for data fetching and caching; avoid excessive API calls.
- For complex state management, consider using Zustand or Redux Toolkit.
- Handle URL search parameters using libraries like expo-linking.

Error Handling and Validation

- Use Zod for runtime validation and error handling.
- Implement proper error logging using Sentry or a similar service.
- Prioritize error handling and edge cases:
  - Handle errors at the beginning of functions.
  - Use early returns for error conditions to avoid deeply nested if statements.
  - Avoid unnecessary else statements; use if-return pattern instead.
  - Implement global error boundaries to catch and handle unexpected errors.
- Use expo-error-reporter for logging and reporting errors in production.

Testing

- Write unit tests using Jest and React Native Testing Library.
- Implement integration tests for critical user flows using Detox.
- Use Expo's testing tools for running tests in different environments.
- Consider snapshot testing for components to ensure UI consistency.

Security

- Sanitize user inputs to prevent XSS attacks.
- Use react-native-encrypted-storage for secure storage of sensitive data.
- Ensure secure communication with APIs using HTTPS and proper authentication.
- Use Expo's Security guidelines to protect your app: https://docs.expo.dev/guides/security/

Internationalization (i18n)

- Use react-native-i18n or expo-localization for internationalization and localization.
- Support multiple languages and RTL layouts.
- Ensure text scaling and font adjustments for accessibility.

Key Conventions

1. Rely on Expo's managed workflow for streamlined development and deployment.
2. Prioritize Mobile Web Vitals (Load Time, Jank, and Responsiveness).
3. Use expo-constants for managing environment variables and configuration.
4. Use expo-permissions to handle device permissions gracefully.
5. Implement expo-updates for over-the-air (OTA) updates.
6. Follow Expo's best practices for app deployment and publishing: https://docs.expo.dev/distribution/introduction/
7. Ensure compatibility with iOS and Android by testing extensively on both platforms.

API Documentation

- Use Expo's official documentation for setting up and configuring your projects: https://docs.expo.dev/

Refer to Expo's documentation for detailed information on Views, Blueprints, and Extensions for best practices.

---

## Content from: 01-analise-projeto-original.md

# Análise do Projeto Original

## 1. O que o projeto faz?

O projeto é um aplicativo móvel desenvolvido com Expo (React Native) que funciona como um cliente para visualizar dados armazenados em uma base de dados (tabela) do Notion. Ele busca os dados, os processa e os exibe em forma de uma lista simples, funcionando como um protótipo de painel de controle (dashboard) móvel.

## 2. Como ele funciona?

O funcionamento pode ser dividido em três partes principais: configuração, busca de dados no Notion e exibição na interface.

### 2.1. Configuração e Variáveis de Ambiente

O projeto utiliza um arquivo `.env` para armazenar informações sensíveis:

- `NOTION_API_KEY`: Chave de integração secreta do Notion para autorizar o acesso.
- `NOTION_DATABASE_ID`: Identificador único da tabela no Notion a ser consultada.

O arquivo `app.config.js` carrega essas variáveis e as disponibiliza para o aplicativo através do campo `extra` do Expo.

### 2.2. Acesso à API do Notion (`src/services/notion.js`)

Este arquivo é o núcleo da integração.

- **Cliente API:** Utiliza a biblioteca `@notionhq/client` para criar um cliente de API, autenticado com a `NOTION_API_KEY`.
- **Função `getDatabase`:** Realiza uma consulta (`databases.query`) na base de dados especificada. Após receber os dados brutos, ela os mapeia para um formato mais simples e fácil de usar no aplicativo, extraindo o `id` e as propriedades relevantes de cada item.

### 2.3. Interface do Usuário (`App.js`)

Este é o componente principal que renderiza a tela.

- **Gerenciamento de Estado:** Usa os hooks `useState` e `useEffect` do React.
  - `useState` é usado para armazenar a lista de dados (`data`) e controlar o estado de carregamento (`loading`).
- **Busca de Dados:** O `useEffect` é disparado quando o componente é montado para chamar a função `getDatabase()`.
  - Quando os dados são recebidos, o estado `data` é atualizado e o `loading` é desativado.
  - Possui tratamento básico para erros e um bloco `finally` para garantir que o indicador de carregamento seja sempre removido.
- **Renderização:**
  - Se `loading` for `true`, exibe um `ActivityIndicator`.
  - Caso contrário, usa o componente `FlatList` para renderizar a lista de itens, exibindo o nome e o valor de cada entrada do Notion.

## 3. Fluxo Resumido

1.  **Inicialização:** O app inicia e carrega as chaves da API do Notion.
2.  **Renderização Inicial:** O componente `App` exibe um indicador de carregamento.
3.  **Busca de Dados:** `useEffect` chama a função `getDatabase`.
4.  **Requisição à API:** O serviço do Notion envia uma requisição autenticada para a API do Notion.
5.  **Processamento:** O serviço recebe a resposta e a transforma em um array de objetos simplificado.
6.  **Atualização do Estado:** Os dados retornam para `App.js`, que atualiza seu estado.
7.  **Renderização Final:** O React re-renderiza o componente, que agora exibe a `FlatList` com os dados do Notion.

---

## Content from: 02-plano-improvment.md

# Plano de Melhorias - NotionFly III

## 1. Visão Geral

O objetivo é refatorar a interface do usuário (UI) do aplicativo, saindo de uma lista simples para um design moderno e mais funcional, inspirado no estilo **Material 3**. A nova interface será implementada utilizando a biblioteca `react-native-paper` para garantir consistência visual e agilidade no desenvolvimento.

## 2. Estratégia de Implementação

### 2.1. Biblioteca de UI

- **Adoção do `react-native-paper`:** Todos os novos componentes de UI serão construídos com base nesta biblioteca. Isso inclui `Card`, `Text`, `Button`, `FAB` (Floating Action Button), e `Appbar`.
- **Tema Customizado:** Será configurado um tema (`theme`) para a aplicação, definindo a paleta de cores (primária, secundária, superfícies) e a tipografia, para alinhar com a identidade visual desejada e facilitar futuras alterações de design.

### 2.2. Redesenho da Tela Principal (`HomeScreen`)

A `HomeScreen` será transformada em um painel de controle (dashboard).

- **Estrutura:**
  - **Cabeçalho (`Appbar`):** Um cabeçalho no topo da tela com o título da aplicação.
  - **Card de Resumo:** Um `Card` em destaque exibindo uma métrica principal (ex: "Total de Itens no Notion").
  - **Lista de Itens em Cards:** A lista de dados vinda do Notion será renderizada como uma `FlatList`, where cada item é um componente `Card` individual. Isso melhora a separação visual e permite adicionar mais informações ou ações a cada item no futuro.
  - **Botão de Ação Flutuante (`FAB`):** Um `FAB` será posicionado no canto inferior direito para uma ação principal (a ser definida, inicialmente pode ser um "Adicionar" ou "Atualizar").

### 2.3. Estrutura de Componentes

- Componentes reutilizáveis (como o Card de item da lista) serão criados em `src/components/` para manter o código organizado e escalável.

## 3. Próximos Passos

1.  **Configurar o `Provider`:** Envolver a aplicação com o `PaperProvider` da `react-native-paper` e definir o tema base.
2.  **Refatorar `HomeScreen.tsx`:** Aplicar a nova estrutura de dashboard.
3.  **Criar Componente `NotionItemCard.tsx`:** Desenvolver o card customizado para os itens da lista.
4.  **Testar e Iterar:** Validar o novo design e fazer ajustes conforme necessário.