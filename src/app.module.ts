import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullMqModule } from './bullmq/bull-mq.module';
import { AddJobModule } from './add-job/add-job.module';
import { ProcessorsModule } from './processors/processors.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
    BullMqModule,
    AddJobModule,
    ProcessorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
