// jsColorScale - a Javascript library for making and using color scales.

function ColorScale(scaleArray) {

	this.scaleArray = scaleArray;
	this.scaleMinIndex = scaleArray[0][0];
	this.scaleMaxIndex = scaleArray[scaleArray.length - 1][0];
	this.minValue = this.scaleMinIndex;
	this.maxValue = this.scaleMaxIndex;

	this.setValueRange = function(min, max) {
		this.minValue = min;
		this.maxValue = max;
	}

	this.drawScale = function(scaleContainer, options) {
		
		var container = $(scaleContainer);
		var canvasElement = $('<canvas>', {style: "width: 100%; height: 100%;"});

		var canvas = canvasElement[0];



		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		this.barStart = 0;
		if (options['outliers'] == 'l' || options['outliers'] == 'b') {
			this.barStart = parseInt(options['outlierSize']) + 10;
		}

		this.barEnd = canvas.width;
		if (options['outliers'] == 'r' || options['outliers'] == 'b') {
			this.barEnd = canvas.width - (parseInt(options['outlierSize']) + 10);
		}

		this.barWidth = this.barEnd - this.barStart;

		for (var i = this.barStart; i <= this.barEnd - 1; i++) {
			var point1 = i;
			var point2 = i + 1;

			ctx.fillStyle = this.getColor((point1 - this.barStart) / this.barWidth);
			ctx.fillRect(point1, 0, point2, canvas.height);
		}
		ctx.clearRect(this.barEnd + 1, 0, canvas.width, canvas.height);

		if (options['outliers'] == 'l' || options['outliers'] == 'b') {
			ctx.beginPath();
			ctx.moveTo(0, (canvas.height / 2));
			ctx.lineTo(options['outlierSize'], canvas.height);
			ctx.lineTo(options['outlierSize'], 0);
			ctx.lineTo(0, (canvas.height / 2));
			ctx.fillStyle = scaleArray[0][1];
			ctx.fill();
		}

		if (options['outliers'] == 'r' || options['outliers'] == 'b') {
			ctx.beginPath();
			ctx.moveTo(canvas.width, (canvas.height / 2));
			ctx.lineTo((canvas.width - options['outlierSize']), canvas.height);
			ctx.lineTo((canvas.width - options['outlierSize']), 0);
			ctx.lineTo(canvas.width, (canvas.height / 2));
			ctx.fillStyle = scaleArray[scaleArray.length - 1][1];
			ctx.fill();
		}

		container.append(canvasElement);
  	}

	this.getColor = function(value) {
		
		var result = null;

		if (value < this.minValue) {
			value = this.minValue;
		} else if (value > this.maxValue) {
			value = this.maxValue;
		}

		var valueProportion = (value - this.minValue) / (this.maxValue - this.minValue);
		var scaleValue = this.scaleMinIndex + (this.scaleMaxIndex - this.scaleMinIndex) * valueProportion;

		var preColor = this.getColorBefore(scaleValue);
		var postColor = this.getColorAfter(scaleValue);

		if (preColor[0] == postColor[0]) {
			result = preColor[1];
		} else {
			var colorProportion = (scaleValue - preColor[0]) / (postColor[0] - preColor[0]);
			var redValue = this.interpolateColorComponent(preColor[1].substring(1,3), postColor[1].substring(1,3), colorProportion);
			var greenValue = this.interpolateColorComponent(preColor[1].substring(3,5), postColor[1].substring(3,5), colorProportion);
			var blueValue = this.interpolateColorComponent(preColor[1].substring(5), postColor[1].substring(5), colorProportion);

			result = '#' + redValue + greenValue + blueValue;
		}

		return result;
	}

	this.interpolateColorComponent = function(preValue, postValue, proportion) {
		var preNumber = parseInt(preValue, 16);
		var postNumber = parseInt(postValue, 16);

		var interpNumber = Math.round(preNumber + (postNumber - preNumber) * proportion).toString(16);
		if (interpNumber.length == 1) {
			interpNumber = '0' + interpNumber;
		}

		return interpNumber;
	}

	this.getColorBefore = function(scaleValue) {
		var result = null;
		for (var i = 0; i < this.scaleArray.length; i++) {
			if (this.scaleArray[i][0] <= scaleValue) {
				result = this.scaleArray[i];
			} else {
				break;
			}
		}

		if (result == null) {
			result = this.scaleArray[0];
		}

		return result;
	}

	this.getColorAfter = function(scaleValue) {
		var result = null;
		for (var i = 0; i < this.scaleArray.length; i++) {
			if (this.scaleArray[i][0] > scaleValue) {
				result = this.scaleArray[i];
				break;
			}
		}

		if (result == null) {
			result = this.scaleArray[scaleArray.length - 1];
		}

		return result;
	}
}

function colorOK(color) {
	return /^#[0-9A-F]{6}$/i.test(color);
}