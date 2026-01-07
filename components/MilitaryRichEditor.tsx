
import React, { useRef, useState } from 'react';

interface MilitaryRichEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const MilitaryRichEditor: React.FC<MilitaryRichEditorProps> = ({ value, onChange, placeholder }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showSpacingMenu, setShowSpacingMenu] = useState(false);

    const execCommand = (command: string, value: string = '') => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const insertImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const img = `<img src="${event.target.result}" style="max-width: 100%; height: auto; display: block; margin: 10px 0;" />`;
                execCommand('insertHTML', img);
            };
            reader.readAsDataURL(file);
        };
        input.click();
    };

    const insertSpacing = (type: 'num' | 'sem' | 'sub' | 'v20' | 'v30') => {
        let html = '';
        switch (type) {
            case 'num': html = '<span style="display: inline-block; width: 2.5cm;">&nbsp;</span>'; break;
            case 'sem': html = '<span style="display: inline-block; margin-left: 2.5cm;">&nbsp;</span>'; break;
            case 'sub': html = '<span style="display: inline-block; margin-left: 3.5cm;">&nbsp;</span>'; break;
            case 'v20': html = '<div style="height: 20pt;"></div>'; break;
            case 'v30': html = '<div style="height: 30pt;"></div>'; break;
        }
        execCommand('insertHTML', html);
        setShowSpacingMenu(false);
    };

    return (
        <div className="border border-gray-600 rounded-md overflow-hidden bg-white text-black">
            {/* Toolbar baseada no PDF */}
            <div className="bg-gray-200 p-1 flex flex-wrap items-center border-b border-gray-400 gap-1 select-none">
                <button title="Negrito" onClick={() => execCommand('bold')} className="p-1 hover:bg-gray-300 rounded font-bold w-8 text-black">B</button>
                <button title="Itálico" onClick={() => execCommand('italic')} className="p-1 hover:bg-gray-300 rounded italic w-8 text-black">I</button>
                <div className="h-6 w-px bg-gray-400 mx-1"></div>
                <button title="Esquerda" onClick={() => execCommand('justifyLeft')} className="p-1 hover:bg-gray-300 rounded w-8">L</button>
                <button title="Centro" onClick={() => execCommand('justifyCenter')} className="p-1 hover:bg-gray-300 rounded w-8">C</button>
                <button title="Direita" onClick={() => execCommand('justifyRight')} className="p-1 hover:bg-gray-300 rounded w-8">R</button>
                <button title="Justificar" onClick={() => execCommand('justifyFull')} className="p-1 hover:bg-gray-300 rounded w-8">J</button>
                <div className="h-6 w-px bg-gray-400 mx-1"></div>
                <button title="Inserir Imagem" onClick={insertImage} className="p-1 hover:bg-gray-300 rounded text-xs px-2">IMG</button>
                
                <div className="relative">
                    <button 
                        title="Inserir Espaçamento" 
                        onClick={() => setShowSpacingMenu(!showSpacingMenu)}
                        className="bg-gray-300 p-1 rounded font-bold w-10 text-blue-800 hover:bg-gray-400 flex items-center justify-center"
                    >
                        + <span className="text-[10px] ml-0.5">▼</span>
                    </button>
                    {showSpacingMenu && (
                        <div className="absolute top-full left-0 z-50 bg-white border border-gray-400 shadow-xl w-64 mt-1 rounded text-sm overflow-hidden">
                            <button onClick={() => insertSpacing('num')} className="w-full text-left p-2 hover:bg-blue-100 border-b border-gray-100">Inserir 2,5cm em Parágrafo Numerado</button>
                            <button onClick={() => insertSpacing('sem')} className="w-full text-left p-2 hover:bg-blue-100 border-b border-gray-100">Inserir 2,5cm em Parágrafo Sem numeração ou Alínea</button>
                            <button onClick={() => insertSpacing('sub')} className="w-full text-left p-2 hover:bg-blue-100 border-b border-gray-100">Inserir espaçamento para subalínea</button>
                            <button onClick={() => insertSpacing('v20')} className="w-full text-left p-2 hover:bg-blue-100 border-b border-gray-100">Inserir 20pt vertical</button>
                            <button onClick={() => insertSpacing('v30')} className="w-full text-left p-2 hover:bg-blue-100">Inserir 30pt vertical</button>
                        </div>
                    )}
                </div>
                <div className="ml-auto flex items-center">
                    <span className="text-[10px] text-blue-600 font-bold mr-2">ICA 10-1</span>
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">?</div>
                </div>
            </div>
            
            {/* Área de Edição */}
            <div
                ref={editorRef}
                contentEditable
                onInput={(e: any) => onChange(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: value }}
                className="min-h-[150px] p-4 focus:outline-none overflow-y-auto"
                style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '12pt' }}
            />
        </div>
    );
};

export default MilitaryRichEditor;
