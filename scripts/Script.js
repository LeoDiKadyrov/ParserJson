const mainDiv = document.getElementById("app"),
    form = document.getElementById("ema-form");

let regex = /^(1\s?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{4}$/;
    
let json = (function() {
    let json = null;
    $.ajax({
      'async': false,
      'global': false,
      'url': "./json/interview.json",
      'dataType': "json",
      'success': function(data) {
        json = data;
      }
    });
    return json;
  })();

mainDiv.insertAdjacentHTML("afterbegin", `
  <h1 class="app-title">${json.name}</h1>
  ${fieldsParser(json)}
  ${referencesParser(json)}
  ${buttonParser(json)}
`);

function fieldsParser(json) {
    for (let i = 0; i < json.fields.length; i++) {
      let obj = json.fields[i];
      console.log(obj.input.mask.length);
      if (obj.input.required && obj.hasOwnProperty("label")) {
        form.insertAdjacentHTML("beforeend", `
          <label>${obj.label}</label>
          <input type="${obj.input.type}" placeholder="${obj.input.placeholder}" pattern="${regex}" maxlength="${obj.input.mask.length}" required><br>
        `);
      } else if (obj.input.required && !obj.hasOwnProperty("label")) {
         form.insertAdjacentHTML("beforeend", `
         <input type="${obj.input.type}" placeholder="${obj.input.placeholder}" pattern="${regex}" maxlength="${obj.input.mask.length}" required><br>
        `);
      } else {
        form.insertAdjacentHTML("beforeend", `
          <label>${obj.label}</label>
          <input type="${obj.input.type}" placeholder="${obj.input.placeholder}" pattern="${regex}" maxlength="${obj.input.mask.length}"><br>
        `);
      }
    }
    form.classList.add("main__form");
    return " ";
}

function referencesParser(json) {
  for (let i = 0; i < json.references.length; i++) {
    let obj = json.references[i];
    if (obj.hasOwnProperty('input')) {
      form.insertAdjacentHTML("beforeend", `
        <input type="${obj.input.type}" ${obj.input.required} ${obj.input.checked}>
      `);
    } else {
      form.insertAdjacentHTML("beforeend" , `
        <a href="${obj.ref}">${obj.text}</a>
      `);
    }
  }
    return " ";
}

function buttonParser(json) {
  for (let i = 0; i < json.buttons.length; i++) {
    let obj = json.buttons[i];
    form.insertAdjacentHTML("beforeend", `
      <button>${obj.text}</button>
    `);
  }
    return " ";
}

/* to- do
1. problem with absenting labels in signup Done
2. problem with parsing the mask in interview.json
3. multiple choice in interview.json
*/


