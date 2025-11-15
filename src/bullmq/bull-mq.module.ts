import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { QUEUE } from './constant';

@Module({
    imports: [
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                connection: {
                    host: configService.get('REDIS_HOST') || 'localhost',
                    port: configService.get('REDIS_PORT') || 6379,
                    ...(configService.get('REDIS_USERNAME') && configService.get('REDIS_PASSWORD') && {
                        username: configService.get('REDIS_USERNAME'),
                        password: configService.get('REDIS_PASSWORD'),
                        ...(configService.get('REDIS_TLS') === 'true' && {
                            tls: {
                                ca: configService.get('REDIS_CA_PEM'),
                                cert: configService.get('REDIS_DB_CRT'),
                                key: configService.get('REDIS_DB_KEY'),
                            }
                        })
                    })
                },
                // defaultJobOptions: { removeOnComplete: true } // Applies globally only for jobs added from this server instance 
            }),
        }),
        BullBoardModule.forRoot({
            route: '/queues',
            adapter: ExpressAdapter,
        }),
        BullModule.registerQueue(
            { name: QUEUE.QUEUE_STOP_SERVER_STOP_TESTING },
        ),
        BullBoardModule.forFeature(
            { name: QUEUE.QUEUE_STOP_SERVER_STOP_TESTING, adapter: BullMQAdapter },
        ),
    ]
})
export class BullMqModule {
}
