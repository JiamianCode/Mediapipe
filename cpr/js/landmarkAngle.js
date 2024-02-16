
// 计算三个关键点形成的角度
function calculateAngle(results, LA, LB, LC) {
    // 确保关键点存在
    if (!results.poseLandmarks || results.poseLandmarks.length === 0 ||
        !results.poseLandmarks[LA] || !results.poseLandmarks[LB] || !results.poseLandmarks[LC]) {
        console.error("Invalid landmarks or indices");
        return null;
    }

    // 获取三个关键点的坐标
    const la = results.poseLandmarks[LA];
    const lb = results.poseLandmarks[LB];
    const lc = results.poseLandmarks[LC];

    // 提取坐标信息(二维)
    const pointA = [la.x, la.y];
    const pointB = [lb.x, lb.y];
    const pointC = [lc.x, lc.y];

    // 计算向量BA和BC
    const vectorAB = [pointA[0] - pointB[0], pointA[1] - pointB[1]];
    const vectorBC = [pointC[0] - pointB[0], pointC[1] - pointB[1]];

    // 计算点积
    const dotProduct = vectorAB[0] * vectorBC[0] + vectorAB[1] * vectorBC[1];

    // 计算模长
    const magnitudeAB = Math.sqrt(vectorAB[0]**2 + vectorAB[1]**2);
    const magnitudeBC = Math.sqrt(vectorBC[0]**2 + vectorBC[1]**2);

    // 计算夹角的余弦值
    const cosineTheta = dotProduct / (magnitudeAB * magnitudeBC);

    // 计算夹角的弧度，并确保没有除以零的情况
    const thetaRadians = Math.acos(Math.min(Math.max(cosineTheta, -1), 1));

    // 将弧度转换为度数
    const thetaDegrees = (thetaRadians * 180) / Math.PI;

    // 返回角度值，保留两位小数
    return thetaDegrees.toFixed(2);
}

// 仪表盘角度样式
const angleSeries = [
    {
        name: '角度',
        type: 'gauge',
        min: 0, // 最小值
        max: 180, // 最大值
        //startAngle: 180, // 起始角度
        //endAngle: 0, // 结束角度
        detail: {
            formatter: '{value}°',
            fontSize: 20  // 调整字体大小
        },
        data: [{value: 90, name: '角度'}],
    }
]

// 仪表盘频率样式
const frequencySeries = [
    {
        name: '频率',
        type: 'gauge',
        min: 0, // 最小值
        max: 2, // 最大值
        //startAngle: 180, // 起始角度
        //endAngle: 0, // 结束角度
        detail: {
            formatter: '{value}次/秒',
            fontSize: 15  // 调整字体大小
        },
        data: [{value: 1, name: '频率'}],
    }
]


let containerChart3 = document.getElementById('containerChart3');
let containerChart4 = document.getElementById('containerChart4');
let containerChart5 = document.getElementById('containerChart5');

// 初始化仪表盘
let gauge1 = null;
let gauge2 = initGauge(containerChart3,angleSeries);
let gauge3 = initGauge(containerChart4,angleSeries);
let gauge4 = initGauge(containerChart5,frequencySeries);

function initGauge(targetContainer,series) {
    // 确保容器存在
    if (!targetContainer) return null;

    // 设置容器的宽度和高度
    targetContainer.style.width = '400px';
    targetContainer.style.height = '300px';

    // 基于准备好的dom，初始化echarts实例
    let gauge = echarts.init(targetContainer);

    // 指定图表的配置项和数据
    const option = {
        tooltip : {
            formatter: "{a} <br/>{b} : {c}°"
        },
        series: series
    };

    // 使用刚指定的配置项和数据显示图表
    gauge.setOption(option);
    // 返回echarts实例以供后续使用
    return gauge;
}

// 更新图表

// 问题：angle按原始帧率推送时，波动太大太明显，暂时使用计数器来限流
// 根治方法：在帧更新的时候，记录好关键点坐标（或角度）的变化，要体现出极值的角度波动，体现出范围变化
// 新建议：多个角度需要显示的时候，不一定要用这种圆形仪表盘，因为又大又笨重，可以改用横条式的仪表盘
let frameCount = 0;
let frameGap = 15;
function updateGauge(gauge, value) {
    // 检查echarts实例和角度值是否为null，若为null则不更新
    if (!gauge || value === null) return;

    frameCount++;
    if (frameCount % frameGap !== 0) return;

    // 更新图表数据
    gauge.setOption({
        series: [{
            data: [{value: value}]
        }]
    });
}

