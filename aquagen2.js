const tmplColors = {
  背景: [190, 179, 145],
  帽子1: [6, 72, 39],
  帽子2: [19, 84, 49],
  帽子3: [24, 97, 61],
  帽子4: [0, 126, 64],
  帽子5: [18, 177, 108],
  目1: [30, 142, 247],
  目2: [94, 206, 247],
  頬口手1: [0, 0, 255],
  頬口手2: [0, 255, 0],
  腹1: [231, 70, 14],
  腹2: [247, 86, 30],
  腹3: [255, 0, 0],
  腹4: [255, 134, 78],
  足1: [110, 78, 46],
  足2: [142, 110, 78],
  胴体1: [39, 42, 45],
  胴体2: [55, 58, 61],
  胴体3: [71, 74, 77],
  胴体4: [87, 90, 93],
  胴体5: [89, 98, 100],
  胴体6: [103, 106, 109],
};

const defaultColors = {
  背景: [190, 179, 145, 255],
  帽子1: [6, 72, 39, 255],
  帽子2: [19, 84, 49, 255],
  帽子3: [24, 97, 61, 255],
  帽子4: [0, 126, 64, 255],
  帽子5: [18, 177, 108, 255],
  目1: [30, 142, 247, 255],
  目2: [94, 206, 247, 255],
  頬口手1: [247, 86, 30, 255],
  頬口手2: [255, 134, 78, 255],
  腹1: [231, 70, 14, 255],
  腹2: [247, 86, 30, 255],
  腹3: [255, 118, 62, 255],
  腹4: [255, 134, 78, 255],
  足1: [110, 78, 46, 255],
  足2: [142, 110, 78, 255],
  胴体1: [39, 42, 45, 255],
  胴体2: [55, 58, 61, 255],
  胴体3: [71, 74, 77, 255],
  胴体4: [87, 90, 93, 255],
  胴体5: [89, 98, 100, 255],
  胴体6: [103, 106, 109, 255],
};

const transparentColor = [255, 255, 255, 0];

// Color group definitions for automatic generation
const colorGroups = {
  帽子: ['帽子1', '帽子2', '帽子3', '帽子4', '帽子5'],
  目: ['目1', '目2'],
  頬口手: ['頬口手1', '頬口手2'],
  腹: ['腹1', '腹2', '腹3', '腹4'],
  足: ['足1', '足2'],
  胴体: ['胴体1', '胴体2', '胴体3', '胴体4', '胴体5', '胴体6'],
};

// Color generation constants
const COLOR_GEN_MIN_SATURATION = 10;
const COLOR_GEN_MAX_SATURATION = 100;
const COLOR_GEN_BRIGHTNESS_MIN_FACTOR = 0.6; // 60% of original
const COLOR_GEN_BRIGHTNESS_MAX_FACTOR = 0.6; // Range: 60% to 120% (0.6 + 0.6)
const COLOR_GEN_SATURATION_MIN_FACTOR = 0.8; // 80% of original
const COLOR_GEN_SATURATION_MAX_FACTOR = 0.4; // Range: 80% to 120% (0.8 + 0.4)
const SCHEME_GEN_BASE_SATURATION = 70;
const SCHEME_GEN_SATURATION_VARIATION = 20;
const SCHEME_GEN_BASE_VALUE = 60;
const SCHEME_GEN_VALUE_VARIATION = 30;

// Convert RGB to HSV
function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [h * 360, s * 100, v * 100];
}

// Convert HSV to RGB
function hsvToRgb(h, s, v) {
  h /= 360;
  s /= 100;
  v /= 100;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r, g, b;
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 255];
}

// Generate color variations for a group based on base color
function generateColorVariations(baseColor, count) {
  const [r, g, b] = baseColor.slice(0, 3);
  const [h, s, v] = rgbToHsv(r, g, b);

  const variations = [];
  for (let i = 0; i < count; i++) {
    const factor = i / Math.max(count - 1, 1);
    // Vary brightness while keeping hue similar
    const newV =
      v *
      (COLOR_GEN_BRIGHTNESS_MIN_FACTOR +
        factor * COLOR_GEN_BRIGHTNESS_MAX_FACTOR);
    const newS = Math.max(
      COLOR_GEN_MIN_SATURATION,
      Math.min(
        COLOR_GEN_MAX_SATURATION,
        s *
          (COLOR_GEN_SATURATION_MIN_FACTOR +
            factor * COLOR_GEN_SATURATION_MAX_FACTOR),
      ),
    );
    variations.push(hsvToRgb(h, newS, newV));
  }

  return variations;
}

// Generate a full color scheme with distinguishable colors
function generateDistinguishableScheme() {
  const baseHues = [
    0, // Red for 腹 (belly)
    30, // Orange/Brown for 足 (feet)
    120, // Green for 帽子 (hat)
    200, // Blue for 目 (eyes)
    210, // Cyan for 頬口手 (cheek/mouth/hand)
    0, // Grayscale for 胴体 (body)
  ];

  const scheme = {};
  const groupNames = ['腹', '足', '帽子', '目', '頬口手', '胴体'];

  groupNames.forEach((groupName, idx) => {
    const members = colorGroups[groupName];
    if (!members) return;

    if (groupName === '胴体') {
      // Body uses grayscale
      members.forEach((member, i) => {
        const value = 30 + (i / Math.max(members.length - 1, 1)) * 50;
        scheme[member] = hsvToRgb(0, 0, value);
      });
    } else {
      const baseColor = hsvToRgb(
        baseHues[idx],
        SCHEME_GEN_BASE_SATURATION +
          Math.random() * SCHEME_GEN_SATURATION_VARIATION,
        SCHEME_GEN_BASE_VALUE + Math.random() * SCHEME_GEN_VALUE_VARIATION,
      );
      const variations = generateColorVariations(baseColor, members.length);
      members.forEach((member, i) => {
        scheme[member] = variations[i];
      });
    }
  });

  // Background
  scheme['背景'] = [190, 179, 145, 255];

  return scheme;
}

let aquaTmplImage;

function toRgb(arr) {
  return (
    '#' +
    arr
      .slice(0, 3)
      .map((item) => ('00' + item.toString(16)).slice(-2))
      .join('')
  ); // 透明度はinputが受け付けない
}

function fromRgb(str) {
  str = str.replace(/#/, '');
  if (str.length !== 6) throw new Error('invalid value');

  return [
    parseInt(str.slice(0, 2), 16),
    parseInt(str.slice(2, 4), 16),
    parseInt(str.slice(4, 6), 16),
    255, // inputが透明度寄越さないのでデフォ
  ];
}

function toHex(arr) {
  return (arr[0] << 16) | (arr[1] << 8) | arr[2];
}

function getNewColorMap() {
  const colors = {};
  $('#inputform input[type="color"]').each((_, elem) => {
    elem = $(elem);
    colors[elem.attr('name')] = fromRgb(elem.val());
  });

  return colors;
}

function updateAquatan() {
  const canvas = document.querySelector('#output').getContext('2d');
  canvas.drawImage(aquaTmplImage, 0, 0);

  const image = canvas.getImageData(0, 0, 128, 128);
  const colors = getNewColorMap();
  const bgTrans = $('#bg_trans').prop('checked');

  const replacementTable = new Map();
  for (const itemName of Object.keys(tmplColors)) {
    const key = toHex(tmplColors[itemName]);

    if (itemName === '背景' && bgTrans) {
      replacementTable.set(key, transparentColor);
    } else {
      replacementTable.set(key, colors[itemName] || tmplColors[itemName]);
    }
  }

  for (let i = 0; i < image.data.length; i += 4) {
    const key = toHex(image.data.slice(i, i + 3));
    if (replacementTable.has(key)) {
      const rep = replacementTable.get(key);
      image.data[i] = rep[0];
      image.data[i + 1] = rep[1];
      image.data[i + 2] = rep[2];
      image.data[i + 3] = rep[3];
    }
  }

  canvas.putImageData(image, 0, 0);

  console.log('done');
}

let previewCount = 0;
let previewPose = 0;

function updatePreviewFrame() {
  const previewElem = document.querySelector('#preview');
  const outputElem = document.querySelector('#output');
  const previewCtx = previewElem.getContext('2d');
  previewCount++;
  if (previewCount == 4) previewCount = 0;

  previewCtx.clearRect(0, 0, 32, 32);
  previewCtx.drawImage(
    outputElem,
    previewCount * 32,
    previewPose * 32,
    32,
    32,
    0,
    0,
    32,
    32,
  );
}

function createGifAndDownload() {
  const outputElem = document.querySelector('#output');
  const delay = $('#preview_interval').val();
  const zoom = $('#gif_zoom').val();

  const gif = new GIF({
    quality: 4,
    width: 32 * zoom,
    height: 32 * zoom,
    globalPalette: true,
  });
  const gifCanvas = document.createElement('canvas');
  gifCanvas.width = 32 * zoom;
  gifCanvas.height = 32 * zoom;
  gifCanvas.style.imageRendering = 'pixelated';
  const ctx = gifCanvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  for (let i = 0; i < 4; i++) {
    ctx.clearRect(0, 0, 32 * zoom, 32 * zoom);
    ctx.drawImage(
      outputElem,
      i * 32,
      previewPose * 32,
      32,
      32,
      0,
      0,
      32 * zoom,
      32 * zoom,
    );
    gif.addFrame(ctx, { copy: true, delay });
  }

  gif.on('finished', (blob) => {
    const link = document.createElement('a');
    link.download = 'aquatan.gif';
    link.href = URL.createObjectURL(blob);

    link.click();
  });
  gif.render();
}

// Apply colors from a scheme to the input fields
function applyColorScheme(scheme) {
  for (const [name, color] of Object.entries(scheme)) {
    const input = $(`input[name="${name}"]`);
    if (input.length) {
      input.val(toRgb(color));
    }
  }
  updateAquatan();
}

// Generate variations for a specific color group
function generateGroupColors(groupName) {
  const members = colorGroups[groupName];
  if (!members || members.length === 0) return;

  // Get the base color from the first member of the group
  const baseInput = $(`input[name="${members[0]}"]`);
  if (!baseInput.length) return;

  const baseColor = fromRgb(baseInput.val());
  const variations = generateColorVariations(baseColor, members.length);

  const scheme = {};
  members.forEach((member, i) => {
    scheme[member] = variations[i];
  });

  applyColorScheme(scheme);
}

// Auto-generate all colors
function autoGenerateAllColors() {
  const scheme = generateDistinguishableScheme();
  applyColorScheme(scheme);
}

$(document).ready(() => {
  const inputForm = $('#inputform');

  // Add auto-generate all button at the top
  $('<div>')
    .css({
      width: '100%',
      padding: '10px 0',
      'border-bottom': '2px solid #ccc',
      'margin-bottom': '10px',
    })
    .append(
      $('<button>')
        .attr('type', 'button')
        .text('🎨 全体の色を自動生成')
        .css({ padding: '8px 16px', 'font-size': '14px', cursor: 'pointer' })
        .click(() => autoGenerateAllColors()),
    )
    .appendTo(inputForm);

  // Create sections for each color group
  const processedItems = new Set();

  for (const [groupName, members] of Object.entries(colorGroups)) {
    const groupDiv = $('<div>').css({
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      margin: '5px 0',
      background: '#f9f9f9',
    });

    // Add group header with auto-generate button
    const headerDiv = $('<div>').css({
      display: 'flex',
      'align-items': 'center',
      'margin-bottom': '8px',
      'font-weight': 'bold',
    });

    headerDiv.append($('<span>').text(groupName + ' '));
    headerDiv.append(
      $('<button>')
        .attr('type', 'button')
        .text('色を自動生成')
        .css({
          'margin-left': '10px',
          padding: '4px 8px',
          'font-size': '12px',
          cursor: 'pointer',
        })
        .click(() => generateGroupColors(groupName)),
    );

    groupDiv.append(headerDiv);

    // Add individual color inputs for this group
    const colorsDiv = $('<div>').css({ display: 'flex', 'flex-wrap': 'wrap' });
    members.forEach((itemName) => {
      $('<div>')
        .css({ padding: '0 0.4em' })
        .append($('<label>').text(itemName))
        .append(
          $('<input>')
            .attr({
              name: itemName,
              type: 'color',
              default: toRgb(defaultColors[itemName]),
              value: toRgb(defaultColors[itemName] || tmplColors[itemName]),
            })
            .on('change', () => updateAquatan()),
        )
        .appendTo(colorsDiv);
      processedItems.add(itemName);
    });

    groupDiv.append(colorsDiv);
    groupDiv.appendTo(inputForm);
  }

  // Add remaining items (like 背景) that aren't in groups
  for (const itemName of Object.keys(tmplColors)) {
    if (!processedItems.has(itemName)) {
      $('<div>')
        .append($('<label>').text(itemName))
        .append(
          $('<input>')
            .attr({
              name: itemName,
              type: 'color',
              default: toRgb(defaultColors[itemName]),
              value: toRgb(defaultColors[itemName] || tmplColors[itemName]),
            })
            .on('change', () => updateAquatan()),
        )
        .appendTo(inputForm);
    }
  }

  $('#bg_trans').on('change', () => updateAquatan());
  $('form').on('reset', () => {
    setTimeout(() => updateAquatan(), 10); // TODO: こういう実装嫌いなんだが
  });

  $('#download').click(() => {
    const outputElem = document.querySelector('#output');

    const link = document.createElement('a');
    link.download = 'aquatan.png';
    link.href = outputElem.toDataURL('image/png');

    link.click();
  });

  $('#gif_download').click(() => {
    createGifAndDownload();
  });

  aquaTmplImage = document.createElement('img');
  aquaTmplImage.addEventListener('load', () => updateAquatan());
  aquaTmplImage.src = '15000.png';

  const previewElem = document.querySelector('#preview');

  let timer = setInterval(updatePreviewFrame, 250);
  $('#preview_interval').on('change', () => {
    clearInterval(timer);
    timer = setInterval(updatePreviewFrame, $('#preview_interval').val());
  });

  previewElem.addEventListener('click', () => {
    previewPose++;
    if (previewPose == 4) previewPose = 0;
  });
});
