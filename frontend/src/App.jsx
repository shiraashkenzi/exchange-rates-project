import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import 'bootstrap/dist/css/bootstrap.min.css';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CNY', 'ILS'];

function App() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [rates, setRates] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5017/api/exchange?baseCurrency=${baseCurrency}`)
      .then(res => {
        console.log('API response:', res.data);
        const rawRates = res.data.data || {};
        const data = Object.entries(rawRates)
          .filter(([key]) => key !== baseCurrency)
          .map(([currency, rate]) => ({
            base: baseCurrency,
            target: currency,
            rate: rate
          }));
        setRates(data);
      })
      .catch(err => {
        console.error('API Error:', err);
      });
  }, [baseCurrency]);

  const columns = [
    {
      header: 'Base',
      accessorKey: 'base',
      enableSorting: true
    },
    {
      header: 'Currency',
      accessorKey: 'target',
      enableSorting: true
    },
    {
      header: 'Rate',
      accessorKey: 'rate',
      enableSorting: true
    },
  ];

  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: rates,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: false,
    enableSorting: true
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Exchange Rates</h2>
      <div className="mb-3">
        <label htmlFor="currency-select" className="form-label">Select base currency:</label>
        <select 
          id="currency-select" 
          className="form-select w-auto"
          onChange={e => setBaseCurrency(e.target.value)} 
          value={baseCurrency}
        >
          {CURRENCIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const isSorted = header.column.getIsSorted();
                const sortIcon = isSorted === 'asc' ? '🔼' : isSorted === 'desc' ? '🔽' : '↕️';
                return (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span>{sortIcon}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;


