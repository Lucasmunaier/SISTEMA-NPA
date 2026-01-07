
import React, { useRef, useState, useMemo, useEffect } from 'react';
import ReactQuill from 'react-quill';

interface MilitaryRichEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const MilitaryRichEditor: React.FC<MilitaryRichEditorProps> = ({ value, onChange, placeholder }) => {
    const quillRef = useRef<ReactQuill>(null);
    const [showSpacingMenu, setShowSpacingMenu] = useState(false);
    
    // Identificador único para a toolbar para evitar conflitos se houver múltiplos editores na tela
    const toolbarId = useMemo(() => `toolbar-${Math.random().toString(36).substr(2, 9)}`, []);

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
        quill.setSelection(range.index + 1, 0); // Reposiciona o cursor após inserir
    };

    const modules = useMemo(() => ({
        toolbar: `#${toolbarId}`,
        clipboard: {
            matchVisual: false,
        }
    }), [toolbarId]);

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'link', 'image', 'align', 'color', 'background'
    ];

    return (
        <div className="military-editor-container border border-gray-600 rounded-md overflow-hidden bg-[#f0f0f0] text-black shadow-inner">
            {/* Cabeçalho de Menus Decorativos Estilo SIGADAER */}
            <div className="bg-[#e1e1e1] border-b border-gray-400 px-2 py-1 flex space-x-4 text-[10px] font-sans text-gray-700 select-none uppercase tracking-tight">
                <span className="hover:bg-gray-300 px-1 cursor-default">Arquivo</span>
                <span className="hover:bg-gray-300 px-1 cursor-default">Editar</span>
                <span className="hover:bg-gray-300 px-1 cursor-default">Inserir</span>
                <span className="hover:bg-gray-300 px-1 cursor-default">Visualizar</span>
                <span className="hover:bg-gray-300 px-1 cursor-default">Formatar</span>
                <span className="hover:bg-gray-300 px-1 cursor-default">Tabela</span>
                <span className="hover:bg-gray-300 px-1 cursor-default">Ferramentas</span>
            </div>

            {/* Barra de Ferramentas Customizada */}
            <div id={toolbarId} className="bg-[#f0f0f0] p-1 flex flex-wrap items-center border-b border-gray-300 gap-1">
                <button className="ql-bold" title="Negrito"></button>
                <button className="ql-italic" title="Itálico"></button>
                <button className="ql-underline" title="Sublinhado"></button>
                <div className="w-px h-6 bg-gray-400 mx-1"></div>
                <button className="ql-align" value="" title="Esquerda"></button>
                <button className="ql-align" value="center" title="Centralizar"></button>
                <button className="ql-align" value="right" title="Direita"></button>
                <button className="ql-align" value="justify" title="Justificar"></button>
                <div className="w-px h-6 bg-gray-400 mx-1"></div>
                <button className="ql-image" title="Inserir Imagem"></button>
                <button className="ql-clean" title="Limpar Formatação"></button>
                
                {/* Botão de Espaçamento Militar */}
                <div className="relative ml-2">
                    <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); setShowSpacingMenu(!showSpacingMenu); }}
                        className="bg-gray-200 border border-gray-400 px-2 py-0.5 rounded flex items-center hover:bg-gray-300 transition-colors"
                        title="Inserir Espaçamento Militar (ICA 10-1)"
                    >
                        <span className="text-blue-700 font-bold text-lg leading-none">+</span>
                        <span className="text-[8px] ml-1">▼</span>
                    </button>
                    {showSpacingMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowSpacingMenu(false)}></div>
                            <div className="absolute top-full left-0 z-50 bg-white border border-gray-400 shadow-2xl w-72 mt-1 rounded text-[11px] overflow-hidden">
                                <button type="button" onClick={() => insertSpacing('num')} className="w-full text-left p-2 hover:bg-blue-100 border-b border-gray-100 flex items-center">
                                    <div className="w-3 h-3 mr-2 bg-blue-500 rounded-sm"></div> Inserir 2,5cm em Parágrafo Numerado
                                </button>
                                <button type="button" onClick={() => insertSpacing('sem')} className="w-full text-left p-2 hover:bg-blue-100 border-b border-gray-100 flex items-center">
                                    <div className="w-3 h-3 mr-2 bg-green-500 rounded-sm"></div> Inserir 2,5cm em Parágrafo Sem num/Alínea
                                </button>
                                <button type="button" onClick={() => insertSpacing('sub')} className="w-full text-left p-2 hover:bg-blue-100 border-b border-gray-100 flex items-center">
                                    <div className="w-3 h-3 mr-2 bg-orange-500 rounded-sm"></div> Inserir recuo para subalínea
                                </button>
                                <button type="button" onClick={() => insertSpacing('v20')} className="w-full text-left p-2 hover:bg-blue-100 border-b border-gray-100">
                                    Inserir 20pt de espaço vertical
                                </button>
                                <button type="button" onClick={() => insertSpacing('v30')} className="w-full text-left p-2 hover:bg-blue-100">
                                    Inserir 30pt de espaço vertical
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="ml-auto flex items-center pr-2 pointer-events-none opacity-50">
                    <span className="text-[9px] text-blue-800 font-bold mr-1">NPA SYSTEM</span>
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold">?</div>
                </div>
            </div>
            
            <div className="quill-wrapper bg-white">
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder || "Escreva o texto do documento aqui..."}
                    modules={modules}
                    formats={formats}
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
                    padding: 20px !important;
                    line-height: 1.5;
                    min-height: 200px;
                }
                /* Remove a toolbar padrão do Quill */
                .quill-wrapper .ql-toolbar.ql-snow {
                    display: none;
                }
                /* Ajuste para imagens no editor */
                .ql-editor img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 10px 0;
                }
                /* Garante foco visível */
                .ql-container.ql-snow {
                    border: none;
                }
            `}</style>
        </div>
    );
};

export default MilitaryRichEditor;
