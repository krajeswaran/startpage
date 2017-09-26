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

function deleteFav(e) {
  var alertstr = "Really delete?"
  if (confirm(alertstr)) {
    favs = favs.filter(function(item) {
      return !item.includes(e.target.firstChild.data);
    });
    drawAllFavs();
    localStorage.setObject('favs', favs);
  }
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

function drawAllFavs() {
  Array.isArray(favs) && favs.forEach(function(fav) {
    drawBox(fav);
  });
}

let favs = localStorage.getObject('favs');
let t = false;
drawAllFavs();

var longpress = false;
var presstimer = null;
var longtarget = null;

var cancel = function(e) {
    if (presstimer !== null) {
        clearTimeout(presstimer);
        presstimer = null;
    }
    
    this.classList.remove("longpress");
};

var click = function(e) {
    if (presstimer !== null) {
        clearTimeout(presstimer);
        presstimer = null;
    }
    
    this.classList.remove("longpress");
    
    if (longpress) {
        return false;
    }
};

var start = function(e) {
    if (e.type === "click" && e.button !== 0) {
        return;
    }
    
    longpress = false;
    
    this.classList.add("longpress");
    
    presstimer = setTimeout(function() {
        deleteFav(e);
        longpress = true;
    }, 800);
    
    return false;
};

var nodes = document.getElementsByTagName("a");
for (var i = 0, len = nodes.length; i < len; i++) {
  nodes[i].addEventListener("mousedown", start);
  nodes[i].addEventListener("touchstart", start);
  nodes[i].addEventListener("click", click);
  nodes[i].addEventListener("mouseout", cancel);
  nodes[i].addEventListener("touchend", cancel);
  nodes[i].addEventListener("touchleave", cancel);
  nodes[i].addEventListener("touchcancel", cancel);
}
