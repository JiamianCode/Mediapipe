// 获取仪表盘频率样式
const frequencySeries = [
    {
        // 第一个仪表盘配置
        name: 'Frequency',
        type: 'gauge',
        min: 0, // 最小值
        max: 2.4, // 最大值
        startAngle: 200,// 起始角度
        endAngle: -20,// 结束角度
        center: ['50%', '60%'], // 仪表盘的中心位置，相对于容器的百分比定位
        radius:'70%',
        splitNumber: 6, // 分割段数，即主刻度数量
        itemStyle: {
            color: colorFrequencyLow_low // 指针颜色
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
            formatter: '{value} cps', // 格式化文本，显示值和单位
            color: 'inherit' // 颜色继承自全局或父级
        },
        data: [{value: 1.2,name: 'Frequency'}],
        animation: false, // 取消指针动画
    },
    {
        // 第二个仪表盘配置（主要用于显示内层的进度条）
        type: 'gauge',
        title: { // 控制仪表盘名称显示的样式
            // 显示的文本内容，这里作为示例
            show: true, // 确保标题显示
            offsetCenter: [0, '50%'], // 调整名称位置，第一个值是水平偏移，第二个值是垂直偏移
            textStyle: { // 文本样式
                color: colorAngleTitle, // 字体颜色
                fontSize: 14, // 字体大小
                fontWeight: 'bold', // 字体粗细
                fontFamily: 'Arial' // 字体类型
            }
        },
        min: 0, // 最小值
        max: 2.4, // 最大值
        startAngle: 200,// 起始角度
        endAngle: -20,// 结束角度
        center: ['50%', '60%'], // 仪表盘的中心位置，相对于容器的百分比定位
        radius:'70%',
        itemStyle: {
            color: colorFrequencyHigh_low // 进度条颜色
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
        data: [{value: 1.2, name: 'Frequency'}],
        animation: false, // 取消指针动画
    }
]

let maxFrequency = 2;
let minFrequency = 1.6;

let frequencyArray = [];

function updateFrequencyGauge(gauge, value) {
    // 检查echarts实例和角度值是否为null，若为null则不更新
    if (!gauge || value === null) return;

    // frameCount++;
    // if (frameCount % frameGap !== 0) return;

    // 更新图表数据
    gauge.setOption({
        series: [
            {
                itemStyle: {// 进度条颜色
                    color: function (){
                        return value > maxFrequency ? colorFrequencyLow_high : (value < minFrequency ? colorFrequencyLow_low : colorFrequencyLow_mid);
                    }
                },
                data: [{value: value,name: 'Frequency'}]
            },
            {
                itemStyle: {
                    color: function (){
                        return value > maxFrequency ? colorFrequencyHigh_high : (value < minFrequency ? colorFrequencyHigh_low : colorFrequencyHigh_mid);
                    }
                },
                data: [{value: value,name: 'Frequency'}]
            },// 采用双仪表盘的都要更新
        ]
    });
}