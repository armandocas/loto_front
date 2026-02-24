import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Senha - LotoSmart",
  description: "Recupere sua senha do LotoSmart",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
