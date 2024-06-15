let music=[
    {
        path:"Moho.mp3",
        name:"Moho",
        artist:"Aftermath",
        cover:"Moho-Bengali-2019-20201005195309-500x500.jpg"

    },

    {
        path:"Mayabi.mp3",
        name:"Mayabi",
        artist:"Blue Touch",
        cover:"Mayabee-Lyrics-by-Blue-Touch-Band-Song.webp"

    },
    {
        path:"purnota.mp3",
        name:"Purnota",
        artist:"Warfaze",
        cover:"purnota image.jpg",   
    },
    {
        path:"obosthan.mp3",
        name:"Obosthan",
        artist:"Highway",
        cover:"obosthan image.jpg",   
    },
    {
        path:"ghorgari.mp3",
        name:"Ghorgari",
        artist:"Highway",
        cover:"ghorgari image.jpg",   
    },
    // {
    //     path:"purnota.mp3",
    //     name:"Purnota",
    //     artist:"Warfaze",
    //     cover:"purnota image.jpg",   
    // }

    
];

let back =document.querySelector("#back");
let pause=document.querySelector("#pause");
let next=document.querySelector("#next")
let audio=document.querySelector("#audio");
let or=document.querySelector(".or");
let current_time=document.querySelector("#current_time");
let song_name=document.querySelector("h2");
let artist_name=document.querySelector("h3");
let circle=document.querySelector(".circle");
let progerss=document.querySelector(".progress");
let totaltime=document.querySelector("#duration");
let runnungTime=document.querySelector("#current_time");
let hide=document.querySelector(".hide");
let backimg=document.querySelector("#backimg");



function formatNumber(number) {
    let newnum;
    if(number>=60){
        number/=60;
        newnum=number;
        return newnum.toFixed(2);
    }
    else{
        return (number/100).toFixed(2);
        

    }
}
function changeBackgroundImage(source){
    circle.style.backgroundImage="url('"+source+"')";
}

audio.addEventListener("timeupdate",()=>{
    let durationOf=audio.duration;
    let thatTime=audio.currentTime;
    let progerss_percentage=(thatTime/durationOf)*100;
    progerss.style.width=progerss_percentage+'%';
    totaltime.innerHTML=formatNumber(durationOf);
    runnungTime.innerHTML=formatNumber(thatTime);
});


let a =music[0];
audio.src=a["path"];

song_name.innerText=a["name"];

artist_name.innerText=a["artist"];

backimg.src=a["cover"];
let b=a["cover"];
totaltime.innerText=audio.duration;

changeBackgroundImage(a["cover"]);

        

let count=1;

pause.addEventListener("click",()=>{
    
    if(count%2===0){
        audio.pause();
        pause.src="play-button.png";
        count++;
        circle.style.animationPlayState = "paused";
    }
    else{
        audio.play();
        pause.src="pause.png"
        count++;
        circle.classList.add("hide");
        circle.style.animationPlayState = "running";
    }

})




let next_count=0;
next.addEventListener("click",()=>{
    next_count++;
    
    a=music[next_count];
    audio.src=a["path"];
    song_name.innerText=a["name"];
    backimg.src=a["cover"];
    audio.play();
    pause.src="pause.png"
    count++;
    circle.classList.add("hide");
    if(count%2!==0){
        count--;
    }
    circle.style.animationPlayState = "running";
        changeBackgroundImage(a["cover"]);

    artist_name.innerText=a["artist"];
    let len=music.length;
    if(next_count==len-1){
        alert("this is the last song!");
    }
})

back.addEventListener("click",()=>{
    next_count--;
    console.log("dkjkj");
    if(next_count>=0){
        a=music[next_count];
    }
    else{
        next_count=0;
        
    }
    if(next_count==0){
        alert("it is the first song");
    }
    
    audio.src=a["path"];
    song_name.innerText=a["name"];
    backimg.src=a["cover"];
    audio.play();
    pause.src="pause.png";
    
    circle.classList.add("hide");
    circle.style.animationPlayState = "running";
    changeBackgroundImage(a["cover"]);

    artist_name.innerText=a["artist"];
})

