import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { TodosService } from './todos/todos.service';

@Module({
  imports: [TodosModule],
  controllers: [AppController],
  providers: [AppService, TodosService],
})
export class AppModule {}
