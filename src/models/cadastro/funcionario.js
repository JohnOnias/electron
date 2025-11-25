import bcrypt from 'bcrypt';
import {conn } from '../../database/db/conn.js';
import {verificarCpf} from '../utils/cpf.js';
import { verificarEmailCadastrado } from '../utils/email.js';
import { getFuncionario } from '../utils/getFuncionario.js';

let saltRounds = 16; 


export async function cadastrarFuncionario(nome, cpf, email, senha, tipoFuncionario) {
  const db = await conn();

  try{
    if (tipoFuncionario === "gerente") {
        const existirGerente = await getFuncionario(tipoFuncionario);
         if (existirGerente.length > 0) {
            throw new Error("Já existe um gerente cadastrado.");
      }
    }
    
    if(cpf){
      const existingCpf = await verificarCpf(cpf);
      if(existingCpf.length > 0){
        throw new Error("CPF já cadastrado.");
      }
    }
    if(email){
      const existingEmail = await verificarEmailCadastrado(email);
      if(existingEmail.length > 0){
        throw new Error("E-mail já cadastrado.");
      }

    }
  } catch (err) {
    db.close();
    return { success: false, error: err.message };
  } 
  try {
   const hash = await bcrypt.hash(senha, saltRounds);
    await new Promise((resolve, reject) => {
      const query = `
        INSERT INTO tb_Funcionarios (nome, cpf, email, senha, tipo)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(query, [nome, cpf, email, hash, tipoFuncionario], function (err) {
        if (err) reject(err);
        else resolve();
      });
    });

    db.close();
    return { success: true };

  } catch (err) {
    db.close();
    return { success: false, error: err.message };
  }
}
