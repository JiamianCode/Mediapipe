document.getElementById('toggleInputVideo').addEventListener('click', function() {
    const inputVideoDiv = document.querySelector('.input_video5');
    if (inputVideoDiv.style.display === 'none') {
      inputVideoDiv.style.display = 'block'; // 显示
    } else {
      inputVideoDiv.style.display = 'none'; // 隐藏
    }
  });

document.getElementById('toggleVideoVisibility').addEventListener('click', function() {
    const video = document.getElementById('video5');
    if (video.style.display === 'none' || video.style.display === '') {
        video.style.display = 'block'; // 如果视频当前是隐藏的，显示它
    } else {
        video.style.display = 'none'; // 如果视频当前是显示的，隐藏它
    }
});

// Toggle control panel visibility
document.getElementById('toggleControls').addEventListener('click', function() {
  const controlsDiv = document.querySelector('.control5');
  if (controlsDiv.style.display === 'none' || !controlsDiv.classList.contains('visible')) {
      controlsDiv.style.display = 'block';
      controlsDiv.classList.add('visible');
  } else {
      controlsDiv.classList.remove('visible');
      // Use a transitionend listener to set display to none after hiding
      controlsDiv.addEventListener('transitionend', function() {
          if (!controlsDiv.classList.contains('visible')) {
              controlsDiv.style.display = 'none';
          }
      }, { once: true });
  }
});