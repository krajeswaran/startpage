/* Store and retrieve from localstorage  */
Storage.prototype.setObject = function(key, value) {
      this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
      let value = this.getItem(key);
      return value && JSON.parse(value);
};

/* Create the HTML for all the boxes */
function drawBox(fav) {
  t = !t;
  var boxClass = t ? 'light' : 'red';

  fav = fav.split('^');
  let boxHtml = [
    '<a href=' + handleEncoding(fav[1]) + '>',
    '<div class="linkBox ' + boxClass + '">' + fav[0],
    '</div>',
    '</a>',
  ].join('');
  document.getElementById('content').innerHTML += boxHtml;
}

function handleEncoding(url) {
  // handle js bookmarklets and norm urls
  if (url.startsWith('http') || url.startsWith('https')) {
    return encodeURI(url);
  } else if (url.startsWith('javascript')) {
    var r = decodeURI(url);
    r = r.split('javascript:(function(){')[1];
    r = r.split('})()')[0];
    r = '(function(){' + r + '})()';
    return 'javascript:' + encodeURIComponent(r);
  } 
  
  return url;
}

function addFav() {
  var url = prompt("name^url");
  if (url != null) {
    if (!favs) favs = [];

    favs.push(url);
    drawBox(url);
    localStorage.setObject('favs', favs);
  }
}

let favs = localStorage.getObject('favs');
let t = false;
Array.isArray(favs) && favs.forEach(function(fav) {
  drawBox(fav);
});
