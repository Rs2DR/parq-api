import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

import { Auth } from '@common/decorators/auth.decorator.js';
import { SerializeApiResponse } from '@common/decorators/serialize-api-response.decorator.js';
import { CurrentUser } from '@common/decorators/user.decorator.js';
import { type JwtPayload } from '@common/interfaces/jwt-payload.interfaces.js';
import z from 'zod';

import { Vehicle } from '../../infrastructure/database/schema/vehicles.js';
import {
  type CreateVehicleDto,
  CreateVehicleSchema,
} from './dto/create-vehicle.dto.js';
import { VehicleResponseSchema } from './dto/vehicle-response.dto.js';
import { VehiclesService } from './vehicles.service.js';

@Auth()
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @SerializeApiResponse({
    schema: z.object({
      vehicles: VehicleResponseSchema.array(),
    }),
  })
  async getMyVehicles(@CurrentUser() user: JwtPayload) {
    const vehicles = await this.vehiclesService.getMyVehicles(user.sub);
    return { vehicles };
  }

  @Post()
  @SerializeApiResponse({ schema: VehicleResponseSchema })
  async addVehicle(
    @CurrentUser() user: JwtPayload,
    @Body({ schema: CreateVehicleSchema }) dto: CreateVehicleDto,
  ) {
    return this.vehiclesService.addVehicle(user.sub, dto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Unique Vehicle Identifier (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVehicle(
    @CurrentUser() user: JwtPayload,
    @Param('id', { schema: z.coerce.string() }) vehicleId: Vehicle['id'],
  ) {
    await this.vehiclesService.removeVehicle(user.sub, vehicleId);
  }
}
