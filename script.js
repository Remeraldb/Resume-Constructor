"use strict";

// Class for Personal Information
class PersonalInfo {
  constructor(name, email, age) {
    this._name = name;
    this._email = email;
    this._age = age;
  }

  // Getter and Setter for name
  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  // Getter and Setter for email
  get email() {
    return this._email;
  }

  set email(value) {
    this._email = value;
  }

  // Getter and Setter for age
  get age() {
    return this._age;
  }

  set age(value) {
    this._age = value;
  }

  display(isEditable = false) {
    return `
      <h2>${isEditable ? `<input type="text" name="name" value="${this._name}" />` : this._name}</h2>
      <p>Email: ${isEditable ? `<input type="email" name="email" value="${this._email}" />` : this._email}</p>
      <p>Вік: ${isEditable ? `<input type="number" name="age" value="${this._age}" />` : this._age}</p>
    `;
  }
}

// Base Class for Resume Items (Education, Experience, Skills)
class ResumeItem {
  constructor(value) {
    this._value = value;
  }

  // Getter and Setter for value
  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
  }

  // Display method to be overridden in child classes
  display(isEditable = false) {
    throw new Error("Display method must be implemented in subclasses.");
  }
}

// Class for Education - Inherits from ResumeItem
class Education extends ResumeItem {
  constructor(school) {
    super(school);  // Call the parent constructor with school name
  }

  display(isEditable = false) {
    return `
      <h3>Освіта</h3>
      ${isEditable ? `<input type="text" name="education" value="${this._value}" />` : `<p>${this._value}</p>`}
    `;
  }
}

// Class for Experience - Inherits from ResumeItem
class Experience extends ResumeItem {
  constructor(company) {
    super(company);  // Call the parent constructor with company name
  }

  display(isEditable = false) {
    return `
      <h3>Досвід</h3>
      ${isEditable ? `<input type="text" name="experience" value="${this._value}" />` : `<p>${this._value}</p>`}
    `;
  }
}

// Class for Skills - Inherits from ResumeItem
class Skills extends ResumeItem {
  constructor(skills) {
    super(skills.split(",").map(s => s.trim()));  // Split skills by comma
  }

  // Getter and Setter for skills
  get skills() {
    return this._value;
  }

  set skills(value) {
    this._value = value.split(",").map(s => s.trim());
  }

  display(isEditable = false) {
    return `
      <h3>Навички</h3>
      ${isEditable ? `<input type="text" name="skills" value="${this._value.join(', ')}" />` : `<ul>${this._value.map(s => `<li>${s}</li>`).join("")}</ul>`}
    `;
  }
}

// Class for Complete Resume
class Resume {
  constructor(info, edu, exp, skills) {
    this._info = info;
    this._edu = edu;
    this._exp = exp;
    this._skills = skills;
  }

  // Getter and Setter for info
  get info() {
    return this._info;
  }

  set info(value) {
    this._info = value;
  }

  // Getter and Setter for education
  get edu() {
    return this._edu;
  }

  set edu(value) {
    this._edu = value;
  }

  // Getter and Setter for experience
  get exp() {
    return this._exp;
  }

  set exp(value) {
    this._exp = value;
  }

  // Getter and Setter for skills
  get skills() {
    return this._skills;
  }

  set skills(value) {
    this._skills = value;
  }

  render(isEditable = false) {
    return `
      ${this._info.display(isEditable)}
      ${this._edu.display(isEditable)}
      ${this._exp.display(isEditable)}
      ${this._skills.display(isEditable)}
      ${isEditable ? `<button class="save-btn">Зберегти зміни</button>` : ''}
    `;
  }
}

// Elements
const formContainer = document.getElementById("form-container");
const modal = document.getElementById("resume-modal");
const resumeDisplay = document.getElementById("resume-display");
const closeBtn = document.querySelector(".close-btn");

const mainMenu = document.getElementById("main-menu");
const createBtn = document.getElementById("create-btn");
const showBtn = document.getElementById("show-btn");
const clearBtn = document.getElementById("clear-btn");
const aboutBtn = document.getElementById("about-btn");

// Reusable function to render form
function renderForm(data = null, index = null) {
  formContainer.innerHTML = `
    <form id="resume-form">
      <input type="text" name="name" placeholder="Ім'я" value="${data?.name || ''}" required />
      <input type="email" name="email" placeholder="Email" value="${data?.email || ''}" required />
      <input type="number" name="age" placeholder="Вік" value="${data?.age || ''}" required />
      <input type="text" name="education" placeholder="Освіта" value="${data?.education || ''}" required />
      <input type="text" name="experience" placeholder="Досвід роботи" value="${data?.experience || ''}" required />
      <input type="text" name="skills" placeholder="Навички (через кому)" value="${data?.skills || ''}" required />
      <button type="submit">${index !== null ? 'Зберегти зміни' : 'Згенерувати резюме'}</button>
    </form>
  `;

  const form = document.getElementById("resume-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const { name, email, age, education, experience, skills } = form;

    const info = new PersonalInfo(name.value, email.value, age.value);
    const edu = new Education(education.value);
    const exp = new Experience(experience.value);
    const skillSet = new Skills(skills.value);
    const resume = new Resume(info, edu, exp, skillSet);

    let resumes = JSON.parse(localStorage.getItem("resumes")) || [];

    if (index !== null) {
      resumes[index] = {
        name: name.value,
        email: email.value,
        age: age.value,
        education: education.value,
        experience: experience.value,
        skills: skills.value
      };
    } else {
      resumes.push({
        name: name.value,
        email: email.value,
        age: age.value,
        education: education.value,
        experience: experience.value,
        skills: skills.value
      });
    }

    localStorage.setItem("resumes", JSON.stringify(resumes));

    // Test the form submission
    console.log("Form Submitted:");
    console.log(resume);

    if (index === null) {
      resumeDisplay.innerHTML = resume.render();
      modal.classList.remove("hidden");
      formContainer.innerHTML = ''; 
    } else {
      formContainer.innerHTML = ''; 
      displaySavedResumes();
    }
  });
}

// Function to render all saved resumes
function displaySavedResumes() {
  const container = document.getElementById("saved-resumes-container");
  const resumes = JSON.parse(localStorage.getItem("resumes")) || [];

  if (resumes.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>Немає збережених резюме.</p>";
    return;
  }

  container.innerHTML = resumes.map((data, index) => {
    const resume = new Resume(
      new PersonalInfo(data.name, data.email, data.age),
      new Education(data.education),
      new Experience(data.experience),
      new Skills(data.skills)
    );
    return `
      <div class="resume-card">
        <h3>Резюме #${index + 1}</h3>
        ${resume.render()}
        <button class="edit-btn" data-index="${index}">Редагувати</button>
      </div>
    `;
  }).join("");
  
  // Test resume rendering
  console.log("Saved Resumes:");
  console.log(resumes);

  // Add event listeners for editing resumes
  document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      const resumes = JSON.parse(localStorage.getItem("resumes"));
      const resumeData = resumes[index];

      const resume = new Resume(
        new PersonalInfo(resumeData.name, resumeData.email, resumeData.age),
        new Education(resumeData.education),
        new Experience(resumeData.experience),
        new Skills(resumeData.skills)
      );
      
      // Render resume with editable fields
      const selectedResume = document.querySelectorAll(".resume-card")[index];
      selectedResume.innerHTML = resume.render(true);  // Make fields editable

      // Save changes after editing
      selectedResume.querySelector(".save-btn").addEventListener("click", () => {
        const updatedData = {
          name: selectedResume.querySelector("[name='name']").value,
          email: selectedResume.querySelector("[name='email']").value,
          age: selectedResume.querySelector("[name='age']").value,
          education: selectedResume.querySelector("[name='education']").value,
          experience: selectedResume.querySelector("[name='experience']").value,
          skills: selectedResume.querySelector("[name='skills']").value
        };
        
        resumes[index] = updatedData;
        localStorage.setItem("resumes", JSON.stringify(resumes));

        // Test resume edit and save
        console.log("Updated Resume:");
        console.log(updatedData);

        displaySavedResumes();  // Refresh list with updated resume
      });
    });
  });
}

// Function to handle JSON loading
function loadJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = event => {
      try {
        const jsonData = JSON.parse(event.target.result);
        if (Array.isArray(jsonData)) {
          localStorage.setItem("resumes", JSON.stringify(jsonData));
          displaySavedResumes();
          alert("Резюме успішно завантажені!");
        } else {
          throw new Error("Файл має містити масив резюме");
        }
      } catch (error) {
        alert("Помилка при завантаженні файлу: " + error.message);
      }
    };
    
    reader.readAsText(file);
  };

  input.click();
}

// Function to handle JSON download
function downloadJSON() {
  const resumes = JSON.parse(localStorage.getItem("resumes")) || [];
  const jsonContent = JSON.stringify(resumes, null, 2);

  // Test JSON content
  console.log("Downloading JSON:");
  console.log(jsonContent);

  saveToFile(jsonContent, 'resumes.json');
}

function saveToFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Event Handlers
createBtn.addEventListener("click", () => {
  if (formContainer.innerHTML !== '') {
    formContainer.innerHTML = ''; 
  } else {
    renderForm();  
  }
});

let isResumesVisible = false;
const container = document.getElementById("saved-resumes-container");

showBtn.addEventListener("click", () => {
  if (isResumesVisible) {
    container.classList.add("hidden");
  } else {
    displaySavedResumes();
    container.classList.remove("hidden");
  }
  isResumesVisible = !isResumesVisible;
});


clearBtn.addEventListener("click", () => {
  localStorage.removeItem("resumes");
  displaySavedResumes();
});

closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
aboutBtn.addEventListener("click", () => alert("Про застосунок: Це простий конструктор резюме. Створено з ❤️ для навчальних цілей."));

const downloadJSONButton = document.getElementById('download-json-btn');
downloadJSONButton.addEventListener('click', downloadJSON);

const loadJSONButton = document.getElementById('load-json-btn');
loadJSONButton.addEventListener('click', loadJSON);