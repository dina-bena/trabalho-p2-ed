# Trabalho P2 — Estruturas de Dados

## Identificação

- **Nome completo:** Diná Julhian de Toledo Bená
- **RA:** 2840482521037
- **Tema escolhido:** **Heaps e Filas de Prioridade: Min-Heap / Max-Heap**

## 1. Vídeo de defesa técnica

**Link do vídeo:** https://youtu.be/ujqAz34UDCA

## 2. Objetivo do projeto

Este projeto implementa uma fila de prioridade por meio de um Heap Binário. O Heap é armazenado em um array (lista Python), sem utilizar bibliotecas prontas para a estrutura principal. A aplicação permite trabalhar com Min-Heap e Max-Heap e visualizar a estrutura como árvore binária completa e como array.

## 3. Resumo teórico

Uma fila de prioridade é uma estrutura em que cada elemento possui uma prioridade. Diferentemente de uma fila comum, na qual normalmente o primeiro elemento inserido é o primeiro removido, a fila de prioridade devolve primeiro o elemento de maior prioridade.

O Heap Binário é uma árvore binária completa armazenada em um array. Em uma árvore completa, os níveis são preenchidos da esquerda para a direita.

- **Min-Heap:** cada pai é menor ou igual aos seus filhos. O menor elemento fica na raiz.
- **Max-Heap:** cada pai é maior ou igual aos seus filhos. O maior elemento fica na raiz.

Para um elemento no índice `i`, os índices são:

```text
pai(i) = (i - 1) // 2       (para i > 0)
esquerdo(i) = 2 * i + 1
direito(i) = 2 * i + 2
```

### Operações implementadas

- `insert(valor)`: coloca o novo valor no final do array e executa **sift-up**. Enquanto o elemento tiver prioridade sobre o pai, os dois são trocados.
- `extract()`: remove a raiz, coloca o último elemento na raiz e executa **sift-down**, trocando-o com o filho de maior prioridade até restaurar a propriedade do Heap.
- `peek()`: consulta a raiz sem removê-la.
- `sift_up` e `sift_down`: métodos auxiliares que mantêm a propriedade do Heap.

### Onde é utilizado no mundo real?

Heaps e filas de prioridade são utilizados em escalonamento de tarefas, sistemas operacionais, processamento de eventos, simulações, algoritmos de caminhos mínimos (como Dijkstra) e sistemas que precisam selecionar rapidamente o próximo item prioritário.

## 4. Complexidade assintótica (Big-O)

Considere `n` como a quantidade de elementos no Heap. A altura de um Heap Binário completo é proporcional a `log n`.

A tabela considera as operações individuais principais:

| Operação | Melhor caso — tempo | Caso médio — tempo | Pior caso — tempo | Espaço auxiliar |
|---|---:|---:|---:|---:|
| `peek()` | O(1) | O(1) | O(1) | O(1) |
| `insert()` | O(1) | O(log n) | O(log n) | O(1) |
| `extract()` | O(1) | O(log n) | O(log n) | O(1) |

**Por que esses casos acontecem?**

- **Melhor caso de `insert`: O(1).** O novo elemento é colocado no final e já respeita a prioridade em relação ao pai. Não precisa subir.
- **Caso médio de `insert`: O(log n).** Pode precisar subir alguns níveis da árvore.
- **Pior caso de `insert`: O(log n).** O novo elemento tem prioridade maior que todos os ancestrais (por exemplo, inserir valores em ordem decrescente em um Min-Heap), podendo subir da última posição até a raiz.
- **`extract`:** depois de remover a raiz, o último elemento vai para o topo. No melhor caso, ele já respeita a prioridade e não precisa descer, resultando em O(1). No caso médio e no pior caso, pode percorrer níveis da árvore; no pior caso, desce até o último nível, resultando em O(log n).
- **`peek`: O(1).** Basta ler a posição zero do array.

**Espaço auxiliar:** os métodos `sift_up` e `sift_down` são iterativos e utilizam uma quantidade constante de variáveis. Por isso, o espaço auxiliar é O(1). O armazenamento do próprio Heap ocupa O(n), mas não é contado como espaço auxiliar da operação.

## 5. Instrumentação

O código Python mantém três contadores:

- `comparacoes`: comparações entre valores do Heap.
- `trocas`: trocas de posição entre elementos.
- `operacoes`: contagem didática de ações estruturais, incluindo comparações, trocas, inserções e movimentações no array.

Os contadores servem para observar o crescimento do trabalho realizado. Eles não representam tempo real em segundos e podem variar conforme os dados de entrada.


## 7. Diário de Engenharia com IA

- **Modelo/ferramenta utilizado:** ChatGPT (GPT-6), como apoio para estudo, planejamento, implementação e revisão do projeto.
- **Prompt 1 — Aprendizagem do conceito:** “Explique de maneira didática o funcionamento de Min-Heap e Max-Heap, incluindo insert, extract, peek, sift-up, sift-down e a relação entre árvore e array, com exemplos simples.”
- **Prompt 2 — Teste/revisão de implementação:** “Revise a implementação abaixo de Heap Binário em Python, sem bibliotecas prontas, com type hints, docstrings, contadores de comparações e trocas e testes de caso comum, caso de borda e pior caso.”
- **Prompt 3 — Simulador visual:** “Desenvolva um simulador web autocontido de Min-Heap e Max-Heap que mostre simultaneamente árvore e array, índices de pai e filhos, animação passo a passo de sift-up e sift-down, métricas, cenários e controles Play, Step, Pause e Reset.”

### Ajuste identificado

A implementação visual reproduz a lógica para permitir a animação no navegador, (enquanto a implementação de referência exigida está em Python). Foi identificado a falta de alguns botões exigidos que não constava no simulador gerado, e consequentemente feito a correção.

