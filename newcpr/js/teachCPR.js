// 定义一个函数来更新 teachText 元素的内容
function updateTeachText(newText) {
    const teachTextElement = document.getElementById('teachText');
    if (teachTextElement) {
        teachTextElement.textContent = newText; // 或者使用 .innerHTML，如果需要设置的内容包含HTML标签
    }
}

// 调用这个函数来更新内容
//updateTeachText('您的 CPR 技能已经大大改善！');

function updateTeach(){
    // 初始化一个数组来存储总分
    let totalScores = [0, 0, 0, 0];

    // 遍历 newData 来累加每一类的分数
    newData.forEach(scores => {
        scores.forEach((score, index) => {
            totalScores[index] += Number(score);
        });
    });

    // 计算每一类的平均分并打印结果
    let averageScores = totalScores.map(total => total / newData.length);
    console.log("每一类的平均分是：", averageScores);

    let minScore = Math.min(...averageScores);
    averageScores.forEach((score, index) =>{
        if(score === minScore){
            switch (index) {
                case 0:updateTeachText('请适当调整身体与双臂的夹角！');break;
                case 1:updateTeachText('请在操作过程中将双臂伸直！');break;
                case 2:updateTeachText('请适当调整身体与大腿的夹角！');break;
                case 3:updateTeachText('请适当调整操作过程中的频率！');break;
            }
        }
    })
}
