const video_width = 580;
const video_height = 520;

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

// 处理MediaPipe Pose结果的回调函数
function onResultsPose(results) {
  document.body.classList.add('loaded'); // 标记页面已加载完成
  fpsControl.tick(); // 更新FPS控制

  canvasCtx5.save(); // 保存当前画布状态
  out5.width = video_width;
  out5.height = video_height;
  canvasCtx5.clearRect(0, 0, out5.width, out5.height); // 清除画布内容
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
}

// 实例化Pose对象，并设置模型文件的路径
const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
}});

// 设置处理结果的回调函数
pose.onResults(onResultsPose);


// 实例化Camera对象，设置摄像头输入和回调函数
const camera = new Camera(video5, {
  onFrame: async () => {
    await pose.send({image: video5}); // 将摄像头图像发送给Pose处理
  },
  width: video_width, // 设置视频宽度
  height: video_height // 设置视频高度
});
camera.start(); // 启动摄像头

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
