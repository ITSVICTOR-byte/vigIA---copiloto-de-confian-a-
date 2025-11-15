document.addEventListener('DOMContentLoaded', () => {
  
  const statusIndicatorEl = document.getElementById('status-indicator');
  const mainMessageEl = document.getElementById('main-message');
  const verificacaoCardEl = document.getElementById('verificacao-card');
  const verificacaoFonteEl = document.getElementById('verificacao-fonte-texto');
  const verificacaoLinkEl = document.getElementById('verificacao-link');
  const reputacaoCardEl = document.getElementById('reputacao-card');
  const reputacaoClassEl = document.getElementById('reputacao-classificacao');
  const reputacaoTipoEl = document.getElementById('reputacao-tipo');
  const alertasTituloCardEl = document.getElementById('alertas-titulo-card');
  const alertasListaEl = document.getElementById('alertas-lista');

 

  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0] || !tabs[0].id || !tabs[0].url) {
      mainMessageEl.textContent = 'Página não verificável';
      statusIndicatorEl.className = 'status-alerta';
      return;
    }
    
    const tab = tabs[0];
    const url = new URL(tab.url);
    const domain = url.hostname;
    const tabId = String(tab.id); 
    const title = tab.title; 

   
    if (domain.includes('youtube.com') || url.protocol.startsWith('chrome')) {
      chrome.storage.local.get([tabId], (result) => {
        if (result && result[tabId]) {
          console.log("VigIA Popup: A ler dados salvos do YouTube", result[tabId]);
          preencherPopup(result[tabId]);
        } else {
          mainMessageEl.textContent = 'Use o botão na página';
          statusIndicatorEl.className = 'status-alerta';
        }
      });
      return;
    }

   
    mainMessageEl.textContent = 'Verificando...';
    statusIndicatorEl.className = 'status-verificando';

   
    chrome.runtime.sendMessage(
      {
        type: "CHECK_PAGE_CONTENT",
        title: title,     
        domain: domain,
        tabId: tab.id 
      },
      (msg) => {
       
        if (!msg) {
          console.error("VigIA Popup: O background não respondeu.");
          mainMessageEl.textContent = 'Erro de conexão';
          statusIndicatorEl.className = 'status-perigo';
          return;
        }
        if (msg.type === "CHECK_RESULT") {
          const data = msg.data;
          console.log("VigIA Popup: A preencher com dados da API", data);
          preencherPopup(data);
        } 
        else if (msg.type === "ERROR") {
          console.error("VigIA Popup: O background falhou.", msg.error);
          mainMessageEl.textContent = 'Erro na verificação';
          statusIndicatorEl.className = 'status-perigo';
        }
      }
    );
  });

  
  function preencherPopup(data) {
    
    
    verificacaoCardEl.style.display = 'none';
    reputacaoCardEl.style.display = 'none';
    alertasTituloCardEl.style.display = 'none';

    const resultado_busca = data.verificacao_cruzada; 
   

    let statusClass = 'status-seguro';
    let statusMessage = data.mensagem; 

   
    if (data.status === 'PERIGO_GOLPE') {
      statusClass = 'status-perigo';
      statusMessage = 'Perigo: Site listado como inseguro!';
    } 
   
    
    
    else if (resultado_busca && resultado_busca.tipo_resultado === "CHECAGEM") {
      statusClass = 'status-perigo';
      statusMessage = 'Alerta: Verificação encontrada!';
    } else if (resultado_busca && resultado_busca.tipo_resultado === "CONTEXTO") {
      statusClass = 'status-alerta';
      statusMessage = 'Verificação limpa. Veja o contexto.';
    } else if (data.status === 'CONTEXTO' && data.reputacao_fonte) { 
      statusClass = 'status-alerta';
      statusMessage = 'Assunto Sensível';
    } else if (data.status === 'CONTEXTO' && data.alertas_titulo) { 
        statusClass = 'status-alerta';
        statusMessage = 'Título Sensacionalista';
    }
    
    
    statusIndicatorEl.className = statusClass;
    mainMessageEl.textContent = statusMessage;

    
    if (resultado_busca && (resultado_busca.tipo_resultado === "CHECAGEM" || resultado_busca.tipo_resultado === "CONTEXTO")) {
      verificacaoCardEl.style.display = 'block'; 
      
      if (resultado_busca.tipo_resultado === "CHECAGEM") {
        verificacaoCardEl.querySelector('strong').textContent = "Verificação Cruzada";
        verificacaoFonteEl.textContent = `A agência "${resultado_busca.fonte}" já publicou sobre este assunto.`;
      } else { 
        verificacaoCardEl.querySelector('strong').textContent = "Notícia Complementar";
        verificacaoFonteEl.textContent = `Não encontramos checagens (desmentidos), mas sugerimos a seguinte notícia para complementar sua compreensão:`;
      }
      
      verificacaoLinkEl.textContent = resultado_busca.titulo_checagem;
      verificacaoLinkEl.href = resultado_busca.link;
      verificacaoLinkEl.onclick = (e) => {
        e.preventDefault(); 
        chrome.tabs.create({ url: resultado_busca.link, active: true });
      };
    }

   
    if (data.reputacao_fonte) {
      reputacaoCardEl.style.display = 'block';
      reputacaoClassEl.textContent = data.reputacao_fonte.classificacao;
      reputacaoTipoEl.textContent = data.reputacao_fonte.tipo;
    }
    
    
    if (data.alertas_titulo && data.alertas_titulo.length > 0) {
      alertasTituloCardEl.style.display = 'block';
      alertasListaEl.innerHTML = '';
      data.alertas_titulo.forEach(alerta => {
        const li = document.createElement('li');
        li.textContent = alerta;
        alertasListaEl.appendChild(li);
      });
    }
  }
});