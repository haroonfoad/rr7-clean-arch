import type { Organization } from "../entities/organization";

export interface OrganizationRepository {
  list(): Promise<Organization[]>;
  existsByName(name: string, excludeId?: string): Promise<boolean>;
  create(organization: Organization): Promise<void>;
  update(organization: Organization): Promise<void>;
  delete(id: string): Promise<void>;
}
