function createPlateSVG(text = 'CUSTOM') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 400 200');
  svg.setAttribute('class', 'hero-plate-checker-plate-svg');
  svg.innerHTML = `
    <rect x="4" y="4" width="392" height="192" rx="12" ry="12" fill="#1a1a1a" stroke="#888" stroke-width="3"/>
    <circle cx="30" cy="24" r="5" fill="#555"/>
    <circle cx="370" cy="24" r="5" fill="#555"/>
    <circle cx="30" cy="176" r="5" fill="#555"/>
    <circle cx="370" cy="176" r="5" fill="#555"/>
    <circle cx="200" cy="24" r="4" fill="#555"/>
    <circle cx="200" cy="176" r="4" fill="#555"/>
    <text x="200" y="55" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="22" font-weight="bold" letter-spacing="8">VIC</text>
    <text x="200" y="140" text-anchor="middle" fill="#fff" font-family="'standard', monospace" font-size="72" font-weight="bold" letter-spacing="6" class="hero-plate-checker-plate-text">${text}</text>
    <text x="388" y="145" text-anchor="end" fill="#666" font-family="Arial" font-size="12">.</text>
  `;
  return svg;
}

export default function decorate(block) {
  const heading = block.querySelector('h2, h1');
  const headingText = heading ? heading.textContent.trim() : 'Check your combination';

  const links = block.querySelectorAll('a');
  let seePopularHref = '/browse-styles';
  let seePopularText = 'See popular plates';
  links.forEach((a) => {
    if (a.textContent.toLowerCase().includes('popular')) {
      seePopularHref = a.href;
      seePopularText = a.textContent.trim();
    }
  });

  block.textContent = '';

  // Build two-column layout
  const content = document.createElement('div');
  content.className = 'hero-plate-checker-content';

  // LEFT COLUMN: Form
  const formCol = document.createElement('div');
  formCol.className = 'hero-plate-checker-form-col';

  // Heading
  const h2 = document.createElement('h2');
  h2.className = 'hero-plate-checker-title';
  h2.textContent = headingText;
  formCol.append(h2);

  // Vehicle toggle
  const vehicleToggle = document.createElement('div');
  vehicleToggle.className = 'hero-plate-checker-vehicle-toggle';
  vehicleToggle.innerHTML = `
    <button type="button" class="hero-plate-checker-vehicle-btn active" data-type="car" data-max="6" data-placeholder="CUSTOM">Car</button>
    <span class="hero-plate-checker-vehicle-sep">|</span>
    <button type="button" class="hero-plate-checker-vehicle-btn" data-type="motorbike" data-max="5" data-placeholder="MOTO5">Motorbike</button>
  `;
  formCol.append(vehicleToggle);

  // Text input area
  const inputArea = document.createElement('div');
  inputArea.className = 'hero-plate-checker-input-area';

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.className = 'hero-plate-checker-input';
  textInput.placeholder = 'CUSTOM';
  textInput.maxLength = 6;
  textInput.setAttribute('autocomplete', 'off');
  textInput.setAttribute('spellcheck', 'false');
  inputArea.append(textInput);

  const inputMeta = document.createElement('div');
  inputMeta.className = 'hero-plate-checker-input-meta';

  const inputLabel = document.createElement('span');
  inputLabel.className = 'hero-plate-checker-input-label';
  inputLabel.textContent = 'Enter between 2 and 6 letters/numbers';

  const charCount = document.createElement('span');
  charCount.className = 'hero-plate-checker-char-count';
  charCount.textContent = '0/6';

  inputMeta.append(inputLabel, charCount);
  inputArea.append(inputMeta);
  formCol.append(inputArea);

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'hero-plate-checker-submit';
  submitBtn.textContent = 'Check availability';
  submitBtn.disabled = true;
  formCol.append(submitBtn);

  // See popular plates link
  const popularLink = document.createElement('a');
  popularLink.href = seePopularHref;
  popularLink.className = 'hero-plate-checker-popular-link';
  popularLink.innerHTML = `<span class="hero-plate-checker-popular-arrow">↓</span> ${seePopularText}`;
  formCol.append(popularLink);

  // RIGHT COLUMN: Plate preview
  const previewCol = document.createElement('div');
  previewCol.className = 'hero-plate-checker-preview-col';

  const plateSvg = createPlateSVG('CUSTOM');
  previewCol.append(plateSvg);

  const disclaimer = document.createElement('p');
  disclaimer.className = 'hero-plate-checker-disclaimer';
  disclaimer.textContent = 'Representation of plates provided are for illustrative purposes only';
  previewCol.append(disclaimer);

  content.append(formCol, previewCol);
  block.append(content);

  // INTERACTIVITY

  // Vehicle toggle
  vehicleToggle.querySelectorAll('.hero-plate-checker-vehicle-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      vehicleToggle.querySelectorAll('.hero-plate-checker-vehicle-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const max = parseInt(btn.dataset.max, 10);
      textInput.maxLength = max;
      textInput.placeholder = btn.dataset.placeholder;
      charCount.textContent = `${textInput.value.length}/${max}`;
      inputLabel.textContent = `Enter between 2 and ${max} letters/numbers`;
      if (textInput.value.length > max) {
        textInput.value = textInput.value.slice(0, max);
      }
      const plateText = textInput.value || btn.dataset.placeholder;
      plateSvg.querySelector('.hero-plate-checker-plate-text').textContent = plateText;
      submitBtn.disabled = textInput.value.length < 2;
    });
  });

  // Live plate preview + character counter
  textInput.addEventListener('input', () => {
    const val = textInput.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    textInput.value = val;
    const max = parseInt(textInput.maxLength, 10);
    charCount.textContent = `${val.length}/${max}`;
    const activeBtn = vehicleToggle.querySelector('.hero-plate-checker-vehicle-btn.active');
    const placeholder = activeBtn ? activeBtn.dataset.placeholder : 'CUSTOM';
    plateSvg.querySelector('.hero-plate-checker-plate-text').textContent = val || placeholder;
    submitBtn.disabled = val.length < 2;
  });

  // Submit
  submitBtn.addEventListener('click', () => {
    if (textInput.value.length >= 2) {
      const activeBtn = vehicleToggle.querySelector('.hero-plate-checker-vehicle-btn.active');
      const vehicleType = activeBtn ? activeBtn.dataset.type : 'car';
      window.location.href = `/create/select-a-style?combo=${encodeURIComponent(textInput.value)}&type=${vehicleType}`;
    }
  });

  // Enter key submit
  textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !submitBtn.disabled) {
      submitBtn.click();
    }
  });
}
