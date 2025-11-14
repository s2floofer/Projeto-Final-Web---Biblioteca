const livrosProntos = [
    {
        titulo: "A Seleção",
        autor: "Kiera Cass",
        imagem: "https://m.media-amazon.com/images/I/81ql6xkkliL._SL1500_.jpg"
    },
    {
        titulo: "A Elite",
        autor: "Kiera Cass",
        imagem: "https://m.media-amazon.com/images/I/91ILPH1tDSL._SY425_.jpg"
    },
    {
        titulo: "A Escolha",
        autor: "Kiera Cass",
        imagem: "https://m.media-amazon.com/images/I/51lnvNcEFbL._SY445_SX342_ML2_.jpg"
    },
    {
        titulo: "Harry Potter e a Pedra Filosofal",
        autor: "J. K. Rowling",
        imagem: "https://m.media-amazon.com/images/I/61jgm6ooXzL._SY342_.jpg"
    },
    {
        titulo: "Conectadas",
        autor: "Clara Alves",
        imagem: "https://m.media-amazon.com/images/I/71+uw0YHx7L._SY342_.jpg"
    },
    {
        titulo: "A Culpa é das Estrelas",
        autor: "John Green",
        imagem: "https://m.media-amazon.com/images/I/81WcnNQ-TBL._AC_UF1000,1000_QL80_.jpg"
    }
];


// PEGA OS LIVROS DO LOCALSTORAGE 
function carregarLivrosCadastrados() {
    return JSON.parse(localStorage.getItem("livros")) || [];
}

// Criar card visual
function criarCard(livro) {
    const card = document.createElement("div");
    card.classList.add("livro-card");

    card.innerHTML = `
        <img src="${livro.imagem || 'https://via.placeholder.com/150'}">
        <h3>${livro.titulo}</h3>
        <p>${livro.autor}</p>
    `;

    return card;
}

// Carregar catálogo
function carregarCatalogo() {
    const container = document.getElementById("catalogo-container");
    container.innerHTML = "";

    const cadastrados = carregarLivrosCadastrados();

    // UNE OS DO CRUD + OS PRONTOS
    const todos = [...livrosProntos, ...cadastrados];

    todos.forEach(l => container.appendChild(criarCard(l)));
}

function excluirLivro(index) {
    let livros = carregarLivrosCadastrados();
    livros.splice(index, 1); // remove o livro
    localStorage.setItem("livros", JSON.stringify(livros));
    carregarCatalogo(); // recarrega
}

function editarLivro(index) {
    let livros = carregarLivrosCadastrados();
    let livro = livros[index];

    const novoTitulo = prompt("Novo título:", livro.titulo);
    const novoAutor = prompt("Novo autor:", livro.autor);
    const novaImagem = prompt("URL da nova imagem:", livro.imagem);

    if (novoTitulo) livro.titulo = novoTitulo;
    if (novoAutor) livro.autor = novoAutor;
    if (novaImagem) livro.imagem = novaImagem;

    livros[index] = livro;
    localStorage.setItem("livros", JSON.stringify(livros));
    carregarCatalogo();
}

// Executa o catálogo 
document.addEventListener("DOMContentLoaded", () => {
    carregarCatalogo();
});