import { SettingModule } from './modules/setting/setting.module';
import { DatabaseModule } from './modules/database/database.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    SettingModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    TasksModule,
    UserModule,
  ],
})
export class AppModule {}
