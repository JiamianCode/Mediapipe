// 根据输入的标准值范围、用户给出的值以及正态分布的范围，计算该值在正态分布中的y值
function calculateNormalDistributionY(value, minRange, maxRange, maxValue, offsetValue=0) {
    // 计算均值mean
    const mean = (minRange + maxRange) / 2;
    // 估计标准差stdDev，这里需要根据特定条件调整
    const stdDev = (maxRange - minRange) / 2; // 这是一个简化的估计方法

    // 计算正态分布的概率密度函数值
    const y = maxValue * Math.exp(-((value - mean) ** 2) / (2 * stdDev ** 2));

    // 保留两位小数
    return y.toFixed(0);
}

// console.log(calculateNormalDistributionY(45,40,50,25,0))

const containerChart6 = document.getElementById('containerChart6');
containerChart6.style.height = containerChart6.offsetHeight + 'px';
containerChart6.style.width = containerChart6.offsetWidth + 'px';

const stackedAreaChart = echarts.init(containerChart6);
const containerChart6option = {
    tooltip: {
        trigger: 'axis', // 触发类型：坐标轴触发
        axisPointer: {
            type: 'cross', // 指示器类型：十字准星指示器
            label: {
                backgroundColor: '#6a7985' // 指示器标签的背景色
            }
        }
    },
    legend: {
        data: ['Angle1', 'Angle2', 'Angle3', 'frequency'], // 图例组件，展示图表的不同系列的标记，颜色和名字
        left: 'center', // 将图例向右调整，距左侧80%
        top: '0%', // 将图例向下调整，距顶部10%
        textStyle: {
            fontSize: 12
        }
    },
    toolbox: {
        // feature: {
        //     saveAsImage: {} // 工具箱，提供导出图片功能
        // }
    },
    grid: {
        left: '0%', // 网格左侧的距离
        right: '15%', // 网格右侧的距离
        bottom: '10%', // 网格底部的距离
        top:'15%',
        containLabel: true // 网格区域是否包含坐标轴的标签
    },
    xAxis: [
        {
            type: 'category', // x轴类型：类目轴
            boundaryGap: false, // 类目轴两端留白策略
            animation: false, // 取消指针动画
            //data: ['1', '2', '3', '4', '5', '6'] // x轴的数据
        }
    ],
    yAxis: [
        {
            type: 'value', // y轴类型：数值轴
            min: 0, // 设置Y轴的最小值
            max: 100, // 设置Y轴的最大值
            // 可选：控制轴标签的显示格式
            axisLabel: {
                formatter: '{value}'
            }
        }
    ],
    // 数据区域缩放组件
    dataZoom: [
        {
            type: 'slider', // 滑动条缩放
            start: 0, // 数据窗口的起始百分比
            end: 100, // 数据窗口的结束百分比
            height:20,  //用于设置滑动条的高度
            bottom:0,  //距离容器下侧的距离
        },
        {
            type: 'inside' // 内置于坐标系的缩放
        }
    ],
    series: [ // 系列列表。每个系列通过 type 决定自己的图表类型
        {
            name: 'Angle1', // 系列名称，用于tooltip的显示
            color: colorScoreAngle1,
            type: 'line', // 系列类型：线图
            stack: 'Total', // 数据堆叠，同个类目轴上系列配置相同的stack值可以堆叠放置
            areaStyle: {}, // 区域填充样式
            emphasis: {
                focus: 'series' // 高亮时聚焦的系列
            },
            data: [0,0,0,0,0,0,0,0,0,0], // 初始数据
            animation: false, // 禁用动画效果
        },
        {
            name: 'Angle2',
            color: colorScoreAngle2,
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [0,0,0,0,0,0,0,0,0,0],
            animation: false, // 禁用动画效果
        },
        {
            name: 'Angle3',
            color: colorScoreAngle3,
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [0,0,0,0,0,0,0,0,0,0],
            animation: false, // 禁用动画效果
        },
        {
            name: 'frequency',
            color: colorScoreFrequency,
            type: 'line',
            stack: 'Total',
            label: {
                show: true,
                position: 'top'
            },
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [0,0,0,0,0,0,0,0,0,0],
            animation: false, // 禁用动画效果
            // 显示平均线
            markLine: {
                silent: true, // 禁用鼠标交互事件
                symbol: 'none', // 不显示标记（箭头）
                lineStyle: {
                    color: '#333', // 可调整为所需的颜色
                    type: 'dashed' // 设置为虚线，可选值为 'dashed' 或 'dotted'
                },
                data: [{ type: 'average', name: 'Avg' }],
                label:{
                    formatter: function(params) {
                        // 使用toFixed(0)保留0位小数
                        return params.name + ': ' + params.value.toFixed(0);
                    }
                },
                animation: false//取消动画效果
            }
        }
    ]
};
stackedAreaChart.setOption(containerChart6option);

let newData = [];
function updateChartData(chart, scores) {
    // 添加新scores到newData
    newData.push(scores);

    // 初始化transposedData数组，长度等于scores数组的长度
    let transposedData = Array.from({length: scores.length}, () => []);

    // 动态转置newData
    newData.forEach(row => {
        row.forEach((value, index) => {
            // 为每个元素找到对应的列，不存在时用0填充
            transposedData[index].push(value || 0);
        });
    });

    // 更新图表系列数据
    let option = chart.getOption();
    option.series.forEach((series, index) => {
        // 更新系列数据为转置后的数据
        if(index < transposedData.length){
            series.data = transposedData[index];
        }
    });

    // 设置倒一系列的 label.formatter
    option.series[option.series.length - 1].label.formatter = function(params) {
        // params.dataIndex 给出当前数据点在其系列中的索引，即 x 的位置
        let sum = 0;
        // 遍历所有系列以计算当前 x 下的总和
        option.series.forEach(series => {
            sum += series.data[params.dataIndex] ? +series.data[params.dataIndex] : 0;
        });
        // 返回格式化后的总和
        return sum.toFixed(0);
    };

    // 动态设置数据区域缩放组件的范围以聚焦最新的10个数据点
    let showPointNum = 10;
    let totalDataPoints = newData.length; // 总的数据点数量
    let startValue = totalDataPoints > showPointNum ? ((totalDataPoints - showPointNum) / totalDataPoints) * 100 : 0;
    option.dataZoom = [{
        start: startValue, // 根据总数据点数量动态计算开始值
        end: 100, // 总是结束于最新的数据点
    }, {
        start: startValue,
        end: 100,
    }];

    // 更新x轴数据：假设每个数据点对应一个标签
    option.xAxis.data = newData.map((_, index) => `${index + 1}`).reverse();

    // 使用更新后的选项重新设置图表
    chart.setOption(option, false); // 第二个参数true表示不合并，而是替换之前的配置
}

