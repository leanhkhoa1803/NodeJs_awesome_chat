function increaseNumberMessageGroup(divId) {
  let currentValue = +$(`.right[data-chat=${divId}]`)
    .find("span.number-messages-show")
    .text();
  currentValue += 1;
  $(`.right[data-chat=${divId}]`)
    .find("span.number-messages-show")
    .html(currentValue);
}
