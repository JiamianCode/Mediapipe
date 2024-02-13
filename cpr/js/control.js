// 定义常量引用图像源选择元素
const imageSourceSelect = document.getElementById('imageSource');
const fileInput = document.getElementById('file');

const fileInputContainer = document.getElementById('fileInputContainer');
const visualizationModeContainer = document.getElementById('visualizationModeContainer');
const chartSelectionContainer = document.getElementById('chartSelectionContainer');
const videoContainer = document.getElementById('videoContainer');
const chartContainer = document.getElementById('chartContainer');

function resetUI() {
    fileInputContainer.style.display = 'none';
    visualizationModeContainer.style.display = 'none';
    chartSelectionContainer.style.display = 'none';
    videoContainer.style.display = 'none';
    chartContainer.style.display = 'none';
    inputVideo.src = '';
    outputCanvas.getContext('2d').clearRect(0, 0, outputCanvas.width, outputCanvas.height);
}

// 源选择控制
imageSourceSelect.addEventListener('change', function() {
    // 最初隐藏所有容器
    resetUI();

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
    }
});

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
        };
        // 绑定视频文件输入
        videoInput();
    }
});

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


// 根据复选框选择处理图表显示
let containerChart1 = document.getElementById('containerChart1');
let containerChart2 = document.getElementById('containerChart2');
let checkboxChart1 = document.getElementById('checkboxChart1');
let checkboxChart2 = document.getElementById('checkboxChart2');

let chart1Visible = false;
let chart2Visible = false;

// 功能函数，用于检查复选框的状态并相应更新 chartContainer 的可见性
function updateChartContainerVisibility() {
    // 检查两个复选框是否至少有一个被勾选
    chartContainer.style.display = checkboxChart1.checked || checkboxChart2.checked ? 'block' : 'none';
}

// 给 checkboxChart1 添加事件监听器
checkboxChart1.addEventListener('change', function() {
    containerChart1.style.display = this.checked ? 'block' : 'none';
    chart1Visible = this.checked;
    console.log(`Chart 1 ${this.checked ? 'Selected' : 'Deselected'}.`);
    updateChartContainerVisibility(); // 更新 chartContainer 的可见性
});

// 给 checkboxChart2 添加事件监听器
checkboxChart2.addEventListener('change', function() {
    if (this.checked) {
        console.log('Chart 2 Selected.');
        containerChart2.style.display = 'block'; // 显示相关的图表容器
        initGauge(); // 调用 initGauge() 函数初始化仪表盘
    } else {
        console.log('Chart 2 Deselected.');
        containerChart2.style.display = 'none'; // 若未勾选，隐藏相关的图表容器
    }
    chart2Visible = this.checked;
    updateChartContainerVisibility(); // 更新 chartContainer 的可见性
});
