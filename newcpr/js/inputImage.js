// 假设Camera类以及其他必要的类（如Pose等）已经在其他地方被正确定义和引入
let inputVideoWidth = 400;
let inputVideoHeight = 400;
let inputVideo = document.getElementById('inputVideo'); // 摄像头视频输入
let camera = null; // 用于持有Camera实例的全局变量
let originalImage = document.getElementById('originalImage');

const inputVideoContainer = document.getElementById('inputVideoContainer');


/******* 摄像头输入 ******/
// 启动摄像头
function startCamera() {
    try {
        if (!camera) { // 避免重复实例化
            camera = new Camera(inputVideo, {
                onFrame: async () => {
                    await pose.send({image: inputVideo}); // 将摄像头图像发送给Pose处理
                },
                width: inputVideoWidth, // 根据实际需要调整摄像头分辨率
                height: inputVideoHeight
            });
            camera.start(); // 启动摄像头
            console.log("Camera started successfully");
        }
    } catch (error) {
        console.log("Failed to start camera, retrying...", error);
        setTimeout(startCamera, 500); // 如果失败了，等待0.5秒后重试
    }
}

// 检测摄像头的控制选择状态
function checkCameraStatus() {
    const isCameraSelected = imageSourceSelect.value === 'camera';
    const isOriginalImageChecked = originalImage.checked;

    if (isCameraSelected && isOriginalImageChecked) {
        inputVideo.style.display = 'block'; // 显示视频元素
        inputVideo.controls = false; // 摄像头流通常不需要控件
        startCamera();// 启动摄像头
        console.log("originalImage mode selected");
    } else {
        inputVideo.style.display = 'none';
        console.log("originalImage mode deselected");
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
    };

    // 监听窗口大小变化，更新视频尺寸
    window.addEventListener('resize', setVideoSize);

    // 清理暂停或结束时的帧请求
    inputVideo.onpause = inputVideo.onended = () => {
        cancelAnimationFrame(frameRequest);
    };
}