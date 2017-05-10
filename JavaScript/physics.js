"use strict";
/**
 * Created by Vlad on 30.04.2017.
 */

//general vars
var length = 100;

// optional vars
var angularVelocity = 0.075;

// earth vars
var lambda0 = Math.PI / 3;
var g = compute_g(lambda0);
var sigma = sigma0 * Math.sin(lambda0);

// general const
var g0 = 9.8265;
var a = 0.1;

//earth const
var sigma0 = Math.PI / 43200;
var R0 = 6.37 * 1e6;

//computing


function compute_g(phi) {
    return g0 - (sigma0 * sigma0 * R0 * Math.cos(phi) * Math.cos(phi));
};

var omega_z = Math.sqrt(g / length);

var angularFrequency = Math.sqrt(g0 / length);

function X(t) {
    return 0;
};

function Y_z(t) {
    return a * Math.cos(omega_z * t);
};

function Y(t) {
    return a * Math.cos(angularFrequency * t);
};

function x_z(t) {
    return X(t) * Math.cos(sigma * t) + Y_z(t) * Math.sin(sigma * t);
}

function y_z(t) {
    return -X(t) * Math.sin(sigma * t) + Y_z(t) * Math.cos(sigma * t);
}

function x(t) {
    return X(t) * Math.cos(angularVelocity * t) + Y(t) * Math.sin(angularVelocity * t);
}

function y(t) {
    return -X(t) * Math.sin(angularVelocity * t) + Y(t) * Math.cos(angularVelocity * t);
}