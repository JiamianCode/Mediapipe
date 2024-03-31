// 定义常量引用图像源选择元素
const imageSourceSelect = document.getElementById('imageSource');
const fileInput = document.getElementById('file');

//const fileInputContainer = document.getElementById('fileInputContainer');
const visualizationModeContainer = document.getElementById('visualizationModeContainer');
const chartSelectionContainer = document.getElementById('chartSelectionContainer');
//const videoContainer = document.getElementById('videoContainer');
const chartContainer = document.getElementById('chartContainer');


// 监听文件选择的变化
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        inputVideo.src = URL.createObjectURL(file);
        inputVideo.style.display = 'block';
        inputVideo.controls = true; // 启动视频播放控件
        // 初始化加载视频，并暂停播放
        inputVideo.onloadedmetadata = () => {
            inputVideo.pause();
            // 视频加载完毕后，启用播放/暂停按钮
            playPauseBtn.disabled = false;
        };
        // 绑定视频文件输入
        videoInput();
    }
});
/*
// 监听视觉化模式的复选框变化
document.querySelectorAll('#visualizationModeContainer input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', function() {
        // 改进空间：可以将文件的勾选做成摄像头的监听器方式
        // 这块代码有点奇奇怪怪，非必要不修改
        // I Don't Know What Happened But This Works

        // 根据复选框的选中状态输出相应的消息
        if (this.checked) {
            if (this.id === 'originalImage') {
                inputVideo.style.display = 'block'; // 显示视频元素
                // 根据图像源选择显示视频文件
                if (imageSourceSelect.value === 'file' && inputVideo.src) {
                    inputVideo.controls = true; // 显示视频文件控件
                }
            }
        } else {
            if (this.id === 'originalImage') {
                console.log(this.id + " mode deselected");
            }
        }

        // 根据选中的模式更新界面显示
        switch (this.id) {
            case 'originalImage':
                // 如果取消选中原始图像模式，隐藏视频元素并禁用控件
                if (!this.checked) {
                    inputVideo.style.display = 'none';
                    inputVideo.controls = false;
                }
                break;
            case 'skeleton':
                // 处理骨架图的显示逻辑
                break;
            // 可以添加其他case来处理function1, function2等
        }
    });
});
*/



/*
// 源选择控制
imageSourceSelect.addEventListener('change', function() {
    // 最初隐藏所有容器
    fileInputContainer.style.display = 'none';
    visualizationModeContainer.style.display = 'none';
    chartSelectionContainer.style.display = 'none';
    videoContainer.style.display = 'none';
    // chartContainer.style.display = 'none';
    inputVideo.src = '';
    outputCanvas.getContext('2d').clearRect(0, 0, outputCanvas.width, outputCanvas.height);

    switch (this.value){
        case 'none':// 如果选择了"None"，刷新页面重新开始
            window.location.reload();
            break;
        case 'camera':// 如果选择了"Camera"，显示可视化模式和图表选择
            visualizationModeContainer.style.display = '';
            chartSelectionContainer.style.display = '';
            videoContainer.style.display = '';
            console.log("camera input");

            //originalImage.checked = true;
            checkCameraStatus();
            break;
        case 'file':// 如果选择了"Local File"，最初只显示文件输入容器
            fileInputContainer.style.display = '';
            console.log("file input")
            // 文件被选择后，添加change事件监听器以显示可视化模式和图表选择
            fileInput.onchange = () => {
                if (fileInput.files.length > 0) {
                    visualizationModeContainer.style.display = '';
                    chartSelectionContainer.style.display = '';
                    videoContainer.style.display = '';
                    console.log("file selected");

                    //originalImage.checked = true;
                }
            };
            break;
        default:
            console.log("选中的操作是：" + this.value);
    }
});
*/


// 源选择控制:默认选择File，可切Camera。Camera切回File则刷新网页。
const selectCamera = document.getElementById('selectCamera');
const selectFile = document.getElementById('selectFile');
const fileInputContainer = document.getElementById('fileInputContainer');

selectCamera.addEventListener('click', function() {
    if (!this.classList.contains('btn-custom-selected')) {
        this.classList.replace('btn-custom-unselected', 'btn-custom-selected');
        selectFile.classList.replace('btn-custom-selected', 'btn-custom-unselected');

        // 禁用文件输入
        fileInput.disabled = true;
        fileInputContainer.querySelector('button').disabled = true;
        //fileInputContainer.querySelector('.form-text').textContent = 'File selection disabled';   //文字过长会导致按钮标签左移

        //启用录制和暂停按钮
        document.getElementById('startButton').disabled = false;
        //document.getElementById('stopButton').disabled = false;

        checkCameraStatus(); // 更新状态
    }
});

selectFile.addEventListener('click', function() {
    // 始终刷新页面以确保File按钮点击时的行为一致性
    location.reload();
});

document.getElementById('fileSelectButton').addEventListener('click', function() {
    document.getElementById('file').click();
});

document.getElementById('file').addEventListener('change', function() {
    const fileInput = document.getElementById('file');
    const fileNameDisplay = document.getElementById('fileName');
    fileNameDisplay.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : 'No file selected';
});


// 角度选择控制
const angle11 = document.getElementById('angle11');
const angle22 = document.getElementById('angle22');
const angle33 = document.getElementById('angle33');
const angle44 = document.getElementById('angle44');
const angle55 = document.getElementById('angle55');
const angle66 = document.getElementById('angle66');

// 初始化时只显示 Angle1 的卡片
angle11.style.display = 'block';
angle22.style.display = 'none';
angle33.style.display = 'none';
angle44.style.display = 'block';
angle55.style.display = 'none';
angle66.style.display = 'none';

// 为每个单选按钮添加更改监听器
document.getElementById('angle1').addEventListener('change', function() {
    angle11.style.display = 'block';
    angle22.style.display = 'none';
    angle33.style.display = 'none';
    angle44.style.display = 'block';
    angle55.style.display = 'none';
    angle66.style.display = 'none';
    document.getElementById('angleSelect').textContent='Now: Between the body and big arm';
    if(angle1Array.length > 0)
        document.getElementById('angleSize').textContent=`Current Angle Size：${angle1Array[angle1Array.length-1]}°`;
});

document.getElementById('angle2').addEventListener('change', function() {
    angle11.style.display = 'none';
    angle22.style.display = 'block';
    angle33.style.display = 'none';
    angle44.style.display = 'none';
    angle55.style.display = 'block';
    angle66.style.display = 'none';
    document.getElementById('angleSelect').textContent='Now: Between the big arm and small arm';
    if(angle2Array.length > 0)
        document.getElementById('angleSize').textContent=`Current Angle Size：${angle2Array[angle2Array.length-1]}°`;
});

document.getElementById('angle3').addEventListener('change', function() {
    angle11.style.display = 'none';
    angle22.style.display = 'none';
    angle33.style.display = 'block';
    angle44.style.display = 'none';
    angle55.style.display = 'none';
    angle66.style.display = 'block';
    document.getElementById('angleSelect').textContent='Now: Between the body and thigh';
    if(angle3Array.length > 0)
        document.getElementById('angleSize').textContent=`Current Angle Size：${angle3Array[angle3Array.length-1]}°`;
});


