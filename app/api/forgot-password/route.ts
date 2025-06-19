import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'pg';

// Verificar variables de entorno requeridas
const requiredEnvVars = [
  'DATABASE_URL',
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'CLIENT_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Faltan variables de entorno requeridas:', missingVars);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verificar conexión con el servidor SMTP
transporter.verify(function(error, success) {
  if (error) {
    console.error('Error al verificar la conexión SMTP:', error);
  } else {
    console.log('Conexión SMTP configurada correctamente');
  }
});

export async function POST(req: NextRequest) {
  let client;
  
  try {
    // Validar que todas las variables de entorno requeridas estén configuradas
    if (missingVars.length > 0) {
      throw new Error(`Faltan variables de entorno: ${missingVars.join(', ')}`);
    }

    // Validar el cuerpo de la solicitud
    let email: string;
    try {
      const body = await req.json();
      email = body.email?.trim();
      
      if (!email) {
        return NextResponse.json(
          { error: "El correo electrónico es requerido" }, 
          { status: 400 }
        );
      }

      // Validar formato de correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "El formato del correo electrónico no es válido" }, 
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Formato de solicitud inválido" }, 
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    client = await pool.connect();
    
    try {
      // Verificar si el correo existe en la base de datos
      const userResult = await client.query(
        'SELECT id, cedula FROM usuarios WHERE email = $1',
        [email]
      );

      // No revelar si el correo no existe por razones de seguridad
      if (userResult.rows.length === 0) {
        console.log(`Intento de recuperación para correo no registrado: ${email}`);
        return NextResponse.json({ 
          success: true,
          message: "Si el correo está registrado, recibirás instrucciones pronto."
        });
      }

      // Generar un token único
      const token = uuidv4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Expira en 1 hora

      // Iniciar transacción
      await client.query('BEGIN');

      try {
        // Invalidar tokens previos
        await client.query(
          `UPDATE password_reset_tokens 
           SET used = TRUE 
           WHERE email = $1 AND used = FALSE`,
          [email]
        );

        // Guardar el nuevo token en la base de datos
        await client.query(
          `INSERT INTO password_reset_tokens 
           (email, token, expires_at, used, cedula) 
           VALUES ($1, $2, $3, FALSE, $4)`,
          [email, token, expiresAt, userResult.rows[0].cedula]
        );

        // Confirmar transacción
        await client.query('COMMIT');
      } catch (dbError) {
        // Revertir transacción en caso de error
        await client.query('ROLLBACK');
        console.error('Error en la transacción de base de datos:', dbError);
        throw new Error("Error al generar el token de recuperación");
      }

      // Construir el enlace de restablecimiento - Usar localhost en desarrollo
      const isProduction = process.env.NODE_ENV === 'production';
      const protocol = isProduction ? 'https://' : 'http://';
      const host = isProduction ? 'cromu.vercel.app' : 'localhost:3000';
      const resetLink = `${protocol}${host}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
      
      console.log('URL de restablecimiento generada:', resetLink);
      console.log('NODE_ENV:', process.env.NODE_ENV);
      console.log('CLIENT_URL:', process.env.CLIENT_URL);

      // Enviar correo electrónico
      const mailOptions = {
        from: `"CROMU" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Recuperación de clave - CROMU",
        text: `Para restablecer tu clave, haz clic en el siguiente enlace: ${resetLink}\n\nEste enlace expirará en 1 hora.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #047857;">Recuperación de contraseña</h2>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
            <p>Para continuar, haz clic en el siguiente botón:</p>
            <div style="margin: 25px 0;">
              <a href="${resetLink}" 
                 style="background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Restablecer contraseña
              </a>
            </div>
            <p>O copia y pega esta URL en tu navegador:</p>
            <p style="word-break: break-all; color: #2563eb;">${resetLink}</p>
            <p><strong>Importante:</strong> Este enlace expirará en 1 hora.</p>
            <p>Si no solicitaste este restablecimiento, puedes ignorar este mensaje.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              Este es un mensaje automático, por favor no respondas a este correo.
            </p>
          </div>
        `,
      };

      // Enviar el correo
      await transporter.sendMail(mailOptions);
      
      console.log(`Correo de recuperación enviado a: ${email}`);
      
      return NextResponse.json({ 
        success: true,
        message: "Si el correo está registrado, recibirás instrucciones pronto."
      });

    } finally {
      if (client) {
        client.release();
      }
    }
  } catch (error) {
    console.error("Error en el proceso de recuperación de contraseña:", error);
    
    // Determinar el mensaje de error apropiado
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Ocurrió un error inesperado al procesar tu solicitud";
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, 
      { status: 500 }
    );
  }
}