import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

import type { Organization } from "../../domain/entities/organization";

type OrganizationRow = Organization & { currentName: string };

interface OrganizationsPageProps {
  organizations: Organization[];
}

export function OrganizationsPage({ organizations }: OrganizationsPageProps) {
  const [search, setSearch] = useState("");
  const [first, setFirst] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const filteredOrganizations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return organizations;
    }

    return organizations.filter(
      (organization) =>
        organization.id.toLowerCase().includes(term) ||
        organization.name.toLowerCase().includes(term),
    );
  }, [organizations, search]);

  const rows = useMemo(
    () =>
      filteredOrganizations.map((organization) => ({
        ...organization,
        currentName: organization.name,
      })),
    [filteredOrganizations],
  );

  const nameBodyTemplate = (organization: OrganizationRow) => (
    <span>{organization.currentName}</span>
  );

  const actionsBodyTemplate = (organization: OrganizationRow) => (
    <div className="flex gap-2 justify-end">
      <Link to={`/organizations/${organization.id}/edit`}>
        <Button type="button" label="Edit" icon="pi pi-pencil" size="small" />
      </Link>

      <Link to={`/organizations/${organization.id}/delete`}>
        <Button
          type="button"
          label="Delete"
          icon="pi pi-trash"
          size="small"
          severity="danger"
          outlined
        />
      </Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#fef9c3_0%,#eef2ff_40%,#f8fafc_100%)] px-4 py-10">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <Card
          title="Organization CRUD"
          subTitle="RR7 + PrimeReact + Drizzle + Clean Architecture"
        >
          <p className="mb-6 text-sm text-slate-600">
            This page is intentionally simple to demonstrate the architecture
            boundaries.
          </p>

          <div className="mb-6 flex justify-end">
            <Link to="/organizations/new">
              <Button
                type="button"
                label="Add Organization"
                icon="pi pi-plus"
              />
            </Link>
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="p-input-icon-left w-full sm:max-w-sm">
              <i className="pi pi-search" />
              <InputText
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setFirst(0);
                }}
                placeholder="Search by id or name"
                className="w-full"
              />
            </span>
            <p className="text-xs text-slate-500">
              Showing {rows.length} result{rows.length === 1 ? "" : "s"}
            </p>
          </div>

          <DataTable
            value={rows}
            stripedRows
            emptyMessage="No organizations yet."
            paginator
            first={first}
            rows={pageSize}
            rowsPerPageOptions={[5, 10, 20]}
            onPage={(event) => {
              setFirst(event.first);
              setPageSize(event.rows);
            }}
          >
            <Column field="id" header="ID" className="font-mono text-xs" />
            <Column
              field="name"
              header="Name"
              body={nameBodyTemplate}
              style={{ minWidth: "14rem" }}
            />
            <Column
              header="Actions"
              body={actionsBodyTemplate}
              style={{ width: "12rem" }}
            />
          </DataTable>
        </Card>
      </section>
    </main>
  );
}
