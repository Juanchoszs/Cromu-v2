import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Pool } from "pg";

// Conexión a PostgreSQL usando Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cedula, password } = body;

    console.log("Intentando login con:", cedula, password);

    if (!cedula || !password) {
      console.log("Faltan campos");
      return NextResponse.json(
        { error: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    // Validación manual para administrador
    if (cedula === "CromuAdmin" && password === "CromuAdministracion#") {
      console.log("Login admin exitoso");
      // Create session data
      const sessionData = { username: 'CromuAdmin', role: 'admin', timestamp: Date.now() };
      
      // Create response with session cookie
      const response = NextResponse.json(
        { message: "Inicio de sesión exitoso.", isAdmin: true },
        { status: 200 }
      );
      
      // Set secure, httpOnly cookie
      response.cookies.set({
        name: 'admin-auth',
        value: JSON.stringify(sessionData),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      
      return response;
    }

    // Validación para usuarios normales desde la base de datos
    const result = await pool.query("SELECT * FROM usuarios WHERE cedula = $1", [cedula]);
    console.log("Resultado de búsqueda:", result.rows);

    if (result.rows.length === 0) {
      console.log("No se encontró usuario");
      return NextResponse.json(
        { error: "Cédula o contraseña incorrecta." },
        { status: 400 }
      );
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    console.log("¿Contraseña válida?", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Contraseña incorrecta");
      return NextResponse.json(
        { error: "Cédula o contraseña incorrecta." },
        { status: 400 }
      );
    }

    console.log("Login usuario exitoso");
    // Usuario normal
    return NextResponse.json(
      { message: "Inicio de sesión exitoso.", isAdmin: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json(
      { error: "Error en el servidor. Intente nuevamente." },
      { status: 500 }
    );
  }
}
