//高斯平滑
function gaussianSmooth(dataY, sigma = 2) {
    // 此处假设dataY是包含y值的数组
    const gaussKernel = [];
    let kernelSize = Math.ceil(sigma * 3) * 2 + 1;
    let kernelHalf = Math.floor(kernelSize / 2);
    let sum = 0;

    for (let i = -kernelHalf; i <= kernelHalf; i++) {
        let value = Math.exp(-(i * i) / (2 * sigma * sigma));
        gaussKernel.push(value);
        sum += value;
    }

    // 归一化高斯核
    const normalizedKernel = gaussKernel.map(val => val / sum);

    return dataY.map((_, idx) => {
        let weightedSum = 0;
        let weightSum = 0;
        for (let i = -kernelHalf; i <= kernelHalf; i++) {
            let dataIndex = idx + i;
            if (dataIndex >= 0 && dataIndex < dataY.length) {
                weightedSum += dataY[dataIndex] * normalizedKernel[i + kernelHalf];
                weightSum += normalizedKernel[i + kernelHalf];
            }
        }
        return weightedSum / weightSum;
    });
}

function initLandmarkTrackChart(chart) {
    var myChart = echarts.init(chart);
    // 配置项和数据
    var option = {
        // 提示框组件，展示数据等信息
        tooltip: {
            trigger: 'axis' // 触发类型：轴触发
        },
        // 直角坐标系内绘图网格
        grid: {
            left: '9%', // 网格左侧的距离
            right: '3%', // 网格右侧的距离
            bottom: '25%', // 网格底部的距离
            top:'10%',
        },
        // x轴配置
        xAxis: {
            type: 'category', // 类目轴，适用于离散的类目数据
            //name: 'Index', // x轴名称
            animation: false, // 取消指针动画
        },
        // y轴配置
        yAxis: {
            type: 'value', // 数值轴，适用于连续数据
            //name: 'Position', // y轴名称
            min: 0.65, // y轴最小值
            max: 0.85, // y轴最大值
            splitLine: {
                show: false
            }
        },
        // 工具栏
        /*
        toolbox: {
            right: 10, // 工具栏位置
            feature: { // 工具栏各工具配置
                dataZoom: { // 数据区域缩放
                    yAxisIndex: 'none' // 不在y轴上使用缩放
                },
                restore: {}, // 配置项还原
                saveAsImage: {} // 保存为图片
            }
        },*/
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
        // 配置视觉映射组件，根据数据值映射颜色
        visualMap: {
            orient: 'horizontal', // 设置水平排布
            top: 0,
            left: 'center',
            right:'auto',
            precision: 1, // 设置精度为2，即小数点后两位
            pieces: [ // 定义不同数据范围的颜色
                {gt: 0.6, lte: 0.7, color: colorLow},
                {gt: 0.7, lte: 0.8, color: colorMid},
                {gt: 0.8, color: colorHigh},
            ],
            outOfRange: { // 数据值超出范围时的颜色
                color: '#999'
            }
        },
        // 系列列表。每个系列通过type决定自己的图表类型
        series: [{
            name: 'Position', // 系列名称
            type: 'line', // 图表类型为折线图
            data: [], // 初始数据为空，稍后动态更新
            animation: false, // 禁用动画效果
            showSymbol: false,  //不显示点
            markLine: {
                silent: true, // 禁用鼠标交互事件
                symbol: 'none', // 不显示标记（箭头）
                lineStyle: {
                    color: '#333', // 可调整为所需的颜色
                    type: 'dashed' // 设置为虚线，可选值为 'dashed' 或 'dotted'
                },
                data: [
                    {
                        yAxis: 0.7,
                        label:{show:false}
                    },
                    {
                        yAxis: 0.8,
                        label:{show:false}
                    },
                ]
            }
        }]
    };

    myChart.setOption(option);
    return myChart; // 返回图表实例以便后续更新数据
}

//更新图表
function updateLandmarkTrackChartData(myChart, targetIndex) {
    const filteredPositions = keypointPositions
        .filter(pos => pos.index === targetIndex)
        // .slice(-50); // 保留最后50个元素

    const yValues = filteredPositions.map(pos => pos.y);
    //const smoothedYValues = yValues;
    const smoothedYValues = gaussianSmooth(yValues);
    const dataSeries = smoothedYValues.map((y, i) => [i, y]);

    // 计算开始和结束值，以便数据区域缩放组件只显示最新的50个点
    let startValue, endValue;
    const dataLength = dataSeries.length;
    if (dataLength > 50) {
        startValue = ((dataLength - 50) / dataLength) * 100;
        endValue = 100;
    } else {
        startValue = 0;
        endValue = 100;
    }

    // 更新图表数据
    myChart.setOption({
        xAxis: {
            data: dataSeries.map(item => item[0]) // 更新X轴数据
        },
        series: [{
            data: dataSeries // 更新系列数据
        }],
        // 动态设置数据区域缩放组件的起始和结束百分比，只显示最新的50个数据点
        dataZoom: [{
            start: startValue, // 根据数据点的数量动态计算
            end: endValue,
        }, {
            start: startValue,
            end: endValue,
        }]
    });
}


// 平滑、寻找极大值和计算频率
function calculateFrequency(index,maxPeaksToConsider = 5) {
    // 从keypointPositions中筛选指定关键点的数据
    const filteredPositions = keypointPositions.filter(pos => pos.index === index);
    // 提取y值和时间戳
    const yValues = filteredPositions.map(pos => pos.y);
    const timestamps = filteredPositions.map(pos => pos.time);

    // 应用高斯平滑
    const smoothedYValues = gaussianSmooth(yValues);

    // 寻找极大值
    let peaks = [];
    for (let i = 1; i < smoothedYValues.length - 1; i++) {
        if (smoothedYValues[i] > smoothedYValues[i - 1] && smoothedYValues[i] > smoothedYValues[i + 1]) {
            peaks.push({ time: timestamps[i], value: smoothedYValues[i] });
        }
    }

    // 仅考虑最新的若干个极大值
    const recentPeaks = peaks.slice(-maxPeaksToConsider);

    // 计算震动频率
    if (recentPeaks.length > 1) {
        const duration = (recentPeaks[recentPeaks.length - 1].time - recentPeaks[0].time) / 1000; // 秒
        const frequency = (recentPeaks.length - 1) / duration; // 频率（Hz）

        // 保留两位小数并转换为数字类型
        return Number(frequency.toFixed(2));
    }

    return 0; // 如果没有足够的极大值来计算频率，返回0
}
