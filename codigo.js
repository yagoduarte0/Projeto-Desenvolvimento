const url = "https://botafogo-atletas.mange.li/2024-1/";

// Variáveis de elementos do DOM
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

const rotaGenero = (jogadoresMasculinos, jogadorasFemininas) => {
    todos.onclick = () => {
        container.innerHTML = "";
        const todosJogadores = [...jogadoresMasculinos, ...jogadorasFemininas];
        mostrarJogadores(todosJogadores);
    };

    masculino.onclick = () => {
        container.innerHTML = "";
        mostrarJogadores(jogadoresMasculinos);
    };

    feminino.onclick = () => {
        container.innerHTML = "";
        mostrarJogadores(jogadorasFemininas);
    };
};

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

const manipulaBotao = () => {
    const texto = document.getElementById("senha").value;

    if (hex_md5(texto) === "841775103f2d2eb0e244728e8efa7905") {
        localStorage.setItem("logado", "sim");
        verificaLogin();
    } else {
        alert("Senha Incorreta!");
    }
};

document.getElementById("logout").onclick = () => {
    localStorage.removeItem("logado");
    window.location.reload();
};

document.addEventListener("DOMContentLoaded", async () => {
    verificaLogin();

    try {
        const jogadoresMasculinos = await pega_json(`${url}masculino`);
        const jogadorasFemininas = await pega_json(`${url}feminino`);

        mostrarJogadores([...jogadoresMasculinos, ...jogadorasFemininas]);
        pesquisaJogadores([...jogadoresMasculinos, ...jogadorasFemininas]);

        rotaGenero(jogadoresMasculinos, jogadorasFemininas);

    } catch (err) {
        console.error("Erro ao carregar jogadores:", err);
    }
});

document.getElementById("botao").onclick = manipulaBotao;
