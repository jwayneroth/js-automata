window.onload = function () {
  var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      width = canvas.width,
      height = canvas.height,
      imageData = ctx.getImageData(0, 0, width, height),
      seed_r, seed_c, seed_offset,
      row, col,
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

  seed_r = Math.floor(Math.random() * height);
  seed_c = Math.floor(Math.random() * width);
  seed_offset = (seed_r * width + seed_c) * 4;

  imageData.data[seed_offset + 0] = 255;
  imageData.data[seed_offset + 1] = 255;
  imageData.data[seed_offset + 2] = 255;

  ctx.putImageData(imageData, 0, 0);

  function iterate () {

    //console.log('iterate');

    var row,
      col,
      sum,
      l, t, r, b, drb, dlt,
      cutoff = 0;

    for(i=0; i<imageData.data.length; i+=4) {

      row = Math.floor(i / 4 / width);
      col = i / 4 - row * width;

      t = (row != 0) ? getPixelTotal(imageData, row-1, col) : getPixelTotal(imageData, height-1, col);
      b = (row != height-1) ? getPixelTotal(imageData, row+1, col) : getPixelTotal(imageData, 0, col);
      l = (col != 0) ? getPixelTotal(imageData, row, col-1) : getPixelTotal(imageData, row, width-1);
      r = (col != width-1) ? getPixelTotal(imageData, row, col+1) : getPixelTotal(imageData, row, 0);

      if (row == height-1) {
        if (col == width-1) {
          drb = getPixelTotal(imageData, 0, 0);
        } else {
          drb = getPixelTotal(imageData, 0, col+1);
        }
      } else {
        if (col == width-1) {
          drb = getPixelTotal(imageData, row+1, 0);
        } else {
          drb = getPixelTotal(imageData, row+1, col+1);
        }
      }

      if (row == 0) {
        if (col == 0) {
          dlt = getPixelTotal(imageData, height-1, width-1);
        } else {
          dlt = getPixelTotal(imageData, height-1, col-1);
        }
      } else {
        if (col == 0) {
          dlt = getPixelTotal(imageData, row-1, width-1);
        } else {
          dlt = getPixelTotal(imageData, row-1, col-1);
        }
      }

      sum = t + b + l + r + drb + dlt;

      //if (i == seed_offset) console.log('sum: ' + sum);

      if (sum == 2295) {
        //console.log('flip!');
         if (getPixelTotal(imageData,row,col) == 0) {
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

  (function drawFrame () {
    window.requestAnimationFrame(drawFrame, canvas);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    iterate();
  }());
};

function getPixelTotal(imageData, y, x) {
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