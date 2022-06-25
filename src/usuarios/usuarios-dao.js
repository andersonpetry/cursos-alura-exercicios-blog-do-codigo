const db = require('../../database');
const { InternalServerError } = require('../erros');
const { promisify }= require('util');
const e = require('express');

const dbRun = promisify(db.run).bind(db);
const dbAll = promisify(db.all).bind(db);
const dbGet = promisify(db.get).bind(db);

module.exports = {
  async adiciona(usuario) {
    try{
            await dbRun(`INSERT INTO usuarios (
              nome,
              email,
              senhaHash
            ) VALUES (?, ?, ?)
          `,
            [usuario.nome, usuario.email, usuario.senhaHash]
            );
        } catch(erro) {
            throw new InternalServerError('Erro ao adicionar o usuário!'+erro);
        }
  },

  async buscaPorId(id) {
    try{
        return await dbGet(`SELECT * FROM usuarios WHERE id = ? `,
        [id]);
      } catch(erro) {
          throw new  reject('Não foi possível encontrar o usuário!'+erro);
      }
    },   

  async buscaPorEmail(email){
    try{  
      return await dbGet( `SELECT *      FROM usuarios      WHERE email = ?    `,
          [email]);
    }catch(erro){
      throw new reject('Não foi possível encontrar o usuário! E-mail informado:'+email);
    }
  },
  async lista(){
    try{
      return await dbAll(`SELECT * FROM usuarios`)
    }
    catch(erro){
      throw new  reject('Erro ao listar usuários');
    }
  },
  async deleta(usuario){
    try{
      await dbRun(
        `
          DELETE FROM usuarios
          WHERE id = ?
        `,
        [usuario.id]);

    }catch(erro){
      throw new reject('Erro ao deletar o usuário:'+ usuario.id);
    }
  }

};
