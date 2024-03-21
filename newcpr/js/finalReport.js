let alertRecord = [];

// 显示模态弹窗
function showLargeModal() {
    // 初始化模态框实例
    var myModal = new bootstrap.Modal(document.getElementById('largeModal'), {
        keyboard: false
    });

    // 为模态框的“shown”事件添加事件监听器
    document.getElementById('largeModal').addEventListener('shown.bs.modal', function () {
        // 模态框完全显示后执行这些函数
        showShot();
        updateHeatmap();
    });

    // 显示模态框
    myModal.show();
}

// 画快照
function drawImageOnCanvas(image, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
        const outputCanvas = canvas.getContext('2d');
        if (outputCanvas) {
            // 保存当前画布状态
            outputCanvas.save();

            // 调整canvas大小以匹配图像比例
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetWidth * image.height / image.width;

            // 清除画布内容
            outputCanvas.clearRect(0, 0, canvas.width, canvas.height);

            // 绘制图像
            outputCanvas.drawImage(image, 0, 0, canvas.width, canvas.height);

            // 恢复画布状态
            outputCanvas.restore();
        }
    }
}
//获取并显示快照
function showShot(){

    // 初始化最小和最大记录的变量
    let minRecord = null;
    let maxRecord = null;

    // 遍历数组来找到最小和最大的记录
    alertRecord.forEach(record => {
        // 更新最小记录
        if (minRecord === null || record.score < minRecord.score) {
            minRecord = record;
        }
        // 更新最大记录
        if (maxRecord === null || record.score > maxRecord.score) {
            maxRecord = record;
        }
    });

    // 计算平均时刻
    const badTime = minRecord.beginTime;
    const wellTime = maxRecord.beginTime;

    // 从resultRecord中找到对应时间的图像
    const badImageRecord = resultRecord.find(record => record.time === badTime);
    const wellImageRecord = resultRecord.find(record => record.time === wellTime);

    // 在Canvas上绘制图像
    if (badImageRecord) {
        drawImageOnCanvas(badImageRecord.image, 'badOutputCanvas');
    }
    if (wellImageRecord) {
        drawImageOnCanvas(wellImageRecord.image, 'wellOutputCanvas');
    }
}


// 保存报告
function saveAsImage() {
    var element = document.getElementById("report"); // 获取你想要转换的容器

    html2canvas(element).then(function(canvas) {
        // 创建一个Image元素
        var img = new Image();
        img.src = canvas.toDataURL("image/png");

        // 以下代码段用于触发图片下载
        var link = document.createElement('a');
        link.download = 'container-image.png';
        link.href = img.src;
        // 模拟点击a标签，触发下载
        link.click();
    });
}