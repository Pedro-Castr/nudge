import Link from "next/link";
import Logo from "@/components//logo/logo";
import TaskPreview from "./components/taskPreview";

import styles from "./homePage.module.css";

const PROMISES = [
  "Anote em segundos",
  "Arraste para priorizar",
  "Lembrete na hora certa",
];

const STEPS = [
  {
    title: "Anote em segundos",
    text: "Digite a tarefa, escolha quando quer ser lembrado e pronto. Sem formulário longo no caminho.",
  },
  {
    title: "Arraste para priorizar",
    text: "Coloque o que importa no topo só arrastando. A ordem da lista é a ordem de prioridade.",
  },
  {
    title: "Seja lembrado na hora certa",
    text: "O nudge avisa no horário que você definiu, para a tarefa não passar batida.",
  },
];

export function HomePage() {
  return (
    <main className={styles.home}>
      <header className={styles.header}>
        <Logo />
        <Link href="/auth" className={styles.headerLink}>
          Entrar
        </Link>
      </header>

      <section className={styles.brand}>
        <div className={styles.brandDots} />
        <div className={styles.brandRipples} aria-hidden="true">
          <span className={styles.ripple} />
          <span className={`${styles.ripple} ${styles.ripple2}`} />
          <span className={`${styles.ripple} ${styles.ripple3}`} />
        </div>

        <div className={styles.brandContent}>
          <h1 className={styles.brandTitle}>
            Um empurrãozinho para você nunca esquecer.
          </h1>
          <p className={styles.brandText}>
            Anote em segundos, arraste para decidir o que vem primeiro e deixe o
            resto com a gente.
          </p>
          <Link href="/auth" className={styles.cta}>
            Entrar ou criar conta
          </Link>
          <TaskPreview />
        </div>

        <ul className={styles.promises}>
          {PROMISES.map((promise) => (
            <li key={promise}>{promise}</li>
          ))}
        </ul>
      </section>

      <section className={styles.steps} aria-labelledby="como-funciona">
        <h2 id="como-funciona" className={styles.sectionTitle}>
          Como funciona
        </h2>
        <ol className={styles.stepList}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.stepNumber}>{index + 1}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.final}>
        <h2 className={styles.sectionTitle}>
          Pronto para o primeiro empurrãozinho?
        </h2>
        <p className={styles.brandText}>
          Crie sua conta em menos de um minuto e comece a anotar.
        </p>
        <Link href="/auth" className={styles.cta}>
          Criar minha conta
        </Link>
      </section>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} nudge
      </footer>
    </main>
  );
}
