/**
 * ПРВ
 */
function f(z) {
    return 1 / (1 + z*z);
}

/**
 * ФРВ
 */
function F(z) {
    return Math.atan(z) + 0.5;
}

/**
 * ФРВ ^ (-1)
 */
function F1(z) {
    return Math.tan(z - 0.5)
}

class StatistItem {
    /**
     * 
     * @param {number[]} range 
     * @param {number} n 
     * @param {number} p 
     */
    constructor(range, n, p) {
        this.range = range;
        this.avg = (range[1] + range[0]) / 2;
        this.n = n;
        this.p = p;
    }
}

function main() {
    const leftBorder = -Math.tan(0.5);
    const rightBorder = Math.tan(0.5);
    const countNums = 1000000;
    const countRange = Math.floor(1 + 3.222 * Math.log10(countNums));
    const step = (rightBorder - leftBorder) / countRange;

    console.log(`объем выборки: ${countNums}`);
    console.log(`кол-во интервалов: ${countRange}`);

    const ranges = []
    let left = leftBorder;
    let right = leftBorder + step;
    for (let i = 0; i < countRange; i++) {
        ranges.push([left, right]);
        left = right;
        right += step;
    }

    const numbers = [];
    for (let i = 0; i < countNums; i++) {
        const base = Math.random();
        const x = F1(base);
        numbers.push(x);
    }

    const data = [];
    for (let i = 0; i < countRange; i++) {
        let range = ranges[i];
        let n = 0;
        for (let j = 0; j < numbers.length; j++) {
            let num = numbers[j];
            if (range[0] <= num && num < range[1]) {
                n++;
            }
        }
        data.push(new StatistItem(range, n, n / countNums));
    }

    // Pearson
    let P = [];
    for (let i = 0; i < countRange; i++) {
        let range = ranges[i];
        let p = F(range[1]) - F(range[0]);
        P.push(p);
    }

    let hiq = 0.0;
    for (let i = 0; i < countRange; i++) {
        let statistic = data[i];
        hiq += Math.pow(statistic.n - countNums * P[i], 2) / (countNums * P[i]);
    }
    console.log(`Хи квадрат = ${hiq}`);

    // show teority
    // showBarChart(
    //     document.getElementById('canvas'), 
    //     P, 
    //     data.map(x => `[${x.range[0].toFixed(3)}; ${x.range[1].toFixed(3)})`), 
    //     'Теоритическое распределение');

    // show chart and print values
    density(data, countRange);

    drawFunc(document.getElementById('canvas_f'), leftBorder, rightBorder);
}

main();

/**
 * График функции
 */
function drawFunc(canvas, leftBorder, rightBorder) {
    let x = [];
    let f1 = [];
    for (let i = leftBorder; i < rightBorder; i += 0.005) {
        x.push(`${i}`);
        f1.push(f(i));
    }
    
    new Chart(canvas, {
        type: "line",
        data: {
            labels: x,
            datasets: [
                {
                    label: 'f = 1 / (1 + z*z)',
                    data: f1,
                    borderColor: "blue",
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        display: false //this will remove only the label
                    }
                }]
            }
        }
    })
}

/**
 * Гистограмма для выборочного распределения
 * @param {StatistItem[]} data 
 * @param {number} countRange
 */
function density(data, countRange) {
    let expectedValue = 0.0;
    for (let i = 0; i < countRange; i++) {
        expectedValue += data[i].p * data[i].avg;
    }

    let dispersion = 0.0;
    for (let i = 0; i < countRange; i++) {
        dispersion += data[i].p * (data[i].avg - expectedValue) * (data[i].avg - expectedValue);
    }
    
    showBarChart(
        document.getElementById('canvas1'),
        data.map(x => x.p),
        data.map(x => `[${x.range[0].toFixed(3)}; ${x.range[1].toFixed(3)})`),
        // 'Интерпретация статистического ряда (ВЫБОРКА)'
        'Выборочное распределение'
    );

    console.log(`мат. ожидание: ${expectedValue}`);
    console.log(`дисперсия: ${dispersion}`);
}

/**
 * Гистограмма
 */
function showBarChart(canvas, data, labels, title) {
    let densityData = {
        label: title,
        data: data
    };

    let barChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [densityData]
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        display: false //this will remove only the label
                    }
                }]
            }
        }
    });
}