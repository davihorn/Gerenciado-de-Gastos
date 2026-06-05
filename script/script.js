const form=document.getElementById("expenseForm");
const lista=document.getElementById("listaGastos");
const totalEl=document.getElementById("totalGeral");
const quantidadeEl=document.getElementById("quantidade");

let gastos=JSON.parse(localStorage.getItem("gastosPremium"))||[];
let fixos=JSON.parse(localStorage.getItem("gastosFixos"))||[];

let graficoPizza;

const cores=[
"#3b82f6","#6366f1","#8b5cf6",
"#ec4899","#f43f5e","#f59e0b",
"#10b981","#14b8a6"
];

function salvar(){
localStorage.setItem("gastosPremium",JSON.stringify(gastos));
}

function salvarFixos(){
localStorage.setItem("gastosFixos",JSON.stringify(fixos));
}

function formatarData(data){
const d=new Date(data);
return d.toLocaleDateString("pt-BR");
}

function formatarMoeda(valor){

valor = valor.replace(/\D/g,"");
valor = (valor/100).toFixed(2)+"";
valor = valor.replace(".",",");
valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g,".");

return "R$ "+valor;

}

function atualizar(){

lista.innerHTML="";
let total=0;

gastos.forEach((g,i)=>{

total+=parseFloat(g.valor);

lista.innerHTML+=`
<tr>
<td>${g.descricao}</td>
<td>${g.categoria}</td>
<td>R$ ${parseFloat(g.valor).toFixed(2).replace(".",",")}</td>
<td>${formatarData(g.data)}</td>
<td><button class="delete-btn" onclick="remover(${i})">X</button></td>
</tr>`;

});

totalEl.innerText="R$ "+total.toFixed(2).replace(".",",");
quantidadeEl.innerText=gastos.length;

atualizarGraficos();

}

function remover(i){
gastos.splice(i,1);
salvar();
atualizar();
}

form.addEventListener("submit",e=>{

e.preventDefault();

const valorNumerico=document.getElementById("valor").value.replace(/\D/g,"")/100;

gastos.push({
descricao:descricao.value,
valor:valorNumerico,
data:data.value,
categoria:categoria.value
});

salvar();
atualizar();
form.reset();

});

function atualizarGraficos(){

const categorias={};

gastos.forEach(g=>{
categorias[g.categoria]=(categorias[g.categoria]||0)+parseFloat(g.valor);
});

const labels=Object.keys(categorias);
const valores=Object.values(categorias);

if(graficoPizza)graficoPizza.destroy();

graficoPizza=new Chart(document.getElementById("graficoPizza"),{

type:'doughnut',

data:{
labels:labels,
datasets:[{
data:valores,
backgroundColor:cores
}]
},

options:{
responsive:true,
plugins:{
legend:{labels:{color:"white"}}
}
}

});

}

/* GASTOS FIXOS */

function addFixo(){

const nome=document.getElementById("nomeFixo").value;
const valor=document.getElementById("valorFixo").value.replace(/\D/g,"")/100;

if(!nome || !valor) return;

fixos.push({nome,valor});

salvarFixos();

document.getElementById("nomeFixo").value="";
document.getElementById("valorFixo").value="";

renderFixos();

}

function removerFixo(i){

fixos.splice(i,1);

salvarFixos();

renderFixos();

}

function renderFixos(){

const lista=document.getElementById("listaFixos");

lista.innerHTML="";

fixos.forEach((f,i)=>{

lista.innerHTML+=`
<div class="fixo-item">
<span>${f.nome} - R$ ${f.valor.toFixed(2).replace(".",",")}</span>
<button class="remover-fixo" onclick="removerFixo(${i})">X</button>
</div>
`;

});

}

["valor","valorFixo"].forEach(id=>{
const campo=document.getElementById(id);
campo.addEventListener("input",()=>{
campo.value=formatarMoeda(campo.value);
});
});

renderFixos();
atualizar();

