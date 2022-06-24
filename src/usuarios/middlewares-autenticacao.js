const passport=require('passport');

module.exports = {
    local: (req, resp, next)=>{
    
        passport.authenticate('local', 
            { session: false }, 
            (erro, usuario, info) => { 

            if(erro && erro.name === 'InvalidArgumentError'){
                return resp.status(401).json({erro:erro.message});
            }
            if (erro){
                return resp.status(500).json({erro: erro.message});
            }
            if(!usuario){
                return resp.status(401).json();
            }

            req.user = usuario;
            return next();
        }
            
        )(req,resp, next);
    },

    bearer:(req,res, next)=>{
        passport.authenticate('bearer',{session:false},
            (erro,usario,info)=>{

                if(erro && erro.name==='JsonWebTokenError'){
                    return res.status(401).json({erro:erro.message});
                }
                if(erro && erro.name==='TokenExpiredError'){
                    return  res.status(401).json({erro:erro.message, expiradoEm: erro.expiredAt})
                }
                if(erro && erro.name ==='ExpirationError'){
                    return res.status(401).json({erro:erro.message});
                }
                if(erro){
                    return  res.status(500).json({erro: erro.message});
                }
                
                if(!usario){
                    return res.status(401).json();
                }

                req.user = usario;
                req.token = info.token;
                return next();
            })(req,res,next);
    }
};