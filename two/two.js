window.onload = function () {

  var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      width = canvas.width,
      height = canvas.height,
      imageData = ctx.getImageData(0, 0, width, height),
      seed_r, seed_c, seed_offset,
      row, col,
      animeID,
      i = 0,
      j = 0,
      color_one = {r: 55, g: 45, b:40};

  for(i=0; i<imageData.data.length; i+=4) {

    row = Math.floor(i / 4 / width);
    col = i / 4 - row * width;

    imageData.data[i + 0] = color_one.r;
    imageData.data[i + 1] = color_one.g;
    imageData.data[i + 2] = color_one.b;
    imageData.data[i + 3] = 255;

  }

  for (i=0; i<Math.random() * width * (Math.random() * height); i++) {
    seed_r = Math.floor(Math.random() * height);
    seed_c = Math.floor(Math.random() * width);
    seed_offset = (seed_r * width + seed_c) * 4;

    imageData.data[seed_offset + 0] = Math.floor(Math.random() * 510 - 255);
    imageData.data[seed_offset + 1] = Math.floor(Math.random() * 510 - 255);
    imageData.data[seed_offset + 2] = Math.floor(Math.random() * 510 - 255);
  }

  ctx.putImageData(imageData, 0, 0);

  function iterate () {

    //console.log('iterate');

    var id = {data:imageData.data.slice(), width: width, height: height},
      row,
      col,
      rsum,
      gsum,
      bsum,
      l, t, r, b, drb, dlt,
      cutoff = 0;

    for(i=0; i<imageData.data.length; i+=4) {

      row = Math.floor(i / 4 / width);
      col = i / 4 - row * width;

      t = getPixelObject(id, col, row-1);
      b = getPixelObject(id, col, row+1);
      l = getPixelObject(id, col-1, row);
      r = getPixelObject(id, col+1, row);

      rsum = t.r + b.r + l.r + r.r;
      gsum = t.g + b.g + l.g + r.g;
      bsum = t.b + b.b + l.b + r.b;

      //if (i == 360) console.log(l);

      if ((rsum > color_one.r * 5) ||
         (gsum > color_one.g * 5) ||
         (bsum > color_one.b * 5)) {
        imageData.data[i + 0] += 20;
        imageData.data[i + 1] += 20;
        imageData.data[i + 2] += 20;
      }
    }

    ctx.putImageData(imageData, 0, 0);

  }

  $('body').keydown(function(evt) {
    console.log(evt);
    if (animeID) window.cancelAnimationFrame(animeID);
  });

  (function drawFrame () {
    animeID = window.requestAnimationFrame(drawFrame, canvas);
    iterate();
  }());
};

function getPixelTotal(imageData, x, y) {
  var r, g, b, a, offset = x * 4 + y * 4 * imageData.width;
  r = imageData.data[offset];
  g = imageData.data[offset + 1];
  b = imageData.data[offset + 2];
  //a = imageData.data[offset + 3];
  return r + g + b;
}

function getPixelObject(imageData, x, y) {
  var r, g, b, a, offset = x * 4 + y * 4 * imageData.width;
  r = imageData.data[offset];
  g = imageData.data[offset + 1];
  b = imageData.data[offset + 2];
  a = imageData.data[offset + 3];
  return {r:r, g:g, b:b, a:a};
}

function getPixel(imageData, x, y) {
  var r, g, b, a, offset = x * 4 + y * 4 * imageData.width;
  r = imageData.data[offset];
  g = imageData.data[offset + 1];
  b = imageData.data[offset + 2];
  a = imageData.data[offset + 3];
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}