"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, Wallet } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const translations = {
    es: {
      title: "Recuperar acceso",
      subtitle: "¿Olvidaste tu clave?",
      description: "Ingresa tu correo y te enviaremos instrucciones para restablecer tu clave.",
      email: "Correo electrónico",
      send: "Enviar",
      sending: "Enviando...",
      success: "Si el correo está registrado, recibirás instrucciones pronto.",
      error: "Hubo un error. Intenta de nuevo.",
      back: "Volver al inicio de sesión",
    },
    en: {
      title: "Password recovery",
      subtitle: "Forgot your password?",
      description: "Enter your email and we will send you instructions to reset your password.",
      email: "Email",
      send: "Send",
      sending: "Sending...",
      success: "If the email is registered, you will receive instructions soon.",
      error: "There was an error. Please try again.",
      back: "Back to login",
    },
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t(translations).error);
      }

      // Mostrar mensaje de éxito aunque el correo no exista (por seguridad)
      setMessage(t(translations).success);
    } catch (error: any) {
      console.error("Error al solicitar recuperación de contraseña:", error);
      setError(error.message || t(translations).error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden w-full max-w-md">
        <div className="bg-emerald-800 text-white p-8 flex items-center">
          <Wallet className="w-8 h-8 mr-2" />
          <h1 className="text-2xl font-bold">CROMU</h1>
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2">{t(translations).title}</h2>
          <h3 className="text-lg mb-4 text-emerald-700 dark:text-emerald-300">{t(translations).subtitle}</h3>
          <p className="mb-6 text-gray-600 dark:text-gray-300">{t(translations).description}</p>
          {message && <div className="bg-emerald-100 text-emerald-700 p-3 rounded-md mb-4 text-sm">{message}</div>}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t(translations).email}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder={t(translations).email}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-3 rounded-md transition-all duration-300 flex items-center justify-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? t(translations).sending : t(translations).send}
              {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              {t(translations).back}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}