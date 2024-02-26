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
function setAngleSeries(min,max){
    return [
        {
            name: '角度',
            title: { // 控制仪表盘名称显示的样式
                // 显示的文本内容，这里作为示例
                show: true, // 确保标题显示
                offsetCenter: [0, '70%'], // 调整名称位置，第一个值是水平偏移，第二个值是垂直偏移
                textStyle: { // 文本样式
                    color: '#e0d1cc', // 字体颜色
                    fontSize: 14, // 字体大小
                    fontWeight: 'bold', // 字体粗细
                    fontFamily: 'Arial' // 字体类型
                }
            },
            type: 'gauge',
            min: 0, // 最小值
            max: 180, // 最大值
            //startAngle: 180, // 起始角度
            //endAngle: 0, // 结束角度
            axisLine: { // axisLine定义了仪表盘轴线（外圈）的样式
                lineStyle: {
                    width: 10, // 轴线的宽度
                    color: [ // 轴线的颜色分段，每个元素是一个二元组，第一项是分段的结束百分比，第二项是颜色
                        [min, '#67e0e3'], // 0%到30%是#67e0e3颜色
                        [max, '#37a2da'], // 30%到70%是#37a2da颜色
                        [1, '#fd666d'] // 70%到100%是#fd666d颜色
                    ]
                }
            },
            pointer: { // 指针的样式配置
                itemStyle: {
                    color: 'auto' // 指针颜色，'auto'表示自动根据仪表盘的颜色变化（即根据当前值所在的颜色区间）
                },
                width: 4
            },
            axisTick: { // 刻度线的样式配置
                distance: -10, // 刻度线与轴线的距离，负值表示向内
                length: 4, // 刻度线的长度
                lineStyle: {
                    color: '#fff', // 刻度线的颜色
                    width: 1 // 刻度线的宽度
                }
            },
            splitLine: { // 分割线的样式配置（较长的刻度线，通常用于标示主要分割点）
                distance: -10, // 分割线与轴线的距离，负值表示向内
                length: 10, // 分割线的长度
                lineStyle: {
                    color: '#fff', // 分割线的颜色
                    width: 2 // 分割线的宽度
                }
            },
            axisLabel: { // 轴标签的样式配置（显示在分割线旁的文本，通常表示数值）
                color: 'inherit', // 标签颜色，'inherit'表示继承轴线的颜色
                distance: 15, // 标签与轴线的距离
                fontSize: 10 // 标签的字体大小
            },
            detail: {   // 仪表盘中心的详情显示配置
                valueAnimation: true, // 数值变化时是否显示动画效果
                formatter: '{value}°',
                color: 'inherit', // 文本颜色，'inherit'表示继承轴线的颜色
                fontSize: 15  // 调整字体大小
            },
            data: [{value: 90, name: '角度'}],
        }
    ]
}

// 仪表盘频率样式
const frequencySeries = [
    {
        // 第一个仪表盘配置
        name: '频率',
        type: 'gauge',
        min: 0, // 最小值
        max: 2, // 最大值
        startAngle: 200,// 起始角度
        endAngle: -20,// 结束角度
        center: ['50%', '60%'], // 仪表盘的中心位置，相对于容器的百分比定位
        splitNumber: 5, // 分割段数，即主刻度数量
        itemStyle: {
            color: '#FFAB91' // 指针颜色
        },
        progress: {
            show: true, // 是否显示进度条
            width: 15 // 进度条宽度
        },
        pointer: {
            show: false // 不显示指针
        },
        axisLine: {
            lineStyle: {
                width: 15, // 轴线（进度条外环）宽度
            }
        },
        axisTick: {
            distance: -25, // 刻度到轴线的距离
            splitNumber: 5, // 分割的小刻度数量
            lineStyle: {
                width: 2, // 刻度线宽度
                color: '#999' // 刻度线颜色
            }
        },
        splitLine: {
            distance: -32, // 分割线到轴线的距离
            length: 10, // 分割线长度
            lineStyle: {
                width: 3, // 分割线宽度
                color: '#999' // 分割线颜色
            }
        },
        axisLabel: {
            distance: -20, // 标签到轴线的距离
            color: '#999', // 标签颜色
            fontSize: 15 // 标签字体大小
        },
        anchor: {
            show: false // 不显示锚点
        },
        title: {
            show: false // 不显示标题
        },
        detail: {
            valueAnimation: true, // 值变化时是否显示动画
            width: '60%', // 详情宽度
            lineHeight: 40, // 行高
            borderRadius: 8, // 边框圆角
            offsetCenter: [0, '-15%'], // 相对中心的偏移
            fontSize: 15, // 字体大小
            //fontWeight: 'bolder', // 字体粗细
            formatter: '{value}次/秒', // 格式化文本，显示值和单位
            color: 'inherit' // 颜色继承自全局或父级
        },
        data: [{value: 1, name: '频率'}],
    },
    {
        // 第二个仪表盘配置（主要用于显示内层的进度条）
        type: 'gauge',
        min: 0, // 最小值
        max: 2, // 最大值
        startAngle: 200,// 起始角度
        endAngle: -20,// 结束角度
        center: ['50%', '60%'], // 仪表盘的中心位置，相对于容器的百分比定位
        itemStyle: {
            color: '#FD7347' // 进度条颜色
        },
        progress: {
            show: true, // 显示进度条
            width: 8 // 进度条宽度较细
        },
        pointer: {
            show: false // 不显示指针
        },
        axisLine: {
            show: false // 不显示轴线
        },
        axisTick: {
            show: false // 不显示刻度
        },
        splitLine: {
            show: false // 不显示分割线
        },
        axisLabel: {
            show: false // 不显示标签
        },
        detail: {
            show: false // 不显示详情
        },
        data: [{value: 1, name: '频率'}],
    }
]


let containerChart3 = document.getElementById('containerChart3');
let containerChart4 = document.getElementById('containerChart4');
let containerChart5 = document.getElementById('containerChart5');

const firstChartContainer = document.getElementById('firstChartContainer');

// 初始化仪表盘
let gauge1 = null;
let gauge2 = initGauge(containerChart3,setAngleSeries(145/180,165/180));
let gauge3 = initGauge(containerChart4,setAngleSeries(110/180,140/180));
let gauge4 = initGauge(containerChart5,frequencySeries);

function initGauge(targetContainer,series) {
    // 确保容器存在
    if (!targetContainer) return null;

    // 设置容器的宽度和高度
    targetContainer.style.width = firstChartContainer.offsetWidth + 'px';
    targetContainer.style.height = firstChartContainer.offsetHeight + 'px';

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
        series: [
            {data: [{value: value}]},
            {data: [{value: value}]},// 采用双仪表盘的都要更新
        ]
    });
}

