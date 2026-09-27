import { Injectable } from '@nestjs/common';
import { Experience, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExperiencesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<Experience | null> {
    return this.prisma.experience.findUnique({ where: { id } });
  }

  findByProfileId(
    profileId: string,
    query: { limit?: number; offset?: number } = {},
  ): Promise<Experience[]> {
    return this.prisma.experience.findMany({
      where: { profileId },
      orderBy: { dateCreate: 'desc' },
      take: query.limit,
      skip: query.offset,
    });
  }

  countByProfileId(profileId: string): Promise<number> {
    return this.prisma.experience.count({ where: { profileId } });
  }

  create(data: Prisma.ExperienceUncheckedCreateInput): Promise<Experience> {
    return this.prisma.experience.create({ data });
  }

  async update(id: string, data: Prisma.ExperienceUncheckedUpdateInput): Promise<void> {
    await this.prisma.experience.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.experience.delete({ where: { id } });
  }

  async removeByProfileId(profileId: string): Promise<void> {
    await this.prisma.experience.deleteMany({ where: { profileId } });
  }
}
