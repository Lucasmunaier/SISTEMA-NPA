
import React from 'react';
import { NpaData } from '../types';

interface TabCorpoTextoProps {
    data: NpaData;
    onBodyContentChange: (sectionIndex: number, subsectionIndex: number, field: 'titulo' | 'conteudo', value: string) => void;
    onSectionTitleChange: (sectionIndex: number, value: string) => void;
    onSignatureChange: (signer: 'propostoPor' | 'vistoPor' | 'aprovadoPor', field: 'nome' | 'cargo', value: string) => void;
    onDataChange: (field: 'referencias', value: string) => void;
    addSection: () => void;
    removeSection: (sectionId: number) => void;
    addSubsection: (sectionIndex: number) => void;
    removeSubsection: (sectionIndex: number, subsectionId: number) => void;
}

const RichTextInput: React.FC<{ value: string; onChange: (value: string) => void; rows?: number, disabled?: boolean }> = ({ value, onChange, rows = 5, disabled = false }) => (
    <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        disabled={disabled}
        className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${disabled ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : ''}`}
    />
);


const TabCorpoTexto: React.FC<TabCorpoTextoProps> = ({ data, onBodyContentChange, onSectionTitleChange, onSignatureChange, onDataChange, addSection, removeSection, addSubsection, removeSubsection }) => {
    return (
        <div className="space-y-8">
            {data.body.map((section, sectionIndex) => (
                <div key={section.id} className="p-4 border border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between border-b-2 border-gray-700 pb-2 mb-4">
                         <div className="flex items-center flex-grow">
                            <span className="text-xl font-bold text-cyan-400 uppercase mr-2">{section.numero}</span>
                            {section.tituloEditavel ? (
                                <input 
                                    type="text"
                                    value={section.titulo}
                                    onChange={(e) => onSectionTitleChange(sectionIndex, e.target.value)}
                                    className="text-xl font-bold text-cyan-400 uppercase bg-gray-700 flex-grow p-1 rounded"
                                    placeholder="TÍTULO DA SEÇÃO"
                                />
                            ) : (
                                <h3 className="text-xl font-bold text-cyan-400 uppercase">{section.titulo}</h3>
                            )}
                        </div>
                        {section.removivel && (
                             <button onClick={() => removeSection(section.id)} className="ml-4 text-red-500 hover:text-red-400 font-bold">X</button>
                        )}
                    </div>

                    <div className="space-y-6 pl-4">
                        {section.subsections.map((subsection, subsectionIndex) => {
                            if (subsection.titulo.includes('PROPOSIÇÃO')) {
                                return (
                                    <div key={subsection.id}>
                                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase underline">{subsection.numero} {subsection.titulo}</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-700 rounded-lg">
                                            <div>
                                                <h4 className="font-semibold text-gray-400">Proposto por:</h4>
                                                <input type="text" placeholder="Nome Completo e Posto" value={data.assinaturas.propostoPor.nome} onChange={e => onSignatureChange('propostoPor', 'nome', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
                                                <input type="text" placeholder="Cargo/Função" value={data.assinaturas.propostoPor.cargo} onChange={e => onSignatureChange('propostoPor', 'cargo', e.target.value)} className="w-full mt-2 bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-400">Visto por:</h4>
                                                <input type="text" value={data.assinaturas.vistoPor.nome} onChange={e => onSignatureChange('vistoPor', 'nome', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
                                                <input type="text" value={data.assinaturas.vistoPor.cargo} onChange={e => onSignatureChange('vistoPor', 'cargo', e.target.value)} className="w-full mt-2 bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <h4 className="font-semibold text-gray-400">Aprovado por:</h4>
                                                <input type="text" value={data.assinaturas.aprovadoPor.nome} onChange={e => onSignatureChange('aprovadoPor', 'nome', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
                                                <input type="text" value={data.assinaturas.aprovadoPor.cargo} onChange={e => onSignatureChange('aprovadoPor', 'cargo', e.target.value)} className="w-full mt-2 bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <div key={subsection.id}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center flex-grow">
                                            <span className="block text-sm font-bold text-gray-300 mr-2 uppercase underline">{subsection.numero}</span>
                                            {subsection.tituloEditavel ? (
                                                <input 
                                                    type="text"
                                                    value={subsection.titulo}
                                                    onChange={(e) => onBodyContentChange(sectionIndex, subsectionIndex, 'titulo', e.target.value)}
                                                    className="text-sm font-bold text-gray-300 uppercase underline bg-gray-700 flex-grow p-1 rounded"
                                                    placeholder="Título da Subseção"
                                                />
                                            ) : (
                                                 <label className="block text-sm font-bold text-gray-300 uppercase underline">{subsection.titulo}</label>
                                            )}
                                        </div>
                                        {subsection.removivel && (
                                            <button onClick={() => removeSubsection(sectionIndex, subsection.id)} className="ml-4 text-red-500 hover:text-red-400 font-bold text-xs">REMOVER</button>
                                        )}
                                    </div>
                                    <RichTextInput
                                        value={subsection.conteudo}
                                        onChange={(val) => onBodyContentChange(sectionIndex, subsectionIndex, 'conteudo', val)}
                                        rows={subsection.conteudo.split('\n').length + 2}
                                        disabled={!subsection.conteudoEditavel}
                                    />
                                </div>
                            )
                        })}
                        <button onClick={() => addSubsection(sectionIndex)} className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm">+ Adicionar Subseção</button>
                    </div>
                </div>
            ))}
            <button onClick={addSection} className="w-full bg-cyan-800 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                + Adicionar Nova Seção Principal
            </button>
            <div>
                 <h3 className="text-xl font-bold text-cyan-400 border-b-2 border-gray-700 pb-2 mb-4 uppercase">REFERÊNCIAS</h3>
                 <RichTextInput
                    value={data.referencias}
                    onChange={(val) => onDataChange('referencias', val)}
                    rows={10}
                 />
            </div>
        </div>
    );
};

export default TabCorpoTexto;
