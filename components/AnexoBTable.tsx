
import React from 'react';
import { AnexoBItem } from '../types';

interface AnexoBTableProps {
    data: AnexoBItem[];
    onDataChange: (newData: AnexoBItem[]) => void;
}

const AnexoBTable: React.FC<AnexoBTableProps> = ({ data, onDataChange }) => {

    const handleCellChange = (rowIndex: number, field: keyof AnexoBItem, value: any) => {
        const newData = [...data];
        newData[rowIndex] = { ...newData[rowIndex], [field]: value };
        onDataChange(newData);
    };

    const addRow = () => {
        const newRow: AnexoBItem = {
            id: Date.now(),
            qualificacao: '',
            sigla: '',
            legislacao: '',
            prioridade: '',
            setorCh: '0',
            setorEnc: '0',
            setorAux: '0'
        };
        onDataChange([...data, newRow]);
    };

    const removeRow = (id: number) => {
        onDataChange(data.filter(row => row.id !== id));
    };
    
    const headers = [
        "Qualificação Desejável (Curso/Treinamento)",
        "Sigla",
        "Legislação",
        "Prioridade",
        "SETOR-CH",
        "SETOR-ENC",
        "SETOR-AUX",
        "Ações"
    ];

    return (
        <div>
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
                                    <input type="text" value={row.qualificacao} onChange={(e) => handleCellChange(rowIndex, 'qualificacao', e.target.value)} className="w-full bg-gray-600 border-gray-500 rounded px-2 py-1 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                </td>
                                <td className="py-2 px-3 border-b border-gray-600">
                                    <input type="text" value={row.sigla} onChange={(e) => handleCellChange(rowIndex, 'sigla', e.target.value)} className="w-full bg-gray-600 border-gray-500 rounded px-2 py-1 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                </td>
                                <td className="py-2 px-3 border-b border-gray-600">
                                    <input type="text" value={row.legislacao} onChange={(e) => handleCellChange(rowIndex, 'legislacao', e.target.value)} className="w-full bg-gray-600 border-gray-500 rounded px-2 py-1 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                </td>
                                <td className="py-2 px-3 border-b border-gray-600">
                                    <input type="text" value={row.prioridade} onChange={(e) => handleCellChange(rowIndex, 'prioridade', e.target.value)} className="w-full bg-gray-600 border-gray-500 rounded px-2 py-1 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                </td>
                                {(['setorCh', 'setorEnc', 'setorAux'] as const).map(field => (
                                    <td key={field} className="py-2 px-3 border-b border-gray-600 text-center">
                                        <select value={row[field]} onChange={(e) => handleCellChange(rowIndex, field, e.target.value as '0' | '1')} className="bg-gray-600 border-gray-500 rounded px-2 py-1 text-white focus:ring-cyan-500 focus:border-cyan-500">
                                            <option value="1">1</option>
                                            <option value="0">0</option>
                                        </select>
                                    </td>
                                ))}
                                <td className="py-2 px-3 border-b border-gray-600 text-center">
                                    <button onClick={() => removeRow(row.id)} className="text-red-400 hover:text-red-300 font-bold">Remover</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={addRow} className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                Adicionar Qualificação
            </button>
            <p className="mt-4 text-sm text-gray-400">LEGENDA: COLUNAS DOS CARGOS: 1 = CURSO DESEJÁVEL, 0 = CURSO NÃO DESEJÁVEL</p>
        </div>
    );
};

export default AnexoBTable;
