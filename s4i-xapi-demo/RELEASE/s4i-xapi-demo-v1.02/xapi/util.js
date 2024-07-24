/*
S4i IB XAPI Utility module
Copyright (C) 2022 Solutions For Integerators Pty Ltd.
*/

function bin2string(array) {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
        result += (String.fromCharCode(array[i]));
    }
    return result;
}

exports.bin2string = bin2string;