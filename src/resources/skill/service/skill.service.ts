import { Injectable } from '@nestjs/common';
import { Skill } from '@prisma/client';
import { SkillsRepository } from '../../../repository/prisma/skills/skills.repository';

@Injectable()
export class SkillService {
  constructor(readonly skillsRepository: SkillsRepository) {}

  async add(data: { profile_id: string; name: string }): Promise<string> {
    const now = new Date();
    const result = await this.skillsRepository.create({
      profileId: data.profile_id,
      name: data.name,
      dateCreate: now,
      dateUpdate: now,
    });
    return result.id;
  }

  async get(id: string): Promise<Skill | null> {
    return this.skillsRepository.findById(id);
  }

  async listByProfile(
    profileId: string,
    query: { limit?: number; offset?: number } = {},
  ): Promise<{ items: Skill[]; total: number }> {
    const items = await this.skillsRepository.findByProfileId(profileId, {
      limit: query.limit ?? 100,
      offset: query.offset ?? 0,
    });
    const total = await this.skillsRepository.countByProfileId(profileId);
    return { items, total };
  }

  async update(id: string, data: Partial<{ name: string; profile_id: string }>): Promise<void> {
    const updateDoc: { name?: string; profileId?: string; dateUpdate: Date } = { dateUpdate: new Date() };
    if (data.name !== undefined) updateDoc.name = data.name;
    if (data.profile_id !== undefined) updateDoc.profileId = data.profile_id;
    await this.skillsRepository.update(id, updateDoc);
  }

  async remove(id: string): Promise<void> {
    await this.skillsRepository.remove(id);
  }
}
