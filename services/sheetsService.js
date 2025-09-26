// Serviço para integração com Google Sheets
window.SheetsService = {
    
    // Configurações
    config: {
        get url() { 
            return window.AppConfig?.GOOGLE_SHEETS_URL || '';
        },
        timeout: 10000, // 10 segundos
        retryCount: 3,
        retryDelay: 1000 // 1 segundo
    },

    // Estados
    state: {
        isOnline: navigator.onLine,
        lastSync: localStorage.getItem('lastSync'),
        pendingOperations: JSON.parse(localStorage.getItem('pendingOperations') || '[]')
    },

    // Função para fazer requisições com retry
    async fetchWithRetry(url, options = {}, retryCount = 0) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
            
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response;
            
        } catch (error) {
            console.error(`Tentativa ${retryCount + 1} falhou:`, error.message);
            
            if (retryCount < this.config.retryCount - 1) {
                await this.delay(this.config.retryDelay * (retryCount + 1));
                return this.fetchWithRetry(url, options, retryCount + 1);
            }
            
            throw error;
        }
    },

    // Função auxiliar de delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Buscar todos os logs
    async fetchLogs() {
        try {
            if (!this.config.url) {
                throw new Error('URL do Google Sheets não configurada');
            }

            console.log('📊 Buscando logs do Google Sheets...');
            
            const response = await this.fetchWithRetry(
                this.config.url + '?action=get&timestamp=' + Date.now(),
                {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            let data = await response.json();
            
            // Verificar se retornou erro
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Se não for array, transformar
            if (!Array.isArray(data)) {
                data = data.data || [];
            }

            // Processar e validar dados
            const processedLogs = data.map(row => this.processLogData(row))
                                    .filter(log => log && log.site && log.site.trim());

            // Atualizar cache local
            localStorage.setItem(window.AppConfig.STORAGE_KEYS.LOGS, JSON.stringify(processedLogs));
            this.updateLastSync();
            this.state.isOnline = true;

            console.log('✅ Logs carregados:', processedLogs.length, 'registros');
            return { success: true, data: processedLogs };

        } catch (error) {
            console.error('❌ Erro ao buscar logs:', error);
            this.state.isOnline = false;
            
            // Tentar carregar do cache local
            const cachedLogs = localStorage.getItem(window.AppConfig.STORAGE_KEYS.LOGS);
            if (cachedLogs) {
                console.log('📱 Carregando logs do cache local');
                return { 
                    success: false, 
                    data: JSON.parse(cachedLogs), 
                    error: 'Dados do cache local - ' + error.message 
                };
            }
            
            return { success: false, data: [], error: error.message };
        }
    },

    // Salvar novo log
    async saveLog(logData) {
        try {
            if (!this.config.url) {
                throw new Error('URL do Google Sheets não configurada');
            }

            console.log('💾 Salvando log:', logData.site);

            const processedData = this.prepareLogForSave(logData);
            
            const response = await this.fetchWithRetry(
                this.config.url,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'add',
                        ...processedData
                    })
                }
            );

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }

            this.state.isOnline = true;
            console.log('✅ Log salvo com sucesso');
            return { success: true, data: result };

        } catch (error) {
            console.error('❌ Erro ao salvar log:', error);
            this.state.isOnline = false;
            
            // Salvar na fila de operações pendentes
            this.addPendingOperation('save', logData);
            
            // Salvar localmente também
            const cachedLogs = JSON.parse(localStorage.getItem(window.AppConfig.STORAGE_KEYS.LOGS) || '[]');
            cachedLogs.unshift(logData);
            localStorage.setItem(window.AppConfig.STORAGE_KEYS.LOGS, JSON.stringify(cachedLogs));
            
            return { success: false, error: error.message };
        }
    },

    // Processar dados vindos do Google Sheets
    processLogData(row) {
        if (!row || typeof row !== 'object') return null;

        // Mapear campos com possíveis variações de nome
        const getValue = (obj, keys) => {
            for (const key of keys) {
                if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
                    return obj[key];
                }
            }
            return '';
        };

        return {
            id: getValue(row, ['id', 'ID']) || Date.now(),
            createdAt: getValue(row, ['createdAt', 'createdat', 'datahora', 'DataHora', 'timestamp']) || new Date().toLocaleString('pt-BR'),
            alteracoes: getValue(row, ['alteracoes', 'alterações', 'Alteracoes', 'Alterações', 'type']),
            pais: getValue(row, ['pais', 'país', 'Pais', 'País', 'country']),
            site: getValue(row, ['site', 'Site', 'domain']),
            owner: getValue(row, ['owner', 'Owner', 'adops', 'responsavel']),
            status: getValue(row, ['status', 'Status', 'estado']) || 'In progress',
            startDate: getValue(row, ['startDate', 'startdate', 'dataInicio', 'start']),
            endDate: getValue(row, ['endDate', 'enddate', 'dataFim', 'end']),
            deliverable: getValue(row, ['deliverable', 'Deliverable', 'entregavel']) || 'File',
            notes: getValue(row, ['notes', 'Notes', 'observacoes', 'obs', 'comentarios']),
            analysisSheet: getValue(row, ['analysisSheet', 'analysissheet', 'planilhaAnalise', 'analysis']),
            gamLink: getValue(row, ['gamLink', 'gamlink', 'GAMLink', 'gam', 'linkGAM'])
        };
    },

    // Preparar dados para salvar no Google Sheets
    prepareLogForSave(logData) {
        return {
            id: logData.id || Date.now(),
            createdAt: logData.createdAt || new Date().toLocaleString('pt-BR'),
            alteracoes: logData.alteracoes || '',
            pais: logData.pais || '',
            site: logData.site || '',
            owner: logData.owner || '',
            status: logData.status || 'In progress',
            startDate: logData.startDate || '',
            endDate: logData.endDate || '',
            deliverable: logData.deliverable || 'File',
            notes: logData.notes || '',
            analysisSheet: logData.analysisSheet || '',
            gamLink: logData.gamLink || ''
        };
    },

    // Adicionar operação pendente
    addPendingOperation(type, data) {
        const operation = {
            id: Date.now(),
            type,
            data,
            timestamp: new Date().toISOString()
        };
        
        this.state.pendingOperations.push(operation);
        localStorage.setItem('pendingOperations', JSON.stringify(this.state.pendingOperations));
        
        console.log('📝 Operação pendente adicionada:', type);
    },

    // Processar operações pendentes
    async processPendingOperations() {
        if (this.state.pendingOperations.length === 0) return;
        
        console.log('🔄 Processando', this.state.pendingOperations.length, 'operações pendentes...');
        
        const operations = [...this.state.pendingOperations];
        this.state.pendingOperations = [];
        localStorage.setItem('pendingOperations', JSON.stringify([]));
        
        for (const operation of operations) {
            try {
                if (operation.type === 'save') {
                    await this.saveLog(operation.data);
                }
            } catch (error) {
                console.error('Erro ao processar operação pendente:', error);
                // Re-adicionar à fila se falhar
                this.addPendingOperation(operation.type, operation.data);
            }
        }
    },

    // Atualizar timestamp da última sincronização
    updateLastSync() {
        const now = new Date().toLocaleString('pt-BR');
        this.state.lastSync = now;
        localStorage.setItem('lastSync', now);
    },

    // Verificar status da conexão
    checkConnection() {
        this.state.isOnline = navigator.onLine;
        return this.state.isOnline;
    },

    // Inicializar serviço
    init() {
        console.log('🚀 Inicializando SheetsService...');
        
        // Monitorar conexão
        window.addEventListener('online', () => {
            console.log('🌐 Conexão restabelecida');
            this.state.isOnline = true;
            this.processPendingOperations();
        });
        
        window.addEventListener('offline', () => {
            console.log('📱 Conexão perdida - modo offline');
            this.state.isOnline = false;
        });

        // Validar configuração
        if (!window.AppConfig?.validate()) {
            console.warn('⚠️ Configuração inválida - funcionará apenas em modo local');
        }

        console.log('✅ SheetsService inicializado');
        return this;
    }
};

// Inicializar automaticamente
window.SheetsService.init();

console.log('✅ Serviço Google Sheets carregado');