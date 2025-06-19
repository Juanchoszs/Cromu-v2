import { NextRequest, NextResponse } from "next/server";
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" }, 
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      // Buscar el token en la base de datos
      const result = await client.query(
        `SELECT * FROM password_reset_tokens 
         WHERE email = $1 AND token = $2 AND expires_at > NOW() AND used = FALSE`,
        [email, token]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Token inválido o expirado" }, 
          { status: 400 }
        );
      }


      return NextResponse.json({ valid: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error validating token:", error);
    return NextResponse.json(
      { error: "Error al validar el token" }, 
      { status: 500 }
    );
  }
}
