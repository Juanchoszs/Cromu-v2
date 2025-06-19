"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PiggyBank, HandCoins, TrendingUp, AlertCircle } from "lucide-react";
import { UserSavings } from "./UserSavings";
import { UserLoans } from "./UserLoans";

interface DashboardData {
  ahorroTotal: number;
  totalPrestamos: number;
  prestamosActivos: number;
  proximoPago?: {
    fecha: string;
    monto: number;
  };
}

export function UserDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    ahorroTotal: 0,
    totalPrestamos: 0,
    prestamosActivos: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setIsLoading(true);
        const cedula = sessionStorage.getItem("cedulaAhorrador");
        if (!cedula) {
          setError("No se ha iniciado sesión con una cédula válida");
          return;
        }

        // Simulamos la carga de datos
        // En producción, reemplazar con llamadas a la API real
        const [ahorrosRes, prestamosRes] = await Promise.all([
          fetch(`/api/ahorradores/buscar?cedula=${cedula}`),
          fetch(`/api/prestamos/usuario/${cedula}`)
        ]);

        if (!ahorrosRes.ok || !prestamosRes.ok) {
          throw new Error("Error al cargar los datos del dashboard");
        }

        const [ahorros, prestamos] = await Promise.all([
          ahorrosRes.json(),
          prestamosRes.json()
        ]);

        const prestamosActivos = Array.isArray(prestamos) 
          ? prestamos.filter((p: any) => p.estado === 'Activo').length 
          : 0;
        
        const totalPrestamos = Array.isArray(prestamos)
          ? prestamos.reduce((sum: number, p: any) => sum + (p.monto || 0), 0)
          : 0;

        setDashboardData({
          ahorroTotal: ahorros?.ahorroTotal || 0,
          totalPrestamos,
          prestamosActivos,
          proximoPago: prestamos[0]?.proximoPago
        });

      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError("No se pudieron cargar los datos del dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }


  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-900">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-lg font-medium text-red-600 dark:text-red-400">
              Error al cargar el dashboard
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Reintentar
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Ahorrado</CardTitle>
            <PiggyBank className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatearMoneda(dashboardData.ahorroTotal)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +20.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Préstamos Activos</CardTitle>
            <HandCoins className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.prestamosActivos}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {dashboardData.totalPrestamos > 0 
                ? `Total: ${formatearMoneda(dashboardData.totalPrestamos)}`
                : 'No tienes préstamos activos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Próximo Pago</CardTitle>
            <TrendingUp className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            {dashboardData.proximoPago ? (
              <>
                <div className="text-2xl font-bold">
                  {formatearMoneda(dashboardData.proximoPago.monto)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Vence el {new Date(dashboardData.proximoPago.fecha).toLocaleDateString('es-CO')}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No hay pagos pendientes
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <UserSavings fullView={true} />
        <UserLoans fullView={true} />
      </div>
    </div>
  );
}