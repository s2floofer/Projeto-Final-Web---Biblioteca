// URL da API usada apenas para simular chamadas CRUD
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Chave usada no localStorage para salvar os livros localmente
const STORAGE_KEY = 'livros';

// Carrega os livros salvos no navegador ou inicia uma lista vazia
let livros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Referências aos elementos do formulário
const form = document.getElementById('livro-form');
const inputTitulo = document.getElementById('titulo');
const inputAutor = document.getElementById('autor');
const inputImagem = document.getElementById('imagem');
const inputId = document.getElementById('livroId');

// Elementos de erro dos inputs
const spanErroTitulo = document.getElementById('erro-titulo');
const spanErroImagem = document.getElementById('erro-imagem');
const listaEl = document.getElementById('livro-lista');

// ---------------- VALIDAÇÃO DE TÍTULO ----------------
function validarTitulo() {
    const titulo = inputTitulo.value.trim();

    // Se o usuário apagou tudo, não mostra erro
    if (titulo.length === 0) {
        spanErroTitulo.textContent = "";
        inputTitulo.classList.remove("input-invalido");
        return false;
    }

    // Título precisa ter pelo menos 3 caracteres
    if (titulo.length < 3) {
        spanErroTitulo.textContent = "O título deve ter no mínimo 3 caracteres.";
        inputTitulo.classList.add("input-invalido");
        return false;
    }

    // Título válido → remove erro
    spanErroTitulo.textContent = "";
    inputTitulo.classList.remove("input-invalido");
    return true;
}

// Validação automática enquanto digita
inputTitulo.addEventListener("input", validarTitulo);

// ---------------- VALIDAÇÃO DO AUTOR ----------------

// Cria dinamicamente o span de erro para o autor
const erroAutor = document.createElement("span");
erroAutor.classList.add("erro");
inputAutor.insertAdjacentElement("afterend", erroAutor);

function validarAutor() {
    // Autor não pode ser vazio
    if (inputAutor.value.trim() === "") {
        erroAutor.textContent = "O autor não pode estar vazio.";
        inputAutor.classList.add("input-invalido");
        return false;
    }

    // Autor válido
    erroAutor.textContent = "";
    inputAutor.classList.remove("input-invalido");
    return true;
}

// Validação automática
inputAutor.addEventListener("input", validarAutor);

// ---------------- VALIDAÇÃO DA URL DA IMAGEM ----------------
function validarURL() {
    const url = inputImagem.value.trim();

    // Se preenchida, tem que começar com http
    if (url !== "" && !url.startsWith("http")) {
        spanErroImagem.textContent = "A URL precisa começar com http.";
        inputImagem.classList.add("input-invalido");
        return false;
    }

    // URL válida
    spanErroImagem.textContent = "";
    inputImagem.classList.remove("input-invalido");
    return true;
}

inputImagem.addEventListener("input", validarURL);

// ---------------- SALVAMENTO NO LOCALSTORAGE ----------------
function salvarLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(livros));
}

// ---------------- CRIA O ITEM VISUAL NA LISTA ----------------
function criarItemLista(livro) {
    const li = document.createElement('li');
    li.className = 'livro-item';

    // Conteúdo visual de cada item
    li.innerHTML = `
        <img src="${livro.imagem || 'https://via.placeholder.com/80'}" width="50">
        <strong>${livro.titulo}</strong> — ${livro.autor}
    `;

    // Caixa para os botões de editar e excluir
    const acoes = document.createElement('div');
    acoes.style.display = "flex";
    acoes.style.gap = "8px";

    // BOTÃO EDITAR
    const btnEditar = document.createElement('button');
    btnEditar.textContent = "Editar";
    btnEditar.onclick = () => preencherFormularioParaEdicao(livro.id);

    // BOTÃO EXCLUIR
    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = "Excluir";
    btnExcluir.onclick = () => excluirLivro(livro.id);

    // Adiciona botões ao item
    acoes.appendChild(btnEditar);
    acoes.appendChild(btnExcluir);
    li.appendChild(acoes);

    return li;
}

// ---------------- RENDERIZA A LISTA NA TELA ----------------
function renderizar() {
    listaEl.innerHTML = "";

    // Caso não existam livros cadastrados
    if (livros.length === 0) {
        listaEl.innerHTML = "<li>Nenhum livro cadastrado.</li>";
        return;
    }

    // Adiciona cada livro na tela
    livros.forEach(livro => listaEl.appendChild(criarItemLista(livro)));
}

// ---------------- CARREGA DADOS NO FORM PARA EDITAR ----------------
function preencherFormularioParaEdicao(id) {
    const livro = livros.find(l => l.id === id);
    if (!livro) return;

    inputId.value = livro.id;
    inputTitulo.value = livro.titulo;
    inputAutor.value = livro.autor;
    inputImagem.value = livro.imagem || "";
}

// ---------------- ADICIONAR NOVO LIVRO ----------------
async function adicionarLivro(titulo, autor, imagem) {
    const novo = {
        id: Date.now(), // Gera ID único
        titulo,
        autor,
        imagem: imagem || "https://via.placeholder.com/150"
    };

    livros.push(novo);
    salvarLocal();
    renderizar();

    // Envia para API falsa (não salva de verdade)
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ title: titulo, body: autor })
        });
    } catch {}
}

// ---------------- ATUALIZAR LIVRO EXISTENTE ----------------
async function atualizarLivro(id, titulo, autor, imagem) {
    const idx = livros.findIndex(l => l.id == id);
    if (idx === -1) return;

    livros[idx].titulo = titulo;
    livros[idx].autor = autor;
    livros[idx].imagem = imagem || livros[idx].imagem;

    salvarLocal();
    renderizar();

    // Envio para API falsa
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ title: titulo, body: autor })
        });
    } catch {}
}

// ---------------- EXCLUIR LIVRO ----------------
async function excluirLivro(id) {
    if (!confirm("Excluir livro?")) return;

    livros = livros.filter(l => l.id !== id); // Remove o livro
    salvarLocal();
    renderizar();

    // Requisição DELETE para API falsa
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    } catch {}
}

// ---------------- SUBMISSÃO DO FORMULÁRIO ----------------
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Impede recarregar página

    const tituloValido = validarTitulo();
    const autorValido = validarAutor();
    const urlValida = validarURL();

    // Só permite salvar se todos os campos forem válidos
    if (!tituloValido || !autorValido || !urlValida) return;

    const titulo = inputTitulo.value.trim();
    const autor = inputAutor.value.trim();
    const imagem = inputImagem.value.trim();
    const id = inputId.value;

    // Se houver ID → estamos editando
    if (id) {
        atualizarLivro(id, titulo, autor, imagem);
    } else {
        adicionarLivro(titulo, autor, imagem);
    }

    // Reseta o formulário
    form.reset();
    inputId.value = "";
});

// Renderiza quando a página carrega
document.addEventListener("DOMContentLoaded", renderizar);
