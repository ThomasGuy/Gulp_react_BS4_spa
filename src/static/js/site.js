window.onload = () => {
  const navOffset = document.querySelector(".navbar").offsetHeight;
  const elems = document.querySelectorAll(".nav-link");

  function getHref(event) {
    event.preventDefault();
    const href = event.target.hash;
    if (`#${window.location.href.split("#")[1]}` !== href) {
      window.location.hash = href;
      window.scrollBy({
        top: -navOffset, // could be negative value
        left: 0,
        behavior: "smooth"
      });
    }
  }

  elems.forEach(el => el.addEventListener("click", getHref));

  // We can set a scss variable like this ????
  document.documentElement.style.setProperty("$fixed-top-offset", navOffset);
};
