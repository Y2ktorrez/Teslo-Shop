import { BadRequestException, Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  
  private readonly logger = new Logger('ProductsService');
  onModuleInit() {
    this.$connect();
    this.logger.log(`Database connected`);
  }

  //N2.- Crear un Producto
  async create(createProductDto: CreateProductDto) {
    try {
      /* Generador de Slug Automatico */
      if (!createProductDto.slug) {
        createProductDto.slug = createProductDto.title
          .toLowerCase()
          .replaceAll(' ','_')
          .replaceAll("'",'')
      }else{
        createProductDto.slug = createProductDto.slug
        .toLocaleLowerCase()
        .replaceAll('','_')
        .replaceAll("'",'')
      }

      const product = await this.product.create({
        data: createProductDto,
      });
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    } 
  }

  async findAll(paginationDto: PaginationDto) {
    const {page, limit} = paginationDto;
    const totalPages = await this.product.count();
    const lastPage = Math.ceil(totalPages/limit);
    return{
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage
      }
    }
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {id}
    });
    if(!product){
      throw new BadRequestException(`El producto con el id ${id} no existe`);
    }
    return product;
  }

  async findOneSlug(slug: string) {
    const product = await this.product.findFirst({
      where: {slug}
    });
    if(!product){
      throw new BadRequestException(`El producto con el id ${slug} no existe`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return this.product.update({
      where: {id},
      data: updateProductDto
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.product.delete({
      where: {id}
    })
  }

  //N3. Manejo de Errores
  private handleDBExceptions(error: any){
    if(error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
