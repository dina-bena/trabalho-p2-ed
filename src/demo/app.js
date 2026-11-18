/* HeapLab: simulador didático de Min-Heap e Max-Heap.
   O estado e a sequência de passos são calculados em JavaScript para animar
   a mesma lógica implementada em src/algoritmo.py. */
const $ = (id) => document.getElementById(id);

let heap = [];
let tipo = "min";
let passos = [];
let cursor = 0;
let timer = null;
let comparacoes = 0;
let trocas = 0;
let operacoes = 0;
let destaque = { indices: [], tipo: "" };

function temPrioridade(a, b) { return tipo === "min" ? a < b : a > b; }

function adicionarPasso(msg, indices = [], op = "execução", atual = null) {
  passos.push({ heap: [...heap], msg, indices, op, atual, comparacoes, trocas, operacoes });
}
function comparar(i, j, contexto) {
  comparacoes++; operacoes++;
  adicionarPasso(`${contexto}: comparar ${heap[i]} (índice ${i}) com ${heap[j]} (índice ${j}).`, [i,j], "comparação", i);
  return temPrioridade(heap[i], heap[j]);
}
function trocar(i,j, contexto) {
  [heap[i],heap[j]] = [heap[j],heap[i]];
  trocas++; operacoes++;
  adicionarPasso(`${contexto}: trocar os índices ${i} e ${j} (${heap[j]} ↔ ${heap[i]}).`, [i,j], "troca", j);
}
function siftUp(i) {
  while (i > 0) {
    const pai = Math.floor((i - 1) / 2);
    if (!comparar(i,pai,"Sift-up")) break;
    trocar(i,pai,"Sift-up");
    i = pai;
  }
  adicionarPasso("Sift-up concluído: o elemento está na posição adequada.", [i], "concluído", i);
}
function siftDown(i) {
  while (true) {
    let melhor = i;
    const esq = 2*i+1, dir = 2*i+2;
    if (esq < heap.length && comparar(esq,melhor,"Sift-down")) melhor = esq;
    if (dir < heap.length && comparar(dir,melhor,"Sift-down")) melhor = dir;
    if (melhor === i) break;
    trocar(i,melhor,"Sift-down");
    i = melhor;
  }
  adicionarPasso("Sift-down concluído: a propriedade do Heap foi restaurada.", [i], "concluído", i);
}
function prepararInsert(valor) {
  parar(); passos=[]; cursor=0; resetarMetricas();
  heap.push(valor); operacoes++;
  adicionarPasso(`Inserir ${valor} no final do array, índice ${heap.length-1}.`, [heap.length-1], "insert", heap.length-1);
  siftUp(heap.length-1);
  adicionarPasso(`Inserção de ${valor} finalizada.`, [], "fim");
  mostrarPasso(0);
}
function prepararExtract() {
  parar(); passos=[]; cursor=0; resetarMetricas();
  if (!heap.length) { adicionarPasso("O heap está vazio: não há elemento para extrair.", [], "extract"); mostrarPasso(0); return; }
  const raiz=heap[0], ultimo=heap.pop(); operacoes++;
  adicionarPasso(`Extrair a raiz prioritária (${raiz}). O último elemento (${ultimo}) foi retirado do fim do array.`, [0], "extract", 0);
  if (heap.length) {
    heap[0]=ultimo; operacoes++;
    adicionarPasso(`Mover ${ultimo} para a raiz. Agora será necessário aplicar sift-down.`, [0], "movimentação", 0);
    siftDown(0);
  }
  adicionarPasso(`Extração concluída. Valor removido: ${raiz}.`, [], "fim");
  mostrarPasso(0);
}
function prepararPeek() {
  parar(); passos=[]; cursor=0; resetarMetricas();
  adicionarPasso(heap.length ? `Peek: o elemento prioritário é ${heap[0]}. Nenhum elemento foi removido.` : "Peek: o heap está vazio.", heap.length?[0]:[], "peek");
  mostrarPasso(0);
}
function resetarMetricas() { comparacoes=0; trocas=0; operacoes=0; }
function parar() { if(timer) clearInterval(timer); timer=null; }
function desenharArvore(valores, indices) {
  const area=$("arvore");
  if (!valores.length) { area.innerHTML='<span class="vazio">Heap vazio — insira um valor.</span>'; return; }
  const n=valores.length, nivel=Math.floor(Math.log2(n))+1;
  const largura=Math.max(320,Math.min(580,Math.pow(2,Math.min(nivel,5))*48));
  const altura=Math.max(210,nivel*78);
  const pos=[];
  for(let i=0;i<n;i++){
    const l=Math.floor(Math.log2(i+1));
    const primeiro=Math.pow(2,l)-1, offset=i-primeiro, qtd=Math.pow(2,l);
    pos[i]={x:largura*(offset+0.5)/qtd,y:35+l*72};
  }
  let svg=`<svg viewBox="0 0 ${largura} ${altura}" role="img" aria-label="Árvore do heap">`;
  for(let i=1;i<n;i++){const p=Math.floor((i-1)/2);svg+=`<line class="edge" x1="${pos[p].x}" y1="${pos[p].y}" x2="${pos[i].x}" y2="${pos[i].y+0}"/>`;}
  // As linhas são desenhadas entre os centros, com pequeno ajuste para não atravessar os círculos.
  svg=svg.replace(/<line class="edge"[^>]+\/>/g,"");
  for(let i=1;i<n;i++){const p=Math.floor((i-1)/2); const a=pos[p],b=pos[i]; const dx=b.x-a.x,dy=b.y-a.y; const len=Math.hypot(dx,dy); const ux=dx/len,uy=dy/len; svg+=`<line class="edge" x1="${a.x+ux*19}" y1="${a.y+uy*19}" x2="${b.x-ux*19}" y2="${b.y-uy*19}"/>`;}
  for(let i=0;i<n;i++){
    const cls=indices.includes(i)?"active":"";
    svg+=`<g class="node ${cls}"><circle cx="${pos[i].x}" cy="${pos[i].y}" r="19"></circle><text x="${pos[i].x}" y="${pos[i].y}">${valores[i]}</text></g>`;
  }
  svg+="</svg>"; area.innerHTML=svg;
}
function render(estado) {
  const {heap:valores,indices=[]}=estado;
  desenharArvore(valores,indices);
  $("arrayView").innerHTML=valores.map((v,i)=>`<div class="celula ${indices.includes(i)?"active":""}"><span class="valor">${v}</span><span class="indice">índice ${i}</span></div>`).join("") || '<span class="vazio">[]</span>';
  $("mensagem").textContent=estado.msg;
  $("indiceAtual").textContent=estado.atual===null?"—":estado.atual;
  $("indicePai").textContent=estado.atual===null||estado.atual===0?"—":Math.floor((estado.atual-1)/2);
  const i=estado.atual;
  $("filhos").textContent=i===null?"—":`${2*i+1 < valores.length ? 2*i+1 : "—"} / ${2*i+2 < valores.length ? 2*i+2 : "—"}`;
  $("operacaoAtual").textContent=estado.op;
  $("comparacoes").textContent=estado.comparacoes;
  $("trocas").textContent=estado.trocas;
  $("operacoes").textContent=estado.operacoes;
  $("quantidade").textContent=valores.length;
}
function mostrarPasso(indice) {
  if(!passos.length) return;
  cursor=Math.max(0,Math.min(indice,passos.length-1));
  const p=passos[cursor]; render(p);
  const log=$("log"); log.innerHTML="";
  passos.slice(0,cursor+1).forEach((x,i)=>{
    const li=document.createElement("li");
    li.innerHTML=`<strong>Passo ${i+1}:</strong> ${x.msg}`;
    log.appendChild(li);
  });
  log.scrollTop=log.scrollHeight;
}
function proximo() {
  if(!passos.length) return;
  if(cursor < passos.length-1) mostrarPasso(cursor+1);
  else parar();
}
function play() {
  if(!passos.length) { $("mensagem").textContent="Escolha um cenário ou execute uma operação."; return; }
  parar();
  timer=setInterval(()=>{if(cursor>=passos.length-1){parar();return;}proximo();},Number($("velocidade").value));
}
function carregarCenario(nome) {
  parar(); tipo=$("tipoHeap").value; heap=[]; passos=[]; cursor=0; resetarMetricas();
  let valores=[];
  if(nome==="medio") valores=[20,10,30,5,15,25,35];
  if(nome==="pior") valores=tipo==="min"?[90,80,70,60,50,40,30,20,10]:[10,20,30,40,50,60,70,80,90];
  if(nome==="custom") valores=[12,7,18,3,9,15,21];
  valores.forEach(v=>{heap.push(v); operacoes++; siftUp(heap.length-1);});
  adicionarPasso(`Cenário carregado: ${nome==="medio"?"Caso Médio":nome==="pior"?"Pior Caso de sift-up":"Exemplo Customizado"}.`, [], "cenário");
  mostrarPasso(0);
}
function resetVisual() { parar(); if (passos.length) { mostrarPasso(0); } else { render({heap:[...heap],indices:[],msg:"Nenhuma sequência de passos está carregada. Carregue um cenário ou execute uma operação.",op:"reset",atual:null,comparacoes,trocas,operacoes}); } }
$("tipoHeap").addEventListener("change",()=>{tipo=$("tipoHeap").value; heap=[]; passos=[]; resetarMetricas(); render({heap,indices:[],msg:`Tipo alterado para ${tipo.toUpperCase()}-Heap. Carregue um cenário ou insira valores.`,op:"tipo",atual:null,comparacoes,trocas,operacoes});});
$("inserirBtn").addEventListener("click",()=>{const v=Number($("valorInput").value);if($("valorInput").value.trim()===""||!Number.isFinite(v)){alert("Digite um número válido.");return;}prepararInsert(v);});
$("extrairBtn").addEventListener("click",prepararExtract);
$("peekBtn").addEventListener("click",prepararPeek);
$("playBtn").addEventListener("click",play);
$("stepBtn").addEventListener("click",()=>{parar();proximo();});
$("pauseBtn").addEventListener("click",parar);
$("resetBtn").addEventListener("click",resetVisual);
document.querySelectorAll("[data-cenario]").forEach(b=>b.addEventListener("click",()=>carregarCenario(b.dataset.cenario)));
$("limparLogBtn").addEventListener("click",()=>$("log").innerHTML="");
tipo=$("tipoHeap").value;
render({heap,indices:[],msg:"Carregue um cenário ou insira um valor para começar.",op:"—",atual:null,comparacoes,trocas,operacoes});
