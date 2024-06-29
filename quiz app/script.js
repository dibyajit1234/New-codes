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
let opt = document.querySelector(".opt");




newer.addEventListener(('click'),()=>{
  container.classList.remove("hide");
  butt.classList.remove("hide");
  start.style.display = "none";
  get().then((a)=>{
    console.log(a);
 for(let i=0;i<4;i++){
      if(a.results[i].type=="multiple"){
        question.innerHTML="Q . "+a.results[i].question;
      }
    }
    options_sort();

 })
})


const options_sort=(()=>{
  let choice = Math.floor(Math.random()*4);
  console.log(choice);
})