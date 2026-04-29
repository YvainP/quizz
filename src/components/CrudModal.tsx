import { useEffect, useState } from "react";

type FieldType = "text" | "textarea" | "select";

export type FieldConfig<T> = {
  name: keyof T & string;
  label: string;
  type: FieldType;
  options?: string[]; // for select
};

type Props<T> = {
  open: boolean;
  title: string;
  fields: FieldConfig<T>[];

  initialValues: T;

  onClose: () => void;
  onSave: (values: T) => Promise<void> | void;
};

export default function CrudModal<T extends Record<string, any>>({
  open,
  title,
  fields,
  initialValues,
  onClose,
  onSave,
}: Props<T>) {
  const [form, setForm] = useState<T>(initialValues);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues, open]);

  if (!open) return null;

  const updateField = (key: keyof T, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-lg sm:mx-auto sm:my-10 sm:rounded-xl flex flex-col">

        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold">{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {fields.map((field) => (
            <div key={field.name}>
              {field.type === "textarea" ? (
                <textarea
                  className="w-full border p-3 rounded"
                  placeholder={field.label}
                  value={form[field.name] ?? ""}
                  onChange={(e) =>
                    updateField(field.name, e.target.value)
                  }
                />
              ) : field.type === "select" ? (
                <select
                  className="w-full border p-3 rounded"
                  value={form[field.name] ?? ""}
                  onChange={(e) =>
                    updateField(field.name, e.target.value)
                  }
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="w-full border p-3 rounded"
                  placeholder={field.label}
                  value={form[field.name] ?? ""}
                  onChange={(e) =>
                    updateField(field.name, e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border p-3 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-blue-500 text-white p-3 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}