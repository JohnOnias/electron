import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {conn } from '../../database/db/conn.js';
import nodemailer from "nodemailer";



// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




export async function salvarToken(email) {
    const db = await conn();
    const token = gerarToken();
    const expiracao = calcularExpiracao(15);

    return new Promise((resolve, reject) => {
        // Atualiza token no Administrador
        db.run(
            `UPDATE tb_Administrador SET reset_token=?, reset_expires=? WHERE email=?`,
            [token, expiracao, email],
            function (err) {
                if (err) {
                    // Se não encontrar, tenta Funcionario
                    db.run(
                        `UPDATE tb_Funcionarios SET reset_token=?, reset_expires=? WHERE email=?`,
                        [token, expiracao, email],
                        function (err2) {
                            db.close();
                            if (err2) reject(err2);
                            else resolve({ token, expiracao });
                        }
                    );
                } else if (this.changes === 0) {
                    // nenhum registro atualizado
                    db.close();
                    resolve(null);
                } else {
                    db.close();
                    resolve({ token, expiracao });
                }});});}




export function gerarToken() {
    return crypto.randomBytes(32).toString("hex"); // token de 64 caracteres
}
export function calcularExpiracao(minutos = 15) {
    return Date.now() + minutos * 60 * 1000; // expira em X minutos
}


export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ifce.electron.testes@gmail.com",       // seu e-mail
        pass: "gnfedrphwmaaewiv"      // senha de app do Gmail
    }});




    
     export async function enviarTokenEmail(email, token) {
    const mailOptions = {
        from: '"App Recuperação de Senha" ifce.electron.testes@gmail.com',
        to: email,
        subject: "Recuperação de Senha",
        html: `
            <p>Você solicitou a redefinição de senha.</p>
            <p>Use este token para redefinir sua senha:</p>
            <h3>${token}</h3>
            <p>O token expira em 15 minutos.</p>
        `
    }; return transporter.sendMail(mailOptions);
}

 export async function validarToken(token) {
    const db = await conn();
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 'Administrador' as tipo, id, reset_expires 
            FROM tb_Administrador 
            WHERE reset_token = ?
            
            UNION ALL
            
            SELECT 'Funcionario' as tipo, id, reset_expires 
            FROM tb_Funcionarios 
            WHERE reset_token = ?
        `;
        db.all(query, [token, token], (err, rows) => {
            db.close();
            if (err) return reject(err);
            if (!rows || rows.length === 0) return resolve(null); // token não existe
            const usuario = rows[0];
            if (usuario.reset_expires < Date.now()) return resolve(null); // token expirado
            resolve(usuario); // token válido
        });
    });
    
}