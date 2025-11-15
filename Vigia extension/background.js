const API_URL = "http://ec2-54-205-5-10.compute-1.amazonaws.com:8080/check-url";

console.log("--- SCRIPT DE BACKGROUND DO VIGIA CARREGADO (v5) ---");

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    console.log(`VigIA (Limpeza): A aba ${tabId} está a carregar. A limpar dados antigos.`);
    chrome.storage.local.remove(String(tabId));
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHECK_PAGE_CONTENT") {
    
    
    const tabId = message.tabId || (sender.tab ? sender.tab.id : null);

    
    if (!tabId) {
      console.error("VigIA: Não foi possível obter o tabId.");
      if (sendResponse) {
          sendResponse({ type: "ERROR", error: "ID da aba não encontrado" });
      }
      return true; 
    }
    
    
    checkApi(message.domain, message.title, tabId, sendResponse);
    return true; 
  }
});


async function checkApi(domain, title, tabId, sendResponse) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: domain, title: title }) 
    });

    if (!response.ok) { 
      throw new Error(`O servidor respondeu com o status: ${response.status}`);
    }

    const data = await response.json(); 
    console.log("VigIA: Resposta da API recebida:", data);

    
    data.domain_checked = domain;

    
    chrome.storage.local.set({ [tabId]: data });

    
    if (sendResponse) {
      sendResponse({ type: "CHECK_RESULT", data: data });
    }
    
    mudarIcone('contexto', tabId);

  } catch (error) {
    console.error("Erro ao contatar o VigIA API:", error.message);
    
    
    
    if (sendResponse) {
      sendResponse({ type: "ERROR", error: error.message });
    }
    
    mudarIcone('erro', tabId); 
    chrome.storage.local.remove(String(tabId));
  }
}


function mudarIcone(status, tabId) {
  
}

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(String(tabId));
});