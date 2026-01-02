import React from 'react'

type Column = { key: string; label: React.ReactNode }

export default function Table({ columns, rows }: { columns: Column[]; rows: Record<string, any>[] }){
  return (
    <table className="gds-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="gds-table-row">
            {columns.map((col) => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
