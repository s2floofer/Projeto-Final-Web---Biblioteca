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
    const armazenados = localStorage.getItem("livros");
    return armazenados ? JSON.parse(armazenados) : [];
}

// CRIA CARD DE LIVRO 
function criarCard(livro) {
    const card = document.createElement("div");
    card.classList.add("livro-card");

    card.innerHTML = `
        <img src="${livro.imagem || 'https://via.placeholder.com/150'}" alt="Capa do livro">
        <h3>${livro.titulo}</h3>
        <p>${livro.autor}</p>
    `;

    return card;
}

// CARREGA TODOS OS LIVROS 
function carregarCatalogo() {
    const container = document.getElementById("catalogo-container");
    if (!container) return; // evita erro na página do CRUD

    container.innerHTML = "";

    const livrosCadastrados = carregarLivrosCadastrados();
    const todosLivros = [...livrosProntos, ...livrosCadastrados];

    todosLivros.forEach(livro => {
        container.appendChild(criarCard(livro));
    });
}

// Executa o catálogo 
document.addEventListener("DOMContentLoaded", () => {
    carregarCatalogo();
});
// Inicialização do CRUD
renderizar();