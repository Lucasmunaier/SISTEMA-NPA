
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
        let summaryHtml = '<div style="width: 100%;">';

        const createSummaryRow = (text: string, isSub: boolean) => {
            const style = isSub ? 'padding-left: 2.5cm;' : 'font-weight: bold;';
            return `
                <div style="display: flex; justify-content: space-between; align-items: baseline; line-height: 1.5; ${style}">
                    <span style="white-space: nowrap; padding-right: 8px;">${text}</span>
                    <span style="width: 100%; border-bottom: 1px dotted black; margin-bottom: 4px;"></span>
                    <span style="white-space: nowrap; padding-left: 8px;">...</span>
                </div>
            `;
        };

        data.body.forEach(section => {
            summaryHtml += createSummaryRow(`${section.numero} ${section.titulo}`, false);
            section.subsections.forEach(subsection => {
                 summaryHtml += createSummaryRow(`${subsection.numero} ${subsection.titulo}`, true);
            });
        });
        summaryHtml += createSummaryRow('REFERÊNCIAS', false);
        summaryHtml += '</div>';
        return summaryHtml;
    };

    return `
        <div id="documentRoot" style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: black; line-height: 1.5; text-align: justify;">
            
            <!-- Page 1: Cover Page -->
            <div class="page" style="width: 21cm; height: 29.7cm; padding: 2cm; box-sizing: border-box; page-break-after: always; background-color: white;">
                <table style="width: 100%; border-collapse: collapse; border: 2px solid black;">
                    <tr>
                        <td style="width: 25%; text-align: center; padding: 10px; border-right: 2px solid black; vertical-align: middle;">
                            <img src="${PAMA_LS_LOGO_B64}" alt="PAMA LS Logo" style="width: 80px; height: auto;"/>
                        </td>
                        <td style="width: 50%; text-align: center; padding: 10px; vertical-align: middle;">
                            <strong style="font-size: 13pt;">COMANDO DA AERONÁUTICA<br/>PARQUE DE MATERIAL AERONÁUTICO<br/>DE LAGOA SANTA</strong>
                            <br/><br/>
                            <strong style="font-size: 14pt;">NORMA PADRÃO DE AÇÃO</strong>
                        </td>
                        <td style="width: 25%; text-align: center; padding: 0; border-left: 2px solid black; vertical-align: top;">
                            <div style="border-bottom: 1px solid black; padding: 5px;"><strong>Nº DO DOCUMENTO</strong><br/>${data.numero}</div>
                            <div style="border-bottom: 1px solid black; padding: 5px;"><strong>EXPEDIÇÃO</strong><br/>${formatDate(data.dataExpedicao)}</div>
                            <div style="padding: 5px;"><strong>VALIDADE</strong><br/>${data.validade}</div>
                        </td>
                    </tr>
                     <tr>
                        <td style="padding: 8px; border-top: 2px solid black; text-align: center;"><strong>ASSUNTO</strong></td>
                        <td colspan="2" style="padding: 8px; border-top: 2px solid black; border-left: 2px solid black;">${data.assunto}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-top: 1px solid black; text-align: center;"><strong>ANEXOS</strong></td>
                        <td colspan="2" style="padding: 8px; border-top: 1px solid black; border-left: 2px solid black;">
                           ${data.anexos.map(a => `${a.letra} - ${a.titulo}`).join('<br/>')}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-top: 1px solid black; text-align: center;"><strong>DISTRIBUIÇÃO</strong></td>
                        <td colspan="2" style="padding: 8px; border-top: 1px solid black; border-left: 2px solid black;">${data.distribuicao}</td>
                    </tr>
                </table>
                <div style="margin-top: 5cm;">
                    <h2 style="text-align: center; font-size: 16pt;">SUMÁRIO</h2>
                    ${generateSummary()}
                </div>
            </div>

            <!-- Content Pages -->
            <div class="page" style="width: 21cm; min-height: 29.7cm; padding: 3cm 2cm 2cm 3cm; box-sizing: border-box; page-break-after: always; background-color: white;">
                 ${data.body.map(section => `
                    <div style="margin-bottom: 1.5em;">
                        <p style="text-transform: uppercase;"><strong>${section.numero} ${section.titulo}</strong></p>
                        ${section.subsections.map(subsection => `
                            <div style="margin-top: 1em;">
                                <p style="text-transform: uppercase;"><strong><u>${subsection.numero} ${subsection.titulo}</u></strong></p>
                                ${subsection.titulo.includes('PROPOSIÇÃO') ? 
                                    `<div style="margin-top: 3cm;">
                                        <table style="width: 100%; border-collapse: collapse;">
                                            <tr>
                                                <td style="width: 33%; text-align: left; vertical-align: top; padding-bottom: 3cm;">Proposto por:</td>
                                                <td style="width: 67%; text-align: center; padding-bottom: 3cm;">
                                                    _____________________________________<br/>
                                                    ${data.assinaturas.propostoPor.nome}<br/>
                                                    ${data.assinaturas.propostoPor.cargo}
                                                </td>
                                            </tr>
                                             <tr>
                                                <td style="width: 33%; text-align: left; vertical-align: top; padding-bottom: 3cm;">Visto por:</td>
                                                <td style="width: 67%; text-align: center; padding-bottom: 3cm;">
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
                                    `<p style="text-indent: 2.5cm;">${formatText(subsection.conteudo)}</p>`
                                }
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>

            <!-- Referencias Page -->
             <div class="page" style="width: 21cm; min-height: 29.7cm; padding: 3cm 2cm 2cm 3cm; box-sizing: border-box; page-break-after: always; background-color: white;">
                <p style="font-weight: bold; text-transform: uppercase;">REFERÊNCIAS</p>
                <p>${formatText(data.referencias)}</p>
             </div>

            <!-- Anexos Pages -->
            <!-- Anexo A -->
            <div class="page" style="width: 21cm; min-height: 29.7cm; padding: 3cm 2cm 2cm 3cm; box-sizing: border-box; page-break-after: always; background-color: white;">
                <p style="text-align: center; font-weight: bold;">Anexo A - Tabela de Efetivo Proposto</p>
                <br/>
                <table style="width: 100%; border-collapse: collapse; font-size: 11pt; border: 1px solid black;">
                    <thead>
                        <tr style="background-color: #e0e0e0;">
                            <th style="border: 1px solid black; padding: 5px; text-align: center;">Função</th>
                            <th style="border: 1px solid black; padding: 5px; text-align: center;">Previsão Principal (Posto/Grad, Quadro, Espec.)</th>
                            <th style="border: 1px solid black; padding: 5px; text-align: center;">Previsão Alternativa (Posto/Grad, Quadro, Espec.)</th>
                            <th style="border: 1px solid black; padding: 5px; text-align: center;">Efetivo Proposto</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.anexoA.map(row => `
                            <tr>
                                <td style="border: 1px solid black; padding: 5px;">${row.funcao}</td>
                                <td style="border: 1px solid black; padding: 5px;">${row.previsaoPrincipal}</td>
                                <td style="border: 1px solid black; padding: 5px;">${row.previsaoAlternativa}</td>
                                <td style="border: 1px solid black; padding: 5px; text-align: center;">${row.efetivoProposto}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="border: 1px solid black; padding: 5px; text-align: right; font-weight: bold;">TOTAL</td>
                            <td style="border: 1px solid black; padding: 5px; text-align: center; font-weight: bold;">${totalEfetivoA}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- Anexo B -->
            <div class="page" style="width: 21cm; min-height: 29.7cm; padding: 3cm 2cm 2cm 3cm; box-sizing: border-box; page-break-after: always; background-color: white;">
                <p style="text-align: center; font-weight: bold;">Anexo B - Matriz de Qualificação</p>
                <br/>
                <table style="width: 100%; border-collapse: collapse; font-size: 11pt; border: 1px solid black;">
                    <thead>
                        <tr style="background-color: #e0e0e0;">
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
                <p style="font-size: 10pt;"><strong>LEGENDA:</strong> COLUNAS DOS CARGOS: 1 = CURSO DESEJÁVEL, 0 = CURSO NÃO DESEJÁVEL</p>
            </div>

            <!-- Anexo C -->
            <div class="page" style="width: 21cm; min-height: 29.7cm; padding: 3cm 2cm 2cm 3cm; box-sizing: border-box; background-color: white;">
                <p style="text-align: center; font-weight: bold;">Anexo C - Fluxograma Bizagi</p>
                <br/><br/>
                <div style="width: 100%; height: 20cm; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center;">
                    <p style="color: #888;">(Espaço reservado para colar a imagem do fluxograma)</p>
                </div>
            </div>
        </div>
    `;
}

export const exportToDocx = async (data: NpaData): Promise<void> => {
    const htmlToDocx = (window as any).htmlToDocx;
    if (!htmlToDocx) {
        console.error('html-to-docx-ts library is not loaded.');
        alert('Erro: A biblioteca de exportação para DOCX não foi carregada.');
        return;
    }

    const headerHtml = `
        <div style="width: 100%; font-family: 'Times New Roman', Times, serif; font-size: 12pt;">
            <table style="width: 100%;">
                <tr>
                    <td style="width: 50%; text-align: left;">${data.numero}</td>
                    <td style="width: 50%; text-align: right;">{PAGENUM}</td>
                </tr>
            </table>
        </div>`;
    const content = getDocumentHtml(data);
    
    const fileBuffer = await htmlToDocx.asBlob(content, {
        orientation: 'portrait',
        margins: {
            top: 1134,
            bottom: 756,
            left: 1134,
            right: 756,
            header: 425,
            footer: 425,
        },
        header: {
            html: headerHtml,
            type: 'default',
        },
    });

    const url = URL.createObjectURL(fileBuffer);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NPA_${data.numero.replace(/[\/\s]/g, '_') || 'documento'}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};


export const exportToPdf = async (data: NpaData): Promise<void> => {
    const jspdf = (window as any).jspdf;
    const html2canvas = (window as any).html2canvas;

    if (!jspdf || !html2canvas) {
        const errorMsg = 'Erro: Bibliotecas de exportação (jspdf, html2canvas) não foram carregadas.';
        console.error(errorMsg);
        alert(errorMsg);
        throw new Error('PDF export libraries not loaded');
    }

    const previewContainer = document.getElementById('document-preview-container');
    if (!previewContainer) {
        const errorMsg = 'Container de preview do documento não encontrado.';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    previewContainer.innerHTML = getDocumentHtml(data);
    const documentRoot = previewContainer.querySelector<HTMLElement>('#documentRoot');
    if (!documentRoot) {
        const errorMsg = 'Elemento raiz do documento para exportação não encontrado.';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
    
    try {
        const { jsPDF } = jspdf;
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
        });

        const pages = Array.from(documentRoot.querySelectorAll<HTMLElement>('.page'));
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const canvas = await html2canvas(page, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
            });

            // Use JPEG for smaller file sizes
            const imgData = canvas.toDataURL('image/jpeg', 0.92);

            if (i > 0) {
                doc.addPage();
            }
            
            doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }
        
        // Add headers to all pages except the first one
        const totalPages = doc.internal.getNumberOfPages();
        const headerText = data.numero;
        const leftMargin = 30; // 3cm
        const rightMargin = 20; // 2cm
        const headerY = 15; // 1.5cm from top
        
        for (let i = 2; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(12);
            doc.setFont('Times-Roman', 'normal');
            
            const pageNumText = `${i}`;
            const pageNumWidth = doc.getTextWidth(pageNumText);
            
            // Set text color to black for headers
            doc.setTextColor(0, 0, 0);
            doc.text(headerText, leftMargin, headerY);
            doc.text(pageNumText, pdfWidth - pageNumWidth - rightMargin, headerY);
        }

        doc.save(`NPA_${data.numero.replace(/[\/\s]/g, '_') || 'documento'}.pdf`);
    } catch (err) {
        console.error("Erro durante a geração do PDF:", err);
        alert("Ocorreu um erro inesperado ao gerar o PDF.");
        throw err; // Re-throw to be caught by the handler in App.tsx
    } finally {
        previewContainer.innerHTML = ''; // Clean up
    }
};
