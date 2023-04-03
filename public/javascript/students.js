const studentCard = document.querySelectorAll(".student_card");
const searchInput = document.querySelector(".search_input");

studentCard.forEach((el) => {
  el.addEventListener("click", () => {
    window.location.replace("/students/" + el.dataset.id);
  });
});

searchInput.addEventListener("input", (event) => {
  fetch(`/students?search=${event.target.value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data);
    })
    .catch((err) => {
      console.error("err", err);
    });
  window.location.replace(`/students?search=${event.target.value}`);
});
