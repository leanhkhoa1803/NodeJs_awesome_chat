let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};

//xu li file anh truoc khi update
function updateUserInfo() {
  $("#input-change-avatar").bind("change", function () {
    let fileData = $(this).prop("files")[0];
    let math = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576; // byte = 1MB

    //kiem tra type image
    if ($.inArray(fileData.type, math) === -1) {
      alertify.notify(
        "Kiểu file không hợp lệ vui lòng chọn file png ,jpg hoặc jpeg",
        "error",
        5
      );
      $(this).val(null);
      return false;
    }

    //kiem tra kich thuoc anh
    if (fileData.size > limit) {
      alertify.notify(
        "Ảnh tối đa uploadn là 1MB , Vui lòng thử lại",
        "error",
        5
      );
      $(this).val(null);
      return false;
    }

    if (typeof FileReader != "undefined") {
      let imagePreview = $("#image-edit-profile");
      imagePreview.empty();

      let fileReader = new FileReader();

      fileReader.onload = function (element) {
        $("<img>", {
          src: element.target.result,
          class: "avatar img-circle",
          id: "user-modal-avatar",
          alt: "avatar",
        }).appendTo(imagePreview);
      };
      imagePreview.show();
      fileReader.readAsDataURL(fileData);
    } else {
      alertify.notify(
        "Trình duyệt của bạn không hỗ trợ FileReader",
        "error",
        7
      );
    }

    let formData = new FormData();
    formData.append("avatar", fileData);
    userAvatar = formData;
  });

  $("#input-change-username").bind("change", function () {
    let username = $(this).val();
    let regexUsername = new RegExp(
      /^[s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    );
    if (
      !regexUsername.test(username) ||
      username.length < 3 ||
      username.length > 17
    ) {
      alertify.notify(
        "Tên giới hạn từ 3-17 kí tự và không chứa kí tự đặc biệt",
        "error",
        5
      );
      $(this).val(originUserInfo.username);
      delete userInfo.username;
      return false;
    }
    userInfo.username = $(this).val();
  });

  $("#input-change-gender-male").bind("click", function () {
    let userGender = $(this).val();

    if (userGender !== "male") {
      alertify.notify("Đừng có inspect :))", "error", 5);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }

    userInfo.gender = $(this).val();
  });

  $("#input-change-gender-female").bind("click", function () {
    let userGender = $(this).val();

    if (userGender !== "female") {
      alertify.notify("Đừng có inspect :))", "error", 5);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }
    userInfo.gender = $(this).val();
  });

  $("#input-change-address").bind("change", function () {
    let address = $(this).val();

    if (address.length < 3 || address.length > 17) {
      alertify.notify("Địa chỉ giới hạn từ 3 đến 30 kí tự", "error", 5);
      $(this).val(originUserInfo.address);
      delete userInfo.address;
      return false;
    }
    userInfo.address = $(this).val();
  });

  $("#input-change-phone").bind("change", function () {
    let phone = $(this).val();
    let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/);
    if (!regexPhone.test(phone)) {
      alertify.notify(
        "Số điện thoại bắt đầu từ số 0 ,giới hạn từ 10-11 kí tự",
        "error",
        5
      );
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }
    userInfo.phone = $(this).val();
  });

  //thay doi password
  $("#input-change-current-password").bind("change", function () {
    let currentPassword = $(this).val();
    let regexPassword = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}$/
    );
    if (!regexPassword.test(currentPassword)) {
      alertify.notify(
        "Mật khẩu trên 6 kí tự , bao gồm chữ in hoa,thường và kí tự đặc biệt",
        "error",
        5
      );
      $(this).val(null);
      delete userUpdatePassword.currentPassword;
      return false;
    }
    userUpdatePassword.currentPassword = currentPassword;
  });

  $("#input-change-new-password").bind("change", function () {
    let newPassword = $(this).val();
    let regexPassword = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}$/
    );
    if (!regexPassword.test(newPassword)) {
      alertify.notify(
        "Mật khẩu trên 6 kí tự , bao gồm chữ in hoa,thường và kí tự đặc biệt",
        "error",
        5
      );
      $(this).val(null);
      delete userUpdatePassword.newPassword;
      return false;
    }
    userUpdatePassword.newPassword = newPassword;
  });

  $("#input-change-confirm-new-password").bind("change", function () {
    let confirmNewPassword = $(this).val();

    if (!userUpdatePassword.newPassword) {
      alertify.notify("Bạn chưa nhập mật khẩu mới", "error", 5);
      $(this).val(null);
      delete userUpdatePassword.confirmNewPassword;
      return false;
    }

    if (confirmNewPassword !== userUpdatePassword.newPassword) {
      alertify.notify("Mật khẩu không khớp, Vui lòng nhập lại", "error", 5);
      $(this).val(null);
      delete userUpdatePassword.confirmNewPassword;
      return false;
    }
    userUpdatePassword.confirmNewPassword = confirmNewPassword;
  });

  $("#input-btn-update-user-password").bind("click", function () {
    if (
      !userUpdatePassword.currentPassword ||
      !userUpdatePassword.newPassword ||
      !userUpdatePassword.confirmNewPassword
    ) {
      alertify.notify("Vui lòng nhập đầy đủ thông tin", "error", 5);
      return false;
    }

    Swal.fire({
      title: "Bạn có chắc chắn muốn thay đổi mật khẩu?",
      text: "Bạn không thể hoàn tác lại quá trình này",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy bỏ",
    }).then((result) => {
      if (!result.value) {
        $("#input-btn-cancel-user-password").click();
        return false;
      }
      callUpdateUserPassword();
    });
  });

  $("#input-btn-cancel-user-password").bind("click", function () {
    userUpdatePassword = {};
    $("#input-change-current-password").val(null);
    $("#input-change-new-password").val(null);
    $("#input-change-confirm-new-password").val(null);
  });
}

function callUpdateUserAvatar() {
  $.ajax({
    url: "/user/update-avatar",
    type: "put",
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function (result) {
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      //update avatar navbar
      $("#navbar-avatar").attr("src", result.imageSrc);

      //update origin avatar src
      originAvatarSrc = result.imageSrc;

      //reset all
      $("#input-btn-cancel-update-user").click();
    },
    error: function (error) {
      $(".user-modal-alert-errors").find("span").text(error.responseText);
      $(".user-modal-alert-errors").css("display", "block");

      //reset all
      $("#input-btn-cancel-update-user").click();
    },
  });
}

function callUpdateUserInfo() {
  $.ajax({
    url: "/user/update-info",
    type: "put",
    data: userInfo,
    success: function (result) {
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      //update origin userInfo
      originUserInfo = Object.assign(originUserInfo, userInfo); //ghi de du lieu tu userInfo len originUserInfo (co cung key)

      //update navbar username
      $("#navbar-username").text(originUserInfo.username);

      //reset all
      $("#input-btn-cancel-update-user").click();
    },
    error: function (error) {
      $(".user-modal-alert-errors").find("span").text(error.responseText);
      $(".user-modal-alert-errors").css("display", "block");

      //reset all
      $("#input-btn-cancel-update-user").click();
    },
  });
}

function callUpdateUserPassword() {
  $.ajax({
    url: "/user/update-password",
    type: "put",
    data: userUpdatePassword,
    success: function (result) {
      $(".update-user-model-alert-success").find("span").text(result.message);
      $(".update-user-model-alert-success").css("display", "block");

      //reset all
      $("#input-btn-cancel-user-password").click();

      //logout after change password success
      callLogout();
    },
    error: function (error) {
      $(".update-user-model-alert-error").find("span").text(error.responseText);
      $(".update-user-model-alert-error").css("display", "block");

      //reset all
      $("#input-btn-cancel-user-password").click();
    },
  });
}

function callLogout() {
  let timeInterval;
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Tự động đăng xuất sau 4s",
    html: "Thời gian <strong></strong>",
    showConfirmButton: false,
    timer: 4000,
    willOpen: function () {
      Swal.showLoading();
      timeInterval = setInterval(() => {
        Swal.getContent().querySelector("strong").textContent = Math.ceil(
          Swal.getTimerLeft() / 1000
        );
      }, 1000);
    },
    willClose: () => {
      clearInterval(timeInterval);
    },
  }).then((result) => {
    $.get("/logout", function () {
      location.reload();
    });
  });
}

$(document).ready(function () {
  //luu lai gia tri ban dau
  originAvatarSrc = $("#user-modal-avatar").attr("src");
  originUserInfo = {
    username: $("#input-change-username").val(),
    gender: $("#input-change-gender-male").is("checked")
      ? $("#input-change-gender-male").val()
      : $("#input-change-gender-female").val(),
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val(),
  };

  updateUserInfo();

  $("#input-btn-update-user").bind("click", function () {
    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify(
        "Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu",
        "error",
        5
      );
      return false;
    }

    if (userAvatar) {
      callUpdateUserAvatar();
    }
    if (!$.isEmptyObject(userInfo)) {
      callUpdateUserInfo();
    }
  });

  $("#input-btn-cancel-update-user").bind("click", function () {
    userAvatar = null;
    userInfo = {};
    $("#input-change-avatar").val(null);
    $("#user-modal-avatar").attr("src", originAvatarSrc);

    $("#input-change-username").val(originUserInfo.username);
    originUserInfo.gender === "male"
      ? $("#input-change-gender-male").click()
      : $("#input-change-gender-female").click();
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone);
  });
});
