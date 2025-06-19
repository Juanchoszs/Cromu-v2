"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  // Validar el token al cargar la página
  useEffect(() => {
    const validateToken = async () => {
      if (!email || !token) {
        setError("Enlace de restablecimiento inválido.");
        setIsValidToken(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/validate-reset-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token }),
        });

        if (!response.ok) {
          throw new Error("Token inválido o expirado");
        }

        setIsValidToken(true);
      } catch (err) {
        setError("El enlace de restablecimiento es inválido o ha expirado. Por favor, solicita un nuevo enlace.");
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [email, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al restablecer la contraseña.");
      }

      setMessage("¡Contraseña restablecida con éxito! Redirigiendo al espacio de usuario...");
      
      // Redirigir al espacio de usuario después de 3 segundos
      setTimeout(() => {
        router.push("/espacio");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Error al restablecer la contraseña. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-4">Restablecer clave</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Ingresa tu nueva clave para el correo: <span className="font-semibold">{email}</span>
        </p>
        {message && <div className="bg-emerald-100 text-emerald-700 p-3 rounded-md mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nueva clave
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirmar clave
            </label>
            <input
              type="password"
              id="confirm"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-3 rounded-md transition-all duration-300 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Restableciendo..." : "Restablecer clave"}
          </button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => router.push('/espacio')}
              className="text-emerald-700 dark:text-emerald-400 hover:underline text-sm font-medium"
            >
              ← Volver al inicio de sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}