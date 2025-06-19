import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { Pool } from "pg";

// Configura tu conexión a Neon (usa variables de entorno)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: Request) {
  try {
    const { cedula, email, password } = await req.json();

    if (!cedula || !email || !password) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Formato de correo electrónico inválido" }, { status: 400 });
    }

    // Validar longitud de la cédula (entre 7 y 12 dígitos)
    const cedulaRegex = /^\d{7,12}$/;
    if (!cedulaRegex.test(cedula)) {
      return NextResponse.json(
        { error: "La cédula debe tener entre 7 y 12 dígitos numéricos" }, 
        { status: 400 }
      );
    }

    // Validar fortaleza de la contraseña
    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" }, 
        { status: 400 }
      );
    }

    // Hashear contraseña
    const passwordHash = await hash(password, 10);

    // Insertar en la base de datos
    const client = await pool.connect();

    try {
      // Verificar si ya existe un usuario con la misma cédula o correo
      const existingUser = await client.query(
        `SELECT * FROM usuarios WHERE cedula = $1 OR email = $2`,
        [cedula, email]
      );

      if (existingUser.rows.length > 0) {
        const existingCedula = existingUser.rows.some(row => row.cedula === cedula);
        const existingEmail = existingUser.rows.some(row => row.email === email);
        
        if (existingCedula && existingEmail) {
          return NextResponse.json(
            { error: "Ya existe un usuario con esta cédula y correo electrónico" }, 
            { status: 409 }
          );
        } else if (existingCedula) {
          return NextResponse.json(
            { error: "Ya existe un usuario con esta cédula" }, 
            { status: 409 }
          );
        } else if (existingEmail) {
          return NextResponse.json(
            { error: "Ya existe un usuario con este correo electrónico" }, 
            { status: 409 }
          );
        }
      }

      // Insertar el nuevo usuario
      const result = await client.query(
        `INSERT INTO usuarios (cedula, email, password_hash) 
         VALUES ($1, $2, $3) 
         RETURNING id, cedula, email`,
        [cedula, email, passwordHash]
      );

      return NextResponse.json(
        { 
          success: true, 
          userId: result.rows[0].id,
          cedula: result.rows[0].cedula,
          email: result.rows[0].email
        }, 
        { status: 201 }
      );
    } catch (dbError: any) {
      console.error("Error en la base de datos:", dbError);
      if (dbError.code === "23505") {
        return NextResponse.json(
          { error: "Error de duplicado en la base de datos" }, 
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Error al registrar el usuario en la base de datos" }, 
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error en el servidor:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    );
  }
}
