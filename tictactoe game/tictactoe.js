let boxes=document.querySelectorAll(".box");

let reset=document.querySelector("#reset");

let hide=document.querySelector(".man");

let winner=document.querySelector(".winner");

let gamebtn=document.querySelector(".newgame");

let click=0;

let turn=true;

let win=[
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],

];

boxes.forEach((box)=>{
    box.addEventListener("click",()=>{
        click++;
        if(turn){
            box.innerText="X";
            turn=false;
        }
        else{
            box.innerText="O";
            turn=true;
        }
        box.disabled=true;
        checkWinner();
        
    });
});

const disableBtns=()=>{
    for(let box of boxes){
        box.disabled=true;
    }
}

const newgame=()=>{
    for(let box of boxes){
        box.disabled=false;
        box.innerText=null;
        hide.classList.add("hide");
        turn=true;
        winner.innerText=null;
        click=0;
    }
}

const showwinner=(Winner)=>{
    winner.innerText=`Congratulations the winner is ${Winner}`;
    winner.style.color="white";
    hide.classList.remove("hide");
    disableBtns();
}


const checkWinner = ()=>{
    
    for(let pattern of win){
        let pos1val=boxes[pattern[0]].innerText;
        let pos2val=boxes[pattern[1]].innerText;
        let pos3val=boxes[pattern[2]].innerText;
        draw();

        if(pos1val!==""&&pos2val!==""&&pos3val!==""){
            if(pos1val===pos2val && pos2val===pos3val){
                console.log("Winner",pos1val);
                showwinner(pos1val);
            }
            
        }
    }
};


const draw =()=>{
    if(click===9 && (winner.innerText==='')){
        winner.innerText="The game is a Draw";
        turn=true;
        winner.style.color="white";
        hide.classList.remove("hide");
    }
}


const rebtn=()=>{
    for(let box of boxes){
        box.disabled=false;
        box.innerText=null;
        turn=true;
    }
}

reset.addEventListener('click',()=>{
    rebtn();
})

gamebtn.addEventListener('click',()=>{
    newgame();
    
})