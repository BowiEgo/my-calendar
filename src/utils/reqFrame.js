let _reqFrame, _cancelFrame, _frameTimeout;
if (typeof window !== 'undefined') {
  _reqFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) {
      var self = this,
        start,
        finish;

      _frameTimeout = window.setTimeout(function () {
        start = +new Date();
        callback(start);
        finish = +new Date();
        self.timeout = 1000 / 60 - (finish - start);
      }, self.timeout);
    };

  _cancelFrame =
    window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    function () {
      window.clearTimeout(_frameTimeout);
    };
}

export { _reqFrame, _cancelFrame, _frameTimeout };
