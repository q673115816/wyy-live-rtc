import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CatDocument = Cat & Document;

class Characteristics {
  lifespan: string
  size: 'small' | 'medium' | 'large'
  coat: 'short' | 'medium' | 'long'
  color: string
}

@Schema()
export class Cat {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;

  @Prop()
  characteristics: Characteristics
}

export const CatSchema = SchemaFactory.createForClass(Cat);
