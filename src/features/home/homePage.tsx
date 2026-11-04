import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

import Logo from "@/components/logo";
import PreviewCard from "./components/previewCard";

import styles from "./homePage.module.css";

const steps = [
  { titulo: "Anote", resto: "em poucos segundos." },
  { titulo: "Ordene", resto: "para pôr em ordem." },
  { titulo: "Conclua", resto: "e siga em frente." },
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
            O Nudge é uma lista de tarefas feita para ser rápida. Você anota no
            momento em que lembra e volta a ela quando puder agir.
          </p>
          <Link href="/auth" className={styles.cta}>
            Criar minha lista
            <FaArrowRight aria-hidden="true" />
          </Link>

          <PreviewCard />
        </section>

        <section className={styles.block} aria-labelledby="problema">
          <h2 id="problema" className={styles.blockTitle}>
            A tarefa some antes de você chegar ao computador.
          </h2>
          <div className={styles.prose}>
            <p>
              Você lembra de algo importante longe da mesa e, quando finalmente
              pega o celular ou senta para trabalhar, a lembrança já não está
              lá. O problema não é falta de disciplina, é o tempo entre lembrar
              e registrar.
            </p>
            <p>
              <em className={styles.term}>Nudge</em> significa empurrão. Ele não
              pretende organizar a sua vida inteira: existe para o instante em
              que a tarefa aparece na sua cabeça. Registre sem fricção e, na
              hora de trabalhar, abra o Nudge e comece.
            </p>
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
            <a
              className={styles.credit}
              href="https://www.linkedin.com/in/pedro-castr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pedro Castro
            </a>
            <span>Mateus 22:37</span>
          </div>

          <div className={styles.footerLegal}>
            <span>© Nudge</span>
            <nav className={styles.footerLinks} aria-label="Links legais">
              <Link href="/terms">Termos</Link>
              <Link href="privacy">Privacidade</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
