import React, { useState, useEffect } from 'react';
import { DollarSign,  Users } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

// Componente para mostrar una métrica con un icono, ahora con opción de ancho personalizado
const MetricCard = ({
  title,
  value,
  icon: Icon,
  formatter = (val: any) => val,
  className = ""
}: {
  title: string;
  value: any;
  icon: any;
  formatter?: (val: any) => any;
  className?: string;
}) => {
  return (
    <div
      className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg flex flex-col items-start ${className}`}
    >
      <div className="flex justify-between items-center w-full mb-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <Icon size={24} className="text-emerald-400" />
      </div>
      <p className="text-3xl font-bold text-white break-words">{formatter(value)}</p>
    </div>
  );
};

// Función para formatear moneda colombiana
const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
};

export default function AdminHome() {
  const [metricas, setMetricas] = useState({
    totalAhorros: 0,
    totalPrestamos: 0,
    totalAhorradores: 0,
    totalDeudores: 0
  });

  useEffect(() => {
    const cargarMetricas = async () => {
      try {
        // Cargar préstamos
        const resPrestamos = await fetch('/api/prestamos');
        const prestamos = await resPrestamos.json();

        // Cargar ahorradores
        const resAhorradores = await fetch('/api/ahorradores');
        const ahorradores = await resAhorradores.json();

        // Sumar el monto de todos los préstamos
        const totalPrestamos = prestamos.reduce(
          (sum: number, p: any) => sum + (Number(p.monto) || 0),
          0
        );

        // Sumar el total ahorrado
        let totalAhorros = 0;
        ahorradores.forEach((a: any) => {
          totalAhorros += Number(a.ahorroTotal) || 0;
        });

        setMetricas({
          totalAhorros,
          totalPrestamos,
          totalAhorradores: ahorradores.length,
          totalDeudores: prestamos.length,
        });
      } catch {
        // Si hay error, deja los valores en 0
      }
    };

    cargarMetricas();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Ahorros"
          value={metricas.totalAhorros}
          icon={DollarSign}
          formatter={formatearMoneda}
          className="sm:col-span-2 lg:col-span-2 min-w-0"
        />
        <MetricCard
          title="Total de Préstamos"
          value={metricas.totalPrestamos}
          icon={DollarSign}
          formatter={formatearMoneda}
          className="sm:col-span-2 lg:col-span-2 min-w-0"
        />
        <MetricCard
          title="Total Ahorradores"
          value={metricas.totalAhorradores}
          icon={Users}
          className="sm:col-span-1 lg:col-span-1 min-w-0"
        />
        <MetricCard
          title="Total Deudores"
          value={metricas.totalDeudores}
          icon={Users}
          className="sm:col-span-1 lg:col-span-1 min-w-0"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Gráfico de barras */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Ahorros vs Préstamos</h3>
          <Bar
            data={{
              labels: ['Total de Ahorros', 'Total de Préstamos'],
              datasets: [
                {
                  label: 'Monto',
                  data: [metricas.totalAhorros, metricas.totalPrestamos],
                  backgroundColor: ['#10b981', '#2563eb'],
                  borderRadius: 8,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: { callbacks: { label: ctx => formatearMoneda(Number(ctx.raw)) } }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: '#fff',
                    callback: value => formatearMoneda(Number(value))
                  }
                },
                x: {
                  ticks: { color: '#fff' }
                }
              }
            }}
          />
        </div>

        {/* Gráfico de pastel */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Distribución</h3>
          <Pie
            data={{
              labels: ['Ahorradores', 'Deudores'],
              datasets: [
                {
                  data: [metricas.totalAhorradores, metricas.totalDeudores],
                  backgroundColor: ['#10b981', '#f59e42'],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom', labels: { color: '#fff' } },
                tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.raw}` } }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}