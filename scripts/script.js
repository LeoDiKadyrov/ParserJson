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

      else if (obj.input.hasOwnProperty("colors")) {
        app.insertAdjacentHTML("beforeend", `
          <label>${obj.label}</label>
          <input type="${obj.input.type}" list="colors">
          <datalist id="colors">
            
          </datalist>
        `);
        colorschemeParser(obj);
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
        <input id="number-input" type="text" placeholder="${obj.input.mask}" mask="${obj.input.mask}"
         maxlength="${obj.input.mask.length}" minlength="${obj.input.mask.length}" required><br>
        `);
        inputMask();
      }

      else if (obj.hasOwnProperty("label")) {
        app.insertAdjacentHTML("beforeend", `
          <label>${obj.label}</label>
          <input type="${obj.input.type}" placeholder="${obj.input.placeholder ? obj.input.placeholder : " "}" required><br>
        `);
      } 
      else if (!obj.hasOwnProperty("label")) {
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

function colorschemeParser(obj) {
  let colors = obj.input.colors;
  let dataset = document.getElementById('colors');
  for (let i = 0; i< colors.length; i++) {
    dataset.insertAdjacentHTML("beforeend", `<option value="${colors[i]}"></option>`);
  }
}

function inputMask() {
  $("input[mask]")
    .keydown(function(e) {
      let key = e.key;
      let input = $(this);
      let mask = $(this).attr("mask");
      let currentSymbol = input.val().length;
      console.log(currentSymbol);
      if (
        mask[currentSymbol] != 9 &&
        key !== "Backspace" &&
						key !== "Tab" &&
						key !== "Delete" &&
						input.val().length < mask.length
      ) {
        addMaskSymbol(input, mask, currentSymbol);
      }

      return (
        key == "Backspace" ||
        key == "Tab" ||
        key == "Delete" ||
        (key >= 0 && key <= 9)
      );

    })
    .bind("focus click", function () {
      let input = $(this);
      let mask = $(this).attr("mask");
      let currentSymbol = input.val().length;

      if (input.val().length === 0 && mask[currentSymbol] != 9) {
        addMaskSymbol(input, mask, currentSymbol);
      } else {
        let val = input.val();
        input.val("").val(val);
      }
    });
    function addMaskSymbol(input, mask, currentSymbol) {
      let value = mask[currentSymbol];
      input.val(input.val() + value);
      if (
        mask[currentSymbol + 1] != 9 &&
        mask[currentSymbol + 1] != null
      )
        addMaskSymbol(input, mask, currentSymbol + 1);
    }
}

