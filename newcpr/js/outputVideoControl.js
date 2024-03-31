const playPauseBtn = document.getElementById('playPauseBtn');
const progressContainer = document.querySelector('.progress');

playPauseBtn.addEventListener('click', function() {
    if (inputVideo.paused || inputVideo.ended) {
        inputVideo.play();
    } else {
        inputVideo.pause();
    }
});

inputVideo.addEventListener('play', function() {
    playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
});

inputVideo.addEventListener('pause', function() {
    playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
});

// progressContainer.addEventListener('click', function(e) {
//     const clickPosition = (e.offsetX / this.offsetWidth) * inputVideo.duration;
//     inputVideo.currentTime = clickPosition;
// });


// 定义一个临时数组来累积分数
let tempScores = [];

// 另一个数组，用于记录每段的平均分
let segmentAverages = [];

// 每隔多少帧计算一次平均分
const framesPerSegment =10; // 示例中每20帧为一个段落

let tempCurrentTime = '00:00';  // 初始时间

// 接收当前帧的分数，并在达到指定帧数时计算平均分，然后清空累积
function recordFrameScore(score) {
    // 将当前帧的分数添加到临时数组中
    tempScores.push(score);

    // 当累积的帧数达到framesPerSegment时，计算平均分
    if (tempScores.length === framesPerSegment) {
        // 计算这批帧的平均分数
        const averageScore = tempScores.reduce((acc, val) => acc + val, 0) / framesPerSegment;
        const color = scoreToColor(averageScore);
        //console.log(averageScore,color)
        // 检查最后一个评分段是否存在且颜色相同
        if (segmentAverages.length > 0 && segmentAverages[segmentAverages.length - 1].color === color) {
            // 相同颜色的情况下直接增加frames
            segmentAverages[segmentAverages.length - 1].frames += framesPerSegment;
        } else {
            // 颜色不同或不存在最后一个评分段时，创建新的评分段
            segmentAverages.push({
                color: color,
                frames: framesPerSegment // 这里我们知道累积了framesPerSegment帧
            });
        }

        // 计算完平均分后清空临时数组，准备下一批帧的累积
        tempScores = [];

        // 更新一次进度条
        updateProgressSegments();

        // 更新一次文字提示内容
        const time = getVideoCurrentTime();
        updateAlert(tempCurrentTime, time, averageScore);
        tempCurrentTime = time;

        return time;
    }
    else {
        return "none";
    }
}


function getVideoCurrentTime(){
    const currentTimeInSeconds = inputVideo.currentTime; // 获取当前时间（秒）
    const minutes = Math.floor((currentTimeInSeconds % 3600) / 60); // 计算分钟数
    const seconds = Math.floor(currentTimeInSeconds % 60); // 计算秒数

    // 将分钟、秒转换为两位数格式
    const formattedTime = [
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
    ].join(':');

    return formattedTime;
}


// 定义分数到颜色的映射逻辑
function scoreToColor(score) {
    if (score < 50) return colorHigh; // 低分
    if (score >= 50 && score < 60) return colorLow; // 中等
    if (score >= 60 && score < 70) return colorMid; // 中等
    return colorNo; // 高分
}

function updateProgressSegments() {
    const currentTime = inputVideo.currentTime;
    const totalDuration = inputVideo.duration;
    const currentProgressPercentage = (currentTime / totalDuration) * 100; // 当前视频播放进度的百分比

    // 清空现有进度条分段
    progressContainer.innerHTML = '';

    // 计算所有分段frames的总和
    const totalFrames = segmentAverages.reduce((sum, segment) => sum + segment.frames, 0);

    segmentAverages.forEach(segment => {
        // 计算当前分段的frames占总frames的百分比
        const segmentPercentageOfTotal = (segment.frames / totalFrames);
        // 计算当前分段应占进度条的实际宽度百分比，基于当前播放进度
        const segmentWidthPercentage = segmentPercentageOfTotal * currentProgressPercentage;

        appendSegment(segment.color, segmentWidthPercentage);
    });

    // 动态创建并添加进度条分段
    function appendSegment(color, widthPercentage) {
        const segmentDiv = document.createElement('div');
        segmentDiv.className = 'progress-bar';
        segmentDiv.style.width = `${widthPercentage}%`;
        segmentDiv.style.backgroundColor = color;
        progressContainer.appendChild(segmentDiv);
    }
}


function handleVideoEnd() {
    // 检查是否有未处理的帧
    if (tempScores.length > 0) {
        // 计算剩余帧的平均分数
        const averageScore = tempScores.reduce((acc, val) => acc + val, 0) / tempScores.length;
        const color = scoreToColor(averageScore);

        // 将最后一个评分段添加到segmentAverages中
        segmentAverages.push({
            color: color,
            frames: tempScores.length // 使用剩余帧的实际数量
        });

        // 清空tempScores数组，以防万一
        tempScores = [];

        // 更新进度条以反映最后一个评分段
        updateProgressSegments();
    }
}

// 监听视频播放结束事件
inputVideo.addEventListener('ended', handleVideoEnd);