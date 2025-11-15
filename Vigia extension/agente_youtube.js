console.log("Agente 'VigIA' (YouTube) injetado (v5).");


document.addEventListener('yt-navigate-finish', (e) => {
  console.log("VigIA: Navegação do YouTube detetada. A procurar local de injeção...");

  setTimeout(tentarInjecao, 1000);
});


setTimeout(tentarInjecao, 1500); 


function tentarInjecao() {
  const infoBlock = document.querySelector(".style-scope.ytd-watch-metadata");

  if (infoBlock) {
   
    const botaoAntigo = infoBlock.querySelector('.vigia-botao-youtube');
    if (botaoAntigo) {
      console.log("VigIA: A remover botão antigo...");
      botaoAntigo.remove();
    }
   

    
    console.log("VigIA: Seletor encontrado! A injetar novo botão.");
    injetarBotao(infoBlock);

  } else {
    console.log("VigIA: Seletor '.style-scope.ytd-watch-metadata' não encontrado.");
  }
}


function injetarBotao(targetBlock) {
  const botaoVigia = document.createElement('button');
  botaoVigia.innerHTML = "Verificar com o VigIA 🛡️";
  botaoVigia.className = "vigia-botao-youtube";
  botaoVigia.style.cssText = `
    background-color: #f0f8ff;
    border: 1px solid #007bff;
    color: #0056b3;
    font-weight: bold;
    font-size: 13px;
    padding: 8px 12px;
    margin-top: 10px;
    cursor: pointer;
    border-radius: 8px;
  `;
  botaoVigia.onmouseover = () => { botaoVigia.style.backgroundColor = '#e6f3ff'; };
  botaoVigia.onmouseout = () => { botaoVigia.style.backgroundColor = '#f0f8ff'; };

  botaoVigia.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    lidarComVerificacao(botaoVigia);
  });
  targetBlock.appendChild(botaoVigia);
}

function lidarComVerificacao(botao) {
  botao.textContent = "Verificando... ⏳";
  botao.disabled = true;

  const titulo = document.querySelector('h1.ytd-video-primary-info-renderer').textContent;
  const descricaoEl = document.querySelector('yt-formatted-string#description-inline-expander');
  const descricao = descricaoEl ? descricaoEl.textContent : '';
  const textoDoVideo = titulo + " " + descricao; 
  const dominio = window.location.hostname;

  console.log(`VigIA: A enviar para o background: "${titulo}"`);

  chrome.runtime.sendMessage(
    {
      type: "CHECK_PAGE_CONTENT",
      title: textoDoVideo,
      domain: dominio
    },
    (msg) => {
      if (msg && msg.type === "CHECK_RESULT") {
        const { data } = msg;
        if (data.verificacao_cruzada && data.verificacao_cruzada.encontrado) {
          botao.innerHTML = `🟡 CHECAGEM ENCONTRADA: ${data.verificacao_cruzada.fonte_checagem}`;
          botao.style.cssText += `background-color: #fcf8e3; border-color: #f0ad4e; color: #8a6d3b;`;
        } else {
          botao.innerHTML = "✅ VigIA: Nenhuma checagem encontrada.";
          botao.style.cssText += `background-color: #e6ffed; border-color: #5cb85c; color: #3d8b3d;`;
        }
      } else {
        console.error("VigIA Agente: O background falhou ou não respondeu.", msg);
        botao.innerHTML = "❌ Erro ao verificar.";
        botao.style.cssText += `background-color: #fce4e4; border-color: #d32f2f; color: #b71c1c;`;
        botao.disabled = false;
      }
    }
  );
}