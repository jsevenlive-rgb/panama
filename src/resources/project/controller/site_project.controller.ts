import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ERROR_TYPES } from '../../../constant/error.constant';
import { ErrorResponse, ErrorResponseLang } from '../../../response/error.dto';
import { SuccessResponse } from '../../../response/success.dto';
import { ProjectService } from '../service/project.service';
import { SiteProjectAddRequest } from '../request/site_project_add.dto';
import { SiteProjectUpdateRequest } from '../request/site_project_update.dto';
import { SiteProjectIdRequest } from '../request/site_project_id.dto';
import { SiteProjectListRequest } from '../request/site_project_list.dto';
import { SiteProjectIdResponse } from '../response/site_project_id.dto';

@ApiTags('Project')
@Controller({
  path: ['site/project'],
  version: ['1', VERSION_NEUTRAL],
})
@ApiBadRequestResponse({
  type: ErrorResponse || ErrorResponseLang,
})
export class SiteProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('add')
  @Version(['1', VERSION_NEUTRAL])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create project' })
  async add(@Body() data: SiteProjectAddRequest): Promise<SiteProjectIdResponse> {
    this.toObjectId(data.profile_id);
    const _id = await this.projectService.add(data);
    return { _id: String(_id) };
  }

  @Get('get')
  @Version(['1', VERSION_NEUTRAL])
  @ApiOperation({ summary: 'Get project' })
  async get(@Query() query: SiteProjectIdRequest) {
    return this.projectService.get(this.toObjectId(query._id));
  }

  @Get('list')
  @Version(['1', VERSION_NEUTRAL])
  @ApiOperation({ summary: 'List projects by profile' })
  async list(@Query() query: SiteProjectListRequest) {
    return this.projectService.listByProfile(this.toObjectId(query.profile_id), {
      limit: query.limit,
      offset: query.offset,
    });
  }

  @Post('update')
  @Version(['1', VERSION_NEUTRAL])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update project' })
  async update(@Body() data: SiteProjectUpdateRequest): Promise<SuccessResponse> {
    if (data.profile_id) this.toObjectId(data.profile_id);
    await this.projectService.update(this.toObjectId(data._id), {
      name: data.name,
      profile_id: data.profile_id,
    });
    return new SuccessResponse();
  }

  @Post('remove')
  @Version(['1', VERSION_NEUTRAL])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove project' })
  async remove(@Body() data: SiteProjectIdRequest): Promise<SuccessResponse> {
    this.toObjectId(data._id);
    await this.projectService.remove(data._id);
    return new SuccessResponse();
  }

  private toObjectId(id: string): string {
    if (!/^[a-f\d]{24}$/i.test(id)) {
      throw new ErrorResponse(ERROR_TYPES.WRONG_PARAMS_ERROR, 'invalid id');
    }
    return id;
  }
}
