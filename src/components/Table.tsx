import React from 'react';
import { cn } from '../lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  onRowClick?: (item: T) => void;
  selectedRows?: Set<string>;
  onRowSelect?: (id: string) => void;
  onSelectAll?: () => void;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  sortField,
  sortOrder,
  onSort,
  onRowClick,
  selectedRows,
  onRowSelect,
  onSelectAll,
  className,
}: TableProps<T>) {
  const allSelected =
    selectedRows && data.length > 0 && selectedRows.size === data.length;
  const someSelected =
    selectedRows && selectedRows.size > 0 && selectedRows.size < data.length;

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {onRowSelect && (
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected || false;
                  }}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.width && `w-${column.width}`
                )}
              >
                {column.sortable ? (
                  <button
                    onClick={() => onSort?.(column.key)}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    {column.header}
                    {sortField === column.key && (
                      <>
                        {sortOrder === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => {
            const key = keyExtractor(item);
            const isSelected = selectedRows?.has(key);

            return (
              <tr
                key={key}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'hover:bg-gray-50 transition-colors',
                  onRowClick && 'cursor-pointer',
                  isSelected && 'bg-blue-50'
                )}
              >
                {onRowSelect && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        onRowSelect(key);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.render
                      ? column.render(item)
                      : String((item as any)[column.key])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
