var containerChart8 = document.getElementById('containerChart8');

containerChart8.style.width = '750px'
containerChart8.style.height = '210px'
// 初始化echarts实例
var myChart8 = echarts.init(containerChart8);


// 指定图表的配置项和数据
var option8 = {
    parallel:{
        left: '10%',
        right: '12%',
        top: '14%',
        bottom: '3%',
    },
    parallelAxis: [
        {
            dim: 0,
            name: 'Angle1',
            nameLocation: 'end', // 将名称置于上方
            min: 20, // 设置最小值
            max: 95, // 设置最大值
            //inverse: true, // 反转轴的方向
            nameTextStyle: {
                color: '#252525' // 设置轴名称的颜色为红色
            },
            axisLine: {
                lineStyle: {
                    color: '#ffffff', // 设置轴线的颜色为深青色
                    width: 2 // 设置轴线的粗细为2
                }
            },
            axisTick: {
                show: true,
                length: 10, // 刻度线的长度
                inside: false,
                lineStyle: {
                    color: '#ffffff',
                    width: 1
                }
            },
            axisLabel: {
                margin: 20, // 刻度标签与轴线之间的距离
                textStyle: {
                    color: function (value) {
                        return value > maxAngleRange1 ? colorLow : (value < minAngleRange1 ? colorHigh : colorMid);
                    }, // 文本的颜色
                    fontSize: 12 // 文本的字体大小
                },
                rotate: 0 // 刻度标签的旋转角度
            },
        },
        {
            dim: 1,
            name: 'Angle2',
            nameLocation: 'start', // 将名称置于上方
            min: 90, // 设置最小值
            max: 210, // 设置最大值
            inverse: true, // 反转轴的方向
            nameTextStyle: {
                color: '#252525' // 设置轴名称的颜色为红色
            },
            axisLine: {
                lineStyle: {
                    color: '#ffffff', // 设置轴线的颜色为深青色
                    width: 2 // 设置轴线的粗细为2
                }
            },
            axisTick: {
                show: true,
                length: 10, // 刻度线的长度
                inside: false,
                lineStyle: {
                    color: '#ffffff',
                    width: 1
                }
            },
            axisLabel: {
                margin: 20, // 刻度标签与轴线之间的距离
                textStyle: {
                    color: function (value) {
                        return value < minAngleRange2 ? colorLow : (value > maxAngleRange2 ? colorHigh : colorMid);
                    }, // 文本的颜色
                    fontSize: 12 // 文本的字体大小
                },
                rotate: 0 // 刻度标签的旋转角度
            },
        },
        {
            dim: 2,
            name: 'Angle3',
            nameLocation: 'start', // 将名称置于上方
            min: 55, // 设置最小值
            max: 160, // 设置最大值
            inverse: true, // 反转轴的方向
            nameTextStyle: {
                color: '#252525' // 设置轴名称的颜色为红色
            },
            axisLine: {
                lineStyle: {
                    color: '#ffffff', // 设置轴线的颜色为深青色
                    width: 2 // 设置轴线的粗细为2
                }
            },
            axisTick: {
                show: true,
                length: 10, // 刻度线的长度
                inside: false,
                lineStyle: {
                    color: '#ffffff',
                    width: 1
                }
            },
            axisLabel: {
                margin: 20, // 刻度标签与轴线之间的距离
                textStyle: {
                    color: function (value) {
                        return value < minAngleRange3 ? colorLow : (value > maxAngleRange3 ? colorHigh : colorMid);
                    }, // 文本的颜色
                    fontSize: 12 // 文本的字体大小
                },
                rotate: 0 // 刻度标签的旋转角度
            },
        },
        {
            dim: 3,
            name: 'Frequency',
            type: 'category',
            data: ['Fast', 'Good', 'Slow'],
            inverse: false, // 保持默认增长方向

            nameTextStyle: {
                color: '#252525' // 设置轴名称的颜色为红色
            },
            axisLine: {
                lineStyle: {
                    color: '#ffffff', // 设置轴线的颜色为深青色
                    width: 2 // 设置轴线的粗细为2
                }
            },
            axisTick: {
                show: true,
                length: 10, // 刻度线的长度
                inside: false,
                lineStyle: {
                    color: '#ffffff',
                    width: 1
                }
            },
            axisLabel: {
                margin: 20, // 刻度标签与轴线之间的距离
                textStyle: {
                    color: function (value) {
                        return value === 'Slow' ? colorLow : (value === 'Fast' ? colorHigh : colorMid);
                    }, // 文本的颜色
                    fontSize: 12 // 文本的字体大小
                },
                rotate: 0 // 刻度标签的旋转角度
            },
        }
    ],
    legend: {
        show: false // 隐藏图例
    },
    grid: {
        left: '-7%',
        right: '-1%',
        top: '10%',
        bottom: '-7%',
        containLabel: true
    },
    yAxis: {
        type: 'value',
        show: false // 隐藏y轴
    },
    xAxis: {
        type: 'category',
        data: ['', '', '', ''],
        show: false // 隐藏x轴
    },
    series: [
        {
            type: 'parallel',
            lineStyle: {
                width: 2, // 折线的宽度
                color: '#000000', // 折线的颜色，可以是单一颜色
                type: 'solid', // 折线的类型，默认为实线，可选为：'solid', 'dashed', 'dotted'
                /*
                opacity: 0.5, // 折线的透明度，从0到1
                shadowBlur: 5, // 折线阴影的模糊大小
                shadowColor: '#000', // 折线阴影的颜色
                shadowOffsetX: 0, // 折线阴影的水平偏移距离
                shadowOffsetY: 0, // 折线阴影的垂直偏移距离
                */
                cap: 'square', // 线帽的样式，可选值为'butt', 'round', 'square'
                join: 'miter', // 线段连接处的样式，可选值为'bevel', 'round', 'miter'
            },
            data: []
        },
        {
            name: 'Segment 1',
            type: 'bar',
            stack: 'total',
            barWidth: '20%',
            label: {
                show: false, // 去除柱子中数值的显示
            },
            itemStyle: {
                color: colorHigh // 段1的颜色
            },
            data: [0.34, 0.34, 0.34, 0.34] // 示例数据
        },
        {
            name: 'Segment 2',
            type: 'bar',
            stack: 'total',
            barWidth: '20%',
            itemStyle: {
                color: colorMid // 段2的颜色
            },
            data: [0.33, 0.33, 0.33, 0.33] // 示例数据
        },
        {
            name: 'Segment 3',
            type: 'bar',
            stack: 'total',
            barWidth: '20%',
            itemStyle: {
                color: colorLow // 段3的颜色
            },
            data: [0.33, 0.33, 0.33, 0.33] // 示例数据
        }
    ],
    animation: false, // 取消动画
};

// 使用刚指定的配置项和数据显示图表
myChart8.setOption(option8);

// 更新图表函数，可用于动态更新数据
function updateChart8(newData) {
    // 更新数据
    myChart8.setOption({
        series: [{
            data: newData
        }]
    });
}

// 可以通过调用updateChart函数来更新图表数据，例如：
//updateChart8([[15, 110, 90, 'Good'], [10, 90, 80, 'Fast']]);