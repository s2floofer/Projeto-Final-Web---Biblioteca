// CRUD (simulação JSONPlaceholder)
const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const STORAGE_KEY = 'livros';

// Estado local
let livros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// DOM
const form = document.getElementById('livro-form');
const inputTitulo = document.getElementById('titulo');
const inputAutor = document.getElementById('autor');
const inputImagem = document.getElementById('imagem');
const inputId = document.getElementById('livroId');

const spanErroTitulo = document.getElementById('erro-titulo');
const spanErroImagem = document.getElementById('erro-imagem');
const listaEl = document.getElementById('livro-lista');

// ----------------------
// 🔹 Validação do TÍTULO
// ----------------------
function validarTitulo() {
    const titulo = inputTitulo.value.trim();

    if (titulo.length === 0) {
        spanErroTitulo.textContent = "";
        inputTitulo.classList.remove("input-invalido");
        return false;
    }

    if (titulo.length < 3) {
        spanErroTitulo.textContent = "O título deve ter no mínimo 3 caracteres.";
        inputTitulo.classList.add("input-invalido");
        return false;
    }

    spanErroTitulo.textContent = "";
    inputTitulo.classList.remove("input-invalido");
    return true;
}

inputTitulo.addEventListener("input", validarTitulo);

// ----------------------
// 🔹 Validação do AUTOR
// ----------------------
const erroAutor = document.createElement("span");
erroAutor.classList.add("erro");
inputAutor.insertAdjacentElement("afterend", erroAutor);

function validarAutor() {
    if (inputAutor.value.trim() === "") {
        erroAutor.textContent = "O autor não pode estar vazio.";
        inputAutor.classList.add("input-invalido");
        return false;
    }

    erroAutor.textContent = "";
    inputAutor.classList.remove("input-invalido");
    return true;
}

inputAutor.addEventListener("input", validarAutor);

// ----------------------
// 🔹 Validação da URL
// ----------------------
function validarURL() {
    const url = inputImagem.value.trim();

    if (url !== "" && !url.startsWith("http")) {
        spanErroImagem.textContent = "A URL precisa começar com http.";
        inputImagem.classList.add("input-invalido");
        return false;
    }

    spanErroImagem.textContent = "";
    inputImagem.classList.remove("input-invalido");
    return true;
}

inputImagem.addEventListener("input", validarURL);

// ----------------------
// 🔹 Persistência local
// ----------------------
function salvarLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(livros));
}

// ----------------------
// 🔹 Renderizar lista
// ----------------------
function criarItemLista(livro) {
    const li = document.createElement('li');
    li.className = 'livro-item';

    li.innerHTML = `
        <img src="${livro.imagem || 'https://via.placeholder.com/80'}" width="50">
        <strong>${livro.titulo}</strong> — ${livro.autor}
    `;

    const acoes = document.createElement('div');
    acoes.style.display = "flex";
    acoes.style.gap = "8px";

    const btnEditar = document.createElement('button');
    btnEditar.textContent = "Editar";
    btnEditar.onclick = () => preencherFormularioParaEdicao(livro.id);

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = "Excluir";
    btnExcluir.onclick = () => excluirLivro(livro.id);

    acoes.appendChild(btnEditar);
    acoes.appendChild(btnExcluir);
    li.appendChild(acoes);

    return li;
}

function renderizar() {
    listaEl.innerHTML = "";

    if (livros.length === 0) {
        listaEl.innerHTML = "<li>Nenhum livro cadastrado.</li>";
        return;
    }

    livros.forEach(livro => listaEl.appendChild(criarItemLista(livro)));
}

// ----------------------
// 🔹 Editar livro
// ----------------------
function preencherFormularioParaEdicao(id) {
    const livro = livros.find(l => l.id === id);
    if (!livro) return;

    inputId.value = livro.id;
    inputTitulo.value = livro.titulo;
    inputAutor.value = livro.autor;
    inputImagem.value = livro.imagem || "";
}

// ----------------------
// 🔹 Adicionar
// ----------------------
async function adicionarLivro(titulo, autor, imagem) {
    const novo = {
        id: Date.now(),
        titulo,
        autor,
        imagem: imagem || "https://via.placeholder.com/150"
    };

    livros.push(novo);
    salvarLocal();
    renderizar();

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ title: titulo, body: autor })
        });
    } catch {}
}

// ----------------------
// 🔹 Atualizar
// ----------------------
async function atualizarLivro(id, titulo, autor, imagem) {
    const idx = livros.findIndex(l => l.id == id);
    if (idx === -1) return;

    livros[idx].titulo = titulo;
    livros[idx].autor = autor;
    livros[idx].imagem = imagem || livros[idx].imagem;

    salvarLocal();
    renderizar();

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ title: titulo, body: autor })
        });
    } catch {}
}

// ----------------------
// 🔹 Excluir
// ----------------------
async function excluirLivro(id) {
    if (!confirm("Excluir livro?")) return;

    livros = livros.filter(l => l.id !== id);
    salvarLocal();
    renderizar();

    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    } catch {}
}

// ----------------------
// 🔹 Submit
// ----------------------
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const tituloValido = validarTitulo();
    const autorValido = validarAutor();
    const urlValida = validarURL();

    if (!tituloValido || !autorValido || !urlValida) return;

    const titulo = inputTitulo.value.trim();
    const autor = inputAutor.value.trim();
    const imagem = inputImagem.value.trim();
    const id = inputId.value;

    if (id) {
        atualizarLivro(id, titulo, autor, imagem);
    } else {
        adicionarLivro(titulo, autor, imagem);
    }

    form.reset();
    inputId.value = "";
});

// ----------------------
document.addEventListener("DOMContentLoaded", renderizar);
