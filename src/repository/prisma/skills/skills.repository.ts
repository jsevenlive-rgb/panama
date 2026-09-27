import { Injectable } from '@nestjs/common';
import { Prisma, Skill } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SkillsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<Skill | null> {
    return this.prisma.skill.findUnique({ where: { id } });
  }

  findByProfileId(
    profileId: string,
    query: { limit?: number; offset?: number } = {},
  ): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: { profileId },
      orderBy: { dateCreate: 'desc' },
      take: query.limit,
      skip: query.offset,
    });
  }

  countByProfileId(profileId: string): Promise<number> {
    return this.prisma.skill.count({ where: { profileId } });
  }

  create(data: Prisma.SkillUncheckedCreateInput): Promise<Skill> {
    return this.prisma.skill.create({ data });
  }

  async update(id: string, data: Prisma.SkillUncheckedUpdateInput): Promise<void> {
    await this.prisma.skill.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.skill.delete({ where: { id } });
  }

  async removeByProfileId(profileId: string): Promise<void> {
    await this.prisma.skill.deleteMany({ where: { profileId } });
  }
}
