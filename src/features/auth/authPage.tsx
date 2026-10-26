"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/logo";
import authService from "@/features/auth/services/authService";
import AuthForm from "@/features/auth/components/authForm";
import { type FormMode, type AuthValues } from "@/features/auth/types/auth";

import styles from "./authPage.module.css";

export function AuthPage() {
  const router = useRouter();

  async function handleAuthSubmit(mode: FormMode, values: AuthValues) {
    if (mode === "signup") {
      await authService.registerUser(values);
    }

    await authService.loginUser(values);
    router.push("/task");
    router.refresh();
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.home}>
          <Logo size={28} />
        </Link>
      </header>
      <main className={styles.main}>
        <AuthForm onSubmit={handleAuthSubmit} />
      </main>
    </div>
  );
}
