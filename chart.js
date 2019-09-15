var Chart = function (width, height, el) {

    var X_TICKS_COUNT = 10,
        Y_TICKS_COUNT = 5,
        X_PADDING  = 15,
        Y_PADDING  = 50,
        PADDING    = 5;

    var canvas = document.createElement('canvas');

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    el.appendChild(canvas);

    var ctx = canvas.getContext('2d');

    this.next = rawData => {
        const len = Math.min(width, rawData.length) / 2,
              gap = width / (len - 1),
              data = reSample(rawData, len);

        var yMinMax = minMax(data),
            xAxisScale = createScale({ min: 0, max: X_TICKS_COUNT }, { min: Y_PADDING, max: width - PADDING - Y_PADDING }),
            xScale = createScale({ min: 0, max: data.length }, { min: Y_PADDING, max: width - PADDING - Y_PADDING }),
            yScale = createScale(yMinMax, { min: X_PADDING, max: height - PADDING - X_PADDING }, true);
    
        clear();
        // drawXAxis(0, 10, xAxisScale);
        drawYAxis(yMinMax.min, yMinMax.max, yScale);
        drawDataLine(data, yScale, xScale);
    };

    this.drawLoading = () => {
        clear();
        drawMessage('loading...')
    }

    this.error = () => {
        clear();
        drawMessage('That was an error, my friend :(')
    }

    function createScale(from, to, invert) {
        var fromPad = from.min,
            toPad = to.min,
            fromRange = from.max - from.min,
            toRange = to.max - to.min;

        if (invert) {
            return x => ((fromRange - (x - fromPad)) / fromRange) * toRange + toPad;
        } else {
            return x => ((x - fromPad) / fromRange) * toRange + toPad;
        }
    }
    
    function reSample(data, size) {
        const chunkSize = data.length / size;
        return data.reduce(function({ result, chunk }, v) {
            if (chunk.length >= chunkSize) {
                result.push(avg(chunk));
                return {
                    result, chunk: [v]
                }
            } 
            chunk.push(v)
            return { result, chunk }
        }, { result: [], chunk: []}).result
    }
    
    function clear () {
        canvas.width = canvas.width;
        ctx.clearRect(0, 0, width, height);
    }
    
    function drawDataLine (data, yScale, xScale) {
        ctx.beginPath();
        ctx.moveTo(xScale(0), yScale(data[0]));
    
        for(let i = 0; i < data.length; i++) {
            ctx.lineTo(xScale(i), yScale(data[i]));
        }

        strokeWithLineStyle();
    }

    function drawXAxis (start, end, scale) {
        var gap = (end - start) / X_TICKS_COUNT,
            yStart = height - X_PADDING,
            yEnd = yStart + 5;

        let x;
        
        for(let i = 0; i <= X_TICKS_COUNT; i++) {
            x = Math.round(scale(start + gap * i));
            ctx.moveTo(x, yStart);
            ctx.lineTo(x, yEnd);
        }
        strokeWithTickStyle();
    }
    
    function drawYAxis (start, end, scale) {
        var gap = (end - start) / Y_TICKS_COUNT,
            xStart = Y_PADDING,
            xEnd = xStart - 5;

        let y, yRaw;
        
        ctx.save();
        ctx.textAlign = 'end';
        for(let i = 0; i <= Y_TICKS_COUNT; i++) {
            yRaw = start + gap * i
            y = Math.round(scale(yRaw));
            ctx.moveTo(xStart, y);
            ctx.lineTo(xEnd, y);
            ctx.fillText(Number(yRaw).toPrecision(2), xEnd - 2, y)
        }
        strokeWithTickStyle();
    }

    function drawMessage (msg) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(msg, Math.round(width / 2), Math.round(height / 2));
        ctx.restore();
    }

    function strokeWithLineStyle () {
        ctx.save();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = '1';
        ctx.stroke();
        ctx.restore();
    }

    function strokeWithTickStyle () {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = '1';
        ctx.stroke();
        ctx.restore();
    }
}
