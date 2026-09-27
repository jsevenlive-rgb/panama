import { Injectable } from '@nestjs/common';
import { Prisma, Profile } from '@prisma/client';
import { PrismaService } from '../prisma.service';

export type ProfileWithRelations = Prisma.ProfileGetPayload<{
  include: {
    skills: true;
    experiences: true;
    projects: true;
  };
}>;

@Injectable()
export class ProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { id } });
  }

  findFirstWithRelations(): Promise<ProfileWithRelations | null> {
    return this.prisma.profile.findFirst({
      orderBy: { dateCreate: 'desc' },
      include: {
        skills: true,
        experiences: true,
        projects: true,
      },
    });
  }

  find(
    where: Prisma.ProfileWhereInput = {},
    query: { limit?: number; offset?: number } = {},
  ): Promise<Profile[]> {
    return this.prisma.profile.findMany({
      where,
      orderBy: { dateCreate: 'desc' },
      take: query.limit,
      skip: query.offset,
    });
  }

  count(where: Prisma.ProfileWhereInput = {}): Promise<number> {
    return this.prisma.profile.count({ where });
  }

  create(data: Prisma.ProfileUncheckedCreateInput): Promise<Profile> {
    return this.prisma.profile.create({ data });
  }

  async update(id: string, data: Prisma.ProfileUpdateInput): Promise<void> {
    await this.prisma.profile.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.profile.delete({ where: { id } });
  }
}
