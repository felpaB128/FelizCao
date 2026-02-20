// src/PopUp/PopUp.tsx
import { type ReactNode, useState } from "react";
import "./PopUp.css";

type NovoItem = {
  nome: string;
  precoSaco: number;
  precoQuilo: number;
  quantidadeSacos: number;
};

type PopUpProps = {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onCreate: (item: NovoItem) => void;
  children?: ReactNode;
};

export function PopUp({
  isOpen,
  title,
  subtitle,
  onClose,
  onCreate,
}: PopUpProps) {
  if (!isOpen) return null;

  const [nome, setNome] = useState("");
  const [precoSaco, setPrecoSaco] = useState("");
  const [precoQuilo, setPrecoQuilo] = useState("");
  const [quantidadeSacos, setQuantidadeSacos] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nomeTrim = nome.trim();
    const precoSacoNum = Number(precoSaco);
    const precoQuiloNum = Number(precoQuilo);
    const qtdSacosNum = Number(quantidadeSacos);

    if (!nomeTrim || !precoSacoNum || !precoQuiloNum || !qtdSacosNum) return;

    onCreate({
      nome: nomeTrim,
      precoSaco: precoSacoNum,
      precoQuilo: precoQuiloNum,
      quantidadeSacos: qtdSacosNum,
    });

    setNome("");
    setPrecoSaco("");
    setPrecoQuilo("");
    setQuantidadeSacos("");
    onClose();
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="popup-title">{title}</h2>
        {subtitle && <p className="popup-subtitle">{subtitle}</p>}

        <form onSubmit={handleSubmit} className="popup-form">
          <label className="popup-field">
            <span>Nome do item</span>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Ração Premium"
            />
          </label>

          <label className="popup-field">
            <span>Preço do saco</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={precoSaco}
              onChange={(e) => setPrecoSaco(e.target.value)}
              placeholder="Ex: 120.00"
            />
          </label>

          <label className="popup-field">
            <span>Preço do quilo</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={precoQuilo}
              onChange={(e) => setPrecoQuilo(e.target.value)}
              placeholder="Ex: 12.00"
            />
          </label>

          <label className="popup-field">
            <span>Quantidade de sacos</span>
            <input
              type="number"
              min="1"
              step="1"
              value={quantidadeSacos}
              onChange={(e) => setQuantidadeSacos(e.target.value)}
              placeholder="Ex: 50"
            />
          </label>

          <div className="popup-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
