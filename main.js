function render() {
    var arraySize = document.getElementById('arraySize').value;
    document.getElementById('btnrender').disabled = true;

    if (isNaN(arraySize) || arraySize <= 0) {
        alert("Please enter a valid array size.");
        return;
    }

    var array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 650));
    }

    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    var barWidth = (canvas.width / arraySize);

    drawBars(array, ctx, canvas, barWidth);

    var sortAlgorithm = document.getElementById('sortingAlgorithms').value;
    setTimeout(() => {
        switch(sortAlgorithm) {
            case 'bubbleSort':
                bubbleSort(array, ctx, canvas, barWidth);
                break;
            case 'quickSort':
                quickSort(array, 0, array.length - 1, ctx, canvas, barWidth);
                break;
            case 'insertionSort':
                insertionSort(array, ctx, canvas, barWidth);
                break;
            case 'bogoSort':
                bogoSort(array, ctx, canvas, barWidth);
                break;
        }
    }, 2000);
}

function drawBars(array, ctx, canvas, barWidth, swappedIndices = []) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < array.length; i++) {
        var barHeight = array[i];
        var posX = i * barWidth;
        var posY = canvas.height - barHeight;

        ctx.fillStyle = swappedIndices.includes(i) ? '#FF0000' : '#000000';
        ctx.fillRect(posX, posY, barWidth, barHeight);
    }
}

async function bubbleSort(arr, ctx, canvas, barWidth) {
    let len = arr.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < len - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                let tmp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = tmp;
                swapped = true;
                await sleep(0);
                drawBars(arr, ctx, canvas, barWidth, [i, i + 1]);
            }
        }
    } while (swapped);

    document.getElementById('btnrender').disabled = false;
    drawBars(arr, ctx, canvas, barWidth);
}

// Sleep function to delay execution
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function quickSort(arr, start, end, ctx, canvas, barWidth) {
    if (start >= end) {
        drawBars(arr, ctx, canvas, barWidth);
        document.getElementById('btnrender').disabled = false;
        return;
    }

    let index = await partition(arr, start, end, ctx, canvas, barWidth);
    await quickSort(arr, start, index - 1, ctx, canvas, barWidth);
    await quickSort(arr, index + 1, end, ctx, canvas, barWidth);
}

async function partition(arr, start, end, ctx, canvas, barWidth) {
    let pivotIndex = start;
    let pivotValue = arr[end];
    for (let i = start; i < end; i++) {
        if (arr[i] < pivotValue) {
            [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
            await sleep(0);
            drawBars(arr, ctx, canvas, barWidth, [i, pivotIndex]);
            pivotIndex++;
        }
    }
    [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
    await sleep(0);
    drawBars(arr, ctx, canvas, barWidth, [pivotIndex, end]);
    return pivotIndex;
}

async function insertionSort(arr, ctx, canvas, barWidth) {
    let length = arr.length;
    for (let i = 1; i < length; i++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
            await sleep(0);
            drawBars(arr, ctx, canvas, barWidth, [j + 1, j]);
        }
        arr[j + 1] = key;
    }

    drawBars(arr, ctx, canvas, barWidth);
    document.getElementById('btnrender').disabled = false;

}

async function bogoSort(arr, ctx, canvas, barWidth) {
    while (!isSorted(arr)) {
        arr = shuffle(arr);
        await sleep(0);
        drawBars(arr, ctx, canvas, barWidth);
    }
    document.getElementById('btnrender').disabled = false;

}

function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i - 1] > arr[i]) {
            return false;
        }
    }
    return true;
}

function shuffle(arr) {
    let count = arr.length, temp, index;
    while (count > 0) {
        index = Math.floor(Math.random() * count);
        count--;
        temp = arr[count];
        arr[count] = arr[index];
        arr[index] = temp;
    }
    return arr;
}