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

var color = "#000";
var thick = 1;


function initDraw() {
    //grey lines

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

function funGraph() {
    context.beginPath();


    var newPoint = func(t += 0.1);
    points.push({
        x: tranformX(newPoint.x),
        y: tranformY(newPoint.y)
    });

    if (points.length > 700) {
        context.clearRect(0, 0, width, height);
        initDraw();
        points.shift();
    }

    context.moveTo(points[0].x, points[0].y);

    for (var i = 1; i < points.length; ++i) {
        context.lineTo(points[i].x, points[i].y);
    }

    context.strokeStyle = color;
    context.stroke();
}

draw();

