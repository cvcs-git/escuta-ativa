/**
 * Botões do app. Três variantes, todas com área de toque de 88 px:
 * - primario: ação principal (laranja);
 * - secundario: ações de apoio (branco com borda laranja);
 * - confirmar: concluir ou confirmar (verde).
 *
 * `BotaoLink` navega entre telas e `BotaoAncora` abre links externos (ex.: `tel:`),
 * com o mesmo visual.
 */
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

export type VarianteBotao = "primario" | "secundario" | "confirmar";

const classes = (variante: VarianteBotao, extra = "") =>
  ["botao", variante !== "primario" && `botao--${variante}`, extra].filter(Boolean).join(" ");

type PropsBotao = ButtonHTMLAttributes<HTMLButtonElement> & { variante?: VarianteBotao };

export function Botao({ variante = "primario", className, type = "button", ...props }: PropsBotao) {
  return <button type={type} className={classes(variante, className)} {...props} />;
}

type PropsBotaoLink = LinkProps & { variante?: VarianteBotao };

export function BotaoLink({ variante = "primario", className, ...props }: PropsBotaoLink) {
  return <Link className={classes(variante, className)} {...props} />;
}

type PropsBotaoAncora = AnchorHTMLAttributes<HTMLAnchorElement> & { variante?: VarianteBotao };

export function BotaoAncora({ variante = "primario", className, ...props }: PropsBotaoAncora) {
  return <a className={classes(variante, className)} {...props} />;
}

/** Dois botões lado a lado, com o mesmo espaçamento usado em todo o app. */
export function DuplaDeBotoes({ children }: { children: ReactNode }) {
  return <div className="dupla">{children}</div>;
}
