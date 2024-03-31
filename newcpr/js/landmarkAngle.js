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

    // 提取坐标信息(三维)
    const pointA = [la.x, la.y, la.z];
    const pointB = [lb.x, lb.y, lb.z];
    const pointC = [lc.x, lc.y, lc.z];

    // 计算向量BA和BC
    const vectorAB = [pointA[0] - pointB[0], pointA[1] - pointB[1], pointA[2] - pointB[2]];
    const vectorBC = [pointC[0] - pointB[0], pointC[1] - pointB[1], pointC[2] - pointB[2]];

    // 计算点积
    const dotProduct = vectorAB[0] * vectorBC[0] + vectorAB[1] * vectorBC[1] + vectorAB[2] * vectorBC[2];

    // 计算模长
    const magnitudeAB = Math.sqrt(vectorAB[0]**2 + vectorAB[1]**2 + vectorAB[2]**2);
    const magnitudeBC = Math.sqrt(vectorBC[0]**2 + vectorBC[1]**2 + vectorBC[2]**2);

    // 计算夹角的余弦值
    const cosineTheta = dotProduct / (magnitudeAB * magnitudeBC);

    // 计算夹角的弧度，并确保没有除以零的情况
    const thetaRadians = Math.acos(Math.min(Math.max(cosineTheta, -1), 1));

    // 将弧度转换为度数
    const thetaDegrees = (thetaRadians * 180) / Math.PI;

    // 返回角度值，保留两位小数
    return thetaDegrees.toFixed(2);
}


// 获取仪表盘角度样式
function setAngleSeries(min,max){
    return [
        {
            name: 'Angle',
            title: { // 控制仪表盘名称显示的样式
                // 显示的文本内容，这里作为示例
                show: true, // 确保标题显示
                offsetCenter: [0, '70%'], // 调整名称位置，第一个值是水平偏移，第二个值是垂直偏移
                textStyle: { // 文本样式
                    color: colorAngleTitle, // 字体颜色
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
            center: ['50%', '55%'], // 仪表盘的中心位置，相对于容器的百分比定位
            radius:'95%',
            axisLine: { // axisLine定义了仪表盘轴线（外圈）的样式
                lineStyle: {
                    width: 10, // 轴线的宽度
                    color: [ // 轴线的颜色分段，每个元素是一个二元组，第一项是分段的结束百分比，第二项是颜色
                        [min, colorLow], // 0%到30%是#67e0e3颜色
                        [max, colorMid], // 30%到70%是#37a2da颜色
                        [1, colorHigh] // 70%到100%是#fd666d颜色
                    ]
                }
            },
            pointer: { // 指针的样式配置
                itemStyle: {
                    color: 'auto' // 指针颜色，'auto'表示自动根据仪表盘的颜色变化（即根据当前值所在的颜色区间）
                },
                width: 4,
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
            data: [{value: 90, name: 'Angle'}],
            animation: false, // 取消指针动画
        }
    ]
}


function initGauge(targetContainer,series) {
    // 确保容器存在
    if (!targetContainer) return null;

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
// let frameCount = 0;
// let frameGap = 15;
//取消指针动画之后可以解决这个问题
function updateAngleGauge(gauge, value) {
    // 检查echarts实例和角度值是否为null，若为null则不更新
    if (!gauge || value === null) return;

    // frameCount++;
    // if (frameCount % frameGap !== 0) return;

    // 更新图表数据
    gauge.setOption({
        series: [
            {data: [{value: value,name: 'Angle'}]},
        ]
    });
}

