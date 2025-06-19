import { NextRequest, NextResponse } from "next/server";
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const { email, password, token } = await req.json();

    if (!email || !password || !token) {
      return NextResponse.json(
        { error: "Email, password and token are required" }, 
        { status: 400 }
      );
    }

    // Verificar el token y el correo
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

      const resetToken = result.rows[0];

      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Actualizar la contraseña del usuario
      await client.query(
        `UPDATE usuarios SET password_hash = $1 WHERE email = $2`,
        [hashedPassword, email]
      );
      
      console.log('Contraseña actualizada correctamente para el email:', email);

      // Marcar el token como usado
      await client.query(
        `UPDATE password_reset_tokens SET used = TRUE WHERE id = $1`,
        [resetToken.id]
      );

      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Error al restablecer la contraseña" }, 
      { status: 500 }
    );
  }
}
