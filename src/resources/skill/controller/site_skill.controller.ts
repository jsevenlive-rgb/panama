import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ERROR_TYPES } from '../../../constant/error.constant';
import { ErrorResponse, ErrorResponseLang } from '../../../response/error.dto';
import { SuccessResponse } from '../../../response/success.dto';
import { SkillService } from '../service/skill.service';
import { SiteSkillAddRequest } from '../request/site_skill_add.dto';
import { SiteSkillUpdateRequest } from '../request/site_skill_update.dto';
import { SiteSkillIdRequest } from '../request/site_skill_id.dto';
import { SiteSkillListRequest } from '../request/site_skill_list.dto';
import { SiteSkillIdResponse } from '../response/site_skill_id.dto';

@ApiTags('Skill')
@Controller({
  path: ['site/skill'],
  version: ['1', VERSION_NEUTRAL],
})
@ApiBadRequestResponse({
  type: ErrorResponse || ErrorResponseLang,
})
export class SiteSkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post('add')
  @Version(['1', VERSION_NEUTRAL])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create skill' })
  async add(@Body() data: SiteSkillAddRequest): Promise<SiteSkillIdResponse> {
    this.toObjectId(data.profile_id);
    const _id = await this.skillService.add(data);
    return { _id: String(_id) };
  }

  @Get('get')
  @Version(['1', VERSION_NEUTRAL])
  @ApiOperation({ summary: 'Get skill' })
  async get(@Query() query: SiteSkillIdRequest) {
    return this.skillService.get(this.toObjectId(query._id));
  }

  @Get('list')
  @Version(['1', VERSION_NEUTRAL])
  @ApiOperation({ summary: 'List skills by profile' })
  async list(@Query() query: SiteSkillListRequest) {
    return this.skillService.listByProfile(this.toObjectId(query.profile_id), {
      limit: query.limit,
      offset: query.offset,
    });
  }

  @Post('update')
  @Version(['1', VERSION_NEUTRAL])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update skill' })
  async update(@Body() data: SiteSkillUpdateRequest): Promise<SuccessResponse> {
    if (data.profile_id) this.toObjectId(data.profile_id);
    await this.skillService.update(this.toObjectId(data._id), {
      name: data.name,
      profile_id: data.profile_id,
    });
    return new SuccessResponse();
  }

  @Post('remove')
  @Version(['1', VERSION_NEUTRAL])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove skill' })
  async remove(@Body() data: SiteSkillIdRequest): Promise<SuccessResponse> {
    this.toObjectId(data._id);
    await this.skillService.remove(data._id);
    return new SuccessResponse();
  }

  private toObjectId(id: string): string {
    if (!/^[a-f\d]{24}$/i.test(id)) {
      throw new ErrorResponse(ERROR_TYPES.WRONG_PARAMS_ERROR, 'invalid id');
    }
    return id;
  }
}
