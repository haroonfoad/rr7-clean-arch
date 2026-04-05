import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

import type { Organization } from "../../domain/entities/organization";

type OrganizationRow = Organization & { currentName: string };

interface OrganizationsPageProps {
  organizations: Organization[];
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export function OrganizationsPage({
  organizations,
  canCreate,
  canUpdate,
  canDelete,
}: OrganizationsPageProps) {
  const { t } = useTranslation();
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
      {canUpdate ? (
        <Link to={`${organization.id}/edit`}>
          <Button
            type="button"
            label={t("table.edit")}
            icon="pi pi-pencil"
            size="small"
          />
        </Link>
      ) : null}

      {canDelete ? (
        <Link to={`${organization.id}/delete`}>
          <Button
            type="button"
            label={t("table.delete")}
            icon="pi pi-trash"
            size="small"
            severity="danger"
            outlined
          />
        </Link>
      ) : null}
    </div>
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#fef9c3_0%,#eef2ff_40%,#f8fafc_100%)] px-4 py-10">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <Card
          title={t("organizations.title")}
          subTitle={t("organizations.subtitle")}
        >
          <p className="mb-6 text-sm text-slate-600">
            {t("organizations.description")}
          </p>

          {canCreate ? (
            <div className="mb-6 flex justify-end">
              <Link to="new">
                <Button
                  type="button"
                  label={t("organizations.add")}
                  icon="pi pi-plus"
                />
              </Link>
            </div>
          ) : null}

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="p-input-icon-left w-full sm:max-w-sm">
              <i className="pi pi-search" />
              <InputText
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setFirst(0);
                }}
                placeholder={t("organizations.searchPlaceholder")}
                className="w-full"
              />
            </span>
            <p className="text-xs text-slate-500">
              {t("organizations.results", { count: rows.length })}
            </p>
          </div>

          <DataTable
            value={rows}
            stripedRows
            emptyMessage={t("organizations.empty")}
            paginator
            first={first}
            rows={pageSize}
            rowsPerPageOptions={[5, 10, 20]}
            onPage={(event) => {
              setFirst(event.first);
              setPageSize(event.rows);
            }}
          >
            <Column
              field="id"
              header={t("table.id")}
              className="font-mono text-xs"
            />
            <Column
              field="name"
              header={t("table.name")}
              body={nameBodyTemplate}
              style={{ minWidth: "14rem" }}
            />
            <Column
              header={t("table.actions")}
              body={actionsBodyTemplate}
              style={{ width: "12rem" }}
            />
          </DataTable>
        </Card>
      </section>
    </main>
  );
}
