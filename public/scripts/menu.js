// This toggles the site between the 2 states, sidenav/menu open or not
function toggleMenu() {
  var body = document.body;
  body.classList.toggle('menu-open');
}

/* This is called whenever a primary navigation link with a submenu is clicked
 * It triggers the visibility of the content and toggles the state of the site
 */
function openSubmenu(event) {
  // check if the li or the a inside it was clicked, and trigger the class of the li only
  var element = event.target.tagName == 'A' ? event.target.parentElement : event.target;
  if(document.body.classList.contains('menu-open')) closeMenus(element);
  element.classList.toggle('active');
  toggleMenu();
}

// This closes everything but the element that was clicked
function closeMenus(element) {
  document.body.classList.remove('menu-open');
  var elements = document.querySelectorAll('.active');
  [].forEach.call(elements, function(el) {
    // make sure not to remove the active class of the clicked element
    if(el != element) el.classList.remove('active');
  })
}

// Shamelessly copypasted from an html5rocks.com tutorial on promises
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

/* This takes the response from the request to the json containing the
 * navigation and builds the nav element with it
 */
function buildMenus(response) {
  items = JSON.parse(response).items;
  var nav = document.querySelector('#navigation');
  for(i in items) {
    buildSubMenu(items[i], nav);
  }
}

function buildSubMenu(item, parent) {
  // create a new element with the contents of item
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
  if(parent.tagName == 'NAV') {
    parent.insertBefore(li, document.querySelector('#copyright'))
  } else {
    parent.appendChild(li);
  }
}

get('/api/nav.json').then(function(response) {
  // if succesful, attach the menus to nav
  buildMenus(response);
}, function(error) {
  // this shouldn't happen, it's a local query, right?
  console.error("Failed!", error);
});
