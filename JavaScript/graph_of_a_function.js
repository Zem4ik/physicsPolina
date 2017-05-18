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
var zooming = 1000;
var graph_color = "#00f";
var funGraphId = NaN;

//DOM elements
//general elements
var lengthElement = document.getElementById("length");
var angularVelocityElement = document.getElementById("angular_velocity");
var angularFrequencyElement = document.getElementById("angular_frequency");
var timeSpeedingElement = document.getElementById("time_speeding");
var maxPointsElement = document.getElementById("max_points");
//earth element
var latitudeElement = document.getElementById("latitude");
var gravityElement = document.getElementById("gravity");

//general variables
var length = parseFloat(lengthElement.value);
var angularVelocity = parseFloat(angularVelocityElement.value);
var angularFrequency;
var timeSpeeding;
var maxPoints;
//earth variable
var latitude;

//formatting number to show it
function numberFormatting(number) {
    if (number < 0.0001) return number.toPrecision(1);
    return number.toPrecision(5)
}

//button "Start!" for Earth
function validateEarth() {
    length = parseFloat(lengthElement.value);
    latitude = parseFloat(latitudeElement.value);
    timeSpeeding = parseFloat(timeSpeedingElement.value);
    maxPoints = parseFloat(maxPointsElement.value);
    var validated = true;
    if (isNaN(length) || length <= 0) {
        alert("Введена неверная длина (должна быть больше 0)");
        validated = false;
    }
    if (isNaN(latitude) || latitude < 0 || latitude > 90) {
        alert("Введена неверная широта (должна быть в промежутке от 0 до 90)");
        validated = false;
    }
    if (isNaN(timeSpeeding) || timeSpeeding < 10) {
        alert("Введен неверный временной интервал между просчетом двух соседних точек (должен быть больше 10)");
        validated = false;
    }
    if (isNaN(maxPoints) || maxPoints <= 0) {
        alert("Введена неверное количество сохраняемых точек (должен быть больше 0)");
        validated = false;
    }
    latitude = latitude * Math.PI / 180;

    // if all input values have been checked
    if (validated) {
        if (!isNaN(funGraphId)) clearInterval(funGraphId);

        //calculating
        timeSpeeding = timeSpeeding / 1000;

        g = compute_g(latitude);
        gravityElement.textContent = numberFormatting(g);

        angularFrequency = Math.sqrt(g / length);
        angularFrequencyElement.textContent = numberFormatting(angularFrequency);

        angularVelocity = sigma0 * Math.sin(latitude);
        angularVelocityElement.textContent = numberFormatting(angularVelocity);

        funGraphId = setInterval(funGraph, 10, funcEarth);
    } else {
        if (isNaN(funGraphId)) return;
        clearInterval(funGraphId);
        funGraphId = 0;
        clear();
        angularFrequencyElement.textContent = "";
    }
}

//button "Start!" for optional
function validateOptional() {
    length = parseFloat(lengthElement.value);
    angularVelocity = parseFloat(angularVelocityElement.value);
    timeSpeeding = parseFloat(timeSpeedingElement.value);
    maxPoints = parseFloat(maxPointsElement.value);
    var validated = true;
    if (isNaN(length) || length <= 0) {
        alert("Введена неверная длина (должна быть больше 0)");
        validated = false;
    }
    if (isNaN(angularVelocity)) {
        alert("Введена неверная нормальная составляющая угловой скорости вращения системы");
        validated = false;
    }
    if (isNaN(timeSpeeding) || timeSpeeding < 10) {
        alert("Введен неверный временной интервал между просчетом двух соседних точек (должен быть больше 10)");
        validated = false;
    }
    if (isNaN(maxPoints) || maxPoints <= 0) {
        alert("Введена неверное количество сохраняемых точек (должен быть больше 0)");
        validated = false;
    }
    // if all input values have been checked
    if (validated) {
        if (!isNaN(funGraphId)) clearInterval(funGraphId);

        //calculating
        timeSpeeding = timeSpeeding / 1000;

        angularFrequency = Math.sqrt(g0 / length);
        angularFrequencyElement.textContent = numberFormatting(angularFrequency);

        funGraphId = setInterval(funGraph, 10, funcOptional);
    } else {
        if (isNaN(funGraphId)) return;
        clearInterval(funGraphId);
        funGraphId = 0;
        clear();
        angularFrequencyElement.textContent = "";
    }
}

//initial drawing (axis and grey lines)
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

    context.font = "18px bold";
    context.textBaseline = "top";
    context.fillText("x", width / 2 - 18, 0);
    context.fillText("y", width - 15, height / 2 - 25);

    context.strokeStyle = "#000";
    context.stroke();
    context.closePath();
}

//functions for getting x and y coordinates for canvas
function transformX(x) {
    return x + width / 2;
}

function transformY(y) {
    return -y + height / 2;
}

//optional function to draw
function funcOptional(t) {
    return {
        x: x(t) * zooming,
        y: y(t) * zooming
    }
}

//earth function to draw
function funcEarth(t) {
    return {
        x: x_z(t) * zooming,
        y: y_z(t) * zooming
    }
}

//clear and run initDraw()
function clear() {
    context.clearRect(0, 0, width, height);
    initDraw();
}

//drawing function graph
function funGraph(func) {
    if (t + timeSpeeding < 0) {
        t = 0;
        points = [];
    }

    var newPoint = func(t += timeSpeeding);
    points.push({
        x: transformX(newPoint.x),
        y: transformY(newPoint.y)
    });

    clear();
    while (points.length > maxPoints) {
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

initDraw();