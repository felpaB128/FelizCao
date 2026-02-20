// src/Home.tsx
import { useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PopUp } from "../PopUp/PopUp";
import "./Home.css";

type Produto = {
  id: number;
  nome: string;
  precoSaco: number;
  precoQuilo: number;
  quantidadeSacos: number;
};

export function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [confirmarRemocao, setConfirmarRemocao] = useState<{
    id: number;
    nome: string;
  } | null>(null);

  const [isCriarOpen, setIsCriarOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [vendaPeso, setVendaPeso] = useState<
    Record<number, { valor: string; unidade: "kg" | "g" }>
  >({});
  const [vendaTotal, setVendaTotal] = useState<Record<number, number>>({});

  function abrirConfirmacao(id: number, nome: string) {
    setConfirmarRemocao({ id, nome });
  }

  function fecharConfirmacao() {
    setConfirmarRemocao(null);
  }

  function confirmarRemocaoItem() {
    if (confirmarRemocao) {
      setProdutos((lista) =>
        lista.filter((produto) => produto.id !== confirmarRemocao.id)
      );
      fecharConfirmacao();
    }
  }

  function handleAdicionar() {
    setIsCriarOpen(true);
  }

  function handleToggleExpand(id: number) {
    setExpandedId((atual) => (atual === id ? null : id));
  }

  function incrementarQuantidade(id: number) {
    setProdutos((lista) =>
      lista.map((produto) =>
        produto.id === id
          ? { ...produto, quantidadeSacos: produto.quantidadeSacos + 1 }
          : produto
      )
    );
  }

  function decrementarQuantidade(id: number) {
    setProdutos((lista) =>
      lista.map((produto) =>
        produto.id === id
          ? {
              ...produto,
              quantidadeSacos:
                produto.quantidadeSacos > 0
                  ? produto.quantidadeSacos - 1
                  : 0,
            }
          : produto
      )
    );
  }

  function atualizarVendaPeso(
    id: number,
    campo: "valor" | "unidade",
    novoValor: string | "kg" | "g"
  ) {
    setVendaPeso((estado) => {
      const atual = estado[id] ?? { valor: "", unidade: "kg" as const };
      return {
        ...estado,
        [id]: {
          ...atual,
          [campo]: novoValor,
        },
      };
    });
  }

  function calcularValorVenda(produto: Produto) {
    const info = vendaPeso[produto.id];
    if (!info || !info.valor) return 0;

    const pesoNum = Number(info.valor);
    if (!pesoNum || pesoNum <= 0) return 0;

    const pesoKg = info.unidade === "kg" ? pesoNum : pesoNum / 1000;
    const total = pesoKg * produto.precoQuilo;
    return total;
  }

  function handleRecalcularVenda(id: number) {
    const produto = produtos.find((p) => p.id === id);
    if (!produto) return;
    const total = calcularValorVenda(produto);
    setVendaTotal((estado) => ({
      ...estado,
      [id]: total,
    }));
  }

  return (
    <div className="page">
      <div className="content">
        <header className="header">
          <h1 className="title">FelizCao - Lista de Produtos</h1>
          <p className="subtitle">
            Visualização em cards, com confirmação antes de remover.
          </p>
        </header>

        <div className="toolbar">
          <button
            type="button"
            className="add-button fancy"
            onClick={handleAdicionar}
          >
            <span className="add-inner">
              <span className="add-plus">+</span>
            </span>
          </button>
        </div>

        <div className="lista-container">
          {produtos.map((produto) => {
            const isExpanded = expandedId === produto.id;
            const vendaInfo =
              vendaPeso[produto.id] ?? { valor: "", unidade: "kg" as const };
            const totalVenda =
              vendaTotal[produto.id] ?? calcularValorVenda(produto);

            return (
              <div
                key={produto.id}
                className={`card-item ${isExpanded ? "card-expanded" : ""}`}
                onClick={() => handleToggleExpand(produto.id)}
              >
                {/* linha principal: 3 colunas */}
                <div className="card-header-row">
                  {/* coluna esquerda */}
                  <div className="card-col card-left">
                    <div className="card-icon">
                      <div className="card-icon-inner" />
                    </div>
                    <span className="card-title">{produto.nome}</span>
                  </div>

                  {/* coluna do meio: contador de sacos */}
                  <div className="card-col card-middle">
                    <div
                      className="item-counter"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="counter-button"
                        onClick={() => decrementarQuantidade(produto.id)}
                      >
                        -
                      </button>
                      <span className="counter-text">
                        {produto.quantidadeSacos}
                      </span>
                      <button
                        type="button"
                        className="counter-button"
                        onClick={() => incrementarQuantidade(produto.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* coluna direita: botão Remover */}
                  <div className="card-col card-right">
                    <button
                      type="button"
                      className="remove-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirConfirmacao(produto.id, produto.nome);
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </div>

                {/* área expandida: infos + venda por peso alinhada à direita */}
                {isExpanded && (
                  <div
                    className="card-details"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p>Preço do saco: R$ {produto.precoSaco.toFixed(2)}</p>
                    <p>Preço do quilo: R$ {produto.precoQuilo.toFixed(2)}</p>
                    <p>Quantidade de sacos: {produto.quantidadeSacos}</p>

                    <div className="venda-row">
                      <div className="venda-peso">
                        <input
                          className="venda-input"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Peso vendido"
                          value={vendaInfo.valor}
                          onChange={(e) => {
                            atualizarVendaPeso(
                              produto.id,
                              "valor",
                              e.target.value
                            );
                            handleRecalcularVenda(produto.id);
                          }}
                        />
                        <select
                          className="venda-select"
                          value={vendaInfo.unidade}
                          onChange={(e) => {
                            atualizarVendaPeso(
                              produto.id,
                              "unidade",
                              e.target.value as "kg" | "g"
                            );
                            handleRecalcularVenda(produto.id);
                          }}
                        >
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                        </select>
                        <div className="venda-total">
                          R$ {totalVenda.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {produtos.length === 0 && (
            <p className="empty-text">Nenhum item adicionado.</p>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirmarRemocao}
        title="Remover Produto"
        message="Você quer apagar esse item"
        onConfirm={confirmarRemocaoItem}
        onCancel={fecharConfirmacao}
      />

      <PopUp
        isOpen={isCriarOpen}
        title="Criar novo produto"
        subtitle="Preencha os dados do item"
        onClose={() => setIsCriarOpen(false)}
        onCreate={(item) => {
          const id = Date.now();

          setProdutos((lista) => [
            ...lista,
            {
              id,
              nome: item.nome,
              precoSaco: item.precoSaco,
              precoQuilo: item.precoQuilo,
              quantidadeSacos: item.quantidadeSacos,
            },
          ]);
        }}
      />
    </div>
  );
}
