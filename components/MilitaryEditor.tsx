
import React, { useRef, useEffect, useState } from 'react';

interface MilitaryEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
}

const MilitaryEditor: React.FC<MilitaryEditorProps> = ({ value, onChange, placeholder, minHeight = "200px" }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [bgColor, setBgColor] = useState('#ffffff');

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, []);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const exec = (command: string, val: string = '') => {
        document.execCommand(command, false, val);
        handleInput();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const tabHtml = '<span style="display: inline-block; width: 2.5cm;">&nbsp;</span>';
            document.execCommand('insertHTML', false, tabHtml);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const html = e.clipboardData.getData('text/html');
        const text = e.clipboardData.getData('text/plain');

        if (html) {
            // Limpeza básica de lixo do Word mantendo o essencial
            let cleanHtml = html
                .replace(/<style([\s\S]*?)<\/style>/gi, '')
                .replace(/<script([\s\S]*?)<\/script>/gi, '')
                .replace(/class="Mso[\s\S]*?"/gi, '')
                .replace(/style="[\s\S]*?"/gi, (match) => {
                    // Preserva apenas negrito, itálico e underline se estiverem no style inline
                    const kept = [];
                    if (match.includes('font-weight:bold') || match.includes('font-weight: 700')) kept.push('font-weight:bold');
                    if (match.includes('font-style:italic')) kept.push('font-style:italic');
                    if (match.includes('text-decoration:underline')) kept.push('text-decoration:underline');
                    return kept.length > 0 ? `style="${kept.join(';')}"` : '';
                })
                .replace(/<(?!b|i|u|p|br|ul|ol|li|span|strong|em|h1|h2|h3|div)[^>]+>/gi, '');

            document.execCommand('insertHTML', false, cleanHtml || text.replace(/\n/g, '<br>'));
        } else {
            document.execCommand('insertHTML', false, text.replace(/\n/g, '<br>'));
        }
        handleInput();
    };

    const actions = [
        { icon: '<b>B</b>', title: 'Negrito', cmd: () => exec('bold') },
        { icon: '<i>I</i>', title: 'Itálico', cmd: () => exec('italic') },
        { icon: '<u>U</u>', title: 'Sublinhado', cmd: () => exec('underline') },
        { icon: '<s>S</s>', title: 'Tachado', cmd: () => exec('strikeThrough') },
        { icon: 'H1', title: 'Título 1', cmd: () => exec('formatBlock', '<h1>') },
        { icon: 'H2', title: 'Título 2', cmd: () => exec('formatBlock', '<h2>') },
        { icon: '•', title: 'Lista', cmd: () => exec('insertUnorderedList') },
        { icon: '1.', title: 'Lista Num.', cmd: () => exec('insertOrderedList') },
        { icon: '⇥', title: 'Recuo 2.5cm', cmd: () => exec('insertHTML', '<span style="display: inline-block; width: 2.5cm;">&nbsp;</span>') },
        { icon: '⌫', title: 'Limpar', cmd: () => exec('removeFormat') },
    ];

    const bgOptions = [
        { color: '#ffffff', label: 'W' },
        { color: '#fffdf0', label: 'C' },
        { color: '#f4f4f4', label: 'G' },
        { color: '#e8ede4', label: 'M' },
    ];

    return (
        <div className="pell-container flex flex-col border border-gray-400 rounded-sm overflow-hidden shadow-sm">
            {/* Action Bar (Pell Style) */}
            <div className="pell-actionbar bg-white border-b border-gray-300 flex flex-wrap p-1 gap-1 select-none">
                {actions.map((act, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={act.cmd}
                        className="pell-button w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-800 border border-transparent hover:border-gray-300 rounded-sm transition-all"
                        title={act.title}
                        dangerouslySetInnerHTML={{ __html: act.icon }}
                    />
                ))}
                
                <div className="flex-grow"></div>

                <div className="flex items-center space-x-1 px-2 border-l border-gray-200">
                    {bgOptions.map((opt) => (
                        <button
                            key={opt.color}
                            type="button"
                            onClick={() => setBgColor(opt.color)}
                            className={`w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-bold ${bgColor === opt.color ? 'ring-2 ring-cyan-500' : ''}`}
                            style={{ backgroundColor: opt.color, color: '#333' }}
                            title={`Fundo: ${opt.label}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                className="pell-content p-6 focus:outline-none overflow-y-auto"
                style={{ 
                    backgroundColor: bgColor, 
                    minHeight: minHeight,
                    color: '#000',
                    fontFamily: '"Times New Roman", Times, serif',
                    fontSize: '12pt',
                    lineHeight: '1.5',
                    textAlign: 'justify'
                }}
            />

            <style>{`
                .pell-content h1 { font-size: 1.5em; font-weight: bold; margin: 10px 0; }
                .pell-content h2 { font-size: 1.3em; font-weight: bold; margin: 8px 0; }
                .pell-content ul { list-style-type: disc; margin-left: 20px; }
                .pell-content ol { list-style-type: decimal; margin-left: 20px; }
                .pell-content b, .pell-content strong { font-weight: bold; }
                .pell-content i, .pell-content em { font-style: italic; }
                .pell-content u { text-decoration: underline; }
                
                .pell-button {
                    font-family: inherit;
                    font-size: 14px;
                    cursor: pointer;
                }
                
                /* Placeholder effect */
                [contenteditable]:empty:before {
                    content: "${placeholder || 'Inicie o texto militar...'}";
                    color: #999;
                    font-style: italic;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default MilitaryEditor;
