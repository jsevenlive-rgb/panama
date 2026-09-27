import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/client';
import { ProjectsRepository } from '../../../repository/prisma/projects/projects.repository';

@Injectable()
export class ProjectService {
  constructor(readonly projectsRepository: ProjectsRepository) {}

  async add(data: { profile_id: string; name: string }): Promise<string> {
    const now = new Date();
    const result = await this.projectsRepository.create({
      profileId: data.profile_id,
      name: data.name,
      dateCreate: now,
      dateUpdate: now,
    });
    return result.id;
  }

  async get(id: string): Promise<Project | null> {
    return this.projectsRepository.findById(id);
  }

  async listByProfile(
    profileId: string,
    query: { limit?: number; offset?: number } = {},
  ): Promise<{ items: Project[]; total: number }> {
    const items = await this.projectsRepository.findByProfileId(profileId, {
      limit: query.limit ?? 100,
      offset: query.offset ?? 0,
    });
    const total = await this.projectsRepository.countByProfileId(profileId);
    return { items, total };
  }

  async update(id: string, data: Partial<{ name: string; profile_id: string }>): Promise<void> {
    const updateDoc: { name?: string; profileId?: string; dateUpdate: Date } = { dateUpdate: new Date() };
    if (data.name !== undefined) updateDoc.name = data.name;
    if (data.profile_id !== undefined) updateDoc.profileId = data.profile_id;
    await this.projectsRepository.update(id, updateDoc);
  }

  async remove(id: string): Promise<void> {
    await this.projectsRepository.remove(id);
  }
}
