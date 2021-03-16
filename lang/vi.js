exports.transValidation = {
  email_incorrect: "Email phải có định dang example@gmail.com",
  email_duplicate: "Email đã được sử dụng",
  email_remove: "Tài khoản đã bị gỡ bõ",
  email_not_active: "Email chưa được active",
  gender_incorrect: "Vui lòng không inspect :)))",
  password_incorrect:
    "Mật khẩu trên 6 kí tự , bao gồm chữ in hoa,thường và kí tự đặc biệt",
  password_confirm_incorrect: "Mật khẩu không khớp",
  update_usernames: "Tên giới hạn từ 3-17 kí tự và không chứa kí tự đặc biệt",
  update_gender: "Đừng có inspect :))",
  update_address: "Địa chỉ giới hạn từ 3 đến 30 kí tự",
  update_phone: "Số điện thoại bắt đầu từ số 0 ,giới hạn từ 10-11 kí tự",
  find_user_keyword:
    "Lỗi từ khóa tìm kiếm, Vui lòng không nhập từ khóa đặc biệt",
  message_Text_Emoji_Incorrect: "Tin nhắn tối đa 400 kí tự",
};

exports.transSuccess = {
  useCreatedSuccess:
    "Tài khoản đã tạo thành công, Vui lòng kiểm tra email để kích hoạt tài khoản",
  account_isActived: "Tài khoản đã được kích hoạt",
  login_success(username) {
    return `Xin chào ${username} đến với Awesome Chat`;
  },
  logout_success: "Đăng xuất tài khoản thành công",
  userInfo_updated: "Cập nhật thông tin thành công",
  user_update_password: "Cập nhật mật khẩu thành công",
};

exports.transMail = {
  subject: "Awesome Chat : Xác nhận kích hoạt tài khoản",
  templates: (linkVerify) => {
    return `<h2>Bạn đã nhận được email này khi đăng kí ứng dụng Awsome Chat</h2>
    <h3>Vui lòng click vào link bên dưới để xác nhận tài khoản</h3>
    <h3><a href="${linkVerify}" target = "blank">${linkVerify}</a></h3>
    `;
  },
  sendMailFailed:
    "Đã có lỗi khi gửi email, Vui lòng liên hệ với bộ phận hỗ trợ",
  token_isActived:
    "Tài khoản này đã được kích hoạt, Vui lòng không click vào link liên kết nữa",
};

exports.transErrors = {
  login_failed: "Sai taì khoản hoặc mật khẩu",
  error_server: "Đã xảy ra lỗi ở server ,",
  avatar_type: "Kiểu file không hợp lệ vui lòng chọn file png ,jpg hoặc jpeg",
  avatar_size: "Ảnh tối đa upload là 1MB , Vui lòng thử lại",
  account_undefined: "Tài khoản này không tồn tại",
  user_current_password: "Mật khẩu hiện tại không chính xác",
  conversation_is_not_found: "Cuộc trò chuyện không tồn tại",
  image_message_type:
    "Kiểu file không hợp lệ vui lòng chọn file png ,jpg hoặc jpeg",
  image_message_size: "Ảnh tối đa upload là 1MB , Vui lòng thử lại",
  attachment_message_size: "File tối đa upload là 1MB , Vui lòng thử lại",
};
