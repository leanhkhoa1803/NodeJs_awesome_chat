function increaseNumberNotifyCation(className, number) {
  let currentContact = +$(`.${className}`).text(); // chuyen string ve number
  currentContact += number;
  if (currentContact === 0) {
    $(`.${className}`).css("display", "none").html("");
  } else {
    $(`.${className}`).css("display", "block").html(currentContact);
  }
}

function decreaseNumberNotifyCation(className, number) {
  let currentContact = +$(`.${className}`).text(); // chuyen string ve number
  currentContact -= number;
  if (currentContact === 0) {
    $(`.${className}`).css("display", "none").html("");
  } else {
    $(`.${className}`).css("display", "block").html(currentContact);
  }
}
