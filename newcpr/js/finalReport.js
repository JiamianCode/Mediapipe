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
        showWord();
        showShot();
        updateHeatmap();
    });

    // 显示模态框
    myModal.show();
}

function showWord(){
    // 计算平均值的函数
    function calculateAverage(array) {
        const sum = array.reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0);
        return sum / array.length;
    }

    // 使用calculateAverage函数计算每个数组的平均值
    const averageAngle1 = calculateAverage(angle1Array);
    const averageAngle2 = calculateAverage(angle2Array);
    const averageAngle3 = calculateAverage(angle3Array);
    const averageFrequency = calculateAverage(frequencyArray);
    const averageScore = calculateAverage(alertRecord.map(record => record.score))

    let level;

    if(averageScore >= 70) level = 'A';
    else if(averageScore >= 60 && averageScore < 70) level = 'B';
    else if(averageScore >= 50 && averageScore < 60) level = 'C';
    else level = 'D';

    // 使用表格展示结果
    document.getElementById('finalWord').innerHTML =
        `<h5>The performance level is:${level}(${averageScore.toFixed(2)})</h5>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Measurement</th>
                    <th scope="col">Range</th>
                    <th scope="col">Average</th>
                </tr> 
            </thead>

            <tr>
                <td>Angle 1</td>
                <td>${minAngleRange1}°-${maxAngleRange1}°</td>
                <td>${averageAngle1.toFixed(2)}°</td>
            </tr>
            <tr>
                <td>Angle 2</td>
                <td>${minAngleRange2}°-${maxAngleRange2}°</td>
                <td>${averageAngle2.toFixed(2)}°</td>
            </tr>
            <tr>
                <td>Angle 3</td>
                <td>${minAngleRange3}°-${maxAngleRange3}°</td>
                <td>${averageAngle3.toFixed(2)}°</td>
            </tr>
            <tr>
                <td>Frequency</td>
                <td>${minFrequency}-${maxFrequency}</td>
                <td>${averageFrequency.toFixed(2)}</td>
            </tr>
        </table>`;
}

const badOutputCanvas = document.getElementById('badOutputCanvas');
const wellOutputCanvas = document.getElementById('wellOutputCanvas');

// 画快照
function drawImageOnCanvas(url, canvas) {
    if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetWidth * opCanvas.height / opCanvas.width ;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            var img = new Image();
            img.onload = function() {
                // 当图像加载完成后，在目标 canvas 上绘制图像
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = url;
        }
    }
}
//获取并显示快照
function showShot(){

    // 初始化最小和最大记录的变量
    let minRecord = alertRecord[0];
    let maxRecord = alertRecord[0];

    // 遍历数组来找到最小和最大的记录
    alertRecord.forEach(record => {
        // 更新最小记录
        if (record.score < minRecord.score) {
            minRecord = record;
        }
        // 更新最大记录
        if (record.score > maxRecord.score) {
            maxRecord = record;
        }
    });

    // 计算平均时刻
    const badTime = minRecord.beginTime;
    const wellTime = maxRecord.beginTime;

    // 从resultRecord中找到对应时间的图像
    let badImageRecord = resultRecord.find(record => record.time === badTime);
    let wellImageRecord = resultRecord.find(record => record.time === wellTime);

    if(minRecord === alertRecord[0])    badImageRecord = resultRecord[0];
    if(maxRecord === alertRecord[0])    wellImageRecord = resultRecord[0];

    // 在Canvas上绘制图像
    if (badImageRecord) {
        drawImageOnCanvas(badImageRecord.canvasURL, badOutputCanvas);
        document.getElementById('BAD').textContent = `BAD Time at ${badTime},Score is${minRecord.score}`;
    }
    if (wellImageRecord) {
        drawImageOnCanvas(wellImageRecord.canvasURL, wellOutputCanvas);
        document.getElementById('GOOD').textContent = `GOOD Time at ${wellTime},Score is${maxRecord.score}`;
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