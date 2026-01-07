
import React from 'react';
import { NpaData, Anexo } from '../types';

interface TabIdentificacaoProps {
    data: NpaData;
    onDataChange: (field: keyof NpaData, value: any) => void;
}

const TabIdentificacao: React.FC<TabIdentificacaoProps> = ({ data, onDataChange }) => {

    const handleAnexosChange = (anexos: Anexo[]) => {
        onDataChange('anexos', anexos);
    };

    const addAnexo = () => {
        const lastLetra = data.anexos.length > 0 ? data.anexos[data.anexos.length - 1].letra : '@';
        const newLetra = String.fromCharCode(lastLetra.charCodeAt(0) + 1);
        const newAnexo: Anexo = {
            id: Date.now(),
            letra: newLetra,
            titulo: '',
            tipo: 'custom',
            editavel: true
        };
        handleAnexosChange([...data.anexos, newAnexo]);
    };

    const updateAnexoTitle = (id: number, newTitle: string) => {
        const updatedAnexos = data.anexos.map(anexo =>
            anexo.id === id ? { ...anexo, titulo: newTitle } : anexo
        );
        handleAnexosChange(updatedAnexos);
    };

    const removeAnexo = (id: number) => {
        let remainingAnexos = data.anexos.filter(anexo => anexo.id !== id);
        remainingAnexos = remainingAnexos.map((anexo, index) => ({
            ...anexo,
            letra: String.fromCharCode('A'.charCodeAt(0) + index)
        }));
        handleAnexosChange(remainingAnexos);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="npaNumero" className="block text-sm font-medium text-gray-300 mb-1">
                        Nº do Documento
                    </label>
                    <input
                        type="text"
                        id="npaNumero"
                        value={data.numero}
                        onChange={(e) => onDataChange('numero', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder="NPA XX-XX/SETOR/2025"
                    />
                </div>
                <div>
                    <label htmlFor="dataExpedicao" className="block text-sm font-medium text-gray-300 mb-1">
                        Expedição
                    </label>
                    <input
                        type="date"
                        id="dataExpedicao"
                        value={data.dataExpedicao}
                        onChange={(e) => onDataChange('dataExpedicao', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>
                <div>
                    <label htmlFor="validade" className="block text-sm font-medium text-gray-300 mb-1">
                        Validade
                    </label>
                    <select
                        id="validade"
                        value={data.validade}
                        onChange={(e) => onDataChange('validade', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    >
                        <option>1 ANO</option>
                        <option>2 ANOS</option>
                        <option>3 ANOS</option>
                        <option>Prazo Indeterminado</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="assunto" className="block text-sm font-medium text-gray-300 mb-1">
                        Assunto
                    </label>
                    <input
                        type="text"
                        id="assunto"
                        value={data.assunto}
                        onChange={(e) => onDataChange('assunto', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder="Seção XXX (XXXX)"
                    />
                </div>
                <div>
                    <label htmlFor="distribuicao" className="block text-sm font-medium text-gray-300 mb-1">
                        Distribuição
                    </label>
                     <input
                        type="text"
                        id="distribuicao"
                        value={data.distribuicao}
                        onChange={(e) => onDataChange('distribuicao', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder="Ex: B"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Anexos</label>
                <div className="space-y-3">
                    {data.anexos.map(anexo => (
                        <div key={anexo.id} className="flex items-center space-x-3">
                            <span className="font-bold text-gray-400">{anexo.letra} -</span>
                            <input
                                type="text"
                                value={anexo.titulo}
                                readOnly={!anexo.editavel}
                                onChange={(e) => updateAnexoTitle(anexo.id, e.target.value)}
                                className={`flex-grow bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${!anexo.editavel ? 'cursor-not-allowed text-gray-400' : ''}`}
                            />
                            {anexo.editavel && (
                                <button onClick={() => removeAnexo(anexo.id)} className="text-red-500 hover:text-red-400 font-semibold">
                                    Remover
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={addAnexo} className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                    Adicionar Anexo
                </button>
            </div>
        </div>
    );
};

export default TabIdentificacao;
