# Ex16 - Dynamic Forms

## Objectif
Créer et manipuler des formulaires dynamiques.

## Ajouter des champs

```javascript
function addField(form, name, type = 'text') {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  form.appendChild(input);
  return input;
}

// Ajouter un groupe de champs
function addFieldGroup(form, fields) {
  const group = document.createElement('div');
  group.className = 'field-group';

  fields.forEach(({ name, type, label }) => {
    const labelEl = document.createElement('label');
    labelEl.textContent = label;

    const input = document.createElement('input');
    input.type = type;
    input.name = name;

    labelEl.appendChild(input);
    group.appendChild(labelEl);
  });

  form.appendChild(group);
  return group;
}
```

## Champs répétables

```javascript
// Liste de champs qu'on peut ajouter/supprimer
function createRepeatableField(container, template) {
  let counter = 0;

  function addItem() {
    const item = document.createElement('div');
    item.className = 'repeatable-item';

    const input = document.createElement('input');
    input.name = `items[${counter}]`;
    input.placeholder = template.placeholder;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '×';
    removeBtn.onclick = () => item.remove();

    item.append(input, removeBtn);
    container.appendChild(item);
    counter++;
  }

  return { addItem };
}
```

## Champs conditionnels

```javascript
// Afficher un champ selon une condition
const countrySelect = form.elements.country;
const stateInput = form.elements.state;

countrySelect.addEventListener('change', () => {
  stateInput.parentElement.hidden = countrySelect.value !== 'US';
  stateInput.required = countrySelect.value === 'US';
});
```

## Formulaire multi-étapes

```javascript
class MultiStepForm {
  constructor(form, steps) {
    this.form = form;
    this.steps = steps;
    this.currentStep = 0;
  }

  showStep(index) {
    this.steps.forEach((step, i) => {
      step.hidden = i !== index;
    });
    this.currentStep = index;
  }

  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.showStep(this.currentStep + 1);
    }
  }

  prev() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  }
}
```
