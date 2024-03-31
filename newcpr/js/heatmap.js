let containerChart11 = document.getElementById('containerChart11');

let hotData = [];

function updateHeatmap(){
    containerChart11.style.height = '200px';
    containerChart11.style.width = containerChart11.offsetWidth+'px';

    // 初始化一个空数组来存放转换后的数据
    let transformedData = [];

    // 遍历 hotData 数组
    hotData.forEach((columnData, columnIndex) => {
        // 遍历列中的每个值
        columnData.forEach((value, rowIndex) => {
            // 将每个值转换为热力图期望的格式 [rowIndex, columnIndex, value]
            transformedData.push([rowIndex, columnIndex,  +value.toFixed(1)]);
        });
    });

    const data = transformedData.map(function (item) {
        return [item[1], item[0], item[2] || '-'];
    });

    const option = {
        tooltip: {
            position: 'top'
        },
        grid: {
            height: '50%',
            top: '10%',
            left: '10%',
            right: '3%',
            bottom: '5%'
        },
        xAxis: {
            type: 'category',
            splitArea: {
                show: true
            }
        },
        yAxis: {
            type: 'category',
            data: ['angle1DiffRatio', 'angle2DiffRatio', 'angle3DiffRatio', 'frequencyDiffRatio'],
            splitArea: {
                show: true
            }
        },
        visualMap: {
            min: -2,
            max: 2,
            calculable: true,
            inRange:{
              color:[
                  '#313695',
                  '#4575b4',
                  '#74add1',
                  '#abd9e9',
                  '#e0f3f8',
                  '#ffffbf',
                  '#fee090',
                  '#fdae61',
                  '#f46d43',
                  '#d73027',
                  '#a50026'
              ]
            },
            orient: 'horizontal',
            right: '5%',
            bottom: '0%'
        },
        series: [{
            name: 'Punch Card',
            type: 'heatmap',
            data: data,
            label: {
                show: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }],
        graphic: [
            {
                type: 'text',
                left: '2%', // 可以是百分比或像素值
                bottom: '4%', // 可以是百分比或像素值
                style: {
                    text: ShowFinalAdvice(),
                    textAlign: 'center',
                    fill: '#000', // 文本颜色
                    fontSize: 16
                }
            }
        ],
    };

    // 初始化图表
    var myChart = echarts.init(containerChart11);
    myChart.setOption(option);
}

function ShowFinalAdvice(){
    // 初始化累加器数组，长度与子数组相同，初始值为0
    let sums = new Array(hotData[0].length).fill(0);

    // 遍历hotData数组，累加每个元素中的对应位置的绝对值
    hotData.forEach(item => {
        item.forEach((value, index) => {
            sums[index] += Math.abs(value);
        });
    });

    let itemCount = hotData.length; // 根据之前数组的长度来计算均值
    let text = []; // 初始化一个空数组来存储文本
    // 遍历 sums 数组，计算均值，如果均值超过 1，则按索引顺序输出对应的文本
    sums.forEach((sum, index) => {
        let average = sum / itemCount; // 计算均值
        if (average > 0.8) {
            switch (index) {
                case 0:
                    text.push("Lean forward");
                    break;
                case 1:
                    text.push("Straighten your arms");
                    break;
                case 2:
                    //text.push("Angle3-身体与大腿的夹角偏差较大");
                    break;
                case 3:
                    text.push("Adjust frequency");
                    break;
            }
        }
    });
    // 输出结果
    console.log(text);

    if(text.length > 3)
        return '全部指标均偏差较大，请注意调整！';
    else
        return text.join(',');
}
