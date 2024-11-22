const url = "https://botafogo-atletas.mange.li/2024-1/masculino/";
const fem = "https://botafogo-atletas.mange.li/2024-1/feminino/";
const todes = "https://botafogo-atletas.mange.li/2024-1/all/";

const container = document.getElementById("container");
const jogadoresSection = document.getElementById("jogadores");
const loginForm = document.getElementById("login-form");
const botaoLogout = document.getElementById("logout");
const loginHeader = document.getElementById("header-login");
const loginPage = document.getElementById("login-page");
const login = document.getElementById("login");
const feminino = document.getElementById("feminino");
const masculino = document.getElementById("masculino");
const todos = document.getElementById("todos");
const inputPesquisa = document.getElementById("pesquisar");
const listaJogadores = document.getElementById("jogadores-lista");

const pega_json = async (caminho) => {
    try {
        const resposta = await fetch(caminho);
        const dados = await resposta.json();
        return dados;
    } catch (err) {
        console.error("Erro ao buscar os dados:", err);
        alert("Erro ao carregar os jogadores.");
        return [];
    }
};

const montaCard = (atleta) => {
    const cartao = document.createElement("article");
    const imagem = document.createElement("img");
    const saibaMais = document.createElement("button");
    const nome = document.createElement("h3");

    imagem.src = atleta.imagem;
    cartao.appendChild(imagem);

    nome.innerHTML = atleta.nome;
    cartao.appendChild(nome);

    saibaMais.innerHTML = "Saiba Mais";
    cartao.appendChild(saibaMais);

    cartao.onclick = manipulaClick;

    cartao.dataset.id = atleta.id;
    cartao.dataset.nJogos = atleta.n_jogos;
    cartao.dataset.altura = atleta.altura;

    return cartao;
};

const manipulaClick = (e) => {
    const id = e.currentTarget.dataset.id;
    const url = `detalhes.html?id=${id}`;

    document.cookie = `id=${id}`;
    document.cookie = `altura=${e.currentTarget.dataset.altura}`;

    localStorage.setItem("id", id);
    localStorage.setItem("dados", JSON.stringify(e.currentTarget.dataset));

    sessionStorage.setItem("id", id);
    sessionStorage.setItem("dados", JSON.stringify(e.currentTarget.dataset));

    window.location = url;
};

const mostrarJogadores = (jogadores) => {
    container.innerHTML = '';
    jogadores.forEach((jogador) => container.appendChild(montaCard(jogador)));
};

const filtrarJogadores = (termo, jogadores) => {
    return jogadores.filter((jogador) =>
        jogador.nome.toLowerCase().includes(termo.toLowerCase())
    );
};

const pesquisaJogadores = (todosJogadores) => {
    inputPesquisa.addEventListener("input", () => {
        const termo = inputPesquisa.value.trim();
        if (termo) {
            const jogadoresFiltrados = filtrarJogadores(termo, todosJogadores);
            if (jogadoresFiltrados.length > 0) {
                mostrarJogadores(jogadoresFiltrados);
            } else {
                container.innerHTML = '<p>Nenhum jogador encontrado.</p>';
            }
        } else {
            mostrarJogadores(todosJogadores);
        }
    });
};

const rotaGenero = () => {
    // Configurando botão de elenco completo
    todos.onclick = async () => {
        try {
            const todosJogadores = await pega_json(todes);
            mostrarJogadores(todosJogadores);
        } catch (err) {
            console.error("Erro ao carregar todos os jogadores:", err);
            container.innerHTML = '<p>Erro ao carregar jogadores.</p>';
        }
    };

    // Configurando botão de jogadores masculinos
    masculino.onclick = async () => {
        try {
            const jogadoresMasculinos = await pega_json(url);
            mostrarJogadores(jogadoresMasculinos);
        } catch (err) {
            console.error("Erro ao carregar jogadores masculinos:", err);
            container.innerHTML = '<p>Erro ao carregar jogadores masculinos.</p>';
        }
    };

    // Configurando botão de jogadoras femininas
    feminino.onclick = async () => {
        try {
            const jogadorasFemininas = await pega_json(fem);
            mostrarJogadores(jogadorasFemininas);
        } catch (err) {
            console.error("Erro ao carregar jogadoras femininas:", err);
            container.innerHTML = '<p>Erro ao carregar jogadoras femininas.</p>';
        }
    };
};

const carregarPorDropdown = async (event) => {
    const valorSelecionado = event.target.value;

    try {
        if (valorSelecionado === "todos") {
            const todosJogadores = await pega_json(todes);
            mostrarJogadores(todosJogadores);
        } else if (valorSelecionado === "masculino") {
            const jogadoresMasculinos = await pega_json(url);
            mostrarJogadores(jogadoresMasculinos);
        } else if (valorSelecionado === "feminino") {
            const jogadorasFemininas = await pega_json(fem);
            mostrarJogadores(jogadorasFemininas);
        }
    } catch (err) {
        console.error(`Erro ao carregar jogadores (${valorSelecionado}):`, err);
        container.innerHTML = '<p>Erro ao carregar jogadores.</p>';
    }
};
document.getElementById("menu-dropdown").addEventListener("change", carregarPorDropdown);

const verificaLogin = () => {
    const logado = localStorage.getItem("logado");

    if (logado === "sim") {
        loginForm.style.display = "none";
        jogadoresSection.style.display = "block";
        botaoLogout.style.display = "block";
        loginHeader.style.display = "block";
        loginPage.style.display = "none";
        login.style.display = "none";

        container.innerHTML = "";
    } else {
        loginForm.style.display = "block";
        jogadoresSection.style.display = "none";
        botaoLogout.style.display = "none";
        loginHeader.style.display = "none";
    }
};

const gerarHashSHA256 = async (texto) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(texto);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    return hashHex;
};

const manipulaBotao = async () => {
    const texto = document.getElementById("senha").value;

    const hash = await gerarHashSHA256(texto);

    if (hash === "d823c845c2362679c4bfe95ba033312525732a94bfd34ccfd179d7abae42d9b8") {
        localStorage.setItem("logado", "sim");
        verificaLogin();
    } else {
        alert("Senha Incorreta!");
    }
};

document.getElementById("botao").onclick = manipulaBotao;


document.getElementById("logout").onclick = () => {
    localStorage.removeItem("logado");
    window.location.reload();
};

document.addEventListener("DOMContentLoaded", async () => {
    verificaLogin();

    try {
        const todosJogadores = await pega_json(todes);

        mostrarJogadores(todosJogadores);

        rotaGenero();
    } catch (err) {
        console.error("Erro ao carregar jogadores:", err);
    }
});


document.getElementById("botao").onclick = manipulaBotao;