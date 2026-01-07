export const exportToPdf = async (data: NpaData): Promise<void> => {
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });

    // 1. DEFINIÇÃO DE CONSTANTES CRÍTICAS
    const pageWidth = doc.internal.pageSize.width;
    const margins = { top: 25, left: 30, right: 20, bottom: 20 };
    let currentY = margins.top; // Variável que controla a posição vertical na página

    // 2. FUNÇÃO PARA ADICIONAR CABEÇALHO DE PÁGINA (exceto na primeira)
    const addPageHeader = (pageNum: number) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        // Texto à esquerda (Número do documento)
        doc.text(data.numero, margins.left, 15);
        // Número da página à direita
        const pageNumText = pageNum.toString();
        const textWidth = doc.getTextWidth(pageNumText);
        doc.text(pageNumText, pageWidth - margins.right - textWidth, 15);
    };

    // 3. CONSTRUÇÃO MANUAL DA CAPA (Página 1)
    // ... (Código para posicionar logo, título, tabela de metadados usando doc.text() e doc.autoTable())
    // Após a capa:
    doc.addPage();
    addPageHeader(2);
    currentY = margins.top; // Resetar Y para o topo da segunda página

    // 4. CONSTRUÇÃO MANUAL DO SUMÁRIO
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SUMÁRIO', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    // Exemplo de linha do sumário com pontilhados
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const lineText = '1 DISPOSIÇÕES PRELIMINARES';
    const pageNum = '2';
    
    doc.text(lineText, margins.left, currentY);
    // Calcular posição dos pontilhados
    const lineWidth = pageWidth - margins.left - margins.right;
    const textWidth = doc.getTextWidth(lineText);
    const pageNumWidth = doc.getTextWidth(pageNum);
    const dotStartX = margins.left + textWidth + 5;
    const dotEndX = pageWidth - margins.right - pageNumWidth - 5;
    
    // Desenhar linha pontilhada (simplificado)
    doc.setLineWidth(0.1);
    doc.setDrawColor(0, 0, 0);
    // Aqui você implementaria um loop para desenhar pontos/traços
    // ...
    doc.text(pageNum, pageWidth - margins.right - pageNumWidth, currentY);
    
    currentY += 6;
    // ... Adicionar outras linhas do sumário

    // 5. CONSTRUÇÃO MANUAL DAS SEÇÕES PRINCIPAIS
    // PARA CADA SEÇÃO E SUBSECÇÃO:
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1 DISPOSIÇÕES PRELIMINARES', margins.left, currentY);
    currentY += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('1.1 FINALIDADE', margins.left + 5, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    const finalidadeLines = doc.splitTextToSize(data.finalidade, pageWidth - margins.left - margins.right - 10);
    doc.text(finalidadeLines, margins.left + 10, currentY);
    currentY += finalidadeLines.length * 5 + 8;

    // 6. VERIFICAÇÃO DE QUEBRA DE PÁGINA ANTES DE CADA NOVO BLOCO
    if (currentY > doc.internal.pageSize.height - margins.bottom - 20) {
        doc.addPage();
        addPageHeader(doc.internal.getNumberOfPages());
        currentY = margins.top;
    }

    // 7. CONSTRUÇÃO DAS TABELAS (ANEXOS) COM jspdf-autotable
    doc.addPage();
    addPageHeader(doc.internal.getNumberOfPages());
    currentY = margins.top;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ANEXO A - TABELA DE EFETIVO PROPOSTO', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    (doc as any).autoTable({
        startY: currentY,
        head: [['Função', 'Posto/Grad', 'Quadro', 'Espec.', 'Posto/Grad', 'Quadro', 'Espec.', 'Efetivo Proposto']],
        body: data.anexoA.map(row => [
            row.funcao,
            row.previsaoPrincipal.postoGrad,
            row.previsaoPrincipal.quadro,
            row.previsaoPrincipal.especialidade,
            row.previsaoAlternativa.postoGrad,
            row.previsaoAlternativa.quadro,
            row.previsaoAlternativa.especialidade,
            row.efetivoProposto.toString()
        ]),
        margin: { left: margins.left, right: margins.right },
        styles: { 
            fontSize: 9, 
            cellPadding: 2,
            lineWidth: 0.25,
            lineColor: [0, 0, 0] // Preto para bordas
        },
        headStyles: { 
            fillColor: [220, 220, 220], // Cinza claro
            textColor: [0, 0, 0],
            fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // 8. SALVAR O DOCUMENTO
    doc.save(`NPA_${data.numero.replace(/[\/\s]/g, '_')}.pdf`);
};