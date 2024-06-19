const url="http://api.weatherapi.com/v1/current.json?key=fc71dce7dd2540b2af7150945241506&q=India&aqi=no";

async function geturl(){
    let man=await fetch(`http://api.weatherapi.com/v1/current.json?key=fc71dce7dd2540b2af7150945241506&q=India&aqi=no`);
    let data=await man.json();
    console.log(data);
}
geturl();

async function getapi(a){
    let man=await fetch(`http://api.weatherapi.com/v1/current.json?key=fc71dce7dd2540b2af7150945241506&q=${a}&aqi=no`);
    let data=await man.json();
    return data;
}

let find=document.getElementById("find");
let enter=document.getElementById("enter");
let place=document.getElementById("place");
let image=document.getElementById("image");
let temp=document.getElementById("temp");
let state=document.getElementById("state");
let humi=document.getElementById("humi");
let updated=document.getElementById("updated");
let uv=document.getElementById("uv_ray");
let feel=document.getElementById("feels_like");
let humidity=document.getElementById("hum");
let wind=document.getElementById("wind-blow");
let air=document.getElementById("air");
let visi=document.getElementById("visi");
let dew=document.getElementById("dew_point");
let wind_direction=document.getElementById("wind_direction");


find.addEventListener("keypress",(e)=>{
    if(e.key==='Enter'){
        getapi(find.value).then((a)=>{
            place.innerText=a.location.name;
            image.src="https:"+a.current.condition.icon;
            temp.innerText=a.current.temp_c+"°";
            state.innerText=a.current.condition.text;
            humi.innerText="Humidity : "+a.current.humidity;
            updated.innerText="Last updated on : "+a.current.last_updated;
            uv.innerText=a.current.uv;
            feel.innerText=a.current.feelslike_c+"°c";
            humidity.innerText=a.current.humidity;
            wind.innerText=a.current.wind_kph+"kph";
            air.innerText=a.current.pressure_mb+"mb";
            visi.innerText=a.current.vis_km+"km";
            dew.innerText=a.current.dewpoint_c+"°c";
            wind_direction.innerText=a.current.wind_dir;

            console.log(a);
        })
    };
});
