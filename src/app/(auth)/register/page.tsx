import { RegisterForm } from "@/components/auth/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar Conta - LotoSmart",
  description: "Crie sua conta no LotoSmart e comece a gerar jogos inteligentes",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
