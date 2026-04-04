import { useEffect, useMemo, useState } from "react";
import { Form, useNavigation } from "react-router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

import type { Organization } from "../../domain/entities/organization";

type OrganizationRow = Organization & { currentName: string };

interface OrganizationsPageProps {
  organizations: Organization[];
  error?: string;
}

export function OrganizationsPage({
  organizations,
  error,
}: OrganizationsPageProps) {
  const navigation = useNavigation();
  const [newOrganizationName, setNewOrganizationName] = useState("");
  const [editingRows, setEditingRows] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [first, setFirst] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const isSubmitting = navigation.state === "submitting";
  const pendingAction = navigation.formAction ?? "";
  const pendingId = String(navigation.formData?.get("id") ?? "");
  const pendingName = String(navigation.formData?.get("name") ?? "").trim();

  useEffect(() => {
    if (!isSubmitting && !error && pendingAction.endsWith("/new")) {
      setNewOrganizationName("");
    }
  }, [isSubmitting, error, pendingAction]);

  const optimisticOrganizations = useMemo(() => {
    if (!isSubmitting || !pendingAction) {
      return organizations;
    }

    if (pendingAction.endsWith("/new") && pendingName) {
      return [
        {
          id: `pending-${crypto.randomUUID()}`,
          name: pendingName,
        },
        ...organizations,
      ];
    }

    if (pendingAction.endsWith("/edit") && pendingId && pendingName) {
      return organizations.map((organization) =>
        organization.id === pendingId
          ? {
              ...organization,
              name: pendingName,
            }
          : organization,
      );
    }

    if (pendingAction.endsWith("/delete") && pendingId) {
      return organizations.filter(
        (organization) => organization.id !== pendingId,
      );
    }

    return organizations;
  }, [organizations, isSubmitting, pendingAction, pendingId, pendingName]);

  const filteredOrganizations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return optimisticOrganizations;
    }

    return optimisticOrganizations.filter(
      (organization) =>
        organization.id.toLowerCase().includes(term) ||
        organization.name.toLowerCase().includes(term),
    );
  }, [optimisticOrganizations, search]);

  const rows = useMemo(
    () =>
      filteredOrganizations.map((organization) => ({
        ...organization,
        currentName: editingRows[organization.id] ?? organization.name,
      })),
    [filteredOrganizations, editingRows],
  );

  const nameBodyTemplate = (organization: OrganizationRow) => (
    <InputText
      value={organization.currentName}
      onChange={(event) => {
        setEditingRows((previous) => ({
          ...previous,
          [organization.id]: event.target.value,
        }));
      }}
      className="w-full"
    />
  );

  const actionsBodyTemplate = (organization: OrganizationRow) => (
    <div className="flex gap-2 justify-end">
      <Form method="post" action={`/organizations/${organization.id}/edit`}>
        <input type="hidden" name="id" value={organization.id} />
        <input type="hidden" name="name" value={organization.currentName} />
        <Button
          type="submit"
          label="Save"
          icon="pi pi-check"
          size="small"
          disabled={isSubmitting}
        />
      </Form>

      <Form method="post" action={`/organizations/${organization.id}/delete`}>
        <input type="hidden" name="id" value={organization.id} />
        <Button
          type="submit"
          label="Delete"
          icon="pi pi-trash"
          size="small"
          severity="danger"
          outlined
          disabled={isSubmitting}
        />
      </Form>
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

          <Form
            method="post"
            action="/organizations/new"
            className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <span className="p-input-icon-left flex-1">
              <i className="pi pi-building" />
              <InputText
                name="name"
                value={newOrganizationName}
                onChange={(event) => setNewOrganizationName(event.target.value)}
                placeholder="Organization name"
                className="w-full"
              />
            </span>
            <Button
              type="submit"
              label="Add"
              icon="pi pi-plus"
              disabled={isSubmitting}
            />
          </Form>

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

          {error ? (
            <div className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </div>
          ) : null}

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
