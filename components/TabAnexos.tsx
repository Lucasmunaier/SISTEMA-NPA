
import React from 'react';
import { NpaData } from '../types';
import AnexoATable from './AnexoATable';
import AnexoBTable from './AnexoBTable';

interface TabAnexosProps {
    data: NpaData;
    onDataChange: (field: keyof NpaData, value: any) => void;
}

const TabAnexos: React.FC<TabAnexosProps> = ({ data, onDataChange }) => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-cyan-400 border-b-2 border-gray-700 pb-2 mb-4">Anexo A - Tabela de Efetivo Proposto</h3>
                <AnexoATable
                    data={data.anexoA}
                    onDataChange={(newData) => onDataChange('anexoA', newData)}
                />
            </div>
            <div>
                <h3 className="text-xl font-semibold text-cyan-400 border-b-2 border-gray-700 pb-2 mb-4">Anexo B - Matriz de Qualificação</h3>
                <AnexoBTable
                    data={data.anexoB}
                    onDataChange={(newData) => onDataChange('anexoB', newData)}
                />
            </div>
             <div>
                <h3 className="text-xl font-semibold text-cyan-400 border-b-2 border-gray-700 pb-2 mb-4">Anexo C - Fluxograma Bizagi</h3>
                <div className="p-4 border-2 border-dashed border-gray-600 rounded-lg text-center text-gray-400">
                    <p>O espaço para o Fluxograma Bizagi será gerado na exportação.</p>
                    <p>O usuário poderá colar a imagem no documento final (Word/PDF).</p>
                </div>
            </div>
        </div>
    );
};

export default TabAnexos;
