let baseUrl = 'http://localhost:8080/person';
let index = 0;

// const rolesJs = require('./roles');

let collection = [
  {
    id: ++index,
    name: 'Joel Lima',
    email: 'joel@jota.com',
    password: '321321'
    // roles: [rolesJs.getById(1)]
  }
];

const defaultRoutes = require('./default-routes');

module.exports = {
  getById: (id) => defaultRoutes.getById(id, collection),
  get: (req, res) => defaultRoutes.get(req, res, collection, baseUrl),
  post: (req, res) => collection = defaultRoutes.post(req, res, collection),
  put: (req, res) => collection = defaultRoutes.put(req, res, collection),
  delete: (req, res) => collection = defaultRoutes.delete(req, res, collection),
  self: (req, res) => {
    const json = collection.find(item => item.id === 1);
    res.json(json);
  },
  login: (req, res) => {
    {
      const { sign } = require('jsonwebtoken');
      
      const email = req.body.email;
      const password = req.body.password;
      let userAuthenticated;
      let accessToken;
      const currentTimestamp = Math.floor((new Date()).getTime() / 1000);
      const expires = Math.floor(currentTimestamp + 60 * 60 * 3.5);
      
      collection.forEach(user => {
        if (user.email === email && password.toString() === user.password.toString()) {
          accessToken = sign({
            'iss': 'STORE',
            'exp': expires,
            'jti': 'wvn1kfNvZfyFtAkQIru4Eg',
            'iat': currentTimestamp,
            'nbf': currentTimestamp,
            'sub': user.id
          }, '$4lg4d0_Az3d0');
          userAuthenticated = user;
        }
      });
      
      if (userAuthenticated !== undefined) {
        res.json({
          access_token: accessToken,
          token_type: 'Bearer',
          expires_in: expires
        });
      } else {
        res.status(401).json({
          error: 'auth_error',
          message: 'Usuário ou senha inválido'
        });
      }
      
    }
  }
};
