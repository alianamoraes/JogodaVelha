# JogodaVelha

Projeto front-end que implementa o clássico Jogo da Velha com uma interface moderna. Inclui um modo de jogo contra o computador (IA).

## 📜 Sobre o Projeto

Foi desenvolvido com HTML5, CSS3 e JavaScript puro (Vanilla JS), focando em boas práticas de desenvolvimento, como a clara separação de estrutura (HTML), estilo (CSS) e lógica (JS). O design adota uma estética de **Neumorfismo**, proporcionando uma experiência de usuário suave e moderna com animações e feedback visual claro.

## ✨ Funcionalidades Principais

* **Modos de Jogo**: 
Humano vs. Humano (PvP) e Humano vs. Computador (PvIA).

* **Inteligência Artificial (IA)**: 
O oponente do computador segue uma estratégia hierárquica para proporcionar um desafio:
    1.  Verifica se pode vencer na próxima jogada.
    2.  Verifica se precisa bloquear uma vitória iminente do jogador.
    3.  Tenta ocupar a célula central.
    4.  Tenta ocupar uma das células de canto.
    5.  Realiza uma jogada aleatória em uma célula disponível.

## 🛠️ Tecnologias Utilizadas

* ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white): Para a estrutura semântica do jogo.
* ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white): Para a estilização, utilizando `Flexbox`, `Grid Layout`, variáveis CSS para um tema consistente e animações (`@keyframes`).
* ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black): Para toda a lógica do jogo, manipulação do DOM e controle de estado.

## 🚀 Como Executar

Por ser um projeto puramente front-end, não há necessidade de um servidor ou dependências complexas.

1.  Clone ou baixe os arquivos do projeto.
2.  Certifique-se de que os arquivos `index.html`, `style.css` e `script.js` estejam na mesma pasta.
3.  Abra o arquivo `index.html` diretamente em um navegador web moderno (como Google Chrome, Mozilla Firefox ou Microsoft Edge).


* **Desenvolvido por**: Aliana Moraes