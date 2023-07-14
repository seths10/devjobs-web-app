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
    const jobsList = document.getElementById("jobs-list");
    const loadMoreButton = document.getElementById("load-more");
    let filteredData = data;
    let visibleJobCount = 12;

    const renderJobCard = (job) => {
      const jobCard = document.createElement("div");
      jobCard.classList.add("job-card");

      const logoBackground = job.logoBackground || "#333";
      const logoUrl = job.logo || "./assets/logos/default-logo.svg";

      jobCard.innerHTML = `
        <a href="job.html?id=${job.id}">
            <img src="${logoUrl}" alt="${job.company} logo" style="background-color:${logoBackground}">
            <div>
              <p>${job.postedAt}</p>
              <p style="margin-top: -12px; font-weight: bold; font-size: 25px">.</p>

              <p>${job.contract}</p>
            </div>
            <h3 class="posted">${job.position}</h3>
            <h4>${job.company}</h4>
            <p class="location">${job.location}</p>
        </a>`;

      jobsList.appendChild(jobCard);
    };

    const renderJobCards = (data, numJobs) => {
      jobsList.innerHTML = "";
      const jobsToRender = data.slice(0, numJobs);
      jobsToRender.forEach((job) => renderJobCard(job));
    };

    const filterJobs = () => {
      const searchInput = document.getElementById("search-input");
      const locationInput = document.getElementById("location-input");
      const fullTimeCheckbox = document.getElementById("full-time-checkbox");

      const searchTerm = searchInput.value.toLowerCase();
      const locationTerm = locationInput.value.toLowerCase();
      const isFullTimeOnly = fullTimeCheckbox.checked;

      filteredData = data.filter((job) => {
        const matchesSearch =
          searchTerm === "" ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.position.toLowerCase().includes(searchTerm) ||
          job.requirements.items.some((item) =>
            item.toLowerCase().includes(searchTerm)
          ) ||
          job.role.items.some((item) =>
            item.toLowerCase().includes(searchTerm)
          );

        const matchesLocation =
          locationTerm === "" ||
          job.location.toLowerCase().includes(locationTerm);

        const matchesFullTime =
          !isFullTimeOnly || job.contract.toLowerCase() === "full time";

        return matchesSearch && matchesLocation && matchesFullTime;
      });

      renderJobCards(filteredData);
    };

    const loadMoreJobs = () => {
      const nextJobs = filteredData.slice(
        visibleJobCount,
        visibleJobCount + 12
      );
      renderJobCards(nextJobs);
      visibleJobCount += 12;

      if (visibleJobCount >= filteredData.length) {
        loadMoreButton.style.display = "none";
      }
    };

    document
      .getElementById("search-input")
      .addEventListener("input", filterJobs);
    document
      .getElementById("location-input")
      .addEventListener("input", filterJobs);
    document
      .getElementById("full-time-checkbox")
      .addEventListener("change", filterJobs);

    renderJobCards(data, 12);

    if (data.length > 12) {
      loadMoreButton.innerHTML = `
        <button id="load-more-button">Load More</button>
      `;

      const loadMoreButtonElement = document.getElementById("load-more-button");
      loadMoreButtonElement.addEventListener("click", loadMoreJobs);
    } else {
      loadMoreButton.style.display = "none";
    }
  });
