const app = document.getElementById("app"),
    buttonSender = document.getElementById('upload__button'),
    hiddenInput = document.getElementById("sendjson"),
    spanUpload = document.getElementById("upload__span");

let regex = /^(1\s?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{4}$/; //regex for telephone number validation

buttonSender.addEventListener('click', function() {
  hiddenInput.click();
});

hiddenInput.addEventListener('change', function (e) {
  if (hiddenInput.value) {
    spanUpload.innerHTML = hiddenInput.value.match(
      /[\/\\]([\w\d\s\.\-\(\)]+)$/
    )[1];
  } else {
    spanUpload.innerHTML = "No file chosen, yet.";
  }
    try {
        const upload = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (function (file) {
            return function (e) {
                json = JSON.parse(e.target.result);
                drawForm(json);
            };
        })(sendjson));
        reader.readAsText(upload);
        app.innerHTML = " ";
    } catch (error) {
        console.log(error);
    }
});

function drawForm(json) {
  fieldsParser(json);
  referencesParser(json);
  buttonParser(json);
  app.style.padding = "2.5em";
}

function fieldsParser(json) {
  app.insertAdjacentHTML("afterbegin", `
    <h1 class="app-title">${json.name}</h1> `);
    
    for (let i = 0; i < json.fields.length; i++) {
      let obj = json.fields[i];

      if (obj.input.hasOwnProperty("technologies")) {
        multipleInput(obj);
      }
      
      else if (obj.input.hasOwnProperty("filetype")) {
        app.insertAdjacentHTML("beforeend", `
        <label>${obj.label}</label>
        <input type="${obj.input.type}" placeholder="${obj.input.placeholder}" accept=".png, .pdf, .jpeg" required multiple><br>
      `);
      }

      else if (obj.input.hasOwnProperty("mask")) {
        app.insertAdjacentHTML("beforeend", `
        <label>${obj.label}</label>
        <input type="${obj.input.type}" placeholder="${obj.input.mask}" pattern="${regex}" required><br>
        `);
      }

      else if (requiredLabelChecker(obj)) {
        app.insertAdjacentHTML("beforeend", `
          <label>${obj.label}</label>
          <input type="${obj.input.type}" placeholder="${obj.input.placeholder ? obj.input.placeholder : " "}" required><br>
        `);
      } 
      else if (!requiredLabelChecker(obj)) {
         app.insertAdjacentHTML("beforeend", `
         <input type="${obj.input.type}" placeholder="${obj.input.placeholder}" required><br>
        `);
      } 
      else {
        app.insertAdjacentHTML("beforeend", `
          <label>${obj.label}</label>
          <input type="${obj.input.type}" placeholder="${obj.input.placeholder ? obj.input.placeholder : " "}"><br>
        `);
      }
    }
    app.classList.add("main__form");
    return " ";
}

function referencesParser(json) {
  let item = document.createElement("div");
  item.setAttribute("class", "ref__item");
  for (let i = 0; i < json.references.length; i++) {
    let obj = json.references[i];
    if (obj.hasOwnProperty('input')) {
      item.insertAdjacentHTML("beforeend", `
        <input type="${obj.input.type}" ${obj.input.required} ${obj.input.checked}>
      `);
    } else {
      item.insertAdjacentHTML("beforeend" , `
        ${obj["text without ref"] ? obj["text without ref"] : " "}  <a href="${obj.ref}"> ${ obj.text}</a>
      `);
    }
  }
 app.appendChild(item); 
    return " ";
}

function buttonParser(json) {
  for (let i = 0; i < json.buttons.length; i++) {
    let obj = json.buttons[i];
    app.insertAdjacentHTML("beforeend", `
      <button class="form__buttons">${obj.text}</button>
    `);
  }
    return " ";
}

function multipleInput(obj) {
      app.insertAdjacentHTML("beforeend", `
      <label>${obj.label}</label>
      `);
      for (let j = 0; j < obj.input.technologies.length; j++) {
        app.insertAdjacentHTML("beforeend", `
        <div class="multiple_input">
          ${obj.input.technologies[j]}<input type="checkbox" required multiple>
        </div>
      `);
    }
}

function requiredLabelChecker(obj) {
    if (obj.hasOwnProperty("label")) {
      return true;
    } else { return false; }
}




