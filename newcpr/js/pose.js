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


let resultRecord = [];
let updateTimeout; // 用于检测更新停止的计时器
let find = false;
let analysis = false; //是否允许开始分析
// let modelLoad = false;
function onResultsPose(results) {
  if(typeof results.poseLandmarks === 'undefined') return;

  // 如果已存在计时器，则清除（表示有新的数据更新）
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }

  // 直接在控制台打印关键点信息
  //console.log('关键点信息：');
  //console.log(results.poseLandmarks);

  //document.body.classList.add('loaded'); // 标记页面已加载完成
  //fpsControl.tick(); // 更新FPS控制

  if(!find){
    findScale(results);
    find = true;
  }

  // 更新模型识别结果
  /*
  if(!modelLoad){
    updateModel(results).then(isCPR => {
      if (isCPR !== 'CPR') {
        // 如果返回值不是'CPR'，执行相应操作
        updateTeachText('正在检测CPR姿势！');
        updateCanvasContext(results); // 更新画面内容
      } else {
        // 如果返回值是'CPR'，执行其他操作
        updateTeachText('CPR姿势已测到！请继续！');
        if(selectCamera.classList.contains('btn-custom-selected')){
          document.getElementById('startButton').disabled = false;
          document.getElementById('stopButton').disabled = true;
        }
        else
          modelLoad = true;  //结束则置为false
      }
    }).catch(error => {
      // 错误处理
      console.error(error);
      // 可以选择在这里更新教学文本为错误信息
      updateTeachText('模型处理发生错误，请检查控制台日志。');
    });
    if(!modelLoad)
      return;
  }
  */

  // 处理画面
  updateCanvasContext(results); // 更新画面内容

  if(!analysis)
    return;

  if(visualizationModes.skeleton){
    drawPoseConnections(results);// 绘制姿态连线
    drawLandmarksPositions(results);// 绘制关键点
  }

  updateKeypointPositions(results);//更新关键点

  if(visualizationModes.hull){
    drawConvexHull(POSE_LANDMARKS.RIGHT_WRIST);// 画右手掌心的凸包
  }

  //更新图表
  updateLandmarkTrackChartData(myChart1, POSE_LANDMARKS.RIGHT_WRIST);

  var angle1,angle2,angle3;
  // pose关键点索引
  const LA = 14, LB = 12, LC = 24;
  // 计算角度
  angle1 = calculateAngle(results, LA, LB, LC);
  angle2 = calculateAngle(results,12,14,16);
  angle3 = calculateAngle(results,12,24,26);
  // 更新仪表盘
  updateAngleGauge(gauge1,angle1);
  updateAngleGauge(gauge2,angle2);
  updateAngleGauge(gauge3,angle3);

  addAngles(angle1,angle2,angle3);
  updateAngleCountChartData(myChart7,angle1Array);
  updateAngleCountChartData(myChart9,angle2Array);
  updateAngleCountChartData(myChart10,angle3Array);

  if(visualizationModes.skeleton) {
    // 画目标角，使用特殊的颜色和粗细
    drawAngle(results, angle1, angle2, angle3);
  }

  // 使用Pose结果更新仿真
  updateSimulationWithPose(results, POSE_LANDMARKS.RIGHT_SHOULDER);

  const frequency = calculateFrequency(POSE_LANDMARKS.RIGHT_WRIST); // 计算频率
  //console.log("frequency:",frequency);
  updateFrequencyGauge(gauge4,frequency);
  frequencyArray.push(frequency);

  // 绘制3d骨骼
  if(results)
  updateData(results);

  // 绘制堆叠图
  const scores = [
    calculateNormalDistributionY(angle1, minAngleRange1, maxAngleRange1, 15, 0),
    calculateNormalDistributionY(angle2, minAngleRange2, maxAngleRange2, 30, 0),
    calculateNormalDistributionY(angle3, minAngleRange3, maxAngleRange3, 15, 0),
    calculateNormalDistributionY(frequency, minFrequency, maxFrequency, 40, 0),
  ];
  //console.log(scores);
  updateChartData(stackedAreaChart,scores);

  const time = recordFrameScore(scores.reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0));

  if(time !== "none"){
    resultRecord.push({
      time:time,
      canvasURL:opCanvas.toDataURL()
    });
  }


  //更新平行坐标系
  var state = frequency < 1 ? 'Slow' : (frequency > 1.5 ? 'Fast' : 'Good')
  updateChart8([[angle1, angle2, angle3, state]]);


  // 设置延时，如果在1秒后没有新的更新，则执行函数
  updateTimeout = setTimeout(function() {
    //switchToBarChart(chart);
    //switchToPieChart(chart);
    updateTeach();
    showLargeModal();

    analysis = false;
  }, 1000); // 延时1秒
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