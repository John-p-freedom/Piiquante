//Importation du package HTTP natif de Node
const http = require('http');

//Importation du fichier app
const app = require('./app');

//Fonction qui renvoie un port valide qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
};

//Écoute de l'app en paramétrant le port d'écoute (environement ou 3000)
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//fonction qui recherche les différentes erreurs et les gères de manière appropriée
function errorHandler(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

//Création du server depuis le fichier app
const server = http.createServer(app);

//Écouteur d'évènements consignant le port ou le canal nommé sur lequel le serveur s'exécute
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//Écoute du server
server.listen(port);