
import React, { useMemo } from 'react';
import { AnexoAItem, Previsao } from '../types';

interface AnexoATableProps {
    data: AnexoAItem[];
    onDataChange: (newData: AnexoAItem[]) => void;
}

const AnexoATable: React.FC<AnexoATableProps> = ({ data, onDataChange }) => {
    
    const handleCellChange = (rowIndex: number, field: keyof AnexoAItem | 'previsaoPrincipal' | 'previsaoAlternativa', value: any, subField?: keyof Previsao) => {
        const newData = [...data];
        const row = { ...newData[rowIndex] };

        if (field === 'previsaoPrincipal' && subField) {
            row.previsaoPrincipal = { ...row.previsaoPrincipal, [subField]: value };
        } else if (field === 'previsaoAlternativa' && subField) {
            row.previsaoAlternativa = { ...row.previsaoAlternativa, [subField]: value };
        } else if (field === 'efetivoProposto') {
            const numValue = parseInt(value, 10);
            (row as any)[field] = isNaN(numValue) ? 0 : numValue;
        } else if (field === 'funcao') {
            (row as any)[field] = value;
        }

        newData[rowIndex] = row;
        onDataChange(newData);
    };

    const totalEfetivo = useMemo(() => {
        return data.reduce((sum, row) => sum + (row.efetivoProposto || 0), 0);
    }, [data]);

    const InputCell: React.FC<{ value: string | number, type?: 'text' | 'number', onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ value, type = 'text', onChange }) => (
        <td className="py-1 px-2 border-b border-gray-600">
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="w-full bg-gray-600 border-gray-500 rounded px-2 py-1 text-white focus:ring-cyan-500 focus:border-cyan-500 text-sm"
            />
        </td>
    );

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 border border-gray-600">
                <thead className="bg-gray-800 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    <tr>
                        <th rowSpan={2} className="text-center py-2 px-3 border-b border-r border-gray-600 align-middle">Função</th>
                        <th colSpan={3} className="text-center py-2 px-3 border-b border-r border-gray-600">Previsão Principal</th>
                        <th colSpan={3} className="text-center py-2 px-3 border-b border-r border-gray-600">Previsão Alternativa</th>
                        <th rowSpan={2} className="text-center py-2 px-3 border-b border-gray-600 align-middle">Efetivo Proposto</th>
                    </tr>
                    <tr>
                        <th className="text-center py-2 px-3 border-b border-r border-gray-600">Posto/Grad</th>
                        <th className="text-center py-2 px-3 border-b border-r border-gray-600">Quadro</th>
                        <th className="text-center py-2 px-3 border-b border-r border-gray-600">Espec.</th>
                        <th className="text-center py-2 px-3 border-b border-r border-gray-600">Posto/Grad</th>
                        <th className="text-center py-2 px-3 border-b border-r border-gray-600">Quadro</th>
                        <th className="text-center py-2 px-3 border-b border-r border-gray-600">Espec.</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={row.id} className="text-center">
                            <InputCell value={row.funcao} onChange={(e) => handleCellChange(rowIndex, 'funcao', e.target.value)} />
                            
                            <InputCell value={row.previsaoPrincipal.postoGrad} onChange={(e) => handleCellChange(rowIndex, 'previsaoPrincipal', e.target.value, 'postoGrad')} />
                            <InputCell value={row.previsaoPrincipal.quadro} onChange={(e) => handleCellChange(rowIndex, 'previsaoPrincipal', e.target.value, 'quadro')} />
                            <InputCell value={row.previsaoPrincipal.especialidade} onChange={(e) => handleCellChange(rowIndex, 'previsaoPrincipal', e.target.value, 'especialidade')} />

                            <InputCell value={row.previsaoAlternativa.postoGrad} onChange={(e) => handleCellChange(rowIndex, 'previsaoAlternativa', e.target.value, 'postoGrad')} />
                            <InputCell value={row.previsaoAlternativa.quadro} onChange={(e) => handleCellChange(rowIndex, 'previsaoAlternativa', e.target.value, 'quadro')} />
                            <InputCell value={row.previsaoAlternativa.especialidade} onChange={(e) => handleCellChange(rowIndex, 'previsaoAlternativa', e.target.value, 'especialidade')} />
                            
                            <InputCell value={row.efetivoProposto} type="number" onChange={(e) => handleCellChange(rowIndex, 'efetivoProposto', e.target.value)} />
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-800 font-bold">
                        <td colSpan={7} className="text-right py-2 px-3 text-gray-300">TOTAL</td>
                        <td className="text-center py-2 px-3 text-white">{totalEfetivo}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default AnexoATable;
