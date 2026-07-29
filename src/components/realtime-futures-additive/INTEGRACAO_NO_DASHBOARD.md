# Integração aditiva no dashboard atual

Este pacote não substitui nenhuma função, hook, rota ou componente já existente.

## 1. Copie a pasta

Copie:

```text
src/components/realtime-futures
```

para a mesma localização dentro do seu projeto React.

## 2. Adicione apenas um import

No início de `src/pages/DashboardPage.tsx`, junto dos demais imports:

```tsx
import RealtimeFuturesDashboard from "../components/realtime-futures";
```

> Caso seu `DashboardPage.tsx` esteja em outra pasta, ajuste apenas o caminho relativo.

## 3. Acrescente o componente na aba Resumo

Localize este bloco atual:

```tsx
{mainTab === "Resumo" && (
  <ResumoAvancadoTab
    asset={resolvedAsset}
    tf={tf}
    analysisData={analysisData}
  />
)}
```

Substitua somente esse pequeno bloco por:

```tsx
{mainTab === "Resumo" && (
  <div className="space-y-6">
    <ResumoAvancadoTab
      asset={resolvedAsset}
      tf={tf}
      analysisData={analysisData}
    />

    <RealtimeFuturesDashboard />
  </div>
)}
```

Nenhum outro trecho do dashboard deve ser alterado.

## 4. Execute

No terminal do VS Code, dentro da pasta que possui o `package.json`:

```bash
npm run dev
```

Abra a aba **Resumo**. O novo painel aparecerá abaixo do Resumo Operacional.

## Reversão rápida

Para remover o protótipo sem afetar o dashboard:

1. apague `<RealtimeFuturesDashboard />`;
2. remova o import;
3. apague a pasta `src/components/realtime-futures`.

O botão **Gerar Análise**, o endpoint `/analyze`, `analysisData`, as abas e os hooks existentes não são modificados.
