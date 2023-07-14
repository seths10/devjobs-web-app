const urlParams = new URLSearchParams(window.location.search);
const jobId = urlParams.get("id");

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  const isDarkMode = body.classList.contains("dark-mode");
  localStorage.setItem("selectedMode", isDarkMode ? "dark" : "light");
}

function loadSelectedMode() {
  const savedMode = localStorage.getItem("selectedMode");
  if (savedMode === "dark") {
    document.body.classList.add("dark-mode");
  }
}

loadSelectedMode();

document
  .getElementById("toggle-mode")
  .addEventListener("change", toggleDarkMode);

fetch("data/data.json")
  .then((response) => response.json())
  .then((data) => {
    const job = data.find((job) => job.id == jobId);

    if (job) {
      const logoUrl = job.logo || "./assets/logos/default-logo.svg";
      const jobDetails = document.getElementById("job-details");
      const headerDetails = document.getElementById("header-details");
      const footerDetails = document.getElementById("job-details-footer");
      const logoBackground = job.logoBackground || "#333";

      headerDetails.innerHTML = `
      <div class="flex">
        <img src="${logoUrl}" alt="${job.company} logo" style="background-color:${logoBackground}">
        
          <div class="main-info">
            <h3>${job.company}</h3>
            <p>${job.website}</p>
          </div>
      </div>
        


      <button class="button2">Company Site</button>
      `;

      footerDetails.innerHTML = `
      <div class="flex">
          <div class="main-info">
            <h3>${job.position}</h3>
            <p>${job.company}</p>
          </div>
      </div>
        


      <button class="button">Apply Now</button>
      `;

      jobDetails.innerHTML = `
        <div class="flex space-between mb-10">
          <div>
            <div class="info">
              <p>${job.postedAt}</p>
              <p style="margin-top: -12px; font-weight: bold; font-size: 25px">.</p>
              <p>${job.contract}</p>
            </div>
            <h1>${job.position}</h1>
            <p class="location">${job.location}</p>
          </div>
          <button class="button">Apply Now</button>
        </div>
       
        
        <div class="description">
          <p>${job.description}</p>
        </div>
        <div class="requirements">
          <h3>Requirements</h3>
          <ul>
            ${job.requirements.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
        <div class="role">
          <h3>What You Will Do</h3>
          <ol>
            ${job.role.items.map((item) => `<li>${item}</li>`).join("")}
          </ol>
        </div>
      `;
    }
  })
  .catch((error) => {
    console.error("Error retrieving job data:", error);
  });
