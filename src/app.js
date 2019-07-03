import 'dotenv/config';

import express from 'express';
import path from 'path';
import * as Sentry from '@sentry/node';
import Youch from 'youch';

import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    /* chamado na instanciação da classe os metodos middlewares e routes */
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  /* metodo de criação dos middlewares */
  middlewares() {
    /* faz a inicialização do sentry */
    this.server.use(Sentry.Handlers.requestHandler());

    this.server.use(express.json()); /* seta o formado json para utilização */
    /* inclui um metodo statico para visualização de imagem pela URL */
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );
  }

  /* metodo de criação dos routes */
  routes() {
    this.server.use(routes);

    /* inicia os erros do sentry */
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

/* exportação da variavel server para utiliza��o em outras classes */
export default new App().server;
