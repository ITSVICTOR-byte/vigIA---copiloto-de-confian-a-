// Lógica da Demo (copiada do index.html original)

const scenarios = {
    safe: {
        url: 'https://exame.com/pop/qual-e-a-ordem-cronologica...',
        contentText: "Artigo: 'Qual é a ordem cronológica da franquia 'Predador'?'",
        popup: {
            status: 'status-seguro',
            message: 'Não foram encontrados indícios de golpe ou desinformação.',
            showCard: false
        },
        buttonId: 'btn-safe'
    },
    context: {
        url: 'https://exame.com/brasil/bets-deveriam-pagar-imposto...',
        contentText: "Artigo: 'Bets deveriam pagar imposto de 27,5%, diz Tebet'",
        popup: {
            status: 'status-alerta',
            message: 'Verificação limpa. Veja o contexto.',
            showCard: true,
            cardTitle: 'Notícia Complementar',
            cardText: 'Sugerimos a seguinte notícia para complementar sua compreensão:',
            linkText: 'Enem 2025: veja prazo para pedir isenção | CNN Brasil',
            linkHref: '#'
        },
        buttonId: 'btn-context'
    },
    phishing: {
        url: 'https://suplement.premium.myshopify.com/growth...',
        contentText: "Loja Falsa: 'Growth Supplements' (em plataforma Shopify)",
        popup: {
            status: 'status-perigo',
            message: 'PERIGO: Este site NÃO é o Growth!',
            showCard: true,
            cardTitle: 'Alerta de Phishing',
            cardText: 'Cuidado! Este site (suplement.premium.myshopify.com) tenta se passar pelo Growth. O link oficial é:',
            linkText: 'https://growthsupplements.com.br',
            linkHref: '#'
        },
        buttonId: 'btn-phishing'
    }
};

let currentScenario = 'safe';
const popupEl = document.getElementById('vigia-popup');
// --- !! MUDANÇA (v-tradicional-v2) !! ---
// Obtém a barra do browser para ancorar o popup
const browserBar = document.querySelector('.browser-bar'); 

function changeScenario(scenarioName) {
    currentScenario = scenarioName;
    const scenario = scenarios[scenarioName];

    // Atualiza o "browser"
    document.getElementById('fake-url').textContent = scenario.url;
    document.getElementById('fake-content-text').textContent = scenario.contentText;
    
    // Atualiza os botões
    ['safe', 'context', 'phishing'].forEach(id => {
        const btn = document.getElementById(`btn-${id}`);
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(scenario.buttonId);
    activeBtn.classList.add('active');

    // Esconde o popup
    popupEl.style.display = 'none';
}

function togglePopup() {
    if (popupEl.style.display === 'block') {
        popupEl.style.display = 'none';
        return;
    }

    // Preenche o popup com os dados do cenário atual
    const scenario = scenarios[currentScenario];
    const data = scenario.popup;

    document.getElementById('status-indicator').className = ''; // Limpa classes
    document.getElementById('status-indicator').classList.add(data.status);
    document.getElementById('main-message').textContent = data.message;
    
    const card = document.getElementById('verificacao-card');
    if (data.showCard) {
        card.style.display = 'block';
        document.getElementById('verificacao-titulo').textContent = data.cardTitle;
        document.getElementById('verificacao-fonte-texto').textContent = data.cardText;
        document.getElementById('verificacao-link').textContent = data.linkText;
        document.getElementById('verificacao-link').href = data.linkHref;
    } else {
        card.style.display = 'none';
    }

    // --- !! CORREÇÃO DE POSIÇÃO !! ---
    // A lógica de posicionamento complexa foi removida.
    // O CSS (position: absolute, top: 110%, right: 1rem)
    // agora cuida de ancorar o popup na .browser-bar
    // (que está com position: relative).
    
    popupEl.style.display = 'block';
}

// Inicia o primeiro cenário
document.addEventListener('DOMContentLoaded', () => {
    changeScenario('safe');

    // Fecha o popup se clicar fora dele
    document.addEventListener('click', function(event) {
        const iconBtn = document.querySelector('button[title="Testar o VigIA"]');
        // Se o clique não foi no popup E não foi no ícone
        if (popupEl.style.display === 'block' && !popupEl.contains(event.target) && !iconBtn.contains(event.target)) {
            popupEl.style.display = 'none';
        }
    });

    // Atualiza os links do GitHub (exemplo)
    const githubUrl = "https://github.com/SEU_USUARIO/SEU_REPOSITORIO"; // <-- MUDE AQUI
    document.getElementById('github-link-nav').href = githubUrl;
    document.getElementById('github-link-hero').href = githubUrl;
    document.querySelector('a[href="[LINK_PARA_SEU_GITHUB_AQUI]"]').href = githubUrl;
});