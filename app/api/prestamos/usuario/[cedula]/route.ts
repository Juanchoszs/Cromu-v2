import { NextRequest, NextResponse } from "next/server";
import { obtenerPrestamosPorCedula } from "@/lib/api/prestamos";

/**
 * GET /api/prestamos/usuario/[cedula]
 * Obtener todos los préstamos de un usuario por su cédula
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cedula: string }> }
): Promise<NextResponse> {
  try {
    // En Next.js 15, params es una Promise que necesita ser awaited
    const { cedula } = await params;

    if (!cedula) {
      return NextResponse.json([], { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const prestamos = await obtenerPrestamosPorCedula(cedula);
    
    return NextResponse.json(prestamos, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error en /api/prestamos/usuario/[cedula]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}