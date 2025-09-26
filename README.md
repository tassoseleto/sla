# Sistema de Logs AdOps - Adseleto

Sistema completo para gerenciamento de logs e acompanhamento de alterações para equipe AdOps da Adseleto.

## 🚀 Features

- ✅ **Interface moderna e responsiva** com Tailwind CSS
- ✅ **Integração com Google Sheets** para armazenamento colaborativo
- ✅ **Filtros personalizados** por AdOps (local)
- ✅ **Dashboard de progresso** com barras e estatísticas
- ✅ **Sistema offline-first** com cache local
- ✅ **Links diretos para GAM e planilhas de análise**
- ✅ **Notificações em tempo real**
- ✅ **Validação de formulários**

## 🏗️ Estrutura do Projeto

```
📁 sistema-adops/
├── index.html              # Arquivo principal
├── utils/
│   └── config.js          # Configurações da aplicação
├── components/
│   ├── icons.js           # Componentes de ícones SVG
│   └── AdOpsApp.js        # Componente principal React
├── services/
│   └── sheetsService.js   # Serviço Google Sheets
├── sw.js                  # Service Worker (cache)
└── README.md             # Esta documentação
```

## 🔧 Configuração

### 1. Google Apps Script

1. Acesse [script.google.com](https://script.google.com)
2. Crie um novo projeto
3. Cole o código abaixo:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'add') {
      sheet.appendRow([
        data.id || Date.now(),
        data.createdAt || new Date().toLocaleString('pt-BR'),
        data.alteracoes || '',
        data.pais || '',
        data.site || '',
        data.owner || '',
        data.status || '',
        data.startDate || '',
        data.endDate || '',
        data.deliverable || '',
        data.notes || '',
        data.analysisSheet || '',
        data.gamLink || ''
      ]);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const result = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        const key = header.toLowerCase().replace(/[^a-z0-9]/g, '');
        obj[key] = row[index] || '';
      });
      return obj;
    }).filter(row => row.site);
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. **Deploy** como Web App:
   - Execute como: **Você**
   - Quem tem acesso: **Qualquer pessoa**

### 2. Google Sheets

Crie uma planilha com os seguintes cabeçalhos na primeira linha:

```
ID | Data/Hora | Alterações | País | Site | Owner | Status | Start Date | End Date | Deliverable | Notes | Analysis Sheet | GAM Link
```

### 3. Configurar URL

Edite o arquivo `utils/config.js` e substitua a URL:

```javascript
GOOGLE_SHEETS_URL: 'SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI'
```

## 🌐 Deploy no GitHub Pages

### 1. Criar Repositório

1. Acesse [github.com](https://github.com)
2. Clique em **New repository**
3. Nome: `sistema-adops` (ou qualquer nome)
4. ✅ Public
5. ✅ Add README
6. Clique **Create repository**

### 2. Adicionar Arquivos

Faça upload de todos os arquivos:
- `index.html`
- `utils/config.js`
- `components/icons.js`
- `components/AdOpsApp.js`
- `services/sheetsService.js`
- `README.md`

### 3. Ativar Pages

1. Vá em **Settings** do repositório
2. Scroll até **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main**
5. Folder: **/ (root)**
6. Clique **Save**

### 4. Acessar

Após alguns minutos: `https://seuusuario.github.io/sistema-adops`

## 📱 Funcionalidades

### Dashboard de Progresso
- Barras de progresso para testes completados e analisados
- Cards com estatísticas em tempo real
- Filtro individual por AdOps

### Formulário Inteligente
- Validação em tempo real
- Tipos de alteração em português
- Campo personalizado para novos tipos
- Links para GAM e planilhas de análise

### Sistema Offline
- Cache local automático
- Sincronização quando voltar online
- Notificações de status da conexão

### Filtros e Busca
- Busca por site, alteração, país ou notas
- Filtros por status
- Filtro individual por AdOps (local)

## 🛠️ Tecnologias

- **React 18** - Interface dinâmica
- **Tailwind CSS** - Estilização moderna
- **Google Sheets** - Banco de dados colaborativo
- **Google Apps Script** - API backend
- **GitHub Pages** - Hospedagem gratuita
- **LocalStorage** - Cache offline

## 🔧 Personalização

### Adicionar Novos Países

Edite `utils/config.js`:

```javascript
COUNTRIES: [
    'Brasil',
    'EUA',
    'Seu País Aqui'
]
```

### Adicionar Novos Status

```javascript
STATUS_OPTIONS: [
    { value: 'novo_status', label: 'Novo Status', color: 'purple' }
]
```

### Modificar Tipos de Alteração

```javascript
ALTERACAO_TYPES: [
    'Bloqueio de Criativos',
    'Sua Nova Alteração'
]
```

## 📊 Monitoramento

O sistema inclui:
- Console logs para debug
- Contadores de performance
- Status de conexão em tempo real
- Notificações de erro/sucesso

## 🆘 Solução de Problemas

### Erro de CORS
- Verifique se o Apps Script foi deployado como "Qualquer pessoa"
- Redeploye o script se necessário

### Dados não aparecem
- Confira se a URL está correta em `config.js`
- Verifique se os cabeçalhos da planilha estão corretos
- Abra o console do navegador para ver erros

### Modo offline
- O sistema funciona offline salvando no localStorage
- Dados serão sincronizados quando a conexão voltar

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

MIT License - veja arquivo LICENSE para detalhes.

## 📧 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato com a equipe AdOps da Adseleto.

---

**Sistema AdOps v1.0.0** - Desenvolvido para Adseleto © 2025