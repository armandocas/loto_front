"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/firebase/providers";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut,
  resetPassword,
} from "@/lib/firebase/auth";
import { ROUTES } from "@/constants/routes";

export function useAuth() {
  const { user, loading, firebaseUser } = useAuthContext();
  const router = useRouter();

  async function login(email: string, password: string) {
    const credential = await signInWithEmail(email, password);
    router.push(ROUTES.dashboard);
    return credential;
  }

  async function register(email: string, password: string, name: string) {
    const credential = await signUpWithEmail(email, password, name);
    router.push(ROUTES.dashboard);
    return credential;
  }

  async function loginWithGoogle() {
    const credential = await signInWithGoogle();
    router.push(ROUTES.dashboard);
    return credential;
  }

  async function logout() {
    await signOut();
    router.push(ROUTES.home);
  }

  async function forgotPassword(email: string) {
    await resetPassword(email);
  }

  return {
    user,
    loading,
    firebaseUser,
    isAuthenticated: !!user,
    login,
    register,
    loginWithGoogle,
    logout,
    forgotPassword,
  };
}
