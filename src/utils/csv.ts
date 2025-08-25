export function toCSV(rows: Record<string, any>[], filename = 'pokedex.csv') {
    if (!rows.length) return
    const headers = Object.keys(rows[0])
    const esc = (v: any) => {
        const s = String(v ?? '')
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const body = rows.map(r => headers.map(h => esc(r[h])).join(',')).join('\n')
    const csv = [headers.join(','), body].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
}
