import { Module, Global } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema, User } from './schema/user.schema'

export interface Database {
  type: string
  host: string
  username: string
  password: string
  dbName: string
  port: number
}

const MONGO_MODELS = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema, collection: 'users' },
])

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const db: Database = config.get('database')
        return {
          uri: `mongodb://${db.username}:${db.password}@${db.host}:${db.port}/${db.dbName}`,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        }
      },
      inject: [ConfigService],
    }),
    MONGO_MODELS,
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
