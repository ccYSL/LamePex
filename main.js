// ==UserScript==
// @name         Lamepex
// @namespace    https://apexlearning.com/
// @version      2.0
// @description  no need.
// @author       ccccc
// @match        https://course.apexlearning.com/public/activity/*/assessment
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function(){
  const api = 'https://srv-unified-search.external.search-systems-production.z-dn.net/api/v1/us/search'
  const brainly = 'https://brainly.com/question/'
  const lamepex = `<style>@import url('https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@300;400&display=swap');@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@200;400&family=Montserrat+Alternates:wght@300;400&display=swap');:root{--dark:#0e0f10;--darker:#111213;--light:#cfcfcf}.gui{width:25vw;height:335px;min-width:390px;background-color:var(--dark);border-radius:13px}.h{height:fit-content;text-align:center}.t{color:var(--light);font-size:1.5em;font-family:'Montserrat Alternates',sans-serif;user-select:none;padding:5px 41px 7px;margin:5px}.settings{float:right;stroke:var(--light);margin:7px 7px;transition:.5s}.settings:hover{transition:.5s;rotate:25deg;cursor:pointer;stroke:#610000}.flex{display:flex}.fc{flex-direction:column}.fr{flex-direction:row}.jcc{justify-content:center}th{border: solid #610000 2px;color:#cfcfcf;font-family:'JetBrains Mono',monospace;width:1vw;border-radius:6px;background-color:var(--darker)}#menu{max-height:85%;overflow-y:auto;scrollbar-width:thin}tr{max-height:50px}table{width:97%; border-spacing:10px;}.tac{text-align:center}#smenu{display:none;flex-direction:column}.f1{font-family:'Montserrat Alternates',sans-serif;color:var(--light)}.fs1{font-size:large}.fs2{font-size:14px}.gap{gap:5px}.od{width:12.4vw;min-width:190px;height:fit-content;padding:5px;margin:5px;background-color:var(--darker);border-radius:11px}.ob{width:100%;height:30px;border:0;padding:0;background-color:inherit}.ob:hover{cursor:pointer;border:#610000 solid 2px !important}</style><div class="gui"><header class="h"><svg class="settings" id="settings" xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg><h2 class="t">Lamepex</h2></header><div id="menu" class="flex jcc gap"><table><tbody id="mtbody"></tbody></table></div><div id="smenu"><section class="flex fr"><div class="od"><header class="f1 tac fs1 gap">Filtering</header><button class="ob jcc f1 fs2" id="hra">High-Rated Answers Only</button><button class="ob jcc f1 fs2" id="iqp">Include Question Pictures</button><button class="ob jcc f1 fs2" id="fao">Attempt to Filter Answer Out</button></div><div class="od"><header class="f1 tac fs1 gap">Other</header><button class="ob jcc f1 fs2" id="ap">Auto Pilot</button><button class="ob jcc f1 fs2" id="ah">Answer Hightlighting</button><button class="ob jcc f1 fs2" id="qa">Query with Answers</button></div></section><section class="flex fr"><div class="od" style="width:100%!important"><header class="f1 tac fs1 gap2">Credit</header><p class="fs1 f1 tac" style="margin:5px">Made by Ce</p><h2 class="tac" style="margin:7px auto">💯�</h2><p class="tac f1 fs1" style="margin:0">v2.0</p><p class="tac f1 fs1" style="margin:0">c@sanguineparadi.se</p></div></section></div><div></div></div>`
  const base = document.createElement("div");
  base.innerHTML = lamepex;


  let state = {
      smenu: false,
      config: {
          ap: false,
          qa: true,
          ah: true,
          bra: false,
          iqp: false,
          fao: false
      }
  }

  let AA = [];
  let MA = [];
  let matchCount = [];
  const ratingTable = {
    5: 2,
    4: 1.5,
    3: 1,
    2: 0,
    1: -1,
    0: 0.5
  }
  const tools = {
      darkify: ()=>{
          document.querySelector('.sidenav-container').style.backgroundColor = 'rgb(24, 26, 27)'
          document.querySelector('.toolbar').style.backgroundColor = 'rgb(30, 32, 33)'
          document.querySelector('.footer-wrapper').style.backgroundColor = 'rgb(30, 32, 33)'
          document.querySelector('.mat-drawer-container').style.color = 'rgba(232, 230, 227, 0.87)'
          document.querySelector('.sia-question-number').style.color = 'rgba(232, 230, 227, 0.87)'
      },
      apexAnswers: {
          match: (a, rating) => {
              if (a==1){
                const la = matchCount.indexOf(Math.max.apply(null, matchCount));
                console.log(matchCount, la)
                if (state.config.ah){
                  console.log(matchCount)
                  document.querySelectorAll('[id^="sia-multiple-choice-label-"]')[la].style.backgroundColor = 'green';
              }
                  if (state.config.ap){
                    matchCount.every(n => n === 0) ? tools.apexAnswers.rematch() : tools.apexAnswers.ap(la);
                  }
              } else{
                  MA.forEach((e, index) => {
                      if (a.includes(e)){
                        console.log("f1", rating);
                        rating = Number(rating);
                        rating = Math.floor(rating);
                        console.log('r2', rating)
                        console.log(`ratingTa: ${ratingTable[rating]}`)
                        matchCount[index] += ratingTable[rating]
                      }
                      })
              }
          },
          rematch: () => {
            console.log('rematch cuh')
          },
          ap: (i)=>{
              document.querySelectorAll('[id^="sia-multiple-choice-label-"]')[i].click()
              document.querySelector('button[type=submit]').click()
          },

          get: () => {
            document.querySelectorAll('[id^="sia-multiple-choice-label-"]').forEach((e)=>{
              e = e.textContent.slice(2).replace(/[.,'"]/g, "").toLowerCase();
              AA.push(e);
              MA.push(e.replace(/\s/g, ""))
              console.log(MA)
          })
          for (let i=0;i < AA.length; i++){
              matchCount.push(0);
          }
      }},
      query: () => {
          let q = document.querySelector('.sia-question-stem :nth-child(1)').textContent
          tools.apexAnswers.get()
          if (state.config.qa){
              AA.forEach((e) => {
                q += ` ${e}`
              })
          }
          q = q.replace(/(\r\n|\n|\r|['"])/gm, "");
          console.log(q)
          GM.xmlHttpRequest({
              method: 'POST',
              url: api,
              data: `{"query":{"text":"${q}"}}`,
              onload: (r) => {
                  let qids = new Set()
                  r = JSON.parse(r.response)
                  console.log(`{"query":{"text":"${q}"}}`)
                  r.results.forEach(e => {
                  qids.add(e.question.id)
                });
                qids = Array.from(qids);
                tools.getAnswers(qids);
              }
          })
      },
      getAnswers: (qids) => {
        console.log(qids)
          let x=0;
          qids.forEach((i) => {
          GM.xmlHttpRequest({
              method: 'GET',
              url: `${brainly}${i}`,
              onload: (r) => {
                  const parser = new DOMParser();
                  let body = parser.parseFromString(r.response, 'text/html').body;
                  let i = 0
                  body.querySelectorAll('div[data-testid="answer-box-content-text"]').forEach((e) => {
                  let rating = body.querySelectorAll('div[data-testid=answer_box_rating_value]')[i].innerText
                  rating = rating.slice(13)
                  i++;
                  const tr = document.createElement('tr');
                  if (state.config.ah) {
                      tools.apexAnswers.match(e.textContent.replace(/[.,'"\s]/g, "").toLowerCase(), rating);
                  }
                  tr.innerHTML = `<th>${e.textContent} ${rating}</th>`
                  document.getElementById('mtbody').appendChild(tr)
                  })
                  if (x == qids.length-1){
                    console.log("gotcha")
                    tools.apexAnswers.match(1);
                }
                  x++;
              }
            })
        })
      }
  }
  const id = setInterval(()=>{
  if (document.querySelector('.sia-question-stem')) {
  const observer = new MutationObserver(() => {
      document.getElementById('mtbody').innerHTML = '';
      AA = [];
      MA = [];
      matchCount = [];
      tools.query();
    })
  const targ = document.getElementsByClassName('sia-question-stem')[0];
  observer.observe(targ, {
      childList: true,
      subtree: false
    })
  tools.darkify();
  document.querySelector('.sia-input').appendChild(base);
  const settings = document.getElementById('settings');
  const smenu = document.getElementById('smenu');
  const menu = document.getElementById('menu')
  smenu.addEventListener('click', (ev) => {
      if (ev.target.nodeName === 'BUTTON'){
        const e = document.getElementById(ev.target.id);
        state.config[ev.target.id] = !state.config[ev.target.id];
        state.config[ev.target.id] ? e.style.color = '#610000' : e.style.color = 'var(--light)';
      }
    })
    settings.onclick = () => {
        state.smenu ? (state.smenu = false, smenu.style.display = 'none', menu.style.display = '') : (state.smenu = true, smenu.style.display = 'flex', menu.style.display = 'none');
}
  tools.query();
  clearInterval(id);
}
  }, 500)
})();
