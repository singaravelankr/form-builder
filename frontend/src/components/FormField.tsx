import React from 'react';
import { FormFieldProps } from '../types';
import { TrashIcon } from '@heroicons/react/24/outline';

const FormField: React.FC<FormFieldProps> = ({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  return (
    <div
      className={`p-4 mb-4 border rounded-lg cursor-pointer ${
        isSelected ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="text-lg font-medium bg-transparent border-none focus:outline-none w-full"
            placeholder="Field Label"
          />
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-600">Required</label>
            </div>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              className="form-input"
              placeholder="Placeholder text"
            />
            {(field.type === 'select' || field.type === 'radio') && (
              <div>
                <label className="form-label">Options</label>
                <textarea
                  value={field.options?.join('\n') || ''}
                  onChange={(e) =>
                    onUpdate({ options: e.target.value.split('\n').filter(Boolean) })
                  }
                  className="form-input mt-1"
                  placeholder="Enter options (one per line)"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <TrashIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default FormField; 