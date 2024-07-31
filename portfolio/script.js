const observer = new IntersectionObserver((el)=>[
    el.forEach((el)=>{
        if(el.isIntersecting){
            el.target.classList.add('show');
        }
    })
])

const hiddenElements=document.querySelectorAll(".box");
let darkmode=document.querySelector("#darkmode");
const heading=document.querySelector("#heading");
const body=document.querySelector("body");
const man=document.querySelector(".new");
const h1=document.querySelector("h1");
const h2=document.querySelectorAll("h2");
const first_a=document.querySelector("#first_a");
const second_a =document.querySelector("#second_a");
const picture=document.querySelector(".picture");
const intro=document.querySelector("#intro");
const h4=document.querySelectorAll("h4");
const conc=document.getElementById("conc");
const head=document.querySelectorAll(".back h1")
hiddenElements.forEach((el)=> observer.observe(el));


let count=0;
darkmode.addEventListener("click",()=>{
    count++;

    if(count%2!=0){
         body.style.backgroundColor='#2E3436';
         body.style.color='white';
         man.style.backgroundColor="#2E3436";
         h1.style.color="#A800FF";

         h2.forEach((el)=>{
            el.style.color="#A800FF";
         })
         first_a.style.color="white";
         second_a.style.color="white";
         picture.style.boxShadow="1px 1px 30px white";
         h4.forEach((el)=>{
            el.style.color="#A800FF";
         })
         head.forEach((el)=>{
            el.style.color=("white");
         })
    }else{
        h4.forEach((el)=>{
            el.style.color="rgb(69, 7, 150)";
         })
         h2.forEach((el)=>{
            el.style.color="rgb(69, 7, 150)";
         })
        body.style.backgroundColor = 'white';
        body.style.color='black';
         man.style.backgroundColor="white";
         h1.style.color="rgb(15, 1, 66)";
         first_a.style.color="black";
         second_a.style.color="black";
         picture.style.boxShadow="1px 1px 30px rgb(69, 7, 150)";
         conc.style.color="white";
    }
})
