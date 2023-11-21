import { compareItems, RankingInfo, rankItem } from '@tanstack/match-sorter-utils';
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingFn,
  sortingFns
} from '@tanstack/react-table';
import { HeaderGroup, PaginationState, Row, SortingState, Table, useReactTable } from '@tanstack/react-table';
import React from 'react';
import { ArrowDown, ArrowRight, ArrowUp } from 'tabler-icons-react';

declare module '@tanstack/table-core' {
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

export type IBaseTableProps = {
  columns: ColumnDef<any>[];
  data: any[];
};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(rowA.columnFiltersMeta[columnId]?.itemRank!, rowB.columnFiltersMeta[columnId]?.itemRank!);
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export function BaseTable({ columns, data }: IBaseTableProps) {
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const instance = useReactTable({
    data,
    columns,
    state: { sorting, pagination, globalFilter },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <>
      <div className=''>
        <input
          className='mb-3 min-w-[700px] border w-full py-[10px] px-3 rounded-md focus:outline-blue-300 focus:shadow-outline bg-transparent'
          placeholder='Type a keyword to search...'
          type='text'
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(String(e.target.value))}
        />

        <div className='border rounded-lg overflow-auto'>
          <table className='min-w-[700px] w-full border-transparent'>
            <thead>
              {instance.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <tr className='bg-red-300 rounded-2xl m-0 p-0 border-none' key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className='border-x dark:border-gray-500 text-left py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-t-sm'>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort() ? 'cursor-pointer select-none flex items-center align-middle' : 'flex',
                            onClick: header.column.getToggleSortingHandler()
                          }}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <ArrowUp className='ml-1' />,
                            desc: <ArrowDown className='ml-1' />
                          }[header.column.getIsSorted() as string] ?? <ArrowRight className='ml-1 text-transparent' />}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {instance.getRowModel().rows.map((row: Row<any>) => (
                <tr key={row.id} className=''>
                  {row.getVisibleCells().map((cell) => (
                    <td className='text-left py-2 px-3 border-gray-100 border' key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* pagination */}
      <div className='flex justify-end items-center gap-2 mt-4'>
        <button
          className='border py-1 px-2 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-700 rounded-lg'
          onClick={() => instance.setPageIndex(0)}
          disabled={!instance.getCanPreviousPage()}>
          {'<<'}
        </button>
        <button
          className='border py-1 px-2 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-700 rounded-lg'
          onClick={() => instance.previousPage()}
          disabled={!instance.getCanPreviousPage()}>
          {'<'}
        </button>
        <button
          className='border py-1 px-2 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-700 rounded-lg'
          onClick={() => instance.nextPage()}
          disabled={!instance.getCanNextPage()}>
          {'>'}
        </button>
        <button
          className='border py-1 px-2 cursor-pointer  hover:bg-gray-100 hover:dark:bg-gray-700 rounded-lg'
          onClick={() => instance.setPageIndex(instance.getPageCount() - 1)}
          disabled={!instance.getCanNextPage()}>
          {'>>'}
        </button>
        <span className='flex items-center gap-1'>
          <div>Page</div>
          <strong>
            {instance.getState().pagination.pageIndex + 1} of {instance.getPageCount()}
          </strong>
        </span>

        <select
          className='bg-transparent border py-1 px-4 hover:bg-gray-100 cursor-pointer hover:dark:bg-gray-700 focus:outline-none rounded-lg'
          value={instance.getState().pagination.pageSize}
          onChange={(e) => {
            instance.setPageSize(Number(e.target.value));
          }}>
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
