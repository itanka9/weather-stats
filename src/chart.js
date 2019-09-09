export function createChart (height, width) {
    var chartEl = document.createElement('canvas');
    chartEl.setAttribute('width', width);
    chartEl.setAttribute('height', height);
    document.body.appendChild(chartEl);
    return chartEl;
}

export function drawData (data, el) {
    var len = data.length;
    var width = parseInt(el.getAttribute('width'), 10);
    var height = parseInt(el.getAttribute('height'), 10);
    var gap = width / (len - 1);
    var ctx = el.getContext('2d');

    var startPoint = null;

    var points = getPoints(data);
    var endPoint;
    var point;

    for(var i = 0; i < len; i++) {
        point = points[i];
        if (point) {
            if (!startPoint) {
                startPoint = point;
            }
            endPoint = point;
        }
    }

    if (!endPoint) {
        return;
    }

    ctx.save();
    ctx.fillStyle = '#f2f2f2';
    ctx.lineWidth = '3';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();


    ctx.beginPath();
    for(var i = 1; i < len; i++) {
        ctx.moveTo(i * gap, 0);
        ctx.lineTo(i * gap, height);
    }
    ctx.save();
    ctx.strokeStyle = '#DDD';
    ctx.stroke();
    ctx.restore();

    ctx.beginPath(  );
    ctx.moveTo(startPoint.index * gap, height);
    

    for(var i = 0; i < len; i++) {
        point = points[i];
        if (point) {
            ctx.lineTo(point.index * gap,  - point.val * height * 0.8 / 2 + height/2);
        }
    }

    ctx.lineTo(endPoint.index * gap, height);
    ctx.save();
    ctx.fillStyle = 'rgba(8,106,253,.4)';
    ctx.strokeStyle = '#086afc';
    ctx.lineWidth = '2';
    ctx.stroke();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = '3';
    ctx.strokeRect(0, 0, width, height);
    ctx.restore();
};
    

function getPoints(data) {
    var points = [];
    var len = data.length;
    var sum = 0;
    var count_valid = 0;
    var max;
    var min;
    var d;
    for(var i = 0; i< len; i++) {
        d = data[i];
        if (typeof d === 'number') {
            if (typeof max !== 'number') {
                max = d;
                min = d;
            }
            max = d > max ? d : max;
            min = d < max ? d : min;

            count_valid += 1;

            sum += data[i];
        }
    }
    var average = sum / count_valid;
    var middle = (max - min)/2;

    var range = max - min;

    for(var i = 0; i< len; i++) {
        d = data[i];
        if (typeof d === 'number') {
            points.push({
                val: 2 * ((d - min) / range - 0.5),
                data: d,
                index: i
            });
        } else {
            points.push(null);
        }
    }
    return points;
};

/*
  <canvas width="100" height="30" id="weekline"> </canvas>

    <br>

    <canvas width="100" height="30" id="weekline2"> </canvas>
    <script>
        draw([null,3,4,2,6,3,7,1], "#weekline");
        draw([700,300,109,null, 435, 88, 234, null,123,645,723,112], "#weekline2");
    </script>
*/