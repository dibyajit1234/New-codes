const url="http://api.weatherapi.com/v1/current.json?key=fc71dce7dd2540b2af7150945241506&q=India&aqi=no";



const geturl = async()=>{
    // let a=prompt("enter city name");
    let man=await fetch(`http://api.weatherapi.com/v1/current.json?key=fc71dce7dd2540b2af7150945241506&q=${a}&aqi=no`);
    
    let data=await man.json();
    console.log(data.current.temp_c);
}
geturl();