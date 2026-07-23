import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  header: string;
  key: string;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T | ((item: T) => string);
  pageSize?: number;
  emptyMessage?: string;
}

export function DataTable<T>({ 
  data, 
  columns, 
  keyField,
  pageSize = 10,
  emptyMessage = "No records found."
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  
  // Reset page if data length changes drastically
  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, page, pageSize]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="overflow-hidden rounded-2xl border border-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] bg-white/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/45 backdrop-blur-sm text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 border-b border-white/50">
                {columns.map((col, idx) => (
                  <th key={idx} className={`py-4 px-6 font-black ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm divide-y divide-white/20">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, idx) => {
                  const itemKey = typeof keyField === 'function' ? keyField(item) : String(item[keyField]);
                  return (
                    <tr 
                      key={itemKey || idx}
                      className="hover:bg-slate-50/30 transition-colors group relative"
                    >
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className={`py-4 px-6 ${col.className || ''}`}>
                          {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-gray-400 font-medium">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {data.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <div className="text-xs font-semibold text-gray-500">
            Showing <span className="text-indigo-950 font-bold">{Math.min((page - 1) * pageSize + 1, data.length)}</span> to <span className="text-indigo-950 font-bold">{Math.min(page * pageSize, data.length)}</span> of <span className="text-indigo-950 font-bold">{data.length}</span> records
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-50 disabled:bg-gray-50 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 text-xs font-bold text-indigo-950">
              {page} / {totalPages}
            </div>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-50 disabled:bg-gray-50 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
