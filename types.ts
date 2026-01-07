
export enum Tab {
    IDENTIFICACAO = 'Identificação e Cabeçalho',
    CORPO_TEXTO = 'Corpo do Texto e Assinaturas',
    ANEXOS = 'Tabelas de Anexos',
}

export interface Anexo {
    id: number;
    letra: string;
    titulo: string;
    tipo: 'efetivo' | 'qualificacao' | 'fluxograma' | 'custom';
    editavel: boolean;
}

export interface SubSubSection {
    id: number;
    numero: string;
    titulo: string;
    conteudo: string;
    editavel?: boolean;
}

export interface SubSection {
    id: number;
    numero: string;
    titulo: string;
    conteudo: string;
    tituloEditavel?: boolean;
    conteudoEditavel?: boolean;
    removivel?: boolean;
    subSubsections: SubSubSection[];
}

export interface Section {
    id: number;
    numero: string;
    titulo: string;
    tituloEditavel?: boolean;
    removivel?: boolean;
    subsections: SubSection[];
}

export interface Assinatura {
    nome: string;
    cargo: string;
}

export interface Previsao {
    postoGrad: string;
    quadro: string;
    especialidade: string;
}

export interface AnexoAItem {
    id: number;
    funcao: string;
    previsaoPrincipal: Previsao;
    previsaoAlternativa: Previsao;
    efetivoProposto: number;
}

export interface AnexoBItem {
    id: number;
    qualificacao: string;
    sigla: string;
    legislacao: string;
    prioridade: string;
    setorCh: '0' | '1';
    setorEnc: '0' | '1';
    setorAux: '0' | '1';
}

export interface NpaData {
    numero: string;
    dataExpedicao: string;
    validade: string;
    assunto: string;
    distribuicao: string;
    anexos: Anexo[];
    body: Section[];
    referencias: string;
    assinaturas: {
        propostoPor: Assinatura;
        vistoPor: Assinatura;
        aprovadoPor: Assinatura;
    };
    anexoA: AnexoAItem[];
    anexoB: AnexoBItem[];
}
