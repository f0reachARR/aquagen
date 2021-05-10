const tmplColors = {
  背景: [190, 179, 145],
  帽子1: [34, 172, 56],
  帽子2: [137, 201, 151],
  目: [126, 206, 244],
  頬: [255, 127, 39],
  口: [255, 0, 0],
  手: [239, 228, 176],
  腹: [255, 242, 0],
  足: [110, 78, 46],
  頭: [137, 87, 161],
  胴体: [112, 146, 190],
};

const defaultColors = {
  背景: [190, 179, 145],
  帽子1: [34, 172, 56],
  帽子2: [137, 201, 151],
  目: [126, 206, 244],
  頬: [255, 0, 0],
  口: [255, 0, 0],
  手: [255, 0, 0],
  腹: [255, 0, 0],
  足: [110, 78, 46],
  頭: [137, 87, 161],
  胴体: [137, 87, 161],
};

function toRgb(arr) {
  return '#' + arr.map((item) => ('00' + item.toString(16)).slice(-2)).join('');
}

function fromRgb(str) {
  str = str.replace(/#/, '');
  if (str.length !== 6) throw new Error('invalid value');

  return [
    parseInt(str.slice(0, 2), 16),
    parseInt(str.slice(2, 4), 16),
    parseInt(str.slice(4, 6), 16),
  ];
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
  const tmpl = document.querySelector('#aquatmpl');
  const canvas = document.querySelector('#output').getContext('2d');
  canvas.drawImage(tmpl, 0, 0);

  const image = canvas.getImageData(0, 0, 128, 128);
  const colors = getNewColorMap();
  const bgTrans = $('#bg_trans').prop('checked');

  const replacementTable = new Map();
  for (const itemName of Object.keys(tmplColors)) {
    if (itemName === '背景' && bgTrans) {
      replacementTable.set(tmplColors[itemName].join('-'), [255, 255, 255, 0]);
    } else {
      replacementTable.set(
        tmplColors[itemName].join('-'),
        colors[itemName] || tmplColors[itemName]
      );
    }
  }

  for (let i = 0; i < image.data.length; i += 4) {
    const key = Array.from(image.data.slice(i, i + 3)).join('-');
    if (replacementTable.has(key)) {
      const rep = replacementTable.get(key);
      image.data[i] = rep[0];
      image.data[i + 1] = rep[1];
      image.data[i + 2] = rep[2];
      image.data[i + 3] = typeof rep[3] === 'undefined' ? 255 : rep[3];
    }
  }

  canvas.putImageData(image, 0, 0);

  console.log('done');
}

$(document).ready(() => {
  const inputForm = $('#inputform');
  for (const itemName of Object.keys(tmplColors)) {
    $('<div>')
      .append($('<label>').text(itemName))
      .append(
        $('<input>')
          .attr({
            name: itemName,
            type: 'color',
            value: toRgb(defaultColors[itemName] || tmplColors[itemName]),
          })
          .on('change', () => updateAquatan())
      )
      .appendTo(inputForm);
  }

  $('#bg_trans').on('change', () => updateAquatan());

  const outputElem = document.querySelector('#output');

  $('#download').click(() => {
    const link = document.createElement('a');
    link.download = 'aquatan.png';
    link.href = outputElem.toDataURL('image/png');

    link.click();
  });

  updateAquatan();
  $('#aquatmpl').on('load', () => updateAquatan());

  const previewElem = document.querySelector('#preview');
  const previewCtx = previewElem.getContext('2d');
  let previewCount = 0;
  let previewPose = 0;
  setInterval(() => {
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
      32
    );
  }, 250);

  previewElem.addEventListener('click', () => {
    previewPose++;
    if (previewPose == 4) previewPose = 0;
  });
});
