// Lista fixa de livros que já vêm prontos no catálogo inicial
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


// ---------------- CARREGA LIVROS DO LOCALSTORAGE ----------------
// Retorna os livros cadastrados pelo usuário, ou lista vazia se não houver nada salvo
function carregarLivrosCadastrados() {
    return JSON.parse(localStorage.getItem("livros")) || [];
}


// ---------------- CRIA VISUALMENTE UM CARD DE LIVRO ----------------
function criarCard(livro) {
    const card = document.createElement("div");
    card.classList.add("livro-card"); 

    // Conteúdo HTML do card
    card.innerHTML = `
        <img src="${livro.imagem || 'https://via.placeholder.com/150'}">
        <h3>${livro.titulo}</h3>
        <p>${livro.autor}</p>
    `;

    return card;
}


// ---------------- CARREGA E EXIBE TODOS OS LIVROS ----------------
function carregarCatalogo() {
    const container = document.getElementById("catalogo-container");
    container.innerHTML = ""; // limpa catálogo antes de renderizar

    const cadastrados = carregarLivrosCadastrados(); // livros do usuário

    // Junta os livros prontos + cadastrados
    const todos = [...livrosProntos, ...cadastrados];

    // Para cada livro, cria um card e adiciona ao container
    todos.forEach(l => container.appendChild(criarCard(l)));
}


// ---------------- EXCLUIR UM LIVRO DO LOCALSTORAGE ----------------
function excluirLivro(index) {
    let livros = carregarLivrosCadastrados();
    livros.splice(index, 1);  // remove 1 item na posição "index"

    // Salva lista atualizada
    localStorage.setItem("livros", JSON.stringify(livros));

    // Atualiza o catálogo na tela
    carregarCatalogo();
}


// ---------------- EDITAR UM LIVRO CADASTRADO ----------------
function editarLivro(index) {
    let livros = carregarLivrosCadastrados();
    let livro = livros[index];

    // Prompts pedem novos valores ao usuário
    const novoTitulo = prompt("Novo título:", livro.titulo);
    const novoAutor = prompt("Novo autor:", livro.autor);
    const novaImagem = prompt("URL da nova imagem:", livro.imagem);

    // Atualiza somente se o usuário digitou
    if (novoTitulo) livro.titulo = novoTitulo;
    if (novoAutor) livro.autor = novoAutor;
    if (novaImagem) livro.imagem = novaImagem;

    // Regrava no array
    livros[index] = livro;

    // Salva no localStorage
    localStorage.setItem("livros", JSON.stringify(livros));

    // Atualiza na tela
    carregarCatalogo();
}


// ---------------- INICIALIZA O CATÁLOGO AO CARREGAR A PÁGINA ----------------
document.addEventListener("DOMContentLoaded", () => {
    carregarCatalogo(); 
});
