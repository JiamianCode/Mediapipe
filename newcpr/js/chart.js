let containerChart1 = document.getElementById('containerChart1');
let containerChart2 = document.getElementById('containerChart2');
let containerChart3 = document.getElementById('containerChart3');
let containerChart4 = document.getElementById('containerChart4');
let containerChart5 = document.getElementById('containerChart5');

let containerChart7 = document.getElementById('containerChart7');
let containerChart9 = document.getElementById('containerChart9');
let containerChart10 = document.getElementById('containerChart10');


// 设置容器的宽度和高度
containerChart1.style.height = containerChart1.offsetHeight + 'px';
containerChart1.style.width = containerChart1.offsetWidth + 'px';

containerChart2.style.height = containerChart2.offsetHeight + 'px';
containerChart2.style.width = containerChart2.offsetWidth + 'px';

containerChart3.style.height = containerChart3.offsetHeight + 'px';
containerChart3.style.width = containerChart3.offsetWidth + 'px';

containerChart4.style.height = containerChart4.offsetHeight + 'px';
containerChart4.style.width = containerChart4.offsetWidth + 'px';

containerChart5.style.height = containerChart5.offsetHeight + 'px';
containerChart5.style.width = containerChart5.offsetWidth + 'px';

containerChart7.style.height = containerChart7.offsetHeight + 'px';
containerChart7.style.width = containerChart7.offsetWidth + 'px';


containerChart9.style.height = containerChart9.offsetHeight + 'px';
containerChart9.style.width = containerChart9.offsetWidth + 'px';

containerChart10.style.height = containerChart10.offsetHeight + 'px';
containerChart10.style.width = containerChart10.offsetWidth + 'px';

// 初始化图表
let myChart1 = initLandmarkTrackChart(containerChart1);

// 初始化仪表盘
let gauge1 = initGauge(containerChart2,setAngleSeries(45/180,70/180)); // 调用 initGauge() 函数初始化仪表盘
let gauge2 = initGauge(containerChart3,setAngleSeries(120/180,165/180));
let gauge3 = initGauge(containerChart4,setAngleSeries(90/180,125/180));
let gauge4 = initGauge(containerChart5,frequencySeries);


// 初始化图表
let myChart7 = initAngleCount(containerChart7,minAngleRange1,maxAngleRange1);
let myChart9 = initAngleCount(containerChart9,minAngleRange2,maxAngleRange2);
let myChart10 = initAngleCount(containerChart10,minAngleRange3,maxAngleRange3);