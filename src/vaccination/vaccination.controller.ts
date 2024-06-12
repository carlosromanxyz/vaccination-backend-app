import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VaccinationService } from './vaccination.service';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('vaccination')
@ApiBearerAuth()
@Controller('vaccination')
export class VaccinationController {
  constructor(private readonly vaccinationService: VaccinationService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new vaccination' })
  @ApiResponse({
    status: 201,
    description: 'The vaccination has been successfully created.',
  })
  create(@Body() createVaccinationDto: CreateVaccinationDto) {
    return this.vaccinationService.create(createVaccinationDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all vaccinations' })
  @ApiResponse({
    status: 200,
    description: 'The vaccinations have been successfully retrieved.',
  })
  findAll() {
    return this.vaccinationService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a vaccination by ID' })
  @ApiResponse({
    status: 200,
    description: 'The vaccination has been successfully retrieved.',
  })
  findOne(@Param('id') id: string) {
    return this.vaccinationService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a vaccination' })
  @ApiResponse({
    status: 200,
    description: 'The vaccination has been successfully updated.',
  })
  update(
    @Param('id') id: string,
    @Body() updateVaccinationDto: UpdateVaccinationDto,
  ) {
    return this.vaccinationService.update(id, updateVaccinationDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a vaccination' })
  @ApiResponse({
    status: 200,
    description: 'The vaccination has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.vaccinationService.remove({ id });
  }
}
