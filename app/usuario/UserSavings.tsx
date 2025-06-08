"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PiggyBank, Download } from "lucide-react";
import GenerarVoucher from "@/components/admin/GenerarVoucher";
import { Button } from "@/components/ui/button";

export interface Ahorrador {
  id: string;
  nombre: string;
  cedula: string;
  fechaIngreso: string;
  telefono: string;
  direccion: string;
  email: string;
  ahorroTotal: number;
  pagosConsecutivos: number;
  historialPagos: Record<string, { 
    pagado: boolean; 
    monto: number;
    consignaciones: Array<{
      fecha: string;
      monto: number;
      descripcion?: string;
    }>;
  }>;
  incentivoPorFidelidad: boolean;
}

export function UserSavings({ fullView = false }: { fullView?: boolean }) {
  const [ahorrador, setAhorrador] = useState<Ahorrador | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarVoucher, setMostrarVoucher] = useState(false);

  useEffect(() => {
    const cedula = typeof window !== "undefined" ? sessionStorage.getItem("cedulaAhorrador") : null;
    if (!cedula) {
      setError("No se ha iniciado sesión con una cédula válida");
      setIsLoading(false);
      return;
    }
    fetch(`/api/ahorradores/buscar?cedula=${cedula}`)
      .then(res => res.ok ? res.json() : Promise.reject("No encontrado"))
      .then(data => setAhorrador(data))
      .catch(() => setError("No se pudo cargar el ahorrador"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-emerald-600" />
            Ahorros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Cargando ahorros...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error || !ahorrador) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-emerald-600" />
            Ahorros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            {error || "No tienes ahorros registrados."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full h-full shadow-lg border-emerald-100 dark:border-emerald-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xl font-bold">
            <PiggyBank className="h-6 w-6" />
            Ahorros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-500 dark:text-gray-400 text-xs">Nombre:</div>
              <div className="font-semibold">{ahorrador.nombre}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">Cédula:</div>
              <div className="font-semibold">{ahorrador.cedula}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">Ahorro total:</div>
              <div className="font-bold text-emerald-700 dark:text-emerald-300">
                ${ahorrador.ahorroTotal.toLocaleString("es-CO")}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">Pagos consecutivos:</div>
              <div className="font-semibold">{ahorrador.pagosConsecutivos}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">Incentivo por fidelidad:</div>
              <div>
                {ahorrador.incentivoPorFidelidad ? (
                  <span className="inline-block bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded text-xs font-semibold">Sí</span>
                ) : (
                  <span className="inline-block bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-0.5 rounded text-xs font-semibold">No</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-base font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Historial de pagos</h3>
            <div className="w-full overflow-x-auto rounded-lg bg-gray-50 dark:bg-gray-800 p-3 shadow-inner">
              <table className="min-w-[500px] w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-1 px-2 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Mes</th>
                    <th className="text-left py-1 px-2 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Monto</th>
                    <th className="text-left py-1 px-2 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(ahorrador.historialPagos)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([mes, pago]) => (
                      <tr key={mes} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-1 px-2 whitespace-nowrap">{mes}</td>
                        <td className="py-1 px-2 font-medium whitespace-nowrap">
                          ${pago.monto.toLocaleString("es-CO")}
                        </td>
                        <td className="py-1 px-2 whitespace-nowrap">
                          {pago.pagado ? (
                            <span className="text-green-600 dark:text-green-400 font-medium">Pagado</span>
                          ) : (
                            <span className="text-yellow-600 dark:text-yellow-400 font-medium">Pendiente</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setMostrarVoucher(true)}
          >
            <Download className="h-4 w-4" />
            Descargar voucher de ahorrador
          </Button>
        </CardFooter>
      </Card>
      {mostrarVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setMostrarVoucher(false)}
            >
              ×
            </button>
            <GenerarVoucher ahorrador={ahorrador} onClose={() => setMostrarVoucher(false)} />
          </div>
        </div>
      )}
    </>
  );
}