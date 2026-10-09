"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/logo/logo";
import authService from "@/features/auth/services/authService";
import AuthForm from "@/features/auth/components/authForm";
import { type Mode, type AuthValues } from "@/features/auth/types/auth";

import styles from "./authPage.module.css";

export function AuthPage() {
  const router = useRouter();

  async function handleAuthSubmit(mode: Mode, values: AuthValues) {
    if (mode === "signup") {
      await authService.registerUser(values);
    }

    await authService.loginUser(values);

    router.push("/task");
    router.refresh();
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
