import express from 'express';
import routes from './routes';

class App {
  constructor() {
    this.server = express();

    /* chamado na instanciação da classe os metodos middlewares e routes */
    this.middlewares();
    this.routes();
  }

  /* metodo de criação dos middlewares */
  middlewares() {
    this.server.use(express.json()); /* seta o formado json para utilização */
  }

  /* metodo de criação dos routes */
  routes() {
    this.server.use(routes);
  }
}

/* exportação da variavel server para utiliza��o em outras classes */
export default new App().server;
