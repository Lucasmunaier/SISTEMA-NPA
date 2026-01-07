
import { NpaData } from '../types';
import { PAMA_LS_LOGO_B64 } from '../assets/logo';

function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    
    const day = String(date.getDate()).padStart(2, '0');
    const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

/**
 * Gera o HTML central do documento otimizado para impressão.
 */
function getDocumentHtml(data: NpaData): string {
    const generateSummary = () => {
        let summaryHtml = '<div style="width: 100%; margin-top: 20px;">';
        let pageCounter = 2; 

        const createSummaryRow = (text: string, pageNum: string, level: number) => {
            const isSubsection = level === 1;
            const fontWeight = level === 0 ? 'bold' : 'normal';
            const textTransform = isSubsection ? 'uppercase' : 'none';
            const textDecoration = isSubsection ? 'underline' : 'none';
            
            return `
                <div style="display: flex; justify-content: space-between; align-items: baseline; line-height: 1.2; font-size: 11pt; margin-bottom: 6px; ${fontWeight === 'bold' ? 'font-weight: bold;' : ''}">
                    <span style="white-space: nowrap; padding-right: 5px; text-transform: ${textTransform}; text-decoration: ${textDecoration};">${text}</span>
                    <div style="flex-grow: 1; border-bottom: 1px dotted black; height: 0.9em; margin-bottom: 3px;"></div>
                    <span style="white-space: nowrap; padding-left: 10px; min-width: 25px; text-align: right;">${pageNum}</span>
                </div>
            `;
        };

        data.body.forEach(section => {
            summaryHtml += createSummaryRow(`${section.numero} ${section.titulo}`, `${pageCounter}`, 0);
            section.subsections.forEach(subsection => {
                 summaryHtml += createSummaryRow(`${subsection.numero} ${subsection.titulo}`, `${pageCounter}`, 1);
            });
            pageCounter++;
        });
        summaryHtml += createSummaryRow('REFERÊNCIAS', `${pageCounter}`, 0);
        summaryHtml += '</div>';
        return summaryHtml;
    };

    const totalEfetivoA = data.anexoA.reduce((sum, row) => sum + (row.efetivoProposto || 0), 0);
    const grayBg = "background-color: #D9D9D9;";

    return `
            <!-- CAPA (PAGE 1) -->
            <div class="page-container" id="page-1">
                <table style="width: 100%; border-collapse: collapse; border: 2px solid black;">
                    <tr>
                        <td style="width: 20%; text-align: center; padding: 10px; border-right: 2px solid black; vertical-align: middle;">
                            <img src="${data.logo || PAMA_LS_LOGO_B64}" alt="PAMA LS Logo" style="display: block; margin: 0 auto; max-width: 90px; max-height: 100px; height: auto;"/>
                        </td>
                        <td style="width: 55%; text-align: center; padding: 10px; vertical-align: middle;">
                            <strong style="font-size: 11pt; line-height: 1.2;">COMANDO DA AERONÁUTICA<br/>PARQUE DE MATERIAL AERONÁUTICO<br/>DE LAGOA SANTA</strong>
                            <br/><br/>
                            <strong style="font-size: 14pt;">NORMA PADRÃO DE AÇÃO</strong>
                        </td>
                        <td style="width: 25%; text-align: center; padding: 0; border-left: 2px solid black; vertical-align: top;">
                           <table style="width: 100%; border-collapse: collapse;">
                                <tr style="${grayBg} border-bottom: 1px solid black;">
                                    <td style="padding: 2px; text-align: center; font-size: 8pt;"><strong>Nº DO DOCUMENTO</strong></td>
                                </tr>
                                <tr style="border-bottom: 1px solid black;">
                                    <td style="padding: 5px; text-align: center; font-size: 10pt; font-weight: bold;">${data.numero}</td>
                                </tr>
                                <tr style="${grayBg} border-bottom: 1px solid black;">
                                    <td style="padding: 2px; text-align: center; font-size: 8pt;"><strong>EXPEDIÇÃO</strong></td>
                                </tr>
                                <tr style="border-bottom: 1px solid black;">
                                    <td style="padding: 5px; text-align: center; font-size: 10pt; font-weight: bold;">${formatDate(data.dataExpedicao)}</td>
                                </tr>
                                <tr style="${grayBg} border-bottom: 1px solid black;">
                                    <td style="padding: 2px; text-align: center; font-size: 8pt;"><strong>VALIDADE</strong></td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px; text-align: center; font-size: 10pt; font-weight: bold;">${data.validade}</td>
                                </tr>
                           </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="${grayBg} padding: 8px; border-top: 2px solid black; text-align: center; font-size: 10pt;"><strong>ASSUNTO</strong></td>
                        <td colspan="2" style="padding: 8px; border-top: 2px solid black; border-left: 2px solid black;">${data.assunto}</td>
                    </tr>
                    <tr>
                        <td style="${grayBg} padding: 8px; border-top: 1px solid black; text-align: center; font-size: 10pt;"><strong>ANEXOS</strong></td>
                        <td colspan="2" style="padding: 8px; border-top: 1px solid black; border-left: 2px solid black;">
                           ${data.anexos.map(a => `${a.letra} - ${a.titulo}`).join('<br/>')}
                        </td>
                    </tr>
                    <tr>
                        <td style="${grayBg} padding: 8px; border-top: 1px solid black; text-align: center; font-size: 10pt;"><strong>DISTRIBUIÇÃO</strong></td>
                        <td colspan="2" style="padding: 8px; border-top: 1px solid black; border-left: 2px solid black;">${data.distribuicao}</td>
                    </tr>
                </table>
                <div style="margin-top: 3cm;">
                    <h2 style="text-align: center; font-size: 14pt; text-transform: uppercase; font-weight: bold; margin-bottom: 20px;">SUMÁRIO</h2>
                    ${generateSummary()}
                </div>
            </div>

            <div class="page-break"></div>

            <!-- CORPO DO TEXTO -->
            <div class="page-container" id="page-content">
                 ${data.body.map(section => `
                    <div style="margin-bottom: 1cm;">
                        <p style="text-transform: uppercase; margin: 0; font-weight: bold;">${section.numero} ${section.titulo}</p>
                        <p>&nbsp;</p>
                        
                        ${section.subsections.map(subsection => {
                            const hasTitle = subsection.titulo && subsection.titulo.trim() !== "";
                            return `
                                <div style="margin-bottom: 0.8cm; page-break-inside: avoid;">
                                    ${hasTitle ? `
                                        <p style="text-transform: uppercase; margin: 0;"><strong style="text-decoration: underline;">${subsection.numero} ${subsection.titulo}</strong></p>
                                        <p>&nbsp;</p>
                                    ` : ''}

                                    ${subsection.titulo.includes('PROPOSIÇÃO') ? 
                                        `<div style="margin-top: 1cm; text-align: center;">
                                            <div style="margin-bottom: 2cm; text-align: center;">
                                                <p style="text-align: left; margin-bottom: 0.5cm;">Proposto por:</p>
                                                <div style="display: inline-block; width: 100%; text-align: center;">
                                                    _____________________________________<br/>
                                                    ${data.assinaturas.propostoPor.nome.toUpperCase()}<br/>
                                                    ${data.assinaturas.propostoPor.cargo}
                                                </div>
                                            </div>
                                            <div style="margin-bottom: 2cm; text-align: center;">
                                                <p style="text-align: left; margin-bottom: 0.5cm;">Visto por:</p>
                                                <div style="display: inline-block; width: 100%; text-align: center;">
                                                    _____________________________________<br/>
                                                    ${data.assinaturas.vistoPor.nome.toUpperCase()}<br/>
                                                    ${data.assinaturas.vistoPor.cargo}
                                                </div>
                                            </div>
                                            <div style="margin-bottom: 2cm; text-align: center;">
                                                <p style="text-align: left; margin-bottom: 0.5cm;">Aprovado por:</p>
                                                <div style="display: inline-block; width: 100%; text-align: center;">
                                                    _____________________________________<br/>
                                                    ${data.assinaturas.aprovadoPor.nome.toUpperCase()}<br/>
                                                    ${data.assinaturas.aprovadoPor.cargo}
                                                </div>
                                            </div>
                                        </div>` 
                                    : 
                                        `<div class="rich-content">
                                            ${!hasTitle ? `<strong>${subsection.numero}</strong>&nbsp;` : ''}
                                            ${subsection.conteudo}
                                            
                                            ${subsection.subSubsections && subsection.subSubsections.length > 0 ? 
                                                `<div style="margin-top: 0.5cm;">
                                                    ${subsection.subSubsections.map(sss => `
                                                        <div style="margin-bottom: 0.5cm;">
                                                            ${sss.titulo ? `<p style="margin: 0; font-weight: bold;">${sss.numero} ${sss.titulo}</p>` : `<strong>${sss.numero}</strong>&nbsp;`}
                                                            <div style="text-align: justify; line-height: 1.5;">${sss.conteudo}</div>
                                                        </div>
                                                    `).join('')}
                                                </div>` 
                                            : ''}
                                        </div>`
                                    }
                                </div>
                            `}).join('')}
                    </div>
                 `).join('')}
            </div>

            <div class="page-break"></div>

            <!-- REFERÊNCIAS -->
             <div class="page-container" style="margin-top: 1cm;">
                <p style="font-weight: bold; text-transform: uppercase; margin-bottom: 1.2cm; text-align: center;">REFERÊNCIAS</p>
                <p>&nbsp;</p>
                <div class="rich-content" style="text-align: justify; line-height: 1.4;">
                    ${data.referencias}
                </div>
             </div>

            <div class="page-break"></div>

            <!-- ANEXO A -->
            <div class="page-container" style="margin-top: 1cm;">
                <p style="text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 1.5cm;">Anexo A - Tabela de Efetivo Proposto</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 8pt; border: 1px solid black;">
                    <thead>
                        <tr style="background-color: #f3f4f6;">
                            <th style="border: 1px solid black; padding: 5px;" rowspan="2">Função</th>
                            <th style="border: 1px solid black; padding: 5px;" colspan="3">Previsão Principal</th>
                            <th style="border: 1px solid black; padding: 5px;" colspan="3">Previsão Alternativa</th>
                            <th style="border: 1px solid black; padding: 5px;" rowspan="2">Efetivo Proposto</th>
                        </tr>
                        <tr style="background-color: #f9fafb;">
                            <th style="border: 1px solid black; padding: 3px;">Posto/Grad</th>
                            <th style="border: 1px solid black; padding: 3px;">Quadro</th>
                            <th style="border: 1px solid black; padding: 3px;">Espec.</th>
                            <th style="border: 1px solid black; padding: 3px;">Posto/Grad</th>
                            <th style="border: 1px solid black; padding: 3px;">Quadro</th>
                            <th style="border: 1px solid black; padding: 3px;">Espec.</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.anexoA.map(row => `
                            <tr>
                                <td style="border: 1px solid black; padding: 4px;">${row.funcao}</td>
                                <td style="border: 1px solid black; padding: 4px; text-align: center;">${row.previsaoPrincipal.postoGrad}</td>
                                <td style="border: 1px solid black; padding: 4px; text-align: center;">${row.previsaoPrincipal.quadro}</td>
                                <td style="border: 1px solid black; padding: 4px; text-align: center;">${row.previsaoPrincipal.especialidade}</td>
                                <td style="border: 1px solid black; padding: 4px; text-align: center;">${row.previsaoAlternativa.postoGrad}</td>
                                <td style="border: 1px solid black; padding: 4px; text-align: center;">${row.previsaoAlternativa.quadro}</td>
                                <td style="border: 1px solid black; padding: 4px; text-align: center;">${row.previsaoAlternativa.especialidade}</td>
                                <td style="border: 1px solid black; padding: 4px; text-align: center;">${row.efetivoProposto}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr style="font-weight: bold; background-color: #f9fafb;">
                            <td colspan="7" style="border: 1px solid black; padding: 5px; text-align: right;">TOTAL</td>
                            <td style="border: 1px solid black; padding: 5px; text-align: center;">${totalEfetivoA}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="page-break"></div>

            <!-- ANEXO B -->
            <div class="page-container" style="margin-top: 1cm;">
                <p style="text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 1.5cm;">Anexo B - Matriz de Qualificação</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 9pt; border: 1px solid black;">
                    <thead>
                        <tr style="background-color: #f3f4f6;">
                            <th style="border: 1px solid black; padding: 6px;">Qualificação Desejável</th>
                            <th style="border: 1px solid black; padding: 6px;">Sigla</th>
                            <th style="border: 1px solid black; padding: 6px;">Legislação</th>
                            <th style="border: 1px solid black; padding: 6px;">Prioridade</th>
                            <th style="border: 1px solid black; padding: 6px;">CH</th>
                            <th style="border: 1px solid black; padding: 6px;">ENC</th>
                            <th style="border: 1px solid black; padding: 6px;">AUX</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.anexoB.map(row => `
                            <tr>
                                <td style="border: 1px solid black; padding: 5px;">${row.qualificacao}</td>
                                <td style="border: 1px solid black; padding: 5px; text-align: center;">${row.sigla}</td>
                                <td style="border: 1px solid black; padding: 5px; text-align: center;">${row.legislacao}</td>
                                <td style="border: 1px solid black; padding: 5px; text-align: center;">${row.prioridade}</td>
                                <td style="border: 1px solid black; padding: 5px; text-align: center;">${row.setorCh}</td>
                                <td style="border: 1px solid black; padding: 5px; text-align: center;">${row.setorEnc}</td>
                                <td style="border: 1px solid black; padding: 5px; text-align: center;">${row.setorAux}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p style="font-size: 8pt; margin-top: 10px;"><strong>LEGENDA:</strong> 1 = CURSO DESEJÁVEL, 0 = CURSO NÃO DESEJÁVEL</p>
            </div>
    `;
}

export const exportToDocx = async (data: NpaData): Promise<void> => {
    const htmlToDocx = (window as any).htmlToDocx;
    if (!htmlToDocx) {
        alert('Erro: Biblioteca DOCX não carregada.');
        return;
    }

    const headerHtml = `<div style="width: 100%; font-family: 'Times New Roman'; font-size: 11pt;">
        <table style="width: 100%;"><tr>
            <td style="text-align: left;">${data.numero}</td>
            <td style="text-align: right;">{PAGENUM}</td>
        </tr></table>
    </div>`;
    
    const content = `<div style="font-family: 'Times New Roman'; font-size: 12pt;">${getDocumentHtml(data)}</div>`;
    const fileBuffer = await htmlToDocx.asBlob(content, {
        orientation: 'portrait',
        margins: { top: 1417, bottom: 1134, left: 1700, right: 1134 },
        header: { html: headerHtml, type: 'default' },
    });

    const url = URL.createObjectURL(fileBuffer);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NPA_${data.numero.replace(/[\/\s]/g, '_')}.docx`;
    link.click();
    URL.revokeObjectURL(url);
};

export const exportToPdf = async (data: NpaData): Promise<void> => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Por favor, habilite pop-ups para exportar o PDF.');
        return;
    }

    const htmlContent = getDocumentHtml(data);

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>NPA ${data.numero}</title>
            <style>
                @page { 
                    size: A4; 
                    margin: 0; 
                }
                body { 
                    margin: 0; 
                    padding: 0; 
                    background-color: white; 
                    font-family: "Times New Roman", Times, serif;
                    color: black;
                }
                .page-container {
                    width: 210mm;
                    min-height: 297mm;
                    padding: 30mm 20mm 20mm 30mm; /* S: 3cm, D: 2cm, I: 2cm, E: 3cm */
                    box-sizing: border-box;
                    margin: 0 auto;
                    line-height: 1.5;
                    text-align: justify;
                    position: relative;
                    page-break-after: always;
                }
                @media print {
                    .page-container { 
                        margin: 0; 
                        box-shadow: none; 
                    }
                }
                h2 { text-align: center; text-transform: uppercase; font-weight: bold; font-size: 14pt; margin: 0; }
                p { margin: 0; }
                table { width: 100%; border-collapse: collapse; }
                img { max-width: 100%; height: auto; display: block; }

                .rich-content p {
                    text-indent: 2.5cm;
                    margin-bottom: 0px;
                }
                .rich-content img {
                    margin: 10px auto;
                }

                .mirror-header {
                    position: absolute;
                    top: 15mm;
                    left: 30mm;
                    right: 20mm;
                    display: flex;
                    justify-content: space-between;
                    font-size: 11pt;
                    font-weight: bold;
                    pointer-events: none;
                }
            </style>
        </head>
        <body>
            <div id="print-root">
                ${htmlContent}
            </div>
            <script>
                window.onload = () => {
                    const pages = document.querySelectorAll('.page-container');
                    const totalPages = pages.length;
                    const docNum = "${data.numero}";

                    pages.forEach((page, index) => {
                        const pageNum = index + 1;
                        if (pageNum > 1) { 
                            const headerDiv = document.createElement('div');
                            headerDiv.className = 'mirror-header';
                            const leftSpan = document.createElement('span');
                            const rightSpan = document.createElement('span');
                            
                            if (pageNum % 2 === 0) {
                                leftSpan.innerText = docNum;
                                rightSpan.innerText = pageNum + " / " + totalPages;
                            } else {
                                leftSpan.innerText = pageNum + " / " + totalPages;
                                rightSpan.innerText = docNum;
                            }
                            
                            headerDiv.appendChild(leftSpan);
                            headerDiv.appendChild(rightSpan);
                            page.prepend(headerDiv);
                        }
                    });

                    setTimeout(() => {
                        window.print();
                    }, 800);
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
};
