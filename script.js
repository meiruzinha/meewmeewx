const contatoLoja = '5587988116684';
const PEDIDO_MINIMO = 3;
const DESCONTO_QTD_MINIMA = 15;
const DESCONTO_PERCENTUAL = 0.15;

let PRODUTOS = [];
let carrinho = [];
let captchaValor = 0;
let toastTimeout = null;

const toast = document.getElementById('toast');
const menuBtn = document.getElementById('menu-btn');
const nav = document.getElementById('nav');
const carrinhoFloat = document.getElementById('carrinho-float');
const carrinhoFloatCount = document.getElementById('carrinho-float-count');
const listaProdutos = document.getElementById('lista-produtos');

const cartModal = document.getElementById('cart-modal');
const closeModal = document.getElementById('close-modal');
const cartItemsEl = document.getElementById('cart-items');
const cartFooter = document.getElementById('cart-footer');
const cartTotalEl = document.getElementById('cart-total');
const subtotalEl = document.getElementById('cart-subtotal');
const subtotalValor = document.getElementById('subtotal-valor');
const descontoEl = document.getElementById('cart-desconto');
const descontoValor = document.getElementById('desconto-valor');
const descontoInfo = document.getElementById('desconto-info');
const avisoDesconto = document.getElementById('aviso-desconto');
const avisoMinimo = document.getElementById('aviso-minimo');
const limparBtn = document.getElementById('limpar-carrinho');
const finalizarBtn = document.getElementById('finalizar-compra');
const nomeClienteInput = document.getElementById('nome-cliente');
const captchaPergunta = document.getElementById('captcha-pergunta');
const captchaResposta = document.getElementById('captcha-resposta');
const captchaErro = document.getElementById('captcha-erro');

async function carregarProdutos() {
  try {
    const res = await fetch('produtos.json');
    PRODUTOS = await res.json();
    renderizarProdutos();
  } catch (e) {
    console.error('Erro ao carregar produtos.json', e);
    mostrarToast('Erro ao carregar produtos', true);
  }
}

function renderizarProdutos() {
  listaProdutos.innerHTML = PRODUTOS.map(p => {
    const btnHTML = p.esgotado 
      ? `<button class="btn" disabled>Esgotado</button>`
      : `<button class="btn add-cart">Adicionar ao carrinho</button>`;

    return `
      <div class="produto" data-id="${p.id}">
        <div class="produto-img">
          <img src="${p.imagem}" alt="${p.nome}" draggable="false">
        </div>
        <div class="produto-conteudo">
          <h3>${p.nome}</h3>
          <p>${p.descricao}</p>
          <div class="preco">${formatarPreco(p.preco)}</div>
          ${btnHTML}
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      const produto = e.target.closest('.produto');
      const id = produto.dataset.id;
      adicionarAoCarrinho(id);
    });
  });
}

function sanitizarCarrinho(dados) {
  if (!Array.isArray(dados)) return [];
  return dados.filter(item => {
    const produto = PRODUTOS.find(p => p.id === item.id);
    return item &&
           produto &&
           !produto.esgotado &&
           typeof item.qtd === 'number' &&
           item.qtd > 0 &&
           item.qtd <= 99;
  }).map(item => {
    const produto = PRODUTOS.find(p => p.id === item.id);
    return {
      id: item.id,
      nome: produto.nome,
      preco: produto.preco,
      qtd: Math.floor(item.qtd)
    };
  });
}

function salvarCarrinho() {
  localStorage.setItem('meewmeewx_carrinho', JSON.stringify(carrinho));
}

function carregarCarrinho() {
  try {
    const salvo = localStorage.getItem('meewmeewx_carrinho');
    if (salvo) {
      const dadosBrutos = JSON.parse(salvo);
      carrinho = sanitizarCarrinho(dadosBrutos);
      atualizarContador();
    }
  } catch (e) {
    console.error('Carrinho corrompido, limpando...');
    localStorage.removeItem('meewmeewx_carrinho');
    carrinho = [];
  }
}

function gerarCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  captchaValor = a + b;
  captchaPergunta.textContent = `Quanto é ${a} + ${b}?`;
  captchaResposta.value = '';
  captchaErro.classList.remove('show');
}

function formatarPreco(valor) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function getTotalItens() {
  return carrinho.reduce((acc, item) => acc + item.qtd, 0);
}

function getSubtotal() {
  return carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);
}

function getDesconto() {
  const totalItens = getTotalItens();
  if (totalItens >= DESCONTO_QTD_MINIMA) {
    return getSubtotal() * DESCONTO_PERCENTUAL;
  }
  return 0;
}

function getTotal() {
  return getSubtotal() - getDesconto();
}

function atualizarContador() {
  const total = getTotalItens();
  carrinhoFloatCount.textContent = total;
  carrinhoFloatCount.classList.toggle('active', total > 0);
  salvarCarrinho();
}

function mostrarToast(msg, erro = false) {
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }

  toast.classList.remove('show');
  void toast.offsetWidth;

  toast.textContent = msg;
  toast.classList.toggle('error', erro);
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

function gerarLinkWpp() {
  const nome = nomeClienteInput.value.trim();
  let msg = 'Olá! Quero fazer um pedido na MEEWMEEWX:\n\n';
  if (nome) msg += `*Nome:* ${nome}\n\n`;

  carrinho.forEach(item => {
    msg += `${item.qtd}x ${item.nome} - ${formatarPreco(item.preco * item.qtd)}\n`;
  });

  const subtotal = getSubtotal();
  const desconto = getDesconto();
  const total = getTotal();

  msg += `\n*Subtotal: ${formatarPreco(subtotal)}*`;
  if (desconto > 0) {
    msg += `\n*Desconto 15%: -${formatarPreco(desconto)}*`;
  }
  msg += `\n*Total: ${formatarPreco(total)}*`;

  return `https://wa.me/${contatoLoja}?text=${encodeURIComponent(msg)}`;
}

function renderizarCarrinho() {
  if (carrinho.length === 0) {
    cartItemsEl.innerHTML = '<div class="cart-empty">Carrinho vazio</div>';
    cartFooter.style.display = 'none';
    return;
  }

  cartFooter.style.display = 'block';
  gerarCaptcha();

  cartItemsEl.innerHTML = carrinho.map(item => `
    <div class="cart-item">
      <div class="item-info">
        <h4></h4>
        <p></p>
      </div>
      <div class="item-actions">
        <button class="btn btn-qtd diminuir-qtd" data-id="${item.id}">-</button>
        <span class="item-qtd"></span>
        <button class="btn btn-qtd aumentar-qtd" data-id="${item.id}">+</button>
        <button class="btn btn-danger remover-item" data-id="${item.id}">×</button>
      </div>
    </div>
  `).join('');

  cartItemsEl.querySelectorAll('.cart-item').forEach((el, i) => {
    const item = carrinho[i];
    el.querySelector('h4').textContent = item.nome;
    el.querySelector('p').textContent = `${formatarPreco(item.preco)} cada`;
    el.querySelector('.item-qtd').textContent = item.qtd;
  });

  const totalItens = getTotalItens();
  const subtotal = getSubtotal();
  const desconto = getDesconto();
  const total = getTotal();
  const temDesconto = desconto > 0;
  const faltam = DESCONTO_QTD_MINIMA - totalItens;

  subtotalValor.textContent = formatarPreco(subtotal);
  descontoValor.textContent = `-${formatarPreco(desconto)}`;
  cartTotalEl.textContent = formatarPreco(total);

  subtotalEl.classList.toggle('show', temDesconto);
  descontoEl.classList.toggle('show', temDesconto);
  descontoInfo.classList.toggle('show', temDesconto);

  if (totalItens > 0 && totalItens < DESCONTO_QTD_MINIMA) {
    avisoDesconto.textContent = `Faltam ${faltam} button${faltam > 1? 's' : ''} pra ganhar 15% OFF!`;
    avisoDesconto.classList.add('show');
  } else {
    avisoDesconto.classList.remove('show');
  }

  const podeFinalizar = totalItens >= PEDIDO_MINIMO;
  finalizarBtn.disabled = !podeFinalizar;
  avisoMinimo.classList.toggle('show', !podeFinalizar);

  document.querySelectorAll('.aumentar-qtd').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.dataset.id;
      alterarQtd(id, 1);
    });
  });

  document.querySelectorAll('.diminuir-qtd').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.dataset.id;
      alterarQtd(id, -1);
    });
  });

  document.querySelectorAll('.remover-item').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.dataset.id;
      removerDoCarrinho(id);
    });
  });
}

function abrirModal() {
  renderizarCarrinho();
  cartModal.classList.add('active');
  document.body.classList.add('modal-open');
}

function fecharModal() {
  cartModal.classList.remove('active');
  document.body.classList.remove('modal-open');
}

function alterarQtd(id, delta) {
  const item = carrinho.find(item => item.id === id);
  if (item) {
    item.qtd += delta;
    if (item.qtd <= 0) {
      removerDoCarrinho(id);
    } else if (item.qtd > 99) {
      item.qtd = 99;
      mostrarToast('Limite de 99 unidades', true);
      atualizarContador();
      renderizarCarrinho();
    } else {
      atualizarContador();
      renderizarCarrinho();
    }
  }
}

function removerDoCarrinho(id) {
  const index = carrinho.findIndex(item => item.id === id);
  if (index > -1) {
    const item = carrinho[index];
    carrinho.splice(index, 1);
    atualizarContador();
    renderizarCarrinho();
    mostrarToast(`${item.nome} removido`);
  }
}

function adicionarAoCarrinho(id) {
  const produto = PRODUTOS.find(p => p.id === id);
  if (!produto) {
    mostrarToast('Produto inválido', true);
    return;
  }

  if (produto.esgotado) {
    mostrarToast('Produto esgotado', true);
    return;
  }

  const itemExistente = carrinho.find(item => item.id === id);

  if (itemExistente) {
    if(itemExistente.qtd < 99) {
      itemExistente.qtd++;
    } else {
      mostrarToast('Limite de 99 unidades', true);
      return;
    }
  } else {
    carrinho.push({ id, nome: produto.nome, preco: produto.preco, qtd: 1 });
  }

  atualizarContador();
  mostrarToast(`${produto.nome} adicionado!`);
}

carrinhoFloat.addEventListener('click', abrirModal);
closeModal.addEventListener('click', fecharModal);
cartModal.addEventListener('click', e => {
  if (e.target === cartModal) fecharModal();
});

limparBtn.addEventListener('click', () => {
  carrinho = [];
  nomeClienteInput.value = '';
  atualizarContador();
  renderizarCarrinho();
  mostrarToast('Carrinho limpo');
});

finalizarBtn.addEventListener('click', e => {
  e.preventDefault();

  const totalItens = getTotalItens();
  if (totalItens < PEDIDO_MINIMO) {
    mostrarToast(`Pedido mínimo de ${PEDIDO_MINIMO} buttons`, true);
    return;
  }

  if (!nomeClienteInput.value.trim()) {
    mostrarToast('Digite seu nome primeiro', true);
    nomeClienteInput.focus();
    return;
  }

  const resposta = parseInt(captchaResposta.value);
  if (resposta !== captchaValor) {
    captchaErro.classList.add('show');
    captchaResposta.focus();
    mostrarToast('Captcha incorreto!', true);
    return;
  }

  captchaErro.classList.remove('show');
  window.open(gerarLinkWpp(), '_blank');

  setTimeout(() => {
    carrinho = [];
    nomeClienteInput.value = '';
    atualizarContador();
    fecharModal();
  }, 500);
});

menuBtn.addEventListener('click', () => {
  nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
    if (window.innerWidth <= 768) nav.style.display = 'none';
  });
});

carregarProdutos().then(() => {
  carregarCarrinho();
});