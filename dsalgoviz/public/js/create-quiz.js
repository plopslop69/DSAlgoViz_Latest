console.log(sessionStorage.getItem("count"));
sessionStorage.setItem("count", 5);

let questionCount = 0;
function addQuestion() {
  const questionContainer = document.querySelector("#question-container");
  const template = document.querySelector("#question-card");
  const clone = template.content.cloneNode(true);

  clone.querySelector("#qn-no").textContent = ++questionCount;

  const qn = clone.querySelector("#qn");
  const code = clone.querySelector("#qn_code");
  qn.setAttribute("name", `${questionCount}-question`);
  code.setAttribute("name", `${questionCount}-code`);

  const options = [...clone.querySelectorAll(".option")];
  for (const option of options) {
    option.setAttribute("name", `${questionCount}-option[]`);
  }

  const valid = [...clone.querySelectorAll(".valid")];
  for (let i = 0; i < valid.length; i++) {
    const v = valid[i];

    v.setAttribute("name", `${questionCount}-valid`);
    v.setAttribute("value", i);
  }

  questionContainer.appendChild(clone);
}

addQuestion();
