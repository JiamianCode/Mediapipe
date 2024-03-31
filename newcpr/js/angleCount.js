// 定义全局变量数组
let angle1Array = [];
let angle2Array = [];
let angle3Array = [];
function addAngles(angle1, angle2, angle3) {
    // 将角度值添加到对应的数组中
    angle1Array.push(angle1);
    angle2Array.push(angle2);
    angle3Array.push(angle3);

    if(angle11.style.display === 'block'){
        document.getElementById('angleSize').textContent=`Current Angle Size：${angle1}°`;
    }
    if(angle22.style.display === 'block'){
        document.getElementById('angleSize').textContent=`Current Angle Size：${angle2}°`;
    }
    if(angle33.style.display === 'block'){
        document.getElementById('angleSize').textContent=`Current Angle Size：${angle3}°`;
    }
}

function initAngleCount(chart,min,max) {
    var myChart = echarts.init(chart);
    // 配置项和数据
    var option = {
        // 提示框组件，展示数据等信息
        tooltip: {
            trigger: 'axis'
        },
        // 直角坐标系内绘图网格
        grid: {
            left: '7%',
            right: '4%',
            bottom: '25%',
            top: '10%',
        },
        // x轴配置
        xAxis: {
            type: 'category',
            animation: false,
        },
        // y轴配置
        yAxis: {
            type: 'value',
            min: min-20,
            max: max+20,
            splitLine: {
                show: false
            }
        },
        // 配置视觉映射组件，根据数据值映射颜色
        visualMap: {
            orient: 'horizontal', // 设置水平排布
            top: 0,
            left: 'center',
            right: 'auto',
            precision: 1,
            pieces: [
                {gt: 0, lte: min, color: colorLow},
                {gt: min, lte: max, color: colorMid},
                {gt: max, color: colorHigh},
            ],
            outOfRange: {
                color: '#999'
            }
        },
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
        // 系列列表。每个系列通过type决定自己的图表类型
        series: [{
            name: 'Angle',
            type: 'scatter', // 修改图表类型为散点图
            data: [], // 初始数据为空，稍后动态更新
            animation: false,
            markLine: {
                silent: true, // 禁用鼠标交互事件
                symbol: 'none', // 不显示标记（箭头）
                lineStyle: {
                    color: '#333', // 可调整为所需的颜色
                    type: 'dashed' // 设置为虚线，可选值为 'dashed' 或 'dotted'
                },
                data: [
                    {yAxis: min, label: {show: false}},
                    {yAxis: max, label: {show: false}},
                ]
            }
        }]
    };

    myChart.setOption(option);
    return myChart; // 返回图表实例以便后续更新数据
}



//更新图表
function updateAngleCountChartData(chart, angleArray) {

    // 构建散点图数据，x轴坐标为索引，y轴坐标为角度值
    var data = angleArray.map(function (item, index) {
        return [index, item];
    });

    // 更新散点图数据
    var option = chart.getOption();
    option.series[0].data = data;

    // 计算开始和结束值，以便数据区域缩放组件只显示最新的100个点
    let showPointNum = 100;
    let totalDataPoints = newData.length; // 总的数据点数量
    let startValue = totalDataPoints > showPointNum ? ((totalDataPoints - showPointNum) / totalDataPoints) * 100 : 0;
    option.dataZoom = [{
        start: startValue, // 根据总数据点数量动态计算开始值
        end: 100, // 总是结束于最新的数据点
    }, {
        start: startValue,
        end: 100,
    }];


    chart.setOption(option);



}

// 转换散点图为条形图
function switchToBarChart(chart) {
    // 假设我们有三个区间：0-45, 46-70, 71-90
    let intervals = [0, 45, 70, 90];
    let counts = [0, 0, 0]; // 存储每个区间的点数

    // 获取当前图表的散点数据
    let scatterData = chart.getOption().series[0].data;

    // 计算每个区间的点数
    scatterData.forEach(function (point) {
        for (let i = 0; i < intervals.length - 1; i++) {
            if (point[1] > intervals[i] && point[1] <= intervals[i + 1]) {
                counts[i]++;
                break;
            }
        }
    });

    // 构建条形图的配置项
    let barOption = {
        // 图表标题
        title: {
            text: 'unName-2',
            left: '20%'
        },
        // 提示框组件，展示数据等信息
        tooltip: {
            trigger: 'axis'
        },
        // 直角坐标系内绘图网格
        grid: {
            left: '7%',
            right: '24%',
            bottom: '25%',
            top: '15%',
        },
        xAxis: {
            type: 'category',
            data: ['0-45', '46-70', '71-90']
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false
            }
        },
        series: [{
            type: 'bar',
            data: counts.map((count, index) => ({
                value: count,
                // 根据区间设置颜色
                itemStyle: {
                    color: index === 0 ? '#67e0e3' : index === 1 ? '#37a2da' : '#fd666d'
                }
            })),
        }],
        // 可选：如果你想要保留散点图的视觉映射配置，可以在这里添加 visualMap 配置
    };

    // 应用配置项，切换到条形图
    chart.setOption(barOption, true);
}

// 转换散点图为饼图
// 转换散点图为饼图
function switchToPieChart(chart) {
    // 定义区间、名称和颜色
    let intervals = [0, 45, 70, 90];
    let names = ['0-45', '46-70', '71-90'];
    let colors = ['#67e0e3', '#37a2da', '#fd666d']; // 对应每个区间的颜色
    let counts = [0, 0, 0]; // 存储每个区间的点数

    // 获取当前图表的散点数据
    let scatterData = chart.getOption().series[0].data;

    // 计算每个区间的点数
    scatterData.forEach(function (point) {
        for (let i = 0; i < intervals.length - 1; i++) {
            if (point[1] > intervals[i] && point[1] <= intervals[i + 1]) {
                counts[i]++;
                break;
            }
        }
    });

    // 构建饼图的数据，同时设置每个数据项的颜色
    let pieData = counts.map(function (count, index) {
        return {
            value: count,
            name: names[index],
            itemStyle: {
                color: colors[index]
            }
        };
    });

    // 构建饼图的配置项
    let pieOption = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Angle Distribution',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '60%'],
                data: pieData
            }
        ]
    };

    // 应用配置项，切换到饼图
    chart.setOption(pieOption, true);
}
