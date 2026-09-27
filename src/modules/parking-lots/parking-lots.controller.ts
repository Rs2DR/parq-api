import { Controller, Get, Param, HttpStatus } from '@nestjs/common';
import { ParkingLotsService } from './parking-lots.service.js';
import { Auth } from '@common/decorators/auth.decorator.js';
import { SerializeApiResponse } from '@common/decorators/serialize-api-response.decorator.js';
import { ApiParam } from '@nestjs/swagger';
import z from 'zod';
import { ParkingLotsResponseSchema } from './dto/parking-lots-response.dto.js';
import { ParkingLotDetailsResponseSchema } from './dto/parking-lot-details-response.dto.js';

@Auth()
@Controller('parking-lots')
export class ParkingLotsController {
  constructor(private readonly parkingLotsService: ParkingLotsService) {}

  @Get()
  @SerializeApiResponse({
    status: HttpStatus.OK,
    schema: z.object({
      lots: ParkingLotsResponseSchema.array(),
    }),
  })
  async getLotsForMap() {
    return this.parkingLotsService.getLotsForMap();
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
