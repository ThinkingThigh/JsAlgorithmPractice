function resize(resizeConfig) {
    var oBox = document.getElementById(resizeConfig.containerID), oLeft = document.getElementById(resizeConfig.leftID), oRight = document.getElementById(resizeConfig.rightID), oLine = document.getElementById(resizeConfig.lineID);
    oLine.onmousedown = function (e) {
        var disX = (e || event).clientX;
        oLine.left = oLine.offsetLeft;
        document.onmousemove = function (e) {
            var iT = oLine.left + ((e || event).clientX - disX);
            var e = e || window.event, tarnameb = e.target || e.srcElement;
            var maxT = oBox.clientWidth-resizeConfig.rightMinWidth;
            oLine.style.margin = 0;
            iT < resizeConfig.leftMinWidth && (iT = resizeConfig.leftMinWidth);
            iT > maxT && (iT = maxT);
            oLine.style.left = oLeft.style.width = iT + "px";
            oRight.style.width = oBox.clientWidth - iT + "px";
            return false
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            oLine.releaseCapture && oLine.releaseCapture()
        };
        oLine.setCapture && oLine.setCapture();
        return false
    };
}