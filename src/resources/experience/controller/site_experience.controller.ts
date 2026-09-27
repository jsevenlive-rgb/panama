import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ERROR_TYPES } from '../../../constant/error.constant';
import { ErrorResponse, ErrorResponseLang } from '../../../response/error.dto';
import { SuccessResponse } from '../../../response/success.dto';
import { ExperienceService } from '../service/experience.service';
import { SiteExperienceAddRequest } from '../request/site_experience_add.dto';
import { SiteExperienceUpdateRequest } from '../request/site_experience_update.dto';
import { SiteExperienceIdRequest } from '../request/site_experience_id.dto';
import { SiteExperienceListRequest } from '../request/site_experience_list.dto';
import { SiteExperienceIdResponse } from '../response/site_experience_id.dto';

@ApiTags('Experience')
@Controller({
  path: ['site/experience'],
  version: ['1', VERSION_NEUTRAL],
})
@ApiBadRequestResponse({
  type: ErrorResponse || ErrorResponseLang,
})
export class SiteExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post('add')
  @Version(['1', VERSION_NEUTRAL])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create experience' })
  async add(@Body() data: SiteExperienceAddRequest): Promise<SiteExperienceIdResponse> {
    this.toObjectId(data.profile_id);
    const _id = await this.experienceService.add(data);
    return { _id: String(_id) };
  }

  @Get('get')
  @Version(['1', VERSION_NEUTRAL])
  @ApiOperation({ summary: 'Get experience' })
  async get(@Query() query: SiteExperienceIdRequest) {
    return this.experienceService.get(this.toObjectId(query._id));
  }

  @Get('list')
  @Version(['1', VERSION_NEUTRAL])
  @ApiOperation({ summary: 'List experience by profile' })
  async list(@Query() query: SiteExperienceListRequest) {
    return this.experienceService.listByProfile(this.toObjectId(query.profile_id), {
      limit: query.limit,
      offset: query.offset,
    });
  }

  @Post('update')
  @Version(['1', VERSION_NEUTRAL])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update experience' })
  async update(@Body() data: SiteExperienceUpdateRequest): Promise<SuccessResponse> {
    if (data.profile_id) this.toObjectId(data.profile_id);
    await this.experienceService.update(this.toObjectId(data._id), {
      company: data.company,
      position: data.position,
      profile_id: data.profile_id,
    });
    return new SuccessResponse();
  }

  @Post('remove')
  @Version(['1', VERSION_NEUTRAL])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove experience' })
  async remove(@Body() data: SiteExperienceIdRequest): Promise<SuccessResponse> {
    this.toObjectId(data._id);
    await this.experienceService.remove(data._id);
    return new SuccessResponse();
  }

  private toObjectId(id: string): string {
    if (!/^[a-f\d]{24}$/i.test(id)) {
      throw new ErrorResponse(ERROR_TYPES.WRONG_PARAMS_ERROR, 'invalid id');
    }
    return id;
  }
}
