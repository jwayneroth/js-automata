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
      rgb_one = {r:5,g:48,b:13},
      rgb_two = {r:224,g:212,b:215};
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
        imageData.data[i + 0] = rgb_one.r;
        imageData.data[i + 1] = rgb_one.g;
        imageData.data[i + 2] = rgb_one.b;
      } else {
        imageData.data[i + 0] = rgb_two.r;
        imageData.data[i + 1] = rgb_two.g;
        imageData.data[i + 2] = rgb_two.b;
      }
    } else {
      if (col % 2 != 0) {
        imageData.data[i + 0] = rgb_one.r;
        imageData.data[i + 1] = rgb_one.g;
        imageData.data[i + 2] = rgb_one.b;
      } else {
        imageData.data[i + 0] = rgb_two.r;
        imageData.data[i + 1] = rgb_two.g;
        imageData.data[i + 2] = rgb_two.b;
      }
    }
    imageData.data[i + 3] = 255;

  }

  for (i=0; i<(width * height); i++) {
    seed_r = Math.floor(Math.random() * height);
    seed_c = Math.floor(Math.random() * width);
    seed_offset = (seed_r * width + seed_c) * 4;
    imageData.data[seed_offset + 0] = (Math.random() * 100 > 50) ? rgb_one.r : rgb_two.r;
    imageData.data[seed_offset + 1] = (Math.random() * 100 > 50) ? rgb_one.g : rgb_two.g;
    imageData.data[seed_offset + 2] = (Math.random() * 100 > 50) ? rgb_one.b : rgb_two.b;
  }

  ctx.putImageData(imageData, 0, 0);




  function iterate () {

    //console.log('iterate');

    var id = {data:imageData.data.slice(), width: width, height: height},
      row,
      col,
      rsum,gsum,bsum,
      l, t, r, b, drb, dlt,
      rmatch = rgb_one.r * 3 + rgb_two.r * 3,
      gmatch = rgb_one.g * 3 + rgb_two.g * 3,
      bmatch = rgb_one.b * 3 + rgb_two.b * 3,
      pixel;

    for(i=0; i<imageData.data.length; i+=4) {

      row = Math.floor(i / 4 / width);
      col = i / 4 - row * width;

      t = getPixelObject(id, col, row-1, width);
      b = getPixelObject(id, col, row+1, width);
      l = getPixelObject(id, col-1, row, width);
      r = getPixelObject(id, col+1, row, width);
      drb = getPixelObject(id, col+1, row+1, width);
      dlt = getPixelObject(id, col-1, row-1, width);

      rsum = t.r + b.r + l.r + r.r + drb.r + dlt.r;
      gsum = t.g + b.g + l.g + r.g + drb.g + dlt.g;
      bsum = t.b + b.b + l.b + r.b + drb.b + dlt.b;

      pixel = getPixelObject(id,col,row,width);

      if (rsum == rmatch) {
        imageData.data[i + 0] = (pixel.r == rgb_one.r) ? rgb_two.r : rgb_one.r;
      }
      if (gsum == gmatch) {
        imageData.data[i + 1] = (pixel.g == rgb_one.g) ? rgb_two.g : rgb_one.g;
      }
      if (bsum == bmatch) {
        imageData.data[i + 2] = (pixel.b == rgb_one.b) ? rgb_two.b : rgb_one.b;
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

function getPixelObject(imageData, x, y) {
  var r, g, b, a, offset = x * 4 + y * 4 * imageData.width;
  r = imageData.data[offset];
  g = imageData.data[offset + 1];
  b = imageData.data[offset + 2];
  a = imageData.data[offset + 3];
  return {r:r, g:g, b:b, a:a};
}