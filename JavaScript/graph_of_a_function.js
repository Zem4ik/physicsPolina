/**
 * Created by vlad on 10.05.17.
 */

"use strict";

var c_canvas = document.getElementById("graph_of_a_function");
var context = c_canvas.getContext("2d");

var width = c_canvas.scrollWidth;
var height = c_canvas.scrollHeight;

var points = [];
var t = 0;

var lengthElement = document.getElementById("length");
var angularVelocityElement = document.getElementById("angular_velocity");
var angularFrequencyElement = document.getElementById("angular_frequency");
var timeSpeedingElement = document.getElementById("time_speeding");
var maxPointsElement = document.getElementById("max_points");

var length = parseFloat(lengthElement.value);
var angularVelocity = parseFloat(angularVelocityElement.value);
var angularFrequency;
var timeSpeeding;
var maxPoints;


var graph_color = "#00f";

function initDraw() {
    //grey lines
    context.beginPath();

    for (var x = 0.5; x < width; x += 10) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
    }

    for (var y = 0.5; y < height; y += 10) {
        context.moveTo(0, y);
        context.lineTo(width, y);
    }

    context.strokeStyle = "#eee";
    context.stroke();


    context.closePath();

//axis

    context.beginPath();
    context.moveTo(0, height / 2);
    context.lineTo(width, height / 2);
    context.lineTo(width - 15, height / 2 - 5);
    context.moveTo(width, height / 2);
    context.lineTo(width - 15, height / 2 + 5);

    context.moveTo(width / 2, height);
    context.lineTo(width / 2, 0);
    context.lineTo(width / 2 - 5, 15);
    context.moveTo(width / 2, 0);
    context.lineTo(width / 2 + 5, 15);

    context.strokeStyle = "#000";
    context.stroke();
    context.closePath();
}

function tranformX(x) {
    return x + width / 2;
}

function tranformY(y) {
    return -y + height / 2;
}

function func(t) {
    return {
        x: x(t) * 1000,
        y: y(t) * 1000
    }
}

function draw() {
    initDraw();

    setInterval(funGraph, 10);

}

function clear() {
    context.clearRect(0, 0, width, height);
    initDraw();
}

function funGraph() {
    if (length !== parseFloat(lengthElement.value) || angularVelocity !== parseFloat(angularVelocityElement.value) ||
        timeSpeeding !== parseFloat(timeSpeedingElement.value) || maxPoints !== parseFloat(maxPointsElement.value)) {
        length = parseFloat(lengthElement.value);
        angularVelocity = parseFloat(angularVelocityElement.value);
        timeSpeeding = parseFloat(timeSpeedingElement.value);
        maxPoints = parseFloat(maxPointsElement.value);
        clear();
        points = [];
        t = 0;
    }

    if (!isNaN(length)) {
        angularFrequency = Math.sqrt(g0 / length);
        angularFrequencyElement.textContent = angularFrequency;
    } else {
        angularFrequencyElement.textContent = "";
    }

    if (length === 0 || isNaN(timeSpeeding) || timeSpeeding === 0) return;


    var newPoint = func(t += 0.01 * timeSpeeding);
    points.push({
        x: tranformX(newPoint.x),
        y: tranformY(newPoint.y)
    });

    if (points.length > maxPoints) {
        clear();
        points.shift();
    }

    context.beginPath();

    context.moveTo(points[0].x, points[0].y);

    for (var i = 1; i < points.length; ++i) {
        context.lineTo(points[i].x, points[i].y);
    }

    context.strokeStyle = graph_color;
    context.stroke();
    context.closePath();
}

draw();

