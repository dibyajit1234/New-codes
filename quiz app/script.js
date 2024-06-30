const a = "https://opentdb.com/api.php?amount=4";
// const url="http://api.weatherapi.com/v1/current.json?key=fc71dce7dd2540b2af7150945241506&q=India&aqi=no";

async function get (){
  let b=await fetch(a);
  let c=await b.json();
  return c;
}

let start = document.querySelector(".start");
let container=document.querySelector(".container")
let newer=document.querySelector(".new");
let butt=document.querySelector(".butt");
let question = document.querySelector("#question");
let op1=document.querySelector("#op1");
let op2=document.querySelector("#op2");
let op3=document.querySelector("#op3");
let op4=document.querySelector("#op4");
let option=document.querySelectorAll(".opt");
let submit=document.querySelector("#submit");
let next=document.querySelector("#next");


newer.addEventListener(('click'),()=>{
  container.classList.remove("hide");
  butt.classList.remove("hide");
  start.style.display = "none";
  get().then((a)=>{
    console.log(a);
    let n;
  
 for(let i=0;i<4;i++){
      if(a.results[i].type==="multiple"){
        question.innerHTML="Q . "+a.results[i].question;
      }

      n=i;
    }

    option_sort(a.results[n].incorrect_answers[0],a.results[n].incorrect_answers[1],a.results[n].incorrect_answers[2],a.results[n].correct_answer,op1,op2,op3,op4,n);


 })
})

option.forEach((element)=>{
  element.addEventListener(('click'),()=>{
    option.forEach(o=>{
      o.style.backgroundColor="rgb(0, 153, 255)";
      o.classList.remove('selected');
    })
    element.style.backgroundColor="orange";
    element.classList.add('selected');
    console.log(element);
    
  })
})

submit.addEventListener(('click'),()=>{
  let selected=document.querySelector(".selected");
  let green=document.querySelector(".green");
  selected.style.backgroundColor="red";
  green.style.backgroundColor="green";
  disable_btn();

})


next.addEventListener(('click'),()=>{
  get().then((a)=>{
    console.log(a);
    let n;
  
  for(let i=0;i<4;i++){
      if(a.results[i].type==="multiple"){
        question.innerHTML="Q . "+a.results[i].question;
      }

      n=i;
    }

    option_sort(a.results[n].incorrect_answers[0],a.results[n].incorrect_answers[1],a.results[n].incorrect_answers[2],a.results[n].correct_answer,op1,op2,op3,op4,n);


 })

let selected=document.querySelector(".selected");
let green=document.querySelector(".green");
selected.style.backgroundColor="rgb(0, 153, 255)";
green.style.backgroundColor="rgb(0, 153, 255)";


})



function disable_btn(){
  for(let j of option){
    j.disabled=true;
  }
}

function option_sort(a,b,c,d,m,n,o,p,l){
  let x=[a,b,c,d];
  let y=[m,n,o,p];

  for(let i=0;i<x.length;i++){
    let j=Math.floor(Math.random()*(x.length-1));
    [x[i],x[j]]=[x[j],x[i]];
  }

  for(let j=0;j<y.length;j++){
    y[j].innerHTML=x[j];
  }
for(let i=0;i<y.length;i++){
  if(y[i].innerHTML==d){
    y[i].classList.add('green');
  }
}
  console.log(x);
}