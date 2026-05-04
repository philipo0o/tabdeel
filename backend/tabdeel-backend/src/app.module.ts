import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ContentModule } from './content/content.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { EventsModule } from './events/events.module';
import { CommentsModule } from './comments/comments.module';
import { PublicationsModule } from './publications/publications.module';
import { AlbumsModule } from './albums/albums.module';
import { NewsModule } from './news/news.module';
import { ServicesModule } from './services/services.module';
import { UploadModule } from './upload/upload.module';
import { ContactModule } from './contact/contact.module';
import { getDatabaseConfig } from './config/database.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      exclude: ['/api*'], // Exclude /api routes so they hit the controllers
    }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    ContentModule,
    AuthModule,
    UsersModule,
    ArticlesModule,
    EventsModule,
    CommentsModule,
    PublicationsModule,
    AlbumsModule,
    NewsModule,
    ServicesModule,
    UploadModule,
    ContactModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule { }