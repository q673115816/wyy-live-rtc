import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from './schemas/cat.schema';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>
    ) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    // return 'This action adds a new cat';
    return await this.catModel.create(createCatDto)
  }

  async findAll(): Promise<Cat[]> {
    // return `This action returns all cats`;
    return this.catModel.find().exec()
  }

  findOne(id: number) {
    // return `This action returns a #${id} cat`;
    return this.catModel.findOne({_id: id}).exec()
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  async remove(id: number) {
    // return `This action removes a #${id} cat`;
    return await this.catModel.findByIdAndRemove({_id: id})
    .exec()
  }
}
