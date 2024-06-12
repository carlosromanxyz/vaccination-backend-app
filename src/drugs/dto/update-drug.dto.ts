import { PartialType } from '@nestjs/mapped-types';
import { CreateDrugDto } from './create-drug.dto';
import {
  IsString,
  MinLength,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  Min,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateDrugDto extends PartialType(CreateDrugDto) {
  @ApiProperty({ example: 'Aspirin', description: 'The name of the drug' })
  @IsString({ message: 'The name must be a text string' })
  @IsNotEmpty({ message: 'The name cannot be empty' })
  @MinLength(3, { message: 'The name must be at least 3 characters' })
  name: string;

  @ApiProperty({ example: true, description: 'Approval status of the drug' })
  @IsBoolean({ message: 'The approved field must be a boolean value' })
  approved: boolean;

  @ApiProperty({ example: 1, description: 'Minimum dosage of the drug' })
  @IsNumber({}, { message: 'The minimum dose must be a number' })
  @Min(0, { message: 'The minimum dose must be at least 0' })
  min_dose: number;

  @ApiProperty({ example: 10, description: 'Maximum dosage of the drug' })
  @IsNumber({}, { message: 'The maximum dose must be a number' })
  @Min(0, { message: 'The maximum dose must be at least 0' })
  max_dose: number;

  @ApiProperty({
    example: '2023-12-31',
    description: 'Availability date of the drug',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'The date must be a valid date' })
  available_at: Date;
}
