import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsUUID } from 'class-validator';

export class DeleteDrugDto {
  @ApiProperty({ example: '1', description: 'The id of the drug' })
  @IsString({ message: 'The id must be a text string' })
  @IsNotEmpty({ message: 'The id cannot be empty' })
  @MinLength(3, { message: 'The id must be at least 3 characters' })
  @IsUUID('4', {
    message: 'The id must be a valid UUID',
  })
  id: string;
}
