
import React from 'react';
import { NpaData } from '../types';
import MilitaryRichEditor from './MilitaryRichEditor';

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

const TabCorpoTexto: React.FC<TabCorpoTextoProps> = ({ 
    data, onBodyContentChange, onSubSubContentChange, onSectionTitleChange, onSignatureChange, onDataChange, 
    addSection, removeSection, addSubsection, removeSubsection, addSubSubSection, removeSubSubSection 
}) => {
    return (
        <div className="space-y-8">
            {data.body.map((section, sectionIndex) => (
                <div key={section.id} className="p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                    <div className="flex items-center justify-between border-b-2 border-gray-700 pb-2 mb-4">
                         <div className="flex items-center flex-grow">
                            <span className="text-xl font-bold text-cyan-400 uppercase mr-2">{section.numero}</span>
                            {section.tituloEditavel ? (
                                <input 
                                    type="text"
                                    value={section.titulo}
                                    onChange={(e) => onSectionTitleChange(sectionIndex, e.target.value)}
                                    className="text-xl font-bold text-cyan-400 uppercase bg-gray-700 flex-grow p-1 rounded border border-gray-600"
                                    placeholder="TÍTULO DA SEÇÃO"
                                />
                            ) : (
                                <h3 className="text-xl font-bold text-cyan-400 uppercase">{section.titulo}</h3>
                            )}
                        </div>
                        {section.removivel && (
                             <button onClick={() => removeSection(section.id)} className="ml-4 text-red-500 hover:text-red-400 font-bold bg-gray-900 w-8 h-8 rounded flex items-center justify-center">X</button>
                        )}
                    </div>

                    <div className="space-y-6 pl-4">
                        {section.subsections.map((subsection, subsectionIndex) => {
                            if (subsection.titulo.includes('PROPOSIÇÃO')) {
                                return (
                                    <div key={subsection.id} className="p-4 bg-gray-900/40 rounded border border-gray-700">
                                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase underline">{subsection.numero} {subsection.titulo}</label>
                                        <div className="space-y-4 mt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-700 pb-4">
                                                <div>
                                                    <span className="text-xs text-gray-400">Proposto por (Nome):</span>
                                                    <input type="text" value={data.assinaturas.propostoPor.nome} onChange={e => onSignatureChange('propostoPor', 'nome', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-400">Cargo:</span>
                                                    <input type="text" value={data.assinaturas.propostoPor.cargo} onChange={e => onSignatureChange('propostoPor', 'cargo', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-700 pb-4">
                                                <div>
                                                    <span className="text-xs text-gray-400">Visto por (Nome):</span>
                                                    <input type="text" value={data.assinaturas.vistoPor.nome} onChange={e => onSignatureChange('vistoPor', 'nome', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-400">Cargo:</span>
                                                    <input type="text" value={data.assinaturas.vistoPor.cargo} onChange={e => onSignatureChange('vistoPor', 'cargo', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-xs text-gray-400">Aprovado por (Nome):</span>
                                                    <input type="text" value={data.assinaturas.aprovadoPor.nome} onChange={e => onSignatureChange('aprovadoPor', 'nome', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-400">Cargo:</span>
                                                    <input type="text" value={data.assinaturas.aprovadoPor.cargo} onChange={e => onSignatureChange('aprovadoPor', 'cargo', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <div key={subsection.id} className="border-l-2 border-gray-600 pl-4 py-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center flex-grow">
                                            <span className="block text-sm font-bold text-gray-300 mr-2 uppercase underline">{subsection.numero}</span>
                                            {subsection.tituloEditavel ? (
                                                <input 
                                                    type="text"
                                                    value={subsection.titulo}
                                                    onChange={(e) => onBodyContentChange(sectionIndex, subsectionIndex, 'titulo', e.target.value)}
                                                    className="text-sm font-bold text-gray-300 uppercase underline bg-gray-700 flex-grow p-1 rounded border border-gray-600"
                                                    placeholder="Título da Subseção (Deixe vazio para texto direto)"
                                                />
                                            ) : (
                                                 <label className="block text-sm font-bold text-gray-300 uppercase underline">{subsection.titulo}</label>
                                            )}
                                        </div>
                                        <div className="flex space-x-2 ml-2">
                                            <button onClick={() => addSubSubSection(sectionIndex, subsectionIndex)} className="text-cyan-400 hover:text-cyan-300 font-bold text-[10px] bg-gray-700 px-2 py-1 rounded">+ ALÍNEA</button>
                                            {subsection.removivel && (
                                                <button onClick={() => removeSubsection(sectionIndex, subsection.id)} className="text-red-500 hover:text-red-400 font-bold text-xs bg-gray-700 w-6 h-6 flex items-center justify-center rounded">X</button>
                                            )}
                                        </div>
                                    </div>

                                    {(!subsection.subSubsections || subsection.subSubsections.length === 0 || subsection.conteudo !== '') && (
                                        <MilitaryRichEditor
                                            value={subsection.conteudo}
                                            onChange={(val) => onBodyContentChange(sectionIndex, subsectionIndex, 'conteudo', val)}
                                            placeholder="Digite o texto aqui..."
                                        />
                                    )}

                                    {subsection.subSubsections && subsection.subSubsections.length > 0 && (
                                        <div className="mt-4 space-y-4 ml-6 border-l border-gray-700 pl-4">
                                            {subsection.subSubsections.map((sss, sssIdx) => (
                                                <div key={sss.id} className="relative">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center flex-grow">
                                                            <span className="text-xs font-bold text-gray-400 mr-2">{sss.numero}</span>
                                                            <input 
                                                                type="text" 
                                                                value={sss.titulo}
                                                                onChange={(e) => onSubSubContentChange(sectionIndex, subsectionIndex, sssIdx, 'titulo', e.target.value)}
                                                                className="text-xs font-bold text-gray-400 bg-gray-700 flex-grow p-1 rounded border border-gray-600"
                                                                placeholder="Título do Item / Alínea"
                                                            />
                                                        </div>
                                                        <button onClick={() => removeSubSubSection(sectionIndex, subsectionIndex, sss.id)} className="text-red-500 hover:text-red-400 font-bold text-[10px] ml-2 bg-gray-900 px-2 py-1 rounded">remover</button>
                                                    </div>
                                                    <MilitaryRichEditor
                                                        value={sss.conteudo}
                                                        onChange={(val) => onSubSubContentChange(sectionIndex, subsectionIndex, sssIdx, 'conteudo', val)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        <button onClick={() => addSubsection(sectionIndex)} className="bg-gray-700 hover:bg-gray-600 text-cyan-400 font-semibold text-xs px-3 py-2 rounded transition-colors">+ Adicionar Subseção (1.X)</button>
                    </div>
                </div>
            ))}
            <button onClick={addSection} className="w-full bg-cyan-800/30 hover:bg-cyan-800/50 text-cyan-300 font-bold py-4 px-4 rounded border-2 border-dashed border-cyan-500/30 transition-colors uppercase tracking-widest">
                + Inserir Nova Seção Principal (Capítulo)
            </button>
            <div className="mt-12">
                 <h3 className="text-xl font-bold text-cyan-400 border-b-2 border-gray-700 pb-2 mb-4 uppercase">REFERÊNCIAS</h3>
                 <MilitaryRichEditor
                    value={data.referencias}
                    onChange={(val) => onDataChange('referencias', val)}
                 />
            </div>
        </div>
    );
};

export default TabCorpoTexto;
