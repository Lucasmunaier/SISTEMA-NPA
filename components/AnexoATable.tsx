
import React, { useMemo } from 'react';
import { AnexoAItem } from '../types';

interface AnexoATableProps {
    data: AnexoAItem[];
    onDataChange: (newData: AnexoAItem[]) => void;
}

const AnexoATable: React.FC<AnexoATableProps> = ({ data, onDataChange }) => {
    const handleCellChange = (rowIndex: number, field: keyof AnexoAItem, value: any) => {
        const newData = [...data];
        if (field === 'efetivoProposto') {
            const numValue = parseInt(value, 10);
            newData[rowIndex] = { ...newData[rowIndex], [field]: isNaN(numValue) ? 0 : numValue };
        } else {
            newData[rowIndex] = { ...newData[rowIndex], [field]: value };
        }
        onDataChange(newData);
    };

    const totalEfetivo = useMemo(() => {
        return data.reduce((sum, row) => sum + (row.efetivoProposto || 0), 0);
    }, [data]);

    const headers = [
        "Função",
        "Previsão Principal (Posto/Grad, Quadro, Espec.)",
        "Previsão Alternativa (Posto/Grad, Quadro, Espec.)",
        "Efetivo Proposto"
    ];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 border border-gray-600">
                <thead className="bg-gray-800">
                    <tr>
                        {headers.map(header => (
                            <th key={header} className="text-center py-2 px-3 border-b border-gray-600 text-sm font-semibold text-gray-300 uppercase tracking-wider">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={row.id}>
                            <td className="py-2 px-3 border-b border-gray-600">
                                <input
                                    type="text"
                                    value={row.funcao}
                                    onChange={(e) => handleCellChange(rowIndex, 'funcao', e.target.value)}
                                    className="w-full bg-gray-600 border-gray-500 rounded px-2 py-1 text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </td>
                            <td className="py-2 px-3 border-b border-gray-600">
                                <input
                                    type="text"
                                    value={row.previsaoPrincipal}
                                    onChange={(e) => handleCellChange(rowIndex, 'previsaoPrincipal', e.target.value)}
                                    className="w-full bg-gray-600 border-gray-500 rounded px-2 py-1 text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </td>
                            <td className="py-2 px-3 border-b border-gray-600">
                                <input
                                    type="text"
                                    value={row.previsaoAlternativa}
                                    onChange={(e) => handleCellChange(rowIndex, 'previsaoAlternativa', e.target.value)}
                                    className="w-full bg-gray-600 border-gray-500 rounded px-2 py-1 text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </td>
                            <td className="py-2 px-3 border-b border-gray-600">
                                <input
                                    type="number"
                                    value={row.efetivoProposto}
                                    onChange={(e) => handleCellChange(rowIndex, 'efetivoProposto', e.target.value)}
                                    className="w-full bg-gray-600 border-gray-500 rounded px-2 py-1 text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-800 font-bold">
                        <td colSpan={3} className="text-right py-2 px-3 text-gray-300">TOTAL</td>
                        <td className="text-center py-2 px-3 text-white">{totalEfetivo}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default AnexoATable;
