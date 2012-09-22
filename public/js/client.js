jQuery(function() {
    var socket = io.connect();

    // mouseを押しているどうかの判定
    var isDrawing = false;

    var oldX = 0;
    var oldY = 0;
    var $color = $('#color'),
        $size  = $('#size');

    //描画目的取得
    var $canvas = $('#canvas');

    //mouseが動いたときの処理
    $canvas.on('mousemove', function(evt) {
      if (!isDrawing) {
        return;
      }

      var paint = {
        oldX: oldX,
        oldY: oldY,
        x: evt.clientX,
        y: evt.clientY,
        color: $color.val(),
        size: $size.val()
      };
      draw(paint);
      sendToServer(paint);
    });

    //mouseが押されたときの処理
    $canvas.on('mousedown', function(evt) {
        isDrawing = true;
        oldX = evt.clientX;
        oldY = evt.clientY;
    });

    //離れたときの処理
    $canvas.on('mouseup', function(evt) {
        isDrawing = false;
    });

    // 描画処理
    function draw(paint) {
        var context = $canvas[0].getContext("2d");
        context.strokeStyle = paint.color;
        context.lineWidth = paint.size;

        context.beginPath();
        context.moveTo(paint.oldX, paint.oldY);
        context.lineTo(paint.x, paint.y);
        context.stroke();
        context.closePath();

        oldX = paint.x;
        oldY = paint.y;
    }

    // サーバーへ送信
    function sendToServer(paint) {
      socket.emit('draw', paint);
    }

    socket.on('draw', function (paint) {
      draw(paint);
    });

});

