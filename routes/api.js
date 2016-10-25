var express = require('express');
var MongoClient = require("mongodb");
var router = express.Router();
var url = 'mongodb://localhost:27017/saivasdata';
var assert = require('assert');

var stringify = require('json-stable-stringify');

router.get('/allData', function (req, res, next) {
    var parameter = req.query.parameter;
    var dataType = req.query.dataType;
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var depthFrom = parseFloat(req.query.depthFrom);
    var depthTo = parseFloat(req.query.depthTo);
    intDepthFrom = Math.floor(depthFrom);
    intDepthTo = Math.ceil(depthTo) - depthFrom + 1;
    var queryToBeSavedAsText = "";

    var allValuesBetweenDatesForOneParameter = function (db, callback) {
        var cursor = db.collection('diveinterpolated').aggregate({
                $match: {
                    "startdatetime": {
                        $gte: new Date([fromDate]),
                        $lte: new Date([toDate])
                    }
                }
            },
            {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {$unwind: "$timeseries"}, {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {
                $group: {
                    _id: {
                        year: {$year: "$startdatetime"},
                        month: {$month: "$startdatetime"},
                        day: {$dayOfMonth: "$startdatetime"},
                        hour: {$hour: "$startdatetime"},
                        depth: "$timeseries.pressure(dBAR)",
                        value: "$" + parameter
                    },
                }
            }, {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1,
                    '_id.day': 1,
                    '_id.hour': 1,
                    '_id.depth': 1
                }
            }, {$sort: {'_id.year': 1, '_id.month': 1, '_id.depth': 1}});

        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                queryToBeSavedAsText += stringify(doc, {pretty: true, space: 1})
            } else {
                callback();
            }
        })
    };



    MongoClient.connect(url, function (err, db) {
        allValuesBetweenDatesForOneParameter(db, function () {
            db.close();
            res.send(removeElements(queryToBeSavedAsText));
        })
    });

});

router.get('/averageMonth', function (req, res, next) {

    var parameter = req.query.parameter;
    var dataType = req.query.dataType;
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var depthFrom = parseFloat(req.query.depthFrom);
    var depthTo = parseFloat(req.query.depthTo);
    var queryToBeSavedAsText = "";

    var querySearchAverageMonthsBetweenDatesAndDepths = function (db, callback) {
        var cursor = db.collection('diveinterpolated').aggregate({
                $match: {
                    "startdatetime": {
                        $gte: new Date([fromDate]),
                        $lte: new Date([toDate])
                    }
                }
            },
            {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {$unwind: "$timeseries"}, {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {
                $group: {
                    _id: {
                        year: {$year: "$startdatetime"},
                        month: {$month: "$startdatetime"},
                        depth: "$timeseries.pressure(dBAR)"
                    },
                    average: {$avg: "$" + [parameter]}
                }
            }, {$sort: {'_id.year': 1, '_id.month': 1, '_id.depth': 1}}, {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1,
                    '_id.depth': 1
                }
            });
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                queryToBeSavedAsText += stringify(doc, {pretty: true, space: 1})
            } else {
                callback();
            }
        })
    };


    MongoClient.connect(url, function (err, db) {
        querySearchAverageMonthsBetweenDatesAndDepths(db, function () {
            db.close();
            res.send(removeElements(queryToBeSavedAsText));
        })
    });

});

router.get('/averageDay', function (req, res, next) {

    var parameter = req.query.parameter;
    var dataType = req.query.dataType;
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var depthFrom = parseFloat(req.query.depthFrom);
    var depthTo = parseFloat(req.query.depthTo);
    var queryToBeSavedAsText = "";

    var querySearchAverageDayBetweenDatesAndDepths = function (db, callback) {
        var cursor = db.collection('diveinterpolated').aggregate({
                $match: {
                    "startdatetime": {
                        $gte: new Date([fromDate]),
                        $lte: new Date([toDate])
                    }
                }
            },
            {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {$unwind: "$timeseries"}, {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {
                $group: {
                    _id: {
                        year: {$year: "$startdatetime"},
                        month: {$month: "$startdatetime"},
                        day: {$dayOfMonth: "$startdatetime"},
                        depth: "$timeseries.pressure(dBAR)"
                    },
                    average: {$avg: "$" + [parameter]}
                }
            }, {$sort: {'_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.depth': 1}}, {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1,
                    '_id.day': 1,
                    '_id.depth': 1
                }
            });
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                queryToBeSavedAsText += stringify(doc, {pretty: true, space: 1})
            } else {
                callback();
            }
        })
    };


    MongoClient.connect(url, function (err, db) {
        querySearchAverageDayBetweenDatesAndDepths(db, function () {
            db.close();
            res.send(removeElements(queryToBeSavedAsText));
        })
    });


});

router.get('/averageWeek', function (req, res, next) {

    var parameter = req.query.parameter;
    var dataType = req.query.dataType;
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var depthFrom = parseFloat(req.query.depthFrom);
    var depthTo = parseFloat(req.query.depthTo);
    var queryToBeSavedAsText = "";

    var querySearchAverageWeekBetweenDatesAndDepths = function (db, callback) {
        var cursor = db.collection('diveinterpolated').aggregate({
                $match: {
                    "startdatetime": {
                        $gte: new Date([fromDate]),
                        $lte: new Date([toDate])
                    }
                }
            },
            {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {$unwind: "$timeseries"}, {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {
                $group: {
                    _id: {
                        year: {$year: "$startdatetime"},
                        week: {$week: "$startdatetime"},
                        depth: "$timeseries.pressure(dBAR)"
                    },
                    average: {$avg: "$" + [parameter]}
                }
            }, {$sort: {'_id.year': 1, '_id.week': 1, '_id.depth': 1}}, {
                $sort: {
                    '_id.year': 1,
                    '_id.week': 1,
                    '_id.depth': 1
                }
            });
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                queryToBeSavedAsText += stringify(doc, {pretty: true, space: 1})
            } else {
                callback();
            }
        })
    };


    MongoClient.connect(url, function (err, db) {
        querySearchAverageWeekBetweenDatesAndDepths(db, function () {
            db.close();
            res.send(removeElements(queryToBeSavedAsText));
        })
    });

});

router.get('/averageYear', function (req, res, next) {

    var parameter = req.query.parameter;
    var dataType = req.query.dataType;
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var depthFrom = parseFloat(req.query.depthFrom);
    var depthTo = parseFloat(req.query.depthTo);
    var queryToBeSavedAsText = "";

    var querySearchAverageYearBetweenDatesAndDepths = function (db, callback) {
        var cursor = db.collection('diveinterpolated').aggregate({
                $match: {
                    "startdatetime": {
                        $gte: new Date([fromDate]),
                        $lte: new Date([toDate])
                    }
                }
            },
            {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {$unwind: "$timeseries"}, {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {
                $group: {
                    _id: {year: {$year: "$startdatetime"}, depth: "$timeseries.pressure(dBAR)"},
                    average: {$avg: "$" + [parameter]}
                }
            },
            {$sort: {'_id.year': 1, '_id.depth': 1}}, {$sort: {'_id.year': 1, '_id.depth': 1}});
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                queryToBeSavedAsText += stringify(doc, {pretty: true, space: 1})
            } else {
                callback();
            }
        })
    };

    MongoClient.connect(url, function (err, db) {
        querySearchAverageYearBetweenDatesAndDepths(db, function () {
            db.close();
            res.send(removeElements(queryToBeSavedAsText));
        })
    });

});

var dateList = [];
var dataList = [];
var depthList = [];

var parameter = "";

var list;

function removeElements(input) {

    input = input.replace(/\s/g, "");
    input = input.replace(/{/g, "");
    input = input.replace(/}/g, "");
    input = input.replace(/"/g, "");
    input = input.replace(/undefined/g, "");

    list = input.split(/,|_id:|\[|\]/);

    if(list[0] === "")
        dateList.shift();

    return addToList();

}

function addToList() {

    var date = "";
    var expectedDepth;
    var lowDepth;
    var highDepth;

    var hour = "";
    var day = "";
    var week = "";
    var month = "";
    var year = "";

    var firstElement = "";
    var lastElement = "";

    for (var d = 0; d < list.length; d++) {

        if (list[d].indexOf("depth") !== -1) {

            if (isInList(list[d], depthList)) {
                depthList.push(list[d].substring(list[d].indexOf(":") + 1) + "m");
            }
        }

    }

    lowDepth = depthList[0].slice(0,-3);
    highDepth = depthList[depthList.length-1].slice(0,-3);
    expectedDepth = lowDepth;

    for (var i = 0; i < list.length; i++) {

        if(lastElement === "") {
            if (list[i + 1] === firstElement)
                lastElement = list[i].substring(0, list[i].indexOf(":"));
        }
        else if(list[i].indexOf(lastElement) !== -1){
            date = (year + month + week + day + hour + "").slice(0,-1);

            if(isInList(date,dateList))
                dateList.push(date);

            hour = "";
            day = "";
            week = "";
            month = "";
            year = "";
            date = "";
        }

        if(list[i].indexOf("average") !== -1 || list[i].indexOf("value") !== -1) {
                dataList.push(parseFloat(list[i].substring(list[i].indexOf(":") + 1)).toFixed(3));
        }
        else if(list[i].indexOf("depth") !== -1) {

            while (list[i].substring(list[i].indexOf(":") + 1).slice(0, -2) != expectedDepth.toString()) {

                dataList.push("-");

                if (expectedDepth.toString() === highDepth)
                    expectedDepth = lowDepth;
                else
                    expectedDepth++;
            }

            if (expectedDepth.toString() === highDepth)
                expectedDepth = lowDepth;
            else
                expectedDepth++;
        }
        else {

            if(firstElement === "")
                firstElement = list[i];

            if((list[i].substring(list[i].indexOf(":") + 1).length) === 1){
                list[i] = "0" + list[i];
                list[i] = [list[i].slice(0, list[i].indexOf(":") + 1), "0", list[i].slice(list[i].indexOf(":") + 1)].join('');
            }

            if(list[i].indexOf("hour") !== -1 )
                hour = list[i].substring(list[i].indexOf(":") + 1) + ".";
            else if(list[i].indexOf("day") !== -1 )
                day = list[i].substring(list[i].indexOf(":") + 1) + ".";
            else if(list[i].indexOf("week") !== -1 )
                week = list[i].substring(list[i].indexOf(":") + 1) + ".";
            else if(list[i].indexOf("month") !== -1 )
                month = list[i].substring(list[i].indexOf(":") + 1) + ".";
            else if(list[i].indexOf("year") !== -1 )
                year = list[i].substring(list[i].indexOf(":") + 1) + ".";
        }
    }

    return buildString();
}

function buildString() {

    var finalString = "";



    for(var i=0;i<dateList.length+1;i++){

        if (i == 0)
            finalString += "Tid\tNr\t";
        else if(i == (dataList.length - 1 ))
            finalString += dateList[i] + "\t" + (i) + "\t";
        else
            finalString += dateList[i-1] + "\t" + (i) + "\t";

        for(var j=(i*depthList.length);j<(depthList.length + i*depthList.length);j++) {

            if(i == 0)
                finalString += depthList[j] + "\t";
            else
                finalString += dataList[j-depthList.length] + "\t";

        }
        finalString += "\n";
    }
    list = "";
    dateList = [];
    dataList = [];
    depthList = [];
    return finalString;
}

function isInList(element, list) {

    var add = true;

    for (var i = 0; i < list.length; i++) {
        if (element.substring(element.indexOf(":") + 1) + "m" === list[i] && element.indexOf("depth") !== -1) {
            add = false;
        } else if((element.substring(list[i].indexOf(":") + 1) + ".").slice(0,-1) === list[i] && element.indexOf("depth") == -1) {
            add = false;
        }
    }
    return add;

}

module.exports = router;