let visu_source = [
  "/algorithms/stack",
  "/algorithms/avl-tree",
  "/algorithms/sort",
  "/algorithms/search",
  "/algorithms/shortest",
  "/algorithms/toh",
  "/algorithms/queue",
  "/algorithms/hash",
];

let btnop_list = document.querySelectorAll("div.btnlist > button"); // Is a Node List
let btnop_array = Array.from(btnop_list); // Converted to an JS Array
// Selects only those buttons who are children to the div.btnlist tag

let redir_btn = sessionStorage.getItem("btn");
if (redir_btn != null) {
  visu(redir_btn);
}
console.log("NULL OR NOT: " + redir_btn);
function visu(redir_btn) {
  sessionStorage.setItem("btn", redir_btn);

  let btn_ele = btnop_array[redir_btn];
  console.log("Redir-btn = " + redir_btn);
  console.log(btn_ele);
  console.log(redir_btn);
  console.log("");
  document.getElementById("deftext").style.display = "none";
  let obj = document.getElementById("obj");
  obj.data = visu_source[redir_btn];
  obj.style.display = "block";
  btn_ele.setAttribute("class", "btn op active");

  for (let i = 0; i < btnop_array.length; i++) {
    if (i != redir_btn) {
      console.log(i);
      btnop_array[i].setAttribute("class", "btn op");
    }
  } // This function removes active class from unrelated or previously clciked buttons
}
