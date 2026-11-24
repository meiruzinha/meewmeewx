// ============================================
// MEEWMEEWX - PRODUTOS
// Pra mudar preço, estoque ou foto, mexe SÓ aqui!
// ============================================
// status: "normal" | "promo" | "esgotado" | "breve"
// categoria: "buttons" | "papelaria"
// tamanho: tem que ser igual ao do menu (ex: "32mm", "32mm Plastico")
// Se tem promo, coloca precoPromo. Se não tem, pode apagar essa parte.
// ============================================
const produtos = [
  {id:"b25-metal", nome:"Button 25mm Metal", preco:4.50, status:"normal", estoque:20, categoria:"buttons", tamanho:"25mm", desc:"Button 25mm Metal • personalizado", img:"25m.jpg"},
  {id:"b32-plastico", nome:"Button 32mm Plástico", preco:3.50, status:"esgotado", estoque:5, categoria:"buttons", tamanho:"32mm Plastico", desc:"Button 32mm Plástico • personalizado", img:"32p.jpg"},
  {id:"b32-metal", nome:"Button 32mm Metal", preco:5.50, status:"normal", estoque:20, categoria:"buttons", tamanho:"32mm", desc:"Button 32mm Metal • personalizado", img:"32m.jpg"},
  {id:"b37-metal", nome:"Button 37mm Metal", preco:6.00, status:"normal", estoque:20, categoria:"buttons", tamanho:"37mm", desc:"Button 37mm Metal • personalizado", img:"37m.jpg"},
  {id:"b44-plastico", nome:"Button 44mm Plástico", preco:4.50, status:"esgotado", estoque:0, categoria:"buttons", tamanho:"44mm Plastico", desc:"Button 44mm Plástico • personalizado", img:"44p.jpg"},
  {id:"b44-metal", nome:"Button 44mm Metal", preco:7.00, status:"normal", estoque:20, categoria:"buttons", tamanho:"44mm", desc:"Button 44mm Metal • personalizado", img:"44m.jpg"},
  {id:"b58-plastico", nome:"Button 58mm Plástico", preco:5.50, status:"esgotado", estoque:0, categoria:"buttons", tamanho:"58mm Plastico", desc:"Button 58mm Plástico • personalizado", img:"58p.jpg"},
  {id:"b58-metal", nome:"Button 58mm Metal", preco:8.00, status:"esgotado", estoque:0, categoria:"buttons", tamanho:"58mm", desc:"Button 58mm Metal • personalizado", img:"58m.jpg"},
  {id:"b25-nfc-metal", nome:"Button 25mm NFC Metal", preco:15.00, precoPromo:10.00, status:"promo", estoque:10, categoria:"buttons", tamanho:"25mm NFC", desc:"Button 25mm NFC Metal • aproxima e abre link", img:"25m-nfc.jpg"},
  {id:"b32-nfc-plastico", nome:"Button 32mm NFC Plástico", preco:10.00, status:"normal", estoque:20, categoria:"buttons", tamanho:"32mm NFC", desc:"Button 32mm NFC Plástico • aproxima e abre link", img:"32p-nfc.jpg"},
  
  
  {id:"marcapagina", nome:"Marca-página", preco:4, status:"breve", estoque:20, categoria:"papelaria", tamanho:"", desc:"Marca-página • personalizado", img:"https://placehold.co/600x600/0ea5e9/ffffff?text=Marca-página"},
  {id:"calendario", nome:"Calendário", preco:5, status:"breve", estoque:15, categoria:"papelaria", tamanho:"", desc:"Calendário • personalizado", img:"https://placehold.co/600x600/f59e0b/ffffff?text=Cartão"},
  
];