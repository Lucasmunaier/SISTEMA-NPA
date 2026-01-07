
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

function getDocumentHtml(data: NpaData): string {
    const totalEfetivoA = data.anexoA.reduce((sum, row) => sum + (row.efetivoProposto || 0), 0);
    const formatText = (text: string) => text.replace(/\n/g, '<br/>');

    const generateSummary = () => {
        let summaryHtml = '<div style="width: 100%; margin-top: 10px;">';
        let pageCounter = 2; 

        const createSummaryRow = (text: string, pageNum: string, level: number) => {
            const paddingLeft = level === 1 ? '1.5cm' : '0';
            const fontWeight = level === 0 ? 'bold' : 'normal';
            return `
                <div style="display: flex; justify-content: space-between; align-items: baseline; line-height: 1.2; font-size: 11pt; padding-left: ${paddingLeft}; margin-bottom: 4px; ${fontWeight === 'bold' ? 'font-weight: bold;' : ''}">
                    <span style="white-space: nowrap; padding-right: 5px;">${text.toUpperCase()}</span>
                    <div style="flex-grow: 1; border-bottom: 1px dotted black; height: 0.9em; margin-bottom: 3px;"></div>
                    <span style="white-space: nowrap; padding-left: 5px;">${pageNum}</span>
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

    return `
        <div id="documentRoot" style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: black; line-height: 1.5; text-align: justify; background: white; width: 210mm; margin: 0 auto;">
            
            <!-- CAPA (PAGE 1) -->
            <div class="page" style="width: 210mm; height: 297mm; padding: 20mm; box-sizing: border-box; page-break-after: always; position: relative; border: 1px solid transparent;">
                <table style="width: 100%; border-collapse: collapse; border: 2px solid black;">
                    <tr>
                        <td style="width: 25%; text-align: center; padding: 10px; border-right: 2px solid black; vertical-align: middle;">
                            <img src="${PAMA_LS_LOGO_B64}" alt="PAMA LS Logo" style="display: block; margin: 0 auto; max-width: 65px; height: auto;"/>
                        </td>
                        <td style="width: 50%; text-align: center; padding: 10px; vertical-align: middle;">
                            <strong style="font-size: 12pt; line-height: 1.2;">COMANDO DA AERONÁUTICA<br/>PARQUE DE MATERIAL AERONÁUTICO<br/>DE LAGOA SANTA</strong>
                            <br/><br/>
                            <strong style="font-size: 14pt;">NORMA PADRÃO DE AÇÃO</strong>
                        </td>
                        <td style="width: 25%; text-align: center; padding: 0; border-left: 2px solid black; vertical-align: top;">
                           <table style="width: 100%; border-collapse: collapse;">
                                <tr style="border-bottom: 1px solid black;">
                                    <td style="padding: 5px; text-align: center; font-size: 8pt;"><strong>Nº DO DOCUMENTO</strong><br/><span style="font-size: 10pt;">${data.numero}</span></td>
                                </tr>
                                <tr style="border-bottom: 1px solid black;">
                                    <td style="padding: 5px; text-align: center; font-size: 8pt;"><strong>EXPEDIÇÃO</strong><br/><span style="font-size: 10pt;">${formatDate(data.dataExpedicao)}</span></td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px; text-align: center; font-size: 8pt;"><strong>VALIDADE</strong><br/><span style="font-size: 10pt;">${data.validade}</span></td>
                                </tr>
                           </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-top: 2px solid black; text-align: center; font-size: 10pt;"><strong>ASSUNTO</strong></td>
                        <td colspan="2" style="padding: 8px; border-top: 2px solid black; border-left: 2px solid black; font-weight: bold;">${data.assunto.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-top: 1px solid black; text-align: center; font-size: 10pt;"><strong>ANEXOS</strong></td>
                        <td colspan="2" style="padding: 8px; border-top: 1px solid black; border-left: 2px solid black;">
                           ${data.anexos.map(a => `${a.letra} - ${a.titulo.toUpperCase()}`).join('<br/>')}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-top: 1px solid black; text-align: center; font-size: 10pt;"><strong>DISTRIBUIÇÃO</strong></td>
                        <td colspan="2" style="padding: 8px; border-top: 1px solid black; border-left: 2px solid black;">${data.distribuicao}</td>
                    </tr>
                </table>
                <div style="margin-top: 3cm;">
                    <h2 style="text-align: center; font-size: 14pt; text-transform: uppercase; font-weight: bold; margin-bottom: 20px;">SUMÁRIO</h2>
                    ${generateSummary()}
                </div>
            </div>

            <!-- CORPO DO TEXTO (PAGES 2+) -->
            <div class="page-content-container" style="padding: 0; box-sizing: border-box;">
                 ${data.body.map(section => `
                    <div style="padding: 30mm 20mm 20mm 30mm; box-sizing: border-box; page-break-after: always; min-height: 297mm;">
                        <!-- SEÇÃO TÍTULO -->
                        <p style="text-transform: uppercase; margin: 0; font-weight: bold;">${section.numero} ${section.titulo}</p>
                        <!-- LINHA EM BRANCO OBRIGATÓRIA -->
                        <div style="height: 1.2em;"></div>
                        
                        ${section.subsections.map(subsection => `
                            <div style="margin-bottom: 1.5em;">
                                <!-- SUBTÍTULO -->
                                <p style="text-transform: uppercase; margin: 0;"><strong style="text-decoration: underline;">${subsection.numero} ${subsection.titulo}</strong></p>
                                <!-- LINHA EM BRANCO OBRIGATÓRIA -->
                                <div style="height: 1.2em;"></div>

                                ${subsection.titulo.includes('PROPOSIÇÃO') ? 
                                    `<div style="margin-top: 1cm;">
                                        <table style="width: 100%; border-collapse: collapse;">
                                            <tr>
                                                <td style="width: 33%; text-align: left; vertical-align: top; padding-bottom: 2cm;">Proposto por:</td>
                                                <td style="width: 67%; text-align: center; padding-bottom: 2cm;">
                                                    _____________________________________<br/>
                                                    ${data.assinaturas.propostoPor.nome.toUpperCase()}<br/>
                                                    ${data.assinaturas.propostoPor.cargo}
                                                </td>
                                            </tr>
                                             <tr>
                                                <td style="width: 33%; text-align: left; vertical-align: top; padding-bottom: 2cm;">Visto por:</td>
                                                <td style="width: 67%; text-align: center; padding-bottom: 2cm;">
                                                    _____________________________________<br/>
                                                    ${data.assinaturas.vistoPor.nome.toUpperCase()}<br/>
                                                    ${data.assinaturas.vistoPor.cargo}
                                                </td>
                                            </tr>
                                             <tr>
                                                <td style="width: 33%; text-align: left; vertical-align: top;">Aprovado por:</td>
                                                <td style="width: 67%; text-align: center;">
                                                    _____________________________________<br/>
                                                    ${data.assinaturas.aprovadoPor.nome.toUpperCase()}<br/>
                                                    ${data.assinaturas.aprovadoPor.cargo}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>` 
                                : 
                                    `<p style="text-indent: 2.5cm; margin: 0; text-align: justify; line-height: 1.5;">${formatText(subsection.conteudo)}</p>`
                                }
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>

            <!-- REFERÊNCIAS -->
             <div class="page" style="width: 210mm; min-height: 297mm; padding: 30mm 20mm 20mm 30mm; box-sizing: border-box; page-break-after: always;">
                <p style="font-weight: bold; text-transform: uppercase; margin-bottom: 1.5em; text-align: center;">REFERÊNCIAS</p>
                <div style="text-align: justify; line-height: 1.4;">
                    <p style="margin-bottom: 1em; text-indent: 2.5cm;">${formatText(data.referencias)}</p>
                </div>
             </div>

            <!-- ANEXO A -->
            <div class="page" style="width: 210mm; min-height: 297mm; padding: 30mm 20mm 20mm 30mm; box-sizing: border-box; page-break-after: always;">
                <p style="text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 2em;">Anexo A - Tabela de Efetivo Proposto</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 8pt; border: 1.2px solid black; table-layout: fixed;">
                    <thead>
                        <tr style="background-color: #f0f0f0;">
                            <th style="border: 1px solid black; padding: 4px; width: 25%;" rowspan="2">Função</th>
                            <th style="border: 1px solid black; padding: 4px;" colspan="3">Previsão Principal</th>
                            <th style="border: 1px solid black; padding: 4px;" colspan="3">Previsão Alternativa</th>
                            <th style="border: 1px solid black; padding: 4px; width: 15%;" rowspan="2">Efetivo Proposto</th>
                        </tr>
                        <tr style="background-color: #f0f0f0;">
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
                                <td style="border: 1px solid black; padding: 4px; word-wrap: break-word;">${row.funcao}</td>
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
                        <tr style="font-weight: bold;">
                            <td colspan="7" style="border: 1px solid black; padding: 6px; text-align: right;">TOTAL</td>
                            <td style="border: 1px solid black; padding: 6px; text-align: center;">${totalEfetivoA}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- ANEXO B -->
            <div class="page" style="width: 210mm; min-height: 297mm; padding: 30mm 20mm 20mm 30mm; box-sizing: border-box; page-break-after: always;">
                <p style="text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 2em;">Anexo B - Matriz de Qualificação</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 9pt; border: 1.2px solid black;">
                    <thead>
                        <tr style="background-color: #f0f0f0;">
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
                <div style="margin-top: 15px; border-top: 1px solid black; padding-top: 5px;">
                    <p style="font-size: 8.5pt;"><strong>LEGENDA:</strong> 1 = CURSO DESEJÁVEL, 0 = CURSO NÃO DESEJÁVEL</p>
                </div>
            </div>
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
    
    const content = getDocumentHtml(data);
    const fileBuffer = await htmlToDocx.asBlob(content, {
        orientation: 'portrait',
        margins: { top: 1700, bottom: 1134, left: 1700, right: 1134 },
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
    const { jsPDF } = (window as any).jspdf;
    
    const previewContainer = document.getElementById('document-preview-container');
    if (!previewContainer) return;

    previewContainer.innerHTML = getDocumentHtml(data);
    const element = previewContainer.querySelector('#documentRoot') as HTMLElement;

    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
        putOnlyUsedFonts: true
    });

    // We use 'times' native font for text rendering
    doc.setFont('times', 'normal');

    await doc.html(element, {
        callback: function (doc: any) {
            const totalPages = doc.internal.getNumberOfPages();
            
            // Header logic for pages 2+
            for (let i = 2; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setFont('times', 'normal');
                
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageNum = i.toString();
                const pageNumWidth = doc.getTextWidth(pageNum);
                
                // Set text color to black
                doc.setTextColor(0, 0, 0);
                // NPA Number on top-left, Page Number on top-right
                doc.text(data.numero, 30, 15); 
                doc.text(pageNum, pageWidth - pageNumWidth - 20, 15);
            }
            
            doc.save(`NPA_${data.numero.replace(/[\/\s]/g, '_')}.pdf`);
            previewContainer.innerHTML = '';
        },
        x: 0,
        y: 0,
        width: 210, 
        windowWidth: 794, // 210mm at 96 DPI
        autoPaging: 'text',
        margin: [0, 0, 0, 0],
        html2canvas: {
            scale: 1,
            logging: false,
            useCORS: true,
            letterRendering: true
        }
    });
};
