export interface GreetingPart {
  text: string;
  highlight: boolean;
}

// Palavras entre ** ganham destaque. {nome} é trocado pelo primeiro nome.
const GREETINGS = [
  "Olá, **{nome}**. O que vamos fazer hoje?",
  "Bem-vindo de volta, **{nome}**.",
  "Que bom te ver, **{nome}**.",
  "Tudo em **ordem** por aqui, {nome}?",
  "Qual tarefa você vai fazer hoje, **{nome}**?",
  "Qual é o seu **próximo passo**, {nome}?",
  "Qual é a **prioridade** número 1 de hoje?",
  "O que precisa ser feito **primeiro**?",
  "O que está na sua **cabeça** hoje?",
  "Vamos tirar isso da **cabeça**?",
  "Anote agora, **esqueça** depois.",
  "Uma **tarefa** de cada vez.",
  "Defina o que vem **primeiro**.",
  "Comece pelo que **importa**.",
  "O que não pode ficar para **amanhã**?",
  "O que precisa ser **concluído** hoje?",
  "Organize o dia, uma **tarefa** por vez.",
  "Registre agora. Resolva com **calma**.",
  "Tire da cabeça. Coloque na **lista**.",
  "O que você precisa **lembrar** hoje?",
  "Hoje, o que **realmente** importa?",
  "Priorize, execute, **conclua**.",
];

const FALLBACK = "O que vamos **fazer** hoje?";

export function pickGreeting(nome?: string): GreetingPart[] {
  const firstName = nome?.trim().split(/\s+/)[0] ?? "";

  const template =
    GREETINGS[Math.floor(Math.random() * GREETINGS.length)] ?? FALLBACK;

  return template
    .split("**")
    .map((text, index) => ({
      text: text.replace("{nome}", firstName),
      highlight: index % 2 === 1,
    }))
    .filter((part) => part.text !== "");
}
