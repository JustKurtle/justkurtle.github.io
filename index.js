const projects = document.querySelectorAll(".tab");
console.log(projects);
projects.forEach(item => {
  item.addEventListener("mouseenter", e => {
    item.style.backgroundColor = "#434C5E";
    item.style.borderBottom = "solid #81A1C1";
  });
  item.addEventListener("mouseleave", e => {
    item.style.backgroundColor = "";
    item.style.borderBottom = "";
  });
});
