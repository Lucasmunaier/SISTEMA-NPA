
import React, { useRef, useState, useMemo } from 'react';
import ReactQuill from 'react-quill';

interface MilitaryRichEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const MilitaryRichEditor: React.FC<MilitaryRichEditorProps> = ({ value, onChange, placeholder }) => {
    const quillRef = useRef<ReactQuill>(null);
    const [showSpacingMenu, setShowSpacingMenu] = useState(false);

    // Customiza a inserção de espaçamentos via Quill API
    const insertSpacing = (type: 'num' | 'sem' | 'sub' | 'v20' | 'v30') => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const range = quill.getSelection(true);
        let html = '';
        
        switch (type) {
            case 'num': 
                html = '<span style="display: inline-block; width: 2.5cm;">&nbsp;</span>'; 
                break;
            case 'sem': 
                html = '<span style="display: inline-block; margin-left: 2.5cm;">&nbsp;</span>'; 
                break;
            case 'sub': 
                html = '<span style="display: inline-block; margin-left: 3.5cm;">&nbsp;</span>'; 
                break;
            case 'v20': 
                html = '<div style="height: 20pt;"></div>'; 
                break;
            case 'v30': 
                html = '<div style="height: 30pt;"></div>'; 
                break;
        }

        quill.clipboard.dangerouslyPasteHTML(range.index, html);
        setShowSpacingMenu(false);
    };

    // Configuração dos módulos do Quill
    const modules = useMemo(() => ({
        toolbar: {
            container: "#toolbar-container-" + Math.random().toString(36).substr(2, 9),
        },
        clipboard: {
            matchVisual: false,
        }
    }), []);

    const toolbarId = useMemo(() => `toolbar-${Math.random().toString(36).substr(2, 9)}`, []);

    return (
        <div className="military-editor-container border border-gray-600 rounded-md overflow-hidden bg-[#f0f0f0] text-black">
            {/* Cabeçalho de Menus Estilo SIGADAER */}
            <div className="bg-[#e1e1e1] border-b border-gray-400 px-2 py-1 flex space-x-4 text-xs text-gray-700 select-none">
                <span className="hover:bg-gray-300 px-1 cursor-default">Arquivo</span>
                <span className="hover:bg-gray-300 px-1 cursor-default">Editar</span>
                <span className="hover:bg-gray-300 px-1 cursor-default">Inserir</span>
                <span className="hover:bg-gray-300 px-1 cursor-default">Visualizar</span>
                <span className="hover:bg-gray-300 px-1 cursor-default">Formatar</span>
                <span className="hover:bg-gray-300 px-1 cursor-default">Tabela</span>
                <span className="hover:bg-gray-300 px-1 cursor-default">Ferramentas</span>
            </div>

            {/* Barra de Ferramentas (Icons) */}
            <div id={toolbarId} className="bg-[#f0f0f0] p-1 flex flex-wrap items-center border-b border-gray-300 gap-1">
                <button className="ql-bold" title="Negrito"></button>
                <button className="ql-italic" title="Itálico"></button>
                <div className="w-px h-6 bg-gray-400 mx-1"></div>
                <button className="ql-align" value="" title="Esquerda"></button>
                <button className="ql-align" value="center" title="Centralizar"></button>
                <button className="ql-align" value="right" title="Direita"></button>
                <button className="ql-align" value="justify" title="Justificar"></button>
                <div className="w-px h-6 bg-gray-400 mx-1"></div>
                <button className="ql-image" title="Inserir Imagem"></button>
                <button className="ql-clean" title="Remover Formatação"></button>
                
                {/* Botão Especial de Espaçamento Militar */}
                <div className="relative ml-2">
                    <button 
                        onClick={() => setShowSpacingMenu(!showSpacingMenu)}
                        className="bg-gray-200 border border-gray-400 px-2 py-0.5 rounded flex items-center hover:bg-gray-300 transition-colors"
                        title="Inserir Espaçamento Militar"
                    >
                        <span className="text-blue-700 font-bold text-lg leading-none">+</span>
                        <span className="text-[8px] ml-1">▼</span>
                    </button>
                    {showSpacingMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowSpacingMenu(false)}></div>
                            <div className="absolute top-full left-0 z-50 bg-white border border-gray-400 shadow-2xl w-72 mt-1 rounded text-[11px] overflow-hidden">
                                <button onClick={() => insertSpacing('num')} className="w-full text-left p-2 hover:bg-blue-100 border-b border-gray-100 flex items-center">
                                    <div className="w-4 h-4 mr-2 bg-blue-500 rounded-sm"></div> Inserir 2,5cm em Parágrafo Numerado
                                </button>
                                <button onClick={() => insertSpacing('sem')} className="w-full text-left p-2 hover:bg-blue-100 border-b border-gray-100 flex items-center">
                                    <div className="w-4 h-4 mr-2 bg-green-500 rounded-sm"></div> Inserir 2,5cm em Parágrafo Sem numeração/Alínea
                                </button>
                                <button onClick={() => insertSpacing('sub')} className="w-full text-left p-2 hover:bg-blue-100 border-b border-gray-100 flex items-center">
                                    <div className="w-4 h-4 mr-2 bg-orange-500 rounded-sm"></div> Inserir espaçamento para subalínea
                                </button>
                                <button onClick={() => insertSpacing('v20')} className="w-full text-left p-2 hover:bg-blue-100 border-b border-gray-100">
                                    Inserir 20pt vertical
                                </button>
                                <button onClick={() => insertSpacing('v30')} className="w-full text-left p-2 hover:bg-blue-100">
                                    Inserir 30pt vertical
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="ml-auto flex items-center pr-2">
                    <span className="text-[10px] text-blue-600 font-bold mr-2 opacity-60">ICA 10-1</span>
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold cursor-help" title="Ajuda de Formatação">?</div>
                </div>
            </div>
            
            <div className="quill-wrapper bg-white">
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    modules={{
                        toolbar: `#${toolbarId}`
                    }}
                    style={{ minHeight: '150px' }}
                />
            </div>
            
            <style>{`
                .quill-wrapper .ql-container {
                    font-family: "Times New Roman", Times, serif !important;
                    font-size: 12pt !important;
                    border: none !important;
                    min-height: 200px;
                }
                .quill-wrapper .ql-editor {
                    padding: 15px !important;
                    line-height: 1.5;
                }
                .ql-snow.ql-toolbar {
                    display: none; /* Escondemos a toolbar padrão pois usamos a nossa customizada */
                }
            `}</style>
        </div>
    );
};

export default MilitaryRichEditor;
