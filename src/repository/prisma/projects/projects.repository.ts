import { Injectable } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<Project | null> {
    return this.prisma.project.findUnique({ where: { id } });
  }

  findByProfileId(
    profileId: string,
    query: { limit?: number; offset?: number } = {},
  ): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { profileId },
      orderBy: { dateCreate: 'desc' },
      take: query.limit,
      skip: query.offset,
    });
  }

  countByProfileId(profileId: string): Promise<number> {
    return this.prisma.project.count({ where: { profileId } });
  }

  create(data: Prisma.ProjectUncheckedCreateInput): Promise<Project> {
    return this.prisma.project.create({ data });
  }

  async update(id: string, data: Prisma.ProjectUncheckedUpdateInput): Promise<void> {
    await this.prisma.project.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.project.delete({ where: { id } });
  }

  async removeByProfileId(profileId: string): Promise<void> {
    await this.prisma.project.deleteMany({ where: { profileId } });
  }
}
