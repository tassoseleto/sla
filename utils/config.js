// Configurações da aplicação
window.AppConfig = {
    // URL do Google Apps Script - ALTERE AQUI COM SUA URL
    GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbzMZhijsFYjGc8dVFVfJbVHt1vFOtmkrN6nGR650CheOOdkYEHP63roCbPDt8eYC1297A/exec',
    
    // Configurações da aplicação
    APP_NAME: 'Sistema de Logs AdOps',
    COMPANY_NAME: 'Adseleto',
    VERSION: '1.0.0',
    
    // Configurações de cache
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
    
    // Lista de países disponíveis
    COUNTRIES: [
        'Brasil',
        'EUA',
        'México',
        'Argentina',
        'Chile',
        'Colômbia',
        'Peru',
        'Uruguai',
        'Paraguai',
        'Bolívia',
        'Equador',
        'Venezuela'
    ],
    
    // Tipos de alterações predefinidas
    ALTERACAO_TYPES: [
        'Bloqueio de Criativos',
        'Bloqueio de Categoria',
        'Implementação de Tags',
        'Configuração Header Bidding',
        'Configuração AdSense',
        'Implementação GTM',
        'Configuração Analytics',
        'Otimização de Layout',
        'Otimização de Receita',
        'Otimização de Velocidade',
        'Otimização Mobile',
        'Debug e Correções',
        'Teste A/B',
        'Configuração de Unidades',
        'Ajuste de Targeting',
        'Configuração de Prebid',
        'Implementação de Lazy Loading',
        'Otimização de Core Web Vitals',
        'Configuração de Viewability',
        'Ajuste de Floor Prices'
    ],
    
    // Status disponíveis
    STATUS_OPTIONS: [
        { value: 'In progress', label: 'Em Progresso', color: 'yellow' },
        { value: 'Completed', label: 'Completado', color: 'green' },
        { value: 'Analyzed', label: 'Analisado', color: 'blue' },
        { value: 'Blocked', label: 'Bloqueado', color: 'red' },
        { value: 'Paused', label: 'Pausado', color: 'orange' }
    ],
    
    // Tipos de deliverable
    DELIVERABLE_OPTIONS: [
        'File',
        'Report',
        'Implementation',
        'Documentation',
        'Analysis',
        'Dashboard',
        'Optimization',
        'Configuration'
    ],
    
    // Configurações de tema
    THEME: {
        PRIMARY_COLOR: 'blue',
        SECONDARY_COLOR: 'gray',
        SUCCESS_COLOR: 'green',
        WARNING_COLOR: 'yellow',
        DANGER_COLOR: 'red'
    },
    
    // Mensagens da aplicação
    MESSAGES: {
        LOADING: 'Carregando dados...',
        SAVING: 'Salvando...',
        DELETING: 'Excluindo...',
        SUCCESS_SAVE: 'Log salvo com sucesso!',
        SUCCESS_DELETE: 'Log excluído com sucesso!',
        ERROR_LOAD: 'Erro ao carregar dados. Tente novamente.',
        ERROR_SAVE: 'Erro ao salvar. Dados salvos localmente.',
        ERROR_DELETE: 'Erro ao excluir. Tente novamente.',
        CONFIRM_DELETE: 'Tem certeza que deseja excluir este log?',
        NO_LOGS_FOUND: 'Nenhum log encontrado',
        START_FIRST_LOG: 'Comece criando seu primeiro log!',
        ADJUST_FILTERS: 'Tente ajustar os filtros de busca.',
        OFFLINE_MODE: 'Modo offline - dados salvos localmente'
    },
    
    // Validações
    VALIDATION: {
        REQUIRED_FIELDS: ['site', 'owner', 'alteracoes'],
        MIN_SITE_LENGTH: 3,
        MIN_OWNER_LENGTH: 2,
        MAX_NOTES_LENGTH: 500
    },
    
    // Local Storage keys
    STORAGE_KEYS: {
        LOGS: 'adopsLogs',
        CURRENT_ADOPS: 'currentAdOps',
        USER_PREFERENCES: 'userPreferences',
        LAST_SYNC: 'lastSync'
    }
};

// Função para validar configuração
window.AppConfig.validate = function() {
    if (!this.GOOGLE_SHEETS_URL || this.GOOGLE_SHEETS_URL === 'SUA_URL_AQUI') {
        console.warn('⚠️ Configure a URL do Google Sheets em config.js');
        return false;
    }
    return true;
};

// Função para obter configuração de status por valor
window.AppConfig.getStatusConfig = function(statusValue) {
    return this.STATUS_OPTIONS.find(status => status.value === statusValue) || 
           { value: statusValue, label: statusValue, color: 'gray' };
};

// Função para obter cor do status
window.AppConfig.getStatusColor = function(status) {
    const config = this.getStatusConfig(status);
    return `bg-${config.color}-100 text-${config.color}-800`;
};

console.log('✅ Configurações carregadas:', window.AppConfig.APP_NAME, 'v' + window.AppConfig.VERSION);git add .