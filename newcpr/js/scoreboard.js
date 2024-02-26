// 根据输入的标准值范围、用户给出的值以及正态分布的范围，计算该值在正态分布中的y值
function calculateNormalDistributionY(value, minRange, maxRange, maxValue, offsetValue=0) {
    // 计算均值mean
    const mean = (minRange + maxRange) / 2;
    // 估计标准差stdDev，这里需要根据特定条件调整
    const stdDev = (maxRange - minRange) / 2; // 这是一个简化的估计方法

    // 计算正态分布的概率密度函数值
    const y = maxValue * Math.exp(-((value - mean) ** 2) / (2 * stdDev ** 2));

    // 保留两位小数
    return y.toFixed(2);
}

console.log(calculateNormalDistributionY(45,40,50,25,0))

const containerChart6 = document.getElementById('containerChart6');
containerChart6.style.height = '200px';
containerChart6.style.width = '400px';
const stackedAreaChart = echarts.init(containerChart6);
const containerChart6option = {
    title: {
        text: 'Stacked Area Chart', // 图表标题
        left: '30%', // 将标题水平居中对齐
        top: '0%', // 将标题向下调整，距顶部5%
        textStyle: {
            fontSize: 18
        }
    },
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
        left: '5%', // 将图例向右调整，距左侧80%
        top: '10%', // 将图例向下调整，距顶部10%
        textStyle: {
            fontSize: 14
        }
    },
    toolbox: {
        feature: {
            saveAsImage: {} // 工具箱，提供导出图片功能
        }
    },
    grid: {
        left: '3%', // 网格左侧的距离
        right: '4%', // 网格右侧的距离
        bottom: '3%', // 网格底部的距离
        containLabel: true // 网格区域是否包含坐标轴的标签
    },
    xAxis: [
        {
            type: 'category', // x轴类型：类目轴
            boundaryGap: false, // 类目轴两端留白策略
            data: ['1', '2', '3', '4', '5', '6'] // x轴的数据
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
    series: [ // 系列列表。每个系列通过 type 决定自己的图表类型
        {
            name: 'Angle1', // 系列名称，用于tooltip的显示
            type: 'line', // 系列类型：线图
            stack: 'Total', // 数据堆叠，同个类目轴上系列配置相同的stack值可以堆叠放置
            areaStyle: {}, // 区域填充样式
            emphasis: {
                focus: 'series' // 高亮时聚焦的系列
            },
            data: [0,0,0,0,0,0] // 初始数据
        },
        {
            name: 'Angle2',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [0,0,0,0,0,0]
        },
        {
            name: 'Angle3',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [0,0,0,0,0,0]
        },
        // {
        //     name: 'frequency',
        //     type: 'line',
        //     stack: 'Total',
        //     areaStyle: {},
        //     emphasis: {
        //         focus: 'series'
        //     },
        //     data: [0,0,0,0,0,0]
        // },
        {
            name: 'frequency',
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
            data: [0,0,0,0,0,0]
        }
    ]
};
stackedAreaChart.setOption(containerChart6option);

let newData = [];
function updateChartData(chart, scores) {
    // 添加新scores到newData的开头
    newData.unshift(scores);

    // 保证newData只保留最新的六组数据
    if (newData.length > 6) {
        newData = newData.slice(0, 6);
    }

    // 初始化transposedData数组，长度等于scores数组的长度
    let transposedData = Array.from({length: scores.length}, () => []);

    // 动态转置newData
    newData.forEach(row => {
        row.forEach((value, index) => {
            // 为每个元素找到对应的列，不存在时用0填充
            transposedData[index].push(value || 0);
        });
    });

    // 确保每个系列数据长度为6
    let seriesData = transposedData.map(column => {
        while (column.length < 6) {
            column.unshift(0); // 在数组前面补充0至长度为6
        }
        return column;
    });

    // 更新图表系列数据
    let option = chart.getOption();
    option.series.forEach((series, index) => {
        // 确保不越界
        if(index < seriesData.length){
            series.data = seriesData[index];
        }
    });

    // 使用更新后的选项重新设置图表
    chart.setOption(option, true); // 第二个参数true表示不合并，而是替换之前的配置
}



