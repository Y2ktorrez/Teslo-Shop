import { Type } from "class-transformer";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";

//N1. DTO
export class CreateProductDto {

  @IsString()
  @MinLength(1)
  public title: string;

  @IsNumber({
    maxDecimalPlaces:4,
  })
  @Min(0)
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  public price?: number;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsOptional()
  public slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  public stock?: number;

  @IsString({
    each: true
  })
  @IsArray()
  public sizes: string[]

  @IsIn(['men', 'women', 'kid', 'unisex'])
  public gender: string;

  @IsString({each: true})
  @IsArray()
  @IsOptional()
  public tags: string[]

}
