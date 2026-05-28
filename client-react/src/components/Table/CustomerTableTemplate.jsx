
import React from 'react';
import Button from '../Buttons/Button';
import { Toast } from '..';
import CustomSearch from '../FormFields/Custom/CustomSearch';
import CustomSelect from '../FormFields/Custom/CustomSelect';
import { useState } from "react";

const options = [
    { label: "Showing 10 rows", value: "10" },
    { label: "Showing 25 rows", value: "25" },
    { label: "Showing 50 rows", value: "50" },
    { label: "Showing 100 rows", value: "100" },
];

export default function CustomerTableTemplate({ columns, rows, onDelete, onRefreshButtonClicked, search, handleFilter, setSearchValue, searchValue, filteredData = [rows], newLimit = 10, meta, handleRowsPerPageChange }) {
    
    
    let serverPagination = true;
    const [selectedRows, setSelectedRows] = useState(rows);
    const [limit, setLimit] = useState(meta.limit); 
    const [showRows, setShowRows] = useState(10); 
    const [currentPage, setCurrentPage] = useState(meta.currentPage);
    
    const indexOfLastRecord = currentPage * limit;
    const indexOfFirstRecord = indexOfLastRecord - limit;

    
    const currentRows = meta.currentPage;

    
    const totalPages = meta.totalPages;
    

    const FIXED_HEIGHT_CLASS = "h-[630px]";

    const onSearch = (key, value) => {
        console.log("Searching for:", value);
        setSearchValue({ key: key, value: value });
        handleFilter({ key: key, value: value })
        console.log("Searching for:", key);
        console.log("Searching value:", value);
    }
    const handleSort = (columnKey) => {
        let prevMeta = { ...meta };
        console.log("Sorting by:", prevMeta);
            let nextOrder = null;

            
            if (prevMeta.sortBy !== columnKey) {
                nextOrder = "asc";
            } else if (prevMeta.sortOrder === "asc") {
                nextOrder = "desc";
            } else if (prevMeta.sortOrder === "desc") {
                nextOrder = null;
            }

            const newMeta = {
                ...prevMeta,
                sortBy: nextOrder ? columnKey : null,
                sortOrder: nextOrder,
                page: 1, 
            };
            console.log("New sorting meta:", newMeta);
            return handleRowsPerPageChange(null,null,newMeta.sortBy,newMeta.sortOrder);
        
    };
    return (
        <div className="overflow-x-auto">
            <div className='flex flex-col md:flex-row md:items-center justify-between mb-4'>

                <Button onClick={() => onRefreshButtonClicked()} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    title="Refresh"
                    icon="refresh"
                    size="lg"
                />
                <Button onClick={() => { Toast.warn("coming soon...") }} className="mb-4 ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    title="Export CSV"
                    icon="download"
                    size="lg"
                />
                <div className='mb-4 font-semibold text-lg'>
                    <CustomSearch
                        placeholder="Search..."
                        value={searchValue.key === 'global' ? searchValue.value : ''}
                        onChange={(key, value) => onSearch('global', value)
                        }
                        size={'lg'}
                    />
                </div>
            </div>
            <div className={`overflow-auto ${FIXED_HEIGHT_CLASS} custom-scrollbar`}>

                <table className="min-w-full table-fixed border-separate border-spacing-0">
                    <thead className="sticky top-0 z-20 bg-gray-50 shadow-sm">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="py-4 px-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200 min-w-[200px] bg-gray-50"
                                >
                                    <div className="flex flex-col gap-2">
                                        
                                        <div 
        className="flex items-center justify-between cursor-pointer group/title"
        onClick={() => handleSort(col.key)}
      >
        <span>{col.key}</span>
        
        {/* Sort Arrows Container */}
        <div className="flex flex-col -gap-1">
          <span className={`material-symbols-rounded !text-[16px] leading-none transition-colors
            ${meta.sortBy === col.key && meta.sortOrder === 'asc' 
              ? 'text-blue-600 opacity-100' 
              : 'text-gray-300 opacity-50 group-hover/title:text-gray-400'}`}
          >
            arrow_drop_up
          </span>
          <span className={`material-symbols-rounded !text-[16px] leading-none transition-colors -mt-2
            ${meta.sortBy === col.key && meta.sortOrder === 'desc' 
              ? 'text-blue-600 opacity-100' 
              : 'text-gray-300 opacity-50 group-hover/title:text-gray-400'}`}
          >
            arrow_drop_down
          </span>
        </div>
      </div>
                                        <CustomSearch
                                            placeholder={`Search ${col.key}...`}
                                            value={searchValue.key === col.key ? searchValue.value : ''}
                                            onChange={(key, value) => onSearch(col.key, value)}
                                            size="sm"
                                        />
                                    </div>
                                </th>
                            ))}
                            <th className="py-4 px-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200 w-32 bg-gray-50">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                        {rows.length > 0 ? (
                            rows.map((row) => (
                                <tr key={row.id} className="h-[52px] transition-colors hover:bg-blue-50/50 group">
                                    {columns.map((col) => (
                                        <td key={col.key} className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                                            {col.key === 'email' ? (
                                                <span className="text-blue-600 font-medium">{row[col.key]}</span>
                                            ) : (
                                                row[col.key]
                                            )}
                                        </td>
                                    ))}
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <Button
                                            title="Delete"
                                            variant="text"
                                            color="danger"
                                            size="sm"
                                            icon="delete"
                                            onClick={() => onDelete(row.id)}
                                            className="group-hover:opacity-100 transition-opacity"
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="h-[520px] text-center text-gray-400">
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="material-symbols-rounded block text-4xl mb-2">inventory_2</span>
                                        <p>No customers found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">

                    {/* Left Side: Page Size Selector */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 font-medium">Page Size:</span>
                        {meta.limit}
                    </div>
                    <CustomSelect

                        options={options}
                        value={meta.limit}
                        onChange={handleRowsPerPageChange}
                        size="sm"
                    />

                    {/* Center: Record Status */}
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-bold text-black">{indexOfFirstRecord + 1}</span> to{" "}
                        <span className="font-bold text-black">
                            {indexOfFirstRecord + meta.limit}
                        </span>{" "}
                        total records: <span className="font-bold text-black">{meta.totalRecords}</span> entries
                    </div>

                    {/* Right Side: Pagination Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            title="Prev"
                            size="sm"
                            variant="outlined"
                            disabled={currentPage === 1 ? true : false}
                            onClick={() => { if (currentPage > 1) handleRowsPerPageChange(meta.limit, currentPage - 1); }}
                        />
                        <div className="px-4 py-1 bg-white border border-gray-200 rounded text-sm font-bold w-[90px] text-center">
                            {currentPage} / {totalPages}
                        </div>
                        <Button
                            title="Next"
                            size="sm"
                            variant="outlined"
                            disabled={currentPage === totalPages ? true : false}
                            onClick={() => { if (currentPage < totalPages) handleRowsPerPageChange(meta.limit, currentPage + 1); }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}