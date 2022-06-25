const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const jwt = require('jsonwebtoken');

const blocklist = require('../../redis/manipula-blocklist');

function criaTokenJWT(usuario){
  const cincoDiasEmMilissegundos = 432000000;
  const payload={
    id:usuario.id,
   // expiraEm: Date.now() + cincoDiasEmMilissegundos
  };
  const token =   jwt.sign (payload,process.env.CHAVE_JWT, {expiresIn:'15m'});
  return token;
}

module.exports = {
  async adiciona(req, res) {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email
      });

      await usuario.adicionaSenha(senha);
      await usuario.adiciona();

      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },
 
  async login(req, res){
    const token = criaTokenJWT(req.user);
    console.log(token);
    res.set('Authorization',token);
    res.status(204).send();
  },

  async logout(req,res){
    const token = req.token;
      try{
          await blocklist.adiciona(token);
          res.status(204).send();
      }
      catch(erro){
        res.status(500).json({erro: erro.message});
      }

  },

  async lista(req, res) {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  async deleta(req, res) {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  }
  
};
