document.getElementById('toggleVideo').addEventListener('click', function() {
    if (video5.paused) {
        camera.start(); // 如果视频暂停或结束，点击按钮则开始播放
    } else {
        camera.stop(); // 如果视频正在播放，点击按钮则暂停
    }
  });
  
document.getElementById('toggleInputVideo').addEventListener('click', function() {
    const inputVideoDiv = document.querySelector('.input_video5');
    if (inputVideoDiv.style.display === 'none') {
      inputVideoDiv.style.display = 'block'; // 显示
    } else {
      inputVideoDiv.style.display = 'none'; // 隐藏
    }
  });
  
document.getElementById('toggleControls').addEventListener('click', function() {
    const controlsDiv = document.querySelector('.control5');
    if (controlsDiv.style.display === 'none') {
      controlsDiv.style.display = 'block'; // 显示
    } else {
      controlsDiv.style.display = 'none'; // 隐藏
    }
  });