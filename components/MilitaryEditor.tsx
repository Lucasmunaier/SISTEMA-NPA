
import React, { useRef, useEffect, useState } from 'react';

interface MilitaryEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
}

const MilitaryEditor: React.FC<MilitaryEditorProps> = ({ value, onChange, placeholder, minHeight = "250px" }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

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

    const insertImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event: any) => {
                    const imgHtml = `
                        <div class="img-container" style="text-align: center; margin: 15px 0;">
                            <img src="${event.target.result}" style="max-width: 80%; height: auto; border: 1px solid #ccc; padding: 2px;" />
                        </div>
                        <p><br></p>
                    `;
                    exec('insertHTML', imgHtml);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const tabNode = document.createElement('span');
            tabNode.style.display = 'inline-block';
            tabNode.style.width = '2.5cm';
            tabNode.style.whiteSpace = 'pre';
            tabNode.innerHTML = '&nbsp;';
            tabNode.contentEditable = 'false';
            tabNode.className = 'military-indent';
            range.insertNode(tabNode);
            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            selection.removeAllRanges();
            selection.addRange(range);
            handleInput();
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'IMG') {
            setSelectedElement(target);
        } else {
            setSelectedElement(null);
        }
    };

    const setImgWidth = (width: string) => {
        if (selectedElement && selectedElement.tagName === 'IMG') {
            selectedElement.style.width = width;
            handleInput();
        }
    };

    const setAlignment = (align: 'left' | 'center' | 'right' | 'justify') => {
        if (selectedElement && selectedElement.tagName === 'IMG') {
            const container = selectedElement.parentElement;
            if (container && container.classList.contains('img-container')) {
                container.style.textAlign = align;
            } else {
                exec('justify' + align.charAt(0).toUpperCase() + align.slice(1));
            }
        } else {
            exec('justify' + align.charAt(0).toUpperCase() + align.slice(1));
        }
        handleInput();
    };

    const actions = [
        { icon: '<b>B</b>', title: 'Negrito (Ctrl+B)', cmd: () => exec('bold') },
        { icon: '<i>I</i>', title: 'Itálico (Ctrl+I)', cmd: () => exec('italic') },
        { icon: '<u>U</u>', title: 'Sublinhado (Ctrl+U)', cmd: () => exec('underline') },
        { icon: '<span class="text-xs">ABC</span>', title: 'Tachado', cmd: () => exec('strikeThrough') },
        { icon: ' | ', title: 'Separador', cmd: null, isSeparator: true },
        { icon: '←', title: 'Alinhar Esquerda', cmd: () => setAlignment('left') },
        { icon: '↔', title: 'Centralizar', cmd: () => setAlignment('center') },
        { icon: '→', title: 'Alinhar Direita', cmd: () => setAlignment('right') },
        { icon: '≡', title: 'Justificado', cmd: () => setAlignment('justify') },
        { icon: ' | ', title: 'Separador', cmd: null, isSeparator: true },
        { icon: '•', title: 'Lista de Marcadores', cmd: () => exec('insertUnorderedList') },
        { icon: '1.', title: 'Lista Numérica', cmd: () => exec('insertOrderedList') },
        { icon: 'a.', title: 'Lista Alfabética', cmd: insertAlphaList },
        { 
            icon: '⇥', 
            title: 'Recuo Militar (2.5cm / TAB)', 
            cmd: () => {
                const event = new KeyboardEvent('keydown', { key: 'Tab' });
                handleKeyDown(event as any);
            } 
        },
        { icon: '🖼️', title: 'Inserir Imagem', cmd: insertImage },
        { icon: '⌫', title: 'Limpar Formatação', cmd: () => exec('removeFormat') },
    ];

    return (
        <div className="military-editor-wrapper flex flex-col border border-gray-400 rounded-sm overflow-hidden shadow-sm bg-white">
            {/* Action Bar */}
            <div className="editor-toolbar bg-gray-50 border-b border-gray-300 flex flex-wrap p-1 gap-1 select-none sticky top-0 z-10">
                {actions.map((act, i) => (
                    act.isSeparator ? (
                        <div key={i} className="w-px h-6 bg-gray-300 mx-1 self-center" />
                    ) : (
                        <button
                            key={i}
                            type="button"
                            onClick={act.cmd || (() => {})}
                            className="editor-btn w-9 h-9 flex items-center justify-center hover:bg-gray-200 text-gray-800 border border-transparent hover:border-gray-300 rounded-sm transition-all"
                            title={act.title}
                        >
                            <span dangerouslySetInnerHTML={{ __html: act.icon }} />
                        </button>
                    )
                ))}

                {/* Submenu de Imagem Selecionada */}
                {selectedElement && (
                    <div className="flex items-center ml-auto bg-cyan-50 px-2 rounded-md border border-cyan-200 animate-fade-in">
                        <span className="text-[10px] font-bold text-cyan-700 mr-2 uppercase">Imagem:</span>
                        <button onClick={() => setImgWidth('25%')} className="text-[10px] px-2 py-1 hover:bg-cyan-200 rounded">25%</button>
                        <button onClick={() => setImgWidth('50%')} className="text-[10px] px-2 py-1 hover:bg-cyan-200 rounded">50%</button>
                        <button onClick={() => setImgWidth('80%')} className="text-[10px] px-2 py-1 hover:bg-cyan-200 rounded">80%</button>
                        <button onClick={() => setImgWidth('100%')} className="text-[10px] px-2 py-1 hover:bg-cyan-200 rounded">100%</button>
                        <button onClick={() => setSelectedElement(null)} className="ml-2 text-red-500 font-bold px-1">×</button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
                className="editor-content p-12 focus:outline-none overflow-y-auto"
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
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }

                .editor-content {
                    background: #fff;
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
                }
                
                .editor-content ul { list-style-type: disc; margin-left: 1.5cm; margin-bottom: 10px; }
                .editor-content ol { margin-left: 1.5cm; margin-bottom: 10px; }
                .editor-content ol[type="a"] { list-style-type: lower-alpha; }
                .editor-content ol:not([type]) { list-style-type: decimal; }
                .editor-content li { margin-bottom: 5px; padding-left: 5px; }
                
                .editor-content img { 
                    transition: all 0.2s; 
                    cursor: pointer;
                    display: inline-block;
                }
                .editor-content img:hover { 
                    outline: 2px solid #22d3ee;
                }
                .editor-content img:active, .editor-content img:focus {
                    outline: 3px solid #0891b2;
                }

                .img-container {
                    width: 100%;
                }

                .military-indent {
                    user-select: none;
                    -webkit-user-modify: read-only;
                }

                .editor-btn {
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
