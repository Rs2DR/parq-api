import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

import { Auth } from '@common/decorators/auth.decorator.js';
import { SerializeApiResponse } from '@common/decorators/serialize-api-response.decorator.js';
import z from 'zod';

import { ParkingLotDetailsResponseSchema } from './dto/parking-lot-details-response.dto.js';
import { ParkingLotsResponseSchema } from './dto/parking-lots-response.dto.js';
import { ParkingLotsService } from './parking-lots.service.js';

@Auth()
@Controller('parking-lots')
export class ParkingLotsController {
  constructor(private readonly parkingLotsService: ParkingLotsService) {}

  @Get()
  @SerializeApiResponse({
    schema: z.object({
      lots: ParkingLotsResponseSchema.array(),
    }),
  })
  async getLotsForMap() {
    const lots = await this.parkingLotsService.getLotsForMap();

    return { lots };
  }

  @Get(':id')
  @SerializeApiResponse({
    status: HttpStatus.OK,
    schema: ParkingLotDetailsResponseSchema,
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  async getLotDetails(@Param('id', { schema: z.coerce.string() }) id: string) {
    return this.parkingLotsService.getLotDetails(id);
  }
}
