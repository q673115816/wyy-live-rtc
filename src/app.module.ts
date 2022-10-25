import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { join } from 'path';
import { upperDirectiveTransformer } from './common/directives/upper-case.directive';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/test', {
      connectionName: 'cats',
    }),
    MongooseModule.forRoot('mongodb://localhost/users', {
      connectionName: 'users',
    }),
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: ['.env.development.local', '.env.development'],
    // }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: 'schema.gql',
    //   transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
    //   installSubscriptionHandlers: true,
    //   buildSchemaOptions: {
    //     directives: [
    //       new GraphQLDirective({
    //         name: 'upper',
    //         locations: [DirectiveLocation.FIELD_DEFINITION],
    //       }),
    //     ],
    //   },
    // }),
    UserModule,
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
