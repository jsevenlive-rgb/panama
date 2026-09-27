import { Injectable } from '@nestjs/common';
import { Prisma, Profile } from '@prisma/client';
import { ProfilesRepository } from '../../../repository/prisma/profiles/profiles.repository';
import { GraphqlProfileResponse } from '../response/graphql_profile.dto';

@Injectable()
export class ProfileService {
  constructor(readonly profilesRepository: ProfilesRepository) {}

  async add(data: { name: string; description?: string }): Promise<string> {
    const now = new Date();
    const result = await this.profilesRepository.create({
      name: data.name,
      description: data.description ?? '',
      dateCreate: now,
      dateUpdate: now,
    });
    return result.id;
  }

  async get(id: string): Promise<Profile | null> {
    return this.profilesRepository.findById(id);
  }

  async getGraphqlProfile(): Promise<GraphqlProfileResponse | null> {
    const profile = await this.profilesRepository.findFirstWithRelations();
    if (!profile) {
      return null;
    }

    return {
      name: profile.name,
      description: profile.description,
      skills: profile.skills.map(({ name }) => ({ name })),
      experience: profile.experiences.map(({ company, position, period }) => ({
        company,
        position,
        period: period ?? '',
      })),
      projects: profile.projects.map(({ name, git }) => ({ name, git: git ?? '' })),
    };
  }

  async list(
    where: Prisma.ProfileWhereInput = {},
    query: { limit?: number; offset?: number } = {},
  ): Promise<{ items: Profile[]; total: number }> {
    const items = await this.profilesRepository.find(where, {
      limit: query.limit ?? 100,
      offset: query.offset ?? 0,
    });
    const total = await this.profilesRepository.count(where);
    return { items, total };
  }

  async update(id: string, data: Partial<{ name: string; description: string }>): Promise<void> {
    await this.profilesRepository.update(id, {
      ...data,
      dateUpdate: new Date(),
    });
  }

  async remove(id: string): Promise<void> {
    await this.profilesRepository.remove(id);
  }
}
