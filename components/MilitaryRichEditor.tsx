import React, { useRef, useState, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface MilitaryRichEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const MilitaryRichEditor: React.FC<MilitaryRichEditorProps> = ({ value, onChange, placeholder }) => {
    const quillRef = useRef<ReactQuill>(null);
    const [showSpacingMenu, setShowSpacingMenu] = useState(false);
    const toolbarId = useMemo(() => `toolbar-${Math.random().toString(36).substring(2, 9)}`, []);

    const insertSpacing = (type: 'v20' | 'v30') => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;
        const range = quill.getSelection(true);
        let html = '';
        if (type === 'v20') html = '<div style="height: 20pt;"></div>';
        if (type === 'v30') html = '<div style="height: 30pt;"></div>';
        quill.clipboard.dangerouslyPasteHTML(range.index, html);
        setShowSpacingMenu(false);
    };

    const modules = useMemo(() => ({
        toolbar: `#${toolbarId}`,
        clipboard: { matchVisual: false }
    }), [toolbarId]);

    // "clean" is a toolbar action, not a format to be registered in the formats array
    const formats = ['bold', 'italic', 'underline', 'align', 'image'];

    return (
        <div className="military-editor-container border border-gray-600 rounded-md overflow-hidden bg-[#f0f0f0] text-black shadow-inner">
            <div className="bg-[#e1e1e1] border-b border-gray-400 px-2 py-1 flex space-x-4 text-[10px] font-sans text-gray-700 select-none uppercase tracking-tight">
                <span>Arquivo</span><span>Editar</span><span>Inserir</span><span>Visualizar</span><span>Formatar</span>
            </div>

            <div id={toolbarId} className="bg-[#f0f0f0] p-1 flex flex-wrap items-center border-b border-gray-300 gap-1">
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>
                <div className="w-px h-6 bg-gray-400 mx-1"></div>
                <button className="ql-align" value=""></button>
                <button className="ql-align" value="center"></button>
                <button className="ql-align" value="justify"></button>
                <div className="w-px h-6 bg-gray-400 mx-1"></div>
                <button className="ql-image"></button>
                <button className="ql-clean"></button>
                
                <div className="relative ml-2">
                    <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); setShowSpacingMenu(!showSpacingMenu); }}
                        className="bg-gray-200 border border-gray-400 px-2 py-0.5 rounded flex items-center hover:bg-gray-300"
                    >
                        <span className="text-blue-700 font-bold">+</span>
                        <span className="text-[8px] ml-1">▼</span>
                    </button>
                    {showSpacingMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowSpacingMenu(false)}></div>
                            <div className="absolute top-full left-0 z-50 bg-white border border-gray-400 shadow-xl w-48 mt-1 rounded text-[11px]">
                                <button type="button" onClick={() => insertSpacing('v20')} className="w-full text-left p-2 hover:bg-blue-100 border-b">Espaço Vertical 20pt</button>
                                <button type="button" onClick={() => insertSpacing('v30')} className="w-full text-left p-2 hover:bg-blue-100">Espaço Vertical 30pt</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            <div className="quill-wrapper bg-white">
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    modules={modules}
                    formats={formats}
                />
            </div>
            
            <style>{`
                .quill-wrapper .ql-container {
                    font-family: "Times New Roman", Times, serif !important;
                    font-size: 12pt !important;
                    min-height: 250px;
                }
                .quill-wrapper .ql-editor { padding: 20px !important; line-height: 1.5; }
                .quill-wrapper .ql-toolbar.ql-snow { display: none; }
            `}</style>
        </div>
    );
};

export default MilitaryRichEditor;