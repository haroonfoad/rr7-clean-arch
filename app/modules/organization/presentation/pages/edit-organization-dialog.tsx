import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Form } from "react-router";

type EditOrganizationDialogProps = {
  organizationId: string;
  organizationName: string;
  submitting: boolean;
  error?: string;
  onCancel: () => void;
};

export function EditOrganizationDialog({
  organizationId,
  organizationName,
  submitting,
  error,
  onCancel,
}: EditOrganizationDialogProps) {
  return (
    <Dialog
      header="Edit Organization"
      visible
      modal
      style={{ width: "30rem" }}
      onHide={onCancel}
    >
      <Form method="post" className="space-y-4">
        <input type="hidden" name="id" value={organizationId} />

        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Organization Name
          </label>
          <InputText
            id="name"
            name="name"
            className="w-full"
            defaultValue={organizationName}
            autoFocus
          />
        </div>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <div className="flex justify-end gap-2">
          <Button type="button" label="Cancel" text onClick={onCancel} />
          <Button type="submit" label="Save" loading={submitting} />
        </div>
      </Form>
    </Dialog>
  );
}
