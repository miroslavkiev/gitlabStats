let usersData = {
    names: ['vits', 'naba', 'ndm', 'anser', 'alymak', 'annko', 'rbod', 'voz', 'illia.khutornyi', 'vladz'],
    vacations: [10, 1, 4, 7, 4, 6, 6, 5, 1, 5],
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

function calcAbsenseMultiplier() {
    for (let i = 0; i < usersData.vacations.length; i++) {
        usersData.absenseCoefficient.push(1 + (usersData.vacations[i] / usersData.uniqueDates.length));
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
                        nodeTd.style.backgroundColor = "#f2c3dd";
                    }

                    let textnode = document.createTextNode(usersData.jsons[k][usersData.uniqueDates[i]]);
                    nodeTd.appendChild(textnode);
                    document.getElementById(`row${i}`).appendChild(nodeTd);
                }
                else {
                    let nodeTd = document.createElement("TD");
                    let textnode = document.createTextNode("0");
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
        calcAbsenseMultiplier();
        printTableStats();
    });
}