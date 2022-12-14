let tar = document.getElementById("target");
let search = document.getElementById("search");

let val = "";

search.addEventListener("click", function() {
    val = tar.value;
});

console.log(val);