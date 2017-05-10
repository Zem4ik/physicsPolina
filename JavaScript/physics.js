"use strict";
/**
 * Created by Vlad on 30.04.2017.
 */
var l = 100;
var lambda0 = Math.PI / 3;
var sigmaSystem = 0.075

// Const
var g0 = 9.8265;
var sigma0 = Math.PI / 43200;
var R0 = 6.37 * 1e6;
var a = 0.1;

//computing

var sigma = sigma0 * Math.sin(lambda0);

var compute_g = function (phi) {
    return g0 - (sigma0 * sigma0 * R0 * Math.cos(phi) * Math.cos(phi));
};

var g = compute_g(lambda0);

var omega_z = Math.sqrt(g / l);

var omega = Math.sqrt(g0 / l);

var X = function (t) {
    return 0;
};

var Y_z = function (t) {
    return a * Math.cos(omega_z * t);
};

var Y = function (t) {
    return a * Math.cos(omega * t);
};

var x_z = function (t) {
    return X(t) * Math.cos(sigma * t) + Y_z(t) * Math.sin(sigma * t);
};

var y_z = function (t) {
    return -X(t) * Math.sin(sigma * t) + Y_z(t) * Math.cos(sigma * t);
};

var x = function (t) {
    return X(t) * Math.cos(sigmaSystem * t) + Y(t) * Math.sin(sigmaSystem * t);
};

var y = function (t) {
    return -X(t) * Math.sin(sigmaSystem * t) + Y(t) * Math.cos(sigmaSystem * t);
};

for (var t = 0; t < 100; t += 0.5) {
    console.log(y_z(t).toString().split('.').join(','));
}