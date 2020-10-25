const mainDiv = document.getElementById("app"),
    form = document.getElementById("ema-form"),
    buttonSender = document.getElementById('sendjson'),
    app = document.getElementById('app');

let regex = /^(1\s?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{4}$/;
// mask(text) {
//   return (regex).test(text);
//   }

buttonSender.addEventListener('change', function (e) {
    try {
        const upload = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (function (file) {
            return function (e) {
                json = JSON.parse(e.target.result);
                drawForm(json);
            }
        })(sendjson));
        reader.readAsText(upload);
        app.innerHTML = " ";
    } catch (error) {
        console.log(error);
    }
});

function drawForm(json) {
  fieldsParser(json)
  referencesParser(json)
  buttonParser(json)  
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
        <input type="${obj.input.type}" placeholder="${obj.input.placeholder}" accept=".png, .pdf, .jpeg" required><br>
      `);
      }

      else if (obj.input.hasOwnProperty("mask")) {
        app.insertAdjacentHTML("beforeend", `
        <label>${obj.label}</label>
        <input type="${obj.input.type}" placeholder="${obj.input.mask}" pattern="${regex}" required><br>
        `);
      }

      else if (obj.input.required && obj.hasOwnProperty("label")) {
        app.insertAdjacentHTML("beforeend", `
          <label>${obj.label}</label>
          <input type="${obj.input.type}" placeholder="${obj.input.placeholder}" required><br>
        `);
      } 
      else if (obj.input.required && !obj.hasOwnProperty("label")) {
         app.insertAdjacentHTML("beforeend", `
         <input type="${obj.input.type}" placeholder="${obj.input.placeholder}" required><br>
        `);
      } 
      else {
        app.insertAdjacentHTML("beforeend", `
          <label>${obj.label}</label>
          <input type="${obj.input.type}" placeholder="${obj.input.placeholder}"><br>
        `);
      }
    }
    app.classList.add("main__form");
    return " ";
}

function referencesParser(json) {
  let item = document.createElement("div");
  item.setAttribute("class", "ref__item")
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
      <button>${obj.text}</button>
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


/* to- do
1. problem with absenting labels in signup Done
2. problem with parsing the mask in interview.json Done
3. multiple choice in interview.json Done
4. colorscheme
5. styles for beauty and responsive view
*/


