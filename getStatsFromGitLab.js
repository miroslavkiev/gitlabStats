let usersData = {
    names: ['vits', 'naba', 'ndm', 'anser', 'alymak', 'annko', 'rbod', 'voz', 'illia.khutornyi'
        //,'vladz'
    ],
    vacationsDates: {
        alymak: ["2017-12-29","2018-01-02","2018-01-03","2018-01-29","2018-03-09","2018-03-10","2018-03-11","2018-03-12","2018-03-13"],
        annko: ["2017-12-29","2018-01-02","2018-01-03","2018-01-04","2018-01-05","2018-01-25","2018-02-21","2018-02-22","2018-02-23"],
        rbod: ["2017-12-29","2018-01-02","2018-01-03","2018-01-04","2018-01-05","2018-01-06","2018-01-07","2018-01-08","2018-01-09","2018-02-12"],
        anser: ["2018-01-02","2018-01-03","2018-01-04","2018-01-05","2018-01-22","2018-01-23","2018-01-24","2018-02-12","2018-02-13","2018-02-14","2018-02-15","2018-02-16","2018-02-21"],
        ndm: ["2018-01-02","2018-01-03","2018-01-09","2018-01-10","2018-02-09","2018-02-10","2018-02-11","2018-02-12","2018-02-13","2018-02-14","2018-02-15","2018-02-16"],
        vits: ["2018-01-02","2018-01-03","2018-01-04","2018-01-05","2018-01-06","2018-01-07","2018-01-08","2018-01-09","2018-01-10","2018-01-11","2018-01-12","2018-01-22","2018-01-23","2018-02-12"],
 //       vladz: ["2018-01-02","2018-01-03","2018-01-04","2018-01-05","2018-01-25","2018-02-19","2018-03-01","2018-03-05","2018-03-06","2018-03-07","2018-03-08","2018-03-09","2018-03-10","2018-03-11","2018-03-12"],
        voz: ["2018-01-05","2018-01-06","2018-01-07","2018-01-08","2018-01-09","2018-01-19","2018-01-31","2018-02-08","2018-02-28","2018-03-01","2018-03-02"],
        naba: ["2018-01-17","2018-03-09","2018-04-23","2018-04-24"],
        'illia.khutornyi': ["2018-02-08","2018-02-09","2018-02-23","2018-02-24","2018-02-25","2018-02-26","2018-02-27","2018-02-28"],
    },
    vacationsTillToday: [],
    absenseCoefficient: [],
    urls: [],
    jsons: [],
    uniqueDates: [],
    totals: []
};

if (localStorage.getItem("privateToken")) {
    privateTokenValue.value = localStorage.getItem("privateToken");
}

function submitPrivateToken() {
    localStorage.setItem("privateToken", privateTokenValue.value);
    location.reload();
}

function checkIfVacation(user, date) {
    for (let i = 0; i < usersData.vacationsDates[user].length; i++) {
        if (usersData.vacationsDates[user][i] === date) return 1;
    }
}

function calcVacationDaysTillToday() {
    let usersInVacations = Object.keys(usersData.vacationsDates);
    for (let i = 0; i < usersInVacations.length; i++) {
        for (let j = 0; j < usersData.vacationsDates[usersInVacations[i]].length; j++) {
            if (Date.parse(usersData.vacationsDates[usersInVacations[i]][j]) < Date.now()) {
                if (!usersData.vacationsTillToday[i]) usersData.vacationsTillToday[i] = 0;
                usersData.vacationsTillToday[i]++;
            }
        }
    }
}

function calcAbsenseMultiplier() {
    let usersInVacations = Object.keys(usersData.vacationsDates);
    for (let i = 0; i < usersInVacations.length; i++) {
        usersData.absenseCoefficient.push(1 + (usersData.vacationsTillToday[i] / usersData.uniqueDates.length));
    }
}

function generateUrls() {
    for (let i = 0; i < usersData.names.length; i++) {
        usersData.urls[i] = `https://gitlab.ciklum.net/users/${usersData.names[i]}/calendar.json?private_token=${localStorage.getItem("privateToken")}`;
    }
}

function normalizeData() {
    for (let i = 0; i < usersData.jsons.length; i++) {
        usersData.uniqueDates = usersData.uniqueDates.concat(Object.keys(usersData.jsons[i]));
    }
    let uniqueArray = [...new Set(usersData.uniqueDates)];
    uniqueArray.sort();
    usersData.uniqueDates = uniqueArray.slice('');
}

function calculateTotals() {
    for (let i = 0; i < usersData.jsons.length; i++) {
        let currentTotal = 0;
        for (let j = 0; j < usersData.uniqueDates.length; j++) {
            if (usersData.jsons[i][usersData.uniqueDates[j]]) {
                currentTotal += parseInt(usersData.jsons[i][usersData.uniqueDates[j]]);
            }
        }
        usersData.totals.push(currentTotal);
    }
}

function calculateOpacityPercentage(currentTotal) {
    let maxTotalValue = Math.max.apply(Math, usersData.totals);
    let minTotalValue = Math.min.apply(Math, usersData.totals);
    let minMaxDiff = maxTotalValue - minTotalValue;
    let currentTotalRelValue = currentTotal - minTotalValue;
    return currentTotalRelValue / minMaxDiff;
}

function printTableStats() {
    for (let i = 0; i <= usersData.uniqueDates.length; i++) {
        let nodeTr = document.createElement("TR");
        nodeTr.setAttribute("id", `row${i}`);
        tableContainer.appendChild(nodeTr);
        if (i === 0) {
            let nodeTd = document.createElement("TD");
            document.getElementById(`row${i}`).appendChild(nodeTd);
            for (let j = 0; j < usersData.names.length; j++) {
                let nodeTd = document.createElement("TD");
                let textnode = document.createTextNode(usersData.names[j]);
                nodeTd.appendChild(textnode);
                document.getElementById(`row${i}`).appendChild(nodeTd);
            }
        }
        else if (usersData.uniqueDates.length === i) {
            for (let l = 0; l < usersData.names.length; l++) {
                if (l === 0) {
                    let nodeTd = document.createElement("TD");
                    let textnode = document.createTextNode("Weighted totals");
                    nodeTd.appendChild(textnode);
                    document.getElementById(`row${i}`).appendChild(nodeTd);
                    document.getElementById(`row${i}`).style.fontWeight = "bolder";
                }
                let nodeTd = document.createElement("TD");
                let textnode = document.createTextNode(Math.ceil(usersData.totals[l] * usersData.absenseCoefficient[l]));
                nodeTd.style.backgroundColor = `rgba(0, 78, 0, ${calculateOpacityPercentage(usersData.totals[l] * usersData.absenseCoefficient[l])})`;
                nodeTd.appendChild(textnode);
                document.getElementById(`row${i}`).appendChild(nodeTd);
            }
        }
        else {
            for (let k = 0; k < usersData.names.length; k++) {
                if (k === 0) {
                    let nodeTd = document.createElement("TD");
                    let textnode = document.createTextNode(usersData.uniqueDates[i]);
                    nodeTd.appendChild(textnode);
                    document.getElementById(`row${i}`).appendChild(nodeTd);
                }
                if (usersData.jsons[k][usersData.uniqueDates[i]]) {
                    let nodeTd = document.createElement("TD");
                    //Highlight activity on weekdays
                    if (checkForWeekends(usersData.uniqueDates[i])) {
                        document.getElementById(`row${i}`).setAttribute("class", "hatching");
                        nodeTd.style.backgroundColor = "#90EE90";
                    }
                    if (checkIfVacation(usersData.names[k], usersData.uniqueDates[i])) {
                        nodeTd.style.backgroundColor = "#66CCCC";
                    }
                    let textnode = document.createTextNode(usersData.jsons[k][usersData.uniqueDates[i]]);
                    nodeTd.appendChild(textnode);
                    document.getElementById(`row${i}`).appendChild(nodeTd);
                }
                else {
                    let nodeTd = document.createElement("TD");
                    let textnode = document.createTextNode("0");
                    if (checkIfVacation(usersData.names[k], usersData.uniqueDates[i])) {
                        nodeTd.style.backgroundColor = "#66CCCC";
                    }
                    else {
                        if (!checkIfVacation(usersData.names[k], usersData.uniqueDates[i]) && !checkForWeekends(usersData.uniqueDates[i])) {
                            nodeTd.style.backgroundColor = "#FF0000";
                        }
                    }
                    nodeTd.appendChild(textnode);
                    document.getElementById(`row${i}`).appendChild(nodeTd);
                }

            }

        }
    }
}

function checkForWeekends(date) {
    let dateToCheck = new Date(date);
    let dayOfWeek = dateToCheck.getDay();
    if ((dayOfWeek === 6) || (dayOfWeek === 0)) {
        return 1;
    }
}

function getUserStats() {
    generateUrls();
    let promises = usersData.urls.map(url => fetch(url).then(y => y.json()));
    Promise.all(promises).then(results => {
        usersData.jsons = results;
        normalizeData();
        calculateTotals();
        calcVacationDaysTillToday();
        calcAbsenseMultiplier();
        printTableStats();
    });
}