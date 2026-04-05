import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Form } from "react-router";

type DeleteOrganizationDialogProps = {
  organizationName: string;
  submitting: boolean;
  onCancel: () => void;
};

export function DeleteOrganizationDialog({
  organizationName,
  submitting,
  onCancel,
}: DeleteOrganizationDialogProps) {
  return (
    <Dialog
      header="Delete Organization"
      visible
      modal
      style={{ width: "30rem" }}
      onHide={onCancel}
    >
      <Form method="post" className="space-y-4">
        <p className="text-sm text-slate-700">
          Are you sure you want to delete <strong>{organizationName}</strong>?
        </p>

        <div className="flex justify-end gap-2">
          <Button type="button" label="Cancel" text onClick={onCancel} />
          <Button
            type="submit"
            label="Delete"
            severity="danger"
            loading={submitting}
          />
        </div>
      </Form>
    </Dialog>
  );
}
