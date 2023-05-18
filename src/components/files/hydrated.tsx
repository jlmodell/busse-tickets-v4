"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { FileList } from "@/types/file.type";
import { useEffect, useReducer } from "react";
import DownloadIcon from "./download";

const columnHelper = createColumnHelper<FileList>();

const ListOfFilesTableRenderer = ({
  user,
  data,
}: {
  user?: string;
  data: FileList[];
}) => {
  const initialState = {
    data: [...data],
    filter: "",
  };

  const [state, dispatch] = useReducer(
    (state: any, action: any) => {
      switch (action.type) {
        case "SET_DATA":
          return {
            ...state,
            data: action.data,
          };
        case "SET_FILTER":
          return {
            ...state,
            filter: action.filter,
          };
        case "RESET_FILTER":
          return initialState;
        default:
          return state;
      }
    },
    { ...initialState }
  );

  useEffect(() => {
    let timer = setTimeout(() => {
      const filteredData = data.filter((file: FileList) =>
        file.filename.toLowerCase().includes(state.filter.toLowerCase())
      );
      dispatch({ type: "SET_DATA", data: filteredData });
    }, 500);
    return () => clearTimeout(timer);
  }, [data, state.filter]);

  const columns = [
    columnHelper.accessor("filename", {
      cell: (info) => info.getValue(),
      header: "Filename",
    }),

    columnHelper.accessor("url", {
      cell: (info) => (
        <a
          className="cursor-pointer bg-gray-100 hover:bg-gray-200"
          href={info.getValue()}
        >
          <DownloadIcon />
        </a>
      ),
      header: "",
    }),
  ];

  const table = useReactTable({
    data: state.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="w-full min-w-full flex flex-col justify-around items-center">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Search..."
          value={state.filter}
          className="border rounded p-1"
          onChange={(e) =>
            dispatch({ type: "SET_FILTER", filter: e.target.value })
          }
        />
        <button
          className="border rounded p-1 border-gray-300 bg-gray-100 hover:bg-gray-200"
          onClick={() => dispatch({ type: "RESET_FILTER" })}
        >
          Reset
        </button>
      </div>
      <Table className="">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup, idx) => (
            <TableRow key={idx}>
              {headerGroup.headers.map((header, idx) => (
                <TableHead key={idx}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, idx) => (
            <TableRow key={idx}>
              {row.getVisibleCells().map((cell, idx) => (
                <TableCell key={idx}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex w-full items-center justify-center gap-2 my-5">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16 text-center"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ListOfFilesTableRenderer;
