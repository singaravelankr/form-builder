export interface FormFieldType {
  id: string;
  type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'radio';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  value?: string | string[] | boolean;
}

export interface FormFieldProps {
  field: FormFieldType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormFieldType>) => void;
  onDelete: () => void;
}

export interface FormPreviewProps {
  title: string;
  fields: FormFieldType[];
} 