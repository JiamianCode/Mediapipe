let videoContainer = document.getElementById('videoContainer');
let opCanvas = document.getElementById('outputCanvas'); // 处理后的图像输出画布
let outputCanvas = opCanvas.getContext('2d'); // 获取画布的2D渲染上下文


// 定义一个函数，根据z轴的深度值改变颜色
function zColor(data) {
    const z = clamp(data.from.z + 0.5, 0, 1); // 将z值归一化并限制在0到1之间
    return `rgba(0, ${255 * z}, ${255 * (1 - z)}, 1)`; // 返回根据z值变化的颜色
}

// 更新画面内容
function updateCanvasContext(results){
    outputCanvas.save(); // 保存当前画布状态
    opCanvas.width = videoContainer.offsetWidth;
    opCanvas.height = videoContainer.offsetWidth * inputVideo.videoHeight / inputVideo.videoWidth;
    outputCanvas.clearRect(0, 0, opCanvas.width, opCanvas.height); // 清除画布内容

/*
    // 指定源图像绘制的起始Y坐标和高度（10%到20%区域）
    const sourceStartY = inputVideo.videoHeight * 0.3; // 源图像的起始Y坐标
    const sourceHeight = inputVideo.videoHeight * 0.6; // 源图像的高度

    // 目标画布上的绘制位置和大小，这里我们将这部分绘制在画布的顶部，覆盖整个画布宽度
    const destX = 0;
    const destY = 0;
    const destWidth = opCanvas.width;
    const destHeight = opCanvas.height;

    // 使用drawImage绘制指定区域
    // 注意：drawImage的第二个和第三个参数分别是源图像的x和y坐标，第四和第五个参数分别是源图像的宽度和高度
    // 第六到九个参数分别是目标画布上的x、y坐标和宽度、高度
    outputCanvas.drawImage(results.image,
        0, sourceStartY, inputVideo.videoWidth, sourceHeight,
        destX, destY, destWidth, destHeight);

    outputCanvas.restore(); // 恢复画布状态
*/

    // 在绘制之前应用水平翻转和平移变换
    //canvasCtx5.scale(-1, 1); // 水平翻转画布
    //canvasCtx5.translate(-outputCanvas.width, 0); // 平移画布

    outputCanvas.drawImage(results.image, 0, 0, opCanvas.width, opCanvas.height); // 绘制摄像头图像

}
// 绘制姿态连线
function drawPoseConnections(results) {
    // 绘制姿态连接线
    drawConnectors(outputCanvas, results.poseLandmarks, POSE_CONNECTIONS, {
        /*
        color: (data) => {
            const x0 = opCanvas.width * data.from.x;
            const y0 = opCanvas.height * data.from.y;
            const x1 = opCanvas.width * data.to.x;
            const y1 = opCanvas.height * data.to.y;

            const z0 = clamp(data.from.z + 0.5, 0, 1);
            const z1 = clamp(data.to.z + 0.5, 0, 1);
            // 根据连接点的位置和深度信息创建渐变色
            const gradient = outputCanvas.createLinearGradient(x0, y0, x1, y1);
            gradient.addColorStop(0, `rgba(0, ${255 * z0}, ${255 * (1 - z0)}, 1)`);
            gradient.addColorStop(1.0, `rgba(0, ${255 * z1}, ${255 * (1 - z1)}, 1)`);
            return gradient;
        }
        */
        color: '#FF0000', // 统一使用红色绘制连线
        lineWidth: 2
    });
}
// 绘制关键点
function drawLandmarksPositions(results) {
    /*
    // 绘制关键点
    drawLandmarks(outputCanvas, Object.values(POSE_LANDMARKS_LEFT).map(index => results.poseLandmarks[index]), {
        color: zColor,
        fillColor: '#FF0000'
    });
    drawLandmarks(outputCanvas, Object.values(POSE_LANDMARKS_RIGHT).map(index => results.poseLandmarks[index]), {
        color: zColor,
        fillColor: '#00FF00'
    });
    drawLandmarks(outputCanvas, Object.values(POSE_LANDMARKS_NEUTRAL).map(index => results.poseLandmarks[index]), {
        color: zColor,
        fillColor: '#AAAAAA'
    });
    */
    // 绘制关键点
    //左侧关键点
    drawLandmarks(outputCanvas, Object.values(POSE_LANDMARKS_LEFT).map(index => results.poseLandmarks[index]), {
        color: '#0000FF', // 统一使用蓝色绘制关键点边框
        fillColor: '#0000FF', // 同样使用蓝色填充关键点
        radius: 2
    });
    //右侧关键点
    drawLandmarks(outputCanvas, Object.values(POSE_LANDMARKS_RIGHT).map(index => results.poseLandmarks[index]), {
        color: '#0000FF', // 统一使用蓝色
        fillColor: '#0000FF', // 同样使用蓝色
        radius: 2
    });
    //中间关键点
    drawLandmarks(outputCanvas, Object.values(POSE_LANDMARKS_NEUTRAL).map(index => results.poseLandmarks[index]), {
        color: '#0000FF', // 统一使用蓝色
        fillColor: '#0000FF', // 同样使用蓝色
        radius: 2
    });
    outputCanvas.restore(); // 恢复画布状态
}
// 画凸包
function drawConvexHull(targetIndex) {
    // 从keypointPositions中提取特定关键点的最新20个位置
    const filteredPositions = keypointPositions
        .filter(pos => pos.index === targetIndex)
        .slice(-10); // 保留最后10个元素

    // 将这些位置映射到canvas坐标系
    const points = filteredPositions.map(pos => [opCanvas.width * pos.x, opCanvas.height * pos.y]);

    // 使用d3.polygonHull计算凸包
    const hull = d3.polygonHull(points);

    if (hull) {
        outputCanvas.beginPath();
        hull.forEach((point, i) => {
            if (i === 0) {
                outputCanvas.moveTo(point[0], point[1]);
            } else {
                outputCanvas.lineTo(point[0], point[1]);
            }
        });
        // 将凸包的终点和起点连接起来
        outputCanvas.closePath();

        // 设置凸包的样式
        outputCanvas.strokeStyle = '#FF0000'; // 设置描边颜色
        outputCanvas.stroke();
        outputCanvas.fillStyle = 'rgba(255, 255, 0, 0.5)'; // 设置填充颜色，这里使用半透明的黄色
        outputCanvas.fill();
    }

    // 绘制特定关键点的最新10个位置
    filteredPositions.forEach((pos, index) => {
        const x = opCanvas.width * pos.x; // 使用保存的x坐标
        const y = opCanvas.height * pos.y; // 使用保存的y坐标
        const opacity = (index + 1) / filteredPositions.length; // 计算透明度，最旧的点（index=0）透明度最低，最新的点透明度最高
        outputCanvas.beginPath();
        outputCanvas.arc(x, y, 3, 0, 2 * Math.PI); // 绘制半径为3的圆点
        outputCanvas.fillStyle = `rgba(255, 0, 0, ${opacity})`; // 设置填充颜色，透明度根据点的新旧程度变化
        outputCanvas.fill();
    });
}


// 画目标角，使用特殊的颜色和粗细
function drawSelectedPoseFeatures(results, selectedLandmarks, selectedConnections, options) {
    const { landmarkColor, connectionColor, landmarkSize, connectionWidth } = options;

    // 绘制选中的连线
    const connectionsToDraw = POSE_CONNECTIONS.filter(connection =>
        selectedConnections.includes(connection[0]) && selectedConnections.includes(connection[1])
    );

    drawConnectors(outputCanvas, results.poseLandmarks, connectionsToDraw, {
        color: connectionColor,
        lineWidth: connectionWidth
    });

    // 绘制选中的关键点
    const landmarksToDraw = results.poseLandmarks.filter((_, index) => selectedLandmarks.includes(index));
    drawLandmarks(outputCanvas, landmarksToDraw, {
        color: landmarkColor,
        fillColor: landmarkColor, // 假设填充颜色与边缘颜色相同
        size: landmarkSize
    });
}

//在目标位置书写文字
function drawTextOnCanvas(canvasId, text, position, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas元素未找到');
        return;
    }

    const ctx = canvas.getContext('2d');

    // 应用绘制选项
    ctx.font = options.font || '16px Arial';
    ctx.fillStyle = options.color || 'black';

    // 绘制文本
    ctx.fillText(text, position.x, position.y);
}

// 绘制和标注目标angle
function drawAngle(results){
    var angleIndex = [];
    var connectionIndex = [];
    if(angle11.style.display === 'block'){
        angleIndex=[14,12,24];
        connectionIndex=[14,12,12,24];
        // 标注角度名
        drawTextOnCanvas('outputCanvas', 'Angle1',
            {x: results.poseLandmarks[12].x*opCanvas.width+20, y: results.poseLandmarks[12].y*opCanvas.height+10},
            {
                font: '20px Georgia',
                color: 'blue'
            });
    }
    if(angle22.style.display === 'block'){
        angleIndex=[12,14,16];
        connectionIndex=[12,14,14,16];
        // 标注角度名
        drawTextOnCanvas('outputCanvas', 'Angle2',
            {x: results.poseLandmarks[14].x*opCanvas.width+20, y: results.poseLandmarks[14].y*opCanvas.height-20},
            {
                font: '20px Georgia',
                color: 'blue'
            });
    }
    if(angle33.style.display === 'block'){
        angleIndex=[12,24,26];
        connectionIndex=[12,24,24,26];
        // 标注角度名
        drawTextOnCanvas('outputCanvas', 'Angle3',
            {x: results.poseLandmarks[24].x*opCanvas.width-80, y: results.poseLandmarks[24].y*opCanvas.height+10},
            {
                font: '20px Georgia',
                color: 'blue'
            });
    }

    drawSelectedPoseFeatures(results,
        angleIndex, // 选中的关键点索引，例如选中头部和肩膀的关键点
        connectionIndex, // 选中的连线对应的关键点索引，例如连接头部和肩膀的连线
        {
            landmarkColor: '#FF0000', // 关键点颜色
            connectionColor: '#00FF00', // 连线颜色
            landmarkSize: 10, // 关键点大小
            connectionWidth: 4 // 连线宽度
        }
    );
}


// 初始化对象来存储开关状态
let visualizationModes = {
    originalImage: true, // 默认状态根据checkbox的初始状态
    skeleton: true,
    hull: true
};

// 为每个checkbox添加事件监听器
document.getElementById('originalImage').addEventListener('change', function() {
    visualizationModes.originalImage = this.checked; // 更新状态
});

document.getElementById('skeleton').addEventListener('change', function() {
    visualizationModes.skeleton = this.checked; // 更新状态
});

document.getElementById('hull').addEventListener('change', function() {
    visualizationModes.hull = this.checked; // 更新状态
});
