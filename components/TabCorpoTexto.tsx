
import React from 'react';
import { NpaData } from '../types';

interface TabCorpoTextoProps {
    data: NpaData;
    onBodyContentChange: (sectionIndex: number, subsectionIndex: number, field: 'titulo' | 'conteudo', value: string) => void;
    onSubSubContentChange: (sectionIndex: number, subsectionIndex: number, subSubIndex: number, field: 'titulo' | 'conteudo', value: string) => void;
    onSectionTitleChange: (sectionIndex: number, value: string) => void;
    onSignatureChange: (signer: 'propostoPor' | 'vistoPor' | 'aprovadoPor', field: 'nome' | 'cargo', value: string) => void;
    onDataChange: (field: 'referencias', value: string) => void;
    addSection: () => void;
    removeSection: (sectionId: number) => void;
    addSubsection: (sectionIndex: number) => void;
    removeSubsection: (sectionIndex: number, subsectionId: number) => void;
    addSubSubSection: (sectionIndex: number, subsectionIndex: number) => void;
    removeSubSubSection: (sectionIndex: number, subsectionIndex: number, subSubId: number) => void;
}

const RichTextInput: React.FC<{ value: string; onChange: (value: string) => void; rows?: number, disabled?: boolean, placeholder?: string }> = ({ value, onChange, rows = 5, disabled = false, placeholder = "" }) => (
    <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${disabled ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : ''}`}
    />
);


const TabCorpoTexto: React.FC<TabCorpoTextoProps> = ({ 
    data, onBodyContentChange, onSubSubContentChange, onSectionTitleChange, onSignatureChange, onDataChange, 
    addSection, removeSection, addSubsection, removeSubsection, addSubSubSection, removeSubSubSection 
}) => {
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
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-4 border border-gray-700 rounded-lg">
                                            <div className="p-3 bg-gray-700/30 rounded border border-gray-600">
                                                <h4 className="font-semibold text-cyan-400 mb-2 underline">Dados para Assinaturas:</h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="text-xs text-gray-400">Proposto por:</span>
                                                        <input type="text" placeholder="Nome Completo e Posto" value={data.assinaturas.propostoPor.nome} onChange={e => onSignatureChange('propostoPor', 'nome', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
                                                        <input type="text" placeholder="Cargo/Função" value={data.assinaturas.propostoPor.cargo} onChange={e => onSignatureChange('propostoPor', 'cargo', e.target.value)} className="w-full mt-2 bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-400">Visto por:</span>
                                                        <input type="text" value={data.assinaturas.vistoPor.nome} onChange={e => onSignatureChange('vistoPor', 'nome', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
                                                        <input type="text" value={data.assinaturas.vistoPor.cargo} onChange={e => onSignatureChange('vistoPor', 'cargo', e.target.value)} className="w-full mt-2 bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-400">Aprovado por:</span>
                                                        <input type="text" value={data.assinaturas.aprovadoPor.nome} onChange={e => onSignatureChange('aprovadoPor', 'nome', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
                                                        <input type="text" value={data.assinaturas.aprovadoPor.cargo} onChange={e => onSignatureChange('aprovadoPor', 'cargo', e.target.value)} className="w-full mt-2 bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <div key={subsection.id} className="border-l-2 border-gray-600 pl-4 py-2">
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
                                        <div className="flex space-x-2">
                                            <button onClick={() => addSubSubSection(sectionIndex, subsectionIndex)} className="text-cyan-400 hover:text-cyan-300 font-bold text-xs">+ ITEM</button>
                                            {subsection.removivel && (
                                                <button onClick={() => removeSubsection(sectionIndex, subsection.id)} className="text-red-500 hover:text-red-400 font-bold text-xs">X</button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Texto da Subseção (se não for puramente um container de itens) */}
                                    {(!subsection.subSubsections || subsection.subSubsections.length === 0 || subsection.conteudo !== '') && (
                                        <RichTextInput
                                            value={subsection.conteudo}
                                            onChange={(val) => onBodyContentChange(sectionIndex, subsectionIndex, 'conteudo', val)}
                                            rows={Math.max(3, subsection.conteudo.split('\n').length + 1)}
                                            disabled={!subsection.conteudoEditavel}
                                            placeholder="Conteúdo do texto..."
                                        />
                                    )}

                                    {/* Renderização de Sub-itens (ex: 1.4.1) */}
                                    {subsection.subSubsections && subsection.subSubsections.length > 0 && (
                                        <div className="mt-4 space-y-4 ml-4">
                                            {subsection.subSubsections.map((sss, sssIdx) => (
                                                <div key={sss.id} className="relative">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center flex-grow">
                                                            <span className="text-xs font-bold text-gray-400 mr-2">{sss.numero}</span>
                                                            <input 
                                                                type="text" 
                                                                value={sss.titulo}
                                                                onChange={(e) => onSubSubContentChange(sectionIndex, subsectionIndex, sssIdx, 'titulo', e.target.value)}
                                                                className="text-xs font-bold text-gray-400 bg-gray-700 flex-grow p-1 rounded border-b border-gray-600"
                                                                placeholder="Título do Item (ex: Com Unidades Externas)"
                                                            />
                                                        </div>
                                                        <button onClick={() => removeSubSubSection(sectionIndex, subsectionIndex, sss.id)} className="text-red-800 hover:text-red-600 font-bold text-xs ml-2">remover</button>
                                                    </div>
                                                    <RichTextInput
                                                        value={sss.conteudo}
                                                        onChange={(val) => onSubSubContentChange(sectionIndex, subsectionIndex, sssIdx, 'conteudo', val)}
                                                        rows={2}
                                                        placeholder="XX"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        <button onClick={() => addSubsection(sectionIndex)} className="bg-gray-700 hover:bg-gray-600 text-cyan-400 font-semibold text-xs px-2 py-1 rounded transition-colors">+ Adicionar Subseção (Nível 2)</button>
                    </div>
                </div>
            ))}
            <button onClick={addSection} className="w-full bg-cyan-800/50 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded border-2 border-dashed border-cyan-500/50 transition-colors">
                + Adicionar Nova Seção Principal (Nível 1)
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
