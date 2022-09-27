import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { catsProviders } from './cats.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CatsController],
  providers: [CatsService, ...catsProviders]
})
export class CatsModule {}
