"use client";

import Link from "next/link";
import Logo from "@/components/logo/logo";
import { registerUser } from "@/features/auth/services/authService";
import AuthForm from "@/features/auth/components/authForm";
import { type Mode, type AuthValues } from "@/features/auth/types/auth";

import styles from "./authPage.module.css";

export function AuthPage() {
  async function handleAuthSubmit(mode: Mode, values: AuthValues) {
    if (mode === "signup") {
      await registerUser(values);
    }
  }

  return (
    <main className={styles.auth}>
      <Link
        href="/"
        className={styles.logoLink}
        aria-label="Voltar para o início"
      >
        <Logo />
      </Link>
      <AuthForm onSubmit={handleAuthSubmit} />
    </main>
  );
}
