
import { NpaData } from '../types';
import { PAMA_LS_LOGO_B64 } from '../assets/logo';

function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00'); // Ensure it's parsed as local time
    
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
        let summaryHtml = '<div style="width: 100%; margin-top: 20px;">';
        // Placeholder page numbers
        let pageCounter = 2; 

        const createSummaryRow = (text: string, pageNum: string, isSub: boolean) => {
            const style = isSub ? 'padding-left: 1.5cm;' : 'font-weight: bold;';
            return `
                <div style="display: flex; justify-content: space-between; align-items: baseline; line-height: 1.2; font-size: 11pt; margin-bottom: 2px; ${style}">
                    <span style="white-space: nowrap; padding-right: 5px;">${text.toUpperCase()}</span>
                    <div style="flex-grow: 1; border-bottom: 1px dotted black; height: 1em; margin-bottom: 3px;"></div>
                    <span style="white-space: nowrap; padding-left: 5px;">${pageNum}</span>
                </div>
            `;
        };

        data.body.forEach(section => {
            summaryHtml += createSummaryRow(`${section.numero} ${section.titulo}`, `${pageCounter}`, false);
            section.subsections.forEach(subsection => {
                 summaryHtml += createSummaryRow(`${subsection.numero} ${subsection.titulo}`, `${pageCounter}`, true);
            });
            // Approximate increment
            pageCounter++;
        });
        summaryHtml += createSummaryRow('REFERÊNCIAS', `${pageCounter}`, false);
        summaryHtml += '</div>';
        return summaryHtml;
    };

    return `
        <div id="documentRoot" style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: black; line-height: 1.5; text-align: justify; background: white;">
            
            <!-- Page 1: Cover Page -->
            <div class="page" style="width: 210mm; height: 297mm; padding: 20mm; box-sizing: border-box; page-break-after: always; position: relative;">
                <table style="width: 100%; border-collapse: collapse; border: 2px solid black;">
                    <tr>
                        <td style="width: 25%; text-align: center; padding: 10px; border-right: 2px solid black; vertical-align: middle;">
                            <img src="${PAMA_LS_LOGO_B64}" alt="PAMA LS Logo" style="display: block; margin: 0 auto; max-width: 70px; height: auto;"/>
                        </td>
                        <td style="width: 50%; text-align: center; padding: 10px; vertical-align: middle;">
                            <strong style="font-size: 12pt; line-height: 1.2;">COMANDO DA AERONÁUTICA<br/>PARQUE DE MATERIAL AERONÁUTICO<br/>DE LAGOA SANTA</strong>
                            <br/><br/>
                            <strong style="font-size: 14pt;">NORMA PADRÃO DE AÇÃO</strong>
                        </td>
                        <td style="width: 25%; text-align: center; padding: 0; border-left: 2px solid black; vertical-align: top;">
                           <table style="width: 100%; border-collapse: collapse;">
                                <tr style="border-bottom: 1px solid black;">
                                    <td style="padding: 5px; text-align: center; font-size: 9pt;"><strong>Nº DO DOCUMENTO</strong><br/><span style="font-size: 10pt;">${data.numero}</span></td>
                                </tr>
                                <tr style="border-bottom: 1px solid black;">
                                    <td style="padding: 5px; text-align: center; font-size: 9pt;"><strong>EXPEDIÇÃO</strong><br/><span style="font-size: 10pt;">${formatDate(data.dataExpedicao)}</span></td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px; text-align: center; font-size: 9pt;"><strong>VALIDADE</strong><br/><span style="font-size: 10pt;">${data.validade}</span></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                     <tr>
                        <td style="padding: 8px; border-top: 2px solid black; text-align: center; font-size: 10pt;"><strong>ASSUNTO</strong></td>
                        <td colspan="2" style="padding: 8px; border-top: 2px solid black; border-left: 2px solid black;">${data.assunto}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-top: 1px solid black; text-align: center; font-size: 10pt;"><strong>ANEXOS</strong></td>
                        <td colspan="2" style="padding: 8px; border-top: 1px solid black; border-left: 2px solid black;">
                           ${data.anexos.map(a => `${a.letra} - ${a.titulo}`).join('<br/>')}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-top: 1px solid black; text-align: center; font-size: 10pt;"><strong>DISTRIBUIÇÃO</strong></td>
                        <td colspan="2" style="padding: 8px; border-top: 1px solid black; border-left: 2px solid black;">${data.distribuicao}</td>
                    </tr>
                </table>
                <div style="margin-top: 4cm;">
                    <h2 style="text-align: center; font-size: 14pt; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;">SUMÁRIO</h2>
                    ${generateSummary()}
                </div>
            </div>

            <!-- Content Pages -->
            <div class="page" style="width: 210mm; min-height: 297mm; padding: 30mm 20mm 20mm 30mm; box-sizing: border-box; page-break-after: always; position: relative;">
                 ${data.body.map(section => `
                    <div style="margin-bottom: 1.5em;">
                        <p style="text-transform: uppercase; margin-bottom: 0.5em;"><strong>${section.numero} ${section.titulo}</strong></p>
                        ${section.subsections.map(subsection => `
                            <div style="margin-top: 0.8em;">
                                <p style="text-transform: uppercase; margin-bottom: 0.3em;"><strong style="text-decoration: underline;">${subsection.numero} ${subsection.titulo}</strong></p>
                                ${subsection.titulo.includes('PROPOSIÇÃO') ? 
                                    `<div style="margin-top: 2cm;">
                                        <table style="width: 100%; border-collapse: collapse;">
                                            <tr>
                                                <td style="width: 33%; text-align: left; vertical-align: top; padding-bottom: 2cm;">Proposto por:</td>
                                                <td style="width: 67%; text-align: center; padding-bottom: 2cm;">
                                                    _____________________________________<br/>
                                                    ${data.assinaturas.propostoPor.nome}<br/>
                                                    ${data.assinaturas.propostoPor.cargo}
                                                </td>
                                            </tr>
                                             <tr>
                                                <td style="width: 33%; text-align: left; vertical-align: top; padding-bottom: 2cm;">Visto por:</td>
                                                <td style="width: 67%; text-align: center; padding-bottom: 2cm;">
                                                    _____________________________________<br/>
                                                    ${data.assinaturas.vistoPor.nome}<br/>
                                                    ${data.assinaturas.vistoPor.cargo}
                                                </td>
                                            </tr>
                                             <tr>
                                                <td style="width: 33%; text-align: left; vertical-align: top;">Aprovado por:</td>
                                                <td style="width: 67%; text-align: center;">
                                                    _____________________________________<br/>
                                                    ${data.assinaturas.aprovadoPor.nome}<br/>
                                                    ${data.assinaturas.aprovadoPor.cargo}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>` 
                                : 
                                    `<p style="text-indent: 2.5cm; margin: 0; text-align: justify;">${formatText(subsection.conteudo)}</p>`
                                }
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>

            <!-- Referencias Page -->
             <div class="page" style="width: 210mm; min-height: 297mm; padding: 30mm 20mm 20mm 30mm; box-sizing: border-box; page-break-after: always;">
                <p style="font-weight: bold; text-transform: uppercase; margin-bottom: 1em;">REFERÊNCIAS</p>
                <p style="text-indent: 2.5cm; text-align: justify;">${formatText(data.referencias)}</p>
             </div>

            <!-- Anexo A -->
            <div class="page" style="width: 210mm; min-height: 297mm; padding: 30mm 20mm 20mm 30mm; box-sizing: border-box; page-break-after: always;">
                <p style="text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 1.5em;">Anexo A - Tabela de Efetivo Proposto</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 9pt; border: 1px solid black;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid black; padding: 4px;" rowspan="2">Função</th>
                            <th style="border: 1px solid black; padding: 4px;" colspan="3">Previsão Principal</th>
                            <th style="border: 1px solid black; padding: 4px;" colspan="3">Previsão Alternativa</th>
                            <th style="border: 1px solid black; padding: 4px;" rowspan="2">Efetivo Proposto</th>
                        </tr>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid black; padding: 4px;">Posto/Grad</th>
                            <th style="border: 1px solid black; padding: 4px;">Quadro</th>
                            <th style="border: 1px solid black; padding: 4px;">Espec.</th>
                            <th style="border: 1px solid black; padding: 4px;">Posto/Grad</th>
                            <th style="border: 1px solid black; padding: 4px;">Quadro</th>
                            <th style="border: 1px solid black; padding: 4px;">Espec.</th>
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
                        <tr>
                            <td colspan="7" style="border: 1px solid black; padding: 5px; text-align: right; font-weight: bold;">TOTAL</td>
                            <td style="border: 1px solid black; padding: 5px; text-align: center; font-weight: bold;">${totalEfetivoA}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- Anexo B -->
            <div class="page" style="width: 210mm; min-height: 297mm; padding: 30mm 20mm 20mm 30mm; box-sizing: border-box; page-break-after: always;">
                <p style="text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 1.5em;">Anexo B - Matriz de Qualificação</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 10pt; border: 1px solid black;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid black; padding: 5px; text-align: center;">Qualificação Desejável</th>
                            <th style="border: 1px solid black; padding: 5px; text-align: center;">Sigla</th>
                            <th style="border: 1px solid black; padding: 5px; text-align: center;">Legislação</th>
                            <th style="border: 1px solid black; padding: 5px; text-align: center;">Prioridade</th>
                            <th style="border: 1px solid black; padding: 5px; text-align: center;">SETOR-CH</th>
                            <th style="border: 1px solid black; padding: 5px; text-align: center;">SETOR-ENC</th>
                            <th style="border: 1px solid black; padding: 5px; text-align: center;">SETOR-AUX</th>
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
                <br/>
                <div style="border-top: 1px solid black; padding-top: 10px;">
                    <p style="font-size: 9pt;"><strong>LEGENDA:</strong> COLUNAS DOS CARGOS: 1 = CURSO DESEJÁVEL, 0 = CURSO NÃO DESEJÁVEL</p>
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

    const headerHtml = `<div style="width: 100%; font-family: 'Times New Roman'; font-size: 12pt;">
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
        putOnlyUsedFonts: true,
        floatPrecision: 16
    });

    // Use built-in 'times' font which maps to Times New Roman
    doc.setFont('times', 'normal');

    await doc.html(element, {
        callback: function (doc: any) {
            const totalPages = doc.internal.getNumberOfPages();
            
            // Add headers for subsequent pages
            for (let i = 2; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(11);
                doc.setFont('times', 'normal');
                
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageNum = i.toString();
                const pageNumWidth = doc.getTextWidth(pageNum);
                
                doc.text(data.numero, 30, 15); // NPA Number at top-left
                doc.text(pageNum, pageWidth - pageNumWidth - 20, 15); // Page Number at top-right
            }
            
            doc.save(`NPA_${data.numero.replace(/[\/\s]/g, '_')}.pdf`);
            previewContainer.innerHTML = '';
        },
        x: 0,
        y: 0,
        width: 210, // Target width in mm (A4)
        windowWidth: 794, // Standard 21cm width in px at 96 DPI
        autoPaging: 'text',
        margin: [0, 0, 0, 0], // Margins are already in the HTML page styles
    });
};
