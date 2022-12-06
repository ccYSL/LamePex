// ==UserScript==
// @name         LamePex ApexLeanring Auto Answer
// @namespace    https://apexlearning.com/
// @version      0.1
// @description  Automatically grab ApexLearning quiz question and query it through Brainly.com's GraphQL API for an answer.
// @author       ccccc
// @match        https://course.apexlearning.com/public/activity/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function() {
    'use strict';
    console.log("LamePex v0.1");
    let menu = ` <div style="position:relative;left:5%;width:512px;height:369px;background-color:#151616;border-radius:.50rem"> <div style="height:33px;background-image:linear-gradient(#0e6879,#063e49);border-radius:.50rem .50rem 0 0"> <h2 style="text-align:center;font-family:fantasy;color:#002fff;text-shadow:0 0 20px #39006e">𝓛𝓪𝓶𝓮𝓟𝓮𝔁</h2> <style>th{font-family:fantasy; border-bottom: 2px solid white;}</style> </div> <div style="position:relative;top:3%;height:70%; overflow: auto;"> <table style="margin: 0 auto;"> <thead> <tr> <th>Answer</th> <th>Rating</th> </tr> </thead> <tbody id="results"> </tbody> </table> <div style="justify-content: center; display: flex;"> <button class="addAnswers" id="addBtn">Add Answers</button> <style> .addAnswers { background: #272626; width: 100px; height: 35px; font-size: medium; border: 0; border-radius: 4px; transition: .2s; } .addAnswers:hover{ background: rgb(17, 185, 93); width: 512px; cursor: pointer; } .noHover { pointer-events: none; } </style> </div> </div> </div> </div>`
    let IdList = [];
    let base = document.createElement("div");
    const fragment = document.createDocumentFragment();
    const q = {
        'question': function () {
            return(document.querySelector(".sia-question-stem").innerText)
        },
        'query': function () {
            const RandomHash = "61d4ce5b122351aa53103c6a9b0f87a66bdb34ad06a4fbc2d8f785bed441401d";
            const qreq = new XMLHttpRequest();
            const SearchEndPoint = "https://brainly.com/graphql/us?operationName=SearchPage";
            qreq.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let jsonResponse = JSON.parse(this.responseText);
                    const answeredge = jsonResponse.data.questionSearch.edges;
                    console.log(answeredge);
                    for(let i=0; i < answeredge.length; i++) {
                        IdList.push(answeredge[i].node.databaseId);
                    }
                    q.getAnswer(IdList[0]);
                }
            }
            qreq.open('GET', `${SearchEndPoint}&variables=%7B%22query%22%3A%22:${q.question()}%22%2C%22after%22%3Anull%2C%22first%22%3A10%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22${RandomHash}%22%7D%7D`);
            qreq.send();
        },
        'getAnswer': function (dbid) {
            const siftr = new DOMParser();
            GM.xmlHttpRequest({
                method: "GET",
                url: `https://brainly.com/question/${dbid}`,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
                    "Accept-Language": "en-US,en;q=0.5"
                },
                onload: function(response){
                    const answerhtml = siftr.parseFromString(response.responseText, "text/html");
                    const answernode = answerhtml.querySelectorAll("script[type='application/ld+json']");
                    const answerjson = JSON.parse(answernode[0].innerHTML);
                    let scriptlist = [];
                    let rating = [];
                    const scripts = answerhtml.querySelectorAll("script");
                    const img = answerhtml.getElementsByClassName("brn-qpage-next-attachments-viewer-image-preview__image")[0];
                    function appendAnswer(answr, rating) {
                        const atr = document.createElement("tr");
                        if (img){
                            atr.innerHTML = `<th>${answr} <a href=${img.src} target="_blank">img</a></th><th>${rating}</th>`;
                        }
                        else {
                            atr.innerHTML = `<th>${answr}</th><th>${rating}</th>`;
                        }
                        fragment.appendChild(atr);
                    }
                    for (var z=0; z < scripts.length; z++) {
                        if (scripts[z].attributes.length == 0) {
                            scriptlist.push(scripts[z])
                    }
                    }
                    for (var c=0; c < scriptlist.length; c++){
                        if (scriptlist[c].text.includes('comments')){
							let stext = scriptlist[c].text;
                            stext = JSON.parse(stext.slice(stext.indexOf('{"author'), stext.lastIndexOf("}")-1))
                            for (var v=0; v < stext.answers.length; v++){
                                rating.push(stext.answers[v].rating)
							    console.log(rating)
                          }
                        break;
                        }
                      }
                    let answrcount = answerjson[0].mainEntity.answerCount;
                    var i=0;
                    if (answerjson[0].mainEntity.acceptedAnswer){
                        let AcceptedAnswer = answerjson[0].mainEntity.acceptedAnswer[0].text;
                        if (img){
                            AcceptedAnswer = `${AcceptedAnswer} <a href=${img.src} target="_blank"></a>`
                        }
                        appendAnswer(AcceptedAnswer, rating[i]);
                        answrcount = answrcount - 1;

                    }
                    if (answerjson[0].mainEntity.suggestedAnswer){
                        for (i; i < answrcount; i++) {
                            appendAnswer(answerjson[0].mainEntity.suggestedAnswer[i].text, rating[i]);
                        }
                    }
                    document.getElementById("results").appendChild(fragment);
                }
            })


        }
    }
    base.innerHTML = menu;
    setTimeout(() => {
        const TargNode = document.getElementsByClassName("sia-input");
        if (TargNode.length == 1) {
            TargNode[0].appendChild(base);
            document.getElementById("addBtn").onclick = addAnswers;
            document.querySelector("button[type='submit']").onclick = q.submit;
            console.log("Menu Injected!")
            q.query();
            let observer = new MutationObserver(()=>{
                document.getElementById("results").innerHTML = '';
                IdList.length = 0;
                u = 0;
                q.query();
            });
            const TargNode2 = document.getElementsByClassName('sia-question-stem')[0];
            observer.observe(TargNode2, {
                childList: true,
                subtree: false
            })
        }
        else {
            console.log("Page didn't load intime, Menu Not Injected!");
        }
    },6000)
    var u = 1;
    const addAnswers = () => {
        if (IdList.length > 0 && u < IdList.length){
            q.getAnswer(IdList[u]);
            u++;
            if (u == IdList.length - 1){
                document.getElementById("addBtn").setAttribute("disabled", "");
                document.getElementById("addBtn").classList.add("noHover");
            }
        }
    }

})();
