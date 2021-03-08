function increaseNumberNotifyContacts(className) {
  let currentContact = +$(`.${className}`).find("em").text(); // chuyen string ve number
  currentContact += 1;
  if (currentContact === 0) {
    $(`.${className}`).html("");
  } else {
    $(`.${className}`).html(`(<em>${currentContact}</em>)`);
  }
}

function decreaseNumberNotifyContacts(className) {
  let currentContact = +$(`.${className}`).find("em").text(); // chuyen string ve number
  currentContact -= 1;
  if (currentContact === 0) {
    $(`.${className}`).html("");
  } else {
    $(`.${className}`).html(`(<em>${currentContact}</em>)`);
  }
}
