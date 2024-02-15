let outputCanvas = document.getElementById('outputCanvas'); // 处理后的图像输出画布
let canvas = outputCanvas.getContext('2d'); // 获取画布的2D渲染上下文

// 定义一个函数，根据z轴的深度值改变颜色
function zColor(data) {
    const z = clamp(data.from.z + 0.5, 0, 1); // 将z值归一化并限制在0到1之间
    return `rgba(0, ${255 * z}, ${255 * (1 - z)}, 1)`; // 返回根据z值变化的颜色
}

// 更新画面内容
function updateCanvasContext(results){
    canvas.save(); // 保存当前画布状态
    outputCanvas.width = inputVideo.videoWidth;
    outputCanvas.height = inputVideo.videoHeight;
    canvas.clearRect(0, 0, outputCanvas.width, outputCanvas.height); // 清除画布内容
    // 在绘制之前应用水平翻转和平移变换
    //canvasCtx5.scale(-1, 1); // 水平翻转画布
    //canvasCtx5.translate(-outputCanvas.width, 0); // 平移画布

    canvas.drawImage(results.image, 0, 0, outputCanvas.width, outputCanvas.height); // 绘制摄像头图像
}
// 绘制姿态连线
function drawPoseConnections(results) {
    // 绘制姿态连接线
    drawConnectors(canvas, results.poseLandmarks, POSE_CONNECTIONS, {
        color: (data) => {
            const x0 = outputCanvas.width * data.from.x;
            const y0 = outputCanvas.height * data.from.y;
            const x1 = outputCanvas.width * data.to.x;
            const y1 = outputCanvas.height * data.to.y;

            const z0 = clamp(data.from.z + 0.5, 0, 1);
            const z1 = clamp(data.to.z + 0.5, 0, 1);
            // 根据连接点的位置和深度信息创建渐变色
            const gradient = canvas.createLinearGradient(x0, y0, x1, y1);
            gradient.addColorStop(0, `rgba(0, ${255 * z0}, ${255 * (1 - z0)}, 1)`);
            gradient.addColorStop(1.0, `rgba(0, ${255 * z1}, ${255 * (1 - z1)}, 1)`);
            return gradient;
        }
    });
}
// 绘制关键点
function drawLandmarksPositions(results) {
    // Drawing landmarks for left, right, and neutral...
    // 绘制关键点
    drawLandmarks(canvas, Object.values(POSE_LANDMARKS_LEFT).map(index => results.poseLandmarks[index]), {
        color: zColor,
        fillColor: '#FF0000'
    });
    drawLandmarks(canvas, Object.values(POSE_LANDMARKS_RIGHT).map(index => results.poseLandmarks[index]), {
        color: zColor,
        fillColor: '#00FF00'
    });
    drawLandmarks(canvas, Object.values(POSE_LANDMARKS_NEUTRAL).map(index => results.poseLandmarks[index]), {
        color: zColor,
        fillColor: '#AAAAAA'
    });
    canvas.restore(); // 恢复画布状态
}
// 画凸包
function drawConvexHull(targetIndex) {
    // 从keypointPositions中提取特定关键点的最新50个位置
    const filteredPositions = keypointPositions
        .filter(pos => pos.index === targetIndex)
        .slice(-50); // 保留最后50个元素

    // 将这些位置映射到canvas坐标系
    const points = filteredPositions.map(pos => [outputCanvas.width * pos.x, outputCanvas.height * pos.y]);

    // 使用d3.polygonHull计算凸包
    const hull = d3.polygonHull(points);

    if (hull) {
        canvas.beginPath();
        hull.forEach((point, i) => {
            if (i === 0) {
                canvas.moveTo(point[0], point[1]);
            } else {
                canvas.lineTo(point[0], point[1]);
            }
        });
        // 将凸包的终点和起点连接起来
        canvas.closePath();

        // 设置凸包的样式
        canvas.strokeStyle = '#FF0000'; // 设置描边颜色
        canvas.stroke();
        canvas.fillStyle = 'rgba(255, 255, 0, 0.5)'; // 设置填充颜色，这里使用半透明的黄色
        canvas.fill();
    }

    // 绘制特定关键点的最新50个位置
    filteredPositions.forEach(pos => {
        const x = outputCanvas.width * pos.x; // 使用保存的x坐标
        const y = outputCanvas.height * pos.y; // 使用保存的y坐标
        canvas.beginPath();
        canvas.arc(x, y, 3, 0, 1.1 * Math.PI); // 绘制半径为3的圆点
        canvas.fillStyle = '#FF0000'; // 设置填充颜色
        canvas.fill();
    });
}
