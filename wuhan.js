function parse_age(input) {
    // console.log("parse_age(" + input + ");");
    var result = input.match(/\d+/);
    if (result === null) return null;
    return result[0];
}

function parse_gender(input) {
    // console.log("parse_gender(" + input + ");");
    if (input.search("男") != -1 || input === "male") {
        return "male";
    } else if (input.search("女") != -1 || input === "female") {
        return "female";
    }
    console.log("Error parsing gender: " + input);
    
    return null;
}

function parse_residence(input) {
    // console.log("parse_residence(" + input + ");");
    var result = input.match(/\S部/);
    if (result !== null) return result[0];
}

function parse_location(input) {
    // console.log("parse_location(" + input + ");");
    var result = input.match(/(土耳其)/);
    if (result !== null) return result[1];

    // 去至赴到
    var result = input.match(/[\u53bb\u81f3\u8d74\u5230](\S+)(參加(婚禮)*|工作|旅遊|留學|就學|比賽|活動)/);
    if (result !== null) return result[1];

    var result = input.match(/(同遊|前往)([^\uff0c]+)，/);
    if (result !== null) return result[2];

    var result = input.match(/有(\S+)旅遊史/);
    if (result !== null) return result[1];

    var result = input.match(/參加(\S+)團體旅遊/);
    if (result !== null) return result[1];

    // console.log("Error parsing location: " + input);
    return null
}

function parse_nationality(input) {
    // console.log("parse_nationality(" + input + ");");
    var result = input.match(/[部男女性](.*籍)/);
    if (result !== null) return result[1];
    if (input.search("陸客") != -1) return "中國";
    if (input.search("台商") != -1) return "台灣";

    return null;
}

function parse_origin(input) { // 移入/本土
    // console.log("parse_origin(" + input + ");");
    if (input.search(/(本土案例|國內感染|無旅遊史|無出國史|確診前的接觸者|個案接觸者)/) != -1) return "domestic";

    // try using domestic breakout method
    var result = parse_domestic_breakout(input);
    if (result != null) return "domestic";

    if (input.search(/(境外移入|入境|返台|返國|前往美國|曾去西班牙)/) != -1) return "imported";

    // try using imported breakout method
    var result = parse_imported_breakout(input);
    if (result != null) return "imported";

    console.log("Error parsing origin: " + input);

    return null;
}

function parse_imported_breakout(input) { // 破口分析: 移入
    // console.log("parse_breakout(" + input + ");");
    if (input.search(/台商/) != -1) return "taishang";
    if (input.search(/陸客/) != -1) return "luke";

    if (input.search(/(留學|遊學|就學|研習)/) != -1) return "study";

    if (input.search(/(工作|洽公|出差|教會服務|商務活動)/) != -1) return "work";
    
    if (input.search(/(旅遊|旅行|同遊|跟團|同團|鑽石公主號)/) != -1) return "travel";

    if (input.search(/(長居|長住)/) != -1) return "reside";

    if (input.search(/(探親|參加婚禮)/) != -1) return "visit";

    return null;
}

function parse_family(input) {
    var result = input.match(/(為|案|第)(\d+)\S+(家人|親人|丈夫|妻子|父親|母親|[小]*兒子|[小]*女兒|[外]*孫[女]*|哥哥|弟弟)/);
    if (result !== null) return result[2];
    return null;
}

function parse_hospital(input) {
    var result = input.match(/(為|案|第)(\d+)\S+(醫院接觸者|看護|陪病家屬)/);
    if (result !== null) return result[2];
    
    result = input.match(/和案(\d+)\S+同病房/);
    if (result !== null) return result[1];

    return null;
}

function parse_school(input) {
    var result = input.match(/(為|案|第)(\d+)\S+同學/);
    if (result !== null) return result[2];
    return null;
}

function parse_domestic_breakout(input) { // 破口分析: 本土
    if (parse_family(input) !== null) {
        return "family";
    }
    if (parse_hospital(input) !== null) {
        return "hospital";
    }
    if (parse_school(input) !== null) {
        return "school";
    }
    if (input.search("接觸者") != -1) {
        return "contact";
    }
    if (input.search("待釐清") != -1 || input.search("無出國史") != -1 || input.search("無國外旅遊史") != -1) {
        return "unknown";
    }
    return null;
}

result = {} // output
all = []; // input data
all.forEach(function (row) {
    var index = row[0];
    var confirmed_date = row[1];
    var age = row[2];
    var gender = row[3];
    var condition = row[4] + gender;
    var note = row[5];

    // console.log("parsing " + row);

    var origin = parse_origin(condition);
    var description = condition + ((note != null && note.trim() != "") ? note : "") + (parse_residence(gender) || "");

    var breakout = null;
    if (origin === "imported") {
        breakout = parse_imported_breakout(condition);
        // if (breakout === null) {
        //     breakout = "go-abroad";
        // }
    } else if (origin === "domestic") {
        breakout = parse_domestic_breakout(condition);
    }
    if (breakout === null) {
        console.log("Error parsing breakout: " + condition);
    }

    result[index] = {
        "origin": origin,
        "confirmed_date": confirmed_date,
        "age": parse_age(age),
        "gender": parse_gender(gender),
        "location": parse_location(condition),
        "nationality": parse_nationality(gender),
        "breakout": breakout,
        "description": description,
    };

    // if (note != null && note.trim() != "") {
    //     console.log("NOTE parsing " + row);
    // }

    var debug = false;
    if (debug) {
        if (result[index]["origin"] === null) {
            console.log("ERROR parsing " + row);
        } else if (result[index]["origin"] === "imported" && result[index]["breakout"] === null) {
            console.log("ERROR parsing " + row);
        }
    } else {
        if (result[index]["origin"] === null) { // origin unknown = domestic
            result[index]["origin"] = "domestic";
            result[index]["breakout"] = "unknown";
        } else if (result[index]["origin"] === "imported" && result[index]["breakout"] === null) { // imported & no breakout = go-abroad
            result[index]["breakout"] = "go-abroad";
        }
    }
});
JSON.stringify(result);
