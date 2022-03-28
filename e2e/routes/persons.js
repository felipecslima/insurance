let baseUrl = 'http://localhost:8080/person';
let index = 0;

// const rolesJs = require('./roles');

let collection = [
  {
    id: ++index,
    name: 'Joel Monstro',
    birthday: '04/02/1989',
    document: 'RG',
    username: '85787310268',
    timestamp: 1,
    user: {
      personTypeId: 1,
      password: 321321,
      hashForgot: 3,
      hashTimestamp: 4,
      active: true,
      timestamp: 1
    },
    addres: {
      zipcode: '66033329',
      description: 'rua dos timbiras',
      number: '1811',
      city: 'Belém',
      countrystate: 'Pará'
    },
    phone: { // telefone
      number: '+5511985024625'
    },
    email: { // email
      recipient: 'lfj182@gmail.com'
    }
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
      
      const username = req.body.username;
      const password = req.body.password;
      let userAuthenticated;
      let accessToken;
      const currentTimestamp = Math.floor((new Date()).getTime() / 1000);
      const expires = Math.floor(currentTimestamp + 60 * 60 * 3.5);
      
      collection.forEach(person => {
        if (person.username === username && password.toString() === person.user.password.toString()) {
          accessToken = sign({
            iss: 'STORE',
            exp: expires,
            jti: 'wvn1kfNvZfyFtAkQIru4Eg',
            iat: currentTimestamp,
            nbf: currentTimestamp,
            sub: person.id
          }, '$4lg4d0_Az3d0');
          userAuthenticated = person;
        }
      });
      
      if (userAuthenticated !== undefined) {
        res.json({
          accessToken: accessToken,
          tokenType: 'Bearer',
          expiresIn: expires
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
