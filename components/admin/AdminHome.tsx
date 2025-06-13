import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, AreaChart, Area,
  ComposedChart, RadialBarChart, RadialBar
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, 
  Calendar, AlertTriangle, CheckCircle, Clock, 
  Activity, PieChart as PieChartIcon
} from 'lucide-react';
import { Ahorrador } from './AhorradoresCrud';
import { PrestamoData } from '@/lib/api/prestamos';

// Componente para mostrar una métrica con un icono y tendencia
const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral',
  description,
  formatter = (val: any) => val
}: { 
  title: string;
  value: any;
  icon: any;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  description?: string;
  formatter?: (val: any) => any;
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emerald-500/50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
          <p className="text-3xl font-bold text-white bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            {formatter(value)}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${
          changeType === 'positive' ? 'bg-emerald-500/20 text-emerald-400 shadow-emerald-500/20' : 
          changeType === 'negative' ? 'bg-red-500/20 text-red-400 shadow-red-500/20' : 
          'bg-gray-600/20 text-gray-400'
        } shadow-lg`}>
          <Icon size={24} />
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center mt-3">
          {changeType === 'positive' ? <TrendingUp size={18} className="text-emerald-400 mr-2" /> : 
           changeType === 'negative' ? <TrendingDown size={18} className="text-red-400 mr-2" /> : null}
          <span className={`text-sm font-medium ${
            changeType === 'positive' ? 'text-emerald-400' : 
            changeType === 'negative' ? 'text-red-400' : 
            'text-gray-400'
          }`}>
            {change > 0 ? '+' : ''}{change}% {changeType === 'positive' ? 'incremento' : changeType === 'negative' ? 'decremento' : ''} 
          </span>
        </div>
      )}
      {description && <p className="text-xs text-gray-500 mt-3">{description}</p>}
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

// Función para formatear fechas
const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function AdminHome() {
  const [ahorradores, setAhorradores] = useState<Ahorrador[]>([]);
  const [prestamos, setPrestamos] = useState<PrestamoData[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metricas, setMetricas] = useState({
    totalAhorros: 0,
    totalPrestamos: 0,
    interesGenerado: 0,
    saldoTotal: 0,
    totalAhorradores: 0,
    totalDeudores: 0,
    prestamosPorVencer: 0,
    prestamosVencidos: 0,
    tasaPromedio: 0,
    crecimientoMensual: 0
  });
  
  // Cargar datos de ahorradores y préstamos
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        // Cargar ahorradores
        const resAhorradores = await fetch('/api/ahorradores');
        if (!resAhorradores.ok) throw new Error('Error al cargar ahorradores');
        const dataAhorradores = await resAhorradores.json();
        
        // Cargar préstamos
        const resPrestamos = await fetch('/api/prestamos');
        if (!resPrestamos.ok) throw new Error('Error al cargar préstamos');
        const dataPrestamos = await resPrestamos.json();
        
        setAhorradores(dataAhorradores);
        setPrestamos(dataPrestamos);
        
        // Calcular métricas
        calcularMetricas(dataAhorradores, dataPrestamos);
      } catch (err: any) {
        console.error('Error al cargar datos:', err);
        setError(err.message || 'Error al cargar datos');
      } finally {
        setCargando(false);
      }
    };
    
    cargarDatos();
  }, []);
  
  // Calcular métricas basadas en los datos
  const calcularMetricas = (ahorradores: Ahorrador[], prestamos: PrestamoData[]) => {
    // Calcular totales
    const totalAhorros = ahorradores.reduce((sum, a) => sum + (a.ahorroTotal || 0), 0);
    const totalPrestamos = prestamos.reduce((sum, p) => sum + (p.monto || 0), 0);
    
    // Calcular interés generado por ahorros
    const interesGenerado = ahorradores.reduce((sum, a) => {
      if (!a.ahorroTotal) return sum;
      const tasaAnual = 6 + (a.incentivoPorFidelidad ? 1 : 0); // 6% o 7%
      return sum + Math.round(a.ahorroTotal * (tasaAnual / 100));
    }, 0);
    
    // Calcular saldo total (ahorros totales - préstamos totales)
    const saldoTotal = totalAhorros - totalPrestamos;
    
    // Contar ahorradores y deudores únicos
    const totalAhorradores = ahorradores.length;
    const cedulasDeudores = new Set(prestamos.map(p => p.cedula));
    const totalDeudores = cedulasDeudores.size;
    
    // Calcular préstamos por vencer (próximos 30 días) y vencidos
    const hoy = new Date();
    const treintaDiasDespues = new Date();
    treintaDiasDespues.setDate(hoy.getDate() + 30);
    
    const prestamosPorVencer = prestamos.filter(p => {
      if (p.estado !== 'Activo') return false;
      const fechaVencimiento = new Date(p.fechaVencimiento || '');
      return fechaVencimiento > hoy && fechaVencimiento <= treintaDiasDespues;
    }).length;
    
    const prestamosVencidos = prestamos.filter(p => {
      return p.estado === 'Vencido' || (
        p.estado === 'Activo' && 
        new Date(p.fechaVencimiento || '') < hoy
      );
    }).length;
    
    // Calcular tasa promedio de préstamos
    const tasaPromedio = prestamos.length > 0 
      ? prestamos.reduce((sum, p) => sum + p.tasaInteres, 0) / prestamos.length 
      : 0;
    
    // Calcular crecimiento mensual (simulado)
    const crecimientoMensual = 5.2; // Ejemplo, en un sistema real se calcularía con datos históricos
    
    setMetricas({
      totalAhorros,
      totalPrestamos,
      interesGenerado,
      saldoTotal,
      totalAhorradores,
      totalDeudores,
      prestamosPorVencer,
      prestamosVencidos,
      tasaPromedio,
      crecimientoMensual
    });
  };
  
  // Preparar datos para gráficos
  const prepararDatosPrestamos = () => {
    // Agrupar préstamos por mes
    const prestamosPorMes: Record<string, { total: number, count: number }> = {};
    
    prestamos.forEach(prestamo => {
      const fecha = new Date(prestamo.fechaDesembolso);
      const mesAno = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
      
      if (!prestamosPorMes[mesAno]) {
        prestamosPorMes[mesAno] = { total: 0, count: 0 };
      }
      
      prestamosPorMes[mesAno].total += prestamo.monto;
      prestamosPorMes[mesAno].count += 1;
    });
    
    // Convertir a array para el gráfico
    return Object.entries(prestamosPorMes)
      .map(([mes, datos]) => ({
        mes,
        total: datos.total,
        promedio: datos.count > 0 ? datos.total / datos.count : 0,
        cantidad: datos.count
      }))
      .sort((a, b) => {
        const [mesA, anoA] = a.mes.split('/').map(Number);
        const [mesB, anoB] = b.mes.split('/').map(Number);
        return (anoA - anoB) || (mesA - mesB);
      })
      .slice(-6); // Últimos 6 meses
  };
  
  const prepararDatosAhorros = () => {
    // Agrupar ahorros por mes basado en historialPagos
    const ahorrosPorMes: Record<string, number> = {};
    
    ahorradores.forEach(ahorrador => {
      Object.entries(ahorrador.historialPagos || {}).forEach(([mes, pago]) => {
        if (pago.pagado) {
          if (!ahorrosPorMes[mes]) {
            ahorrosPorMes[mes] = 0;
          }
          ahorrosPorMes[mes] += pago.monto;
        }
      });
    });
    
    // Convertir a array para el gráfico
    return Object.entries(ahorrosPorMes)
      .map(([mes, total]) => ({ mes, total }))
      .sort((a, b) => a.mes.localeCompare(b.mes))
      .slice(-6); // Últimos 6 meses
  };
  
  const prepararDistribucionPrestamos = () => {
    // Agrupar préstamos por estado
    const distribucion = {
      Activo: 0,
      Pagado: 0,
      Vencido: 0,
      Refinanciado: 0
    };
    
    prestamos.forEach(prestamo => {
      distribucion[prestamo.estado] += 1;
    });
    
    // Convertir a array para el gráfico
    return Object.entries(distribucion).map(([estado, cantidad]) => ({
      estado,
      cantidad,
      porcentaje: prestamos.length > 0 ? (cantidad / prestamos.length) * 100 : 0
    }));
  };

  const prepararDatosComparativos = () => {
    if (!Array.isArray(ahorradores) || !Array.isArray(prestamos)) {
      console.error('Datos de ahorradores o préstamos no son válidos');
      return [];
    }
  
    // Función para formatear fecha a "MM/YYYY"
    const formatearMes = (fecha: Date): string => {
      return `${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()}`;
    };
  
    // Función para comparar meses
    const compararMeses = (a: string, b: string): number => {
      const [mesA, anioA] = a.split('/').map(Number);
      const [mesB, anioB] = b.split('/').map(Number);
      return anioA !== anioB ? anioA - anioB : mesA - mesB;
    };
  
    // Obtener todos los meses únicos
    const mesesUnicos = new Set<string>();
  
    // Procesar meses de ahorradores
    ahorradores.forEach(ahorrador => {
      if (ahorrador.historialPagos) {
        Object.keys(ahorrador.historialPagos).forEach(mes => {
          if (mes) mesesUnicos.add(mes);
        });
      }
    });
  
    // Procesar meses de préstamos
    prestamos.forEach(prestamo => {
      if (!prestamo.fechaDesembolso) return;
      
      try {
        const fecha = new Date(prestamo.fechaDesembolso);
        if (!isNaN(fecha.getTime())) {
          mesesUnicos.add(formatearMes(fecha));
        }
      } catch (e) {
        console.error('Error al procesar fecha de desembolso:', prestamo.fechaDesembolso, e);
      }
    });
  
    // Ordenar y obtener últimos 6 meses
    const meses = Array.from(mesesUnicos)
      .sort(compararMeses)
      .slice(-6);
  
    // Procesar datos por mes
    return meses.map(mes => {
      try {
        // Calcular ahorros del mes
        const ahorros = ahorradores.reduce((sum, ahorrador) => {
          if (!ahorrador.historialPagos?.[mes]) return sum;
          
          const pago = ahorrador.historialPagos[mes];
          const monto = Number(pago?.monto) || 0;
          return sum + (pago?.pagado ? monto : 0);
        }, 0);
  
        // Filtrar y sumar préstamos del mes
        const totalPrestamos = prestamos.reduce((sum, prestamo) => {
          if (!prestamo.fechaDesembolso) return sum;
          
          try {
            const fechaPrestamo = new Date(prestamo.fechaDesembolso);
            const mesPrestamo = formatearMes(fechaPrestamo);
            return mesPrestamo === mes ? sum + (Number(prestamo.monto) || 0) : sum;
          } catch (e) {
            console.error('Error al procesar préstamo:', prestamo.fechaDesembolso, e);
            return sum;
          }
        }, 0);
  
        return {
          mes,
          ahorros,
          prestamos: totalPrestamos,
          saldo: ahorros - totalPrestamos
        };
      } catch (error) {
        console.error(`Error al procesar el mes ${mes}:`, error);
        return {
          mes,
          ahorros: 0,
          prestamos: 0,
          saldo: 0
        };
      }
    });
  };
  
  // Calcular próximos cobros (dentro de los próximos 7 días)
 // Calcular próximos cobros (dentro de los próximos 7 días)
  // Calcular próximos cobros (dentro de los próximos 7 días)
  // Calcular próximos cobros (dentro de los próximos 7 días)
  const calcularProximosCobros = () => {
  const hoy = new Date();
  const unaSemanaDespues = new Date();
  unaSemanaDespues.setDate(hoy.getDate() + 7);

  // Filtrar préstamos activos
  const prestamosActivos = prestamos.filter(p => p.estado === 'Activo' || p.estado === 'Vencido');

  // Calcular próximos cobros
  return prestamosActivos.flatMap(prestamo => {
    try {
      // Calcular cuota mensual (capital + interés)
      const tasaMensual = (prestamo.tasaInteres || 0) / 100 / 12;
      const plazoMeses = prestamo.plazoMeses || 1;
      const cuotaMensual = (prestamo.monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazoMeses)) || 0;

      // Calcular fechas de pago
      const fechaDesembolso = new Date(prestamo.fechaDesembolso || hoy);
      const fechaHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

      const proximosCobros = [];

      // Encontrar todas las cuotas pendientes o vencidas
      for (let i = 0; i < plazoMeses; i++) {
        const fechaPago = new Date(fechaDesembolso);
        fechaPago.setMonth(fechaPago.getMonth() + i + 1);
        
        // Normalizar fecha de pago para comparación
        const fechaPagoNormalizada = new Date(fechaPago.getFullYear(), fechaPago.getMonth(), fechaPago.getDate());

        // Verificar si la cuota ya fue pagada
        const cuotas = prestamo.cuotas || [];
        const cuotaPagada = cuotas.find((c: { numeroCuota: number; estado: string; }) => c.numeroCuota === (i + 1) && c.estado === 'Pagado');

        // Si la cuota ya está pagada, continuar con la siguiente
        if (cuotaPagada) {
          continue;
        }

        // Determinar el estado de la cuota
        let estado;
        let diasRestantes;
        
        if (fechaPagoNormalizada.getTime() === fechaHoy.getTime()) {
          estado = 'Pendiente';
          diasRestantes = 0;
        } else if (fechaPagoNormalizada.getTime() < fechaHoy.getTime()) {
          estado = 'Vencido';
          diasRestantes = Math.ceil((fechaPagoNormalizada.getTime() - fechaHoy.getTime()) / (1000 * 60 * 60 * 24));
        } else {
          estado = 'Próximo';
          diasRestantes = Math.ceil((fechaPagoNormalizada.getTime() - fechaHoy.getTime()) / (1000 * 60 * 60 * 24));
        }

        // Incluir cuotas que estén:
        // 1. Vencidas (fechas pasadas)
        // 2. Pendientes hoy
        // 3. Próximas (dentro de una semana)
        const esVencida = estado === 'Vencido';
        const esPendienteHoy = estado === 'Pendiente';
        const esProximaDentroDeUnaSemana = estado === 'Próximo' && fechaPagoNormalizada <= unaSemanaDespues;

        if (esVencida || esPendienteHoy || esProximaDentroDeUnaSemana) {
          proximosCobros.push({
            id: `${prestamo.id}-${i + 1}`,
            deudor: prestamo.nombreDeudor || 'Cliente',
            cedula: prestamo.cedula || '',
            fechaPago: fechaPago,
            cuota: cuotaMensual,
            numeroCuota: i + 1,
            totalCuotas: plazoMeses,
            estado,
            diasRestantes
          });
        }
      }

      return proximosCobros;
    } catch (error) {
      console.error('Error al calcular próximos cobros:', error);
      return [];
    }
  });
};

  
  // Datos para gráficos
  const datosPrestamos = prepararDatosPrestamos();
  const datosAhorros = prepararDatosAhorros();
  const distribucionPrestamos = prepararDistribucionPrestamos();
  const datosComparativos = prepararDatosComparativos();
  const proximosCobros = calcularProximosCobros();
  
  // Colores para gráficos
  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700 p-6 rounded-xl text-red-400 shadow-lg">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <AlertTriangle className="mr-2" size={24} />
          Error al cargar datos
        </h2>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
          Análisis Financiero
        </h2>
        <p className="text-gray-400 text-lg">
          Métricas y análisis del fondo de ahorros CROMU Finance Services
        </p>
      </div>
      
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Ahorros"
          value={metricas.totalAhorros}
          icon={DollarSign}
          formatter={formatearMoneda}
        />
        <MetricCard
          title="Interés Generado"
          value={metricas.interesGenerado}
          icon={TrendingUp}
          formatter={formatearMoneda}
        />
        <MetricCard
          title="Total de Préstamos"
          value={metricas.totalPrestamos}
          icon={DollarSign}
          formatter={formatearMoneda}
        />
      </div>
      
      {/* Métricas secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <MetricCard
          title="Total Ahorradores"
          value={metricas.totalAhorradores}
          icon={Users}
        />
        <MetricCard
          title="Total Deudores"
          value={metricas.totalDeudores}
          icon={Users}
        />
      </div>
      
      {/* Gráfico comparativo principal */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Activity className="mr-3 text-emerald-400" size={28} />
          Flujo de Efectivo Mensual
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={datosComparativos}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <defs>
                <linearGradient id="colorAhorros" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPrestamos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#50A58D" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#50A58D" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
              <XAxis 
                dataKey="mes" 
                stroke="hsl(var(--muted-foreground))"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12, fontWeight: 500, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                width={90}
                tick={{ fontSize: 12, fontWeight: 500, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  formatearMoneda(value),
                  name === 'ahorros' ? 'Ahorros' : name === 'prestamos' ? 'Préstamos' : 'Saldo Neto'
                ]}
                labelFormatter={(label) => `Mes: ${label}`}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  borderColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--foreground))',
                  borderRadius: 'var(--radius)',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ paddingTop: '10px', fontSize: '14px', fontWeight: '500' }}
              />
              <Area 
                type="monotone" 
                dataKey="ahorros" 
                name="Ahorros" 
                stroke="#10B981" 
                fill="url(#colorAhorros)"
                strokeWidth={3}
              />
              <Area 
                type="monotone" 
                dataKey="prestamos" 
                name="Préstamos" 
                stroke="#3B82F6" 
                fill="url(#colorPrestamos)"
                strokeWidth={3}
              />
              <Line 
                type="monotone" 
                dataKey="saldo" 
                name="Saldo Neto" 
                stroke="#F59E0B" 
                strokeWidth={4}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#F59E0B', strokeWidth: 2, fill: '#FEF3C7' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Gráficos secundarios mejorados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Evolución de préstamos */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <TrendingUp className="mr-3 text-blue-400" size={24} />
            Evolución de Préstamos
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={datosPrestamos}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="mes" 
                  stroke="#9CA3AF"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12, fontWeight: 500 }}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  width={80}
                  tick={{ fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  formatter={(value: any) => formatearMoneda(value)}
                  labelFormatter={(label) => `Mes: ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#3B82F6',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                  }}
                />
                <Bar 
                  dataKey="total" 
                  name="Monto Total" 
                  fill="url(#barGradient)" 
                  radius={[8, 8, 0, 0]}
                  strokeWidth={1}
                  stroke="#3B82F6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Distribución de préstamos mejorada */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <PieChartIcon className="mr-3 text-purple-400" size={24} />
            Distribución de Préstamos
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  {COLORS.map((color, index) => (
                    <linearGradient key={index} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                      <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
                    </linearGradient>
                  ))}
                </defs>
                <Pie
  data={distribucionPrestamos}
  cx="50%"
  cy="50%"
  labelLine={false}
  outerRadius={100}
  innerRadius={40}
  fill="#8884d8"
  dataKey="cantidad"
  nameKey="estado"
  label={({ 
    estado, 
    porcentaje 
  }: {
    estado: string;
    porcentaje: number;
  }) => (
    <text 
      x={0} 
      y={0} 
      dy={8} 
      textAnchor="middle" 
      fill="#fff"
      style={{
        fontSize: '12px',
        fontWeight: 600,
        pointerEvents: 'none'
      }}
    >
      {`${estado}: ${porcentaje.toFixed(1)}%`}
    </text>
  )}
>
  {distribucionPrestamos.map((entry, index) => (
    <Cell 
      key={`cell-${index}`} 
      fill={`url(#pieGradient${index})`}
      stroke={COLORS[index % COLORS.length]}
      strokeWidth={2}
    />
  ))}
</Pie>
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${value} préstamos (${props.payload.porcentaje.toFixed(1)}%)`, 
                    props.payload.estado
                  ]}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#8B5CF6',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
           {/* Próximos cobros mejorado */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Calendar className="mr-3 text-emerald-400" size={24} />
          Próximos Cobros
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Deudor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Próximo Pago</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Monto</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Progreso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {proximosCobros.length > 0 ? (
                proximosCobros.map((cobro, index) => {
                  const progreso = Math.round(((cobro.numeroCuota - 1) / cobro.totalCuotas) * 100);
                  const estaVencido = cobro.estado === 'Vencido';
                  
                  return (
                    <tr key={index} className={`hover:bg-gray-700/50 transition-colors ${estaVencido ? 'bg-red-900/20' : ''}`}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-gray-300 font-medium">
                              {cobro.deudor?.charAt(0) || 'C'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{cobro.deudor || 'Cliente'}</div>
                            <div className="text-xs text-gray-400">C.C. {cobro.cedula || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              estaVencido 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              <Calendar size={16} />
                            </div>
                          </div>
                          <div>
                            <div className={`text-sm font-medium ${estaVencido ? 'text-red-400' : 'text-white'}`}>
                              {formatearFecha(cobro.fechaPago.toISOString())}
                            </div>
                            <div className="text-xs text-gray-400">
                              Cuota {cobro.numeroCuota} de {cobro.totalCuotas}
                              {cobro.diasRestantes !== undefined && (
                                <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${
                                  cobro.diasRestantes <= 1 
                                    ? 'bg-red-500/20 text-red-400' 
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {cobro.diasRestantes <= 0 
                                    ? 'Hoy' 
                                    : cobro.diasRestantes === 1 
                                      ? 'Mañana' 
                                      : `En ${cobro.diasRestantes} días`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className={`text-sm font-medium ${estaVencido ? 'text-red-400' : 'text-white'}`}>
                          {formatearMoneda(cobro.cuota)}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          estaVencido 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {cobro.estado}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                estaVencido 
                                  ? 'bg-gradient-to-r from-red-500 to-red-400' 
                                  : 'bg-gradient-to-r from-emerald-500 to-green-400'
                              }`}
                              style={{ 
                                width: `${progreso}%`
                              }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs font-medium text-gray-300 w-12 text-right">
                            {progreso}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No hay cobros pendientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {proximosCobros.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
            <div>
              Mostrando <span className="text-white font-medium">{proximosCobros.length}</span> de {proximosCobros.length} registros
            </div>
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                disabled={true}
              >
                Anterior
              </button>
              <button 
                className="px-3 py-1 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                disabled={true}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}