import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ERROR_TYPES } from '../../../constant/error.constant';
import { ErrorResponse, ErrorResponseLang } from '../../../response/error.dto';
import { SuccessResponse } from '../../../response/success.dto';
import { ProfileService } from '../service/profile.service';
import { SiteProfileAddRequest } from '../request/site_profile_add.dto';
import { SiteProfileUpdateRequest } from '../request/site_profile_update.dto';
import { SiteProfileIdRequest } from '../request/site_profile_id.dto';
import { SiteProfileListRequest } from '../request/site_profile_list.dto';
import { SiteProfileIdResponse } from '../response/site_profile_id.dto';

@ApiTags('Profile')
@Controller({
  path: ['site/profile'],
  version: ['1', VERSION_NEUTRAL],
})
@ApiBadRequestResponse({
  type: ErrorResponse || ErrorResponseLang,
})
export class SiteProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('add')
  @Version(['1', VERSION_NEUTRAL])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create profile' })
  async add(@Body() data: SiteProfileAddRequest): Promise<SiteProfileIdResponse> {
    const _id = await this.profileService.add(data);
    return { _id: String(_id) };
  }

  @Get('get')
  @Version(['1', VERSION_NEUTRAL])
  @ApiOperation({ summary: 'Get profile' })
  async get(@Query() query: SiteProfileIdRequest) {
    return this.profileService.get(this.toObjectId(query._id));
  }

  @Get('list')
  @Version(['1', VERSION_NEUTRAL])
  @ApiOperation({ summary: 'List profiles' })
  async list(@Query() query: SiteProfileListRequest) {
    return this.profileService.list(
      {},
      {
        limit: query.limit,
        offset: query.offset,
      },
    );
  }

  @Post('update')
  @Version(['1', VERSION_NEUTRAL])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update profile' })
  async update(@Body() data: SiteProfileUpdateRequest): Promise<SuccessResponse> {
    await this.profileService.update(this.toObjectId(data._id), {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
    });
    return new SuccessResponse();
  }

  @Post('remove')
  @Version(['1', VERSION_NEUTRAL])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove profile' })
  async remove(@Body() data: SiteProfileIdRequest): Promise<SuccessResponse> {
    this.toObjectId(data._id);
    await this.profileService.remove(data._id);
    return new SuccessResponse();
  }

  private toObjectId(id: string): string {
    if (!/^[a-f\d]{24}$/i.test(id)) {
      throw new ErrorResponse(ERROR_TYPES.WRONG_PARAMS_ERROR, 'invalid _id');
    }
    return id;
  }
}
