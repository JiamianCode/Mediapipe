// 获取HTML文档中的摄像头视频输入和图像输出元素
//const controlsElement5 = document.getElementsByClassName('control5')[0]; // 控制面板元素，用于调整设置

// 实例化FPS控制对象，用于监控和控制帧率
//const fpsControl = new FPS();

// 获取加载动画元素，并在动画结束时隐藏它
/*
const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
  spinner.style.display = 'none';
};
*/

// 初始化用于存储关键点位置的数组
// 注意，暂时是不限制其规模增长的，若后续性能受到影响则进行改进
let keypointPositions = [];

// 定义要记录的关键点索引
const landmarks = [
  POSE_LANDMARKS.LEFT_SHOULDER,
  POSE_LANDMARKS.RIGHT_SHOULDER,
  POSE_LANDMARKS.LEFT_ELBOW,
  POSE_LANDMARKS.RIGHT_ELBOW,
  POSE_LANDMARKS.LEFT_WRIST,
  POSE_LANDMARKS.RIGHT_WRIST,
  POSE_LANDMARKS.LEFT_HIP,
  POSE_LANDMARKS.RIGHT_HIP,
];

// 更新关键点位置
function updateKeypointPositions(results) {
  const timestamp = Date.now(); // 获取当前时间戳
  if(results && results.poseLandmarks){
    // 为每个关键点创建一个新的记录，包括时间戳
    landmarks.forEach(index => {
      const landmark = results.poseLandmarks[index];
      if (landmark) {
        keypointPositions.push({
          index: index,
          x: landmark.x,
          y: landmark.y,
          time: timestamp });
      }
    });
  }
}


// 处理MediaPipe Pose结果的回调函数
const skeletonCheckbox = document.getElementById('skeleton');
const hullCheckbox = document.getElementById('hull');
function onResultsPose(results) {
  // 直接在控制台打印关键点信息
  //console.log('关键点信息：');
  //console.log(results.poseLandmarks);

  //document.body.classList.add('loaded'); // 标记页面已加载完成
  //fpsControl.tick(); // 更新FPS控制

  // 处理画面
  updateCanvasContext(results); // 更新画面内容

  if (skeletonCheckbox.checked){
    drawPoseConnections(results);// 绘制姿态连线
    drawLandmarksPositions(results);// 绘制关键点
  }

  // if(hullCheckbox.checked || chart1Visible){
  //   updateKeypointPositions(results);//更新关键点
  // }
  updateKeypointPositions(results);//更新关键点

  if(hullCheckbox.checked){
    drawConvexHull(POSE_LANDMARKS.RIGHT_WRIST);// 画右手掌心的凸包
  }

  //更新图表
  if(chart1Visible){
    updateLandmarkTrackChart(POSE_LANDMARKS.RIGHT_WRIST, "#chart1");  // 更新图表
  }

  if(chart2Visible){
    // pose关键点索引
    const LA = 14, LB = 12, LC = 24;
    // 计算角度
    const angle = calculateAngle(results, LA, LB, LC);
    // 更新仪表盘
    updateGauge(gauge1,angle);

    updateGauge(gauge2,calculateAngle(results,12,14,16));
    updateGauge(gauge3,calculateAngle(results,12,24,26));
  }

  updateSimulationWithPose(results, POSE_LANDMARKS.RIGHT_SHOULDER); // 使用Pose结果更新仿真

  const frequency = calculateFrequency(POSE_LANDMARKS.RIGHT_WRIST); // 计算频率
  //console.log("frequency:",frequency);
  updateGauge(gauge4,frequency);

  // 绘制3d骨骼
  updateKeypoints(results);
}

// 实例化Pose对象，并设置模型文件的路径
let pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
  }
});
pose.setOptions({
  modelComplexity: 2,// 用于指定模型复杂度，0代表Lite，1代表Full，2代表Heavy
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,// 平滑关键点开关，默认开启
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
// 设置处理结果的回调函数
pose.onResults(onResultsPose);
console.log("pose file ready")


// 初始化控制面板，让用户可以调整Pose检测的配置
/*
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
*/