function toggleMenu() {
  var body = document.body;
  toggleClass(body, 'menu-open')
}

function openSubmenu(event) {
  if(document.body.classList.contains('menu-open')) closeMenus();
  var element = event.target;
  console.log(element)
  toggleClass(element, 'active')
  toggleMenu();
}

function toggleClass(el, cl) {
  if(el.classList.contains(cl)) {
    el.classList.remove(cl);
  } else {
    el.classList.add(cl);
  }
}

function closeMenus() {
  document.body.classList.remove('menu-open');
  var elements = document.querySelectorAll('.active');
  [].forEach.call(elements, function(el) {
    el.classList.remove('active');
  })
}

function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

function buildMenus(response) {
  items = JSON.parse(response).items;
  var nav = document.querySelector('#navigation');
  for(i in items) {
    buildSubMenu(items[i], nav);
  }
}

function buildSubMenu(item, parent) {
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.innerText = item.label;
  li.appendChild(a);
  // If it has a submenu, add the items to it
  if(item.items && item.items.length > 0) {
    var ul = document.createElement('ul');
    for(i in item.items) {
      buildSubMenu(item.items[i], ul);
    }
    li.appendChild(ul);
    li.addEventListener("click", openSubmenu);
  // Otherwise, add the link
  } else {
    a.href = item.url;
  }
  parent.appendChild(li);
}

get('/api/nav.json').then(function(response) {
  // if succesful, attach the menus to nav
  buildMenus(response);
}, function(error) {
  // this shouldn't happen, it's a local query, right?
  console.error("Failed!", error);
});
