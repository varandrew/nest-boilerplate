/*
 *                                                     __----~~~~~~~~~~~------___
 *                                    .  .   ~~//====......          __--~ ~~
 *                    -.            \_|//     |||\\  ~~~~~~::::... /~
 *                 ___-==_       _-~o~  \/    |||  \\            _/~~-
 *         __---~~~.==~||\=_    -_--~/_-~|-   |\\   \\        _/~
 *     _-~~     .=~    |  \\-_    '-~7  /-   /  ||    \      /
 *   .~       .~       |   \\ -_    /  /-   /   ||      \   /
 *  /  ____  /         |     \\ ~-_/  /|- _/   .||       \ /
 *  |~~    ~~|--~~~~--_ \     ~==-/   | \~--===~~        .\
 *           '         ~-|      /|    |-~\~~       __--~~
 *                       |-~~-_/ |    |   ~\_   _-~            /\
 *                            /  \     \__   \/~                \__
 *                        _--~ _/ | .-~~____--~-/                  ~~==.
 *                       ((->/~   '.|||' -_|    ~~-/ ,              . _||
 *                                  -_     ~\      ~~---l__i__i__i--~~_/
 *                                  _-~-__   ~)  \--______________--~~
 *                                //.-~~~-~_--~- |-------~~~~~~~~
 *                                       //.-~~~--\
 *                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *                               神兽保佑            永无BUG
 */

import { NestFactory } from '@nestjs/core'
import * as express from 'express'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { logger } from './common/middleware/logger.middleware'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { HttpExceptionFilter } from './common/filter/http-exception.filter'
import { AllExceptionsFilter } from './common/filter/any-exception.filter'

async function bootstrap() {
  const l = new Logger('NestBoilerplate')
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const port = configService.get<number>('server.port') || 3000
  // 开启跨域
  app.enableCors()
  // 请求参数处理
  app.use(express.json()) // For parsing application/json
  app.use(express.urlencoded({ extended: true })) // For parsing application/x-www-form-urlencoded
  // 监听所有的请求路由，并打印日志
  app.use(logger)

  // 开启swagger
  const swaggerOptions = new DocumentBuilder()
    .setTitle('nest-boilerplate api document')
    .setDescription('nest boilerplate project api document')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup('doc', app, document)
  // 使用全局拦截器打印出参
  app.useGlobalInterceptors(new TransformInterceptor())

  app.setGlobalPrefix('api')
  // 其他错误的捕获
  // AllExceptionsFilter 要在 HttpExceptionFilter 的上面，否则 HttpExceptionFilter 就不生效了，全被 AllExceptionsFilter 捕获了。
  app.useGlobalFilters(new AllExceptionsFilter())
  // 过滤处理 HTTP 异常
  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(port)
  l.debug(`app listen in http://localhost:${port}`)
  l.debug(`swagger listen in http://localhost:${port}/doc`)
}
bootstrap()
