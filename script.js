function getProd(id){return produtos.find(p=>p.id===id)}
function precoFinal(p){return p.status==="promo"&&p.precoPromo?p.precoPromo:p.preco}
let carrinho={}; try{carrinho=JSON.parse(localStorage.getItem('carrinho_meewmeewx'))||{}}catch(e){carrinho={}}
let nomeSalvo=localStorage.getItem('nome_meewmeewx')||'';
function salvar(){localStorage.setItem('carrinho_meewmeewx',JSON.stringify(carrinho)); localStorage.setItem('nome_meewmeewx',document.getElementById('nome').value)}
let toastTimer;
function mostrarToast(msg,tipo){let t=document.getElementById('toast'); t.innerText=msg; t.className='show '+(tipo||'sucesso'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2500)}
let captchaCerto=7, filtroAtual='buttons', tamanhoAtual='todos';
let newsTimer;
function cadastrarNewsletter(){
  let input=document.getElementById('emailNews');
  let msg=document.getElementById('newsMsg');
  let email=(input.value||'').trim();
  clearTimeout(newsTimer);
  if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    msg.className='news-msg erro';
    msg.innerText='Coloca um e-mail válido, tipo nome@email.com';
    mostrarToast('Coloca um e-mail válido!','aviso');
    newsTimer=setTimeout(()=>{msg.innerText=''; msg.className='news-msg';},3000);
    return;
  }
  localStorage.setItem('email_news_meew', email);
  msg.className='news-msg ok';
  msg.innerText='✓ Você entrou pro MEEW CLUBE! Bem-vinda ♡';
  input.value='';
  mostrarToast('Você entrou pro MEEW CLUBE!','sucesso');
  newsTimer=setTimeout(()=>{msg.innerText=''; msg.className='news-msg';},3000);
}
function toggleDropdown(e){
  e.preventDefault(); e.stopPropagation();
  let item=document.getElementById('itemButtons');
  item.classList.toggle('aberto');
}
document.addEventListener('click',()=>{document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('aberto'))});
function escolherTamanho(t){
  filtroAtual='buttons';
  tamanhoAtual=t;
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('aberto'));
  document.querySelectorAll('.cats button').forEach(b=>b.classList.remove('ativo'));
  document.getElementById('btnButtons').classList.add('ativo');
  document.getElementById('faq').style.display='block';
  renderProdutos();
  document.getElementById('secaoProdutos').scrollIntoView({behavior:'smooth', block:'start'});
}
function atualizarTitulo(){
  let el=document.getElementById('tituloSecao');
  let sub=document.getElementById('subtituloSecao');
  let busca=(document.getElementById('busca').value||'').trim();
  if(busca){ el.innerText='🔍 Resultado da busca'; sub.innerText='Buscando por: "'+busca+'" em todos os produtos'; return; }
  if(filtroAtual==='buttons'){
    el.innerText='♡ Buttons ♡';
    sub.innerText = tamanhoAtual==='todos' ? 'Todos os tamanhos' : 'Tamanho: '+tamanhoAtual;
  }
  else if(filtroAtual==='papelaria'){ el.innerText='📝 Papelaria ♡'; sub.innerText='Papelaria personalizada'; }
}
function rolar(dir){
  let el=document.getElementById('produtos');
  let card=el.querySelector('.prod-card');
  let passo=card ? card.offsetWidth + 14 : 200;
  el.scrollBy({left: dir * passo, behavior:'smooth'});
}
function rolarAvaliacoes(dir){
  let el=document.getElementById('avaliacoes');
  let card=el.querySelector('.review-card');
  let passo=card ? card.offsetWidth + 14 : 300;
  el.scrollBy({left: dir * passo, behavior:'smooth'});
}
function renderAvaliacoes(){
  const lista=document.getElementById('avaliacoes');
  if(!lista || typeof avaliacoes==='undefined') return;
  lista.innerHTML='';
  let soma=0;
  avaliacoes.forEach(a=>{
    soma+=a.estrelas;
    let estrelas='★'.repeat(a.estrelas)+'☆'.repeat(5-a.estrelas);
    lista.innerHTML+=`<div class="review-card"><div class="review-top"><div class="review-avatar" style="background:${a.cor}">${a.inicial}</div><div><div class="review-nome">${a.nome}<small>✓ Compra verificada</small></div><div class="review-stars">${estrelas}</div></div></div><div class="review-texto">${a.texto}</div><div class="review-produto">Comprou: ${a.produto}</div></div>`;
  });
  let media = avaliacoes.length ? (soma/avaliacoes.length).toFixed(1).replace('.',',') : '5,0';
  let elTotal=document.getElementById('totalAvaliacoes');
  if(elTotal) elTotal.innerText=`★★★★★ ${media} • ${avaliacoes.length} avaliações verificadas`;
}
function renderProdutos(){
  atualizarTitulo();
  const lista=document.getElementById('produtos'); lista.innerHTML='';
  let busca=(document.getElementById('busca').value||'').toLowerCase().trim();
  let achou=false;
  produtos.forEach(p=>{
    if(busca){
      if(!p.nome.toLowerCase().includes(busca) && !(p.desc||'').toLowerCase().includes(busca) && !(p.tamanho||'').toLowerCase().includes(busca)) return;
    } else {
      if(p.categoria!==filtroAtual) return;
      if(filtroAtual==='buttons' && tamanhoAtual!=='todos' && p.tamanho!==tamanhoAtual) return;
    }
    achou=true;
    let badge='', precoHtml=`R$ ${p.preco.toFixed(2).replace('.',',')}`;
    let btn=`<button onclick="add('${p.id}')">COMPRAR</button>`;
    let aviso='';
    if(p.estoque>0 && p.estoque<=5 && p.status!=='esgotado' && p.status!=='breve') aviso=`<div class="estoque">🔥 Só restam ${p.estoque}!</div>`;
    if(p.status==="promo"){badge=`<span class="badge">🔥 PROMO</span>`; precoHtml=`<s>R$ ${p.preco.toFixed(2).replace('.',',')}</s> R$ ${p.precoPromo.toFixed(2).replace('.',',')}`}
    if(p.status==="esgotado"){badge=`<span class="badge esg">ESGOTADO</span>`; btn=`<button disabled>Esgotado</button>`; aviso=''}
    if(p.status==="breve"){badge=`<span class="badge breve">EM BREVE</span>`; btn=`<button disabled>Em breve</button>`; aviso=''}
    let tamBadge = p.tamanho ? `<span class="badge tam">${p.tamanho}</span>` : '';
    lista.innerHTML+=`<div class="prod-card"><div class="img">${badge}${tamBadge}<img src="${p.img}" draggable="false" ondragstart="return false"></div><h3>${p.nome}</h3><div class="desc">${p.desc}</div><div class="preco">${precoHtml}</div><div class="pix">${p.status==="promo"?'Pix com desconto':''}</div>${aviso}${btn}</div>`;
  });
  document.getElementById('semResultado').style.display=achou?'none':'block';
  lista.scrollLeft=0;
}
function irParaCategoria(f, el){
  filtroAtual=f;
  tamanhoAtual='todos';
  document.getElementById('busca').value='';
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('aberto'));
  document.querySelectorAll('.cats button').forEach(b=>b.classList.remove('ativo'));
  if(el){ el.classList.add('ativo'); }
  else{
    let id = f==='buttons' ? 'btnButtons' : 'btnPapelaria';
    let b=document.getElementById(id); if(b) b.classList.add('ativo');
  }
  document.getElementById('faq').style.display=f==='buttons'?'block':'none';
  renderProdutos();
  document.getElementById('secaoProdutos').scrollIntoView({behavior:'smooth', block:'start'});
}
function filtrar(f,el){ irParaCategoria(f,el) }
function voltarTopo(){
  document.getElementById('busca').value='';
  filtroAtual='buttons';
  tamanhoAtual='todos';
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('aberto'));
  document.querySelectorAll('.cats button').forEach(b=>b.classList.remove('ativo'));
  document.getElementById('btnButtons').classList.add('ativo');
  document.getElementById('faq').style.display='block';
  fechar();
  renderProdutos();
  window.scrollTo({top:0, behavior:'smooth'});
}
function buscar(ir){
  renderProdutos();
  if(ir){ document.getElementById('secaoProdutos').scrollIntoView({behavior:'smooth', block:'start'}); }
}
function add(id){
  let p=getProd(id);
  if(!p||p.status==="esgotado"||p.status==="breve"||p.estoque===0) return;
  if((carrinho[id]||0)>=p.estoque){mostrarToast(`Só temos ${p.estoque} de ${p.nome}!`,'aviso');return}
  carrinho[id]=(carrinho[id]||0)+1; atualizar(); mostrarToast(`${p.nome} adicionado!`,'sucesso');
}
function atualizar(){
  let totalQtd=0,subtotal=0,html='';
  for(let id in carrinho){
    let q=carrinho[id],p=getProd(id); if(!p) continue;
    let pf=precoFinal(p); totalQtd+=q; subtotal+=q*pf;
    html+=`<div class="item"><div><b>${p.nome}</b><br><small>R$ ${pf.toFixed(2).replace('.',',')} cada ${p.status==="promo"?'🔥 promo':''}</small></div><div class="controls"><button onclick="mudar('${id}',-1)">-</button><b>${q}</b><button onclick="mudar('${id}',1)">+</button><button class="btn-x" onclick="remover('${id}')">✕</button></div></div>`;
  }
  let temDesconto=totalQtd>=15; let desconto=temDesconto?subtotal*0.15:0; let total=subtotal-desconto;
  document.getElementById('itens').innerHTML=html||'<p style="text-align:center;padding:20px;color:#888">Carrinho vazio</p>';
  document.getElementById('areaPedido').style.display=totalQtd>0?'block':'none';
  document.getElementById('footerCarrinho').style.display=totalQtd>0?'block':'none';
  document.getElementById('qtdTitulo').innerText=totalQtd>0?`(${totalQtd})`:'';
  document.getElementById('qtd').innerText=totalQtd;
  document.getElementById('subtotal').innerText='R$ '+subtotal.toFixed(2).replace('.',',');
  document.getElementById('descontoVal').innerText='- R$ '+desconto.toFixed(2).replace('.',',');
  document.getElementById('total').innerText='R$ '+total.toFixed(2).replace('.',',');
  document.getElementById('linhaDesconto').style.display=temDesconto?'flex':'none';
  document.getElementById('infoDesc').style.display=temDesconto?'block':'none';
  document.getElementById('infoFalta').style.display=(totalQtd>0&&!temDesconto)?'block':'none';
  if(!temDesconto) document.getElementById('faltaDesc').innerText=15-totalQtd;
  let faltaMin=3-totalQtd;
  document.getElementById('aviso').classList.toggle('show',faltaMin>0&&totalQtd>0);
  document.getElementById('falta').innerText=faltaMin;
  document.getElementById('finalizar').disabled=faltaMin>0;
  salvar();
}
function mudar(id,d){
  let p=getProd(id);
  if(d>0&&p&&(carrinho[id]||0)>=p.estoque){mostrarToast(`Só temos ${p.estoque}!`,'aviso');return}
  carrinho[id]+=d; if(carrinho[id]<=0){delete carrinho[id]; if(p) mostrarToast(`${p.nome} removido`,'remover')} atualizar();
}
function remover(id){let p=getProd(id); delete carrinho[id]; atualizar(); if(p) mostrarToast(`${p.nome} removido`,'remover')}
function limparCarrinho(){
  if(Object.keys(carrinho).length===0) return;
  carrinho={}; document.getElementById('nome').value=''; document.getElementById('captchaResposta').value='';
  localStorage.removeItem('carrinho_meewmeewx'); localStorage.removeItem('nome_meewmeewx');
  gerarCaptcha(); atualizar(); mostrarToast('Carrinho limpo!','remover');
}
function abrirCarrinho(){document.getElementById('modal').classList.add('ativa'); atualizar(); gerarCaptcha()}
function fechar(){document.getElementById('modal').classList.remove('ativa')}
document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal') fechar()});
document.getElementById('nome').addEventListener('input',()=>{document.getElementById('nome').classList.remove('erro'); salvar()});
function gerarCaptcha(){let a=Math.floor(Math.random()*8)+2,b=Math.floor(Math.random()*8)+2;captchaCerto=a+b;document.getElementById('captchaPergunta').innerText=`Quanto é ${a} + ${b} ?`;document.getElementById('captchaResposta').value=''}
function finalizar(){
  let nome=document.getElementById('nome').value.trim();
  if(!nome){document.getElementById('nome').classList.add('erro'); mostrarToast('Preencha seu nome','aviso'); return}
  let resp=document.getElementById('captchaResposta').value.trim();
  if(resp===''||parseInt(resp)!==captchaCerto){gerarCaptcha(); mostrarToast('Resposta errada, tenta de novo!','remover'); return}
  let linhas=['Olá! Quero pedir na MEEWMEEWX:','']; let subtotal=0,totalQtd=0;
  for(let id in carrinho){let q=carrinho[id],p=getProd(id); totalQtd+=q; let pf=precoFinal(p); subtotal+=q*pf; linhas.push(`• ${q}x ${p.nome} - R$ ${(q*pf).toFixed(2).replace('.',',')}${p.status==="promo"?' (promo)':''}`)}
  let temDesconto=totalQtd>=15; let desconto=temDesconto?subtotal*0.15:0; let total=subtotal-desconto;
  linhas.push(''); linhas.push(`Subtotal: R$ ${subtotal.toFixed(2).replace('.',',')}`); if(temDesconto) linhas.push(`Desconto 15%: - R$ ${desconto.toFixed(2).replace('.',',')}`); linhas.push(`Total: R$ ${total.toFixed(2).replace('.',',')}`); linhas.push(`Nome: ${nome}`);
  window.open(`https://wa.me/5587988116684?text=${encodeURIComponent(linhas.join('\n'))}`,'_blank');
  carrinho={}; document.getElementById('nome').value=''; document.getElementById('captchaResposta').value=''; localStorage.removeItem('carrinho_meewmeewx'); localStorage.removeItem('nome_meewmeewx'); atualizar(); fechar(); mostrarToast('Pedido enviado! Obrigada!','sucesso');
}
function podeCopiar(e){
  let t = e.target;
  return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA');
}
document.addEventListener('copy', (e) => { if(!podeCopiar(e)) e.preventDefault(); });
document.addEventListener('cut', (e) => { if(!podeCopiar(e)) e.preventDefault(); });
document.addEventListener('paste', (e) => { if(!podeCopiar(e)) e.preventDefault(); });
document.addEventListener('selectstart', (e) => { if(!podeCopiar(e)) e.preventDefault(); });
document.addEventListener('dragstart', (e) => { e.preventDefault(); });
document.addEventListener('contextmenu', (e) => { if(!podeCopiar(e)) e.preventDefault(); });
document.addEventListener('keydown', (e) => {
  if((e.ctrlKey || e.metaKey) && ['c','x','a','u','s','p'].includes(e.key.toLowerCase()) && !podeCopiar(e)){
    e.preventDefault();
  }
});
document.getElementById('nome').value=nomeSalvo;
gerarCaptcha(); renderProdutos(); renderAvaliacoes(); atualizar();