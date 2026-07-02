import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome do produto' })
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Informe a descrição do produto' })
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Informe um preço válido' })
  @Min(0, { message: 'O preço deve ser maior ou igual a zero' })
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Informe um estoque inteiro' })
  @Min(0, { message: 'O estoque deve ser maior ou igual a zero' })
  stock?: number;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Informe uma URL de imagem válida' })
  imageUrl?: string;
}
