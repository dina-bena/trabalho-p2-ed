from __future__ import annotations

from typing import Generic, TypeVar

T = TypeVar("T", int, float)


class HeapBinario(Generic[T]):
    """Heap binário configurável como Min-Heap ou Max-Heap.

    Atributos:
        tipo: "min" para menor elemento na raiz ou "max" para maior.
        dados: lista que armazena o heap.
        comparacoes: quantidade de comparações entre valores.
        trocas: quantidade de trocas realizadas.
        operacoes: quantidade de operações estruturais (comparações + trocas).
    """

    def __init__(self, tipo: str = "min") -> None:
        if tipo not in ("min", "max"):
            raise ValueError("tipo deve ser 'min' ou 'max'")
        self.tipo = tipo
        self.dados: list[T] = []
        self.comparacoes = 0
        self.trocas = 0
        self.operacoes = 0

    def _prioritario(self, a: T, b: T) -> bool:
        """Retorna True se 'a' deve ficar acima de 'b' no heap."""
        self.comparacoes += 1
        self.operacoes += 1
        return a < b if self.tipo == "min" else a > b

    def _trocar(self, i: int, j: int) -> None:
        """Troca dois elementos e registra a operação."""
        self.dados[i], self.dados[j] = self.dados[j], self.dados[i]
        self.trocas += 1
        self.operacoes += 1

    @staticmethod
    def _pai(i: int) -> int:
        """Índice do pai de i (para i > 0)."""
        return (i - 1) // 2

    @staticmethod
    def _esquerdo(i: int) -> int:
        """Índice do filho esquerdo."""
        return 2 * i + 1

    @staticmethod
    def _direito(i: int) -> int:
        """Índice do filho direito."""
        return 2 * i + 2

    def _sift_up(self, i: int) -> None:
        """Promove o elemento enquanto ele tiver prioridade sobre o pai."""
        while i > 0:
            pai = self._pai(i)
            if not self._prioritario(self.dados[i], self.dados[pai]):
                break
            self._trocar(i, pai)
            i = pai

    def _sift_down(self, i: int) -> None:
        """Rebaixa o elemento trocando-o com o filho mais prioritário."""
        n = len(self.dados)
        while True:
            melhor = i
            esq = self._esquerdo(i)
            dire = self._direito(i)

            if esq < n and self._prioritario(self.dados[esq], self.dados[melhor]):
                melhor = esq
            if dire < n and self._prioritario(self.dados[dire], self.dados[melhor]):
                melhor = dire

            if melhor == i:
                break

            self._trocar(i, melhor)
            i = melhor

    def insert(self, valor: T) -> None:
        """Insere valor no heap e aplica sift-up."""
        self.dados.append(valor)
        self.operacoes += 1  # escrita no final do array
        self._sift_up(len(self.dados) - 1)

    def peek(self) -> T:
        """Consulta o elemento prioritário sem removê-lo."""
        if not self.dados:
            raise IndexError("peek em heap vazio")
        return self.dados[0]

    def extract(self) -> T:
        """Remove e devolve a raiz, aplicando sift-down."""
        if not self.dados:
            raise IndexError("extract em heap vazio")

        raiz = self.dados[0]
        ultimo = self.dados.pop()
        self.operacoes += 1  # remoção do final do array

        if self.dados:
            self.dados[0] = ultimo
            self.operacoes += 1  # escrita da nova raiz
            self._sift_down(0)

        return raiz

    def resetar_contadores(self) -> None:
        """Zera métricas sem alterar os elementos armazenados."""
        self.comparacoes = 0
        self.trocas = 0
        self.operacoes = 0

    def __len__(self) -> int:
        return len(self.dados)

    def __repr__(self) -> str:
        return f"{self.tipo.upper()}-Heap({self.dados})"


def executar_testes() -> None:
    """Executa três cenários comentados e imprime resultados e métricas."""

    print("\\n=== CENÁRIO 1: caso comum (Min-Heap) ===")
    heap = HeapBinario[int]("min")
    for valor in [20, 10, 30, 5, 15]:
        heap.insert(valor)
    print("Heap após inserções:", heap.dados)
    print("peek():", heap.peek())
    removido = heap.extract()
    print("extract():", removido)
    print("Heap após extração:", heap.dados)
    print(f"Comparações: {heap.comparacoes} | Trocas: {heap.trocas} | Operações: {heap.operacoes}")

    print("\\n=== CENÁRIO 2: caso de borda (heap vazio e um elemento) ===")
    vazio = HeapBinario[int]("max")
    try:
        vazio.peek()
    except IndexError as erro:
        print("peek em heap vazio:", erro)
    vazio.insert(42)
    print("peek com um elemento:", vazio.peek())
    print("extract com um elemento:", vazio.extract())
    print("Heap final:", vazio.dados)
    print(f"Comparações: {vazio.comparacoes} | Trocas: {vazio.trocas} | Operações: {vazio.operacoes}")

    print("\\n=== CENÁRIO 3: pior caso de sift-up (Min-Heap) ===")
    # Inserir valores em ordem decrescente faz cada novo valor ser menor
    # que seus ancestrais, exigindo várias promoções até perto da raiz.
    pior = HeapBinario[int]("min")
    for valor in [90, 80, 70, 60, 50, 40, 30, 20, 10]:
        pior.insert(valor)
    print("Heap após inserção decrescente:", pior.dados)
    print(f"Comparações: {pior.comparacoes} | Trocas: {pior.trocas} | Operações: {pior.operacoes}")


if __name__ == "__main__":
    executar_testes()
