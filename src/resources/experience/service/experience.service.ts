import { Injectable } from '@nestjs/common';
import { Experience } from '@prisma/client';
import { ExperiencesRepository } from '../../../repository/prisma/experiences/experiences.repository';

@Injectable()
export class ExperienceService {
  constructor(readonly experiencesRepository: ExperiencesRepository) {}

  async add(data: { profile_id: string; company: string; position: string; period?: string }): Promise<string> {
    const now = new Date();
    const result = await this.experiencesRepository.create({
      profileId: data.profile_id,
      company: data.company,
      position: data.position,
      period: data.period ?? '',
      dateCreate: now,
      dateUpdate: now,
    });
    return result.id;
  }

  async get(id: string): Promise<Experience | null> {
    return this.experiencesRepository.findById(id);
  }

  async listByProfile(
    profileId: string,
    query: { limit?: number; offset?: number } = {},
  ): Promise<{ items: Experience[]; total: number }> {
    const items = await this.experiencesRepository.findByProfileId(profileId, {
      limit: query.limit ?? 100,
      offset: query.offset ?? 0,
    });
    const total = await this.experiencesRepository.countByProfileId(profileId);
    return { items, total };
  }

  async update(
    id: string,
    data: Partial<{ company: string; position: string; period: string; profile_id: string }>,
  ): Promise<void> {
    const updateDoc: { company?: string; position?: string; period?: string; profileId?: string; dateUpdate: Date } =
      {
        dateUpdate: new Date(),
      };
    if (data.company !== undefined) updateDoc.company = data.company;
    if (data.position !== undefined) updateDoc.position = data.position;
    if (data.period !== undefined) updateDoc.period = data.period;
    if (data.profile_id !== undefined) updateDoc.profileId = data.profile_id;
    await this.experiencesRepository.update(id, updateDoc);
  }

  async remove(id: string): Promise<void> {
    await this.experiencesRepository.remove(id);
  }
}
