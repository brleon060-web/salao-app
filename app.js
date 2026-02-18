if('serviceWorker' in navigator){
 navigator.serviceWorker.register('sw.js');
}

let servicos=[];

// ================= PRODUTOS =================

function salvarProduto(){
 let nome=document.getElementById("nomeProduto").value;
 let valor=document.getElementById("valorProduto").value;
 let foto=document.getElementById("fotoProduto").files[0];

 if(!nome||!valor||!foto) return alert("Preencha tudo");

 let reader=new FileReader();
 reader.onload=function(e){
   let produtos=JSON.parse(localStorage.getItem("produtos"))||[];
   produtos.push({nome,valor,foto:e.target.result});
   localStorage.setItem("produtos",JSON.stringify(produtos));
   carregarProdutos();
 }
 reader.readAsDataURL(foto);
}

function carregarProdutos(){
 let produtos=JSON.parse(localStorage.getItem("produtos"))||[];
 let select=document.getElementById("produtoSelect");
 let lista=document.getElementById("listaProdutos");

 select.innerHTML="";
 lista.innerHTML="";

 produtos.forEach((p,i)=>{
   select.innerHTML+=`<option value="${i}">${p.nome} - R$ ${p.valor}</option>`;
   lista.innerHTML+=`<div>${p.nome} - R$ ${p.valor}</div>`;
 });
}

// ================= SERVIÇOS =================

function addServico(){
 let s=document.getElementById("servico").value;
 if(!s) return;
 servicos.push(s);
 atualizarLista();
 document.getElementById("servico").value="";
}

function atualizarLista(){
 let ul=document.getElementById("listaServicos");
 ul.innerHTML="";
 servicos.forEach(s=> ul.innerHTML+=`<li>${s}</li>`);
}

function addProduto(){
 let index=document.getElementById("produtoSelect").value;
 let produtos=JSON.parse(localStorage.getItem("produtos"))||[];
 let p=produtos[index];

 servicos.push(p.nome);
 let valorAtual=parseFloat(document.getElementById("valorTotal").value)||0;
 document.getElementById("valorTotal").value=valorAtual+parseFloat(p.valor);
 atualizarLista();
}

// ================= CLIENTES =================

function salvarCliente(){
 let nome=document.getElementById("nomeCliente").value;
 let agendamento=document.getElementById("agendamento").value;
 let valor=parseFloat(document.getElementById("valorTotal").value);
 let parcelas=parseInt(document.getElementById("parcelas").value);
 let fiado=parseFloat(document.getElementById("fiado").value)||0;

 if(!nome||!valor) return alert("Preencha nome e valor");

 let listaParcelas=[];
 for(let i=1;i<=parcelas;i++){
   listaParcelas.push({numero:i,pago:false});
 }

 let cliente={nome,agendamento,servicos,valor,parcelas,listaParcelas,fiado};

 let clientes=JSON.parse(localStorage.getItem("clientes"))||[];
 clientes.push(cliente);
 localStorage.setItem("clientes",JSON.stringify(clientes));

 servicos=[];
 atualizarLista();
 carregarClientes();
}

function carregarClientes(){
 let clientes=JSON.parse(localStorage.getItem("clientes"))||[];
 let div=document.getElementById("clientes");
 div.innerHTML="";

 clientes.forEach(c=>{
   div.innerHTML+=`
   <div>
   <strong>${c.nome}</strong><br>
   📅 ${c.agendamento}<br>
   💰 Total: R$ ${c.valor}<br>
   ⚠️ Fiado: R$ ${c.fiado}
   </div><hr>`;
 });
}

// ================= ALERTAS =================

function verificar(){
 let clientes=JSON.parse(localStorage.getItem("clientes"))||[];
 let agora=new Date();
 let div=document.getElementById("alertas");
 div.innerHTML="";

 clientes.forEach(c=>{
   if(c.agendamento){
     let data=new Date(c.agendamento);
     let horas=(data-agora)/(1000*60*60);

     if(horas<=4&&horas>0){
       div.innerHTML+=`<div class="alerta vermelho">
       🔔 ${c.nome} às ${c.agendamento}
       </div>`;
     }

     if(data.toDateString()===agora.toDateString()){
       div.innerHTML+=`<div class="alerta laranja">
       📅 HOJE: ${c.nome}
       </div>`;
     }
   }

   if(c.fiado>0){
     div.innerHTML+=`<div class="alerta amarelo">
     ⚠️ ${c.nome} deve R$ ${c.fiado}
     </div>`;
   }
 });
}

setInterval(verificar,300000);

carregarProdutos();
carregarClientes();
verificar();