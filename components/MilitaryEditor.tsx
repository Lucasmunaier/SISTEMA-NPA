
import React, { useRef, useEffect, useState } from 'react';

interface MilitaryEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
}

const MilitaryEditor: React.FC<MilitaryEditorProps> = ({ value, onChange, placeholder, minHeight = "150px" }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [bgColor, setBgColor] = useState('#ffffff');

    // Sincroniza valor externo com o editor se necessário
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, []);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, val: string = '') => {
        document.execCommand(command, false, val);
        handleInput();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            // Insere o recuo militar de 2,5cm
            const tabHtml = '<span style="display: inline-block; width: 2.5cm;">&nbsp;</span>';
            document.execCommand('insertHTML', false, tabHtml);
        }
    };

    const colors = [
        { name: 'Branco', value: '#ffffff' },
        { name: 'Creme', value: '#fffdf0' },
        { name: 'Cinza Claro', value: '#f4f4f4' },
        { name: 'Verde Militar', value: '#e8ede4' }
    ];

    return (
        <div className="flex flex-col border border-gray-600 rounded-md overflow-hidden bg-gray-800">
            {/* Toolbar */}
            <div className="bg-gray-700 p-2 flex items-center justify-between border-b border-gray-600 select-none">
                <div className="flex items-center space-x-1">
                    <button 
                        onClick={() => execCommand('bold')}
                        className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-500 rounded font-bold text-white transition-colors"
                        title="Negrito (Ctrl+B)"
                    >B</button>
                    <button 
                        onClick={() => execCommand('italic')}
                        className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-500 rounded italic text-white transition-colors"
                        title="Itálico (Ctrl+I)"
                    >I</button>
                    <div className="h-6 w-px bg-gray-500 mx-2"></div>
                    <span className="text-[10px] text-gray-400 mr-2 uppercase">Fundo:</span>
                    <div className="flex space-x-1">
                        {colors.map(c => (
                            <button
                                key={c.value}
                                onClick={() => setBgColor(c.value)}
                                className={`w-5 h-5 rounded-full border ${bgColor === c.value ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-gray-500'}`}
                                style={{ backgroundColor: c.value }}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>
                <div className="text-[9px] text-gray-500 font-mono">TAB = 2.5cm</div>
            </div>

            {/* Editable Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                className="p-4 focus:outline-none overflow-y-auto text-black"
                style={{ 
                    backgroundColor: bgColor, 
                    minHeight: minHeight,
                    fontFamily: '"Times New Roman", Times, serif',
                    fontSize: '12pt',
                    lineHeight: '1.5'
                }}
            />
            
            {editorRef.current?.innerHTML === '' && (
                <div className="absolute p-4 text-gray-400 pointer-events-none italic text-sm">
                    {placeholder}
                </div>
            )}

            <style>{`
                [contenteditable]:empty:before {
                    content: attr(placeholder);
                    color: #9ca3af;
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

export default MilitaryEditor;
