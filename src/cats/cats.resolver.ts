import { Query, Resolver } from '@nestjs/graphql';
import { CatsService } from './cats.service';
import { CatType } from './dto'
@Resolver()
export class CatsResolver {

    constructor(private readonly catsService: CatsService) {

    }

    @Query(returns => String)
    async hello() {
        return '👋';
    }

    @Query(returns => [CatType])
    async cats() {
        return this.catsService.findAll();
    }
}
