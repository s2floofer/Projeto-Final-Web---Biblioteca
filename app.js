// CRUD (usando JSONPlaceholder para simular)
const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const STORAGE_KEY = 'livros';

// Estado da aplicação (lista local de livros)
let livros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Referências ao DOM
const form = document.getElementById('livro-form');
const inputTitulo = document.getElementById('titulo');
const inputAutor = document.getElementById('autor');
const inputId = document.getElementById('livroId');
const spanErroTitulo = document.getElementById('erro-titulo');
const listaEl = document.getElementById('livro-lista');

// Salva o estado atual no localStorage
function salvarLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(livros));
}

// Mostra uma mensagem temporária (cria elemento se necessário)
function mostrarMensagem(texto, tipo = 'info') {
  let msg = document.getElementById('mensagem-temporaria');
  if (!msg) {
    msg = document.createElement('div');
    msg.id = 'mensagem-temporaria';
    msg.style.margin = '10px 0';
    document.querySelector('main').prepend(msg);
  }
  msg.textContent = texto;
  msg.style.color = tipo === 'erro' ? 'red' : 'green';
  setTimeout(() => { msg.textContent = ''; }, 3000);
}

// Limpa o formulário
function limparFormulario() {
  form.reset();
  inputId.value = '';
  spanErroTitulo.textContent = '';
}

// Cria o elemento <li> para um livro e adiciona listeners de editar/excluir
function criarItemLista(livro) {
  const li = document.createElement('li');
  li.className = 'livro-item';

  const texto = document.createElement('span');
  texto.innerHTML = `<strong>${livro.titulo}</strong> — ${livro.autor}`;

  const acoes = document.createElement('div');
  acoes.style.display = 'flex';
  acoes.style.gap = '8px';

  const btnEditar = document.createElement('button');
  btnEditar.textContent = 'Editar';
  btnEditar.addEventListener('click', () => preencherFormularioParaEdicao(livro.id));

  const btnExcluir = document.createElement('button');
  btnExcluir.textContent = 'Excluir';
  btnExcluir.addEventListener('click', () => excluirLivro(livro.id));

  acoes.appendChild(btnEditar);
  acoes.appendChild(btnExcluir);

  li.appendChild(texto);
  li.appendChild(acoes);
  return li;
}

// Renderiza a lista de livros no DOM
function renderizar() {
  listaEl.innerHTML = '';
  if (!livros.length) {
    listaEl.innerHTML = '<li>Nenhum livro cadastrado.</li>';
    return;
  }
  livros.forEach(livro => listaEl.appendChild(criarItemLista(livro)));
}

// Preenche o formulário para editar um livro existente
function preencherFormularioParaEdicao(id) {
  const livro = livros.find(l => l.id === id);
  if (!livro) return;
  inputId.value = livro.id;
  inputTitulo.value = livro.titulo;
  inputAutor.value = livro.autor;
}

// Adiciona um livro (otimista): atualiza o estado local e faz POST
async function adicionarLivro(titulo, autor) {
  const novo = { id: Date.now(), titulo, autor };
  livros.push(novo);
  salvarLocal();
  renderizar();
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titulo, body: autor })
    });
    mostrarMensagem('Livro adicionado.');
  } catch (err) {
    mostrarMensagem('Erro ao adicionar no servidor (mas salvo localmente).', 'erro');
  }
}

// Atualiza um livro, altera local e faz PUT
async function atualizarLivro(id, titulo, autor) {
  const idx = livros.findIndex(l => l.id == id);
  if (idx === -1) return;
  livros[idx].titulo = titulo;
  livros[idx].autor = autor;
  salvarLocal();
  renderizar();
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title: titulo, body: autor })
    });
    mostrarMensagem('Livro atualizado.');
  } catch (err) {
    mostrarMensagem('Erro ao atualizar no servidor (mas alterado localmente).', 'erro');
  }
}

// Remove um livro, remove local e faz DELETE
async function excluirLivro(id) {
  if (!confirm('Tem certeza que deseja excluir este livro?')) return;
  livros = livros.filter(l => l.id !== id);
  salvarLocal();
  renderizar();
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    mostrarMensagem('Livro excluído.');
  } catch (err) {
    mostrarMensagem('Erro ao excluir no servidor (mas removido localmente).', 'erro');
  }
}

// Validação simples do título
function validarTitulo(titulo) {
  if (!titulo || titulo.trim().length < 3) {
    spanErroTitulo.textContent = 'O título deve ter no mínimo 3 caracteres.';
    return false;
  }
  spanErroTitulo.textContent = '';
  return true;
}

// Evento de submit: decide entre criar ou atualizar
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const titulo = inputTitulo.value.trim();
  const autor = inputAutor.value.trim() || 'Desconhecido';
  if (!validarTitulo(titulo)) return;
  const id = inputId.value;
  if (id) {
    atualizarLivro(id, titulo, autor);
  } else {
    adicionarLivro(titulo, autor);
  }
  limparFormulario();
});




