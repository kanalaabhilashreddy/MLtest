function switchGame(index) {
            document.querySelectorAll('.game-view').forEach((el, i) => {
                if(i === index) el.classList.add('active');
                else el.classList.remove('active');
            });
            document.querySelectorAll('.tab-btn').forEach((btn, i) => {
                if(i === index) btn.classList.add('active');
                else btn.classList.remove('active');
            });
            g1Active = false;
            g3Active = false;
        }

        const frame = document.getElementById('canvas-frame');
        const avatar = document.getElementById('avatar-node');
        const g1ScoreOut = document.getElementById('g1-score');
        const g1TimerOut = document.getElementById('g1-timer');
        let g1Score = 0, g1TimeLeft = 60, g1Active = false, avX = 0, g1Clock, g1Spawner;

        const posPool = ['Focus', 'Calm', 'Process', 'Execute', 'Reset', 'Flow'];
        const negPool = ['Anxiety', 'Fear', 'Doubt', 'Choke', 'Pressure', 'Distract'];

        frame.addEventListener('mousemove', (e) => {
            if(!g1Active) return;
            const r = frame.getBoundingClientRect();
            let x = e.clientX - r.left - 35;
            if(x < 0) x = 0; if(x > r.width - 70) x = r.width - 70;
            avatar.style.left = x + 'px'; avX = x;
        });

        frame.addEventListener('touchmove', (e) => {
            if(!g1Active) return;
            const r = frame.getBoundingClientRect();
            let x = e.touches.clientX - r.left - 35;
            if(x < 0) x = 0; if(x > r.width - 70) x = r.width - 70;
            avatar.style.left = x + 'px'; avX = x;
        });

        function startG1() {
            g1Score = 0; g1TimeLeft = 60; g1Active = true;
            g1ScoreOut.textContent = g1Score; g1TimerOut.textContent = g1TimeLeft;
            document.getElementById('g1-overlay').classList.add('hidden');
            document.getElementById('g1-end').classList.add('hidden');
            document.querySelectorAll('.node-element').forEach(n => n.remove());

            clearInterval(g1Clock); clearInterval(g1Spawner);
            g1Clock = setInterval(() => {
                g1TimeLeft--; g1TimerOut.textContent = g1TimeLeft;
                if(g1TimeLeft <= 0) stopG1();
            }, 1000);
            g1Spawner = setInterval(spawnNode, 600);
        }

        function spawnNode() {
            if(!g1Active) return;
            const isPos = Math.random() > 0.45;
            const el = document.createElement('div');
            el.className = `node-element ${isPos ? 'node-pos' : 'node-neg'}`;
            el.textContent = isPos ? posPool[Math.floor(Math.random()*posPool.length)] : negPool[Math.floor(Math.random()*negPool.length)];
            let rx = Math.random() * (frame.clientWidth - 80);
            el.style.left = rx + 'px'; el.style.top = '0px';
            frame.appendChild(el);

            let cy = 0, speed = 3.5 + Math.random() * 4;
            function drop() {
                if(!g1Active || !el.parentNode) { el.remove(); return; }
                cy += speed; el.style.top = cy + 'px';
                if(cy >= 340 && cy <= 370) {
                    let lx = parseFloat(el.style.left);
                    if(lx + 60 >= avX && lx <= avX + 70) {
                        g1Score = isPos ? g1Score + 10 : Math.max(0, g1Score - 10);
                        g1ScoreOut.textContent = g1Score; el.remove(); return;
                    }
                }
                if(cy > 400) el.remove(); else requestAnimationFrame(drop);
            }
            requestAnimationFrame(drop);
        }

        function stopG1() {
            g1Active = false; clearInterval(g1Clock); clearInterval(g1Spawner);
            document.getElementById('g1-final').textContent = g1Score;
            document.getElementById('g1-end').classList.remove('hidden');
        }

        const sportData = {
            precision: {
                title: "Precision & Fine Motor Sports",
                items: [
                    "<strong>Primary Focus:</strong> Micro-arousal suppression, gaze alignment fixity, and procedural sequence replication under extreme physiological panic vectors.",
                    "<strong>Neuro Demand:</strong> Slowing respiration mechanics to execute action windows accurately between active cardiovascular beats."
                ]
            },
            court: {
                title: "High-Volume Court Environments",
                items: [
                    "<strong>Primary Focus:</strong> Instant point extraction, deceleration profiling, and high-frequency cognitive focus recovery under mechanical heat strains.",
                    "<strong>Neuro Demand:</strong> Visual target track stabilization to read racquet angles and establish instant strategic response selections."
                ]
            },
            tactical: {
                title: "Strategic Team Frameworks",
                items: [
                    "<strong>Primary Focus:</strong> Collective stress mitigation, situational threat identification, and role preservation parameters across systemic change variables.",
                    "<strong>Neuro Demand:</strong> Rapid team communication loop filtering under highly intense stadium acoustics."
                ]
            }
        };

        function updateSportDemand() {
            const selector = document.getElementById('sport-selector');
            const data = sportData[selector.value];
            let out = `<h3>${data.title}</h3><ul>`;
            data.items.forEach(li => { out += `<li>${li}</li>`; });
            out += `</ul>`;
            document.getElementById('demand-card').innerHTML = out;
        }

        const matrixBox = document.getElementById('schulte-container');
        let g3Target = 1, g3StartClock, g3Active = false, g3Ticker;

        function startG3() {
            g3Target = 1; g3Active = true;
            document.getElementById('g3-target').textContent = g3Target;
            document.getElementById('g3-overlay').classList.add('hidden');
            document.getElementById('g3-end').classList.add('hidden');
            matrixBox.innerHTML = '';
            
            let arr = Array.from({length: 16}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
            arr.forEach(num => {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                cell.textContent = num;
                cell.onclick = () => verifyG3Click(num, cell);
                matrixBox.appendChild(cell);
            });

            g3StartClock = performance.now();
            clearInterval(g3Ticker);
            g3Ticker = setInterval(() => {
                if(!g3Active) return;
                let elapsed = ((performance.now() - g3StartClock) / 1000).toFixed(2);
                document.getElementById('g3-timer').textContent = elapsed;
            }, 30);
        }

        function verifyG3Click(num, element) {
            if(!g3Active) return;
            if(num === g3Target) {
                element.classList.add('success-flash');
                setTimeout(() => element.style.visibility = 'hidden', 150);
                g3Target++;
                if(g3Target > 16) {
                    g3Active = false; clearInterval(g3Ticker);
                    let finalTime = ((performance.now() - g3StartClock) / 1000).toFixed(2);
                    document.getElementById('g3-final').textContent = finalTime;
                    document.getElementById('g3-end').classList.remove('hidden');
                } else {
                    document.getElementById('g3-target').textContent = g3Target;
                }
            }
        }
