export type FieldType = "text" | "textarea" | "select";

export type FieldConfig<T> = {
  name: keyof T & string;
  label: string;
  type: FieldType;
  options?: readonly string[];
};