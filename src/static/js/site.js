const navOffset = $(".top-navbar").height() + 16;

$(".nav-link").click(function(event) {
  const href = $(this).attr("href");

  event.preventDefault();
  window.location.hash = href;

  $(href)[0].scrollIntoView();
  window.scrollBy(0, -navOffset);
});
