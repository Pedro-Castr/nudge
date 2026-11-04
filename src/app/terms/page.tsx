import type { Metadata } from "next";

import LegalPage from "@/features/terms/legalPage";

export const metadata: Metadata = {
  title: "Termos de Uso — Nudge",
};

// Preencha antes de publicar.
const CONTACT_EMAIL = "vieiracastropedro7@gmail.com";
const UPDATED_AT = "4 de novembro de 2026";

export default function TermosPage() {
  return (
    <LegalPage title="Termos de Uso" updatedAt={UPDATED_AT}>
      <p>
        Ao criar uma conta ou usar o Nudge, você concorda com estes termos. Leia
        com atenção. Se não concordar, não utilize o serviço.
      </p>

      <h2>1. O que é o Nudge</h2>
      <p>
        O Nudge é um aplicativo de lista de tarefas, pensado para registrar
        tarefas rapidamente e organizá-las por prioridade. É um projeto pessoal,
        oferecido de forma gratuita.
      </p>

      <h2>2. Sua conta</h2>
      <ul>
        <li>
          Você deve informar dados verdadeiros e manter a sua senha em
          segurança.
        </li>
        <li>Você é responsável por tudo o que acontece na sua conta.</li>
        <li>
          Avise-nos se suspeitar de uso indevido da sua conta pelo e-mail{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </li>
      </ul>

      <h2>3. Uso permitido</h2>
      <p>Você concorda em não:</p>
      <ul>
        <li>usar o Nudge para fins ilegais;</li>
        <li>tentar acessar contas ou dados de outras pessoas;</li>
        <li>
          interferir no funcionamento do serviço, por exemplo com ataques ou uso
          automatizado abusivo;
        </li>
        <li>copiar ou revender o serviço sem autorização.</li>
      </ul>

      <h2>4. Seu conteúdo</h2>
      <p>
        As tarefas que você escreve são suas. Nós as armazenamos apenas para
        exibi-las a você, conforme a Política de Privacidade. Tarefas concluídas
        são apagadas automaticamente 10 dias após a conclusão, e você é o
        responsável por manter uma cópia de qualquer informação que considere
        importante.
      </p>

      <h2>5. Disponibilidade e limitação de responsabilidade</h2>
      <p>
        O Nudge é oferecido &ldquo;como está&rdquo;. Fazemos o possível para
        mantê-lo funcionando, mas não garantimos que ele estará sempre
        disponível ou livre de erros. Na medida permitida pela lei, não nos
        responsabilizamos por perdas de dados, tarefas não lembradas ou
        prejuízos decorrentes do uso ou da indisponibilidade do serviço.
      </p>

      <h2>6. Suspensão e encerramento</h2>
      <p>
        Você pode excluir a sua conta a qualquer momento. Podemos suspender ou
        encerrar contas que violem estes termos. Também podemos alterar ou
        encerrar o serviço, e nesse caso procuraremos avisar com antecedência.
      </p>

      <h2>7. Mudanças nos termos</h2>
      <p>
        Podemos atualizar estes termos. A data no topo da página mostra a última
        revisão, e o uso do serviço após a mudança significa que você aceita a
        nova versão.
      </p>

      <h2>8. Lei aplicável</h2>
      <p>
        Estes termos seguem as leis do Brasil. Eventuais conflitos serão
        resolvidos no foro do domicílio do usuário, conforme o Código de Defesa
        do Consumidor.
      </p>

      <h2>9. Contato</h2>
      <p>
        Dúvidas sobre estes termos:{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
