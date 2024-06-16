function url(){
    fetch("http://api.weatherapi.com/v1/current.json?key=fc71dce7dd2540b2af7150945241506&q=India&aqi=no")
    .then(res=>res.json())
    .then(data=>console.log(data))
}

url();