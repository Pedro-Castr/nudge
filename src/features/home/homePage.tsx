import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

import Logo from "@/components/logo";
import PreviewCard from "./components/previewCard";

import styles from "./homePage.module.css";

const steps = [
  { titulo: "Anote", resto: "em segundos." },
  { titulo: "Arraste", resto: "para pôr em ordem." },
  { titulo: "Conclua", resto: "e respire." },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logo size={28} />
        <Link href="/auth" className={styles.signIn}>
          Entrar
        </Link>
      </header>

      <main>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Um <em>empurrão</em> que te ajuda a lembrar.
          </h1>
          <p className={styles.lead}>
            Uma lista de tarefas calma e sem ruído: anote, organize do seu jeito
            e siga o seu dia.
          </p>
          <Link href="/auth" className={styles.cta}>
            Criar minha lista
            <FaArrowRight aria-hidden="true" />
          </Link>

          <div className={styles.preview} aria-hidden="true">
            <ul className={styles.previewList}>
              <PreviewCard />
              <PreviewCard dragging />
              <li className={styles.slot} />
              <PreviewCard />
            </ul>
          </div>
        </section>

        <section className={styles.steps} aria-label="Como funciona">
          <ol className={styles.stepsList}>
            {steps.map((s, i) => (
              <li key={s.titulo} className={styles.step}>
                <span className={styles.num}>{i + 1}</span>
                <p>
                  <strong>{s.titulo}</strong> {s.resto}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <h2 className={styles.footerTitle}>
            Pronto para o primeiro empurrão?
          </h2>
          <p className={styles.footerLead}>
            Criar sua conta leva menos de um minuto.
          </p>
          <Link href="/auth" className={styles.ctaLight}>
            Começar agora
            <FaArrowRight aria-hidden="true" />
          </Link>
          <div className={styles.footerBottom}>
            <span>© Nudge</span>
            <nav className={styles.footerLinks} aria-label="Links legais">
              <Link href="/termos">Termos</Link>
              <Link href="/privacidade">Privacidade</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
