  Projeto VigIA - Seu Copiloto de Confiança

O VigIA é uma extensão de navegador (Chrome) de prova de conceito, desenhada para atuar como um "copiloto" de confiança para o utilizador. Ele combate ativamente a desinformação e golpes de phishing de duas maneiras:

Modo Passivo (Sites de Notícias): Ao navegar em artigos, o VigIA analisa a reputação da fonte, o título e cruza a informação com motores de busca de checagem (o "Detetive") e de contexto (o "Drone"), apresentando um relatório de confiança.

Modo Ativo (YouTube): Injeta um botão diretamente na interface do YouTube, permitindo uma verificação sob demanda do conteúdo do vídeo.

Este projeto demonstra uma arquitetura full-stack, combinando uma extensão de frontend com um backend de análise robusto.

🚀 Demo Interativa (Sem Custo de API)

Para proteger a chave de API (que tem um limite de 100 pesquisas/dia), criei uma simulação interativa que demonstra 100% da funcionalidade do VigIA sem custos.

Clique aqui para testar a Landing Page e a Demo Interativa

(Instrução para si: Faça o upload deste index.html juntamente com o seu LEIA-ME.md para o seu site de portfólio ou GitHub Pages.)

🛠️ Arquitetura do Projeto

O VigIA é composto por três partes principais:

A Extensão (Frontend):

Construída com JavaScript, HTML e CSS.

popup.js: Controla a interface do popup.

background.js: Ouve os eventos e comunica com o backend.

agente_youtube.js: O content script injetado no YouTube.

O Cérebro (Backend):

Um servidor Python (Flask) a rodar numa instância AWS EC2.

app.py: O endpoint da API (/check-url) que recebe o título e o domínio da extensão.

vigia.db: Uma base de dados SQLite que armazena a reputação de fontes (Mídia Confiável, Desinformação, etc.) e listas de bloqueio.

Os "Detetives" (APIs Externas):

Google Programmable Search API (x2):

CSE_ID_CHECAGEM ("Detetive"): Pesquisa apenas em sites de fact-checking (Lupa, Aos Fatos).

CSE_ID_NOTICIAS ("Drone"): Pesquisa em sites de mídia global (G1, CNN, BBC, Forbes) para dar contexto.

Google Safe Browsing API: Verifica se o domínio está em listas de malware/phishing.

👨‍💻 Para Recrutadores e Testes Avançados

Se desejar testar a extensão "ao vivo" (e não apenas a demo), pode clonar o repositório completo e instalá-la localmente.

Link do Repositório: https://vigia-vosa-project.netlify.app/

Aviso de API: A API pública (no meu servidor EC2) tem um limite de 100 pesquisas/dia e pode estar offline ou no limite. Para testes reais, é recomendado que siga as instruções no repositório para configurar o seu próprio servidor app.py com as suas próprias chaves de API do Google.
