const video_width = 580;
const video_height = 480;

// 获取HTML文档中的摄像头视频输入和图像输出元素
const video5 = document.getElementsByClassName('input_video5')[0]; // 摄像头视频输入
const out5 = document.getElementsByClassName('output5')[0]; // 处理后的图像输出画布
const controlsElement5 = document.getElementsByClassName('control5')[0]; // 控制面板元素，用于调整设置
const canvasCtx5 = out5.getContext('2d'); // 获取画布的2D渲染上下文

// 实例化FPS控制对象，用于监控和控制帧率
const fpsControl = new FPS();

// 获取加载动画元素，并在动画结束时隐藏它
const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
  spinner.style.display = 'none';
};

// 定义一个函数，根据z轴的深度值改变颜色
function zColor(data) {
  const z = clamp(data.from.z + 0.5, 0, 1); // 将z值归一化并限制在0到1之间
  return `rgba(0, ${255 * z}, ${255 * (1 - z)}, 1)`; // 返回根据z值变化的颜色
}


let wristPositions = []; // 存储每一帧右手腕的位置
//高斯平滑
function gaussianSmooth(dataY, sigma = 2) {
  // 此处假设dataY是包含y值的数组
  const gaussKernel = [];
  let kernelSize = Math.ceil(sigma * 3) * 2 + 1;
  let kernelHalf = Math.floor(kernelSize / 2);
  let sum = 0;

  for (let i = -kernelHalf; i <= kernelHalf; i++) {
    let value = Math.exp(-(i * i) / (2 * sigma * sigma));
    gaussKernel.push(value);
    sum += value;
  }

  // 归一化高斯核
  const normalizedKernel = gaussKernel.map(val => val / sum);

  return dataY.map((_, idx) => {
    let weightedSum = 0;
    let weightSum = 0;
    for (let i = -kernelHalf; i <= kernelHalf; i++) {
      let dataIndex = idx + i;
      if (dataIndex >= 0 && dataIndex < dataY.length) {
        weightedSum += dataY[dataIndex] * normalizedKernel[i + kernelHalf];
        weightSum += normalizedKernel[i + kernelHalf];
      }
    }
    return weightedSum / weightSum;
  });
}
//更新图表
function updateChart() {
  const svg = d3.select("#wristChart");
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 400 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;

  svg.selectAll("*").remove();

  const chart = svg.append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 提取y值数组
  const yValues = wristPositions.map(pos => pos.y);
  const smoothedYValues = gaussianSmooth(yValues);

  const xScale = d3.scaleLinear()
                   .domain([0, smoothedYValues.length - 1])
                   .range([0, width]);

  const yScale = d3.scaleLinear()
                   //.domain([Math.min(...smoothedYValues), Math.max(...smoothedYValues)])
                   .domain([0.5, 1])
                   .range([height, 0]);

  const line = d3.line()
                 .x((_, i) => xScale(i))
                 .y(d => yScale(d));

  chart.append("path")
       .datum(smoothedYValues)
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-width", 1.5)
       .attr("d", line);

  chart.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(xScale));

  chart.append("g")
       .call(d3.axisLeft(yScale));

  svg.append("text")
     .attr("x", (width / 2) + margin.left)
     .attr("y", margin.top / 2)
     .attr("text-anchor", "middle")
     .style("font-size", "16px")
     .text("Wrist Position Over Time");
}


// 处理MediaPipe Pose结果的回调函数
function onResultsPose(results) {
  document.body.classList.add('loaded'); // 标记页面已加载完成
  fpsControl.tick(); // 更新FPS控制

  canvasCtx5.save(); // 保存当前画布状态
  out5.width = video_width;
  out5.height = video_height;
  canvasCtx5.clearRect(0, 0, out5.width, out5.height); // 清除画布内容
  // 在绘制之前应用水平翻转和平移变换
  canvasCtx5.scale(-1, 1); // 水平翻转画布
  canvasCtx5.translate(-out5.width, 0); // 平移画布

  canvasCtx5.drawImage(results.image, 0, 0, out5.width, out5.height); // 绘制摄像头图像


  // 绘制姿态连接线
  drawConnectors(canvasCtx5, results.poseLandmarks, POSE_CONNECTIONS, {
    color: (data) => {
      const x0 = out5.width * data.from.x;
      const y0 = out5.height * data.from.y;
      const x1 = out5.width * data.to.x;
      const y1 = out5.height * data.to.y;

      const z0 = clamp(data.from.z + 0.5, 0, 1);
      const z1 = clamp(data.to.z + 0.5, 0, 1);
      // 根据连接点的位置和深度信息创建渐变色
      const gradient = canvasCtx5.createLinearGradient(x0, y0, x1, y1);
      gradient.addColorStop(0, `rgba(0, ${255 * z0}, ${255 * (1 - z0)}, 1)`);
      gradient.addColorStop(1.0, `rgba(0, ${255 * z1}, ${255 * (1 - z1)}, 1)`);
      return gradient;
    }
  });

  // 绘制关键点
  drawLandmarks(canvasCtx5, Object.values(POSE_LANDMARKS_LEFT).map(index => results.poseLandmarks[index]), {color: zColor, fillColor: '#FF0000'});
  drawLandmarks(canvasCtx5, Object.values(POSE_LANDMARKS_RIGHT).map(index => results.poseLandmarks[index]), {color: zColor, fillColor: '#00FF00'});
  drawLandmarks(canvasCtx5, Object.values(POSE_LANDMARKS_NEUTRAL).map(index => results.poseLandmarks[index]), {color: zColor, fillColor: '#AAAAAA'});
  canvasCtx5.restore(); // 恢复画布状态

  // 直接在控制台打印关键点信息
  //console.log('关键点信息：');
  //console.log(results.poseLandmarks);

  // 获取右手腕的关键点（索引为16），并更新wristPositions数组
  const rightWrist = results.poseLandmarks[16]; // 假设索引16是右手腕
  if (rightWrist) {
      wristPositions.push({x: rightWrist.x, y: rightWrist.y}); // 保存x和y坐标
      if (wristPositions.length > 50) { // 限制数组大小，比如最近的50个数据点
          wristPositions.shift(); // 移除最旧的数据点
      }
  }

  // 绘制所有保存的右手腕位置并计算凸包
  const points = wristPositions.map(pos => [out5.width * pos.x, out5.height * pos.y]);

  // 使用d3.polygonHull计算凸包
  const hull = d3.polygonHull(points);

  if (hull) {
    canvasCtx5.beginPath();
    hull.forEach((point, i) => {
      if (i === 0) {
        canvasCtx5.moveTo(point[0], point[1]);
      } else {
        canvasCtx5.lineTo(point[0], point[1]);
      }
    });
    // 将凸包的终点和起点连接起来
    canvasCtx5.closePath();

    // 设置凸包的样式
    canvasCtx5.strokeStyle = '#FF0000'; // 设置描边颜色
    canvasCtx5.stroke();
    canvasCtx5.fillStyle = 'rgba(255, 255, 0, 1)'; // 设置填充颜色，这里使用半透明的红色
    canvasCtx5.fill();
  }

  // 绘制所有保存的右手腕位置
  wristPositions.forEach(pos => {
    const x = out5.width * pos.x; // 使用保存的x坐标
    const y = out5.height * pos.y; // 使用保存的y坐标
    canvasCtx5.beginPath();
    canvasCtx5.arc(x, y, 3, 0, 1 * Math.PI); // 绘制半径为3的圆点
    canvasCtx5.fillStyle = '#FF0000'; // 设置填充颜色
    canvasCtx5.fill();
  });

  // 更新图表
  updateChart();
}

// 实例化Pose对象，并设置模型文件的路径
const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
  },
  modelComplexity: 2, // 用于指定模型复杂度，0代表Lite，1代表Full，2代表Heavy
});

// 设置处理结果的回调函数
pose.onResults(onResultsPose);

/*
// 摄像头输入
// 实例化Camera对象，设置摄像头输入和回调函数
const camera = new Camera(video5, {
  onFrame: async () => {
    await pose.send({image: video5}); // 将摄像头图像发送给Pose处理
  },
  width: video_width, // 设置视频宽度
  height: video_height // 设置视频高度
});
camera.start(); // 启动摄像头
*/

// 视频输入
// 监听文件输入变化
document.getElementById('file').addEventListener('change', function(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const video = document.getElementById('video5');
  video.src = url;
  video.style.display = 'block';

  let frameRequest;

  const onFrame = () => {
    if (video.paused || video.ended) {
      cancelAnimationFrame(frameRequest);
      return;
    }
    pose.send({image: video}).then(() => {
      frameRequest = requestAnimationFrame(onFrame);
    }).catch(e => console.error(e));
  };

  video.onplay = () => {
    onFrame();
  };

  video.onpause = video.onended = () => {
    cancelAnimationFrame(frameRequest);
  };
});



// 初始化控制面板，让用户可以调整Pose检测的配置
new ControlPanel(controlsElement5, {
  // 控制面板选项
  selfieMode: true, // 自拍模式开关，默认开启
  upperBodyOnly: false, // 仅检测上半身开关，默认关闭
  smoothLandmarks: true, // 平滑关键点开关，默认开启
  minDetectionConfidence: 0.5, // 最小检测置信度滑块，默认0.5
  minTrackingConfidence: 0.5 // 最小跟踪置信度滑块，默认0.5
})
.add([
  // 向控制面板添加控件，包括静态文本、开关和滑块
  new StaticText({title: 'MediaPipe Pose'}), // 标题文本
  fpsControl, // FPS控制显示
  new Toggle({title: 'Selfie Mode', field: 'selfieMode'}), // 自拍模式开关
  new Toggle({title: 'Upper-body Only', field: 'upperBodyOnly'}), // 仅上半身检测开关
  new Toggle({title: 'Smooth Landmarks', field: 'smoothLandmarks'}), // 平滑关键点开关
  new Slider({
    // 最小检测置信度滑块
    title: 'Min Detection Confidence',
    field: 'minDetectionConfidence',
    range: [0, 1],
    step: 0.01
  }),
  new Slider({
    // 最小跟踪置信度滑块
    title: 'Min Tracking Confidence',
    field: 'minTrackingConfidence',
    range: [0, 1],
    step: 0.01
  }),
])
.on(options => {
  // 用户更改控制面板选项时的回调函数
  video5.classList.toggle('selfie', options.selfieMode); // 根据自拍模式选项反转视频
  pose.setOptions(options); // 将用户的选择应用到Pose模型设置中
});
