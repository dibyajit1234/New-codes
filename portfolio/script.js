const observer = new IntersectionObserver((el)=>[
    el.forEach((el)=>{
        if(el.isIntersecting){
            el.target.classList.add('show');
        }
        // else{
        //     el.target.classList.remove('show');
        // }
    })
])

const hiddenElements=document.querySelectorAll(".box");
let darkmode=document.querySelector("#darkmode");
const heading=document.querySelector("#heading");
const body=document.querySelector("body");

hiddenElements.forEach((el)=> observer.observe(el));


let count=0;
darkmode.addEventListener("click",()=>{
    count++;
    console.log(count);

    if(count%2!=0){
        //heading.style.backgroundColor = 'gray';
         body.style.backgroundColor='#2E3436';
         body.style.color='white';
    }else{
        body.style.backgroundColor = 'white';
        body.style.color='black';
    }

})
