import type { Metadata } from "next";

import LegalPage from "@/features/terms/legalPage";

export const metadata: Metadata = {
  title: "Política de Privacidade — Nudge",
};

const CONTACT_EMAIL = "vieiracastropedro7@gmail.com";
const UPDATED_AT = "4 de novembro de 2026";

export default function PrivacidadePage() {
  return (
    <LegalPage title="Política de Privacidade" updatedAt={UPDATED_AT}>
      <p>
        Esta política explica quais dados o Nudge coleta, para que os usa e
        quais são os seus direitos, conforme a Lei Geral de Proteção de Dados
        (LGPD, Lei nº 13.709/2018).
      </p>

      <h2>1. Quem é o responsável</h2>
      <p>
        O Nudge é um projeto pessoal mantido por Pedro. Para qualquer dúvida
        sobre seus dados, escreva para{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>2. Quais dados coletamos</h2>
      <ul>
        <li>
          <strong>Dados de cadastro:</strong> nome, e-mail e senha. A senha não
          é guardada em texto puro, apenas em formato protegido (hash).
        </li>
        <li>
          <strong>Suas tarefas:</strong> o nome, a descrição opcional, a ordem e
          a data de conclusão de cada tarefa que você cria.
        </li>
        <li>
          <strong>Sessão de login:</strong> um cookie necessário para manter
          você conectado, junto de um registro da sessão no banco de dados.
        </li>
        <li>
          <strong>Preferências:</strong> a cor e o fundo que você escolhe para o
          app.
        </li>
      </ul>

      <h2>3. Para que usamos os dados</h2>
      <ul>
        <li>Criar e manter a sua conta.</li>
        <li>Permitir que você entre no app e veja as suas tarefas.</li>
        <li>Guardar e exibir as suas preferências.</li>
      </ul>
      <p>Não vendemos os seus dados e não os usamos para publicidade.</p>

      <h2>4. Com quem os dados são compartilhados</h2>
      <p>
        Usamos serviços de terceiros apenas para o app funcionar: a hospedagem
        do site (Vercel) e o banco de dados (Neon). Esses serviços processam os
        dados em nosso nome, sob as regras deles. Fora isso, os dados só são
        compartilhados se a lei exigir.
      </p>

      <h2>5. Por quanto tempo guardamos</h2>
      <ul>
        <li>
          Os dados da conta e as tarefas ficam guardados enquanto a conta
          existir.
        </li>
        <li>
          Tarefas concluídas são apagadas automaticamente 10 dias após a
          conclusão.
        </li>
        <li>
          Ao excluir a conta, os seus dados são removidos do nosso banco de
          dados.
        </li>
      </ul>

      <h2>6. Cookies</h2>
      <p>
        O Nudge usa apenas o cookie de sessão, essencial para o login. Não
        usamos cookies de publicidade nem de rastreamento.
      </p>

      <h2>7. Seus direitos</h2>
      <p>
        Pela LGPD, você pode pedir a confirmação de que tratamos seus dados,
        acessá-los, corrigi-los, solicitar a exclusão e revogar o seu
        consentimento. Para isso, use as configurações do app ou escreva para{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>8. Segurança</h2>
      <p>
        Adotamos medidas técnicas para proteger os seus dados, como conexão
        segura (HTTPS), senhas protegidas e cookie de sessão inacessível ao
        JavaScript do navegador. Nenhum sistema é totalmente imune a falhas, e
        por isso não podemos garantir segurança absoluta.
      </p>

      <h2>9. Mudanças nesta política</h2>
      <p>
        Podemos atualizar esta política. Quando houver mudanças relevantes, a
        data no topo da página será atualizada.
      </p>
    </LegalPage>
  );
}
