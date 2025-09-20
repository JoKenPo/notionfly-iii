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
  - **Lista de Itens em Cards:** A lista de dados vinda do Notion será renderizada como uma `FlatList`, onde cada item é um componente `Card` individual. Isso melhora a separação visual e permite adicionar mais informações ou ações a cada item no futuro.
  - **Botão de Ação Flutuante (`FAB`):** Um `FAB` será posicionado no canto inferior direito para uma ação principal (a ser definida, inicialmente pode ser um "Adicionar" ou "Atualizar").

### 2.3. Estrutura de Componentes

- Componentes reutilizáveis (como o Card de item da lista) serão criados em `src/components/` para manter o código organizado e escalável.

## 3. Próximos Passos

1.  **Configurar o `Provider`:** Envolver a aplicação com o `PaperProvider` da `react-native-paper` e definir o tema base.
2.  **Refatorar `HomeScreen.tsx`:** Aplicar a nova estrutura de dashboard.
3.  **Criar Componente `NotionItemCard.tsx`:** Desenvolver o card customizado para os itens da lista.
4.  **Testar e Iterar:** Validar o novo design e fazer ajustes conforme necessário.
