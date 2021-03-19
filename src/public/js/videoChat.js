function videoChat(divId) {
  $(`#video-chat-${divId}`)
    .unbind("click")
    .on("click", function () {
      let targetId = $(this).data("chat");
      let callerName = $("#navbar-username").text().trim();
      let dataToEmit = {
        listenerId: targetId,
        callerName: callerName,
      };

      //step1 : check listener online
      socket.emit("caller-check-listener-online-or-not", dataToEmit);
    });
}

function playVideoStream(videotagId, stream) {
  let video = document.getElementById(videotagId);
  video.srcObject = stream;
  video.onloadeddata = function () {
    video.play();
  };
}

function closeVideoStream(stream) {
  return stream.getTracks().forEach((track) => track.stop());
}

$(document).ready(function () {
  //Step2 : listener is offline
  socket.on("server-send-listener-is-offline", function () {
    alertify.notify("Người dùng này hiện không trực tuyến", "error", 5);
  });

  let getPeerId = "";
  let iceServerList = $("#ice-server-list").val();

  let peer = new Peer({
    key: "peerjs",
    host: "peerjs-server-anhkhoa1803.herokuapp.com",
    secure: true,
    port: 443,
    debug: 3,
    config: { iceServers: JSON.parse(iceServerList) },
  });
  peer.on("open", function (peerId) {
    getPeerId = peerId;
  });

  //Step3 : listener is online
  socket.on("server-request-peerid-of-listener", function (response) {
    let listenerName = $("#navbar-username").text().trim();
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: listenerName,
      listenerPeer: getPeerId,
    };

    //step 4 : listener response emit peerId to server
    socket.emit("listener-emit-peerId-to-server", dataToEmit);
  });
  let timeInterval;

  //Step5: caller after received peerId , caller request call server
  socket.on("server-send-peerId-of-listener-for-caller", function (response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeer: response.listenerPeer,
    };

    //step 6 : caller request call server
    socket.emit("caller-request-call-to-server", dataToEmit);

    Swal.fire({
      icon: "info",
      title: `Đang gọi cho &nbsp; <span style="color:#2ECC71">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `Thời gian: <strong style="color:#d43f3a;"></strong> giây . <br/> <br/> 
        <button id="btn-cancel-call" class="btn btn-danger">Hủy cuộc gọi</button>
    `,
      backdrop: "rgba(85,85,85,0.4)",
      width: "52rem",
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 30000,
      willOpen: function () {
        $("#btn-cancel-call")
          .unbind("click")
          .on("click", function () {
            Swal.close();
            clearInterval(timeInterval);
            //Step7: caller cancel call
            socket.emit("caller-cancel-request-call-to-server", dataToEmit);
          });
        if (Swal.getContent().querySelector !== null) {
          Swal.showLoading();
          timeInterval = setInterval(() => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(
              Swal.getTimerLeft() / 1000
            );
          }, 1000);
        }
      },
      didOpen: () => {
        //Step12 : listener dimiss call
        socket.on(
          "server-send-reject-cancel-call-to-caller",
          function (response) {
            Swal.close();
            clearInterval(timeInterval);
            Swal.fire({
              icon: "info",
              title: `<span style="color:#2ECC71">${response.listenerName}</span> &nbsp; Đã từ chối cuộc gọi của bạn`,
              backdrop: "rgba(85,85,85,0.4)",
              width: "52rem",
              allowOutsideClick: false,
              confirmButtonColor: "#2ECC71",
              confirmButtonText: "Xác nhận",
            });
          }
        );
      },
      willClose: () => {
        clearInterval(timeInterval);
      },
    }).then((result) => {
      return false;
    });
  });

  //Step8 : listener after received call
  socket.on("server-send-request-call-to-listener", function (response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeer: response.listenerPeer,
    };

    Swal.fire({
      icon: "info",
      title: `<span style="color:#2ECC71">${response.callerName}</span> &nbsp; muốn trò chyện video với bạn
      &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `Thời gian: <strong style="color:#d43f3a;"></strong> giây . <br/> <br/>
        <button id="btn-accept-call" class="btn btn-success">Đồng ý</button>
        <button id="btn-cancel-call" class="btn btn-danger">Từ chối</button>
      `,
      backdrop: "rgba(85,85,85,0.4)",
      width: "52rem",
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 30000,
      willOpen: function () {
        $("#btn-cancel-call")
          .unbind("click")
          .on("click", function () {
            Swal.close();
            clearInterval(timeInterval);

            //Step10 : listener dimiss call from Server
            socket.emit("listener-dimiss-request-call-to-server", dataToEmit);
          });

        $("#btn-accept-call")
          .unbind("click")
          .on("click", function () {
            Swal.close();
            clearInterval(timeInterval);

            //Step11 : listener accept call from Server
            socket.emit("listener-accept-request-call-to-server", dataToEmit);
          });
        if (Swal.getContent().querySelector !== null) {
          Swal.showLoading();
          timeInterval = setInterval(() => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(
              Swal.getTimerLeft() / 1000
            );
          }, 1000);
        }
      },
      didOpen: () => {
        //step9 : listener cancel call from caller
        socket.on(
          "server-send-request-cancel-call-to-listener",
          function (response) {
            Swal.close();
            clearInterval(timeInterval);
          }
        );
      },
      willClose: () => {
        clearInterval(timeInterval);
      },
    }).then((result) => {
      return false;
    });
  });

  //Step13 : listener accept call sent notification to caller
  socket.on("server-send-accept-call-to-caller", function (response) {
    Swal.close();
    clearInterval(timeInterval);
    let getUserMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia
    ).bind(navigator);
    getUserMedia(
      { video: true, audio: true },
      function (stream) {
        //show modal stream
        $("#streamModal").modal("show");

        //play my stream in local
        playVideoStream("local-stream", stream);

        //call to listener
        const call = peer.call(response.listenerPeer, stream);
        // listen listener accept
        call.on("stream", function (remoteStream) {
          playVideoStream("remote-stream", remoteStream);
        });

        //close modal : remove stream
        $("#streamModal").on("hidden.bs.modal", function () {
          closeVideoStream(stream);
          Swal.fire({
            icon: "info",
            title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color:#2ECC71">${response.listenerName}</span>`,
            backdrop: "rgba(85,85,85,0.4)",
            width: "52rem",
            allowOutsideClick: false,
            confirmButtonColor: "#2ECC71",
            confirmButtonText: "Xác nhận",
          });
        });
      },
      function (err) {
        if (err.toString() === "NotAllwedError: Permission denied") {
          alertify.alert(
            "Vui lòng bật cho phép truy cập vào thiết bị của trình duyệt",
            "error",
            5
          );
        }
        if (err.toString() === "NotFoundError: Requested device not found") {
          alertify.alert(
            "Không tìm thấy thiết bị nghe gọi trên máy tính của bạn",
            "error",
            5
          );
        }
      }
    );
  });

  //Step14 : listener accept call sent notification to listener
  socket.on("server-send-accept-call-to-listener", function (response) {
    Swal.close();
    clearInterval(timeInterval);

    let getUserMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia
    ).bind(navigator);

    peer.on("call", function (call) {
      getUserMedia(
        { video: true, audio: true },
        function (stream) {
          //show modal stream
          $("#streamModal").modal("show");

          //play my stream in local
          playVideoStream("local-stream", stream);

          call.answer(stream); // Answer the call with an A/V stream.
          call.on("stream", function (remoteStream) {
            playVideoStream("remote-stream", remoteStream);
          });

          //close modal : remove stream
          $("#streamModal").on("hidden.bs.modal", function () {
            closeVideoStream(stream);
            Swal.fire({
              icon: "info",
              title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color:#2ECC71">${response.callerName}</span>`,
              backdrop: "rgba(85,85,85,0.4)",
              width: "52rem",
              allowOutsideClick: false,
              confirmButtonColor: "#2ECC71",
              confirmButtonText: "Xác nhận",
            });
          });
        },
        function (err) {
          if (err.toString() === "NotAllwedError: Permission denied") {
            alertify.alert(
              "Vui lòng bật cho phép truy cập vào thiết bị của trình duyệt",
              "error",
              5
            );
          }
          if (err.toString() === "NotFoundError: Requested device not found") {
            alertify.alert(
              "Không tìm thấy thiết bị nghe gọi trên máy tính của bạn",
              "error",
              5
            );
          }
        }
      );
    });
  });
});
