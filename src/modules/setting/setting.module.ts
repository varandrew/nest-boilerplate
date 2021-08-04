import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DevConf from 'src/conf/dev.conf';
import ProdConf from 'src/conf/prod.conf';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [process.env.NODE_ENV === 'development' ? DevConf : ProdConf],
    }),
  ],
})
export class SettingModule {}
