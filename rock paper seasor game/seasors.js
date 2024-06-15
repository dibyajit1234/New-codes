const buttons=document.querySelectorAll(".press");
const comment=document.querySelector("#show");
let user=document.querySelector(".user-score");
let comp=document.querySelector(".comp-score");

let userScore=0;

let compScore=0;

const list=["rock","paper","seasor"];
let compChoice;





const playgame=((userChoice)=>{
    let choice=Math.floor(Math.random()*3);
    if(choice===0){
        compChoice=list[0];
    }
    else if(choice===1){
        compChoice=list[1];
    }
    else if(choice===2){
        compChoice=list[2];
    }





    if(userChoice==="rock"&&compChoice==="paper"){
        compScore++,comment.innerText="Computer Won!Paper beats rock";
    }
    else if(userChoice==="rock"&&compChoice==="seasor"){
        userScore++,comment.innerText="You Won!Rock beats Seasor";
    }
    else if(userChoice==="rock"&&compChoice==="rock"){
        comment.innerHTML="This is a Draw";
    }
    else if(userChoice==="paper"&&compChoice==="seasor"){
        compScore++,comment.innerText="Computer Won!Seasor beats paper";
    }
    else if(userChoice==="paper"&&compChoice==="rock"){
        userScore++,comment.innerText="You Won!Paper beats rock";
    }
    else if(userChoice==="paper"&&compChoice==="paper"){
        comment.innerHTML="This is a Draw";
    }
    else if(userChoice==="seasor"&&compChoice==="seasor"){
        comment.innerHTML="This is a Draw";
    }
    else if(userChoice==="seasor"&&compChoice==="paper"){
        userScore++,comment.innerText="You Won!Seasor beats Paper";
    }
    else if(userChoice==="seasor"&&compChoice==="stone"){
        compScore++,comment.innerText="Computer Won";
    }
    
    
})

buttons.forEach((box)=>{
    box.addEventListener("click",()=>{
        const userChoice=box.getAttribute("id");
        
        playgame(userChoice);

        user.innerText=userScore;
        comp.innerText=compScore;

        console.log(userScore);
        console.log(compScore);

    });
});





