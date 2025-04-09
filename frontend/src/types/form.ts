export interface FormField {
    id: string;
    type: string;
    label: string;
    required?: boolean;
    options?: string[];
    placeholder?: string;
}

export interface Form {
    id?: number;
    title: string;
    description?: string;
    fields: FormField[];
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
} 