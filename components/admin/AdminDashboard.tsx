'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, DollarSign, Activity } from 'lucide-react';

export function AdminDashboard() {
  // Datos de ejemplo para el dashboard
  const stats = [
    {
      title: 'Usuarios Totales',
      value: '1,234',
      icon: Users,
      description: '+20% desde el mes pasado',
    },
    {
      title: 'Ingresos',
      value: '$45,231',
      icon: DollarSign,
      description: '+12% desde el mes pasado',
    },
    {
      title: 'Préstamos Activos',
      value: '235',
      icon: CreditCard,
      description: '+19% desde el mes pasado',
    },
    {
      title: 'Tasa de Aprobación',
      value: '95%',
      icon: Activity,
      description: '+5% desde el mes pasado',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Aquí puedes agregar más componentes del dashboard como gráficos, tablas, etc. */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">
              Gráficos y estadísticas detalladas irán aquí
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
