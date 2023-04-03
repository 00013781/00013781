const modal = document.querySelector(".wrap_modal");
const goToStudentsBtn = document.querySelector(".gotoStudents");
const createAgainBtn = document.querySelector(".create_again");

goToStudentsBtn.addEventListener("click", () => {
  window.location.replace("/students");
  document.body.style.height = "100%";
  document.body.style.overflow = "unset";
});

createAgainBtn.addEventListener("click", () => {
  window.location.replace("/addStudent");
  document.body.style.height = "100%";
  document.body.style.overflow = "unset";
});

if (modal !== null) {
  document.body.style.height = "100vh";
  document.body.style.overflow = "hidden";
}
