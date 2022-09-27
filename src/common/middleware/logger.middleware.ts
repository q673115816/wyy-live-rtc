import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req, res, next) {
    console.log('Request...');
    next();
  }
}
