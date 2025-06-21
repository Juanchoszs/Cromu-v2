import React, { useEffect, useRef, useState } from 'react';
import { Prestamo } from './FromularioPrestamo';
import { Printer, Download, Share2, ChevronLeft } from 'lucide-react';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface GenerarVoucherPrestamosProps {
  prestamo: Prestamo;
  onClose: () => void;
}

const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
};

// Función para calcular la cuota mensual
const calcularCuotaMensual = (prestamo: Prestamo) => {
  const monto = prestamo.monto;
  const tasaMensual = prestamo.tasaInteres / 100;
  const plazo = prestamo.plazoMeses;
  
  // Fórmula de cuota fija: P = (monto * tasa) / (1 - (1 + tasa)^-plazo)
  const cuotaExacta = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
  
  // Aproximar a miles superiores
  return Math.ceil(cuotaExacta / 1000) * 1000;
};

// Función para generar la tabla de amortización con método francés
const generarTablaAmortizacion = (prestamo: Prestamo) => {
  const tabla: any[] = [];
  let saldoPendiente = prestamo.monto;
  const tasaMensual = prestamo.tasaInteres / 100;
  
  // Calcular la cuota fija con el método francés
  const cuotaFija = calcularCuotaMensual(prestamo);
  
  // Primero, generamos la tabla teórica sin considerar pagos ni subcuotas
  const tablaTeorica: Array<{
    mes: number;
    saldoInicial: number;
    interes: number;
    abonoCapital: number;
    saldoFinal: number;
  }> = [];

  // Calcular la tabla teórica
  for (let mes = 1; mes <= prestamo.plazoMeses; mes++) {
    const saldoInicial = mes === 1 
      ? prestamo.monto 
      : tablaTeorica[mes - 2].saldoFinal;
    
    const interes = saldoInicial * tasaMensual;
    
    // Asegurarnos de que en la última cuota el saldo final sea 0
    const esUltimaCuota = mes === prestamo.plazoMeses;
    const abonoCapital = esUltimaCuota 
      ? saldoInicial // En la última cuota, el abono a capital es todo el saldo pendiente
      : Math.min(cuotaFija - interes, saldoInicial);
      
    const saldoFinal = saldoInicial - abonoCapital;
    
    tablaTeorica.push({
      mes,
      saldoInicial,
      interes,
      abonoCapital,
      saldoFinal
    });
  }

  // Ahora procesamos los pagos reales y subcuotas
  let saldoActual = prestamo.monto;
  
  for (let mes = 1; mes <= prestamo.plazoMeses; mes++) {
    const cuotaHistorial = prestamo.historialPagos?.[mes];
    const esAplazado = cuotaHistorial?.estado === 'aplazado';
    const esPagado = cuotaHistorial?.estado === 'pagado';
    const tieneSubcuotas = cuotaHistorial?.subcuotas && Array.isArray(cuotaHistorial.subcuotas) && cuotaHistorial.subcuotas.length > 0;
    
    const filaTeorica = tablaTeorica[mes - 1];
    
    if (esAplazado && tieneSubcuotas) {
      // Procesar cuota aplazada con subcuotas
      const subcuotas = [...(cuotaHistorial.subcuotas || [])];
      let saldoCuota = filaTeorica.saldoInicial;
      
      // Agregar la fila principal de la cuota aplazada
      tabla.push({
        mes: mes.toString(),
        cuota: 0, // No se paga la cuota completa, solo subcuotas
        interes: 0,
        abonoCapital: 0,
        saldo: Math.ceil(saldoCuota / 1000) * 1000,
        estado: 'Aplazado',
        fechaPago: cuotaHistorial.fecha_aplazamiento 
          ? new Date(cuotaHistorial.fecha_aplazamiento).toLocaleDateString('es-ES')
          : ''
      });
      
      // Procesar cada subcuota
      subcuotas.forEach((subcuota, idx) => {
        const interes = saldoCuota * tasaMensual;
        const abonoCapital = Math.min(cuotaFija - interes, saldoCuota);
        const nuevoSaldo = Math.max(0, saldoCuota - (subcuota.estado === 'pagado' ? abonoCapital : 0));
        
        tabla.push({
          mes: `${mes}.${idx + 1}`,
          cuota: cuotaFija,
          interes: Math.ceil(interes / 1000) * 1000,
          abonoCapital: Math.ceil(abonoCapital / 1000) * 1000, // Mostrar siempre el abono a capital teórico
          saldo: subcuota.estado === 'pagado' 
            ? Math.ceil(nuevoSaldo / 1000) * 1000 
            : Math.ceil(saldoCuota / 1000) * 1000, // Si está pendiente, mantener el saldo actual
          estado: subcuota.estado === 'pagado' ? 'Pagado' : 'Pendiente',
          fechaPago: subcuota.fecha_pago 
            ? new Date(subcuota.fecha_pago).toLocaleDateString('es-ES')
            : ''
        });
        
        if (subcuota.estado === 'pagado') {
          saldoCuota = nuevoSaldo;
          saldoActual = nuevoSaldo;
        }
      });
      
    } else if (esPagado) {
      // Cuota pagada normalmente
      const interes = filaTeorica.interes;
      const abonoCapital = filaTeorica.abonoCapital;
      
      tabla.push({
        mes: mes.toString(),
        cuota: cuotaFija,
        interes: Math.ceil(interes / 1000) * 1000,
        abonoCapital: Math.ceil(abonoCapital / 1000) * 1000,
        saldo: Math.ceil(filaTeorica.saldoFinal / 1000) * 1000,
        estado: 'Pagado',
        fechaPago: cuotaHistorial.fecha_pago 
          ? new Date(cuotaHistorial.fecha_pago).toLocaleDateString('es-ES')
          : ''
      });
      
      saldoActual = filaTeorica.saldoFinal;
      
    } else {
      // Cuota pendiente - AQUÍ ESTÁ LA CORRECCIÓN
      const esUltimaCuota = mes === prestamo.plazoMeses;
      const interes = filaTeorica.interes;
      const abonoCapital = filaTeorica.abonoCapital;
      
      // Para cuotas pendientes, usar directamente el saldo final de la tabla teórica
      const saldoMostrar = Math.ceil(filaTeorica.saldoFinal / 1000) * 1000;
      
      tabla.push({
        mes: mes.toString(),
        cuota: esUltimaCuota 
          ? Math.ceil((interes + abonoCapital) / 1000) * 1000  // Ajustar la última cuota
          : cuotaFija,
        interes: Math.ceil(interes / 1000) * 1000,
        abonoCapital: Math.ceil(abonoCapital / 1000) * 1000,
        saldo: saldoMostrar,
        estado: 'Pendiente',
        fechaPago: ''
      });
    }
  }
  
  // Asegurarnos de que la última cuota tenga saldo 0
  if (tabla.length > 0) {
    const ultimaFila = tabla[tabla.length - 1];
    if (parseInt(ultimaFila.mes) === prestamo.plazoMeses && !ultimaFila.mes.includes('.')) {
      ultimaFila.saldo = 0;
      // Ajustar el abono a capital para que el saldo llegue a 0
      if (ultimaFila.estado === 'Pendiente' || ultimaFila.estado === 'Vencido') {
        const saldoAnterior = tabla.length > 1 ? tabla[tabla.length - 2].saldo : prestamo.monto;
        ultimaFila.abonoCapital = Math.ceil(saldoAnterior / 1000) * 1000;
        ultimaFila.cuota = Math.ceil((ultimaFila.interes + ultimaFila.abonoCapital) / 1000) * 1000;
      }
    }
  }
  
  // Ordenar la tabla por mes (considerando subcuotas)
  return tabla.sort((a, b) => {
    // Si ambos son números enteros
    if (!a.mes.includes('.') && !b.mes.includes('.')) {
      return parseInt(a.mes) - parseInt(b.mes);
    }
    // Si uno es subcuota y el otro no
    if (a.mes.includes('.') && !b.mes.includes('.')) {
      const [mesA] = a.mes.split('.').map(Number);
      return mesA - parseInt(b.mes) || 1; // Las subcuotas van después
    }
    if (!a.mes.includes('.') && b.mes.includes('.')) {
      const [mesB] = b.mes.split('.').map(Number);
      return parseInt(a.mes) - mesB || -1; // Las subcuotas van después
    }
    // Si ambos son subcuotas
    const [mesA, subA] = a.mes.split('.').map(Number);
    const [mesB, subB] = b.mes.split('.').map(Number);
    return mesA - mesB || (subA - subB);
  });
};

// Función para obtener datos para el gráfico de distribución
const obtenerDatosDistribucion = (prestamo: Prestamo) => {
  const tabla = generarTablaAmortizacion(prestamo);
  
  // Calcular totales
  const totalInteres = tabla.reduce((sum, row) => sum + row.interes, 0);
  const totalCapital = prestamo.monto;
  
  return {
    totalInteres,
    totalCapital
  };
};

// Función para obtener datos para el gráfico de estado de cuotas
const obtenerDatosEstadoCuotas = (prestamo: Prestamo) => {
  const tabla = generarTablaAmortizacion(prestamo);
  
  const pagadas = tabla.filter(row => row.estado === "Pagado").length;
  const vencidas = tabla.filter(row => row.estado === "Vencido").length;
  const pendientes = tabla.filter(row => row.estado === "Pendiente").length;
  
  return {
    pagadas,
    vencidas,
    pendientes
  };
};

export default function GenerarVoucherPrestamos({ prestamo, onClose }: GenerarVoucherPrestamosProps) {
  const [graficosGenerados, setGraficosGenerados] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const fechaActual = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const horaActual = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Referencias para los gráficos y contenedor del PDF
  const graficoDistribucionRef = useRef<HTMLCanvasElement>(null);
  const graficoEstadoCuotasRef = useRef<HTMLCanvasElement>(null);
  const voucherContenidoRef = useRef<HTMLDivElement>(null);
  
  // Referencias para los objetos Chart
  const chartDistribucionRef = useRef<Chart | null>(null);
  const chartEstadoCuotasRef = useRef<Chart | null>(null);
  
  // Calcular datos para el resumen
  const cuotaMensual = calcularCuotaMensual(prestamo);
  const tablaAmortizacion = generarTablaAmortizacion(prestamo);
  const totalPagado = tablaAmortizacion.reduce((sum, row) => 
    row.estado === "Pagado" ? sum + row.cuota : sum, 0);
  const totalPendiente = tablaAmortizacion.reduce((sum, row) => 
    row.estado !== "Pagado" ? sum + row.cuota : sum, 0);
  
  // Configurar los gráficos
  useEffect(() => {
    const configurarGraficos = async () => {
      setLoading(true);
      
      try {
        // Esperar un momento para asegurar que el DOM esté listo
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Gráfico de distribución Capital vs Interés
        if (graficoDistribucionRef.current) {
          const ctx = graficoDistribucionRef.current.getContext('2d');
          if (ctx) {
            const { totalInteres, totalCapital } = obtenerDatosDistribucion(prestamo);
            
            // Destruir gráfico existente si hay uno
            if (chartDistribucionRef.current) {
              chartDistribucionRef.current.destroy();
            }
            
            chartDistribucionRef.current = new Chart(ctx, {
              type: 'pie',
              data: {
                labels: ['Capital', 'Intereses'],
                datasets: [{
                  data: [totalCapital, totalInteres],
                  backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(59, 130, 246, 0.7)'
                  ],
                  borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(59, 130, 246, 1)'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: 'Distribución Capital vs Intereses',
                    color: '#1f2937',
                    font: {
                      size: 16,
                      weight: 'bold'
                    }
                  },
                  legend: {
                    position: 'bottom'
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const value = context.raw as number;
                        const total = totalCapital + totalInteres;
                        const percentage = Math.round((value / total) * 100);
                        return `${context.label}: ${formatearMoneda(value)} (${percentage}%)`;
                      }
                    }
                  }
                }
              }
            });
          }
        }
        
        // Gráfico de estado de cuotas
        if (graficoEstadoCuotasRef.current) {
          const ctx = graficoEstadoCuotasRef.current.getContext('2d');
          if (ctx) {
            const { pagadas, vencidas, pendientes } = obtenerDatosEstadoCuotas(prestamo);
            
            // Destruir gráfico existente si hay uno
            if (chartEstadoCuotasRef.current) {
              chartEstadoCuotasRef.current.destroy();
            }
            
            chartEstadoCuotasRef.current = new Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: ['Pagadas', 'Vencidas', 'Pendientes'],
                datasets: [{
                  data: [pagadas, vencidas, pendientes],
                  backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(251, 191, 36, 0.7)'
                  ],
                  borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(251, 191, 36, 1)'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: 'Estado de Cuotas',
                    color: '#1f2937',
                    font: {
                      size: 16,
                      weight: 'bold'
                    }
                  },
                  legend: {
                    position: 'bottom'
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const value = context.raw as number;
                        const total = pagadas + vencidas + pendientes;
                        const percentage = Math.round((value / total) * 100);
                        return `${context.label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }
            });
          }
        }
        
        // Indicar que los gráficos se han renderizado
        setGraficosGenerados(true);
      } catch (error) {
        console.error("Error al configurar gráficos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    configurarGraficos();
    
    // Limpiar los gráficos al desmontar el componente
    return () => {
      if (chartDistribucionRef.current) {
        chartDistribucionRef.current.destroy();
      }
      if (chartEstadoCuotasRef.current) {
        chartEstadoCuotasRef.current.destroy();
      }
    };
  }, [prestamo]);
  
  // Función para imprimir o generar PDF del voucher
const imprimirVoucher = async () => {
  if (!voucherContenidoRef.current || !graficosGenerados) return;

  setLoading(true);

  try {
    const voucherElement = voucherContenidoRef.current;
    const options = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      height: voucherElement.scrollHeight,
      windowHeight: voucherElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width: voucherElement.scrollWidth
    };

    const canvas = await html2canvas(voucherElement, options);
    const imgData = canvas.toDataURL('image/png');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('No se pudo abrir la ventana de impresión. Por favor, desbloquea las ventanas emergentes.');
    }

    // Estilos para impresión multipágina
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comprobante de Préstamo - ${prestamo.nombreDeudor}</title>
          <meta charset="utf-8">
          <style>
            @media print {
              body, html {
                margin: 0;
                padding: 0;
                width: 210mm;
                min-height: 297mm;
                background: #fff;
              }
              img {
                width: 210mm !important;
                height: auto !important;
                page-break-after: always;
              }
            }
            body {
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background: #fff;
            }
            img {
              width: 100%;
              height: auto;
              display: block;
            }
          </style>
        </head>
        <body>
          <img src="${imgData}" />
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }, 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  } catch (error) {
    console.error('Error al preparar la impresión:', error);
    alert('Error al preparar la impresión. Por favor, inténtalo de nuevo.');
  } finally {
    setLoading(false);
  }
};
  
  // Función para descargar el voucher como PDF
  const descargarPDF = async () => {
  if (!voucherContenidoRef.current || !graficosGenerados) return;

  setLoading(true);

  try {
    const voucherElement = voucherContenidoRef.current;
    const options = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      height: voucherElement.scrollHeight,
      windowHeight: voucherElement.scrollHeight
    };

    const canvas = await html2canvas(voucherElement, options);

    const imgWidth = 210; // mm
    const pageHeight = 297; // mm
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Relación px/mm
    const pxPerMm = canvas.width / imgWidth;
    const pageHeightPx = pageHeight * pxPerMm;
    let renderedHeight = 0;
    let pageNum = 0;

    while (renderedHeight < canvas.height) {
      // Crear un canvas temporal para cada página
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(pageHeightPx, canvas.height - renderedHeight);
      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          renderedHeight,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          canvas.width,
          pageCanvas.height
        );
      }
      const imgData = pageCanvas.toDataURL('image/png');
      if (pageNum > 0) pdf.addPage();
      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        imgWidth,
        (pageCanvas.height / pxPerMm)
      );
      renderedHeight += pageCanvas.height;
      pageNum++;
    }

    pdf.save(`Comprobante_Prestamo_${prestamo.nombreDeudor.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error("Error al generar PDF:", error);
    alert("Hubo un error al generar el PDF. Intente nuevamente.");
  } finally {
    setLoading(false);
  }
};
  
  // Compartir el voucher como PDF
const compartirVoucher = async () => {
  if (!voucherContenidoRef.current || !graficosGenerados) return;
  
  setLoading(true);
  
  try {
    const voucherElement = voucherContenidoRef.current;
    const options = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      height: voucherElement.scrollHeight,
      windowHeight: voucherElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width: voucherElement.scrollWidth
    };

    // Crear canvas con el contenido
    const canvas = await html2canvas(voucherElement, options);
    
    // Configuración del PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // Ancho A4 en mm
    const pageHeight = 297; // Alto A4 en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Calcular el número de páginas necesarias
    const totalPages = Math.ceil(imgHeight / pageHeight);
    
    // Agregar cada página al PDF
    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      // Calcular posición Y para esta página
      const positionY = -i * pageHeight;
      
      // Agregar la porción de la imagen correspondiente a esta página
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0, // x
        positionY, // y
        imgWidth,
        imgHeight
      );
    }
    
    // Generar el blob del PDF
    const pdfBlob = pdf.output('blob');
    const pdfFile = new File(
      [pdfBlob], 
      `Comprobante_Prestamo_${prestamo.nombreDeudor.replace(/\s+/g, '_')}.pdf`, 
      { type: 'application/pdf' }
    );
    
    // Intentar compartir el PDF
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      await navigator.share({
        title: 'Comprobante de Préstamo',
        text: `Comprobante de préstamo de ${prestamo.nombreDeudor}`,
        files: [pdfFile]
      });
    } else {
      // Si no se puede compartir, ofrecer descargar el PDF
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Comprobante_Prestamo_${prestamo.nombreDeudor.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 0);
    }
  } catch (error) {
    console.error('Error al compartir el comprobante:', error);
    alert('No se pudo compartir el comprobante. Intenta descargarlo en su lugar.');
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:p-0 print:bg-white print:inset-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto print:shadow-none print:max-h-full print:overflow-visible">
        <div className="p-6 print:p-2">
          {/* Barra de herramientas - Se oculta al imprimir */}
          <div className="flex justify-between items-center mb-6 print:hidden">
            <div className="flex items-center">
              <button 
                onClick={onClose}
                className="mr-3 p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                disabled={loading}
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-2xl font-bold text-emerald-700">Comprobante de Préstamo</h2>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={descargarPDF}
                className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                title="Descargar como PDF"
                disabled={loading || !graficosGenerados}
              >
                <Download size={20} />
              </button>
              <button 
                onClick={compartirVoucher}
                className="p-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
                title="Compartir comprobante"
                disabled={loading || !graficosGenerados}
              >
                <Share2 size={20} />
              </button>
              <button 
                onClick={imprimirVoucher}
                className="p-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200"
                title="Imprimir comprobante"
                disabled={loading || !graficosGenerados}
              >
                <Printer size={20} />
              </button>
            </div>
          </div>
          
          {/* Estado de carga */}
          {loading && (
            <div className="print:hidden text-center py-2 mb-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent"></div>
              <span className="ml-2 text-gray-700">Generando documento...</span>
            </div>
          )}
          
          {/* Contenido del voucher */}
          <div 
            ref={voucherContenidoRef} 
            className="border border-gray-300 p-6 rounded-lg print:border-none print:p-0"
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h1 className="text-xl font-bold text-emerald-800">CROMU Finance Services</h1>
                <p className="text-gray-800 text-sm">NIT: 901.234.567-8</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-800">Fecha: {fechaActual}</p>
                <p className="text-sm text-gray-800">Hora: {horaActual}</p>
                <p className="text-sm text-gray-800">No. Comprobante: {prestamo.id?.substring(0, 8).toUpperCase() || 'N/A'}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Información del Deudor</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-800 font-medium">Nombre:</p>
                  <p className="font-semibold text-gray-900">{prestamo.nombreDeudor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-800 font-medium">Cédula:</p>
                  <p className="font-semibold text-gray-900">{prestamo.cedula}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-800 font-medium">Teléfono:</p>
                  <p className="font-semibold text-gray-900">{prestamo.telefono || "No registrado"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-800 font-medium">Dirección:</p>
                  <p className="font-semibold text-gray-900">{prestamo.direccion || "No registrada"}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Resumen del Préstamo</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-800 font-medium">Monto del Préstamo:</p>
                    <p className="font-bold text-xl text-emerald-700">{formatearMoneda(prestamo.monto)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">Tasa de Interés:</p>
                    <p className="font-bold text-emerald-700">{prestamo.tasaInteres}% mensual</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">Plazo:</p>
                    <p className="font-bold text-emerald-700">{prestamo.plazoMeses} meses</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">Cuota Mensual:</p>
                    <p className="font-bold text-emerald-700">{formatearMoneda(cuotaMensual)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">Fecha de Desembolso:</p>
                    <p className="font-bold text-emerald-700">{new Date(prestamo.fechaDesembolso).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">Estado del Préstamo:</p>
                    <p className={`font-bold ${
                      prestamo.estado === 'Activo' ? 'text-blue-600' : 
                      prestamo.estado === 'Pagado' ? 'text-emerald-600' : 
                      prestamo.estado === 'Vencido' ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {prestamo.estado}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Distribución del Préstamo</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 h-72">
                  <canvas ref={graficoDistribucionRef}></canvas>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Estado de Cuotas</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 h-72">
                  <canvas ref={graficoEstadoCuotasRef}></canvas>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Tabla de Amortización</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 border-b text-left text-gray-900 text-sm">Cuota</th>
                      <th className="py-2 px-3 border-b text-left text-gray-900 text-sm">Valor Cuota</th>
                      <th className="py-2 px-3 border-b text-left text-gray-900 text-sm">Interés</th>
                      <th className="py-2 px-3 border-b text-left text-gray-900 text-sm">Capital</th>
                      <th className="py-2 px-3 border-b text-left text-gray-900 text-sm">Saldo</th>
                      <th className="py-2 px-3 border-b text-left text-gray-900 text-sm">Estado</th>
                      <th className="py-2 px-3 border-b text-left text-gray-900 text-sm">Fecha Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tablaAmortizacion.map((fila, idx) => (
                      <tr key={idx} className={`border-b hover:bg-gray-50 ${
                        fila.estado === 'Pagado' ? 'bg-green-50' : 
                        fila.estado === 'Vencido' ? 'bg-red-50' : ''
                      }`}>
                        <td className="py-2 px-3 text-gray-900 text-sm">
                          {fila.mes}
                        </td>
                        <td className="py-2 px-3 text-gray-900 text-sm">
                          {formatearMoneda(fila.cuota)}
                        </td>
                        <td className="py-2 px-3 text-gray-900 text-sm">
                          {formatearMoneda(fila.interes)}
                        </td>
                        <td className="py-2 px-3 text-gray-900 text-sm">
                          {formatearMoneda(fila.abonoCapital)}
                        </td>
                        <td className="py-2 px-3 text-gray-900 text-sm">
                          {formatearMoneda(fila.saldo)}
                        </td>
                        <td className="py-2 px-3 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            fila.estado === 'Pagado' ? 'bg-green-100 text-green-800' : 
                            fila.estado === 'Vencido' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {fila.estado}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-gray-900 text-sm">
                          {fila.fechaPago || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Resumen de Pagos</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-800 font-medium">Total A pagar:</p>
                    <p className="font-bold text-xl text-gray-900">{formatearMoneda(totalPagado + totalPendiente)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">Total Pagado:</p>
                    <p className="font-bold text-xl text-emerald-700">{formatearMoneda(totalPagado)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">Total Pendiente:</p>
                    <p className="font-bold text-xl text-red-600">{formatearMoneda(totalPendiente)}</p>
                  </div>
                  
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm">
              <p>Este documento es un comprobante informativo del estado de su préstamo.</p>
              <p>Para cualquier consulta adicional, comuníquese con CROMU Finance Services.</p>
              <p className="mt-2">© {new Date().getFullYear()} CROMU Finance Services. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}