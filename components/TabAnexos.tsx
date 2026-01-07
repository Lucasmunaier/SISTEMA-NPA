
import React from 'react';
import { NpaData, Anexo } from '../types';
import AnexoATable from './AnexoATable';
import AnexoBTable from './AnexoBTable';
import MilitaryEditor from './MilitaryEditor';

interface TabAnexosProps {
    data: NpaData;
    onDataChange: (field: keyof NpaData, value: any) => void;
}

const TabAnexos: React.FC<TabAnexosProps> = ({ data, onDataChange }) => {

    const updateAnexoConteudo = (id: number, conteudo: string) => {
        const updatedAnexos = data.anexos.map(anexo =>
            anexo.id === id ? { ...anexo, conteudo } : anexo
        );
        onDataChange('anexos', updatedAnexos);
    };

    return (
        <div className="space-y-12">
            {data.anexos.map((anexo) => (
                <div key={anexo.id} className="p-6 border border-gray-700 rounded-lg bg-gray-800/30">
                    <h3 className="text-xl font-bold text-cyan-400 border-b-2 border-gray-700 pb-2 mb-6 uppercase">
                        Anexo {anexo.letra} - {anexo.titulo}
                    </h3>
                    
                    {anexo.tipo === 'efetivo' && (
                        <AnexoATable
                            data={data.anexoA}
                            onDataChange={(newData) => onDataChange('anexoA', newData)}
                        />
                    )}

                    {anexo.tipo === 'qualificacao' && (
                        <AnexoBTable
                            data={data.anexoB}
                            onDataChange={(newData) => onDataChange('anexoB', newData)}
                        />
                    )}

                    {(anexo.tipo === 'fluxograma' || anexo.tipo === 'custom') && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-400 mb-2 italic">
                                Use o editor abaixo para inserir textos e imagens (como fluxogramas do Bizagi, fotos ou diagramas).
                            </p>
                            <MilitaryEditor
                                value={anexo.conteudo || ''}
                                onChange={(val) => updateAnexoConteudo(anexo.id, val)}
                                placeholder="Insira aqui o conteúdo do anexo (texto ou imagens)..."
                                minHeight="400px"
                            />
                        </div>
                    )}
                </div>
            ))}

            {data.anexos.length === 0 && (
                <div className="text-center py-12 text-gray-500 italic">
                    Nenhum anexo definido. Adicione anexos na aba "Identificação".
                </div>
            )}
        </div>
    );
};

export default TabAnexos;
