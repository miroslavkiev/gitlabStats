let tesf = [];

let usersData = {
    names: ['vits', 'naba', 'ndm', 'anser', 'alymak', 'annko', 'rbod', 'voz', 'illia.khutornyi', 'vladz'],
    urls: [],
    jsons: [],
    uniqueDates: []
};

// 'https://gitlab.ciklum.net/users/naba/calendar.json?private_token=';
const privateToken = 'jhzSvdUm5dfyT7Yws-Ta';

function generateUrls() {
    for(let i = 0; i < usersData.names.length; i++){
        usersData.urls[i] = `https://gitlab.ciklum.net/users/${usersData.names[i]}/calendar.json?private_token=${privateToken}&timestamp=fas2eewefesуeaes34`;
    }
}

function fetchUserCommits(url, name) {
    fetch(url)
    .then(function(response,name) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return [response.json(),name];
    }).then(function(data,name) {
        usersData.jsons.push(name);
    }).catch(function(error) {
        console.log(error);
    });
}

function normalizeData() {
    for(let i = 0; i < usersData.jsons.length; i++){
        usersData.uniqueDates = usersData.uniqueDates.concat(Object.keys(usersData.jsons[i]));
    }
    let uniqueArray = [...new Set(usersData.uniqueDates)]; 
    uniqueArray.sort();
    usersData.uniqueDates = uniqueArray.slice('');
}

function printTableStats() {
    for (let i = 0; i <= usersData.uniqueDates.length; i++){
        let nodeTr = document.createElement("TR"); 
        nodeTr.setAttribute("id",`row${i}`);
        tableContainer.appendChild(nodeTr);
        if (i === 0){
            let nodeTd = document.createElement("TD");
            document.getElementById(`row${i}`).appendChild(nodeTd);
            for (let j = 0; j < usersData.names.length; j++){
                let nodeTd = document.createElement("TD");
                let textnode = document.createTextNode(usersData.names[j]);
                nodeTd.appendChild(textnode);
                document.getElementById(`row${i}`).appendChild(nodeTd);
            }
        }
        else if (usersData.uniqueDates.length === i) {
            for(let l = 0; l < usersData.names.length; l++){
                if (l === 0){
                    let nodeTd = document.createElement("TD");
                    let textnode = document.createTextNode("Totals");
                    nodeTd.appendChild(textnode);
                    document.getElementById(`row${i}`).appendChild(nodeTd);
                }
                let nodeTd = document.createElement("TD");
                let currentTotal = 0;
                for (let m = 0; m < usersData.uniqueDates.length;m++){
                    if (usersData.jsons[l][usersData.uniqueDates[m]]){
                        currentTotal += parseInt(usersData.jsons[l][usersData.uniqueDates[m]]);
                    }
                }
                let textnode = document.createTextNode(currentTotal);
                nodeTd.appendChild(textnode);
                document.getElementById(`row${i}`).appendChild(nodeTd);
            }
        }
        else {
            for(let k = 0; k < usersData.names.length; k++){
                if (k === 0){
                    let nodeTd = document.createElement("TD");
                    let textnode = document.createTextNode(usersData.uniqueDates[i]);
                    nodeTd.appendChild(textnode);
                    document.getElementById(`row${i}`).appendChild(nodeTd);
                }
                if (usersData.jsons[k][usersData.uniqueDates[i]]) {
                    let nodeTd = document.createElement("TD");
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



function printStats (){
    for (let i = 0; i < usersData.names.length; i++){
        console.log("Username: " + usersData.names[i] + "\n");
        for(let j = 0; j < usersData.uniqueDates.length; j++){
            if (usersData.jsons[i][usersData.uniqueDates[j]]) {
                console.log(usersData.uniqueDates[j] + " - " +  usersData.jsons[i][usersData.uniqueDates[j]] + "\n");
            }
            else {
                console.log(usersData.uniqueDates[j] + " - 0\n");
            }
        }
    }
}



function getUserStats() {
    generateUrls();
    for(let i = 0; i < usersData.urls.length; i++) {
        fetchUserCommits(usersData.urls[i], usersData.names[i]);
    }
    // setTimeout(() => {
    //     normalizeData();
    //     printTableStats();
    // }, 1000);
}