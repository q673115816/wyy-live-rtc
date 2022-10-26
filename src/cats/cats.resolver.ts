import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class CatsResolver {
    @Query(returns => String)
    async hello() {
        return '👋';
    }
}
