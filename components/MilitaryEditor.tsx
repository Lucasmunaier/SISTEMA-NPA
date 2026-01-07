
import React, { useRef, useEffect } from 'react';

interface MilitaryEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
}

const MilitaryEditor: React.FC<MilitaryEditorProps> = ({ value, onChange, placeholder, minHeight = "250px" }) => {
    const editorRef = useRef<HTMLDivElement>(null);

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

    const insertAlphaList = () => {
        exec('insertOrderedList');
        // Ajusta o tipo da lista para alfabética logo após a criação
        setTimeout(() => {
            const selection = window.getSelection();
            if (selection && selection.anchorNode) {
                let parent = selection.anchorNode.parentElement;
                while (parent && parent.tagName !== 'OL' && parent !== editorRef.current) {
                    parent = parent.parentElement;
                }
                if (parent && parent.tagName === 'OL') {
                    (parent as HTMLOListElement).type = 'a';
                    handleInput();
                }
            }
        }, 0);
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
            let cleanHtml = html
                .replace(/<style([\s\S]*?)<\/style>/gi, '')
                .replace(/<script([\s\S]*?)<\/script>/gi, '')
                .replace(/class="Mso[\s\S]*?"/gi, '')
                .replace(/style="[\s\S]*?"/gi, (match) => {
                    const kept = [];
                    if (match.includes('font-weight:bold') || match.includes('font-weight: 700')) kept.push('font-weight:bold');
                    if (match.includes('font-style:italic')) kept.push('font-style:italic');
                    if (match.includes('text-decoration:underline')) kept.push('text-decoration:underline');
                    return kept.length > 0 ? `style="${kept.join(';')}"` : '';
                })
                .replace(/<(?!b|i|u|p|br|ul|ol|li|span|strong|em|div)[^>]+>/gi, '');

            document.execCommand('insertHTML', false, cleanHtml || text.replace(/\n/g, '<br>'));
        } else {
            document.execCommand('insertHTML', false, text.replace(/\n/g, '<br>'));
        }
        handleInput();
    };

    const actions = [
        { icon: '<b>B</b>', title: 'Negrito (Ctrl+B)', cmd: () => exec('bold') },
        { icon: '<i>I</i>', title: 'Itálico (Ctrl+I)', cmd: () => exec('italic') },
        { icon: '<u>U</u>', title: 'Sublinhado (Ctrl+U)', cmd: () => exec('underline') },
        { icon: '•', title: 'Lista de Marcadores', cmd: () => exec('insertUnorderedList') },
        { icon: '1.', title: 'Lista Numérica', cmd: () => exec('insertOrderedList') },
        { icon: 'a.', title: 'Lista Alfabética', cmd: insertAlphaList },
        { icon: '⇥', title: 'Recuo Militar (2.5cm / TAB)', cmd: () => exec('insertHTML', '<span style="display: inline-block; width: 2.5cm;">&nbsp;</span>') },
        { icon: '⌫', title: 'Limpar Formatação', cmd: () => exec('removeFormat') },
    ];

    return (
        <div className="pell-container flex flex-col border border-gray-400 rounded-sm overflow-hidden shadow-sm bg-white">
            {/* Action Bar */}
            <div className="pell-actionbar bg-gray-50 border-b border-gray-300 flex flex-wrap p-1 gap-1 select-none">
                {actions.map((act, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={act.cmd}
                        className="pell-button w-9 h-9 flex items-center justify-center hover:bg-gray-200 text-gray-800 border border-transparent hover:border-gray-300 rounded-sm transition-all"
                        title={act.title}
                    >
                        <span dangerouslySetInnerHTML={{ __html: act.icon }} />
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                className="pell-content p-8 focus:outline-none overflow-y-auto"
                style={{ 
                    minHeight: minHeight,
                    color: '#000',
                    fontFamily: '"Times New Roman", Times, serif',
                    fontSize: '12pt',
                    lineHeight: '1.5',
                    textAlign: 'justify'
                }}
            />

            <style>{`
                .pell-content ul { list-style-type: disc; margin-left: 1.5cm; margin-bottom: 10px; }
                .pell-content ol { margin-left: 1.5cm; margin-bottom: 10px; }
                .pell-content ol[type="a"] { list-style-type: lower-alpha; }
                .pell-content ol:not([type]) { list-style-type: decimal; }
                .pell-content li { margin-bottom: 5px; padding-left: 5px; }
                .pell-content b, .pell-content strong { font-weight: bold; }
                .pell-content i, .pell-content em { font-style: italic; }
                .pell-content u { text-decoration: underline; }
                
                .pell-button {
                    font-family: inherit;
                    font-size: 14px;
                    cursor: pointer;
                }
                
                [contenteditable]:empty:before {
                    content: "${placeholder || 'Inicie a redação militar...'}";
                    color: #aaa;
                    font-style: italic;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default MilitaryEditor;
