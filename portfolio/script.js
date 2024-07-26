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
hiddenElements.forEach((el)=> observer.observe(el));

