// Componente principal da aplicação AdOps
const AdOpsLogApp = () => {
    const { useState, useEffect } = React;
    
    // Estados principais
    const [logs, setLogs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingLog, setEditingLog] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentAdOps, setCurrentAdOps] = useState('');
    
    // Estados de controle
    const [isLoading, setIsLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [lastSync, setLastSync] = useState(null);
    const [notification, setNotification] = useState(null);
    
    // Estado do formulário
    const [formData, setFormData] = useState({
        alteracoes: '',
        alteracaoCustom: '',
        pais: '',
        site: '',
        owner: '',
        status: 'In progress',
        startDate: '',
        endDate: '',
        deliverable: 'File',
        notes: '',
        analysisSheet: '',
        gamLink: ''
    });

    // Carregar dados iniciais
    useEffect(() => {
        initializeApp();
    }, []);

    // Monitorar mudanças no filtro AdOps
    useEffect(() => {
        localStorage.setItem(window.AppConfig.STORAGE_KEYS.CURRENT_ADOPS, currentAdOps);
    }, [currentAdOps]);

    // Inicializar aplicação
    const initializeApp = async () => {
        try {
            // Carregar filtro AdOps salvo
            const savedAdOps = localStorage.getItem(window.AppConfig.STORAGE_KEYS.CURRENT_ADOPS);
            if (savedAdOps) {
                setCurrentAdOps(savedAdOps);
            }

            // Carregar último sync
            const savedLastSync = localStorage.getItem('lastSync');
            if (savedLastSync) {
                setLastSync(savedLastSync);
            }

            // Carregar logs
            await fetchLogs();
            
        } catch (error) {
            console.error('Erro ao inicializar:', error);
            showNotification('Erro ao inicializar sistema', 'error');
        }
    };

    // Buscar logs
    const fetchLogs = async () => {
        setIsLoading(true);
        
        try {
            const result = await window.SheetsService.fetchLogs();
            
            if (result.success) {
                setLogs(result.data);
                setIsOnline(true);
                setLastSync(new Date().toLocaleString('pt-BR'));
            } else {
                setLogs(result.data); // Dados do cache
                setIsOnline(false);
                showNotification('Dados carregados do cache local', 'warning');
            }
            
        } catch (error) {
            console.error('Erro ao carregar logs:', error);
            setIsOnline(false);
            showNotification('Erro ao carregar dados', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Resetar formulário
    const resetForm = () => {
        setFormData({
            alteracoes: '',
            alteracaoCustom: '',
            pais: '',
            site: '',
            owner: '',
            status: 'In progress',
            startDate: '',
            endDate: '',
            deliverable: 'File',
            notes: '',
            analysisSheet: '',
            gamLink: ''
        });
        setEditingLog(null);
        setShowForm(false);
    };

    // Validar formulário
    const validateForm = () => {
        const requiredFields = window.AppConfig.VALIDATION.REQUIRED_FIELDS;
        const finalAlteracao = formData.alteracoes === 'Personalizada' ? formData.alteracaoCustom : formData.alteracoes;
        
        for (const field of requiredFields) {
            let value = formData[field];
            if (field === 'alteracoes') value = finalAlteracao;
            
            if (!value || value.trim().length === 0) {
                const fieldNames = {
                    site: 'Site',
                    owner: 'Owner (AdOps)',
                    alteracoes: 'Tipo de Alteração'
                };
                showNotification(`Campo obrigatório: ${fieldNames[field]}`, 'error');
                return false;
            }
        }

        // Validações específicas
        if (formData.site.length < window.AppConfig.VALIDATION.MIN_SITE_LENGTH) {
            showNotification('Site deve ter pelo menos 3 caracteres', 'error');
            return false;
        }

        if (formData.owner.length < window.AppConfig.VALIDATION.MIN_OWNER_LENGTH) {
            showNotification('Owner deve ter pelo menos 2 caracteres', 'error');
            return false;
        }

        if (formData.notes && formData.notes.length > window.AppConfig.VALIDATION.MAX_NOTES_LENGTH) {
            showNotification('Notes deve ter no máximo 500 caracteres', 'error');
            return false;
        }

        return true;
    };

    // Submeter formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            const finalAlteracao = formData.alteracoes === 'Personalizada' ? formData.alteracaoCustom : formData.alteracoes;
            
            const newLog = {
                id: editingLog ? editingLog.id : Date.now(),
                createdAt: editingLog ? editingLog.createdAt : new Date().toLocaleString('pt-BR'),
                alteracoes: finalAlteracao,
                pais: formData.pais,
                site: formData.site,
                owner: formData.owner,
                status: formData.status,
                startDate: formData.startDate,
                endDate: formData.endDate,
                deliverable: formData.deliverable,
                notes: formData.notes,
                analysisSheet: formData.analysisSheet,
                gamLink: formData.gamLink
            };

            const result = await window.SheetsService.saveLog(newLog);
            
            if (result.success) {
                showNotification('Log salvo com sucesso!', 'success');
                setIsOnline(true);
                await fetchLogs(); // Recarregar dados
            } else {
                // Atualizar localmente
                if (editingLog) {
                    setLogs(logs.map(log => log.id === editingLog.id ? newLog : log));
                } else {
                    setLogs([newLog, ...logs]);
                }
                setIsOnline(false);
                showNotification('Salvo localmente - será sincronizado quando voltar online', 'warning');
            }

            resetForm();
            
        } catch (error) {
            console.error('Erro ao salvar:', error);
            showNotification('Erro ao salvar log', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Editar log
    const handleEdit = (log) => {
        const isCustom = !window.AppConfig.ALTERACAO_TYPES.includes(log.alteracoes);
        
        setFormData({
            alteracoes: isCustom ? 'Personalizada' : log.alteracoes,
            alteracaoCustom: isCustom ? log.alteracoes : '',
            pais: log.pais || '',
            site: log.site || '',
            owner: log.owner || '',
            status: log.status || 'In progress',
            startDate: log.startDate || '',
            endDate: log.endDate || '',
            deliverable: log.deliverable || 'File',
            notes: log.notes || '',
            analysisSheet: log.analysisSheet || '',
            gamLink: log.gamLink || ''
        });
        setEditingLog(log);
        setShowForm(true);
    };

    // Excluir log
    const handleDelete = (id) => {
        if (confirm(window.AppConfig.MESSAGES.CONFIRM_DELETE)) {
            setLogs(logs.filter(log => log.id !== id));
            showNotification('Log excluído com sucesso!', 'success');
        }
    };

    // Mostrar notificação
    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    // Filtrar logs
    const filteredLogs = logs.filter(log => {
        const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
        const matchesSearch = ['site', 'alteracoes', 'pais', 'notes', 'owner'].some(field =>
            (log[field] || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesAdOps = !currentAdOps || (log.owner || '').toLowerCase().includes(currentAdOps.toLowerCase());
        
        return matchesStatus && matchesSearch && matchesAdOps;
    });

    // Cálculos de estatísticas
    const getFilteredStats = () => {
        const filtered = currentAdOps 
            ? logs.filter(log => (log.owner || '').toLowerCase().includes(currentAdOps.toLowerCase()))
            : logs;

        return {
            total: filtered.length,
            inProgress: filtered.filter(log => log.status === 'In progress').length,
            completed: filtered.filter(log => log.status === 'Completed' || log.status === 'Analyzed').length,
            analyzed: filtered.filter(log => log.status === 'Analyzed').length,
            blocked: filtered.filter(log => log.status === 'Blocked').length
        };
    };

    const stats = getFilteredStats();
    const progressPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    const analyzedPercentage = stats.total > 0 ? Math.round((stats.analyzed / stats.total) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                
                {/* Notificação */}
                {notification && (
                    <div className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg ${
                        notification.type === 'success' ? 'bg-green-500 text-white' :
                        notification.type === 'warning' ? 'bg-yellow-500 text-white' :
                        notification.type === 'error' ? 'bg-red-500 text-white' :
                        'bg-blue-500 text-white'
                    } transition-all duration-300`}>
                        <div className="flex items-center gap-2">
                            {notification.type === 'success' && <window.Icons.CheckCircle className="w-5 h-5" />}
                            {notification.type === 'warning' && <window.Icons.AlertCircle className="w-5 h-5" />}
                            {notification.type === 'error' && <window.Icons.XCircle className="w-5 h-5" />}
                            <span className="text-sm">{notification.message}</span>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {window.AppConfig.APP_NAME}
                            </h1>
                            <p className="text-gray-600">
                                Registro de alterações e validações - {window.AppConfig.COMPANY_NAME}
                            </p>
                        </div>
                        
                        {/* Status e controles */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                {isOnline ? (
                                    <div className="flex items-center gap-1 text-green-600">
                                        <window.Icons.Wifi className="w-4 h-4" />
                                        <span>Online</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-red-600">
                                        <window.Icons.WifiOff className="w-4 h-4" />
                                        <span>Offline</span>
                                    </div>
                                )}
                                {lastSync && (
                                    <span className="text-gray-500 hidden sm:inline">
                                        Sync: {lastSync}
                                    </span>
                                )}
                            </div>
                            
                            <button
                                onClick={fetchLogs}
                                disabled={isLoading}
                                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                <window.Icons.RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">Atualizar</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtro AdOps */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-4">
                        <window.Icons.User className="w-5 h-5 text-gray-500" />
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Filtrar por AdOps (filtro local)
                            </label>
                            <input
                                type="text"
                                placeholder="Digite seu nome para ver apenas seus logs..."
                                value={currentAdOps}
                                onChange={(e) => setCurrentAdOps(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        {currentAdOps && (
                            <button
                                onClick={() => setCurrentAdOps('')}
                                className="text-red-500 hover:text-red-700 text-sm whitespace-nowrap"
                            >
                                Limpar filtro
                            </button>
                        )}
                    </div>
                </div>

                {/* Dashboard de progresso */}
                <div className="mb-6 bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">
                        Progresso dos Testes {currentAdOps && `- ${currentAdOps}`}
                    </h3>
                    
                    {/* Barras de progresso */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Testes Completados</span>
                                <span>{stats.completed}/{stats.total} ({progressPercentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Testes Analisados</span>
                                <span>{stats.analyzed}/{stats.total} ({analyzedPercentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${analyzedPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cards de estatísticas */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
                            <div className="text-sm text-gray-600">Em Progresso</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                            <div className="text-sm text-gray-600">Completados</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.analyzed}</div>
                            <div className="text-sm text-gray-600">Analisados</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
                            <div className="text-sm text-gray-600">Bloqueados</div>
                        </div>
                    </div>
                </div>

                {/* Barra de ações */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <window.Icons.Plus className="w-5 h-5" />
                        Novo Log
                    </button>

                    <div className="flex flex-1 gap-4">
                        <div className="relative flex-1">
                            <window.Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por site, alteração, país ou notas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="relative">
                            <window.Icons.Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="all">Todos Status</option>
                                {window.AppConfig.STATUS_OPTIONS.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Formulário */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingLog ? 'Editar Log' : 'Novo Log'}
                        </h2>
                        
                        <div className="space-y-4">
                            {/* Linha 1: Site e Owner */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Site *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.site}
                                        onChange={(e) => setFormData({...formData, site: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="exemplo.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <window.Icons.User className="inline w-4 h-4 mr-1" />
                                        Owner (AdOps) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.owner}
                                        onChange={(e) => setFormData({...formData, owner: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Seu nome"
                                    />
                                </div>
                            </div>

                            {/* Linha 2: País e GAM */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <window.Icons.Globe className="inline w-4 h-4 mr-1" />
                                        País
                                    </label>
                                    <select
                                        value={formData.pais}
                                        onChange={(e) => setFormData({...formData, pais: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Selecione...</option>
                                        {window.AppConfig.COUNTRIES.map(country => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Link do GAM (Google Ad Manager)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.gamLink}
                                        onChange={(e) => setFormData({...formData, gamLink: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://admanager.google.com/..."
                                    />
                                </div>
                            </div>

                            {/* Tipo de Alteração */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Alteração *
                                </label>
                                <select
                                    required
                                    value={formData.alteracoes}
                                    onChange={(e) => setFormData({...formData, alteracoes: e.target.value, alteracaoCustom: ''})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Selecione o tipo de alteração...</option>
                                    {window.AppConfig.ALTERACAO_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                    <option value="Personalizada">✏️ Personalizada (digite abaixo)</option>
                                </select>
                                
                                {formData.alteracoes === 'Personalizada' && (
                                    <div className="mt-3">
                                        <input
                                            type="text"
                                            required
                                            value={formData.alteracaoCustom}
                                            onChange={(e) => setFormData({...formData, alteracaoCustom: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Digite o tipo de alteração personalizada..."
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Linha 3: Status e Deliverable */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {window.AppConfig.STATUS_OPTIONS.map(status => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Deliverable
                                    </label>
                                    <select
                                        value={formData.deliverable}
                                        onChange={(e) => setFormData({...formData, deliverable: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {window.AppConfig.DELIVERABLE_OPTIONS.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Linha 4: Datas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <window.Icons.Calendar className="inline w-4 h-4 mr-1" />
                                        Data de Início
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <window.Icons.Calendar className="inline w-4 h-4 mr-1" />
                                        Data de Término
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Observações
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    rows="3"
                                    maxLength={window.AppConfig.VALIDATION.MAX_NOTES_LENGTH}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Observações, detalhes da implementação, problemas encontrados..."
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {formData.notes.length}/{window.AppConfig.VALIDATION.MAX_NOTES_LENGTH} caracteres
                                </div>
                            </div>

                            {/* Planilha de Análise */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <window.Icons.FileText className="inline w-4 h-4 mr-1" />
                                    Planilha de Análise (Google Sheets)
                                </label>
                                <input
                                    type="url"
                                    value={formData.analysisSheet}
                                    onChange={(e) => setFormData({...formData, analysisSheet: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://docs.google.com/spreadsheets/d/..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Cole o link da planilha Google Sheets com a análise dos dados
                                </p>
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isLoading && <window.Icons.RefreshCw className="w-4 h-4 animate-spin" />}
                                    {editingLog ? 'Atualizar' : 'Salvar'} Log
                                </button>
                                <button
                                    onClick={resetForm}
                                    disabled={isLoading}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading geral */}
                {isLoading && !showForm && (
                    <div className="bg-white rounded-lg shadow p-8 mb-6">
                        <div className="flex items-center justify-center">
                            <window.Icons.RefreshCw className="w-6 h-6 animate-spin text-blue-500 mr-3" />
                            <span className="text-gray-600">Carregando dados...</span>
                        </div>
                    </div>
                )}

                {/* Lista de Logs */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {filteredLogs.length === 0 && !isLoading ? (
                        <div className="p-12 text-center">
                            <div className="text-gray-400 text-6xl mb-4">📋</div>
                            <div className="text-gray-400 text-lg mb-2">
                                {window.AppConfig.MESSAGES.NO_LOGS_FOUND}
                            </div>
                            <p className="text-gray-500">
                                {logs.length === 0 
                                    ? window.AppConfig.MESSAGES.START_FIRST_LOG
                                    : currentAdOps 
                                        ? `Nenhum log encontrado para "${currentAdOps}". Tente ajustar o filtro.`
                                        : window.AppConfig.MESSAGES.ADJUST_FILTERS
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="table-container overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Alterações
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            País
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Site
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Owner
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Datas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            GAM
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Análise
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="font-medium">{log.alteracoes}</div>
                                                {log.notes && (
                                                    <div className="text-gray-500 text-xs mt-1 truncate max-w-xs" title={log.notes}>
                                                        {log.notes}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {log.pais}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {log.site}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {log.owner}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {window.Icons.getStatusIcon(log.status)}
                                                    <span className={`px-2 py-1 text-xs rounded-full ${window.AppConfig.getStatusColor(log.status)}`}>
                                                        {window.AppConfig.getStatusConfig(log.status).label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="text-xs space-y-1">
                                                    {log.startDate && (
                                                        <div>
                                                            <span className="text-gray-500">Início:</span> {new Date(log.startDate).toLocaleDateString('pt-BR')}
                                                        </div>
                                                    )}
                                                    {log.endDate && (
                                                        <div>
                                                            <span className="text-gray-500">Fim:</span> {new Date(log.endDate).toLocaleDateString('pt-BR')}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {log.gamLink ? (
                                                    <a
                                                        href={log.gamLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2 py-1 rounded transition-colors"
                                                        title="Abrir GAM"
                                                    >
                                                        <window.Icons.Globe className="w-3 h-3" />
                                                        Ver GAM
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">Sem GAM</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {log.analysisSheet ? (
                                                    <a
                                                        href={log.analysisSheet}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-green-600 hover:text-green-800 text-xs bg-green-50 px-2 py-1 rounded transition-colors"
                                                        title="Abrir planilha de análise"
                                                    >
                                                        <window.Icons.FileText className="w-3 h-3" />
                                                        Ver Análise
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">Sem análise</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(log)}
                                                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                                                        title="Editar"
                                                    >
                                                        <window.Icons.Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(log.id)}
                                                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <window.Icons.Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>
                        {window.AppConfig.APP_NAME} v{window.AppConfig.VERSION} - 
                        {window.AppConfig.COMPANY_NAME} © 2025
                    </p>
                    {window.AppConfig.GOOGLE_SHEETS_URL && (
                        <p className="mt-1">
                            🔗 Conectado ao Google Sheets
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Tornar o componente disponível globalmente
window.AdOpsLogApp = AdOpsLogApp;