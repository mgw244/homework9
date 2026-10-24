console.log('Hello World!');

const name = "Mercedez Wright";
let hasDownloadedResume = false;
let downloadCount = 0;

const navItems = [
  { label: "Summary", target: "#summary" },
  { label: "Education", target: "#education" },
  { label: "Skills", target: "#skills" },
  { label: "Projects", target: "#projects" },
  { label: "Experience", target: "#experience" },
  { label: "Contact", target: "#contact" }
];

let nextSkillId = 1;

let skills = [
  { name: "Networking Fundamentals", category: "techSkills", tag: "Core focus" },
  { name: "Computer Troubleshooting", category: "techSkills", tag: "Key skill" },
  { name: "HTML & CSS", category: "techSkills" },
  { name: "Windows & Mac Support", category: "techSkills" },
  { name: "Order & Database Systems", category: "techSkills" },
  { name: "Microsoft Office", category: "techSkills" },
  { name: "Problem-Solving", category: "softSkills", tag: "Key skill" },
  { name: "Customer Communication", category: "softSkills" },
  { name: "Organization", category: "softSkills" },
  { name: "Attention to Detail", category: "softSkills" },
  { name: "Team Collaboration", category: "softSkills" },
  { name: "Adaptability", category: "softSkills" }
].map(function (skill) {
  return Object.assign({ id: nextSkillId++ }, skill);
});

const projects = [
  {
    title: "Local Network File Transfer App",
    description: "A desktop utility that lets devices on the same local network discover each other and send files directly, without relying on cloud storage or email as a middleman.",
    deadline: new Date("05/08/2026"),
    imageURL: "images/project1-1.svg",
    modalId: "projectModal1"
  },
  {
    title: "Mobile-to-PC Controller Driver",
    description: "A tool that turns a phone into a working game controller for a PC by sending input data over the local network.",
    deadline: new Date("08/21/2026"),
    imageURL: "images/project2-1.svg",
    modalId: "projectModal2"
  },
  {
    title: "Home Network Monitoring Dashboard",
    description: "A simple web dashboard that checks which devices on a home network are online and flags any device that stops responding.",
    deadline: new Date("12/11/2026"),
    imageURL: "images/project3-1.svg",
    modalId: "projectModal3"
  }
];

const educationData = [
  {
    school: "Estrella Mountain Community College",
    degree: "Associate of Applied Science, Business Management",
    start: "2023",
    end: "2025"
  },
  {
    school: "Northern Arizona University (NAU)",
    degree: "Bachelor of Science, Information Technology",
    start: "2025",
    end: "Expected 2029"
  }
];

const experienceData = [
  {
    role: "Department Lead",
    company: "DHL",
    start: "July 2024",
    end: "Present"
  },
  {
    role: "Office Receptionist / Assistant",
    company: "Coast to Coast",
    start: "2021",
    end: "2023"
  },
  {
    role: "Barista & Baker Lead",
    company: "Sugar N Spice",
    start: "May 2021",
    end: "May 2023"
  }
];

const themeDefaults = {
  dark: "#10141b",
  light: "#f4f6fb"
};

function showGreeting(name) {
  return "Hello, my name is " + name + "! Welcome to my portfolio!";
}

function getTimeOfDayGreeting(date) {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good Morning";
  } else if (hour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

function showTimeOfDayGreeting(name) {
  const timeGreeting = getTimeOfDayGreeting(new Date());
  return showGreeting(name).replace("Hello", timeGreeting);
}

function renderNavMenu() {
  const $menu = $("#navMenu").empty();

  for (let i = 0; i < navItems.length; i++) {
    const $link = $("<a>", {
      class: "nav-link scroll-link",
      href: navItems[i].target,
      text: navItems[i].label
    });

    $menu.append($("<li>", { class: "nav-item" }).append($link));
  }
}

function smoothScrollTo(target) {
  const $target = $(target);

  if ($target.length === 0) {
    return;
  }

  $("html, body").stop().animate({ scrollTop: $target.offset().top }, 700);
}

function closeMobileMenu() {
  const menu = document.getElementById("navLinks");

  if (menu.classList.contains("show")) {
    bootstrap.Collapse.getOrCreateInstance(menu).hide();
  }
}

function findSkill(id) {
  return skills.find(function (skill) {
    return skill.id === id;
  });
}

function validateSkill(skillName, ignoreId, onValid, onInvalid) {
  const trimmed = skillName.trim();

  if (trimmed === "") {
    onInvalid("Please enter a skill name.");
    return;
  }

  const alreadyExists = skills.some(function (skill) {
    return skill.id !== ignoreId && skill.name.toLowerCase() === trimmed.toLowerCase();
  });

  if (alreadyExists) {
    onInvalid("\"" + trimmed + "\" is already in your skills.");
    return;
  }

  onValid(trimmed);
}

function showSkillMessage(text, isError) {
  $("#skillMessage")
    .text(text)
    .toggleClass("text-danger", isError)
    .toggleClass("text-success", !isError)
    .hide()
    .fadeIn(200);
}

function createSkillItem(skill) {
  const $item = $("<li>", {
    class: "list-group-item list-group-item-action d-flex align-items-center gap-2 skill-item",
    "data-id": skill.id
  });

  const $name = $("<span>", {
    class: "skill-name flex-grow-1",
    text: skill.name,
    role: "button",
    tabindex: 0,
    title: "Click to edit"
  });

  if (skill.tag) {
    $item.addClass("fw-semibold");
  }

  $item.append($name);

  if (skill.tag) {
    const badgeClass = skill.tag === "Core focus" ? "text-bg-warning" : "text-bg-primary";
    $item.append($("<span>", { class: "badge " + badgeClass, text: skill.tag }));
  }

  $item.append($("<button>", {
    type: "button",
    class: "btn btn-sm btn-outline-danger skill-delete",
    "aria-label": "Remove " + skill.name,
    html: "&times;"
  }));

  return $item;
}

function renderSkills() {
  $(".skill-list").empty();

  skills.forEach(function (skill) {
    $("#" + skill.category).append(createSkillItem(skill));
  });

  filterSkills($("#skillSearch").val());
}

function updateSkillCount(visibleCount) {
  const total = skills.length;

  if (visibleCount === total) {
    $("#skillCount").text(total + " skills");
  } else {
    $("#skillCount").text("Showing " + visibleCount + " of " + total + " skills");
  }
}

function filterSkills(searchText) {
  const query = (searchText || "").trim().toLowerCase();

  const matchingIds = skills
    .filter(function (skill) {
      return skill.name.toLowerCase().includes(query);
    })
    .map(function (skill) {
      return skill.id;
    });

  $(".skill-item").each(function () {
    const id = Number($(this).attr("data-id"));
    $(this).toggleClass("d-none", !matchingIds.includes(id));
  });

  updateSkillCount(matchingIds.length);
}

function addSkill() {
  const category = $("#skillCategory").val();

  validateSkill($("#skillInput").val(), null, function (skillName) {
    const newSkill = { id: nextSkillId++, name: skillName, category: category };
    skills.push(newSkill);

    const $item = createSkillItem(newSkill).hide();
    $("#" + category).append($item);
    $item.slideDown(300).addClass("skill-new");

    filterSkills($("#skillSearch").val());
    showSkillMessage("\"" + skillName + "\" was added to your skills.", false);
    $("#skillInput").val("").trigger("focus");
  }, function (errorMessage) {
    showSkillMessage(errorMessage, true);
    $("#skillInput").trigger("focus").trigger("select");
  });
}

function removeSkill(id) {
  const skill = findSkill(id);
  const $item = $(".skill-item[data-id='" + id + "']");

  skills = skills.filter(function (s) {
    return s.id !== id;
  });

  $item.slideUp(300, function () {
    $item.remove();
    filterSkills($("#skillSearch").val());
  });

  showSkillMessage("\"" + skill.name + "\" was removed from your skills.", false);
}

function startEditingSkill($name) {
  const $item = $name.closest(".skill-item");
  const id = Number($item.attr("data-id"));
  const skill = findSkill(id);

  const $input = $("<input>", {
    type: "text",
    class: "form-control form-control-sm skill-edit-input flex-grow-1",
    value: skill.name,
    maxlength: 40,
    "aria-label": "Edit skill name"
  });

  let isFinished = false;

  $name.replaceWith($input);
  $input.trigger("focus").trigger("select");

  function finishEditing(save, fromBlur) {
    if (isFinished) {
      return;
    }

    isFinished = true;

    if (!save) {
      $item.replaceWith(createSkillItem(skill));
      filterSkills($("#skillSearch").val());
      return;
    }

    validateSkill($input.val(), id, function (newName) {
      skills = skills.map(function (s) {
        return s.id === id ? Object.assign({}, s, { name: newName }) : s;
      });

      const $updated = createSkillItem(findSkill(id)).hide();
      $item.replaceWith($updated);
      $updated.fadeIn(250);
      filterSkills($("#skillSearch").val());

      if (newName !== skill.name) {
        showSkillMessage("\"" + skill.name + "\" was renamed to \"" + newName + "\".", false);
      }
    }, function (errorMessage) {
      showSkillMessage(errorMessage, true);

      if (fromBlur) {
        $item.replaceWith(createSkillItem(skill));
        filterSkills($("#skillSearch").val());
      } else {
        isFinished = false;
        $input.trigger("focus").trigger("select");
      }
    });
  }

  $input.on("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      finishEditing(true, false);
    } else if (event.key === "Escape") {
      event.preventDefault();
      finishEditing(false, false);
    }
  });

  $input.on("blur", function () {
    finishEditing(true, true);
  });
}

function clearSkillForm() {
  $("#skillForm").find("input").val("");
  $("#skillCategory").prop("selectedIndex", 0);
  $("#skillMessage").text("");
}

function handleSkillInputKeys(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addSkill();
  } else if (event.key === "Escape") {
    event.preventDefault();
    clearSkillForm();
  }
}

function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function toDateValue(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return date.getFullYear() + "-" + month + "-" + day;
}

function daysUntilDeadline(deadline) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const differenceInMs = deadline.getTime() - getToday().getTime();

  return Math.round(differenceInMs / millisecondsPerDay);
}

function formatDaysLeft(days) {
  if (days > 1) {
    return days + " days left";
  } else if (days === 1) {
    return "1 day left";
  } else if (days === 0) {
    return "Due today";
  } else {
    return "Deadline passed";
  }
}

function getProjectStatus(deadline) {
  const deadlineTime = deadline.getTime();
  const todayTime = getToday().getTime();

  if (deadlineTime > todayTime || deadlineTime === todayTime) {
    return "Ongoing";
  } else if (deadlineTime < todayTime) {
    return "Completed";
  }
}

function renderProjects() {
  const $projectList = $("#projectList").empty();

  for (let i = 0; i < projects.length; i++) {
    const status = getProjectStatus(projects[i].deadline);
    const isOngoing = status === "Ongoing";

    const $card = $("<article>", { class: "card h-100 bg-body-tertiary hover-lift" });

    if (isOngoing) {
      $card.addClass("border-info");
    }

    $card.append($("<img>", {
      src: projects[i].imageURL,
      class: "card-img-top border-bottom",
      alt: projects[i].title + " preview"
    }));

    const $body = $("<div>", { class: "card-body d-flex flex-column" });

    $body.append($("<span>", {
      class: "badge align-self-start mb-2 " + (isOngoing ? "text-bg-info" : "text-bg-success"),
      text: status
    }));

    $body.append($("<h3>", { class: "card-title h4", text: projects[i].title }));
    $body.append($("<p>", { class: "card-text text-body-secondary", text: projects[i].description }));

    const $deadline = $("<p>", { class: "small mb-3" })
      .append($("<span>", { class: "fw-semibold", text: "Deadline: " }))
      .append($("<time>", {
        datetime: toDateValue(projects[i].deadline),
        text: formatDate(projects[i].deadline)
      }));

    if (isOngoing) {
      const daysLeft = daysUntilDeadline(projects[i].deadline);
      $deadline.append($("<span>", {
        class: "badge rounded-pill text-bg-warning ms-1",
        text: formatDaysLeft(daysLeft)
      }));
      console.log("Days until the " + projects[i].title + " deadline: " + daysLeft);
    }

    $body.append($deadline);

    $body.append($("<button>", {
      type: "button",
      class: "btn btn-primary mt-auto align-self-start",
      "data-bs-toggle": "modal",
      "data-bs-target": "#" + projects[i].modalId,
      text: "View details"
    }));

    $card.append($body);

    const $column = $("<div>", { class: "col" }).append($card).hide();
    $projectList.append($column);
    $column.fadeIn(400);
  }
}

function sortProjects(order) {
  projects.sort(function (a, b) {
    if (order === "asc") {
      return a.deadline - b.deadline;
    } else {
      return b.deadline - a.deadline;
    }
  });

  renderProjects();
}

function createTable(captionText, columns, rows) {
  const table = document.createElement("table");
  table.className = "table table-striped table-hover align-middle mb-0";

  const caption = document.createElement("caption");
  caption.className = "visually-hidden";
  caption.textContent = captionText;
  table.appendChild(caption);

  const thead = document.createElement("thead");
  thead.className = "table-primary";
  const headerRow = document.createElement("tr");

  for (let i = 0; i < columns.length; i++) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = columns[i].label;
    headerRow.appendChild(th);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  for (let r = 0; r < rows.length; r++) {
    const tr = document.createElement("tr");

    for (let c = 0; c < columns.length; c++) {
      const td = document.createElement("td");
      td.textContent = rows[r][columns[c].key];
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  return table;
}

function renderTables() {
  const educationColumns = [
    { label: "School / University", key: "school" },
    { label: "Degree", key: "degree" },
    { label: "Start", key: "start" },
    { label: "End", key: "end" }
  ];

  const experienceColumns = [
    { label: "Job Title / Role", key: "role" },
    { label: "Company", key: "company" },
    { label: "Start", key: "start" },
    { label: "End", key: "end" }
  ];

  document.getElementById("educationTable").appendChild(
    createTable("Education history", educationColumns, educationData)
  );

  document.getElementById("experienceTable").appendChild(
    createTable("Work experience history", experienceColumns, experienceData)
  );
}

function handleResumeDownload() {
  if (hasDownloadedResume) {
    return;
  }

  hasDownloadedResume = true;

  setTimeout(function () {
    alert("Your resume is downloaded successfully!");
  }, 2000);
}

function incrementDownloadCount() {
  downloadCount++;
  $(".download-count").text(downloadCount);
}

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.documentElement.setAttribute("data-bs-theme", theme);
  document.body.classList.toggle("theme-dark", isDark);
  document.body.classList.toggle("theme-light", !isDark);

  document.body.style.backgroundColor = "";
  document.getElementById("bgColorInput").value = themeDefaults[theme];

  const navButton = document.getElementById("themeToggle");
  const panelButton = document.getElementById("themeTogglePanel");

  if (isDark) {
    navButton.innerHTML = "&#9728; Light";
    navButton.setAttribute("aria-label", "Switch to light theme");
    panelButton.innerHTML = "&#9728; Switch to light theme";
  } else {
    navButton.innerHTML = "&#9790; Dark";
    navButton.setAttribute("aria-label", "Switch to dark theme");
    panelButton.innerHTML = "&#9790; Switch to dark theme";
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-bs-theme");

  if (currentTheme === "dark") {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }
}

function changeFontSize(event) {
  const size = event.target.value;
  document.documentElement.style.fontSize = size + "px";
  document.getElementById("fontSizeValue").textContent = size + "px";
}

function changeBackgroundColor(event) {
  document.body.style.backgroundColor = event.target.value;
}

function resetStyles() {
  document.getElementById("fontSizeInput").value = 16;
  document.documentElement.style.fontSize = "";
  document.getElementById("fontSizeValue").textContent = "16px";

  applyTheme("dark");
}

$(function () {
  renderNavMenu();
  $("#greeting").text(showTimeOfDayGreeting(name));
  console.log(showGreeting(name));

  renderSkills();
  sortProjects("asc");
  renderTables();

  bootstrap.ScrollSpy.getOrCreateInstance(document.body).refresh();

  $(document).on("click", ".scroll-link", function (event) {
    event.preventDefault();
    smoothScrollTo($(this).attr("href"));
    closeMobileMenu();
  });

  $("#skillForm").on("submit", function (event) {
    event.preventDefault();
    addSkill();
  });

  $("#skillInput").on("keydown", handleSkillInputKeys);

  $("#skillSearch").on("input", function () {
    filterSkills($(this).val());
  });

  $(".skill-list").on("click", ".skill-delete", function () {
    removeSkill(Number($(this).closest(".skill-item").attr("data-id")));
  });

  $(".skill-list").on("click", ".skill-name", function () {
    startEditingSkill($(this));
  });

  $(".skill-list").on("keydown", ".skill-name", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      startEditingSkill($(this));
    }
  });

  $(".sort-btn").on("click", function () {
    $(".sort-btn").removeClass("active").attr("aria-pressed", "false");
    $(this).addClass("active").attr("aria-pressed", "true");
    sortProjects($(this).data("order"));
  });

  $(".resume-download").on("click", function () {
    incrementDownloadCount();
    handleResumeDownload();
  });

  $("#themeToggle, #themeTogglePanel").on("click", toggleTheme);
  $("#fontSizeInput").on("input", changeFontSize);
  $("#bgColorInput").on("input", changeBackgroundColor);
  $("#resetStyles").on("click", resetStyles);
});
