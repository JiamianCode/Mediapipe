// 假设Camera类以及其他必要的类（如Pose等）已经在其他地方被正确定义和引入
let inputVideo = document.getElementById('inputVideo'); // 摄像头视频输入
let camera = null; // 用于持有Camera实例的全局变量
let originalImage = document.getElementById('originalImage');

const inputVideoContainer = document.getElementById('inputVideoContainer');
const audioPlayer = document.getElementById('audioPlayer');

/******* 摄像头输入 ******/
// 启动摄像头
function startCamera() {
    try {
        if (!camera) { // 避免重复实例化
            camera = new Camera(inputVideo, {
                onFrame: async () => {
                    await pose.send({image: inputVideo}); // 将摄像头图像发送给Pose处理
                },
                // width: inputVideoContainer.offsetWidth, // 根据实际需要调整摄像头分辨率
                // height: inputVideoContainer.offsetHeight
            });
            camera.start(); // 启动摄像头
            console.log("Camera started successfully");
        }
    } catch (error) {
        console.log("Failed to start camera, retrying...", error);
        setTimeout(startCamera, 500); // 如果失败了，等待0.5秒后重试
    }
}

//camera模式下录制、保存视频
let mediaRecorder;
let recordedChunks = [];
document.getElementById('startButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);
function startRecording() {
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;

    zeroRecord();
    analysis = true;
    //modelLoad = true;   //手动开始是直接默认已经识别到cpr

    //设置定时器最多录制30s就暂停
    setTimeout(stopRecording, 30000);

    recordedChunks = [];
    let stream = inputVideo.srcObject; // 获取当前video标签的媒体流
    mediaRecorder = new MediaRecorder(stream, {mimeType: 'video/webm'});

    mediaRecorder.ondataavailable = function(event) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = saveVideo;

    mediaRecorder.start();
    console.log("Recording started");

    audioPlayer.play(); // 播放音频
}

function stopRecording() {
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;

    mediaRecorder.stop();
    console.log("Recording stopped");

    analysis = false;
    // modelLoad = false;  //结束则置为false

    updateTeach();
    showLargeModal();

    audioPlayer.pause(); // 暂停音频
}

function saveVideo() {
    const blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recorded_video.webm'; // 可以设置一个更有意义的文件名
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}


// 检测摄像头的控制选择状态
function checkCameraStatus() {
    // 假设originalImage是一个已经定义好的变量
    const isCameraSelected = selectCamera.classList.contains('btn-custom-selected');
    const isOriginalImageChecked = originalImage.checked; // 确保originalImage是你的一个有效元素

    if (isCameraSelected && isOriginalImageChecked) {
        inputVideo.style.display = 'block'; // 显示视频元素
        inputVideo.controls = false; // 摄像头流通常不需要控件
        startCamera(); // 启动摄像头
        console.log("Camera mode selected and originalImage checked");
    } else if(isOriginalImageChecked){
        inputVideo.style.display = 'block'; // 显示视频元素
    } else {
        inputVideo.style.display = 'none';
        console.log("Camera mode deselected or originalImage unchecked");
    }
}

// 绑定监听器
originalImage.addEventListener('change', checkCameraStatus);

/******* 视频文件输入 ******/
function videoInput(){
    let frameRequest;

    // 设置视频尺寸以匹配容器
    const setVideoSize = () => {
        inputVideo.style.width = inputVideoContainer.offsetWidth + 'px';
        // 根据视频的宽高比来设置高度
        inputVideo.style.height = inputVideoContainer.offsetWidth * (inputVideo.videoHeight / inputVideo.videoWidth) + 'px';
    };

    const onFrame = () => {
        if (inputVideo.paused || inputVideo.ended) {
            cancelAnimationFrame(frameRequest);
            return;
        }
        // pose.send()处理视频帧
        pose.send({image: inputVideo}).then(() => {
            frameRequest = requestAnimationFrame(onFrame);
        }).catch(e => console.error(e));
    };

    setVideoSize(); // 确保加载视频时尺寸也正确

    // 附加播放事件监听器以开始处理帧
    inputVideo.onplay = () => {
        setVideoSize(); // 确保视频播放时尺寸正确
        // 确保在开始处理帧前"原始图像"复选框已被选中
        if (originalImage.checked) {
            onFrame();
        }

        //清理记录的数据
        zeroRecord();
        //禁用开始/暂停
        playPauseBtn.disabled = true;

        analysis = true;
    };

    // 监听窗口大小变化，更新视频尺寸
    window.addEventListener('resize', setVideoSize);

    // 清理暂停或结束时的帧请求
    inputVideo.onpause = inputVideo.onended = () => {
        cancelAnimationFrame(frameRequest);

        //启用开始/暂停
        playPauseBtn.disabled = false;
    };
}

function zeroRecord(){
    //清理记录的数据
    keypointPositions = [];
    resultRecord = [];
    angle1Array = [];
    angle2Array = [];
    angle3Array = [];
    frequencyArray = [];
    newData = [];
    hotData = [];

    // 定义一个临时数组来累积分数
    tempScores = [];
    segmentAverages = [];
    tempCurrentTime = '00:00';  // 初始时间
    // 教学记录
    alertContainer.innerHTML = '';
    progressContainer.innerHTML = '';
}