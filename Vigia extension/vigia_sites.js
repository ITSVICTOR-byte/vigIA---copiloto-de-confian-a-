console.log("VigIA (Modo Passivo) ativado.");

setTimeout(() => {
  const pageTitle = document.title;
  const pageDomain = window.location.hostname;

  if (pageTitle) {
    chrome.runtime.sendMessage({
      type: "CHECK_PAGE_CONTENT",
      title: pageTitle,
      domain: pageDomain
    });
  }
}, 1000);