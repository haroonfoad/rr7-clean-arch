import { and, asc, eq, ne, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import type { Organization } from "../../domain/entities/organization";
import type { OrganizationRepository } from "../../domain/repositories/organization-repository";
import * as schema from "../db/schema";

export class DrizzleOrganizationRepository implements OrganizationRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async list(): Promise<Organization[]> {
    return this.db
      .select()
      .from(schema.organizations)
      .orderBy(asc(schema.organizations.name));
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const normalizedName = name.trim().toLowerCase();
    const filters = [
      sql`lower(${schema.organizations.name}) = ${normalizedName}`,
    ];

    if (excludeId) {
      filters.push(ne(schema.organizations.id, excludeId));
    }

    const rows = await this.db
      .select({ id: schema.organizations.id })
      .from(schema.organizations)
      .where(and(...filters))
      .limit(1);

    return rows.length > 0;
  }

  async create(organization: Organization): Promise<void> {
    await this.db.insert(schema.organizations).values(organization);
  }

  async update(organization: Organization): Promise<void> {
    await this.db
      .update(schema.organizations)
      .set({ name: organization.name })
      .where(eq(schema.organizations.id, organization.id));
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(schema.organizations)
      .where(eq(schema.organizations.id, id));
  }
}
