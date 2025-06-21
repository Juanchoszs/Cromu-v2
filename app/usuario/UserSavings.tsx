"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PiggyBank, Download } from "lucide-react";
import GenerarVoucher from "@/components/admin/GenerarVoucher";
import { Button } from "@/components/ui/button";

export interface Consignacion {
  fecha: string;
  monto: number;
  descripcion?: string;
}

export interface PagoMensual {
  pagado: boolean;
  monto: number;
  consignaciones: Consignacion[];
}

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
  historialPagos: Record<string, PagoMensual>;
  incentivoPorFidelidad: boolean;
}

interface UserSavingsProps {
  fullView?: boolean;
  ahorros?: Ahorrador | null;
}

const formatearMoneda = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
};

const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function UserSavings({ ahorros: initialAhorros = null }: UserSavingsProps) {
  const [ahorrador, setAhorrador] = useState<Ahorrador | null>(initialAhorros);
  const [isLoading, setIsLoading] = useState(!initialAhorros);
  const [error, setError] = useState<string | null>(null);
  const [mostrarVoucher, setMostrarVoucher] = useState(false);

  useEffect(() => {
    const cargarAhorros = async () => {
      if (initialAhorros) return;
      
      try {
        setIsLoading(true);
        const cedula = sessionStorage.getItem("cedulaAhorrador");
        if (!cedula) {
          setError("No se ha iniciado sesión con una cédula válida");
          return;
        }
        const response = await fetch(`/api/ahorradores/buscar?cedula=${cedula}`);
        if (!response.ok) throw new Error("Error al obtener ahorros");
        const data: Ahorrador = await response.json();
        setAhorrador(data);
      } catch (err) {
        console.error('Error loading savings:', err);
        setError("No se pudo cargar la información de ahorros");
      } finally {
        setIsLoading(false);
      }
    };

    cargarAhorros();
  }, [initialAhorros]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-emerald-600" />
            Ahorros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Cargando ahorros...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error || !ahorrador) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-emerald-600" />
            Ahorros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            {error || 'No tienes ahorros registrados'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalConsignado = Object.values(ahorrador.historialPagos || {}).reduce(
    (sum, pago) => sum + (pago?.monto || 0), 0
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-emerald-600" />
            Ahorros
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setMostrarVoucher(true)}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Voucher
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Ahorrado</p>
              <p className="text-lg font-semibold">
                {formatearMoneda(ahorrador.ahorroTotal)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Consignado</p>
              <p className="text-lg font-semibold">
                {formatearMoneda(totalConsignado)}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Miembro desde:</span>{' '}
              <span>{formatearFecha(ahorrador.fechaIngreso)}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Pagos consecutivos:</span>{' '}
              <span>{ahorrador.pagosConsecutivos}</span>
            </p>
            {ahorrador.incentivoPorFidelidad && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                ¡Tienes un incentivo por fidelidad activo! 🎉
              </p>
            )}
          </div>

          {Object.keys(ahorrador.historialPagos || {}).length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Historial de pagos</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Mes
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Monto
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {Object.entries(ahorrador.historialPagos)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([mes, pago]) => (
                        <tr key={mes}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            {mes}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                            {formatearMoneda(pago.monto)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                pago.pagado 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}
                            >
                              {pago.pagado ? 'Pagado' : 'Pendiente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {mostrarVoucher && ahorrador && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 relative">
            <button
              onClick={() => setMostrarVoucher(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">Cerrar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <GenerarVoucher ahorrador={ahorrador} onClose={() => setMostrarVoucher(false)} />
          </div>
        </div>
      )}
    </Card>
  );
}