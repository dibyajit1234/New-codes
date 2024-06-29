const url="https://opentdb.com/api.php?amount=4";
const geturl = async()=>{
  let b=await fetch(url);
  console.log(b);
}
