console.log('Google Docs View Mode Extension loaded');

function clickElement(element) {
  ["mouseover", "mousedown", "mouseup", "click"].forEach(eventType => {
    const mouseEvent = new MouseEvent(eventType, {
      cancelable: true,
      bubbles: true,
      view: window,
    });
    element.dispatchEvent(mouseEvent);
  });
}

async function sleep(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

async function processElement(selector, callback) {
  const MAX_ATTEMPTS = 10;
  let retries = 0;

  function doCallback() {
    const element = document.querySelector(selector);
    if (!element) {
      return false;
    }
    callback(element);
    return true;
  }

  do {
    const callbackSuccessful = doCallback();
    if (callbackSuccessful) {
      return true;
    }
    retries++;
    await sleep(500);
  } while (retries < MAX_ATTEMPTS);

  return false;
}

async function switchToViewMode() {

  const clickedOnSwitcher = await processElement("#docs-toolbar-mode-switcher", element => {
    clickElement(element);
  });

  if (!clickedOnSwitcher) {
    return;
  }

  await processElement(".docs-toolbar-mode-switcher-viewing-menu-item", element => {
    clickElement(element);
  });
}

(async function () {

  const currentUrl = window.location.href;

  // Run only if we are in edit mode.
  if (currentUrl.includes("/edit")) {
    await switchToViewMode();
  }
})();

