const minRange = document.getElementById('minRange');
const maxRange = document.getElementById('maxRange');
const minValueDisplay = document.getElementById('minValue');
const maxValueDisplay = document.getElementById('maxValue');

const angleNameDisplay = document.getElementById('angleName');
const angle1 = document.getElementById('angle1');
const angle2 = document.getElementById('angle2');
const angle3 = document.getElementById('angle3');

// 为每个单选按钮添加事件监听器
angle1.addEventListener('change', function() {
    if(this.checked) {
        // 更新显示的角度范围值
        angleNameDisplay.textContent = 'Angle1';

        minRange.min = `30`;
        minRange.max = `50`;
        minRange.value = `${minAngleRange1}`;

        maxRange.min = `60`;
        maxRange.max = `80`;
        maxRange.value = `${maxAngleRange1}`;

        // 调用 updateValues 函数来更新滑块和图表
        updateValues('angle1');
    }
});
angle2.addEventListener('change', function() {
    if(this.checked) {
        angleNameDisplay.textContent = 'Angle2';

        minRange.min = `130`;
        minRange.max = `150`;
        minRange.value = `${minAngleRange2}`;

        maxRange.min = `160`;
        maxRange.max = `180`;
        maxRange.value = `${maxAngleRange2}`;

        updateValues('angle2');
    }
});
angle3.addEventListener('change', function() {
    if(this.checked) {
        angleNameDisplay.textContent = 'Angle3';

        minRange.min = `70`;
        minRange.max = `90`;
        minRange.value = `${minAngleRange3}`;

        maxRange.min = `120`;
        maxRange.max = `140`;
        maxRange.value = `${maxAngleRange3}`;

        updateValues('angle3');
    }
});


// 更新显示的值
function updateValues(angle = 'angle1') {
    minValueDisplay.textContent = minRange.value;
    maxValueDisplay.textContent = maxRange.value;

    const min = Number(minRange.value);
    const max = Number(maxRange.value);

    switch (angle) {
        case 'angle1':
        case "Angle1":{
            gauge1.setOption({
                series: [{
                    axisLine: {
                        lineStyle: {
                            color: [
                                [min/180, colorLow], // 0%到30%是#67e0e3颜色
                                [max/180, colorMid], // 30%到70%是#37a2da颜色
                                [1, colorHigh] // 70%到100%是#fd666d颜色
                            ]
                        }
                    }
                }]
            });

            myChart7.setOption({
                // 配置视觉映射组件，根据数据值映射颜色
                visualMap: {
                    pieces: [
                        {gt: 0, lte: min, color: colorLow},
                        {gt: min, lte: max, color: colorMid},
                        {gt: max, color: colorHigh},
                    ],
                    outOfRange: {
                        color: '#999'
                    }
                },
                series: [{
                    yAxis: {
                        min: min-20,
                        max: max+20,
                    },

                    markLine: {
                        data: [
                            {yAxis: min, label: {show: false}},
                            {yAxis: max, label: {show: false}},
                        ]
                    }
                }]
            });

            myChart8.setOption({
                parallelAxis: [
                    {
                        min: min-25, // 设置最小值
                        max: max+25, // 设置最大值
                    },
                ],
            });

            minAngleRange1=min;
            maxAngleRange1=max;

            break;
        }
        case 'angle2':
        case "Angle2":{
            gauge2.setOption({
                series: [{
                    axisLine: {
                        lineStyle: {
                            color: [
                                [min/180, colorLow], // 0%到30%是#67e0e3颜色
                                [max/180, colorMid], // 30%到70%是#37a2da颜色
                                [1, colorHigh] // 70%到100%是#fd666d颜色
                            ]
                        }
                    }
                }]
            });

            myChart9.setOption({
                // 配置视觉映射组件，根据数据值映射颜色
                visualMap: {
                    pieces: [
                        {gt: 0, lte: min, color: colorLow},
                        {gt: min, lte: max, color: colorMid},
                        {gt: max, color: colorHigh},
                    ],
                    outOfRange: {
                        color: '#999'
                    }
                },
                series: [{
                    yAxis: {
                        min: min-20,
                        max: max+20,
                    },

                    markLine: {
                        data: [
                            {yAxis: min, label: {show: false}},
                            {yAxis: max, label: {show: false}},
                        ]
                    }
                }]
            });

            myChart8.setOption({
                parallelAxis: [
                    {},
                    {
                        min: min-25, // 设置最小值
                        max: max+25, // 设置最大值
                    },
                ],
            });

            minAngleRange2=min;
            maxAngleRange2=max;

            break;
        }
        case 'angle3':
        case "Angle3":{
            gauge3.setOption({
                series: [{
                    axisLine: {
                        lineStyle: {
                            color: [
                                [min/180, colorLow], // 0%到30%是#67e0e3颜色
                                [max/180, colorMid], // 30%到70%是#37a2da颜色
                                [1, colorHigh] // 70%到100%是#fd666d颜色
                            ]
                        }
                    }
                }]
            });

            myChart10.setOption({
                // 配置视觉映射组件，根据数据值映射颜色
                visualMap: {
                    pieces: [
                        {gt: 0, lte: min, color: colorLow},
                        {gt: min, lte: max, color: colorMid},
                        {gt: max, color: colorHigh},
                    ],
                    outOfRange: {
                        color: '#999'
                    }
                },
                series: [{
                    yAxis: {
                        min: min-20,
                        max: max+20,
                    },

                    markLine: {
                        data: [
                            {yAxis: min, label: {show: false}},
                            {yAxis: max, label: {show: false}},
                        ]
                    }
                }]
            });

            myChart8.setOption({
                parallelAxis: [
                    {},{},
                    {
                        min: min-25, // 设置最小值
                        max: max+25, // 设置最大值
                    },
                ],
            });

            minAngleRange3=min;
            maxAngleRange3=max;

            break;
        }
    }
}

// 确保最小滑块不超过最大滑块的值
minRange.addEventListener('input', function() {
    if (parseInt(minRange.value) > parseInt(maxRange.value)) {
        minRange.value = maxRange.value;
    }
    updateValues(angleNameDisplay.textContent);
});
// 确保最大滑块不低于最小滑块的值
maxRange.addEventListener('input', function() {
    if (parseInt(maxRange.value) < parseInt(minRange.value)) {
        maxRange.value = minRange.value;
    }
    updateValues(angleNameDisplay.textContent);
});

// 初始更新显示的值
minRange.min = `${minAngleRange1-10}`;
minRange.max = `${minAngleRange1+10}`;
minRange.value = `${minAngleRange1}`;

maxRange.min = `${maxAngleRange1-10}`;
maxRange.max = `${maxAngleRange1+10}`;
maxRange.value = `${maxAngleRange1}`;

updateValues('angle1');
