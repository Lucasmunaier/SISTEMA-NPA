
import React, { useState } from 'react';
import { NpaData, Tab, Section, SubSection } from './types';
import Tabs from './components/Tabs';
import TabIdentificacao from './components/TabIdentificacao';
import TabCorpoTexto from './components/TabCorpoTexto';
import TabAnexos from './components/TabAnexos';
import { exportToDocx, exportToPdf } from './services/exportService';

const initialNpaData: NpaData = {
    numero: 'NPA XX-XX/SETOR/2025',
    dataExpedicao: new Date().toISOString().split('T')[0],
    validade: '2 ANOS',
    assunto: 'Seção XXX (XXXX)',
    distribuicao: 'B',
    anexos: [
        { id: 1, letra: 'A', titulo: 'Tabela Efetivo Proposto', tipo: 'efetivo', editavel: false },
        { id: 2, letra: 'B', titulo: 'Matriz de Qualificação', tipo: 'qualificacao', editavel: false },
        { id: 3, letra: 'C', titulo: 'Fluxograma Bizagi', tipo: 'fluxograma', editavel: true },
    ],
    body: [
        {
            id: 1, numero: '1', titulo: 'DISPOSIÇÕES PRELIMINARES', tituloEditavel: false, removivel: false, subsections: [
                { id: 11, numero: '1.1', titulo: 'FINALIDADE', conteudo: 'A presente Norma Padrão de Ação (NPA) destina-se XXXXX', tituloEditavel: false, conteudoEditavel: true, removivel: false, subSubsections: [] },
                { id: 12, numero: '1.2', titulo: 'CONCEITUAÇÃO', conteudo: '', tituloEditavel: false, conteudoEditavel: true, removivel: false, subSubsections: [] },
                { id: 13, numero: '1.3', titulo: 'ÂMBITO', conteudo: 'Esta NPA, de observância obrigatória, aplica-se à XXX do PAMALS.', tituloEditavel: false, conteudoEditavel: true, removivel: false, subSubsections: [] },
                { id: 14, numero: '1.4', titulo: 'DEFINIÇÕES', conteudo: '', tituloEditavel: false, conteudoEditavel: true, removivel: false, subSubsections: [] },
                { id: 15, numero: '1.5', titulo: 'RELACIONAMENTO', conteudo: '', tituloEditavel: false, conteudoEditavel: true, removivel: false, subSubsections: [] },
            ]
        },
        {
            id: 2, numero: '2', titulo: 'DISPOSIÇÕES GERAIS', tituloEditavel: false, removivel: false, subsections: [
                { id: 21, numero: '2.1', titulo: 'RESPONSABILIDADES', conteudo: '', tituloEditavel: false, conteudoEditavel: true, removivel: false, subSubsections: [] },
                { id: 22, numero: '2.2', titulo: 'COMPOSIÇÃO', conteudo: '', tituloEditavel: false, conteudoEditavel: true, removivel: false, subSubsections: [] },
            ]
        },
        {
            id: 3, numero: '3', titulo: 'DISPOSIÇÕES FINAIS', tituloEditavel: false, removivel: false, subsections: [
                { id: 31, numero: '3.1', titulo: 'VIGÊNCIA', conteudo: 'A presente NPA entrará em vigor a contar da data de publicação no Boletim Interno Ostensivo do GAP-LS, revogando a NPA XX-XX efetivada em XXXXXX', tituloEditavel: false, conteudoEditavel: true, removivel: false, subSubsections: [] },
                { id: 32, numero: '3.2', titulo: 'ATUALIZAÇÃO', conteudo: 'Esta NPA deverá ser atualizada pela XX, quando necessário, para incluir novas atividades que venham a ser delegadas à XX ou excluir aquelas que venham a ser extintas ou transferidas para outros setores.', tituloEditavel: false, conteudoEditavel: true, removivel: false, subSubsections: [] },
                { id: 33, numero: '3.4', titulo: 'CASOS NÃO PREVISTOS', conteudo: 'Os casos não previstos serão resolvidos pelo Sr. Diretor do PAMALS.', tituloEditavel: false, conteudoEditavel: false, removivel: false, subSubsections: [] },
                { id: 34, numero: '3.5', titulo: 'PROPOSIÇÃO, VISTO E APROVAÇÃO', conteudo: '', tituloEditavel: false, conteudoEditavel: false, removivel: false, subSubsections: [] },
            ]
        }
    ],
    referencias: `BRASIL. Comando da Aeronáutica. Diretoria de Material Aeronáutico e Bélico. Portaria DIRMAB n° 118/PLON, de 18 de dezembro de 2023. Aprova a reedição do Regimento Interno do Parque de Material Aeronáutico de Lagoa Santa = RICA 21-87. Boletim do Comando da Aeronáutica, Rio de Janeiro, RJ, n. 233, de 21 dez 2023.\n\nBRASIL. Comando da Aeronáutica. Comando-Geral do Pessoal. Portaria COMGEP n° 836/DLE, de 1º d maio de 2019. Aprova a edição da Norma de Sistema que dispõe sobre Correspondência e Atos Oficiais do Comando da Aeronáutica = NSCA 10-2. Boletim do Comando da Aeronáutica, Rio de Janeiro, RJ, n. 72, 02 mai 2019.`,
    assinaturas: {
        propostoPor: { nome: 'FULANO DE TAL Ten Cel Int', cargo: 'Chefe da ou do XXXX (XXX)' },
        vistoPor: { nome: 'JOSÉ ERASMO LEITE JUNIOR Cel Int', cargo: 'Agente de Controle Interno' },
        aprovadoPor: { nome: 'CLAUDOMIRO FELTRAN JUNIOR Cel Av', cargo: 'Diretor do PAMALS' },
    },
    anexoA: [
        { id: 1, funcao: 'SETOR-CH (Chefe)', previsaoPrincipal: { postoGrad: '', quadro: '', especialidade: '' }, previsaoAlternativa: { postoGrad: '', quadro: '', especialidade: '' }, efetivoProposto: 1 },
        { id: 2, funcao: 'SETOR-ENC (Encarregado)', previsaoPrincipal: { postoGrad: '', quadro: '', especialidade: '' }, previsaoAlternativa: { postoGrad: '', quadro: '', especialidade: '' }, efetivoProposto: 1 },
        { id: 3, funcao: 'SETOR-AUX (Auxiliar)', previsaoPrincipal: { postoGrad: '', quadro: '', especialidade: '' }, previsaoAlternativa: { postoGrad: '', quadro: '', especialidade: '' }, efetivoProposto: 1 },
    ],
    anexoB: [],
};


const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.IDENTIFICACAO);
    const [npaData, setNpaData] = useState<NpaData>(initialNpaData);
    const [isExporting, setIsExporting] = useState(false);

    const handleDataChange = (field: keyof NpaData, value: any) => {
        setNpaData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleBodyContentChange = (sectionIndex: number, subsectionIndex: number, field: 'titulo' | 'conteudo', value: string) => {
        const newBody = [...npaData.body];
        (newBody[sectionIndex].subsections[subsectionIndex] as any)[field] = value;
        setNpaData(prev => ({...prev, body: newBody}));
    };
    
    const handleSectionTitleChange = (sectionIndex: number, value: string) => {
        const newBody = [...npaData.body];
        newBody[sectionIndex].titulo = value;
        setNpaData(prev => ({...prev, body: newBody}));
    };
    
    const addSection = () => {
        setNpaData(prev => {
            const newSectionNumber = prev.body.length + 1;
            const newSection: Section = {
                id: Date.now(),
                numero: `${newSectionNumber}`,
                titulo: '',
                tituloEditavel: true,
                removivel: true,
                subsections: []
            };
            return { ...prev, body: [...prev.body, newSection] };
        });
    };

    const removeSection = (sectionId: number) => {
        setNpaData(prev => {
            const newBody = prev.body.filter(s => s.id !== sectionId)
                .map((section, index) => {
                    const newSectionNumber = `${index + 1}`;
                    section.numero = newSectionNumber;
                    section.subsections.forEach((sub, subIndex) => {
                        sub.numero = `${newSectionNumber}.${subIndex + 1}`;
                    });
                    return section;
                });
            return { ...prev, body: newBody };
        });
    };

    const addSubsection = (sectionIndex: number) => {
        setNpaData(prev => {
            const newBody = [...prev.body];
            const targetSection = newBody[sectionIndex];
            const newSubNumber = `${targetSection.numero}.${targetSection.subsections.length + 1}`;
            const newSubsection: SubSection = {
                id: Date.now(),
                numero: newSubNumber,
                titulo: '',
                conteudo: '',
                tituloEditavel: true,
                conteudoEditavel: true,
                removivel: true,
                subSubsections: []
            };
            targetSection.subsections.push(newSubsection);
            return { ...prev, body: newBody };
        });
    };

    const removeSubsection = (sectionIndex: number, subsectionId: number) => {
         setNpaData(prev => {
            const newBody = [...prev.body];
            const targetSection = newBody[sectionIndex];
            targetSection.subsections = targetSection.subsections
                .filter(s => s.id !== subsectionId)
                .map((sub, subIndex) => {
                    sub.numero = `${targetSection.numero}.${subIndex + 1}`;
                    return sub;
                });
            return { ...prev, body: newBody };
        });
    };

    const handleSignatureChange = (signer: 'propostoPor' | 'vistoPor' | 'aprovadoPor', field: 'nome' | 'cargo', value: string) => {
        setNpaData(prev => ({
            ...prev,
            assinaturas: {
                ...prev.assinaturas,
                [signer]: {
                    ...prev.assinaturas[signer],
                    [field]: value
                }
            }
        }));
    };

    const handleExport = async (format: 'docx' | 'pdf') => {
        setIsExporting(true);
        try {
            if (format === 'docx') {
                await exportToDocx(npaData);
            } else {
                await exportToPdf(npaData);
            }
        } catch (error) {
            console.error(`Failed to export to ${format}`, error);
            alert(`Ocorreu um erro ao exportar para ${format.toUpperCase()}. Verifique o console para mais detalhes.`);
        } finally {
            setIsExporting(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-cyan-400">Gerador de Documentos PAMA LS</h1>
                    <p className="text-lg text-gray-400 mt-2">NPA System - Confecção de Normas Padrão de Ação</p>
                </header>

                <div className="bg-gray-800 shadow-2xl rounded-lg p-6">
                    <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="mt-6">
                        {activeTab === Tab.IDENTIFICACAO && <TabIdentificacao data={npaData} onDataChange={handleDataChange} />}
                        {activeTab === Tab.CORPO_TEXTO && 
                            <TabCorpoTexto 
                                data={npaData}
                                onBodyContentChange={handleBodyContentChange}
                                onSectionTitleChange={handleSectionTitleChange}
                                onSignatureChange={handleSignatureChange} 
                                onDataChange={handleDataChange}
                                addSection={addSection}
                                removeSection={removeSection}
                                addSubsection={addSubsection}
                                removeSubsection={removeSubsection}
                            />
                        }
                        {activeTab === Tab.ANEXOS && <TabAnexos data={npaData} onDataChange={handleDataChange} />}
                    </div>
                </div>

                <footer className="mt-8 py-4 text-center">
                    <div className="flex justify-center items-center space-x-4">
                        <button 
                            onClick={() => handleExport('docx')}
                            disabled={isExporting}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-wait text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg flex items-center"
                        >
                            {isExporting ? 'Exportando...' : 'Exportar para DOCX'}
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            disabled={isExporting}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-wait text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg flex items-center"
                        >
                            {isExporting ? 'Exportando...' : 'Exportar para PDF'}
                        </button>
                    </div>
                    {isExporting && <p className="mt-4 text-cyan-400 animate-pulse">Gerando documento, por favor aguarde...</p>}
                </footer>
            </div>
        </div>
    );
};

export default App;
