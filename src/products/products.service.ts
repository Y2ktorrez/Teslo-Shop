import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  
  private readonly logger = new Logger('ProductsService');
  onModuleInit() {
    this.$connect();
    this.logger.log(`Database connected`);
  }


  async create(createProductDto: CreateProductDto) {
    try {
      const newProduct = await this.product.create({
        data: createProductDto,
      });
      return newProduct;
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`);
      throw new HttpException('Error creating product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
