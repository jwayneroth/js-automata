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
      j = 0
  /*for (i=0; i<width; i++) {
    for (j=0; j<height; j++) {
      offset = i * 4 + j * 4 * width;
      imageData.data[offset + 0] = 100;
      imageData.data[offset + 1] = 100;
      imageData.data[offset + 2] = 100;
      imageData.data[offset + 3] = 255;
    }
  }*/
  for(i=0; i<imageData.data.length; i+=4) {

    row = Math.floor(i / 4 / width);
    col = i / 4 - row * width;

    if (row % 2 == 0) {
      if (col % 2 == 0) {
        imageData.data[i + 0] = 0;
        imageData.data[i + 1] = 0;
        imageData.data[i + 2] = 0;
      } else {
        imageData.data[i + 0] = 255;
        imageData.data[i + 1] = 255;
        imageData.data[i + 2] = 255;
      }
    } else {
      if (col % 2 != 0) {
        imageData.data[i + 0] = 0;
        imageData.data[i + 1] = 0;
        imageData.data[i + 2] = 0;
      } else {
        imageData.data[i + 0] = 255;
        imageData.data[i + 1] = 255;
        imageData.data[i + 2] = 255;
      }
    }
    imageData.data[i + 3] = 255;

  }

  for (i=0; i<(width * height); i++) {
    seed_r = Math.floor(Math.random() * height);
    seed_c = Math.floor(Math.random() * width);
    seed_offset = (seed_r * width + seed_c) * 4;

    imageData.data[seed_offset + 0] = 255;
    imageData.data[seed_offset + 1] = 255;
    imageData.data[seed_offset + 2] = 255;
  }

  ctx.putImageData(imageData, 0, 0);

  function iterate () {

    //console.log('iterate');

    var id = {data:imageData.data.slice(), width: width, height: height},
      row,
      col,
      sum,
      l, t, r, b, drb, dlt,
      cutoff = 0;

    for(i=0; i<imageData.data.length; i+=4) {

      row = Math.floor(i / 4 / width);
      col = i / 4 - row * width;

      t = getPixelTotal(id, col, row-1, width);
      b = getPixelTotal(id, col, row+1, width);
      l = getPixelTotal(id, col-1, row, width);
      r = getPixelTotal(id, col+1, row, width);
      drb = getPixelTotal(id, col+1, row+1, width);
      dlt = getPixelTotal(id, col-1, row-1, width);

      sum = t + b + l + r + drb + dlt;

      if (sum == 3 * 255 * 3) {
         if (getPixelTotal(id,col,row,width) == 0) {
          imageData.data[i + 0] = 255;
          imageData.data[i + 1] = 255;
          imageData.data[i + 2] = 255;
        } else {
          imageData.data[i + 0] = 0;
          imageData.data[i + 1] = 0;
          imageData.data[i + 2] = 0;
        }
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
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function getPixel(imageData, x, y) {
  var r, g, b, a, offset = x * 4 + y * 4 * imageData.width;
  r = imageData.data[offset];
  g = imageData.data[offset + 1];
  b = imageData.data[offset + 2];
  a = imageData.data[offset + 3];
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}