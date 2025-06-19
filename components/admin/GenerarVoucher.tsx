import React, { useEffect, useRef, useState } from 'react';
import { Ahorrador } from './AhorradoresCrud';
import { Printer, Download, ChevronLeft, Share2 } from 'lucide-react';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface GenerarVoucherProps {
  ahorrador: Ahorrador;
  onClose: () => void;
}

const formatearMoneda = (valor: number) => {
  // Asegurarse de que valor sea un número
  if (isNaN(valor)) {
    console.error('Valor no numérico en formatearMoneda:', valor);
    return 'Error';
  }
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
};

const calcularRentabilidadAnual = (ahorrador: Ahorrador) => {
  // Si el ahorrador tiene 12 o más meses de ahorro, aplica 7% anual (0.583% mensual)
  // De lo contrario, aplica 0.5% mensual (6% anual)
  return ahorrador.pagosConsecutivos >= 12 ? 7 : 6;
};

// Calcula interés compuesto mensual y saldo total
function calcularInteresYSaldoSimple(ahorrador: Ahorrador) {
  // Sumar el ahorro real del usuario
  const mesesPagados = Object.values(ahorrador.historialPagos).filter(p => p.pagado);
  const ahorroTotal = mesesPagados.reduce((acc, p) => acc + (p.monto || 0), 0);

  // Tasa anual y mensual
  const tasaAnual = calcularRentabilidadAnual(ahorrador);
  const tasaMensual = tasaAnual / 12;

  // Interés simple
  const interesAnual = ahorroTotal * (tasaAnual / 100);
  const interesMensual = ahorroTotal * (tasaMensual / 100);

  return {
    interesTotal: Math.round(interesAnual),
    interesMensual: Math.round(interesMensual),
    tasaAnual,
    tasaMensual,
    ahorroTotal
  };
}

// Calcula la rentabilidad mensual acumulada y el interés real generado
function calcularRentabilidadAcumulada(ahorrador: Ahorrador) {
  const mesesOrdenados = Object.keys(ahorrador.historialPagos).sort();
  let saldoAcumulado = 0;
  let interesAcumulado = 0;
  let rentabilidadAcumulada = 0;
  let mesesPagados = 0;

  // Sumar 0.5% por cada mes transcurrido desde el ingreso, siempre que haya algún pago después de ese mes
  mesesOrdenados.forEach((mes, idx) => {
    // ¿El usuario sigue en el fondo este mes? (hay algún pago después de este mes)
    const hayPagosDespues = mesesOrdenados.slice(idx).some(m => ahorrador.historialPagos[m].pagado);
    if (hayPagosDespues) {
      rentabilidadAcumulada += 0.5;
    }
    const pago = ahorrador.historialPagos[mes];
    if (pago.pagado) {
      mesesPagados++;
      const interesMes = saldoAcumulado * 0.005; // 0.5% mensual
      interesAcumulado += interesMes;
      saldoAcumulado += pago.monto + interesMes;
    }
  });

  return {
    rentabilidadAcumulada, // Porcentaje total acumulado
    interesAcumulado: Math.round(interesAcumulado),
    saldoAcumulado: Math.round(saldoAcumulado),
    mesesPagados,
    ahorroTotal: saldoAcumulado - interesAcumulado
  };
}


// Función para obtener datos para el gráfico
const obtenerDatosGrafico = (ahorrador: Ahorrador) => {
  const mesesOrdenados = Object.keys(ahorrador.historialPagos).sort();
  const labels = [];
  const datosAhorro = [];
  const datosInteres = [];
  
  let saldoAcumulado = 0;
  let interesAcumulado = 0;
  const tasaAnual = calcularRentabilidadAnual(ahorrador);
  const tasaMensual = tasaAnual / 12 / 100;
  
  for (const mes of mesesOrdenados) {
    const pago = ahorrador.historialPagos[mes];
    if (pago.pagado) {
      // Calcular interés del mes
      const interesMes = saldoAcumulado * tasaMensual;
      interesAcumulado += interesMes;
      
      // Actualizar saldo
      saldoAcumulado += pago.monto + interesMes;
      
      // Formatear etiqueta del mes
      const [año, mesNum] = mes.split('-');
      const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      labels.push(`${nombresMeses[parseInt(mesNum) - 1]} ${año.substring(2)}`);
      
      // Guardar datos
      datosAhorro.push(saldoAcumulado - interesAcumulado);
      datosInteres.push(interesAcumulado);
    }
  }
  
  return { labels, datosAhorro, datosInteres };
};

export default function GenerarVoucher({ ahorrador, onClose }: GenerarVoucherProps) {
  const [graficosGenerados, setGraficosGenerados] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const fechaActual = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  ;
  
  const horaActual = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const rentabilidadAnual = calcularRentabilidadAnual(ahorrador);
  const { interesTotal, interesMensual, tasaAnual, tasaMensual, ahorroTotal } = calcularInteresYSaldoSimple(ahorrador);
  const rentabilidad = calcularRentabilidadAcumulada(ahorrador);
  
  // NUEVO: Calcula rentabilidad acumulada igual que en el CRUD
  const rentabilidadAcumulada = calcularRentabilidadAcumulada(ahorrador);

  // Referencias para los gráficos y contenedor del PDF
  const graficoAhorroRef = useRef<HTMLCanvasElement>(null);
  const graficoPagosRef = useRef<HTMLCanvasElement>(null);
  const voucherContenidoRef = useRef<HTMLDivElement>(null);
  
  // Gráficos
  const chartAhorroRef = useRef<Chart | null>(null);
  const chartPagosRef = useRef<Chart | null>(null);
  
  // Configurar los gráficos
  useEffect(() => {
    const configurarGraficos = async () => {
      setLoading(true);
      
      try {
        // Esperar un momento para asegurar que el DOM esté listo
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Gráfico de evolución de ahorro
        if (graficoAhorroRef.current) {
          const ctx = graficoAhorroRef.current.getContext('2d');
          if (ctx) {
            const { labels, datosAhorro, datosInteres } = obtenerDatosGrafico(ahorrador);
            
            // Destruir gráfico existente si hay uno
            if (chartAhorroRef.current) {
              chartAhorroRef.current.destroy();
            }
            
            chartAhorroRef.current = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: labels,
                datasets: [
                  {
                    label: 'Capital',
                    data: datosAhorro,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 1
                  },
                  {
                    label: 'Interés',
                    data: datosInteres,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                  }
                ]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    stacked: true,
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    stacked: true,
                    ticks: {
                      callback: function(value) {
                        return formatearMoneda(Number(value));
                      }
                    }
                  }
                },
                plugins: {
                  title: {
                    display: true,
                    text: 'Evolución de Ahorro e Interés',
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
                        return context.dataset.label + ': ' + formatearMoneda(context.parsed.y);
                      }
                    }
                  }
                }
              }
             });
            }
          }
        
        // Gráfico de estado de pagos
        if (graficoPagosRef.current) {
          const ctx = graficoPagosRef.current.getContext('2d');
          if (ctx) {
            // Contar pagos por mes
            const mesesOrdenados = Object.keys(ahorrador.historialPagos).sort();
            const pagados = mesesOrdenados.filter(mes => ahorrador.historialPagos[mes].pagado).length;
            const pendientes = mesesOrdenados.length - pagados;
            
            // Destruir gráfico existente si hay uno
            if (chartPagosRef.current) {
              chartPagosRef.current.destroy();
            }
            
            chartPagosRef.current = new Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: ['Pagados', 'Pendientes'],
                datasets: [{
                  data: [pagados, pendientes],
                  backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                  ],
                  borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)'
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
                    text: 'Estado de Pagos',
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
                        const percentage = Math.round((value / mesesOrdenados.length) * 100);
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
      if (chartAhorroRef.current) {
        chartAhorroRef.current.destroy();
      }
      if (chartPagosRef.current) {
        chartPagosRef.current.destroy();
      }
    };
  }, [ahorrador]);
  
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
      
      // Estilos para la impresión
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Comprobante de Ahorro - ${ahorrador.nombre}</title>
            <meta charset="utf-8">
            <style>
              @page {
                size: auto;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" style="width: 100%;" />
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

      // Dimensiones del PDF (A4)
      const imgWidth = 210; // mm
      const pageHeight = 297; // mm

      // Relación px/mm
      const pxPerMm = canvas.width / imgWidth;
      const pageHeightPx = Math.floor(pageHeight * pxPerMm);

      let position = 0;
      let pageNum = 0;
      const pdf = new jsPDF('p', 'mm', 'a4');

      while (position < canvas.height) {
        // Crear un canvas temporal para cada página
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(pageHeightPx, canvas.height - position);

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            position,
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

        position += pageHeightPx;
        pageNum++;
      }

      pdf.save(`Comprobante_${ahorrador.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Hubo un error al generar el PDF. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  
  // Función para compartir el voucher como PDF
  const compartirPDF = async () => {
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

      // Dimensiones del PDF (A4)
      const imgWidth = 210; // mm
      const pageHeight = 297; // mm

      // Relación px/mm
      const pxPerMm = canvas.width / imgWidth;
      const pageHeightPx = Math.floor(pageHeight * pxPerMm);

      let position = 0;
      let pageNum = 0;
      const pdf = new jsPDF('p', 'mm', 'a4');

      while (position < canvas.height) {
        // Crear un canvas temporal para cada página
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(pageHeightPx, canvas.height - position);

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            position,
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

        position += pageHeightPx;
        pageNum++;
      }

      const pdfBlob = pdf.output('blob');
      const pdfFile = new File(
        [pdfBlob],
        `Comprobante_${ahorrador.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`,
        { type: 'application/pdf' }
      );

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title: 'Comprobante de Ahorro',
          text: 'Te comparto el comprobante de ahorro generado desde CROMU.',
          files: [pdfFile]
        });
      } else {
        alert('La función de compartir no está soportada en este dispositivo o navegador.');
      }
    } catch (error) {
      alert('No se pudo compartir el PDF.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:p-0 print:bg-white print:inset-auto"
      id="voucher-root" // <-- Añade este id
    >
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
              <h2 className="text-2xl font-bold text-emerald-700">Comprobante de Ahorro</h2>
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
                onClick={imprimirVoucher}
                className="p-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200"
                title="Imprimir comprobante"
                disabled={loading || !graficosGenerados}
              >
                <Printer size={20} />
              </button>
              {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                <button
                  onClick={compartirPDF}
                  className="p-2 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200"
                  title="Compartir PDF"
                  disabled={loading || !graficosGenerados}
                >
                  <Share2 size={20} />
                </button>
              )}
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
                <h1 className="text-xl font-bold text-black">CROMU Finance Services</h1>
                <p className="text-black text-sm">NIT: 901.234.567-8</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-black">Fecha: {fechaActual}</p>
                <p className="text-sm text-black">Hora: {horaActual}</p>
                <p className="text-sm text-black">No. Comprobante: {ahorrador.id.substring(0, 8).toUpperCase()}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2 text-black">Información del Ahorrador</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-black font-medium">Nombre:</p>
                  <p className="font-semibold text-black">{ahorrador.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-black font-medium">Cédula:</p>
                  <p className="font-semibold text-black">{ahorrador.cedula}</p>
                </div>
                <div>
                  <p className="text-sm text-black font-medium">Fecha de Ingreso:</p>
                  <p className="font-semibold text-black">{new Date(ahorrador.fechaIngreso).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <p className="text-sm text-black font-medium">Teléfono:</p>
                  <p className="font-semibold text-black">{ahorrador.telefono}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2 text-black">Resumen de Ahorro</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Columna 1: Rentabilidad Acumulada */}
                  <div>
                    <h4 className="font-semibold text-black mb-2">Rentabilidad Acumulada</h4>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-black font-medium">% Acumulado:</span>
                      <span className="font-bold text-black">{rentabilidadAcumulada.rentabilidadAcumulada.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-black font-medium">Interés Generado:</span>
                      <span className="font-bold text-black">
                        {formatearMoneda(rentabilidadAcumulada.ahorroTotal * (rentabilidadAcumulada.rentabilidadAcumulada / 100))}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-black font-medium">Ahorro Total:</span>
                      <span className="font-bold text-black">{formatearMoneda(rentabilidadAcumulada.ahorroTotal)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-black font-medium">Saldo Total:</span>
                      <span className="font-bold text-black">
                        {formatearMoneda(rentabilidadAcumulada.ahorroTotal + (rentabilidadAcumulada.ahorroTotal * (rentabilidadAcumulada.rentabilidadAcumulada / 100)))}
                      </span>
                    </div>
                  </div>
                  {/* Columna 2: Detalle */}
                  <div>
                    <h4 className="font-semibold text-black mb-2">Detalle</h4>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-black font-medium">Meses Pagados:</span>
                      <span className="font-bold text-black">{rentabilidadAcumulada.mesesPagados}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-black font-medium">Rentabilidad por mes:</span>
                      <span className="font-bold text-black">0.50%</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-black font-medium">Rentabilidad máxima posible:</span>
                      <span className="font-bold text-black">{(Object.keys(ahorrador.historialPagos).length * 0.5).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:print\\:grid-cols-2">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-black">Evolución del Ahorro</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 h-72">
                  <canvas ref={graficoAhorroRef}></canvas>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-black">Estado de Pagos</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 h-72">
                  <canvas ref={graficoPagosRef}></canvas>
                </div>
              </div>
            </div>
            
            {/* Contenido del voucher */}
            <div 
              ref={voucherContenidoRef} 
              className="border border-gray-300 p-6 rounded-lg print:border-none print:p-0"
            >
              {/* Agrupa tabla y firma para evitar salto de página */}
              <div className="no-break">
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-2 text-black">Detalle de Pagos</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-4 border-b text-left text-black">Mes</th>
                          <th className="py-2 px-4 border-b text-left text-black">Estado</th>
                          <th className="py-2 px-4 border-b text-right text-black">Monto Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(ahorrador.historialPagos)
                          .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
                          .map(([mes, { pagado, monto, consignaciones = [] }]) => (
                            <React.Fragment key={mes}>
                              <tr className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4 text-black">
                                  {mes.split('-')[1]}/{mes.split('-')[0]}
                                </td>
                                <td className="py-2 px-4">
                                  {pagado ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Pagado
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Pendiente
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-4 text-right text-black">
                                  {pagado ? formatearMoneda(monto) : '-'}
                                </td>
                              </tr>
                              {pagado && consignaciones && consignaciones.length > 0 && (
                                <tr className="bg-gray-50">
                                  <td colSpan={3} className="py-2 px-4">
                                    <div className="pl-4 border-l-2 border-emerald-500">
                                      <p className="text-sm font-medium text-gray-700 mb-1">Detalle de consignaciones:</p>
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="text-gray-600">
                                            <th className="py-1 px-2 text-left">Fecha</th>
                                            <th className="py-1 px-2 text-right">Monto</th>
                                            {consignaciones.some(c => c.descripcion) && (
                                              <th className="py-1 px-2 text-left">Descripción</th>
                                            )}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {consignaciones.map((consignacion, idx) => (
                                            <tr key={idx} className="border-t border-gray-200">
                                              <td className="py-1 px-2 text-black">
                                                {consignacion.fecha ? new Date(consignacion.fecha).toLocaleDateString('es-CO', {
                                                  year: 'numeric',
                                                  month: '2-digit',
                                                  day: '2-digit'
                                                }) : 'Sin fecha'}
                                              </td>
                                              <td className="py-1 px-2 text-right text-black">
                                                {formatearMoneda(consignacion.monto || 0)}
                                              </td>
                                              {consignaciones.some(c => c.descripcion) && (
                                                <td className="py-1 px-2 text-black">
                                                  {consignacion.descripcion || '-'}
                                                </td>
                                              )}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-sm text-gray-800 font-medium">Generado por:</p>
                      <p className="font-semibold text-gray-900">Administrador CROMU</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-800 font-medium">Firma Digital:</p>
                      <p className="font-semibold text-emerald-700">CROMU-{Date.now().toString(36).substring(0, 6).toUpperCase()}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-800 mt-4 text-center">
                    Este documento es un comprobante informativo de los ahorros registrados en CROMU Finance Services.
                    Para cualquier aclaración, comuníquese con nuestro servicio al cliente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estilos para impresión */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 4mm;
          }
          body * {
            visibility: hidden !important;
          }
          #voucher-root, #voucher-root * {
            visibility: visible !important;
          }
          #voucher-root {
            position: static !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            height: auto !important;
            background: white !important;
            z-index: 9999 !important;
            margin: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
            /* Elimina cualquier restricción de altura y overflow */
            max-height: none !important;
            overflow: visible !important;
          }
          .max-w-4xl, .max-h-[90vh], .overflow-y-auto, .print\\:max-h-full, .print\\:overflow-visible {
            max-width: none !important;
            max-height: none !important;
            overflow: visible !important;
          }
          /* Reduce paddings y márgenes */
          .p-6, .print\\:p-2 {
            padding: 0.15rem !important;
          }
          .mb-6, .mb-8, .mt-8, .pt-4, .pb-4 {
            margin-bottom: 0.25rem !important;
            margin-top: 0.25rem !important;
            padding-top: 0.15rem !important;
            padding-bottom: 0.15rem !important;
          }
          .rounded-lg, .rounded-full {
            border-radius: 0.1rem !important;
          }
          /* Reduce fuentes aún más */
          .text-2xl, .text-xl, .text-lg {
            font-size: 0.78rem !important;
          }
          .text-base, .text-sm, .text-xs {
            font-size: 0.62rem !important;
          }
          .font-bold, .font-semibold, .font-medium {
            font-weight: 500 !important;
          }
          /* Reduce altura de los gráficos */
          .h-72 {
            height: 12rem !important;    /* Aumenta la altura para impresión */
            min-height: 10rem !important;
          }
          canvas {
            height: 11rem !important;    /* Ajusta el canvas también */
            width: 100% !important;
            max-width: 100% !important;
            page-break-inside: avoid !important;
          }
          /* Tablas compactas */
          table {
            font-size: 0.62rem !important;
            page-break-inside: auto;
            width: 100% !important;
          }
          th, td {
            padding: 0.09rem 0.12rem !important;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
          /* Grids y layouts */
          .grid, .grid-cols-1, .lg\\:grid-cols-2, .gap-6, .print\\:grid-cols-2 {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 0.2rem !important;
          }
          /* Evita salto de página entre los gráficos y la tabla */
          /* .mb-8.grid, .mb-8:last-of-type, .mb-6:last-of-type {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
          } */
          /* Permitir saltos de página naturales en la tabla y la sección final */
          .mb-8, .mt-8, .pt-4, .pb-4 {
            page-break-inside: auto !important;
            page-break-after: auto !important;
            page-break-before: auto !important;
          }
          /* Si quieres que la tabla y la sección de firma siempre estén juntas, puedes envolverlas en un div y aplicar:
          .no-break {
            page-break-inside: avoid !important;
          } */

          /* Ajusta el tamaño de TODAS las fuentes para que sean uniformes y pequeñas */
          body, #voucher-root, #voucher-root * {
            font-size: 0.62rem !important;
            line-height: 1.1 !important;
          }
          .text-2xl, .text-xl, .text-lg, .text-base, .text-sm, .text-xs, h1, h2, h3, h4, h5, h6, p, span, th, td {
            font-size: 0.62rem !important;
            line-height: 1.1 !important;
            font-weight: 400 !important;
          }
          .font-bold, .font-semibold, .font-medium {
            font-weight: 500 !important;
          }

          /* Opcional: Si algún número o texto sigue grande, fuerza el tamaño */
          th, td {
            font-size: 0.62rem !important;
          }

          /* Mantén el margen superior reducido */
          #voucher-root, #voucher-root > div {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}