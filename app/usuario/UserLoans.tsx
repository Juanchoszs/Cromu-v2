"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreditCard, Download, AlertCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import GenerarVoucherPrestamos from "@/components/admin/GenerarVoucherPrestamos";

type EstadoPrestamo = 'Activo' | 'Pagado' | 'Vencido' | 'En mora' | 'Aprobado' | 'Rechazado' | 'Pendiente' | 'Refinanciado';
type EstadoCuota = "pendiente" | "pagado" | "aplazado";
type TipoPago = 'Capital' | 'Interés' | 'Mixto' | 'Parcial';

interface SubCuota {
  numero: string;
  estado: EstadoCuota;
  monto: number;
  fecha_pago?: string;
  fecha_creacion?: string;
}

interface CuotaPago {
  estado: EstadoCuota;
  monto: number;
  fecha_pago?: string;
  fecha_aplazamiento?: string;
  subcuotas: SubCuota[];
}

interface HistorialPagos {
  [numero: string]: CuotaPago;
}

interface PagoCuota {
  id: string;
  fecha: string;
  monto: number;
  tipo: TipoPago;
  comprobante?: string;
  estado: EstadoCuota;
  metodoPago?: string;
  referencia?: string;
}

interface CuotaPrestamo {
  numero: number;
  fechaVencimiento: string;
  monto: number;
  capital: number;
  interes: number;
  estado: EstadoCuota;
  saldoPendiente?: number;
}

interface Prestamo {
  id: string;
  nombreDeudor: string;
  cedula: string;
  telefono: string;
  direccion: string;
  monto: number;
  montoAprobado: number;
  tasaInteres: number;
  plazoMeses: number;
  fechaSolicitud: string;
  fechaDesembolso: string;
  fechaVencimiento?: string;
  garantia: string;
  estado: EstadoPrestamo;
  motivo?: string;
  descripcion?: string;
  cuotas?: CuotaPrestamo[];
  pagos?: PagoCuota[];
  garantes?: Array<{
    nombre: string;
    cedula: string;
    telefono: string;
  }>;
  documentos?: Array<{
    tipo: string;
    url: string;
    estado: 'Aprobado' | 'Pendiente' | 'Rechazado';
  }>;
  historialPagos?: HistorialPagos;
}

interface UserLoansProps {
  fullView?: boolean;
  prestamos?: Prestamo[];
  className?: string;
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
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getEstadoBadgeClass = (estado: EstadoPrestamo): string => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  switch (estado) {
    case 'Activo':
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
    case 'Pagado':
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
    case 'Vencido':
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
    case 'En mora':
      return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
    case 'Aprobado':
      return `${baseClasses} bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200`;
    case 'Rechazado':
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
    case 'Pendiente':
      return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`;
    case 'Refinanciado':
      return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
  }
};

export function UserLoans({ 
  fullView = false, 
  prestamos: initialPrestamos = [],
  className = '' 
}: UserLoansProps) {
  const [prestamos, setPrestamos] = useState<Prestamo[]>(initialPrestamos);
  const [isLoading, setIsLoading] = useState(!initialPrestamos.length);
  const [error, setError] = useState<string | null>(null);
  const [mostrarVoucher, setMostrarVoucher] = useState(false);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState<Prestamo | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const cargarPrestamos = async (isRefresh = false) => {
    if (initialPrestamos.length > 0 && !isRefresh) return;
    
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      setError(null);
      
      const cedula = sessionStorage.getItem("cedulaAhorrador");
      if (!cedula) {
        throw new Error("No se ha iniciado sesión con una cédula válida");
      }
      
      const response = await fetch(`/api/prestamos?cedula=${cedula}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al cargar los préstamos');
      }
      
      const data: Prestamo[] = await response.json();
      setPrestamos(data);
    } catch (err) {
      console.error('Error loading loans:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar los préstamos');
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    cargarPrestamos();
  }, [initialPrestamos.length]);

  const handleVerVoucher = (prestamo: Prestamo) => {
    const fechaActual = new Date().toISOString().split('T')[0];
    
    const voucherData: Prestamo = {
      ...prestamo,
      // Asegurar campos requeridos
      nombreDeudor: prestamo.nombreDeudor || 'No especificado',
      cedula: prestamo.cedula || '',
      telefono: prestamo.telefono || '',
      direccion: prestamo.direccion || 'No especificada',
      // Proporcionar fecha de desembolso por defecto si no existe
      fechaDesembolso: prestamo.fechaDesembolso || fechaActual,
      // Asegurar garantía
      garantia: prestamo.garantia || 'Sin garantía especificada',
      // Asegurar historial de pagos
      historialPagos: prestamo.historialPagos || {},
      // Asegurar montoAprobado
      montoAprobado: prestamo.montoAprobado || prestamo.monto
    };
    
    setPrestamoSeleccionado(voucherData);
    setMostrarVoucher(true);
  };

  const handleRefresh = () => {
    cargarPrestamos(true);
  };

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              <span>Mis Préstamos</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            Mis Préstamos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="mt-2">
              <p>{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cargando...
                  </>
                ) : 'Reintentar'}
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (prestamos.length === 0) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            Mis Préstamos
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <CreditCard className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No hay préstamos</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No se encontraron préstamos registrados en tu cuenta.
          </p>
          <Button variant="outline" className="mt-4" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : 'Actualizar'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            <span>Mis Préstamos</span>
            {prestamos.length > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                {prestamos.length} {prestamos.length === 1 ? 'préstamo' : 'préstamos'}
              </span>
            )}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            {isRefreshing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <span>↻</span>
            )}
            <span className="sr-only">Actualizar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prestamos.map((prestamo) => {
            const proximaCuota = prestamo.cuotas?.find(c => c.estado === 'pendiente');
            const totalPendiente = prestamo.cuotas
              ?.filter(c => c.estado === 'pendiente' || c.estado === 'aplazado')
              .reduce((sum, c) => sum + c.monto, 0);

            return (
              <div key={prestamo.id} className="border rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          Préstamo #{prestamo.id.substring(0, 6).toUpperCase()}
                        </h3>
                        <span className={getEstadoBadgeClass(prestamo.estado)}>
                          {prestamo.estado}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Monto</p>
                          <p className="font-medium">{formatearMoneda(prestamo.montoAprobado)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tasa de interés</p>
                          <p className="font-medium">{prestamo.tasaInteres}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Plazo</p>
                          <p className="font-medium">{prestamo.plazoMeses} meses</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Fecha de desembolso</p>
                          <p className="font-medium">
                            {prestamo.fechaDesembolso 
                              ? formatearFecha(prestamo.fechaDesembolso) 
                              : 'Pendiente'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVerVoucher(prestamo)}
                        className="w-full sm:w-auto flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Ver detalles
                      </Button>
                    </div>
                  </div>

                  {(proximaCuota || totalPendiente) && (
                    <div className="mt-4 pt-3 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {proximaCuota && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">Próximo pago:</span>
                              <span>{formatearMoneda(proximaCuota.monto)}</span>
                              <span className="text-xs text-gray-500">
                                vence {formatearFecha(proximaCuota.fechaVencimiento)}
                              </span>
                            </div>
                          </div>
                        )}
                        {totalPendiente && totalPendiente > 0 && (
                          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">Total pendiente:</span>
                              <span>{formatearMoneda(totalPendiente)}</span>
                              <span className="text-xs text-amber-600 dark:text-amber-400">
                                {prestamo.cuotas?.filter(c => c.estado === 'aplazado').length || 0} en mora
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>
                      Solicitado el {formatearFecha(prestamo.fechaSolicitud)}
                    </span>
                    {prestamo.estado === 'Aprobado' && !prestamo.fechaDesembolso && (
                      <span className="text-amber-600 dark:text-amber-400">
                        Pendiente de desembolso
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      
      {mostrarVoucher && prestamoSeleccionado && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-xl font-semibold">Comprobante de Préstamo</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMostrarVoucher(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </Button>
            </div>
            <div className="p-4">
              <GenerarVoucherPrestamos 
                prestamo={prestamoSeleccionado} 
                onClose={() => setMostrarVoucher(false)}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}