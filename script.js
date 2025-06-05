/**
 * Jogo da Velha Avançado
 * Lógica do Jogo, Interface e Inteligência Artificial
 *
 * Desenvolvido por: Aliana Moraes
 */
document.addEventListener('DOMContentLoaded', () => {
    // Mapeamento dos elementos do DOM
    const tabuleiroEl = document.getElementById('tabuleiro');
    const statusAreaEl = document.getElementById('statusArea');
    const botaoReiniciarEl = document.getElementById('botaoReiniciar');
    const botaoZerarPlacarEl = document.getElementById('botaoZerarPlacar');
    const placarXEl = document.getElementById('placarX');
    const placarOEl = document.getElementById('placarO');
    const linhaVencedoraSvgEl = document.getElementById('linhaVencedoraSvg'); 
    const botaoModoPvP = document.getElementById('modoPvP');
    const botaoModoPvIA = document.getElementById('modoPvIA');

    // Validação inicial para garantir que a interface carregou corretamente
    if (!tabuleiroEl || !linhaVencedoraSvgEl || !statusAreaEl || !placarXEl || !placarOEl) {
        console.error("Erro: Um ou mais elementos essenciais do DOM não foram encontrados. Verifique os IDs no HTML.");
        return; // Interrompe a execução se elementos cruciais faltarem
    }

    // Constantes e estado inicial do jogo
    const JOGADOR_X = 'X';
    const JOGADOR_O = 'O';
    const CONDICOES_VITORIA = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]            
    ];

    let estadoTabuleiro = Array(9).fill("");
    let jogadorAtual = JOGADOR_X;
    let jogoAtivo = true;
    let placarX = 0;
    let placarO = 0;
    let modoDeJogo = 'PvIA'; 
    let nomeJogadorOAtual = "Computador O";
    let celulasEl = [];

    // --- INICIALIZAÇÃO E GERENCIAMENTO DE MODO ---

    function criarTabuleiro() {
        // Remove as células antigas para recriar o tabuleiro do zero
        const celulasAntigas = tabuleiroEl.querySelectorAll('.celula');
        celulasAntigas.forEach(celula => celula.remove());

        celulasEl = []; // Reseta o array de referência das células
        limparLinhaVencedora();

        for (let i = 0; i < 9; i++) {
            const celula = document.createElement('div');
            celula.classList.add('celula');
            celula.setAttribute('data-index', i);
            celula.addEventListener('click', handleCellClick);
            tabuleiroEl.appendChild(celula);
            celulasEl.push(celula);
        }
    }

    function definirModoDeJogo(novoModo) {
        modoDeJogo = novoModo;
        if (modoDeJogo === 'PvP') {
            botaoModoPvP.classList.add('ativo');
            botaoModoPvIA.classList.remove('ativo');
            nomeJogadorOAtual = "Jogador O";
        } else { 
            botaoModoPvIA.classList.add('ativo');
            botaoModoPvP.classList.remove('ativo');
            nomeJogadorOAtual = "Computador O";
        }
        placarX = 0;
        placarO = 0;
        atualizarPlacarDisplay();
        reiniciarJogoCompleto();
    }
    
    // Reinicia o jogo completamente, usado ao mudar de modo ou zerar o placar
    function reiniciarJogoCompleto() { 
        estadoTabuleiro.fill("");
        jogoAtivo = true;
        jogadorAtual = JOGADOR_X;
        limparLinhaVencedora();
        celulasEl.forEach(celula => {
            celula.textContent = '';
            celula.className = 'celula'; // Reseta todas as classes da célula
        });
        atualizarStatusDisplay();
    }

    // Reinicia apenas a rodada atual, mantendo placar e modo
    function reiniciarRodada() { 
        estadoTabuleiro.fill("");
        jogoAtivo = true;
        jogadorAtual = JOGADOR_X; 
        limparLinhaVencedora();
        celulasEl.forEach(celula => {
            celula.textContent = '';
            celula.className = 'celula';
        });
        atualizarStatusDisplay();
    }

    // --- LÓGICA PRINCIPAL DO JOGO ---
    function handleCellClick(eventoClique) {
        if (!jogoAtivo) return;

        const celulaClicada = eventoClique.target;
        const indiceCelula = parseInt(celulaClicada.getAttribute('data-index'));

        if (isNaN(indiceCelula) || estadoTabuleiro[indiceCelula] !== "") return;
        if (modoDeJogo === 'PvIA' && jogadorAtual === JOGADOR_O) return;

        processarJogada(celulaClicada, indiceCelula, jogadorAtual);

        if (jogoAtivo && modoDeJogo === 'PvIA' && jogadorAtual === JOGADOR_O) {
            setTimeout(jogadaIA, 600); 
        }
    }
    
    function processarJogada(celula, indice, jogadorQueJogou) {
        estadoTabuleiro[indice] = jogadorQueJogou;
        celula.textContent = jogadorQueJogou;
        celula.classList.add(jogadorQueJogou.toLowerCase());
        celula.classList.add('marcada');

        if (verificarVitoria(jogadorQueJogou)) {
            finalizarJogo(false, jogadorQueJogou);
        } else if (estadoTabuleiro.every(cell => cell !== "")) {
            finalizarJogo(true); // Empate
        } else {
            mudarJogador();
        }
    }

    function mudarJogador() {
        jogadorAtual = (jogadorAtual === JOGADOR_X) ? JOGADOR_O : JOGADOR_X;
        atualizarStatusDisplay();
    }

    function verificarVitoria(jogador) {
        for (const condicao of CONDICOES_VITORIA) {
            if (condicao.every(index => estadoTabuleiro[index] === jogador)) {
                destacarVitoria(condicao);
                return true;
            }
        }
        return false;
    }
    
    function finalizarJogo(empate = false, vencedor = null) {
        jogoAtivo = false;
        if (empate) {
            statusAreaEl.textContent = "O jogo empatou!";
        } else if (vencedor) {
            if (vencedor === JOGADOR_X) {
                placarX++;
            } else { 
                placarO++;
            }
            statusAreaEl.textContent = `${nomeJogadorOAtual} venceu!`;
            if (vencedor === JOGADOR_X) statusAreaEl.textContent = `Jogador X venceu!`;
            
            atualizarPlacarDisplay();
        }
    }

    // --- INTELIGÊNCIA ARTIFICIAL (IA) ---
    function jogadaIA() {
        if (!jogoAtivo || modoDeJogo !== 'PvIA' || jogadorAtual !== JOGADOR_O) return;
        
        statusAreaEl.textContent = `${nomeJogadorOAtual} está pensando...`;
        let melhorJogada = -1;

        // Estratégia: 1. Ganhar, 2. Bloquear, 3. Centro, 4. Canto, 5. Aleatório
        for (let i = 0; i < 9; i++) { // Tenta ganhar
            if (estadoTabuleiro[i] === "") {
                estadoTabuleiro[i] = JOGADOR_O;
                if (verificarVitoriaParaTeste(JOGADOR_O)) {
                    melhorJogada = i; estadoTabuleiro[i] = ""; break;
                }
                estadoTabuleiro[i] = "";
            }
        }
        if (melhorJogada === -1) { // Tenta bloquear
            for (let i = 0; i < 9; i++) {
                if (estadoTabuleiro[i] === "") {
                    estadoTabuleiro[i] = JOGADOR_X;
                    if (verificarVitoriaParaTeste(JOGADOR_X)) {
                        melhorJogada = i; estadoTabuleiro[i] = ""; break;
                    }
                    estadoTabuleiro[i] = "";
                }
            }
        }
        // Função auxiliar da IA para testar jogadas sem afetar o tabuleiro real
        function verificarVitoriaParaTeste(jogador) { 
            for (const condicao of CONDICOES_VITORIA) {
                if (condicao.every(index => estadoTabuleiro[index] === jogador)) return true;
            }
            return false;
        }
        if (melhorJogada === -1 && estadoTabuleiro[4] === "") melhorJogada = 4; // Tenta o centro
        if (melhorJogada === -1) { // Tenta um canto
            const cantos = [0, 2, 6, 8].filter(i => estadoTabuleiro[i] === "");
            if (cantos.length > 0) melhorJogada = cantos[Math.floor(Math.random() * cantos.length)];
        }
        if (melhorJogada === -1) { // Pega qualquer casa disponível
            const disponiveis = estadoTabuleiro.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
            if (disponiveis.length > 0) melhorJogada = disponiveis[Math.floor(Math.random() * disponiveis.length)];
        }
        if (melhorJogada !== -1 && celulasEl[melhorJogada]) {
            processarJogada(celulasEl[melhorJogada], melhorJogada, JOGADOR_O);
        }
    }

    // --- ATUALIZAÇÕES DE INTERFACE ---
    function atualizarPlacarDisplay() {
        placarXEl.textContent = `Jogador X: ${placarX}`;
        placarOEl.textContent = `${nomeJogadorOAtual}: ${placarO}`;
    }

    function atualizarStatusDisplay() {
        if (!jogoAtivo) return;
        if (jogadorAtual === JOGADOR_X) {
            statusAreaEl.textContent = `Vez do Jogador X`;
        } else { 
            statusAreaEl.textContent = `Vez do ${nomeJogadorOAtual}`;
        }
    }
    
    function handleZerarPlacar() {
        placarX = 0;
        placarO = 0;
        atualizarPlacarDisplay();
        reiniciarJogoCompleto(); 
    }

    // --- ANIMAÇÕES E EFEITOS VISUAIS ---
    function destacarVitoria(condicaoVencedora) {
        condicaoVencedora.forEach(index => {
            if (celulasEl[index]) {
                celulasEl[index].classList.add('vencedora');
            }
        });
        desenharLinhaVencedora(condicaoVencedora);
    }

    function limparLinhaVencedora() {
        if (linhaVencedoraSvgEl) { 
            linhaVencedoraSvgEl.innerHTML = ''; 
        }
    }
    
    function desenharLinhaVencedora(condicao) {
        if (!linhaVencedoraSvgEl) return;
        limparLinhaVencedora(); 
        
        const celulaInicio = celulasEl[condicao[0]];
        const celulaFim = celulasEl[condicao[2]];
        
        if (!celulaInicio || !celulaFim) return; 

        const cellWidth = celulaInicio.offsetWidth; 
        const cellHeight = celulaInicio.offsetHeight;
        
        const offsetX = cellWidth / 2;
        const offsetY = cellHeight / 2;

        const x1 = celulaInicio.offsetLeft + offsetX;
        const y1 = celulaInicio.offsetTop + offsetY;
        const x2 = celulaFim.offsetLeft + offsetX; 
        const y2 = celulaFim.offsetTop + offsetY;  

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1.toString()); 
        line.setAttribute("y1", y1.toString());
        line.setAttribute("x2", x2.toString()); 
        line.setAttribute("y2", y2.toString());
        
        linhaVencedoraSvgEl.appendChild(line);
    }

    // --- EVENT LISTENERS GERAIS ---
    botaoReiniciarEl.addEventListener('click', reiniciarRodada);
    botaoZerarPlacarEl.addEventListener('click', handleZerarPlacar);
    botaoModoPvP.addEventListener('click', () => definirModoDeJogo('PvP'));
    botaoModoPvIA.addEventListener('click', () => definirModoDeJogo('PvIA'));

    // --- INÍCIO DA APLICAÇÃO ---
    function iniciarAplicacao() {
        criarTabuleiro(); 
        definirModoDeJogo(modoDeJogo); 
    }

    iniciarAplicacao();
});