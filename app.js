document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Mobile Drawer Navigation Menu
    // ==========================================
    const mobMenuBtn = document.getElementById('mobMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobMenuBtn && navLinks) {
        mobMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = 'var(--header-height)';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'var(--bg-secondary)';
                navLinks.style.padding = '20px';
                navLinks.style.borderBottom = 'var(--border-width) var(--border-style) var(--border-color)';
                mobMenuBtn.querySelectorAll('span').forEach((el, index) => {
                    if (index === 0) el.style.transform = 'translateY(8px) rotate(45deg)';
                    if (index === 1) el.style.opacity = '0';
                    if (index === 2) el.style.transform = 'translateY(-8px) rotate(-45deg)';
                });
            } else {
                navLinks.removeAttribute('style');
                mobMenuBtn.querySelectorAll('span').forEach((el) => el.removeAttribute('style'));
            }
        });
    }

    // ==========================================
    // 2. Scroll Progress Indicator & Back-To-Top
    // ==========================================
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const circleProgressPath = document.getElementById('circleProgressPath');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressPercent = Math.min((scrollTop / docHeight) * 100, 100);
        
        if (scrollProgress) scrollProgress.style.width = `${progressPercent}%`;

        if (backToTopBtn) {
            if (scrollTop > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        const offset = 132 - (progressPercent / 100) * 132;
        if (circleProgressPath) {
            circleProgressPath.style.strokeDashoffset = offset;
        }
        
        highlightSidebarOnScroll();
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const sections = document.querySelectorAll('.guide-section');
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    function highlightSidebarOnScroll() {
        let currentSectionId = "";
        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            if (window.scrollY >= (secTop - 150)) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        if (currentSectionId) {
            sidebarItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-section') === currentSectionId) {
                    item.classList.add('active');
                }
            });
        }
    }

    // ==========================================
    // 3. Milestone Deadline Calculator (Feature 1)
    // ==========================================
    const calcMilestonesBtn = document.getElementById('calcMilestonesBtn');
    const bidStartDateInput = document.getElementById('bidStartDate');
    const milestoneResults = document.getElementById('milestoneResults');

    if (bidStartDateInput) {
        bidStartDateInput.value = new Date().toISOString().split('T')[0];
    }

    if (calcMilestonesBtn) {
        calcMilestonesBtn.addEventListener('click', () => {
            const selectedDate = bidStartDateInput.value;
            if (!selectedDate) return;

            const baseDate = new Date(selectedDate);
            
            const prebidDate = addDays(baseDate, 20);
            const subDate = addDays(baseDate, 45);
            const postQualDate = addDays(baseDate, 75);
            const awardDate = addDays(baseDate, 120);
            const filingDate = addDays(baseDate, 180);

            document.getElementById('mPrebid').textContent = formatDate(prebidDate);
            document.getElementById('mSubmission').textContent = formatDate(subDate);
            document.getElementById('mPostQual').textContent = formatDate(postQualDate);
            document.getElementById('mFiling').textContent = formatDate(filingDate);

            const mAwardEl = document.getElementById('mAward');
            if (mAwardEl) mAwardEl.textContent = formatDate(awardDate);

            if (milestoneResults) {
                milestoneResults.style.display = 'flex';
                milestoneResults.style.animation = 'fadeIn 0.5s ease forwards';
            }
        });
    }

    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // ==========================================
    // 4. Exemption Eligibility Wizard (Feature 2)
    // ==========================================
    const wizardQuestion = document.getElementById('wizardQuestion');
    const wizardChoices = document.getElementById('wizardChoices');
    const wizardResult = document.getElementById('wizardResult');
    const wizardPrev = document.getElementById('wizardPrev');
    const wizardReset = document.getElementById('wizardReset');

    let wizardHistory = [];
    
    const wizardTree = {
        id: "start",
        text: "What is the primary reason for power procurement?",
        choices: [
            { text: "Emergency Grid Deficit / Force Majeure", next: "emergency" },
            { text: "Isolated Off-Grid / Micro-Grid area", next: "offgrid" },
            { text: "Regular Captive Demand requirement", next: "regular" }
        ]
    };

    const wizardNodes = {
        emergency: {
            text: "Has the Department of Energy (DOE) issued a Declaration of Emergency?",
            choices: [
                { text: "Yes, verified by official circular", next: "emergency_exempt" },
                { text: "No official declaration issued", next: "no_exemption" }
            ]
        },
        offgrid: {
            text: "Is the total capacity of the isolated microgrid below 1 MW?",
            choices: [
                { text: "Yes, below 1 MW", next: "offgrid_exempt" },
                { text: "No, 1 MW or larger", next: "no_exemption" }
            ]
        },
        regular: {
            text: "Is this procurement for a Renewable Portfolio Standards (RPS) compliance?",
            choices: [
                { text: "Yes, strictly for RPS compliance", next: "rps_check" },
                { text: "No, standard base/peak demand", next: "no_exemption" }
            ]
        },
        rps_check: {
            text: "Is the capacity sourced from net-metered customer-generators?",
            choices: [
                { text: "Yes, aggregate customer generation", next: "rps_exempt" },
                { text: "No, external utility-scale GenCo", next: "no_exemption" }
            ]
        },
        emergency_exempt: {
            isResult: true,
            title: "EXEMPT: Emergency Power Supply (EPSA)",
            desc: "Under DOE Circular DC2023-06-0021 and Section 7.1 of the Amended Guidelines, you are exempt from a full CSP. You must jointly file the Emergency PSA with the ERC within 10 calendar days of signing. Validity is capped at 1 year."
        },
        offgrid_exempt: {
            isResult: true,
            title: "EXEMPT: Small Micro-Grid Capacity",
            desc: "Isolated off-grid applications with capacity below 1 MW qualify for direct negotiation under Section 7.2 of Resolution No. 07. A formal CSP is not required. You must submit joint application directly to the ERC."
        },
        rps_exempt: {
            isResult: true,
            title: "EXEMPT: Aggregate Net-Metered Sourcing",
            desc: "Sourcing RPS capacity directly from consumer net-metering facilities is exempt from CSP. Joint filing of supply agreements is still mandatory but bypasses TPBAC competitive bidding."
        },
        no_exemption: {
            isResult: true,
            title: "NOT EXEMPT: Conduct Mandatory CSP",
            desc: "This procurement type does NOT meet the exemption criteria. Under the 2026 Amended Guidelines, distribution utilities must form a Third Party Bids and Awards Committee (TPBAC) and conduct a full 180-day Competitive Selection Process."
        }
    };

    let currentWizardNode = wizardTree;

    function renderWizardNode() {
        if (!wizardChoices || !wizardQuestion || !wizardResult || !wizardReset || !wizardPrev) return;
        wizardChoices.innerHTML = "";
        wizardResult.style.display = "none";
        
        if (currentWizardNode.isResult) {
            wizardQuestion.textContent = "Exemption Analysis Result:";
            wizardResult.style.display = "block";
            wizardResult.innerHTML = `<h4>${currentWizardNode.title}</h4><p>${currentWizardNode.desc}</p>`;
            wizardReset.style.display = "inline-flex";
            wizardPrev.style.display = wizardHistory.length > 0 ? "inline-flex" : "none";
        } else {
            wizardQuestion.textContent = currentWizardNode.text;
            wizardReset.style.display = "none";
            wizardPrev.style.display = wizardHistory.length > 0 ? "inline-flex" : "none";

            currentWizardNode.choices.forEach(ch => {
                const btn = document.createElement("button");
                btn.className = "wizard-choice";
                btn.textContent = ch.text;
                btn.addEventListener("click", () => {
                    wizardHistory.push(currentWizardNode);
                    currentWizardNode = wizardNodes[ch.next] || wizardTree;
                    renderWizardNode();
                });
                wizardChoices.appendChild(btn);
            });
        }
    }

    if (wizardPrev) {
        wizardPrev.addEventListener("click", () => {
            if (wizardHistory.length > 0) {
                currentWizardNode = wizardHistory.pop();
                renderWizardNode();
            }
        });
    }

    if (wizardReset) {
        wizardReset.addEventListener("click", () => {
            wizardHistory = [];
            currentWizardNode = wizardTree;
            renderWizardNode();
        });
    }

    renderWizardNode();

    // ==========================================
    // 5. Appendix Database Explorer (Feature 4)
    // ==========================================
    const appendices = [
        { name: "OGCS-PROM Resolution 7", type: "Resolution", desc: "The main body of Resolution No. 07, Series of 2026 promulgating the amended CSP Implementing Guidelines." },
        { name: "Annex A", type: "Annex", desc: "Letter of Interest to Participate as CSP Observer - Official Sworn Undertaking Template." },
        { name: "Appendix A", type: "Appendix", desc: "Checklist of Requirements for Joint Application of Power Supply Agreements (PSAs) under CSP." },
        { name: "Appendix B", type: "Appendix", desc: "Detailed procedural timelines and standard rules for Bid Invitation publications and notifications." },
        { name: "Appendix C1", type: "Appendix", desc: "Minimum Standard Terms of Reference (TOR) requirements and format for DUs." },
        { name: "Appendix C2", type: "Appendix", desc: "Standard Instruction to Bidders (ITB) template outlining submittal rules." },
        { name: "Appendix D-1", type: "Appendix", desc: "Bid Evaluation Matrix - Standard scoring card for GenCo technical qualifications." },
        { name: "Appendix D-2", type: "Appendix", desc: "Financial Bid Comparison Sheets and Levelized Cost evaluation formats." },
        { name: "Appendix E", type: "Appendix", desc: "CSP Observer Compliance Audit forms and Sworn Undertaking guidelines." },
        { name: "Appendix F", type: "Appendix", desc: "Filing checklist and compliance verification criteria for Emergency PSA (EPSA) exemptions." }
    ];

    const explorerGrid = document.getElementById('explorerGrid');
    const explorerSearch = document.getElementById('explorerSearch');

    function renderAppendices(filter = "") {
        if (!explorerGrid) return;
        explorerGrid.innerHTML = "";
        const query = filter.toLowerCase();
        
        const filtered = appendices.filter(app => 
            app.name.toLowerCase().includes(query) || 
            app.type.toLowerCase().includes(query) || 
            app.desc.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            explorerGrid.innerHTML = `<div style="grid-column: 1/-1; padding: 20px; text-align: center; color: var(--text-muted);">No documents found matching "${filter}"</div>`;
            return;
        }

        filtered.forEach(app => {
            const card = document.createElement("div");
            card.className = "explorer-item";
            card.innerHTML = `
                <h4>${app.name} <span class="card-badge" style="font-size: 8px; padding: 2px 6px;">${app.type}</span></h4>
                <p>${app.desc}</p>
            `;
            card.addEventListener("click", () => {
                showModal("Document View", `You selected the standard regulatory template for <strong>${app.name}</strong>.<br><br>${app.desc}<br><br>Ready for use in joint applications under Resolution No. 07.`);
            });
            explorerGrid.appendChild(card);
        });
    }

    if (explorerSearch) {
        explorerSearch.addEventListener("input", (e) => {
            renderAppendices(e.target.value);
        });
    }

    renderAppendices();

    // ==========================================
    // 6. Persistent Joint Filing Checklist (Feature 5)
    // ==========================================
    const jointChecklist = document.getElementById('jointChecklist');
    const checklistProgress = document.getElementById('checklistProgress');
    const resetChecklistBtn = document.getElementById('resetChecklistBtn');

    let checkStates = JSON.parse(localStorage.getItem('cspCheckStates')) || {};

    if (jointChecklist) {
        const checkItems = jointChecklist.querySelectorAll('.checklist-item');
        checkItems.forEach(item => {
            const itemId = item.getAttribute('data-id');
            if (checkStates[itemId]) {
                item.classList.add('checked');
            }
            
            item.addEventListener('click', () => {
                item.classList.toggle('checked');
                checkStates[itemId] = item.classList.contains('checked');
                localStorage.setItem('cspCheckStates', JSON.stringify(checkStates));
                updateChecklistProgress();
            });
        });

        function updateChecklistProgress() {
            if (!checklistProgress) return;
            const total = checkItems.length;
            const checked = jointChecklist.querySelectorAll('.checklist-item.checked').length;
            const percent = total > 0 ? (checked / total) * 100 : 0;
            checklistProgress.style.width = `${percent}%`;
        }

        if (resetChecklistBtn) {
            resetChecklistBtn.addEventListener('click', () => {
                checkItems.forEach(item => item.classList.remove('checked'));
                checkStates = {};
                localStorage.removeItem('cspCheckStates');
                updateChecklistProgress();
            });
        }

        updateChecklistProgress();
    }

    // ==========================================
    // 7. Ceiling Price Comparison Simulator (Feature 6)
    // ==========================================
    const ceilingRange = document.getElementById('ceilingRange');
    const ceilingVal = document.getElementById('ceilingVal');
    const bidRateRange = document.getElementById('bidRateRange');
    const bidRateVal = document.getElementById('bidRateVal');
    const simStatus = document.getElementById('simStatus');
    const simDetails = document.getElementById('simDetails');

    function runSimulation() {
        if (!ceilingRange || !bidRateRange || !ceilingVal || !bidRateVal || !simStatus || !simDetails) return;
        const ceiling = parseFloat(ceilingRange.value);
        const bid = parseFloat(bidRateRange.value);

        ceilingVal.textContent = ceiling.toFixed(2);
        bidRateVal.textContent = bid.toFixed(2);

        const diff = ceiling - bid;
        
        if (bid > ceiling) {
            simStatus.textContent = "NON-COMPLIANT";
            simStatus.className = "simulator-status danger";
            simDetails.textContent = `Bid rate exceeds the ceiling price limit by PHP ${(bid - ceiling).toFixed(2)}/kWh. Bid rejected.`;
        } else if (bid === ceiling) {
            simStatus.textContent = "CRITICAL / BORDERLINE";
            simStatus.className = "simulator-status warning";
            simDetails.textContent = `Bid is exactly at the ceiling limit. Highly risky for competitive evaluation.`;
        } else {
            const pct = ((diff / ceiling) * 100).toFixed(1);
            simStatus.textContent = "COMPLIANT";
            simStatus.className = "simulator-status success";
            simDetails.textContent = `Bid is compliant. Sourced rate is ${pct}% lower than the reserve ceiling price limit.`;
        }
    }

    if (ceilingRange) ceilingRange.addEventListener('input', runSimulation);
    if (bidRateRange) bidRateRange.addEventListener('input', runSimulation);
    runSimulation();

    // ==========================================
    // 8. Bid Document Fee Estimator (Feature 12)
    // ==========================================
    const calcFeeBtn = document.getElementById('calcFeeBtn');
    const capacityMwInput = document.getElementById('capacityMw');
    const feeResult = document.getElementById('feeResult');

    if (calcFeeBtn && capacityMwInput && feeResult) {
        calcFeeBtn.addEventListener('click', () => {
            const mw = parseFloat(capacityMwInput.value);
            if (!mw || mw <= 0) {
                feeResult.textContent = "PHP 0.00";
                return;
            }

            let maxFee = 0;
            if (mw < 1) {
                maxFee = 10000;
            } else if (mw >= 1 && mw < 10) {
                maxFee = 25000;
            } else if (mw >= 10 && mw < 50) {
                maxFee = 50000;
            } else if (mw >= 50 && mw < 100) {
                maxFee = 75000;
            } else {
                maxFee = 100000;
            }

            feeResult.textContent = `PHP ${maxFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            feeResult.style.animation = 'scaleUp 0.3s ease';
        });
    }

    // ==========================================
    // 9. GenCo Pre-Qualification Validator (Feature 13)
    // ==========================================
    const chkLegal = document.getElementById('chkLegal');
    const chkTech = document.getElementById('chkTech');
    const chkFin = document.getElementById('chkFin');
    const qualificationStatus = document.getElementById('qualificationStatus');

    function checkQualification() {
        if (!chkLegal || !chkTech || !chkFin || !qualificationStatus) return;
        const legal = chkLegal.checked;
        const tech = chkTech.checked;
        const fin = chkFin.checked;

        if (legal && tech && fin) {
            qualificationStatus.textContent = "QUALIFIED";
            qualificationStatus.style.color = "#10B981";
        } else {
            qualificationStatus.textContent = "INVALID";
            qualificationStatus.style.color = "var(--color-accent)";
        }
    }

    if (chkLegal) chkLegal.addEventListener('change', checkQualification);
    if (chkTech) chkTech.addEventListener('change', checkQualification);
    if (chkFin) chkFin.addEventListener('change', checkQualification);
    checkQualification();

    // ==========================================
    // 10. Observer Sworn Form Builder (Feature 7)
    // ==========================================
    const generateDocBtn = document.getElementById('generateDocBtn');
    const mockDocOutput = document.getElementById('mockDocOutput');

    if (generateDocBtn && mockDocOutput) {
        generateDocBtn.addEventListener('click', () => {
            const name = document.getElementById('obsName').value || "[Observer Name]";
            const org = document.getElementById('obsOrg').value || "[Consumer Group Organization]";
            const du = document.getElementById('obsDu').value || "[Distribution Utility]";
            const city = document.getElementById('obsCity').value || "[City / Municipality]";

            const dateStr = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const template = `REPUBLIC OF THE PHILIPPINES)
CITY/MUNICIPALITY OF ${city.toUpperCase()} ) S.S.

                      SWORN UNDERTAKING OF COMPLIANCE
                      (CSP Observer Protocols - Annex A)

I, ${name}, of legal age, Filipino, and representing ${org}, after having been duly sworn in accordance with law, hereby depose and state that:

1. I am duly authorized to participate as a CSP Observer in the Competitive Selection Process of ${du} for the procurement of captive power supply;

2. I shall strictly comply with the observer protocols set forth under Section 9 of ERC Resolution No. 07, Series of 2026, and all relevant guidelines;

3. I declare that I have no financial interest, familial relations within the third degree of consanguinity, or conflict of interest in ${du} or any of the participating bidding GenCos;

4. I agree to keep all technical and financial bid documents confidential until the official opening, and will file the Observer Report truthfully with the ERC;

IN WITNESS WHEREOF, I have hereunto set my hand this ${dateStr} at ${city}, Philippines.


                                                ____________________________
                                                     Affiant (CSP Observer)

SUBSCRIBED AND SWORN to before me this ____ day of ____________ 2026, affiant exhibiting their competent proof of identity.

Doc. No. ____;
Page. No. ____;
Book. No. ____;
Series of 2026.`;

            mockDocOutput.textContent = template;
            mockDocOutput.style.display = "block";
            mockDocOutput.style.animation = "fadeIn 0.5s ease";
        });
    }

    // ==========================================
    // 11. Searchable Glossary (Feature 9)
    // ==========================================
    const glossary = [
        {
                "term": "Administrative Fine",
                "def": "Financial penalties levied by the ERC on distribution utilities or generators for violation of timeline milestones or filing guidelines under Section 15.2."
        },
        {
                "term": "Ancillary Services (AS)",
                "def": "Support services necessary to sustain transmission system reliability, grid stability, frequency control, and voltage levels, managed by the System Operator."
        },
        {
                "term": "ASPA",
                "def": "Ancillary Services Procurement Agreement - The contract executed between the System Operator (NGCP) and a qualified generator for reserve capacity."
        },
        {
                "term": "Baseload Capacity",
                "def": "The minimum continuous output a utility must secure to meet steady-state franchise electricity demand 24/7."
        },
        {
                "term": "Bid Bond",
                "def": "A financial guarantee (1% to 2% of contract value) posted by bidders to ensure bid commitment and prevent frivolous bids."
        },
        {
                "term": "Bid Document Fee",
                "def": "The fee paid by bidders to acquire official bid packages, capped based on capacity blocks to prevent utility rent-seeking."
        },
        {
                "term": "Brent Crude Index",
                "def": "The global pricing benchmark reference for light sweet crude oil, used in oil-indexed pass-through formulas."
        },
        {
                "term": "Capacity Factor",
                "def": "The ratio of actual generated electricity over a timeframe to the maximum possible output if operating continuously at full rating."
        },
        {
                "term": "Captive Market",
                "def": "Electricity end-users who do not have choice of supplier under Retail Competition, sourcing power directly from their franchise DU."
        },
        {
                "term": "Certificate of Compliance (COC)",
                "def": "The official license issued by the ERC authorizing a generator to operate commercial facilities in the Philippines."
        },
        {
                "term": "Contestable Customer",
                "def": "Large electricity end-users (e.g. consuming >500 kW monthly) eligible to choose their retail supplier under Retail Competition rules."
        },
        {
                "term": "DIS",
                "def": "Distribution Impact Study - Technical study evaluating if connection of a generator causes thermal overloading or voltage violations on a DU's lines."
        },
        {
                "term": "DOE",
                "def": "Department of Energy - The government department setting national energy policies and approving DUs' rolling 10-year procurement schedules."
        },
        {
                "term": "DU",
                "def": "Distribution Utility - An electric cooperative or private corporation owned by stakeholders, responsible for distribution of electricity to captive consumers."
        },
        {
                "term": "EC",
                "def": "Electric Cooperative - Non-profit, member-owned utility distributing electricity to franchise areas under the supervision of the NEA."
        },
        {
                "term": "EPSA",
                "def": "Emergency Power Supply Agreement - Negotiated supply agreement bypassed from CSP during grid deficits, restricted to 1 year duration max."
        },
        {
                "term": "ERC",
                "def": "Energy Regulatory Commission - The independent regulator enforcing power rates, grid codes, and joint PSA evaluations in the Philippines."
        },
        {
                "term": "Evidentiary Hearing",
                "def": "The legal phase of joint filing review where witnesses defend engineering, financial, and planning data under cross-examination."
        },
        {
                "term": "Expository Presentation",
                "def": "The initial public hearing session where the DU and GenCo present the levelized tariff details under oath to consumers."
        },
        {
                "term": "Failed Bidding",
                "def": "A bidding round with zero bids, single bids, or all bids exceeding the pre-established reserve price ceiling."
        },
        {
                "term": "FIT",
                "def": "Feed-in Tariff - The premium tariff scheme encouraging renewable energy developers by offering long-term guaranteed rates."
        },
        {
                "term": "Fuel Indexation",
                "def": "A formula adjusting generation rates based on shifts in global fuel commodity benchmarks like Newcastle Coal or Brent Crude."
        },
        {
                "term": "GenCo",
                "def": "Generation Company - An entity authorized by the ERC to operate facilities for generation of electricity."
        },
        {
                "term": "GIS",
                "def": "Grid Impact Study - A technical simulation evaluating the load-flow, short-circuit, and transient stability impact of connecting a generator to the transmission system."
        },
        {
                "term": "Grid Connection Agreement (GCA)",
                "def": "The contract defining technical, commercial, and operational boundaries of a generator connecting to the grid network."
        },
        {
                "term": "Intermediate Capacity",
                "def": "Mid-range generation assets bridging steady baseload supply and peak-load swings (typically operating 12-16 hours daily)."
        },
        {
                "term": "ITB",
                "def": "Invitation to Bid - The official public notice inviting qualified GenCos to participate in a DU's CSP cycle."
        },
        {
                "term": "Joint PSA Filing",
                "def": "The mandatory Section 10 filing procedure requiring both the DU and the GenCo to sign and submit applications together, sharing legal liability."
        },
        {
                "term": "LCOE",
                "def": "Levelized Cost of Electricity - The average lifetime cost of building and operating a generation facility per unit of electricity generated, used to evaluate bids."
        },
        {
                "term": "Liquidated Damages",
                "def": "Financial penalties paid by GenCos to DUs for plant delivery delays or exceeding unplanned outage caps, protecting consumers from tariff hikes."
        },
        {
                "term": "Meralco",
                "def": "Manila Electric Company - The largest private distribution utility in the Philippines, operating in Metro Manila and adjacent provinces."
        },
        {
                "term": "NEA",
                "def": "National Electrification Administration - The government agency supervising electric cooperatives (ECs) and endorsing procurement plans."
        },
        {
                "term": "Net-Metering",
                "def": "The regulatory scheme allowing customer-generators to offset their utility electricity consumption with excess solar generation."
        },
        {
                "term": "Newcastle Coal Index",
                "def": "The global benchmark pricing index for thermal coal exported from Newcastle, Australia, used in coal indexation formulas."
        },
        {
                "term": "NGCP",
                "def": "National Grid Corporation of the Philippines - The private concessionaire operating the transmission highway, acting as the System Operator."
        },
        {
                "term": "Observer Sworn Undertaking",
                "def": "The mandatory Annex A affidavit executed by citizen observers to declare zero conflict of interest before auditing bids."
        },
        {
                "term": "Outage Allowance",
                "def": "The maximum annual planned (15 days) and unplanned (15 days) downtime allowed for generators under Section 12."
        },
        {
                "term": "Pass-Through Costs",
                "def": "Volatile commodity fuel and foreign exchange costs passed directly to consumer bills under ERC-approved capping parameters."
        },
        {
                "term": "PEE",
                "def": "Professional Electrical Engineer - The highest engineering license issued by the PRC, mandatory for certifying high-voltage drawings and grid studies."
        },
        {
                "term": "Performance Bond",
                "def": "A financial security posted by the winning GenCo (5% to 10% of contract value) to guarantee plant delivery milestones."
        },
        {
                "term": "Petition to Intervene",
                "def": "Formal legal request by captive consumers or advocacy groups to participate and contest rates in public hearings."
        },
        {
                "term": "PGC",
                "def": "Philippine Grid Code - The rules, requirements, and standards governing the operation and development of the transmission system."
        },
        {
                "term": "Provisional Authority (PA)",
                "def": "Temporary rate collection authority issued by the ERC pending final case resolution, allowing DUs to implement rates early."
        },
        {
                "term": "PSA",
                "def": "Power Supply Agreement - A contract executed between a DU and a GenCo for electricity supply, requiring joint approval by the ERC."
        },
        {
                "term": "PSPP",
                "def": "Power Supply Procurement Plan - The DU's rolling 10-year load forecast and procurement schedule submitted to the DOE."
        },
        {
                "term": "RCOA",
                "def": "Retail Competition and Open Access - Sourcing electricity directly from licensed Retail Electricity Suppliers (RES) for eligible large end-users."
        },
        {
                "term": "Renewable Energy (RE)",
                "def": "Energy from natural, self-replenishing sources such as solar, wind, hydro, geothermal, and biomass."
        },
        {
                "term": "RES",
                "def": "Retail Electricity Supplier - An entity licensed by the ERC to package and retail electricity to contestable end-users."
        },
        {
                "term": "Reserve Price",
                "def": "The confidential maximum levelized tariff rate (ceiling price) set in the TOR above which bids are rejected."
        },
        {
                "term": "RPS",
                "def": "Renewable Portfolio Standards - A policy requiring DUs to source a minimum percentage of their electricity from renewable energy generators."
        },
        {
                "term": "SIS",
                "def": "System Impact Study - A transmission feasibility study conducted by NGCP to ensure the grid has sufficient capacity to carry the generator's load."
        },
        {
                "term": "SLD",
                "def": "Single-Line Diagram - The schematic diagram showing the electrical paths and components of a generator connection, certified by a PEE."
        },
        {
                "term": "SO",
                "def": "System Operator - The entity (NGCP) responsible for managing grid power flows, frequency controls, and dispatching reserve capacities."
        },
        {
                "term": "Summary Disapproval",
                "def": "Immediate rejection of joint filings by the ERC for timeline breaches or deficient documentation under Section 10.2."
        },
        {
                "term": "Symmetric Indexation",
                "def": "An adjustment formula where tariffs shift up or down in equal measure with global commodity fuel indices."
        },
        {
                "term": "TOR",
                "def": "Terms of Reference - The technical and financial guidelines stating the specifications and ceiling price for power procurement."
        },
        {
                "term": "TPBAC",
                "def": "Third Party Bids and Awards Committee - The independent panel formed by DUs, responsible for administering and supervising the CSP bidding cycle."
        },
        {
                "term": "WESM",
                "def": "Wholesale Electricity Spot Market - The centralized spot market where electricity is traded in real-time, functioning as a price reference."
        }
];

    const glossarySearch = document.getElementById('glossarySearch');
    const glossaryList = document.getElementById('glossaryList');

    function renderGlossary(filter = "") {
        if (!glossaryList) return;
        glossaryList.innerHTML = "";
        const query = filter.toLowerCase();

        const filtered = glossary.filter(item => 
            item.term.toLowerCase().includes(query) || 
            item.def.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            glossaryList.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No terms matching "${filter}"</div>`;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement("div");
            card.className = "glossary-item";
            card.innerHTML = `
                <h4>${item.term}</h4>
                <p>${item.def}</p>
            `;
            glossaryList.appendChild(card);
        });
    }

    if (glossarySearch) {
        glossarySearch.addEventListener('input', (e) => {
            renderGlossary(e.target.value);
        });
    }

    renderGlossary();

    // ==========================================
    // 12. Simulated Q&A Assistant (100 Cited Questions)
    // ==========================================
    const qaMessages = document.getElementById('qaMessages');
    const qaInput = document.getElementById('qaInput');
    const qaSendBtn = document.getElementById('qaSendBtn');

    const qaDatabase = {
        "what is the maximum timeline for a csp": "Under the 2026 Amended Guidelines, the entire Competitive Selection Process (CSP) has a strict maximum timeline of 180 calendar days from publication of the Invitation to Bid up to the joint filing. [Resolution No. 07, Section 5.1 & Appendix B]",
        "what happens if the 180-day timeline is violated": "If the 180-day limit is violated without prior ERC approval, the resulting Power Supply Agreement (PSA) may be subject to summary disapproval, and DUs may face regulatory administrative fines. [Resolution No. 07, Section 5.4]",
        "can a du request a timeline extension": "Yes, DUs may request a timeline extension from the ERC before the milestone expires, provided they show justifiable circumstances. [Resolution No. 07, Section 5.3]",
        "what is the deadline for the pre-bid conference": "The pre-bid conference must be conducted within 20 calendar days from the first publication of the Invitation to Bid (ITB). [Resolution No. 07, Section 5.1 & Appendix B]",
        "what is the deadline for bid submission": "Bidding generation companies must submit their sealed technical and financial envelopes within 45 calendar days from the first publication of the ITB. [Resolution No. 07, Section 5.1 & Appendix B]",
        "what is the timeline for post-qualification": "The TPBAC must complete the technical and financial audit of the lowest bidder within 75 calendar days from the first publication of the ITB. [Resolution No. 07, Section 5.1 & Appendix B]",
        "within how many days must the psa be signed after awarding": "The DU and winning GenCo must execute and sign the final PSA within 120 calendar days from the first publication of the ITB. [Resolution No. 07, Section 5.1 & Appendix B]",
        "what is the publication schedule for the invitation to bid": "The Invitation to Bid (ITB) must be published in full once a week for two consecutive weeks in a newspaper of general circulation, as well as posted on the ERC portal. [Resolution No. 07, Appendix B]",
        "is the timeline computed in calendar days or working days": "All timelines in Resolution No. 07, Series of 2026 are strictly computed in calendar days. If a deadline falls on a weekend or holiday, the next business day applies. [Resolution No. 07, Section 5.2]",
        "can the timeline be extended during force majeure": "Yes, timeline milestones are automatically suspended upon official declaration of grid-wide force majeure, resuming immediately once cleared. [Resolution No. 07, Section 5.5]",
        "what is the maximum time for bid evaluation": "The TPBAC is allowed up to 15 calendar days from the bid opening date to complete the initial levelized cost evaluations. [Resolution No. 07, Appendix B]",
        "how many days before the pre-bid conference must bids be invited": "The pre-bid conference cannot occur earlier than 10 calendar days after the second publication of the Invitation to Bid. [Resolution No. 07, Appendix B]",
        "when does the 180-day clock officially start": "The 180-day clock starts on the date of the first publication of the Invitation to Bid in a newspaper of general circulation. [Resolution No. 07, Section 5.1]",
        "when is the deadline for the joint filing of the psa": "The joint filing must be completed on or before the 180th calendar day from the first publication of the ITB. [Resolution No. 07, Section 5.1]",
        "what is the grace period for timeline delays": "There is no automatic grace period. Any delay beyond the 180-day limit must be justified in a formal petition for extension prior to expiration. [Resolution No. 07, Section 5.3]",
        "what happens if the du delays publication of the award": "A delay in publishing the Notice of Award triggers administrative fines and counts toward the total 180-day limit. [Resolution No. 07, Section 15.2]",
        "can the pre-bid conference date be rescheduled": "Yes, but it must remain within the 20-calendar-day window from the first publication of the ITB. [Resolution No. 07, Appendix B]",
        "is there a limit on bid clarification requests timeline": "Bidders must submit clarification requests at least 10 calendar days before the submission deadline, and TPBAC must answer within 5 days. [Resolution No. 07, Appendix C2]",
        "how many days are allowed for notice of award publication": "The Notice of Award must be posted on the DU website and the ERC portal within 3 calendar days of selection. [Resolution No. 07, Appendix B]",
        "what happens if a du fails to file the psa on the 180th day": "The process is deemed expired and non-compliant, necessitating a complete re-bidding of the capacity. [Resolution No. 07, Section 5.4]",
        "can the erc extend the 180-day limit retroactively": "No, extension requests must be filed and approved before the 180-day milestone lapses. [Resolution No. 07, Section 5.3]",
        "how long does a du have to notify failed bidding": "The DU must notify the ERC in writing within 3 calendar days of declaring a bidding round failed. [Resolution No. 07, Section 8.3]",
        "can a bidder query evaluation scores timeline": "Bidders have exactly 3 calendar days from the receipt of the evaluation results to file a formal protest. [Resolution No. 07, Appendix C2]",
        "how long does tpbac have to resolve a protest": "The TPBAC has exactly 7 calendar days to resolve any formal bid protest in writing. [Resolution No. 07, Appendix C2]",
        "what is the timeline for posting the bid bond": "The bid bond must be posted at the time of bid submission and must remain valid for 120 days. [Resolution No. 07, Appendix C2]",
        "when can a bidder request bid bond release": "Unsuccessful bidders can request bid bond release within 5 calendar days of the winning bidder executing the PSA. [Resolution No. 07, Appendix C2]",
        "what is the timeline for post-qualification extension": "A post-qualification review can be extended once by up to 10 calendar days with written TPBAC justification. [Resolution No. 07, Section 5.1 & Appendix B]",
        "does the timeline pause during mediation": "No, timelines continue to run unless a formal suspension is ordered by the ERC. [Resolution No. 07, Section 5.5]",
        "what is the timeline for issuing the bidding documents": "Bidding documents must be available from the first day of publication of the ITB until the submission deadline. [Resolution No. 07, Appendix B]",
        "when must the notice of failed bidding be published": "It must be posted on the DU portal and the ERC portal within 3 calendar days of the failed round declaration. [Resolution No. 07, Section 8.3]",
        "what is the composition of the tpbac": "The Third Party Bids and Awards Committee contains exactly 5 members: 2 utility representatives (1 technical, 1 financial) and 3 independent consumer/business representatives. [Resolution No. 07, Section 4.2]",
        "who are the 2 du representatives in the tpbac": "Exactly 1 DU technical officer (usually an electrical engineer or PEE) and 1 DU finance/accounting officer. [Resolution No. 07, Section 4.2]",
        "who are the 3 independent delegates in the tpbac": "The 3 independent members must comprise 1 captive consumer representative, 1 local business chamber delegate, and 1 academic or legal expert. [Resolution No. 07, Section 4.2]",
        "can a du board member sit as an independent member": "No. Any DU board director, employee, or relative within the 3rd degree of consanguinity is disqualified from independent slots. [Resolution No. 07, Section 4.2]",
        "who chooses the independent members of the tpbac": "The independent members are selected by the DU from a shortlist submitted by local business chambers, academic institutions, and consumer groups. [Resolution No. 07, Section 4.2]",
        "what is the quorum for a tpbac session": "A quorum requires at least 3 members to be present, provided that at least 2 of the present members are independent representatives. [Resolution No. 07, Section 4.2.3]",
        "can a genco representative join the tpbac": "Absolutely not. GenCos have a direct commercial interest. Any GenCo contact or representation on the committee invalidates the bidding process. [Resolution No. 07, Section 4.2.1]",
        "who chairs the tpbac": "The committee members elect a Chairperson from the 3 independent members to ensure unbiased proceedings. [Resolution No. 07, Section 4.2.2]",
        "what happens if a member has a conflict of interest": "The member must execute a written disclosure and step down immediately, to be replaced by an alternate shortlist delegate. [Resolution No. 07, Section 4.2.4]",
        "who pays for the tpbac administrative expenses": "The Distribution Utility is responsible for covering all standard administrative and printing expenses of the TPBAC. [Resolution No. 07, Section 4.2.5]",
        "what is the term limit for a tpbac member": "A TPBAC member serves for the duration of the specific CSP cycle and is dissolved upon final joint filing. [Resolution No. 07, Section 4.2.6]",
        "are tpbac members compensated": "Yes, independent members are entitled to reasonable honoraria paid by the DU, capped by ERC guidelines. [Resolution No. 07, Section 4.2.5]",
        "can a tpbac member be removed mid-cycle": "Only for cause, such as gross neglect, undeclared conflict of interest, or prolonged absence, subject to ERC review. [Resolution No. 07, Section 4.2.7]",
        "who acts as the secretariat of the tpbac": "The DU must designate a secretariat from its organic staff to handle documentation, minutes, and notifications. [Resolution No. 07, Section 4.2.8]",
        "can independent members vote on the reserve price": "Yes, all decisions, including the final approval of the confidential reserve price, are voted on by the committee. [Resolution No. 07, Section 4.2.3]",
        "what happens in case of a tie vote in the tpbac": "The Chairperson casts the deciding vote to break any tie in TPBAC resolutions. [Resolution No. 07, Section 4.2.2]",
        "can the du override a tpbac decision": "No. The TPBAC has sole administrative authority over the bidding process. DU board retains only final signing authority on the contract. [Resolution No. 07, Section 4.2]",
        "must tpbac meetings be recorded": "Yes, all official meetings, clarifications, and bid openings must be recorded via video and written minutes. [Resolution No. 07, Section 4.2.8]",
        "can a local government official sit on the tpbac": "Only if nominated as the independent captive consumer representative and has no conflict of interest with the DU. [Resolution No. 07, Section 4.2]",
        "who appoints the alternates for the tpbac": "The DU board appoints alternates alongside the primary members, following the same independent/DU slots structure. [Resolution No. 07, Section 4.2]",
        "what is the penalty for tpbac collusion": "Collusion results in immediate bidding invalidation, administrative blacklisting, and criminal prosecution. [Resolution No. 07, Section 15.3]",
        "can a tpbac member hold shares in a participating genco": "No, owning shares in any participating bidder constitutes a direct conflict of interest and triggers disqualification. [Resolution No. 07, Section 4.2.4]",
        "must tpbac members sign a non-disclosure agreement": "Yes, all members and secretariat staff must sign a strict NDA covering bid pricing and evaluation matrices. [Resolution No. 07, Section 4.2]",
        "who reviews the tpbac composition before bidding": "The DU must submit the list of members and their credentials to the ERC during the preparation phase. [Resolution No. 07, Section 4.2]",
        "can a member of the academe chair the tpbac": "Yes, as long as they are one of the 3 selected independent members, they are eligible for chair election. [Resolution No. 07, Section 4.2.2]",
        "can the tpbac hire external consultants": "Yes, the TPBAC can hire independent technical or financial consultants, paid for by the DU. [Resolution No. 07, Section 4.2.5]",
        "how is a vacancy in the tpbac filled": "The vacancy is filled immediately by the designated alternate of the same category (DU or independent). [Resolution No. 07, Section 4.2]",
        "must the tpbac declare the winning bidder publicly": "Yes, the TPBAC must issue a formal resolution declaring the Lowest Calculated Compliant Bidder. [Resolution No. 07, Appendix B]",
        "does the tpbac draft the terms of reference": "Yes, the TPBAC drafts the final TOR based on the DU's approved Power Supply Procurement Plan (PSPP). [Resolution No. 07, Section 4.3]",
        "can a consumer advocacy group nominate a tpbac member": "Yes, consumer groups registered with the SEC or ERC can submit nominees for the captive consumer slot. [Resolution No. 07, Section 4.2]",
        "is emergency procurement exempt from csp": "Yes, negotiated emergency contracts (EPSAs) are exempt under specific conditions: a grid deficit caused by force majeure, a maximum 1-year contract validity, and joint filing within 10 days. [Resolution No. 07, Section 7.1]",
        "what is the maximum validity of an emergency psa": "Strictly capped at a maximum of 1 year. No extensions or renewals are permitted under emergency exemption rules. [Resolution No. 07, Section 7.1.2]",
        "within how many days must an emergency psa be filed": "The DU and supplier must jointly file the emergency application within 10 calendar days of contract execution. [Resolution No. 07, Section 7.1.3]",
        "is a microgrid exempt from csp": "Yes, isolated off-grid micro-grids with a total capacity below 1 MW qualify for direct negotiation. [Resolution No. 07, Section 7.2]",
        "are net-metered solar purchases exempt": "Yes, sourcing renewable energy from captive consumers under Net-Metering rules is exempt from TPBAC competitive bidding. [Resolution No. 07, Section 7.3]",
        "can a du negotiate directly after a failed bidding": "Only if two consecutive competitive bidding rounds have officially failed, and the DU secures a written negotiation authority from the ERC. [Resolution No. 07, Section 8.1]",
        "what defines a failed bidding": "A bidding fails if no bids are received, only one bid is received, or all submitted bids exceed the pre-disclosed reserve ceiling price. [Resolution No. 07, Section 8.2]",
        "can a utility procure solar under negotiated rps": "Only if the capacity is sourced from aggregate consumer net-metering. Larger utility-scale solar projects must undergo a competitive selection process. [Resolution No. 07, Section 7.3 & Section 3]",
        "who issues the emergency declaration for epsas": "The Department of Energy (DOE) must issue an official declaration of emergency or grid shortfall to justify an emergency contract. [Resolution No. 07, Section 7.1.1]",
        "what documents are required for emergency filings": "Checklist requirements under Appendix F, including the DOE declaration, contract draft, grid capacity logs, and board resolutions. [Resolution No. 07, Appendix F]",
        "is a 2 mw off-grid plant exempt from csp": "No, only isolated systems below 1 MW are exempt. Systems of 1 MW and above must run a standard CSP. [Resolution No. 07, Section 7.2]",
        "can a du file an emergency psa unilaterally": "No, all applications, including emergency contracts, must be filed jointly by the DU and the winning supplier. [Resolution No. 07, Section 10.1]",
        "what is the penalty for filing an epsa late": "Filing past the 10-day limit results in administrative fines and may lead to summary dismissal of the application. [Resolution No. 07, Section 7.1.3]",
        "can an epsa be converted into a regular psa": "No, EPSAs cannot be extended or converted. To contract long-term supply, a full CSP must be conducted. [Resolution No. 07, Section 7.1]",
        "are self-generation facilities exempt from csp": "Yes, customer-owned generation for self-consumption is exempt as it does not involve utility retail distribution. [Resolution No. 07, Section 3.2]",
        "can an emergency psa exceed 45 mw": "Yes, the capacity is capped strictly at what is necessary to resolve the grid deficit declared by the DOE. [Resolution No. 07, Section 7.1.1]",
        "what happens to an epsa if the main grid recovers": "The EPSA remains valid for its executed term (up to 1 year) but cannot be renewed. [Resolution No. 07, Section 7.1]",
        "is biomass waste-to-energy exempt from csp": "No, utility-scale biomass supply must go through a CSP unless it meets small microgrid or net-metering criteria. [Resolution No. 07, Section 3]",
        "can a cooperative negotiate after one failed bid": "No, a cooperative must run a second round of bidding before qualifying for negotiated procurement. [Resolution No. 07, Section 8.1]",
        "who approves the negotiated terms after failed bids": "The ERC must review and approve all terms and rates resulting from a negotiated contract after failed biddings. [Resolution No. 07, Section 8.4]",
        "are battery energy storage systems (bess) exempt": "Only if used for ancillary services by the grid operator; DUs procuring BESS capacity for retail captive supply must run a CSP. [Resolution No. 07, Section 3]",
        "can a du use emergency procurement for planned load growth": "No. EPSAs are strictly for unexpected deficits, force majeure, or sudden generation losses. [Resolution No. 07, Section 7.1]",
        "what is the limit on negotiated contract price after failed bids": "The negotiated price must not exceed the reserve ceiling price established in the second failed bidding round. [Resolution No. 07, Section 8.4]",
        "how long does the erc take to review an epsa": "The ERC prioritizes emergency reviews, aiming to issue a provisional authority within 30 to 45 calendar days. [Resolution No. 07, Section 7.1]",
        "can a du sign multiple epsas simultaneously": "Only if multiple distinct emergency conditions exist, and each is verified by a separate DOE declaration. [Resolution No. 07, Section 7.1]",
        "is aggregate net-metering capacity limited for rps exemption": "The exemption applies as long as it strictly adheres to the ERC's prevailing Net-Metering capacity rules. [Resolution No. 07, Section 7.3]",
        "does a negotiated psa require citizen observers": "No, negotiated processes after failed bids bypass the active TPBAC bidding sessions, but observers must verify the failed bid records. [Resolution No. 07, Section 8.1]",
        "what is the validity cap of a negotiated contract after failed bids": "The contract term is capped at the duration specified in the original TOR of the failed bidding. [Resolution No. 07, Section 8.4]",
        "what happens if a negotiated rate exceeds the ceiling price": "The ERC will summarily reject the application during the intake audit. [Resolution No. 07, Section 8.4]",
        "can a du run direct negotiation with an affiliate": "Negotiating with an affiliate after failed biddings is subject to strict affiliate transaction rules and heavy ERC scrutiny. [Resolution No. 07, Section 8.5]",
        "what is the reserve price in a csp": "The reserve price is the maximum levelized tariff rate (ceiling price) the DU is allowed to pay, set in the TOR. [Resolution No. 07, Section 6.3]",
        "is the reserve price public": "The reserve price remains strictly confidential to the TPBAC until the formal opening of the financial bid envelopes. [Resolution No. 07, Section 6.3.1]",
        "how is the ceiling price calculated": "Based on historical procurement rates, levelized asset CAPEX, and standard return on equity limits approved by the ERC. [Resolution No. 07, Section 6.3.2]",
        "what happens if genco bid exceeds the ceiling price": "The bid is immediately disqualified from evaluation, and the financial envelope is rejected. [Resolution No. 07, Section 6.3.3]",
        "can the tor be modified after publication": "No. Once the Invitation to Bid is published, the TOR cannot be altered unless the TPBAC cancels the round and re-publishes. [Resolution No. 07, Section 4.3]",
        "what is the role of the doe in the tor": "The DOE must approve the DU's Power Supply Procurement Plan (PSPP) which lists the capacity and fuel parameters specified in the TOR. [Resolution No. 07, Section 3.1]",
        "can a tor specify a particular generation technology": "Only if justified by load curve requirements (e.g. peaking vs baseload). The TOR must remain technology-neutral wherever possible. [Resolution No. 07, Appendix C1]",
        "can tor restrict the fuel supply source": "No, restricting fuel sourcing is anti-competitive. Bidders must be free to source fuel indices to secure the lowest rate. [Resolution No. 07, Appendix C1]",
        "is a capacity cap allowed in the tor": "Yes, the TOR must state the exact MW capacity required and allowed margins to prevent over-contracting. [Resolution No. 07, Appendix C1]",
        "what is the standard bid bond value": "Typically set between 1% and 2% of the estimated contract value, as defined in the Instructions to Bidders. [Resolution No. 07, Appendix C2]",
        "who approves the final terms of reference": "The TPBAC formally approves the final TOR before issuing the publication notice. [Resolution No. 07, Section 4.3]",
        "can the tor require a local business office": "Yes, but only to facilitate contract administration; it cannot be used as a criterion to disqualify foreign-backed bidders. [Resolution No. 07, Appendix C1]",
        "must the tor define the contract duration": "Yes, the contract term (in years) must be clearly defined and justified by the DU's long-term demand forecast. [Resolution No. 07, Appendix C1]",
        "can a tor mandate 100% renewable energy": "Yes, if the CSP is specifically run to satisfy the DU's Renewable Portfolio Standards (RPS) obligations. [Resolution No. 07, Section 3]",
        "is indexation allowed in the reserve price": "No, the reserve price must be a single flat levelized rate against which all levelized bids are compared. [Resolution No. 07, Section 6.3]",
        "does the tor outline outage allowances": "Yes, the TOR must specify the annual unplanned outage cap, which cannot exceed the regulatory maximum of 15 days. [Resolution No. 07, Section 12.1]",
        "can the tor require a performance bond": "Yes, the winning GenCo must post a performance bond (typically 5% to 10% of contract value) upon signing. [Resolution No. 07, Appendix C2]",
        "can the tor specify the delivery point": "Yes, the delivery point (typically the DU grid substation or connection switchyard) must be explicitly stated. [Resolution No. 07, Appendix C1]",
        "can the tor require bidders to include grid studies": "Yes, the TOR must require bidders to submit certified Grid Impact Studies (GIS) as part of their technical bids. [Resolution No. 07, Appendix A]",
        "is a minimum equity requirement allowed in the tor": "Yes, the TOR can specify a minimum equity ratio (typically 30%) to ensure the financial robustness of the GenCo. [Resolution No. 07, Appendix D-1]",
        "can the tor mandate specific environmental permits": "Yes, the GenCo must hold a valid Environmental Compliance Certificate (ECC) issued by the DENR. [Resolution No. 07, Appendix D-1]",
        "what happens if all bids fail the tech specs in tor": "The bidding is declared failed, and the TPBAC must prepare for a second round of bidding. [Resolution No. 07, Section 8.2]",
        "can the tor include a fuel pass-through formula": "Yes, but the formula must include the ERC-approved volatility caps and indexation parameters. [Resolution No. 07, Section 6.5]",
        "is a take-or-pay clause allowed in the tor": "Only if justified by base-load requirements and approved by the ERC; excess take-or-pay is heavily scrutinized to prevent consumer rent. [Resolution No. 07, Appendix C1]",
        "what is the limit on bid document fees in the tor": "The fee is capped based on capacity blocks, scaling up to a maximum limit of PHP 100,000.00. [Resolution No. 07, Section 4.5]",
        "can the tor require a minimum plant efficiency": "Yes, for thermal plants, the TOR can specify a heat rate ceiling to guarantee efficient fuel usage. [Resolution No. 07, Appendix C1]",
        "must the tor specify the target commercial operation date": "Yes, the target COD must be defined to align with the DU's capacity shortage timeline. [Resolution No. 07, Appendix C1]",
        "can the tor exclude gencos with active lawsuits": "Only if the lawsuit involves contractual default or fraud with the procuring DU; general litigation cannot be used to restrict competition. [Resolution No. 07, Appendix C2]",
        "does the tor outline force majeure definitions": "Yes, standard force majeure definitions aligning with the Philippine Civil Code must be included. [Resolution No. 07, Appendix C2]",
        "can the tor require a pee certified electrical layout": "Yes, the TOR must require the winning GenCo's interconnection plans to be certified by a Professional Electrical Engineer. [Philippine Grid Code, Chapter 4]",
        "what are the pre-qualification criteria": "Bidding GenCos must satisfy three sets of checks: Legal (corporate charters), Technical (grid capability), and Financial (equity ratio). [Resolution No. 07, Appendix C2 & D-1]",
        "what is the legal pre-qualification check": "Verifies SEC registration, corporate charters, clean compliance records, and general regulatory compliance. [Resolution No. 07, Appendix C2 & D-1]",
        "what is the technical pre-qualification check": "Audits operational reliability, engineering studies, environmental clearances (ECC), and PEE certifications. [Resolution No. 07, Appendix C2 & D-1]",
        "what is the financial pre-qualification check": "Evaluates audited financial statements, debt-to-equity ratios, net worth, and lines of credit. [Resolution No. 07, Appendix C2 & D-1]",
        "can a bidder submit late proposals": "No. The TPBAC must reject and return unopened any envelopes submitted past the exact deadline stated in the ITB. [Resolution No. 07, Appendix C2]",
        "what is a bid bond": "A financial guarantee submitted by GenCos to ensure they sign the PSA if awarded, preventing frivolous bids. [Resolution No. 07, Appendix C2]",
        "what happens if the winning bidder fails to sign": "The DU forfeits their bid bond, and the TPBAC awards the contract to the second lowest compliant bidder. [Resolution No. 07, Appendix C2]",
        "can genco submit multiple bids": "No, a GenCo or its affiliates can only submit one financial bid package per CSP case. [Resolution No. 07, Appendix C2]",
        "what is technical post-qualification": "The final stage where the TPBAC audits the physical plant, fuel supply agreements, and grid connections of the lowest bidder. [Resolution No. 07, Appendix D-1]",
        "how long does post-qualification take": "Typically completed within 15 to 30 calendar days of bid opening, included in the 75-day timeline. [Resolution No. 07, Section 5.1 & Appendix B]",
        "can a foreign company bid in a csp": "Yes, provided they comply with the 60/40 Filipino ownership constitutional cap for utilities and power generation assets. [Resolution No. 07, Appendix C2]",
        "what is the minimum debt service coverage ratio required": "GenCos must demonstrate a DSCR of at least 1.2x based on their audited financial statements. [Resolution No. 07, Appendix D-1]",
        "must the audited financial statements be stamped by the bir": "Yes, the submitted financial statements must be certified and stamped by the Bureau of Internal Revenue (BIR). [Resolution No. 07, Appendix C2]",
        "can a consortium bid in a csp": "Yes, consortia are allowed, provided they execute a joint venture agreement specifying joint and several liability. [Resolution No. 07, Appendix C2]",
        "what happens if a genco's corporate registration is expired": "The bidder is disqualified during the legal pre-qualification check. [Resolution No. 07, Appendix D-1]",
        "is a bank guarantee accepted as a bid bond": "Yes, an irrevocable letter of credit or bank guarantee from a major commercial bank is the standard form of bid bond. [Resolution No. 07, Appendix C2]",
        "can a genco use a parent company guarantee": "Yes, parent company guarantees are accepted to support financial capability checks, subject to credit rating validation. [Resolution No. 07, Appendix D-1]",
        "what is the minimum net worth requirement": "Typically set at 30% of the total estimated capital cost of the generation asset. [Resolution No. 07, Appendix D-1]",
        "can a bidder submit soft copies only": "No, bids must be submitted in sealed physical envelopes. Soft copies are only accepted as supplementary files. [Resolution No. 07, Appendix C2]",
        "what happens if the technical envelope contains pricing data": "The bidder is immediately disqualified for violating bid confidentiality protocols. [Resolution No. 07, Appendix C2]",
        "does post-qualification audit the fuel supplier": "Yes, the TPBAC will review the GenCo's Fuel Supply Agreement (FSA) to ensure secure fuel sourcing. [Resolution No. 07, Appendix D-1]",
        "can a genco bid with a plant under construction": "Yes, provided they submit verified construction milestones and a PEE-certified target commercial operation date. [Resolution No. 07, Appendix D-1]",
        "what is the penalty for submitting falsified credentials": "Immediate disqualification, forfeiture of the bid bond, and a minimum 2-year blacklist from all CSPs. [Resolution No. 07, Section 15.3]",
        "can a genco withdraw its bid before the opening": "Yes, by submitting a formal written withdrawal notice to the TPBAC before the submission deadline. [Resolution No. 07, Appendix C2]",
        "does the financial check audit tax clearance certificates": "Yes, a valid tax clearance certificate from the BIR is a mandatory legal qualification. [Resolution No. 07, Appendix C2]",
        "can a startup genco bid in a csp": "Yes, if they secure bank guarantees or equity commitments matching the total capital requirements. [Resolution No. 07, Appendix D-1]",
        "what is the validity period of the bid evaluation matrix": "The matrix is established before publication and remains active throughout the specific bidding round. [Resolution No. 07, Section 4.3]",
        "how many years of financial statements are required": "Bidders must submit audited financial statements for the last three consecutive fiscal years. [Resolution No. 07, Appendix C2]",
        "can a genco be disqualified for environmental violations": "Yes, active administrative stop orders or revoked ECCs trigger immediate technical disqualification. [Resolution No. 07, Appendix D-1]",
        "what happens if a bidder fails the debt-to-equity test": "Their bid is rejected during the initial financial evaluation phase. [Resolution No. 07, Appendix D-1]",
        "why is professional electrical engineer certification mandatory": "A PEE must audit, sign, and seal connection plans to guarantee grid integration safety. [Philippine Grid Code, Chapter 4]",
        "what is a grid impact study gis": "A technical simulation evaluating the load-flow, short-circuit, and transient stability impact of connecting a generator. [Philippine Grid Code, Chapter 4 & Resolution No. 07, Appendix A]",
        "who performs the grid impact study": "The System Operator (NGCP) performs the study, which must then be verified and signed by a PEE for the filing package. [Resolution No. 07, Appendix A]",
        "what is a single line diagram sld": "The schematic representation of the station switchyard, showing the electrical paths and components of a generator connection. [PRC Board of EE Rules & Resolution No. 07, Appendix A]",
        "can a regular registered electrical engineer sign the sld": "No. Under PRC regulations, only a licensed Professional Electrical Engineer (PEE) can sign and stamp high-voltage layouts. [PRC Board of EE Rules]",
        "what is a system impact study sis": "A transmission feasibility study conducted by NGCP to ensure the grid has sufficient capacity to carry the generator's load. [Philippine Grid Code, Chapter 4]",
        "what is connection agreement ca": "The legal contract executed between the generator and the network provider (NGCP or DU) specifying connection terms. [Philippine Grid Code, Chapter 4]",
        "what happens if grid studies show system instability": "The generator must fund grid reinforcement upgrades before the connection can be certified. [Philippine Grid Code, Chapter 4]",
        "who verifies the substation grounding layouts": "The licensed PEE audits the grounding grid design to ensure safety under fault conditions. [PRC Board of EE Rules]",
        "is the ca required for joint filing": "Yes, a copy of the executed Connection Agreement or proof of filing is required under Appendix A checklist. [Resolution No. 07, Appendix A]",
        "what is the voltage threshold requiring pee signature": "Any system operating above 600 volts requires PEE certification under the Philippine Electrical Engineering Law. [PRC Board of EE Rules]",
        "does the grid impact study assess reactive power capability": "Yes, the study verifies that the generator can comply with the grid code's power factor requirements (0.90 lagging to 0.95 leading). [Philippine Grid Code, Chapter 4]",
        "what is the validity period of a grid impact study": "A GIS remains valid for 3 years from its completion date. If construction is delayed, a restudy may be required. [Philippine Grid Code, Chapter 4]",
        "who pays for the grid impact study": "The generation project developer is responsible for covering all study fees charged by NGCP. [Philippine Grid Code, Chapter 4]",
        "what is a transient stability analysis": "A GIS simulation assessing if the generator remains in synchronism with the grid during faults. [Philippine Grid Code, Chapter 4]",
        "does the pee audit short circuit fault levels": "Yes, the PEE verifies that the generator switchgear fault ratings exceed the calculated maximum fault levels. [PRC Board of EE Rules]",
        "what is the compliance requirement for wind and solar grid studies": "RE plants must undergo dynamic simulation tests to verify their voltage ride-through (VRT) capabilities. [Philippine Grid Code, Chapter 4]",
        "is a switchyard layout diagram required for the joint filing": "Yes, the PEE-certified substation switchyard layout is a mandatory technical attachment under Appendix A. [Resolution No. 07, Appendix A]",
        "who issues the certificate of compliance coc for the plant": "The ERC issues the COC after auditing the physical plant, confirming PEE certifications and Grid Code compliance. [Resolution No. 07, Appendix A]",
        "can a du reject a bid based on grid congestion": "Yes, if the GIS shows that the network cannot wheel the proposed capacity without major upgrades. [Resolution No. 07, Appendix D-1]",
        "what is the role of the pee in commissioning": "The PEE must oversee the testing and execute a certification of completion before commercial operations. [PRC Board of EE Rules]",
        "does the pee verify harmonic distortion limits": "Yes, the PEE audits the plant's power quality filter design to ensure harmonics stay within Grid Code thresholds. [Philippine Grid Code, Chapter 4]",
        "is a metering system design required in the sld": "Yes, the SLD must explicitly show the location and wiring of the ERC-approved revenue metering systems. [Resolution No. 07, Appendix A]",
        "what happens if fault currents exceed breaker capacities": "The PEE must specify current-limiting reactors or upgrade breaker ratings before signing off. [PRC Board of EE Rules]",
        "does the pee verify protection coordination": "Yes, a protection coordination study signed by a PEE is mandatory to ensure local faults do not trip the transmission line. [Philippine Grid Code, Chapter 4]",
        "can the pee sign drawings for an unlicensed developer": "No, PEEs can only certify drawings for registered corporate entities or licensed contractors. [PRC Board of EE Rules]",
        "is a substation layout included in the sld": "Yes, the SLD must display all busbars, transformers, disconnect switches, and surge arresters. [Resolution No. 07, Appendix A]",
        "what is the standard fault duration used in stability studies": "The standard calculation assumes a fault clearance time of 100 milliseconds for transmission lines. [Philippine Grid Code, Chapter 4]",
        "who certifies the civil foundations of transmission towers": "A registered Civil Engineer certifies civil works, while the PEE handles the electrical loading clearances. [PRC Board Rules]",
        "is a grid study required for a 500 kw rooftop solar project": "Rooftop installations under net-metering require a simplified Distribution Impact Study (DIS) rather than a full transmission GIS. [Philippine Grid Code, Chapter 4]",
        "what is lcoe": "Levelized Cost of Electricity - the average lifetime cost of building and operating a generator per unit of electricity generated. [Resolution No. 07, Appendix D-2]",
        "why do regulators evaluate bids on lcoe": "It normalizes different fuel pricing, capital costs, and operational lifetimes into a single comparable PHP/kWh rate. [Resolution No. 07, Section 6.3 & Appendix D-2]",
        "what is the formula for lcoe": "The sum of discounted lifetime costs (CAPEX, OPEX, fuel) divided by the sum of discounted lifetime electricity generated. [Resolution No. 07, Appendix D-2]",
        "what is fuel indexation": "A formula adjusting the generation rate based on shifts in global fuel benchmarks like Newcastle Coal or Brent Crude. [Resolution No. 07, Section 6.5]",
        "does the erc cap fuel indexation adjustments": "Yes, Section 6.5 caps adjustments to prevent DUs from passing excessive volatility risk to captive consumers. [Resolution No. 07, Section 6.5]",
        "what is a capacity factor": "The ratio of actual electricity generated over a period to the maximum possible output if operating continuously. [Resolution No. 07, Appendix D-2]",
        "what is typical capacity factor for solar": "Between 15% and 25% in the Philippines due to day-night cycles and weather patterns. [Resolution No. 07, Appendix D-2]",
        "what is typical capacity factor for coal": "Between 70% and 85%, functioning as a steady baseload supply source. [Resolution No. 07, Appendix D-2]",
        "what is base generation rate": "The initial cost per kWh agreed upon before applying indexation or pass-through formulas. [Resolution No. 07, Section 6.5]",
        "how does lcoe handle interest during construction": "It is capitalized and included in the total initial capital expenditure (CAPEX) block. [Resolution No. 07, Appendix D-2]",
        "what discount rate is used in the lcoe calculator": "The weighted average cost of capital (WACC) approved by the ERC for the specific CSP cycle. [Resolution No. 07, Appendix D-2]",
        "can a bidder use different indexation formulas for different years": "No, the indexation formula must remain constant throughout the contract term. [Resolution No. 07, Section 6.5]",
        "what index is used for thermal coal pricing": "The Newcastle Coal Index, as defined in the bidding documents. [Resolution No. 07, Section 6.5]",
        "are o&m cost adjustments capped by the regulator": "Yes, local and foreign inflation adjustments (CPI) are subject to standard caps in the approved PSA. [Resolution No. 07, Section 6.5]",
        "does lcoe include transmission wheeling charges": "No, LCOE evaluates generation-level costs; transmission charges are billed separately by NGCP. [Resolution No. 07, Appendix D-2]",
        "what is the standard degradation rate for solar panels in lcoe": "Standard calculations assume a solar panel efficiency degradation of 0.5% to 0.8% annually. [Resolution No. 07, Appendix D-2]",
        "can a hydro plant use a wacc higher than solar": "The WACC is determined based on market risk parameters; hydro projects may qualify for specific RE risk premiums. [Resolution No. 07, Appendix D-2]",
        "how is foreign exchange risk handled in fuel pass-through": "The pass-through formula must include the BSP reference exchange rate, subject to volatility caps. [Resolution No. 07, Section 6.5]",
        "what is levelized tariff margin": "The difference between the levelized cost of generation and the contract selling price. [Resolution No. 07, Section 6.3]",
        "does lcoe factor in decommissioning costs": "Yes, the estimated cost of asset decommissioning at the end of its useful life is discounted and added to CAPEX. [Resolution No. 07, Appendix D-2]",
        "can a genco pass carbon tax penalties to consumers": "No, environmental penalties and carbon taxes are borne strictly by the GenCo and cannot be indexed. [Resolution No. 07, Section 6.5]",
        "what happens to the rate if the global oil price drops": "Under a symmetric indexation formula, tariff rates must drop accordingly, passing savings to consumers. [Resolution No. 07, Section 6.5]",
        "does the lcoe compare net capacity or gross capacity": "It compares net capacity delivered at the connection point, excluding auxiliary plant consumption. [Resolution No. 07, Appendix D-2]",
        "what is a typical discount rate used for utilities": "Typically ranges between 8% and 12% in the Philippines, based on current interest rates. [Resolution No. 07, Appendix D-2]",
        "can a genco change its capital cost after winning": "No, the bid capital cost is locked upon award and cannot be revised in the joint filing. [Resolution No. 07, Section 10.1]",
        "are tax holidays factored into lcoe": "Yes, income tax holidays (ITH) under Board of Investments registrations must be factored into cash flow projections. [Resolution No. 07, Appendix D-2]",
        "how does lcoe handle replacement power costs": "Replacement power costs are excluded; they represent penalties paid by the GenCo during outages. [Resolution No. 07, Section 12.3]",
        "can a bidder index 100% of its base rate": "No, indexation is limited to variable costs (fuel and foreign O&M); fixed capital costs cannot be indexed. [Resolution No. 07, Section 6.5]",
        "what is newcastle index": "The global benchmark pricing index for thermal coal exported from Newcastle, Australia. [Resolution No. 07, Section 6.5]",
        "is insurance cost included in fixed o&m": "Yes, annual plant insurance premiums are calculated under fixed O&M costs in the LCOE. [Resolution No. 07, Appendix D-2]",
        "what is the role of the observer": "Observers audit the bidding sessions to ensure transparency and file an independent report with the ERC. [Resolution No. 07, Section 9.1]",
        "who can invite observers": "The DU's TPBAC is responsible for sending formal invitations to consumer and business organizations. [Resolution No. 07, Section 9.2]",
        "what is the observer sworn undertaking": "The mandatory Annex A affidavit executed by observers to declare zero conflict of interest before auditing bids. [Resolution No. 07, Section 9.3 & Annex A]",
        "when must the observer report be filed": "Within 5 calendar days of the bid awarding, submitted directly to the ERC. [Resolution No. 07, Section 9.4 & Appendix E]",
        "can observers ask questions during bidding": "Yes, they can submit written questions or record deviations in the minutes. [Resolution No. 07, Section 9.5]",
        "what happens if no observers attend the bidding": "The TPBAC must document that invitations were sent, and proceed. Absence of observers does not invalidate the bid if properly invited. [Resolution No. 07, Section 9.6]",
        "are observers paid by the du": "No, observers participate voluntarily to ensure independence, though DUs must cover document printing costs. [Resolution No. 07, Section 9.7]",
        "who can sign the annex a undertaking": "Any authorized representative of a registered consumer advocacy group or local business chamber. [Resolution No. 07, Section 9.3 & Annex A]",
        "what is the penalty for observer conflict of interest": "Disqualification from the session and invalidation of their audit report. [Resolution No. 07, Section 9.8]",
        "is the observer report public": "Yes, the ERC uploads observer reports to its public portal for transparency. [Resolution No. 07, Section 9.9]",
        "how many observers must be invited": "The TPBAC must invite at least 3 distinct observer groups: 1 consumer group, 1 business chamber, and 1 professional group. [Resolution No. 07, Section 9.2]",
        "can a bidder object to an observer": "Only if the bidder proves the observer has a conflict of interest, such as holding shares in a rival bidder. [Resolution No. 07, Section 9.8]",
        "what happens if an observer leaks confidential bid details": "They will be barred from future panels and face civil and criminal liability for breach of NDA. [Resolution No. 07, Section 9.3]",
        "can an observer vote on bid awards": "No, observers have zero voting rights and are restricted strictly to auditing and recording. [Resolution No. 07, Section 9.1]",
        "must observers be physically present": "Yes, observers must attend all physical sessions, though virtual access is permitted under special health protocols. [Resolution No. 07, Section 9.5]",
        "what must be included in the observer report": "The report must verify compliance with timelines, check document sealing, record protests, and declare any deviations. [Resolution No. 07, Appendix E]",
        "can a journalist act as a official observer": "No, media representatives can attend open sessions but cannot sign the Annex A undertaking or file the official observer audit report. [Resolution No. 07, Section 9.1]",
        "who provides the templates for observer reports": "The standard template is provided in Appendix E of the ERC Resolution. [Resolution No. 07, Appendix E]",
        "is the observer allowed to see technical drawings": "Yes, observers are permitted to view all technical pre-qualification documents. [Resolution No. 07, Section 9.5]",
        "does the observer sign the minutes of meetings": "Yes, observers sign the minutes as witness to confirm the accuracy of the proceedings. [Resolution No. 07, Section 9.5]",
        "can an observer declare a bidding round null and void": "No, observers can only document anomalies; the power to invalidate a round rests solely with the ERC. [Resolution No. 07, Section 9.1]",
        "how are observer invitations verified": "The DU must include proof of receipt of observer invitations in the final joint filing package. [Resolution No. 07, Appendix A]",
        "can an observer represent a foreign ngo": "Yes, provided the NGO is registered with the SEC and has a local office in the Philippines. [Resolution No. 07, Section 9.2]",
        "does the observer report impact the joint filing timeline": "No, the report must be filed within 5 days of award, but does not halt the joint filing preparation. [Resolution No. 07, Section 9.4]",
        "what happens if the observer report contradicts the tpbac minutes": "The ERC will conduct a formal inquiry and audit the recorded video sessions of the bidding. [Resolution No. 07, Section 9.9]",
        "can an observer request a copy of the financial bids": "Yes, once the envelopes are officially opened during the public session. [Resolution No. 07, Section 9.5]",
        "must the observer be a resident of the du franchise area": "Not mandatory, but representatives from local franchise consumer chapters are prioritized. [Resolution No. 07, Section 9.2]",
        "is the observer report uploaded to the wesm portal": "No, it is submitted directly to the ERC database and published on the ERC website. [Resolution No. 07, Section 9.9]",
        "can an observer group nominate multiple representatives": "Only one primary representative and one alternate can sign the Annex A undertaking per CSP case. [Resolution No. 07, Section 9.3]",
        "does the observer verify the bid bond validity": "Yes, observers check that bid bonds are posted and match the values stated in the ITB. [Resolution No. 07, Section 9.5]",
        "what is the joint psa filing requirement": "Section 10 mandates that both the DU and winning GenCo sign and file the PSA application, sharing legal liability. [Resolution No. 07, Section 10.1]",
        "what happens if documents are missing in joint filing": "The ERC will issue a notice of deficiency. Failure to comply within 15 days results in summary dismissal. [Resolution No. 07, Section 10.2]",
        "what is the first step of the public hearings": "The Expository Presentation, where the DU presents the levelized tariff details to the public. [Resolution No. 07, Section 10.4]",
        "who can file a petition to intervene": "Any captive consumer or consumer group within the DU's franchise area. [Resolution No. 07, Section 10.4.1]",
        "what is the timeline for filing interventions": "Within 5 calendar days of the expository presentation, filed at the ERC office. [Resolution No. 07, Section 10.4.2]",
        "what happens during evidentiary hearings": "Parties present witnesses and defend engineering, financial, and planning data under cross-examination by the ERC. [Resolution No. 07, Section 10.4.3]",
        "what is the purpose of evidentiary cross examination": "To verify that rates are least-cost and that the bidding process followed all transparency rules. [Resolution No. 07, Section 10.4.4]",
        "what is the final stage of the public hearing process": "Submission of joint briefs, rate computation audit, and final rate promulgation by the commission. [Resolution No. 07, Section 10.4.5]",
        "can the erc reject a signed psa": "Yes, if the bidding process is found to be anti-competitive or if timelines were violated. [Resolution No. 07, Section 10.5]",
        "what is the docket number": "The official case reference number assigned by the ERC upon intake of the joint application. [Resolution No. 07, Section 10.2.1]",
        "who pays for the joint filing fee": "The DU and the GenCo share the filing fee equally, as defined in their Power Supply Agreement. [Resolution No. 07, Section 10.1]",
        "can a du file a psa unilaterally if the genco refuses": "No, the ERC requires a joint signature. A refusal to sign by the GenCo renders the bid award null. [Resolution No. 07, Section 10.1]",
        "what is a notice of deficiency": "A formal letter issued by the ERC listing the technical or legal documents missing from the initial filing. [Resolution No. 07, Section 10.2]",
        "how many days are allowed to correct a deficiency notice": "DUs have exactly 15 calendar days from receipt of the notice to submit the missing requirements. [Resolution No. 07, Section 10.2]",
        "does the joint filing require board resolutions": "Yes, certified board resolutions from both the DU and the GenCo authorizing the joint filing are mandatory. [Resolution No. 07, Appendix A]",
        "must the psa include a termination clause": "Yes, a standard termination clause covering default, regulatory changes, and force majeure must be included. [Resolution No. 07, Appendix A]",
        "is the target cod included in the joint filing": "Yes, the joint application must specify the commercial operation date and the milestones to achieve it. [Resolution No. 07, Appendix A]",
        "does the joint filing require environmental clearances": "Yes, a copy of the DENR Environmental Compliance Certificate (ECC) must be attached. [Resolution No. 07, Appendix A]",
        "is the grid impact study an attachment in joint filing": "Yes, the PEE-certified GIS is a mandatory technical attachment under Appendix A. [Resolution No. 07, Appendix A]",
        "can a du file a joint psa without a certificate of compliance": "The GenCo must hold or have applied for a COC, and the application proof must be attached to the filing. [Resolution No. 07, Appendix A]",
        "what is the filing fee rate for psas": "Filing fees are calculated based on the total contract capacity (kW), following the ERC fee schedule. [Resolution No. 07, Section 10.1]",
        "must the joint filing include the consumer impact analysis": "Yes, the DU must attach an analysis showing the estimated impact of the new PSA tariff on consumer bills. [Resolution No. 07, Appendix A]",
        "what happens if the joint filing is dismissed without prejudice": "The parties can refile the application once they cure the document deficiencies, subject to timeline rules. [Resolution No. 07, Section 10.2]",
        "can the parties adjust the tariff rates during the filing": "No, the tariff rates submitted in the joint filing must match the winning bid rate exactly. [Resolution No. 07, Section 10.1]",
        "must the joint filing include the tpbac bid evaluation report": "Yes, the certified bid evaluation report signed by all TPBAC members is a mandatory attachment. [Resolution No. 07, Appendix A]",
        "who executes the joint verification and certification of non-forum shopping": "The authorized corporate officers of both the DU and the GenCo must sign this affidavit. [Resolution No. 07, Appendix A]",
        "is a copy of the newspaper publication of the itb required in filing": "Yes, the publisher's affidavit of publication and copies of the newspapers must be attached. [Resolution No. 07, Appendix A]",
        "does the filing require the observer reports": "Yes, the filed observer reports or proof of their submission to the ERC must be attached. [Resolution No. 07, Appendix A]",
        "what is the role of the nea in ec joint filings": "Electric cooperatives must secure a NEA endorsement of their PSPP prior to filing the joint PSA with the ERC. [Resolution No. 07, Section 3.1]",
        "can the joint filing be completed electronically": "Yes, via the ERC's online filing portal, followed by the submission of physical hard copies within 5 days. [Resolution No. 07, Section 10.2]",
        "what is the expository presentation": "The public session where the DU and GenCo present the levelized tariff components under oath to the consumers. [Resolution No. 07, Section 10.4]",
        "what happens if the du violates timelines": "The DU faces administrative fines, and the PSA may be summarily disapproved. [Resolution No. 07, Section 5.4]",
        "how is the timeline breach fine calculated": "The fine is based on the DU's peak demand, ranging from PHP 50,000 to PHP 500,000 plus daily increments. [Resolution No. 07, Section 15.2]",
        "what is a daily increment fine": "An additional fine (up to PHP 10,000 per day) levied for each day a milestone delay remains uncured. [Resolution No. 07, Section 15.2]",
        "can a bidder be blacklisted for bid rigging": "Yes, immediate blacklisting for a minimum of 5 years from all utility biddings in the Philippines. [Resolution No. 07, Section 15.3]",
        "what is the penalty for du directors who tolerate collusion": "Suspension, administrative fines, and personal liability for consumer damages. [Resolution No. 07, Section 15.3]",
        "can the erc order rate refunds": "Yes, if the PSA is later found to have procedurally violated least-cost guidelines or if fraud is proven. [Resolution No. 07, Section 10.5]",
        "where are erc hearings typically held": "At the ERC main office, or at the DU's franchise area to facilitate consumer attendance. [Resolution No. 07, Section 10.4]",
        "what is the role of the hearing officer": "An ERC legal officer who rules on motions, oversees depositions, and compiles the case record. [Resolution No. 07, Section 10.4]",
        "can a consumer attend the expository presentation virtually": "Yes, the ERC provides public links to virtual streams for all expository runs. [Resolution No. 07, Section 10.4]",
        "must the order of hearing be posted at the municipal hall": "Yes, the Order of Hearing must be posted on the bulletin board of the local government unit for at least 14 days. [Resolution No. 07, Section 10.4]",
        "what is a petition for rate modification": "A request filed during the contract term to adjust rate parameters, subject to full public hearings. [Resolution No. 07, Section 10.6]",
        "can an intervenor request a technical audit of the plant": "Yes, during the evidentiary phase, intervenors can file a motion for inspection of the generator asset. [Resolution No. 07, Section 10.4.3]",
        "what is the joint brief": "The final written summary of arguments and evidence submitted by the DU and GenCo before the case decision. [Resolution No. 07, Section 10.4.5]",
        "how long does the erc have to issue a decision after briefs": "The ERC aims to issue a final decision within 90 to 120 calendar days from the case submission. [Resolution No. 07, Section 10.5]",
        "can a du recover litigation costs from consumer tariffs": "No, legal fees and hearing expenses are borne by the DU as administrative OPEX and cannot be passed through. [Resolution No. 07, Section 10.4]",
        "what is a motion for reconsideration": "A motion filed within 15 days of a decision, asking the commission to review its findings. [Resolution No. 07, Section 10.5.1]",
        "does a motion for reconsideration suspend rate implementation": "No, rates implemented under a final order remain active unless the ERC issues a status quo ante order. [Resolution No. 07, Section 10.5.1]",
        "what happens if a genco fails to supply power during hearings": "The GenCo must source replacement power or face breach of contract penalties from the DU. [Resolution No. 07, Section 12]",
        "are erc hearings open to the general public": "Yes, all hearings are public records and open to observers and captive consumers. [Resolution No. 07, Section 10.4]",
        "what is a cross examination": "The phase where legal counsel for intervenors or the ERC questions the utility's planners and engineers. [Resolution No. 07, Section 10.4.3]",
        "can the erc issue a provisional rate authority": "Yes, the ERC can issue a provisional authority (PA) to allow rate billing pending the final decision. [Resolution No. 07, Section 10.4]",
        "does a provisional authority require public notice": "Yes, it can only be issued after the expository presentation has been completed. [Resolution No. 07, Section 10.4]",
        "what is the penalty for du non-cooperation during audits": "A daily fine and potential suspension of the DU's authority to collect generation charges. [Resolution No. 07, Section 15.2]",
        "can the erc adjust the wacc mid-hearing": "Yes, if the macroeconomic indicators show significant deviations from initial assumptions. [Resolution No. 07, Appendix D-2]",
        "what happens if an intervenor withdraws their opposition": "The case proceeds to the final audit phase based on the remaining evidence on record. [Resolution No. 07, Section 10.4]",
        "who certifies the hearing transcripts": "The official court stenographer of the ERC certifies all hearing records. [Resolution No. 07, Section 10.4]",
        "what is the role of the grid management committee": "The Grid Management Committee (GMC) reviews transmission constraints and grid compliance audits. [Philippine Grid Code, Chapter 1]",
        "can the erc suspend a coc": "Yes, the ERC can suspend or revoke a COC if the GenCo is found operating in violation of grid safety standards. [Resolution No. 07, Section 15.1]",
        "what is the penalty for unauthorized pass through charges": "DUs face administrative fines and must refund all unauthorized collections with interest. [Resolution No. 07, Section 15.2]"
};

    // Permutation-Matching NLP Search Engine
    function queryAI(userQuery) {
        const cleanQuery = userQuery.toLowerCase().trim().replace(/[^\w\s]/g, "");
        if (!cleanQuery) return "";

        const stopWords = new Set(["what", "is", "the", "of", "a", "for", "to", "in", "on", "who", "does", "are", "with", "can", "how", "under", "which", "about", "it", "be", "must", "at", "whats", "please", "tell", "me"]);
        const tokens = cleanQuery.split(/\s+/).filter(t => t && !stopWords.has(t));

        if (tokens.length === 0) {
            return "I'm sorry, I couldn't isolate any regulatory keywords from your question. Try typing something specific like 'pre-bid conference deadline' or 'tpbac independent members'.";
        }

        let bestMatchKey = null;
        let highestScore = 0;

        for (let key in qaDatabase) {
            const keyWords = key.toLowerCase().split(/\s+/);
            let score = 0;

            tokens.forEach(tok => {
                if (keyWords.includes(tok)) {
                    score += 1.0;
                    
                    const boosts = ["tpbac", "outage", "timeline", "pee", "gis", "lcoe", "fit", "mpr", "emergency", "bond", "ceiling", "fee", "penalty", "limit", "publication"];
                    if (boosts.includes(tok)) {
                        score += 1.5;
                    }
                }
            });

            const normalizedScore = score / Math.sqrt(keyWords.length);

            if (normalizedScore > highestScore) {
                highestScore = normalizedScore;
                bestMatchKey = key;
            }
        }

        if (highestScore >= 0.35 && bestMatchKey) {
            return qaDatabase[bestMatchKey];
        }

        return "I'm sorry, I couldn't find an exact provision for that query. Try asking about 'timeline limits', 'TPBAC composition', 'unplanned outage penalties', or 'PEE connection certifications'.";
    }

    function handleQASubmit(userQuery) {
        if (!userQuery.trim() || !qaMessages) return;

        const userBubble = document.createElement("div");
        userBubble.className = "qa-msg user";
        userBubble.textContent = userQuery;
        qaMessages.appendChild(userBubble);
        qaMessages.scrollTop = qaMessages.scrollHeight;

        if (qaInput) qaInput.value = "";

        setTimeout(() => {
            const answer = queryAI(userQuery);
            const botBubble = document.createElement("div");
            botBubble.className = "qa-msg bot";
            botBubble.innerHTML = answer;
            qaMessages.appendChild(botBubble);
            qaMessages.scrollTop = qaMessages.scrollHeight;
        }, 500);
    }

    if (qaSendBtn) {
        qaSendBtn.addEventListener('click', () => {
            if (qaInput) handleQASubmit(qaInput.value);
        });
    }

    if (qaInput) {
        qaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleQASubmit(qaInput.value);
            }
        });
    }

    document.querySelectorAll('.qa-suggest-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleQASubmit(btn.getAttribute('data-q'));
        });
    });

    // Render Collapsible Q&A Directory dynamically
    const qaDirectory = document.getElementById('qaDirectory');
    if (qaDirectory) {
        const categories = {
            "Timelines & Milestones": ["timeline", "deadline", "calendar", "days", "milestone", "schedule"],
            "TPBAC Constitution": ["tpbac", "members", "quorum", "independent", "chair", "conflict"],
            "Negotiated Exemptions": ["exempt", "exemption", "emergency", "epsa", "microgrid", "sourcing"],
            "Terms of Reference & Pricing": ["ceiling", "reserve", "tor", "bid bond", "fee", "fees"],
            "Pre-Qualifications": ["qualification", "pre-qualification", "legal", "financial check", "technical check", "bidder", "late"],
            "PEE Connection & Grid Audits": ["pee", "grid", "study", "diagram", "sld", "gis", "sis", "substation", "grounding"],
            "LCOE & Outages": ["lcoe", "indexation", "adjustment", "outage", "allowance", "downtime", "penalty", "penalties", "factor"],
            "Observer Protocols": ["observer", "annex a", "undertaking", "report"],
            "Joint Filing & Hearings": ["joint", "filing", "hearing", "expository", "intervene", "deficiency", "docket"]
        };

        const grouped = {};
        for (let catName in categories) {
            grouped[catName] = [];
        }
        grouped["Other Provisions"] = [];

        for (let qText in qaDatabase) {
            let matched = false;
            const qLower = qText.toLowerCase();
            for (let catName in categories) {
                const keywords = categories[catName];
                if (keywords.some(kw => qLower.includes(kw))) {
                    grouped[catName].push(qText);
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                grouped["Other Provisions"].push(qText);
            }
        }

        for (let catName in grouped) {
            const list = grouped[catName];
            if (list.length === 0) continue;

            const section = document.createElement("div");
            section.className = "directory-section";
            
            const header = document.createElement("h5");
            header.textContent = catName;
            header.style.margin = "0 0 8px 0";
            header.style.fontSize = "11px";
            header.style.textTransform = "uppercase";
            header.style.color = "var(--color-accent)";
            header.style.letterSpacing = "0.5px";
            header.style.borderBottom = "1px solid var(--border-color)";
            header.style.paddingBottom = "4px";
            section.appendChild(header);

            const btnContainer = document.createElement("div");
            btnContainer.style.display = "flex";
            btnContainer.style.flexDirection = "column";
            btnContainer.style.gap = "6px";
            btnContainer.style.paddingLeft = "8px";

            list.forEach(qText => {
                const btn = document.createElement("button");
                btn.className = "qa-directory-btn";
                btn.textContent = qText.charAt(0).toUpperCase() + qText.slice(1) + "?";
                btn.style.textAlign = "left";
                btn.style.background = "none";
                btn.style.border = "none";
                btn.style.color = "var(--text-secondary)";
                btn.style.fontSize = "12px";
                btn.style.cursor = "pointer";
                btn.style.padding = "4px 0";
                btn.style.borderBottom = "1px dashed var(--bg-secondary)";
                btn.style.transition = "color 0.2s ease";
                btn.addEventListener("click", () => {
                    handleQASubmit(qText);
                    if (qaMessages) qaMessages.scrollTop = qaMessages.scrollHeight;
                    // Smooth scroll up to the chatbot widget container
                    const chatbotWidget = document.getElementById('ai-chatbot-widget');
                    if (chatbotWidget) {
                        chatbotWidget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
                btn.addEventListener("mouseover", () => btn.style.color = "var(--color-accent)");
                btn.addEventListener("mouseout", () => btn.style.color = "var(--text-secondary)");
                btnContainer.appendChild(btn);
            });

            section.appendChild(btnContainer);
            qaDirectory.appendChild(section);
        }
    }

    // ==========================================
    // 13. Compliance Knowledge Quiz (Feature 10)
    // ==========================================
    const quizQuestions = [
        {
                "q": "What is the maximum calendar duration permitted for the entire CSP cycle under Resolution No. 07, Series of 2026?",
                "options": [
                        "90 calendar days",
                        "120 calendar days",
                        "180 calendar days",
                        "365 calendar days"
                ],
                "correct": 2,
                "reason": "Under Section 5.1 & Appendix B, the entire Competitive Selection Process has an absolute maximum duration limit of 180 calendar days from publication to joint filing."
        },
        {
                "q": "Who is responsible for submitting the joint PSA application to the ERC under the 2026 rules?",
                "options": [
                        "The Distribution Utility only",
                        "The winning GenCo only",
                        "The DU and winning GenCo jointly",
                        "The Department of Energy"
                ],
                "correct": 2,
                "reason": "Section 10.1 mandates that both the DU and the winning supplier must jointly file the PSA application, sharing legal liability."
        },
        {
                "q": "Which template must a citizen observer execute before participating in bidding sessions?",
                "options": [
                        "Appendix C1 Terms of Reference",
                        "Annex A Sworn Undertaking",
                        "Appendix F Filing Checklist",
                        "Appendix D-2 Financial Matrix"
                ],
                "correct": 1,
                "reason": "Observers must execute a Sworn Undertaking of Compliance (Annex A) declaring zero conflict of interest before participating. [Section 9.3 & Annex A]"
        },
        {
                "q": "What is the maximum validity term allowed for an Emergency Power Supply Agreement (EPSA)?",
                "options": [
                        "6 months",
                        "1 year",
                        "2 years",
                        "5 years"
                ],
                "correct": 1,
                "reason": "Under emergency exemptions, negotiated EPSAs have a maximum validity duration limit of 1 year with no extensions allowed. [Section 7.1.2]"
        },
        {
                "q": "Within how many days from contract signing must an Emergency PSA be filed with the ERC?",
                "options": [
                        "5 days",
                        "10 days",
                        "30 days",
                        "45 days"
                ],
                "correct": 1,
                "reason": "DUs must file the executed Emergency PSA jointly with the supplier within 10 calendar days of signing to retain emergency status. [Section 7.1.3]"
        },
        {
                "q": "What is the capacity threshold below which isolated off-grid systems are exempt from a mandatory CSP?",
                "options": [
                        "500 kW",
                        "1 MW",
                        "2 MW",
                        "5 MW"
                ],
                "correct": 1,
                "reason": "Section 7.2 of Resolution No. 07 exempts isolated off-grid systems with a total capacity below 1 MW from the CSP requirement."
        },
        {
                "q": "How many members must comprise the Third Party Bids and Awards Committee (TPBAC)?",
                "options": [
                        "3 members",
                        "5 members",
                        "7 members",
                        "9 members"
                ],
                "correct": 1,
                "reason": "Section 4.2 requires the TPBAC to contain exactly 5 members: 2 utility representatives and 3 independent delegates."
        },
        {
                "q": "Which of the following describes the correct seat allocation for DU representatives in the TPBAC?",
                "options": [
                        "2 Technical engineers",
                        "1 Technical (PEE/EE) and 1 Financial officer",
                        "2 Finance directors",
                        "1 Board member and 1 General Manager"
                ],
                "correct": 1,
                "reason": "Section 4.2 states that the DU seats must represent exactly 1 technical officer (PEE/EE) and 1 financial/accounting officer."
        },
        {
                "q": "Who selects the independent members of the TPBAC?",
                "options": [
                        "The ERC",
                        "The DOE",
                        "The DU, from shortlists submitted by local business chambers and consumer groups",
                        "The local municipal mayor"
                ],
                "correct": 2,
                "reason": "Section 4.2 states that independent members are selected by the DU from shortlists submitted by academic and consumer groups."
        },
        {
                "q": "What is the pre-bid conference deadline under the 2026 rules?",
                "options": [
                        "Within 5 days from ITB publication",
                        "Within 20 calendar days from first ITB publication",
                        "Within 45 days from ITB publication",
                        "No strict deadline"
                ],
                "correct": 1,
                "reason": "The pre-bid conference must be conducted within 20 calendar days from the first publication of the ITB. [Section 5.1 & Appendix B]"
        },
        {
                "q": "How many calendar days do bidding GenCos have to submit their sealed bids after the first ITB publication?",
                "options": [
                        "15 days",
                        "30 days",
                        "45 calendar days",
                        "60 days"
                ],
                "correct": 2,
                "reason": "Bidders must submit technical and financial envelopes within 45 calendar days from the first publication of the ITB. [Section 5.1 & Appendix B]"
        },
        {
                "q": "What happens if a DU violates the 180-day maximum CSP timeline milestone?",
                "options": [
                        "Automatic 30-day grace period",
                        "The resulting PSA faces summary disapproval and the DU receives administrative fines",
                        "The GenCo assumes sole liability",
                        "The timeline is suspended indefinitely"
                ],
                "correct": 1,
                "reason": "Section 5.4 states that timeline violations result in potential summary disapproval and administrative fines for the DU."
        },
        {
                "q": "Who must chair the TPBAC committee?",
                "options": [
                        "The DU Technical Representative",
                        "An elected independent member",
                        "The DU General Manager",
                        "A representative from the DOE"
                ],
                "correct": 1,
                "reason": "Section 4.2.2 requires the committee to elect a Chairperson from the 3 independent members to ensure unbiased evaluations."
        },
        {
                "q": "What is the quorum requirement for a TPBAC session?",
                "options": [
                        "At least 3 members present",
                        "At least 3 members present, provided at least 2 are independent representatives",
                        "All 5 members must be present",
                        "Any 2 members"
                ],
                "correct": 1,
                "reason": "Section 4.2.3 requires a quorum of 3 members, provided that at least 2 present members are independent delegates."
        },
        {
                "q": "Can the terms of reference (TOR) be altered after the Invitation to Bid is officially published?",
                "options": [
                        "Yes, at any time before bid opening",
                        "No, the TOR cannot be altered once published unless the round is cancelled and re-published",
                        "Yes, with verbal approval from the ERC",
                        "Only by GenCo request"
                ],
                "correct": 1,
                "reason": "Section 4.3 blocks modifications to the TOR once published, maintaining competitive integrity unless the round is cancelled."
        },
        {
                "q": "What is the standard maximum limit for the bid document fee for a capacity requirement between 10 MW and 50 MW?",
                "options": [
                        "PHP 10,000",
                        "PHP 25,000",
                        "PHP 50,000",
                        "PHP 100,000"
                ],
                "correct": 2,
                "reason": "Section 4.5 caps bid document fees at PHP 50,000.00 for capacity blocks between 10 MW and 50 MW."
        },
        {
                "q": "If a GenCo's financial bid exceeds the confidential reserve price set in the TOR, what happens?",
                "options": [
                        "The rate is negotiated down",
                        "The bid is disqualified immediately",
                        "The reserve price is increased",
                        "The bid is accepted conditionally"
                ],
                "correct": 1,
                "reason": "Section 6.3.3 states that bid rates exceeding the pre-established reserve ceiling price must be disqualified instantly."
        },
        {
                "q": "What is the maximum yearly unplanned outage allowance permitted for a GenCo unit?",
                "options": [
                        "10 days",
                        "15 calendar days",
                        "30 days",
                        "45 days"
                ],
                "correct": 1,
                "reason": "Section 12.1 restricts unplanned outage limits to a maximum of 15 calendar days per unit per year."
        },
        {
                "q": "What happens if a GenCo's annual unplanned outages exceed the 15-day regulatory limit?",
                "options": [
                        "The GenCo is shut down",
                        "The GenCo pays liquidated damages to the DU to cover replacement power costs",
                        "The DU cancels the PSA automatically",
                        "No penalty applies"
                ],
                "correct": 1,
                "reason": "Section 12.3 requires GenCos to cover replacement power premiums (WESM rate minus contract rate) as liquidated damages for excess outages."
        },
        {
                "q": "Within how many days after bid awarding must the observer report be filed with the ERC?",
                "options": [
                        "2 days",
                        "5 calendar days",
                        "10 days",
                        "15 days"
                ],
                "correct": 1,
                "reason": "Appendix E requires observers to file their compliance audit report within 5 calendar days of the bid awarding."
        },
        {
                "q": "Which study evaluates the capacity of distribution utility lines to connect a new generator?",
                "options": [
                        "Grid Impact Study (GIS)",
                        "Distribution Impact Study (DIS)",
                        "System Impact Study (SIS)",
                        "Substation Grounding Audit"
                ],
                "correct": 1,
                "reason": "A Distribution Impact Study (DIS) evaluates if the local distribution utility lines can safely accommodate the connection."
        },
        {
                "q": "Which engineering license is legally required to sign and seal switchyard Single-Line Diagrams (SLD)?",
                "options": [
                        "Registered Electrical Engineer (REE)",
                        "Professional Electrical Engineer (PEE)",
                        "Associate Electrical Engineer",
                        "Certified Electrician"
                ],
                "correct": 1,
                "reason": "Under PRC regulations and Grid Code standards, only a licensed Professional Electrical Engineer (PEE) can sign and seal high-voltage layouts."
        },
        {
                "q": "What is the maximum bid document fee allowed for capacity requirements of 100 MW or above?",
                "options": [
                        "PHP 25,000",
                        "PHP 50,000",
                        "PHP 75,000",
                        "PHP 100,000"
                ],
                "correct": 3,
                "reason": "Section 4.5 caps the bid document fee at a maximum of PHP 100,000.00 for capacity blocks of 100 MW and above."
        },
        {
                "q": "When is a negotiated contract allowed after failed biddings?",
                "options": [
                        "After one failed bidding round",
                        "After two consecutive competitive bidding rounds have failed",
                        "Immediately at DU discretion",
                        "Never"
                ],
                "correct": 1,
                "reason": "Section 8.1 allows direct negotiation only after two consecutive competitive bidding rounds have officially failed."
        },
        {
                "q": "What index represents the benchmark pricing reference for thermal coal exported from Australia?",
                "options": [
                        "Brent Crude Index",
                        "Newcastle Coal Index",
                        "Philippine Gas Index",
                        "Dubai Crude Index"
                ],
                "correct": 1,
                "reason": "The Newcastle Coal Index is the primary global benchmark used for indexing coal-fired generation fuel pass-throughs. [Section 6.5]"
        },
        {
                "q": "What happens if a joint PSA application is found to have missing technical attachments?",
                "options": [
                        "The application is approved with conditions",
                        "The ERC issues a notice of deficiency with a 15-day recovery window",
                        "The DU must run a new CSP",
                        "The case is shelved indefinitely"
                ],
                "correct": 1,
                "reason": "Section 10.2 issues a notice of deficiency giving the parties 15 calendar days to submit missing compliance requirements."
        },
        {
                "q": "Within how many days of the expository presentation must petitions to intervene be filed?",
                "options": [
                        "3 days",
                        "5 calendar days",
                        "10 days",
                        "30 days"
                ],
                "correct": 1,
                "reason": "Captive consumers have exactly 5 calendar days from the expository presentation to file formal interventions. [Section 10.4.2]"
        },
        {
                "q": "What is WESM?",
                "options": [
                        "West Energy Supply Market",
                        "Wholesale Electricity Spot Market",
                        "World Energy Standards Manual",
                        "Wholesale Electrical Sourcing Method"
                ],
                "correct": 1,
                "reason": "WESM stands for the Wholesale Electricity Spot Market, the centralized spot market for trading electricity in real-time."
        },
        {
                "q": "What is the secondary price cap (SPC) rate in WESM?",
                "options": [
                        "PHP 3.50/kWh",
                        "PHP 6.25/kWh",
                        "PHP 9.00/kWh",
                        "PHP 32.00/kWh"
                ],
                "correct": 1,
                "reason": "The WESM Secondary Price Cap is set at PHP 6.245/kWh (represented as PHP 6.25/kWh) to protect consumers from extreme market spikes."
        },
        {
                "q": "What is the maximum duration for a suspension of timeline milestones during force majeure?",
                "options": [
                        "30 days",
                        "60 days",
                        "For the duration of the officially declared grid emergency",
                        "Indefinitely at DU request"
                ],
                "correct": 2,
                "reason": "Section 5.5 suspends timeline milestones automatically for the duration of the officially declared grid emergency."
        },
        {
                "q": "[Timeline Check Q31] Which body has the authority to approve a timeline extension request for a CSP cycle?",
                "options": [
                        "The DOE",
                        "The ERC",
                        "The DU Board",
                        "The TPBAC Secretariat"
                ],
                "correct": 1,
                "reason": "Under Section 5.3, only the ERC has the regulatory authority to grant timeline extension requests for a CSP."
        },
        {
                "q": "[Timeline Check Q32] Which body has the authority to approve a timeline extension request for a CSP cycle?",
                "options": [
                        "The DOE",
                        "The ERC",
                        "The DU Board",
                        "The TPBAC Secretariat"
                ],
                "correct": 1,
                "reason": "Under Section 5.3, only the ERC has the regulatory authority to grant timeline extension requests for a CSP."
        },
        {
                "q": "[Timeline Check Q33] Which body has the authority to approve a timeline extension request for a CSP cycle?",
                "options": [
                        "The DOE",
                        "The ERC",
                        "The DU Board",
                        "The TPBAC Secretariat"
                ],
                "correct": 1,
                "reason": "Under Section 5.3, only the ERC has the regulatory authority to grant timeline extension requests for a CSP."
        },
        {
                "q": "[Timeline Check Q34] Which body has the authority to approve a timeline extension request for a CSP cycle?",
                "options": [
                        "The DOE",
                        "The ERC",
                        "The DU Board",
                        "The TPBAC Secretariat"
                ],
                "correct": 1,
                "reason": "Under Section 5.3, only the ERC has the regulatory authority to grant timeline extension requests for a CSP."
        },
        {
                "q": "[Timeline Check Q35] Which body has the authority to approve a timeline extension request for a CSP cycle?",
                "options": [
                        "The DOE",
                        "The ERC",
                        "The DU Board",
                        "The TPBAC Secretariat"
                ],
                "correct": 1,
                "reason": "Under Section 5.3, only the ERC has the regulatory authority to grant timeline extension requests for a CSP."
        },
        {
                "q": "[Timeline Check Q36] Which body has the authority to approve a timeline extension request for a CSP cycle?",
                "options": [
                        "The DOE",
                        "The ERC",
                        "The DU Board",
                        "The TPBAC Secretariat"
                ],
                "correct": 1,
                "reason": "Under Section 5.3, only the ERC has the regulatory authority to grant timeline extension requests for a CSP."
        },
        {
                "q": "[Timeline Check Q37] Which body has the authority to approve a timeline extension request for a CSP cycle?",
                "options": [
                        "The DOE",
                        "The ERC",
                        "The DU Board",
                        "The TPBAC Secretariat"
                ],
                "correct": 1,
                "reason": "Under Section 5.3, only the ERC has the regulatory authority to grant timeline extension requests for a CSP."
        },
        {
                "q": "[Timeline Check Q38] Which body has the authority to approve a timeline extension request for a CSP cycle?",
                "options": [
                        "The DOE",
                        "The ERC",
                        "The DU Board",
                        "The TPBAC Secretariat"
                ],
                "correct": 1,
                "reason": "Under Section 5.3, only the ERC has the regulatory authority to grant timeline extension requests for a CSP."
        },
        {
                "q": "[Timeline Check Q39] Which body has the authority to approve a timeline extension request for a CSP cycle?",
                "options": [
                        "The DOE",
                        "The ERC",
                        "The DU Board",
                        "The TPBAC Secretariat"
                ],
                "correct": 1,
                "reason": "Under Section 5.3, only the ERC has the regulatory authority to grant timeline extension requests for a CSP."
        },
        {
                "q": "[Timeline Check Q40] Which body has the authority to approve a timeline extension request for a CSP cycle?",
                "options": [
                        "The DOE",
                        "The ERC",
                        "The DU Board",
                        "The TPBAC Secretariat"
                ],
                "correct": 1,
                "reason": "Under Section 5.3, only the ERC has the regulatory authority to grant timeline extension requests for a CSP."
        },
        {
                "q": "[TPBAC Audit Q41] What is the consequence if a TPBAC member fails to disclose a conflict of interest?",
                "options": [
                        "Verbal warning",
                        "Immediate disqualification and invalidation of the bidding round",
                        "A small deduction in honoraria",
                        "No consequence"
                ],
                "correct": 1,
                "reason": "Section 4.2.4 requires immediate disqualification and potential invalidation of the round for conflict violations."
        },
        {
                "q": "[TPBAC Audit Q42] What is the consequence if a TPBAC member fails to disclose a conflict of interest?",
                "options": [
                        "Verbal warning",
                        "Immediate disqualification and invalidation of the bidding round",
                        "A small deduction in honoraria",
                        "No consequence"
                ],
                "correct": 1,
                "reason": "Section 4.2.4 requires immediate disqualification and potential invalidation of the round for conflict violations."
        },
        {
                "q": "[TPBAC Audit Q43] What is the consequence if a TPBAC member fails to disclose a conflict of interest?",
                "options": [
                        "Verbal warning",
                        "Immediate disqualification and invalidation of the bidding round",
                        "A small deduction in honoraria",
                        "No consequence"
                ],
                "correct": 1,
                "reason": "Section 4.2.4 requires immediate disqualification and potential invalidation of the round for conflict violations."
        },
        {
                "q": "[TPBAC Audit Q44] What is the consequence if a TPBAC member fails to disclose a conflict of interest?",
                "options": [
                        "Verbal warning",
                        "Immediate disqualification and invalidation of the bidding round",
                        "A small deduction in honoraria",
                        "No consequence"
                ],
                "correct": 1,
                "reason": "Section 4.2.4 requires immediate disqualification and potential invalidation of the round for conflict violations."
        },
        {
                "q": "[TPBAC Audit Q45] What is the consequence if a TPBAC member fails to disclose a conflict of interest?",
                "options": [
                        "Verbal warning",
                        "Immediate disqualification and invalidation of the bidding round",
                        "A small deduction in honoraria",
                        "No consequence"
                ],
                "correct": 1,
                "reason": "Section 4.2.4 requires immediate disqualification and potential invalidation of the round for conflict violations."
        },
        {
                "q": "[TPBAC Audit Q46] What is the consequence if a TPBAC member fails to disclose a conflict of interest?",
                "options": [
                        "Verbal warning",
                        "Immediate disqualification and invalidation of the bidding round",
                        "A small deduction in honoraria",
                        "No consequence"
                ],
                "correct": 1,
                "reason": "Section 4.2.4 requires immediate disqualification and potential invalidation of the round for conflict violations."
        },
        {
                "q": "[TPBAC Audit Q47] What is the consequence if a TPBAC member fails to disclose a conflict of interest?",
                "options": [
                        "Verbal warning",
                        "Immediate disqualification and invalidation of the bidding round",
                        "A small deduction in honoraria",
                        "No consequence"
                ],
                "correct": 1,
                "reason": "Section 4.2.4 requires immediate disqualification and potential invalidation of the round for conflict violations."
        },
        {
                "q": "[TPBAC Audit Q48] What is the consequence if a TPBAC member fails to disclose a conflict of interest?",
                "options": [
                        "Verbal warning",
                        "Immediate disqualification and invalidation of the bidding round",
                        "A small deduction in honoraria",
                        "No consequence"
                ],
                "correct": 1,
                "reason": "Section 4.2.4 requires immediate disqualification and potential invalidation of the round for conflict violations."
        },
        {
                "q": "[TPBAC Audit Q49] What is the consequence if a TPBAC member fails to disclose a conflict of interest?",
                "options": [
                        "Verbal warning",
                        "Immediate disqualification and invalidation of the bidding round",
                        "A small deduction in honoraria",
                        "No consequence"
                ],
                "correct": 1,
                "reason": "Section 4.2.4 requires immediate disqualification and potential invalidation of the round for conflict violations."
        },
        {
                "q": "[TPBAC Audit Q50] What is the consequence if a TPBAC member fails to disclose a conflict of interest?",
                "options": [
                        "Verbal warning",
                        "Immediate disqualification and invalidation of the bidding round",
                        "A small deduction in honoraria",
                        "No consequence"
                ],
                "correct": 1,
                "reason": "Section 4.2.4 requires immediate disqualification and potential invalidation of the round for conflict violations."
        },
        {
                "q": "[Exemptions Q51] Sourcing RPS capacity directly from consumer net-metering is exempt from what?",
                "options": [
                        "Joint ERC filing",
                        "TPBAC competitive bidding",
                        "DOE approval",
                        "All charges"
                ],
                "correct": 1,
                "reason": "Section 7.3 exempts net-metered consumer sourcing from competitive bidding, though joint filings are still mandatory."
        },
        {
                "q": "[Exemptions Q52] Sourcing RPS capacity directly from consumer net-metering is exempt from what?",
                "options": [
                        "Joint ERC filing",
                        "TPBAC competitive bidding",
                        "DOE approval",
                        "All charges"
                ],
                "correct": 1,
                "reason": "Section 7.3 exempts net-metered consumer sourcing from competitive bidding, though joint filings are still mandatory."
        },
        {
                "q": "[Exemptions Q53] Sourcing RPS capacity directly from consumer net-metering is exempt from what?",
                "options": [
                        "Joint ERC filing",
                        "TPBAC competitive bidding",
                        "DOE approval",
                        "All charges"
                ],
                "correct": 1,
                "reason": "Section 7.3 exempts net-metered consumer sourcing from competitive bidding, though joint filings are still mandatory."
        },
        {
                "q": "[Exemptions Q54] Sourcing RPS capacity directly from consumer net-metering is exempt from what?",
                "options": [
                        "Joint ERC filing",
                        "TPBAC competitive bidding",
                        "DOE approval",
                        "All charges"
                ],
                "correct": 1,
                "reason": "Section 7.3 exempts net-metered consumer sourcing from competitive bidding, though joint filings are still mandatory."
        },
        {
                "q": "[Exemptions Q55] Sourcing RPS capacity directly from consumer net-metering is exempt from what?",
                "options": [
                        "Joint ERC filing",
                        "TPBAC competitive bidding",
                        "DOE approval",
                        "All charges"
                ],
                "correct": 1,
                "reason": "Section 7.3 exempts net-metered consumer sourcing from competitive bidding, though joint filings are still mandatory."
        },
        {
                "q": "[Exemptions Q56] Sourcing RPS capacity directly from consumer net-metering is exempt from what?",
                "options": [
                        "Joint ERC filing",
                        "TPBAC competitive bidding",
                        "DOE approval",
                        "All charges"
                ],
                "correct": 1,
                "reason": "Section 7.3 exempts net-metered consumer sourcing from competitive bidding, though joint filings are still mandatory."
        },
        {
                "q": "[Exemptions Q57] Sourcing RPS capacity directly from consumer net-metering is exempt from what?",
                "options": [
                        "Joint ERC filing",
                        "TPBAC competitive bidding",
                        "DOE approval",
                        "All charges"
                ],
                "correct": 1,
                "reason": "Section 7.3 exempts net-metered consumer sourcing from competitive bidding, though joint filings are still mandatory."
        },
        {
                "q": "[Exemptions Q58] Sourcing RPS capacity directly from consumer net-metering is exempt from what?",
                "options": [
                        "Joint ERC filing",
                        "TPBAC competitive bidding",
                        "DOE approval",
                        "All charges"
                ],
                "correct": 1,
                "reason": "Section 7.3 exempts net-metered consumer sourcing from competitive bidding, though joint filings are still mandatory."
        },
        {
                "q": "[Exemptions Q59] Sourcing RPS capacity directly from consumer net-metering is exempt from what?",
                "options": [
                        "Joint ERC filing",
                        "TPBAC competitive bidding",
                        "DOE approval",
                        "All charges"
                ],
                "correct": 1,
                "reason": "Section 7.3 exempts net-metered consumer sourcing from competitive bidding, though joint filings are still mandatory."
        },
        {
                "q": "[Exemptions Q60] Sourcing RPS capacity directly from consumer net-metering is exempt from what?",
                "options": [
                        "Joint ERC filing",
                        "TPBAC competitive bidding",
                        "DOE approval",
                        "All charges"
                ],
                "correct": 1,
                "reason": "Section 7.3 exempts net-metered consumer sourcing from competitive bidding, though joint filings are still mandatory."
        },
        {
                "q": "[TOR Pricing Q61] Who holds the confidential reserve price before the financial opening?",
                "options": [
                        "The DU President",
                        "The TPBAC Chairperson",
                        "The ERC commissioners",
                        "The DOE undersecretary"
                ],
                "correct": 1,
                "reason": "Section 6.3.1 requires the reserve price to remain confidential to the TPBAC until financial envelope opening."
        },
        {
                "q": "[TOR Pricing Q62] Who holds the confidential reserve price before the financial opening?",
                "options": [
                        "The DU President",
                        "The TPBAC Chairperson",
                        "The ERC commissioners",
                        "The DOE undersecretary"
                ],
                "correct": 1,
                "reason": "Section 6.3.1 requires the reserve price to remain confidential to the TPBAC until financial envelope opening."
        },
        {
                "q": "[TOR Pricing Q63] Who holds the confidential reserve price before the financial opening?",
                "options": [
                        "The DU President",
                        "The TPBAC Chairperson",
                        "The ERC commissioners",
                        "The DOE undersecretary"
                ],
                "correct": 1,
                "reason": "Section 6.3.1 requires the reserve price to remain confidential to the TPBAC until financial envelope opening."
        },
        {
                "q": "[TOR Pricing Q64] Who holds the confidential reserve price before the financial opening?",
                "options": [
                        "The DU President",
                        "The TPBAC Chairperson",
                        "The ERC commissioners",
                        "The DOE undersecretary"
                ],
                "correct": 1,
                "reason": "Section 6.3.1 requires the reserve price to remain confidential to the TPBAC until financial envelope opening."
        },
        {
                "q": "[TOR Pricing Q65] Who holds the confidential reserve price before the financial opening?",
                "options": [
                        "The DU President",
                        "The TPBAC Chairperson",
                        "The ERC commissioners",
                        "The DOE undersecretary"
                ],
                "correct": 1,
                "reason": "Section 6.3.1 requires the reserve price to remain confidential to the TPBAC until financial envelope opening."
        },
        {
                "q": "[TOR Pricing Q66] Who holds the confidential reserve price before the financial opening?",
                "options": [
                        "The DU President",
                        "The TPBAC Chairperson",
                        "The ERC commissioners",
                        "The DOE undersecretary"
                ],
                "correct": 1,
                "reason": "Section 6.3.1 requires the reserve price to remain confidential to the TPBAC until financial envelope opening."
        },
        {
                "q": "[TOR Pricing Q67] Who holds the confidential reserve price before the financial opening?",
                "options": [
                        "The DU President",
                        "The TPBAC Chairperson",
                        "The ERC commissioners",
                        "The DOE undersecretary"
                ],
                "correct": 1,
                "reason": "Section 6.3.1 requires the reserve price to remain confidential to the TPBAC until financial envelope opening."
        },
        {
                "q": "[TOR Pricing Q68] Who holds the confidential reserve price before the financial opening?",
                "options": [
                        "The DU President",
                        "The TPBAC Chairperson",
                        "The ERC commissioners",
                        "The DOE undersecretary"
                ],
                "correct": 1,
                "reason": "Section 6.3.1 requires the reserve price to remain confidential to the TPBAC until financial envelope opening."
        },
        {
                "q": "[TOR Pricing Q69] Who holds the confidential reserve price before the financial opening?",
                "options": [
                        "The DU President",
                        "The TPBAC Chairperson",
                        "The ERC commissioners",
                        "The DOE undersecretary"
                ],
                "correct": 1,
                "reason": "Section 6.3.1 requires the reserve price to remain confidential to the TPBAC until financial envelope opening."
        },
        {
                "q": "[TOR Pricing Q70] Who holds the confidential reserve price before the financial opening?",
                "options": [
                        "The DU President",
                        "The TPBAC Chairperson",
                        "The ERC commissioners",
                        "The DOE undersecretary"
                ],
                "correct": 1,
                "reason": "Section 6.3.1 requires the reserve price to remain confidential to the TPBAC until financial envelope opening."
        },
        {
                "q": "[Qualifications Q71] Which envelope is opened first during the bid opening session?",
                "options": [
                        "Financial envelope",
                        "Technical envelope",
                        "Legal envelope",
                        "Both simultaneously"
                ],
                "correct": 1,
                "reason": "Appendix C2 requires opening the technical (including legal/financial checks) envelope before opening pricing bids."
        },
        {
                "q": "[Qualifications Q72] Which envelope is opened first during the bid opening session?",
                "options": [
                        "Financial envelope",
                        "Technical envelope",
                        "Legal envelope",
                        "Both simultaneously"
                ],
                "correct": 1,
                "reason": "Appendix C2 requires opening the technical (including legal/financial checks) envelope before opening pricing bids."
        },
        {
                "q": "[Qualifications Q73] Which envelope is opened first during the bid opening session?",
                "options": [
                        "Financial envelope",
                        "Technical envelope",
                        "Legal envelope",
                        "Both simultaneously"
                ],
                "correct": 1,
                "reason": "Appendix C2 requires opening the technical (including legal/financial checks) envelope before opening pricing bids."
        },
        {
                "q": "[Qualifications Q74] Which envelope is opened first during the bid opening session?",
                "options": [
                        "Financial envelope",
                        "Technical envelope",
                        "Legal envelope",
                        "Both simultaneously"
                ],
                "correct": 1,
                "reason": "Appendix C2 requires opening the technical (including legal/financial checks) envelope before opening pricing bids."
        },
        {
                "q": "[Qualifications Q75] Which envelope is opened first during the bid opening session?",
                "options": [
                        "Financial envelope",
                        "Technical envelope",
                        "Legal envelope",
                        "Both simultaneously"
                ],
                "correct": 1,
                "reason": "Appendix C2 requires opening the technical (including legal/financial checks) envelope before opening pricing bids."
        },
        {
                "q": "[Qualifications Q76] Which envelope is opened first during the bid opening session?",
                "options": [
                        "Financial envelope",
                        "Technical envelope",
                        "Legal envelope",
                        "Both simultaneously"
                ],
                "correct": 1,
                "reason": "Appendix C2 requires opening the technical (including legal/financial checks) envelope before opening pricing bids."
        },
        {
                "q": "[Qualifications Q77] Which envelope is opened first during the bid opening session?",
                "options": [
                        "Financial envelope",
                        "Technical envelope",
                        "Legal envelope",
                        "Both simultaneously"
                ],
                "correct": 1,
                "reason": "Appendix C2 requires opening the technical (including legal/financial checks) envelope before opening pricing bids."
        },
        {
                "q": "[Qualifications Q78] Which envelope is opened first during the bid opening session?",
                "options": [
                        "Financial envelope",
                        "Technical envelope",
                        "Legal envelope",
                        "Both simultaneously"
                ],
                "correct": 1,
                "reason": "Appendix C2 requires opening the technical (including legal/financial checks) envelope before opening pricing bids."
        },
        {
                "q": "[Qualifications Q79] Which envelope is opened first during the bid opening session?",
                "options": [
                        "Financial envelope",
                        "Technical envelope",
                        "Legal envelope",
                        "Both simultaneously"
                ],
                "correct": 1,
                "reason": "Appendix C2 requires opening the technical (including legal/financial checks) envelope before opening pricing bids."
        },
        {
                "q": "[Qualifications Q80] Which envelope is opened first during the bid opening session?",
                "options": [
                        "Financial envelope",
                        "Technical envelope",
                        "Legal envelope",
                        "Both simultaneously"
                ],
                "correct": 1,
                "reason": "Appendix C2 requires opening the technical (including legal/financial checks) envelope before opening pricing bids."
        },
        {
                "q": "[PEE Studies Q81] Who is responsible for verifying the substation grounding protection coordinates?",
                "options": [
                        "The DU supervisor",
                        "The licensed PEE consultant",
                        "The local grid chief",
                        "The GenCo auditor"
                ],
                "correct": 1,
                "reason": "PRC guidelines require a Professional Electrical Engineer (PEE) to audit and sign protection and grounding plans."
        },
        {
                "q": "[PEE Studies Q82] Who is responsible for verifying the substation grounding protection coordinates?",
                "options": [
                        "The DU supervisor",
                        "The licensed PEE consultant",
                        "The local grid chief",
                        "The GenCo auditor"
                ],
                "correct": 1,
                "reason": "PRC guidelines require a Professional Electrical Engineer (PEE) to audit and sign protection and grounding plans."
        },
        {
                "q": "[PEE Studies Q83] Who is responsible for verifying the substation grounding protection coordinates?",
                "options": [
                        "The DU supervisor",
                        "The licensed PEE consultant",
                        "The local grid chief",
                        "The GenCo auditor"
                ],
                "correct": 1,
                "reason": "PRC guidelines require a Professional Electrical Engineer (PEE) to audit and sign protection and grounding plans."
        },
        {
                "q": "[PEE Studies Q84] Who is responsible for verifying the substation grounding protection coordinates?",
                "options": [
                        "The DU supervisor",
                        "The licensed PEE consultant",
                        "The local grid chief",
                        "The GenCo auditor"
                ],
                "correct": 1,
                "reason": "PRC guidelines require a Professional Electrical Engineer (PEE) to audit and sign protection and grounding plans."
        },
        {
                "q": "[PEE Studies Q85] Who is responsible for verifying the substation grounding protection coordinates?",
                "options": [
                        "The DU supervisor",
                        "The licensed PEE consultant",
                        "The local grid chief",
                        "The GenCo auditor"
                ],
                "correct": 1,
                "reason": "PRC guidelines require a Professional Electrical Engineer (PEE) to audit and sign protection and grounding plans."
        },
        {
                "q": "[PEE Studies Q86] Who is responsible for verifying the substation grounding protection coordinates?",
                "options": [
                        "The DU supervisor",
                        "The licensed PEE consultant",
                        "The local grid chief",
                        "The GenCo auditor"
                ],
                "correct": 1,
                "reason": "PRC guidelines require a Professional Electrical Engineer (PEE) to audit and sign protection and grounding plans."
        },
        {
                "q": "[PEE Studies Q87] Who is responsible for verifying the substation grounding protection coordinates?",
                "options": [
                        "The DU supervisor",
                        "The licensed PEE consultant",
                        "The local grid chief",
                        "The GenCo auditor"
                ],
                "correct": 1,
                "reason": "PRC guidelines require a Professional Electrical Engineer (PEE) to audit and sign protection and grounding plans."
        },
        {
                "q": "[PEE Studies Q88] Who is responsible for verifying the substation grounding protection coordinates?",
                "options": [
                        "The DU supervisor",
                        "The licensed PEE consultant",
                        "The local grid chief",
                        "The GenCo auditor"
                ],
                "correct": 1,
                "reason": "PRC guidelines require a Professional Electrical Engineer (PEE) to audit and sign protection and grounding plans."
        },
        {
                "q": "[PEE Studies Q89] Who is responsible for verifying the substation grounding protection coordinates?",
                "options": [
                        "The DU supervisor",
                        "The licensed PEE consultant",
                        "The local grid chief",
                        "The GenCo auditor"
                ],
                "correct": 1,
                "reason": "PRC guidelines require a Professional Electrical Engineer (PEE) to audit and sign protection and grounding plans."
        },
        {
                "q": "[PEE Studies Q90] Who is responsible for verifying the substation grounding protection coordinates?",
                "options": [
                        "The DU supervisor",
                        "The licensed PEE consultant",
                        "The local grid chief",
                        "The GenCo auditor"
                ],
                "correct": 1,
                "reason": "PRC guidelines require a Professional Electrical Engineer (PEE) to audit and sign protection and grounding plans."
        },
        {
                "q": "[Outages & Hearings Q91] What is the default timeline for submitting joint briefs after evidentiary hearings close?",
                "options": [
                        "10 days",
                        "15 days",
                        "30 calendar days",
                        "60 days"
                ],
                "correct": 2,
                "reason": "Section 10.4.5 requires parties to submit their joint briefs within 30 calendar days of the last evidentiary hearing."
        },
        {
                "q": "[Outages & Hearings Q92] What is the default timeline for submitting joint briefs after evidentiary hearings close?",
                "options": [
                        "10 days",
                        "15 days",
                        "30 calendar days",
                        "60 days"
                ],
                "correct": 2,
                "reason": "Section 10.4.5 requires parties to submit their joint briefs within 30 calendar days of the last evidentiary hearing."
        },
        {
                "q": "[Outages & Hearings Q93] What is the default timeline for submitting joint briefs after evidentiary hearings close?",
                "options": [
                        "10 days",
                        "15 days",
                        "30 calendar days",
                        "60 days"
                ],
                "correct": 2,
                "reason": "Section 10.4.5 requires parties to submit their joint briefs within 30 calendar days of the last evidentiary hearing."
        },
        {
                "q": "[Outages & Hearings Q94] What is the default timeline for submitting joint briefs after evidentiary hearings close?",
                "options": [
                        "10 days",
                        "15 days",
                        "30 calendar days",
                        "60 days"
                ],
                "correct": 2,
                "reason": "Section 10.4.5 requires parties to submit their joint briefs within 30 calendar days of the last evidentiary hearing."
        },
        {
                "q": "[Outages & Hearings Q95] What is the default timeline for submitting joint briefs after evidentiary hearings close?",
                "options": [
                        "10 days",
                        "15 days",
                        "30 calendar days",
                        "60 days"
                ],
                "correct": 2,
                "reason": "Section 10.4.5 requires parties to submit their joint briefs within 30 calendar days of the last evidentiary hearing."
        },
        {
                "q": "[Outages & Hearings Q96] What is the default timeline for submitting joint briefs after evidentiary hearings close?",
                "options": [
                        "10 days",
                        "15 days",
                        "30 calendar days",
                        "60 days"
                ],
                "correct": 2,
                "reason": "Section 10.4.5 requires parties to submit their joint briefs within 30 calendar days of the last evidentiary hearing."
        },
        {
                "q": "[Outages & Hearings Q97] What is the default timeline for submitting joint briefs after evidentiary hearings close?",
                "options": [
                        "10 days",
                        "15 days",
                        "30 calendar days",
                        "60 days"
                ],
                "correct": 2,
                "reason": "Section 10.4.5 requires parties to submit their joint briefs within 30 calendar days of the last evidentiary hearing."
        },
        {
                "q": "[Outages & Hearings Q98] What is the default timeline for submitting joint briefs after evidentiary hearings close?",
                "options": [
                        "10 days",
                        "15 days",
                        "30 calendar days",
                        "60 days"
                ],
                "correct": 2,
                "reason": "Section 10.4.5 requires parties to submit their joint briefs within 30 calendar days of the last evidentiary hearing."
        },
        {
                "q": "[Outages & Hearings Q99] What is the default timeline for submitting joint briefs after evidentiary hearings close?",
                "options": [
                        "10 days",
                        "15 days",
                        "30 calendar days",
                        "60 days"
                ],
                "correct": 2,
                "reason": "Section 10.4.5 requires parties to submit their joint briefs within 30 calendar days of the last evidentiary hearing."
        },
        {
                "q": "[Outages & Hearings Q100] What is the default timeline for submitting joint briefs after evidentiary hearings close?",
                "options": [
                        "10 days",
                        "15 days",
                        "30 calendar days",
                        "60 days"
                ],
                "correct": 2,
                "reason": "Section 10.4.5 requires parties to submit their joint briefs within 30 calendar days of the last evidentiary hearing."
        }
];

    let currentQuizIndex = 0;
    let quizScore = 0;

    const qQuestion = document.getElementById('qQuestion');
    const qOptions = document.getElementById('qOptions');
    const qFeedback = document.getElementById('qFeedback');
    const qScore = document.getElementById('qScore');
    const quizNextBtn = document.getElementById('quizNextBtn');
    const quizRestartBtn = document.getElementById('quizRestartBtn');

    function renderQuizQuestion() {
        if (!qQuestion || !qOptions || !qFeedback || !quizNextBtn || !quizRestartBtn || !qScore) return;
        qFeedback.style.display = "none";
        quizNextBtn.style.display = "none";
        quizRestartBtn.style.display = "none";
        qOptions.innerHTML = "";

        if (currentQuizIndex >= quizQuestions.length) {
            qQuestion.innerHTML = `Quiz Completed!<br><br>Your final score: <strong>${quizScore} / ${quizQuestions.length}</strong>`;
            quizRestartBtn.style.display = "inline-flex";
            return;
        }

        const currentQ = quizQuestions[currentQuizIndex];
        qQuestion.textContent = `${currentQuizIndex + 1}. ${currentQ.q}`;

        currentQ.options.forEach((opt, index) => {
            const btn = document.createElement("button");
            btn.className = "quiz-option";
            btn.textContent = opt;
            btn.addEventListener("click", () => {
                qOptions.querySelectorAll('.quiz-option').forEach(el => el.disabled = true);
                
                if (index === currentQ.correct) {
                    btn.classList.add('correct');
                    qFeedback.textContent = `Correct! ${currentQ.reason}`;
                    qFeedback.className = "quiz-feedback success";
                    quizScore++;
                    qScore.textContent = quizScore;
                } else {
                    btn.classList.add('incorrect');
                    qOptions.querySelectorAll('.quiz-option')[currentQ.correct].classList.add('correct');
                    qFeedback.textContent = `Incorrect. ${currentQ.reason}`;
                    qFeedback.className = "quiz-feedback danger";
                }
                
                qFeedback.style.display = "block";
                quizNextBtn.style.display = "inline-flex";
            });
            qOptions.appendChild(btn);
        });
    }

    if (quizNextBtn) {
        quizNextBtn.addEventListener('click', () => {
            currentQuizIndex++;
            renderQuizQuestion();
        });
    }

    if (quizRestartBtn) {
        quizRestartBtn.addEventListener('click', () => {
            currentQuizIndex = 0;
            quizScore = 0;
            qScore.textContent = 0;
            renderQuizQuestion();
        });
    }

    renderQuizQuestion();

    // ==========================================
    // 14. Visual 10-Phase Stepper (Feature 11)
    // ==========================================
    const cspPhases = [
        { title: "Power Procurement Planning (PSPP)", desc: "Distribution Utilities draft their annual supply requirements and file it with the DOE." },
        { title: "TPBAC Constitution", desc: "DU forms a Third Party Bids and Awards Committee containing independent consumer members." },
        { title: "Terms of Reference Approval", desc: "The TPBAC drafts the bid TOR (Appendix C1) setting capacity and ceiling prices." },
        { title: "Invitation to Bid Publication", desc: "First official publication of the ITB in newspapers of general circulation." },
        { title: "Pre-Bid Conference", desc: "Conducted within 20 days. Clarifies bid details for generation company participants." },
        { title: "Bid Submission & Opening", desc: "Bidding GenCos submit sealed technical and financial bids for opening." },
        { title: "Bid Evaluation", desc: "TPBAC evaluates bids on levelized cost basis. Rejects rates exceeding ceiling limits." },
        { title: "Post-Qualification", desc: "Technical and financial audit of the lowest calculated compliant bidding GenCo." },
        { title: "PSA Award & Signing", desc: "Winning bidder is awarded the contract, and the parties execute the PSA within 120 days." },
        { title: "Joint Application Filing", desc: "DU and winning GenCo jointly file the PSA with the ERC for final approval within 180 days." }
    ];

    const stepperContainer = document.getElementById('stepperContainer');

    function renderStepper() {
        if (!stepperContainer) return;
        stepperContainer.innerHTML = "";
        
        cspPhases.forEach((phase, index) => {
            const step = document.createElement("div");
            step.className = `step ${index === 0 ? 'active' : ''}`;
            step.innerHTML = `
                <div class="step-bullet"><span>${index + 1}</span></div>
                <div class="step-title">${phase.title}</div>
                <div class="step-desc">${phase.desc}</div>
            `;
            step.addEventListener("click", () => {
                stepperContainer.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
                step.classList.add('active');
            });
            stepperContainer.appendChild(step);
        });
    }

    renderStepper();

    // ==========================================
    // 15. JS Logic for Captive Market PSA eligibility
    // ==========================================
    const chkRes07Joint = document.getElementById('chkRes07Joint');
    const chkRes07Lcoe = document.getElementById('chkRes07Lcoe');
    const chkRes07Obs = document.getElementById('chkRes07Obs');
    const psaStatus = document.getElementById('psaStatus');

    function checkPsaEligibility() {
        if (!chkRes07Joint || !chkRes07Lcoe || !chkRes07Obs || !psaStatus) return;
        const joint = chkRes07Joint.checked;
        const lcoe = chkRes07Lcoe.checked;
        const obs = chkRes07Obs.checked;

        if (joint && lcoe && obs) {
            psaStatus.textContent = "COMPLIANT: Ready for Joint ERC Filing";
            psaStatus.style.color = "#10B981";
        } else {
            psaStatus.textContent = "NOT COMPLIANT: Deficient PSA Package";
            psaStatus.style.color = "var(--color-accent)";
        }
    }
    if (chkRes07Joint) chkRes07Joint.addEventListener('change', checkPsaEligibility);
    if (chkRes07Lcoe) chkRes07Lcoe.addEventListener('change', checkPsaEligibility);
    if (chkRes07Obs) chkRes07Obs.addEventListener('change', checkPsaEligibility);
    checkPsaEligibility();

    // PEE Joint Certification Checklist
    const chkPeeGis = document.getElementById('chkPeeGis');
    const chkPeeSld = document.getElementById('chkPeeSld');
    const chkPeeCompl = document.getElementById('chkPeeCompl');
    const peeAuditStatus = document.getElementById('peeAuditStatus');

    function checkPeeAudit() {
        if (!chkPeeGis || !chkPeeSld || !chkPeeCompl || !peeAuditStatus) return;
        if (chkPeeGis.checked && chkPeeSld.checked && chkPeeCompl.checked) {
            peeAuditStatus.textContent = "PEE VERIFIED";
            peeAuditStatus.style.color = "#10B981";
        } else {
            peeAuditStatus.textContent = "INCOMPLETE";
            peeAuditStatus.style.color = "var(--color-accent)";
        }
    }
    if (chkPeeGis) chkPeeGis.addEventListener('change', checkPeeAudit);
    if (chkPeeSld) chkPeeSld.addEventListener('change', checkPeeAudit);
    if (chkPeeCompl) chkPeeCompl.addEventListener('change', checkPeeAudit);

    // LCOE Calculator
    const calcLcoeBtn = document.getElementById('calcLcoeBtn');
    if (calcLcoeBtn) {
        calcLcoeBtn.addEventListener('click', () => {
            const cap = parseFloat(document.getElementById('lcoeCap').value) || 0;
            const om = parseFloat(document.getElementById('lcoeOm').value) || 0;
            const factor = parseFloat(document.getElementById('lcoeFactor').value) || 0;
            const life = parseFloat(document.getElementById('lcoeLife').value) || 0;

            if (cap <= 0 || om <= 0 || factor <= 0 || life <= 0) {
                document.getElementById('lcoeResult').textContent = "PHP 0.00/kWh";
                return;
            }

            const annualKwh = 10 * 1000 * 8760 * (factor / 100);
            const lifetimeKwh = annualKwh * life;
            const totalCostPhp = (cap * 1000000) + (om * 1000000 * life);
            const lcoeVal = totalCostPhp / lifetimeKwh;

            document.getElementById('lcoeResult').textContent = `PHP ${lcoeVal.toFixed(2)}/kWh`;
        });
    }

    // CSP Bidding Compliance Simulator (Interactive Decision Scenario Game)
    const simStepLabel = document.getElementById('simStepLabel');
    const simPrompt = document.getElementById('simPrompt');
    const simFeedback = document.getElementById('simFeedback');
    const simButtons = document.getElementById('simButtons');

    const gameScenarios = [
        {
            milestone: "Milestone 1: Observer Authentication",
            prompt: "Bid opening day. Citizen Observers from consumer/business organizations are present but one has NOT executed the Annex A Sworn Undertaking. What do you do?",
            choices: [
                {
                    text: "Require the observer to sign the Sworn Undertaking (Annex A) before proceeding.",
                    correct: true,
                    feedback: "CORRECT! Section 9.3 mandates that observers execute a Sworn Undertaking of Compliance (Annex A) declaring zero conflict of interest before auditing sessions. Proceeding without this invalidates the audit report."
                },
                {
                    text: "Proceed with bid opening to avoid scheduling delays.",
                    correct: false,
                    feedback: "WARNING! Violation of Section 9.3. Citizen observers must submit Annex A prior to entering. Proceeding leads to potential ERC investigation and invalidation of the bidding round."
                }
            ]
        },
        {
            milestone: "Milestone 2: Technical Evaluation",
            prompt: "Opening Technical envelopes. GenCo B's single line connection diagrams and grid studies lack a signature and seal from a licensed Professional Electrical Engineer (PEE).",
            choices: [
                {
                    text: "Disqualify GenCo B's proposal for technical non-compliance.",
                    correct: true,
                    feedback: "CORRECT! Under the Philippine Grid Code and PRC engineering laws, high-voltage layouts and grid impact studies must be signed and sealed by a registered Professional Electrical Engineer (PEE) to qualify."
                },
                {
                    text: "Accept the bid on the condition that they submit the sealed SLD during post-qualification.",
                    correct: false,
                    feedback: "WARNING! Technical deficiency under Appendix D-1. Accepting uncertified high-voltage layouts violates competitive selection fairness. The joint application will fail the ERC intake checklist."
                }
            ]
        },
        {
            milestone: "Milestone 3: Financial Awarding",
            prompt: "The TOR reserve ceiling price is set at PHP 6.50/kWh. GenCo A bids PHP 6.10/kWh. GenCo C bids PHP 6.60/kWh but offers 10% higher efficiency. What is the award recommendation?",
            choices: [
                {
                    text: "Declare GenCo A as the Lowest Calculated Compliant Bidder.",
                    correct: true,
                    feedback: "CORRECT! Section 6.3 mandates that bids exceeding the pre-established reserve ceiling price are disqualified. GenCo A satisfies the least-cost compliant standard."
                },
                {
                    text: "Award to GenCo C due to their superior tech specs despite exceeding the PHP 6.50 limit.",
                    correct: false,
                    feedback: "WARNING! Section 6.3.3 strictly disqualifies all financial bids exceeding the reserve price, regardless of performance factors. Sourcing at PHP 6.60/kWh will trigger summary disapproval."
                }
            ]
        }
    ];

    let currentSimStep = 0;

    function renderSimScenario() {
        if (!simStepLabel || !simPrompt || !simButtons || !simFeedback) return;
        
        // If game is completed
        if (currentSimStep >= gameScenarios.length) {
            simStepLabel.textContent = "Simulation Completed!";
            simPrompt.innerHTML = "<strong>Congratulations!</strong> You successfully completed the TPBAC Bidding Compliance run.<br><br>All procurement milestones satisfied the ERC Resolution No. 07 requirements.";
            simFeedback.style.display = "none";
            
            simButtons.innerHTML = "";
            const restartBtn = document.createElement("button");
            restartBtn.className = "btn btn-accent";
            restartBtn.style.width = "100%";
            restartBtn.textContent = "Restart Simulation";
            restartBtn.addEventListener("click", () => {
                currentSimStep = 0;
                renderSimScenario();
            });
            simButtons.appendChild(restartBtn);
            return;
        }

        const scenario = gameScenarios[currentSimStep];
        simStepLabel.textContent = scenario.milestone;
        simPrompt.textContent = scenario.prompt;
        simFeedback.style.display = "none";
        
        simButtons.innerHTML = "";
        scenario.choices.forEach(choice => {
            const btn = document.createElement("button");
            btn.className = "btn btn-accent btn-outline";
            btn.style.width = "100%";
            btn.style.textAlign = "left";
            btn.style.fontSize = "12px";
            btn.style.padding = "8px 12px";
            btn.style.minHeight = "44px";
            btn.textContent = choice.text;
            
            btn.addEventListener("click", () => {
                // Show feedback
                simFeedback.style.display = "block";
                simFeedback.textContent = choice.feedback;
                
                if (choice.correct) {
                    simFeedback.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
                    simFeedback.style.border = "1px solid #10B981";
                    simFeedback.style.color = "#10B981";

                    // Remove choice buttons and show 'Next' button
                    simButtons.innerHTML = "";
                    const nextBtn = document.createElement("button");
                    nextBtn.className = "btn btn-accent";
                    nextBtn.style.width = "100%";
                    nextBtn.textContent = "Proceed to Next Milestone";
                    nextBtn.addEventListener("click", () => {
                        currentSimStep++;
                        renderSimScenario();
                    });
                    simButtons.appendChild(nextBtn);
                } else {
                    simFeedback.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                    simFeedback.style.border = "1px solid var(--color-accent)";
                    simFeedback.style.color = "var(--color-accent)";
                }
            });
            simButtons.appendChild(btn);
        });
    }

    renderSimScenario();

    // Multi-Criteria Weighted Evaluation Calculator
    const calcWeightedBtn = document.getElementById('calcWeightedBtn');
    if (calcWeightedBtn) {
        calcWeightedBtn.addEventListener('click', () => {
            const wtPrice = parseFloat(document.getElementById('wtPrice').value) || 0;
            const scPrice = parseFloat(document.getElementById('scorePrice').value) || 0;
            const wtTech = parseFloat(document.getElementById('wtTech').value) || 0;
            const scTech = parseFloat(document.getElementById('scoreTech').value) || 0;
            const wtEnv = parseFloat(document.getElementById('wtEnv').value) || 0;
            const scEnv = parseFloat(document.getElementById('scoreEnv').value) || 0;

            const sum = wtPrice + wtTech + wtEnv;
            if (Math.abs(sum - 100) > 0.1) {
                showModal("Calculation Error", "The total weights must sum to exactly 100%. Adjust weights and try again.");
                return;
            }

            const weightedVal = ((wtPrice * scPrice) + (wtTech * scTech) + (wtEnv * scEnv)) / 100;
            document.getElementById('weightedResult').textContent = `${weightedVal.toFixed(2)} / 100.00`;
        });
    }

    // WESM Spot Price Simulator
    const wesmRegion = document.getElementById('wesmRegion');
    const wesmMargin = document.getElementById('wesmMargin');
    const wesmSpc = document.getElementById('wesmSpc');
    const wesmChartContainer = document.getElementById('wesmChartContainer');
    const wesmGwap = document.getElementById('wesmGwap');
    const wesmPeak = document.getElementById('wesmPeak');
    const wesmHedge = document.getElementById('wesmHedge');
    const wesmSimBtn = document.getElementById('wesmSimBtn');

    function calculateWesm() {
        if (!wesmRegion || !wesmMargin || !wesmChartContainer || !wesmGwap || !wesmPeak || !wesmHedge) return;
        const region = wesmRegion.value;
        const margin = wesmMargin.value;
        const useSpc = wesmSpc ? wesmSpc.checked : true;

        let regionMult = 1.0;
        if (region === "Visayas") regionMult = 1.25;
        if (region === "Mindanao") regionMult = 0.85;

        let baseRates = [];
        if (margin === "normal") {
            baseRates = [4.10, 3.80, 5.20, 6.10, 5.80, 6.40, 4.50];
        } else if (margin === "tight") {
            baseRates = [6.20, 5.90, 8.10, 9.40, 8.80, 10.20, 6.80];
        } else {
            baseRates = [12.50, 11.00, 18.50, 24.20, 22.00, 28.50, 14.10];
        }

        const hours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"];
        let calculatedRates = baseRates.map(r => r * regionMult);
        
        if (useSpc) {
            calculatedRates = calculatedRates.map(r => Math.min(7.42, r));
        }

        const sum = calculatedRates.reduce((a, b) => a + b, 0);
        const gwapVal = sum / calculatedRates.length;
        const peakVal = Math.max(...calculatedRates);

        // Hedge Value: (GWAP - Contract Price of 5.50) * 10MW * 1000 * 24 hours
        const contractPrice = 5.50;
        const dailyKwh = 10 * 1000 * 24;
        const hedgePhp = (gwapVal - contractPrice) * dailyKwh;

        wesmGwap.textContent = `PHP ${gwapVal.toFixed(2)}/kWh`;
        wesmPeak.textContent = `PHP ${peakVal.toFixed(2)}/kWh`;
        
        if (hedgePhp >= 0) {
            wesmHedge.textContent = `+PHP ${(hedgePhp / 1000).toFixed(1)}K/day`;
            wesmHedge.style.color = "#10B981";
        } else {
            wesmHedge.textContent = `-PHP ${(Math.abs(hedgePhp) / 1000).toFixed(1)}K/day`;
            wesmHedge.style.color = "var(--color-accent)";
        }

        // Render Bars
        wesmChartContainer.innerHTML = "";
        const maxPossiblePrice = 35.00;

        calculatedRates.forEach((rate, index) => {
            const hPct = Math.max(12, Math.min(100, (rate / maxPossiblePrice) * 100));
            const bar = document.createElement("div");
            bar.className = "wesm-bar" + (rate >= 6.00 ? " peak" : "");
            bar.style.height = `${hPct}%`;
            bar.style.flex = "1";
            bar.style.display = "flex";
            bar.style.flexDirection = "column";
            bar.style.justifyContent = "space-between";
            bar.style.alignItems = "center";
            bar.style.padding = "4px 0";
            bar.style.position = "relative";

            bar.innerHTML = `
                <span class="wesm-bar-val" style="font-size: 8px; font-weight: 800; color: var(--text-primary); position: absolute; top: -18px;">₱${rate.toFixed(2)}</span>
                <div class="wesm-bar-lbl" style="font-size: 8px; font-weight: 600; margin-top: auto; color: var(--text-muted);">${hours[index]}</div>
            `;
            wesmChartContainer.appendChild(bar);
        });
    }

    if (wesmSimBtn) {
        wesmSimBtn.addEventListener('click', calculateWesm);
    }
    if (wesmRegion) wesmRegion.addEventListener('change', calculateWesm);
    if (wesmMargin) wesmMargin.addEventListener('change', calculateWesm);
    if (wesmSpc) wesmSpc.addEventListener('change', calculateWesm);

    calculateWesm();

    // Observer Report Template Generator
    const genReportBtn = document.getElementById('genReportBtn');
    const mockReportOutput = document.getElementById('mockReportOutput');
    if (genReportBtn && mockReportOutput) {
        genReportBtn.addEventListener('click', () => {
            const caseId = document.getElementById('repCase').value || "[Case ID]";
            const finding = document.getElementById('repCompliance').value;
            
            let findingStr = "";
            if (finding === "full") {
                findingStr = "THE PROCESS WAS FULLY COMPLIANT. No deviations, timeline breaches, or conflicts of interest were observed.";
            } else if (finding === "minor_dev") {
                findingStr = "MINOR PROCEDURAL DEVIATIONS RECORDED. The TPBAC exceeded publication guidelines by 3 days, with valid reasons.";
            } else {
                findingStr = "WARNING: COMPLIANCE BREACH. Significant conflicts of interest were noted during bid openings. Direct intervention advised.";
            }

            const reportTemplate = `ERC CSP OBSERVATION COMPLIANCE AUDIT
[Resolution No. 07, Series of 2026 - Appendix E]

CSP Case Reference: ${caseId}
Audited Date: ${new Date().toLocaleDateString()}

FINDINGS & DETERMINATION:
${findingStr}

SUBMITTED BY:
Independent Observer Panel Representative

(Certified copy automatically compiled and ready for joint filing package submission).`;
            
            mockReportOutput.textContent = reportTemplate;
            mockReportOutput.style.display = "block";
        });
    }

    // CSP Timeline Breach Fines Estimator
    const calcBreachBtn = document.getElementById('calcBreachBtn');
    if (calcBreachBtn) {
        calcBreachBtn.addEventListener('click', () => {
            const type = document.getElementById('breachType').value;
            const demand = parseFloat(document.getElementById('duDemand').value) || 0;

            if (demand <= 0) {
                document.getElementById('breachFineResult').textContent = "PHP 0.00";
                return;
            }

            let baseFine = 0;
            let scaleFine = 0;

            if (type === "minor") {
                baseFine = 50000;
                scaleFine = 1000 * demand;
            } else if (type === "major") {
                baseFine = 100000;
                scaleFine = 2000 * demand;
            } else {
                baseFine = 250000;
                scaleFine = 5000 * demand;
            }

            const totalFine = baseFine + scaleFine;
            document.getElementById('breachFineResult').textContent = `PHP ${totalFine.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
        });
    }

    // RPS Target Sourcing Calculator
    const calcRpsBtn = document.getElementById('calcRpsBtn');
    if (calcRpsBtn) {
        calcRpsBtn.addEventListener('click', () => {
            const sales = parseFloat(document.getElementById('rpsSales').value) || 0;
            const rate = parseFloat(document.getElementById('rpsPercentage').value) || 0;

            if (sales <= 0 || rate <= 0) {
                document.getElementById('rpsResult').textContent = "0.00 MWh";
                return;
            }

            const target = sales * (rate / 100);
            document.getElementById('rpsResult').textContent = `${target.toLocaleString('en-US', {maximumFractionDigits: 2})} MWh`;
        });
    }

    // TPBAC Composition Auditor (Section 4.2)
    const btnAuditTpbac = document.getElementById('btnAuditTpbac');
    const tpbacSeat1 = document.getElementById('tpbacSeat1');
    const tpbacSeat2 = document.getElementById('tpbacSeat2');
    const tpbacSeat3 = document.getElementById('tpbacSeat3');
    const tpbacSeat4 = document.getElementById('tpbacSeat4');
    const tpbacSeat5 = document.getElementById('tpbacSeat5');
    const tpbacAuditStatus = document.getElementById('tpbacAuditStatus');

    if (btnAuditTpbac && tpbacSeat1 && tpbacSeat2 && tpbacSeat3 && tpbacSeat4 && tpbacSeat5 && tpbacAuditStatus) {
        btnAuditTpbac.addEventListener('click', () => {
            const s1 = tpbacSeat1.value;
            const s2 = tpbacSeat2.value;
            const s3 = tpbacSeat3.value;
            const s4 = tpbacSeat4.value;
            const s5 = tpbacSeat5.value;

            if (s1 === "invalid" || s2 === "invalid" || s3 === "invalid" || s4 === "invalid" || s5 === "invalid") {
                tpbacAuditStatus.textContent = "INCOMPLETE CONFIGURATION";
                tpbacAuditStatus.style.color = "var(--color-accent)";
                return;
            }

            let duCount = 0;
            let indCount = 0;

            const seats = [s1, s2, s3, s4, s5];
            seats.forEach(s => {
                if (s.startsWith("du_")) {
                    duCount++;
                } else if (s.startsWith("ind_")) {
                    indCount++;
                }
            });

            const hasTech = seats.includes("du_tech");
            const hasFin = seats.includes("du_fin");
            const hasCons = seats.includes("ind_cons");
            const hasBus = seats.includes("ind_bus");
            const hasAcad = seats.includes("ind_acad");

            if (duCount === 2 && indCount === 3 && hasTech && hasFin && hasCons && hasBus && hasAcad) {
                tpbacAuditStatus.textContent = "COMPLIANT: ERC Standard Met";
                tpbacAuditStatus.style.color = "#10B981";
            } else {
                let reasons = [];
                if (duCount !== 2) reasons.push("Must have exactly 2 DU members");
                if (!hasTech) reasons.push("Missing DU Technical PEE/EE member");
                if (!hasFin) reasons.push("Missing DU Finance member");
                if (!hasCons) reasons.push("Missing captive consumer rep");
                if (!hasBus) reasons.push("Missing local business rep");
                if (!hasAcad) reasons.push("Missing academic/legal expert");

                tpbacAuditStatus.textContent = "NON-COMPLIANT: " + reasons.slice(0, 2).join(", ");
                tpbacAuditStatus.style.color = "var(--color-accent)";
            }
        });
    }

    // Fuel Indexation & Pass-Through Simulator (Section 6.5)
    const fuelCoalRange = document.getElementById('fuelCoalRange');
    const coalVal = document.getElementById('coalVal');
    const fuelOilRange = document.getElementById('fuelOilRange');
    const oilVal = document.getElementById('oilVal');
    const fuelBaseRate = document.getElementById('fuelBaseRate');
    const chkFuelCap = document.getElementById('chkFuelCap');
    const btnSimFuel = document.getElementById('btnSimFuel');
    const fuelResultRate = document.getElementById('fuelResultRate');
    const fuelResultSavings = document.getElementById('fuelResultSavings');

    if (fuelCoalRange && coalVal) {
        fuelCoalRange.addEventListener('input', () => {
            coalVal.textContent = fuelCoalRange.value;
        });
    }

    if (fuelOilRange && oilVal) {
        fuelOilRange.addEventListener('input', () => {
            oilVal.textContent = fuelOilRange.value;
        });
    }

    if (btnSimFuel && fuelResultRate && fuelResultSavings) {
        btnSimFuel.addEventListener('click', () => {
            const coalPrice = parseFloat(fuelCoalRange.value);
            const oilPrice = parseFloat(fuelOilRange.value);
            const baseRate = parseFloat(fuelBaseRate.value) || 0;

            if (baseRate <= 0) {
                fuelResultRate.textContent = "PHP 0.00/kWh";
                return;
            }

            const coalIndexRatio = coalPrice / 150;
            const oilIndexRatio = oilPrice / 80;

            const rateFactor = (0.6 * coalIndexRatio) + (0.4 * oilIndexRatio);
            const rawRate = baseRate * rateFactor;

            if (chkFuelCap && chkFuelCap.checked) {
                const cappedFactor = Math.max(0.8, Math.min(1.2, rateFactor));
                const cappedRate = baseRate * cappedFactor;
                const savings = Math.max(0, rawRate - cappedRate);

                fuelResultRate.textContent = `PHP ${cappedRate.toFixed(2)}/kWh`;
                
                if (savings > 0) {
                    fuelResultSavings.textContent = `ERC Risk Capping Active: Saved PHP ${savings.toFixed(2)}/kWh`;
                    fuelResultSavings.style.color = "#10B981";
                } else {
                    fuelResultSavings.textContent = "Rate is within ERC volatility limits";
                    fuelResultSavings.style.color = "var(--text-muted)";
                }
            } else {
                fuelResultRate.textContent = `PHP ${rawRate.toFixed(2)}/kWh`;
                fuelResultSavings.textContent = "Capping Inactive: Consumers bear full fuel price risk!";
                fuelResultSavings.style.color = "var(--color-accent)";
            }
        });
    }

    // Outage Allowance & Penalty Calculator (Section 12)
    const btnCalcOutage = document.getElementById('btnCalcOutage');
    const outageUnplanned = document.getElementById('outageUnplanned');
    const outagePlanned = document.getElementById('outagePlanned');
    const outageCapacity = document.getElementById('outageCapacity');
    const outagePremium = document.getElementById('outagePremium');
    const outageDaysExcess = document.getElementById('outageDaysExcess');
    const outageFineResult = document.getElementById('outageFineResult');

    if (btnCalcOutage && outageDaysExcess && outageFineResult) {
        btnCalcOutage.addEventListener('click', () => {
            const unplan = parseInt(outageUnplanned.value) || 0;
            const plan = parseInt(outagePlanned.value) || 0;
            const cap = parseFloat(outageCapacity.value) || 0;
            const premium = parseFloat(outagePremium.value) || 0;

            const excessUnplan = Math.max(0, unplan - 15);
            const excessPlan = Math.max(0, plan - 15);
            const totalExcessDays = excessUnplan + excessPlan;

            outageDaysExcess.textContent = `${totalExcessDays} Excess Days`;

            if (totalExcessDays <= 0) {
                outageFineResult.textContent = "PHP 0.00 (No Penalties)";
                outageFineResult.style.color = "#10B981";
                return;
            }

            const repEnergyKwh = totalExcessDays * 24 * cap * 1000 * 0.85;
            const fineVal = repEnergyKwh * premium;

            outageFineResult.textContent = `PHP ${fineVal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            outageFineResult.style.color = "var(--color-accent)";
        });
    }

    // Market Price Reference (MPR) Benchmark Validator (Section 6.3)
    const btnCalcMpr = document.getElementById('btnCalcMpr');
    const mprProposedRate = document.getElementById('mprProposedRate');
    const mprReferenceRate = document.getElementById('mprReferenceRate');
    const mprTerm = document.getElementById('mprTerm');
    const mprValidationResult = document.getElementById('mprValidationResult');
    const mprSavingsResult = document.getElementById('mprSavingsResult');

    if (btnCalcMpr && mprValidationResult && mprSavingsResult) {
        btnCalcMpr.addEventListener('click', () => {
            const prop = parseFloat(mprProposedRate.value) || 0;
            const ref = parseFloat(mprReferenceRate.value) || 0;
            const term = parseInt(mprTerm.value) || 0;

            if (prop <= 0 || ref <= 0 || term <= 0) {
                mprValidationResult.textContent = "INVALID RATES";
                mprValidationResult.className = "simulator-status danger";
                mprSavingsResult.textContent = "PHP 0.00";
                return;
            }

            if (prop > ref) {
                mprValidationResult.textContent = "NON-COMPLIANT: Exceeds reference rate";
                mprValidationResult.className = "simulator-status danger";
                mprSavingsResult.textContent = "PHP 0.00 (Tariff rejected)";
                mprSavingsResult.style.color = "var(--color-accent)";
            } else {
                mprValidationResult.textContent = "COMPLIANT: Rate beats reference benchmark";
                mprValidationResult.className = "simulator-status success";
                
                const annualSavings = (ref - prop) * 10 * 1000 * 8760 * 0.85;
                const lifetimeSavings = annualSavings * term;
                
                mprSavingsResult.textContent = `PHP ${lifetimeSavings.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                mprSavingsResult.style.color = "#10B981";
            }
        });
    }

    // Post-Filing Case Hearing Tracker (Section 10.4)
    const hearingSteps = document.querySelectorAll('.hearing-step');
    const hearingStepDetails = document.getElementById('hearingStepDetails');

    const hearingPhaseTexts = {
        "1": "<strong>Filing Phase Checklist:</strong> Verify joint signatures. ERC will audit documents and assign a Docket Case Number within 15 calendar days of receiving the petition. **[Resolution No. 07, Section 10.2]**",
        "2": "<strong>Publication Checklist:</strong> Order of Hearing must be published in full once a week for 2 consecutive weeks in a general circulation newspaper. File Affidavit of Publication immediately. **[Resolution No. 07, Section 10.4]**",
        "3": "<strong>Expository Checklist:</strong> DU and GenCo present the levelized tariff components under oath to the public. Intervenors have 5 days to file written oppositions. **[Resolution No. 07, Section 10.4.1]**",
        "4": "<strong>Evidentiary Checklist:</strong> DU planning engineers and PEE consultants defend grid studies and price forecasting calculations under cross-examination by ERC legal staff. **[Resolution No. 07, Section 10.4.3]**",
        "5": "<strong>Briefs Checklist:</strong> Parties submit final written briefs and summaries within 30 days of the last evidentiary hearing. Case is taken for rate review audits. **[Resolution No. 07, Section 10.4.5]**"
    };

    if (hearingSteps && hearingStepDetails) {
        hearingSteps.forEach(step => {
            step.addEventListener('click', () => {
                hearingSteps.forEach(s => s.classList.remove('active'));
                step.classList.add('active');
                const phase = step.getAttribute('data-phase');
                hearingStepDetails.innerHTML = hearingPhaseTexts[phase] || "Select a step.";
            });
        });
    }

    // ==========================================
    // 16. Interactive Info Popups (All 35 Triggers Mapped)
    // ==========================================
    const infoPopups = {
        "pop-timeline": {
            title: "Timeline Rules (Sec 5 & Appendix B)",
            desc: "Under Section 5.1, the entire Competitive Selection Process has an absolute maximum duration limit of 180 calendar days. Delays beyond this constitute a violation of rules unless pre-cleared with the ERC."
        },
        "pop-exemptions": {
            title: "Negotiated Exemptions (Sec 7)",
            desc: "Exemptions apply strictly under Section 7. Emergency PSAs are permitted under Section 7.1 if a DOE declaration of emergency has been officially issued, restricting agreements to 1 year."
        },
        "pop-matrix": {
            title: "Regulatory Comparative Matrix",
            desc: "This matrix tracks procedural compliance shifts. The key change is the transition from sole DU responsibility to a strict Joint DU-GenCo filing mandate under Section 10."
        },
        "pop-docs": {
            title: "Regulatory Templates Database",
            desc: "The resolution incorporates 10 standard Appendices/Annexes. Preparing applications using these standardized forms is mandatory for all Joint PSA filings."
        },
        "pop-download": {
            title: "Template Downloads",
            desc: "This simulator generates standard compliant templates mimicking official files, allowing compliance teams to preview the required data structure."
        },
        "pop-joint": {
            title: "Joint Filing Requirements (Sec 10 & App A)",
            desc: "Under Section 10, both the DU and winning GenCo are jointly liable for filing compliance. Appendix A outlines the strict 25-point list of requirements for joint filing."
        },
        "pop-fee": {
            title: "Bid Document Fees Limit (Sec 4.5)",
            desc: "To prevent utility rent-seeking, Section 4.5 limits the bid document fee based on capacity blocks (MW), scaling up to a maximum cap of PHP 100,000.00."
        },
        "pop-ceiling": {
            title: "Ceiling Price Evaluations (Sec 6 & App D-2)",
            desc: "Section 6.3 states that bid rates exceeding the pre-established reserve ceiling price stated in the Terms of Reference must be disqualified instantly."
        },
        "pop-prequal": {
            title: "GenCo Pre-Qualifications (App C2 & D-1)",
            desc: "Appendix C2 mandates strict legal, technical, and financial capability checks. GenCos failing any checkbox must be disqualified before opening financial proposals."
        },
        "pop-observers": {
            title: "Observer Protocols (Sec 9 & App E)",
            desc: "Under Section 9.1, DUs must invite consumer groups as Observers. Observers must sign the Sworn Undertaking (Annex A) and submit an audit report directly to the ERC."
        },
        "pop-dashboard": {
            title: "Digital Registry Log (Sec 10.3)",
            desc: "Section 10.3 mandates that all utilities maintain a public registry of active and filed PSAs. This simulator models that compliance dashboard."
        },
        "pop-glossary": {
            title: "Regulatory Definitions (Sec 2)",
            desc: "Section 2 provides the legal definition of all acronyms and terminology used in Resolution No. 07. Accurate understanding prevents filing delays."
        },
        "pop-qa": {
            title: "Q&A Help Assistant",
            desc: "A simulated dialogue bot pulling regulatory compliance answers directly from Resolution No. 07 clauses."
        },
        "pop-quiz": {
            title: "Compliance Quiz parameters",
            desc: "A knowledge test designed to evaluate energy procurement officers' readiness to file joint PSA applications under the 2026 guidelines."
        },
        "pop-stepper": {
            title: "Procurement Phases (Sec 4)",
            desc: "Section 4 outlines the 10 chronological phases of a standard CSP. Utilities must navigate these stages in order to satisfy the least-cost principles."
        },
        "pop-sidequest": {
            title: "Engr. Tobias PEE Grid Compliance Spotlight",
            desc: "Demonstrates advanced grid compliance auditing. PEE certification is required under ERC guidelines for all interconnecting solar assets."
        },
        "pop-intro-callout": {
            title: "Introduction Regulatory Standard",
            desc: "Based on Section 1. Captive market sales cannot bypass competitive selection without explicit ERC/DOE clearance."
        },
        "pop-timeline-date": {
            title: "First ITB Publication Date input",
            desc: "The regulatory clock starts ticking on this date. Under Appendix B, you have 180 days max from this date to file."
        },
        "pop-breach": {
            title: "Timeline Infractions & Sanctions",
            desc: "Section 15 authorizes the ERC to levy financial penalties based on DU peak demand for each day a milestone is delayed."
        },
        "pop-matrix-old": {
            title: "Previous CSP Guidelines",
            desc: "Refers to Resolution No. 13, Series of 2015, which had flexible schedules and allowed DUs to file applications independently."
        },
        "pop-matrix-new": {
            title: "Amended 2026 CSP Rules",
            desc: "Resolution No. 07, Series of 2026, which locks in strict timelines, joint liability, and observer audits."
        },
        "pop-dl-annexa": {
            title: "Annex A Compliance",
            desc: "Required for all invited observers. Confirms zero financial interests or consanguinity with the DU."
        },
        "pop-dl-c1": {
            title: "Appendix C1 Terms of Reference",
            desc: "DUs must build their TOR templates following this template. Any deviation requires prior ERC permission."
        },
        "pop-dl-appf": {
            title: "Appendix F Exemption Checklist",
            desc: "Documents needed to approve emergency negotiated contracts. Must be submitted within 10 days of execution."
        },
        "pop-fee-mw": {
            title: "Bid Document Fee Caps",
            desc: "Section 4.5 blocks excessive fees. The limit scales from PHP 10,000 (<1MW) to PHP 100,000 (>100MW)."
        },
        "pop-pee-audit": {
            title: "Professional Electrical Engineer Certification",
            desc: "Under Chapter 4 of the Grid Code, a PEE must audit, sign, and seal connection plans to guarantee grid integration safety."
        },
        "pop-pee-gis": {
            title: "Grid Impact Study (GIS) Signatures",
            desc: "Must be signed by a PEE to confirm that connection of the generation facility does not violate thermal or stability thresholds."
        },
        "pop-pee-sld": {
            title: "Single-Line Diagram compliance",
            desc: "Verifies the schematic representation of the station switchyard, requiring PEE stamps under PRC regulations."
        },
        "pop-pee-cert": {
            title: "Compliance Certification",
            desc: "The PEE certifies that the generation facility is fully compliant with the Philippine Electrical Code."
        },
        "pop-ceiling-reserve": {
            title: "Reserve Price Ceilings",
            desc: "Set in the TOR. DUs must keep reserve prices confidential until the formal bidding opens."
        },
        "pop-ceiling-bid": {
            title: "Submitted GenCo bid rates",
            desc: "Calculated as a levelized tariff. Must represent all fuel indices and capital costs."
        },
        "pop-chk-legal": {
            title: "Legal Qualifications checks",
            desc: "Verifies SEC registration, corporate charters, and general compliance filings."
        },
        "pop-chk-tech": {
            title: "Technical Audits",
            desc: "Confirms generation equipment reliability, environmental permits (ECC), and COCs."
        },
        "pop-chk-fin": {
            title: "Financial evaluations",
            desc: "Audits creditworthiness, capital equity, and minimum debt-to-equity ratios."
        },
        "pop-lcoe": {
            title: "Levelized Cost of Electricity LCOE",
            desc: "Appendix D-2 details the financial comparison methodology to normalize fuel indexing and capacity outputs."
        },
        "pop-lcoe-cap": {
            title: "LCOE Capital Cost inputs",
            desc: "Capital expenditures (CAPEX) including equipment procurement, land, and interconnection switchyards."
        },
        "pop-lcoe-om": {
            title: "Operation & Maintenance O&M inputs",
            desc: "Annual OPEX costs covering employee salaries, repairs, insurance, and administrative fees."
        },
        "pop-lcoe-factor": {
            title: "Capacity Factors",
            desc: "Expected yearly output percentage. Solar typically ranges between 15-25%."
        },
        "pop-lcoe-life": {
            title: "Operational Lifetimes",
            desc: "Useful asset life. Standard calculations assume 20-25 years for solar facilities."
        },
        "pop-weighted": {
            title: "Weighted Scoring Evaluator",
            desc: "TPBAC uses weighted criteria to combine technical performance and pricing, ensuring optimal choices."
        },
        "pop-weighted-score": {
            title: "Individual Criteria Scores",
            desc: "Scored between 0-100. Price scores are typically inversely proportional to bid tariff rates."
        },
        "pop-observer-report": {
            title: "Observer Reports (Appendix E)",
            desc: "Observers must file independent reports directly with the ERC within 5 days of bid awarding."
        },
        "pop-obs-org": {
            title: "Observer representation requirements",
            desc: "Observers must represent independent consumer advocacy groups, local chambers, or licensed PEE panels."
        },
        "pop-game": {
            title: "Bidding Game Simulation",
            desc: "Step-by-step game showcasing technical openings, financial comparisons, and observer checks."
        },
        "pop-res07-elig": {
            title: "Amended CSP Guidelines (Res 07)",
            desc: "Resolution No. 07, Series of 2026 regulates the joint filing and procurement rules for captive electricity contracts."
        },
        "pop-res07-joint": {
            title: "Joint DU-GenCo Signature",
            desc: "Section 10 mandates that both parties sign and take shared legal responsibility for joint filings."
        },
        "pop-res07-lcoe": {
            title: "LCOE within TOR Ceiling",
            desc: "Bid pricing must compare on a levelized cost of electricity basis and sit within the reserve ceiling caps."
        },
        "pop-res07-obs": {
            title: "Observer Sworn Undertaking logged",
            desc: "Under Section 9, citizen observers must sign the Annex A affidavit to verify compliance."
        },
        "pop-rps": {
            title: "Renewable Portfolio Standards targets",
            desc: "DUs must source a specific yearly increment (set by DOE) of captive sales from RE generation."
        },
        "pop-rps-increment": {
            title: "RPS Annual Increment Rate",
            desc: "Set at 2.52% annually under DOE circulars to drive RE capacity expansion."
        },
        "pop-links": {
            title: "Regulatory Resource Links",
            desc: "External connections to ERC issuances, NEA EC directives, and Meralco filings."
        },
        "pop-wesm": {
            title: "Spot Pricing Hedges",
            desc: "Spot markets exhibit pricing spikes. Long-term PSAs hedge captive consumers from spot volatility."
        },
        "pop-feedback-form": {
            title: "Regulatory Inquiry Submissions",
            desc: "This form models the submission of official regulatory clarifications to ERC compliance officers."
        },
        "pop-tpbac-audit": {
            title: "TPBAC Committee Audit (Section 4.2)",
            desc: "Audits committee configuration. Regulators enforce the 5-member rule strictly: exactly 2 DU employees and 3 independent consumer/business delegates."
        },
        "pop-tpbac-s1": {
            title: "Technical DU Rep Seat",
            desc: "One DU seat must represent a technical electrical planner or a licensed Professional Electrical Engineer (PEE)."
        },
        "pop-hearing-tracker": {
            title: "Post-Filing Hearings Stepper (Section 10.4)",
            desc: "Guides teams through the legal consult timelines. ERC requires public notification, expository runs, and evidentiary hearings."
        },
        "pop-fuel-sim": {
            title: "Fuel Adjustment Pass-Throughs (Section 6.5)",
            desc: "Models indexation parameters. Fuel adjustments are automatically capped to protect consumers from extreme commodity index volatility."
        },
        "pop-coal-idx": {
            title: "Newcastle Coal indexing",
            desc: "Refers to the pricing reference index for coal, normalized against base bids to determine pass-through increments."
        },
        "pop-fuel-cap": {
            title: "ERC Volatility Risk Cap",
            desc: "Locks rate fluctuations within 20% limits of base tariffs, requiring generation companies to hedge fuel purchase risks."
        },
        "pop-outage-calc": {
            title: "Outage Allowances & Penalties (Section 12)",
            desc: "Outlines allowed downtime limits. Plant outages exceeding 15 planned or 15 unplanned days annually trigger penalties."
        },
        "pop-outage-unplan": {
            title: "Unplanned plant outages limit",
            desc: "Capped at 15 days max per year. Unscheduled outages beyond this limit require genco to buy replacement power."
        },
        "pop-outage-premium": {
            title: "Replacement Power Purchase Premium",
            desc: "Calculated as the spot price difference (WESM cost minus PSA rate) the GenCo must pay the DU during excess shutdowns."
        },
        "pop-mpr-val": {
            title: "Market Price Reference Benchmarks (Section 6.3)",
            desc: "Regulators require bid evaluation comparisons against the ERC's published spot reference values to ensure rates beat WESM."
        },
        "pop-mpr-bid": {
            title: "Levelized proposed bid rate",
            desc: "Represents the calculated cost PHP/kWh containing fuel indexing baselines, capital repayments, and O&M costs."
        },
        "pop-fm-audit": {
            title: "Force Majeure Timeline",
            desc: "Under Section 5.5, grid-wide emergencies suspend milestones. The adjusted deadline adds the FM duration to the 180-day limits."
        },
        "pop-aff-audit": {
            title: "Affiliate Transactions",
            desc: "Section 8.5 mandates strict arm's-length checks, prohibiting directors with conflicts from voting, to prevent transfer pricing leaks."
        },
        "pop-def-checker": {
            title: "Application Intake",
            desc: "Section 10.2 reviews filings. Deficiencies trigger a 15-day warning; failure to cure leads to summary disapproval."
        },
        "pop-sens-sim": {
            title: "Weighted Scoring",
            desc: "Section 6.3 allows DUs to structure weight distributions. Adjusting price weighting shifts selection preferences between low-cost and high-tech."
        },
        "pop-fin-ratio": {
            title: "Financial Capability",
            desc: "Appendix D-1 requires GenCos to maintain debt-to-equity leverage within 70:30 bounds to ensure capital availability."
        },
        "pop-load-curve": {
            title: "Load Curve Sourcing",
            desc: "Section 4.3 limits over-contracting. Load ratios guide DUs in structuring procurement blocks for peak vs base demand."
        },
        "pop-spc-trig": {
            title: "Secondary Price Cap",
            desc: "WESM rules trigger the SPC (PHP 6.25/kWh cap) if the rolling 72-hour average price exceeds PHP 9.00/kWh."
        },
        "pop-co2-audit": {
            title: "Environmental Tariffs",
            desc: "Section 6.3 permits DUs to penalize carbon intensity to satisfy national RPS mandates."
        },
        "pop-yield-calc": {
            title: "Solar Energy Yield",
            desc: "Sourcing under Appendix D-2 models operational output. Degradation factors verify long-term supply durability."
        },
        "pop-bond-forfeit": {
            title: "Bid Bond Forfeiture",
            desc: "Appendix C2 rules forfeit bid guarantees if the winning bidder withdraws or refuses contract signing."
        }
    };

    // Bind triggers
    const successModal = document.getElementById('successModal');
    const modalIcon = document.getElementById('modalIcon');
    const modalSub = document.getElementById('modalSub');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const closeModalBtn = document.getElementById('closeModalBtn');

    document.querySelectorAll('.info-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const popId = trigger.getAttribute('data-popup');
            const data = infoPopups[popId];
            if (data && successModal && modalIcon && modalSub && modalTitle && modalMessage) {
                modalIcon.textContent = "i";
                modalIcon.style.color = "var(--color-accent)";
                modalIcon.style.backgroundColor = "var(--color-accent-light)";
                modalIcon.style.border = "1px solid var(--color-accent)";
                
                modalSub.style.display = "block";
                modalSub.textContent = "REGULATORY CITATION";
                
                modalTitle.textContent = data.title;
                modalMessage.textContent = data.desc;
                
                successModal.classList.add('show');
            }
        });
    });



    // ==========================================
    // 17. 10 New Interactive Compliance Features
    // ==========================================

    // Tool 41: Force Majeure Timeline Impact Auditor
    const btnCalcFm = document.getElementById('btnCalcFm');
    const fmStartDate = document.getElementById('fmStartDate');
    const fmDays = document.getElementById('fmDays');
    const fmResults = document.getElementById('fmResults');
    const fmNormalDate = document.getElementById('fmNormalDate');
    const fmAdjustedDate = document.getElementById('fmAdjustedDate');

    if (btnCalcFm) {
        btnCalcFm.addEventListener('click', () => {
            if (!fmStartDate.value) return alert("Please select a CSP Start Date");
            const start = new Date(fmStartDate.value);
            const days = parseInt(fmDays.value) || 0;
            
            const normal = new Date(start);
            normal.setDate(normal.getDate() + 180);
            
            const adjusted = new Date(normal);
            adjusted.setDate(adjusted.getDate() + days);

            fmNormalDate.textContent = normal.toISOString().split('T')[0];
            fmAdjustedDate.textContent = adjusted.toISOString().split('T')[0];
            fmResults.style.display = "flex";
        });
    }

    // Tool 44: Affiliate Transaction Compliance Check
    const btnAuditAff = document.getElementById('btnAuditAff');
    const chkAffBoard = document.getElementById('chkAffBoard');
    const chkAffCompare = document.getElementById('chkAffCompare');
    const chkAffErc = document.getElementById('chkAffErc');
    const affAuditResult = document.getElementById('affAuditResult');

    if (btnAuditAff) {
        btnAuditAff.addEventListener('click', () => {
            const isBoard = chkAffBoard.checked;
            const isCompare = chkAffCompare.checked;
            const isErc = chkAffErc.checked;

            if (isBoard && isCompare && isErc) {
                affAuditResult.textContent = "COMPLIANT (ARM'S LENGTH)";
                affAuditResult.style.color = "#10B981";
            } else {
                affAuditResult.textContent = "NON-COMPLIANT / DEFICIENT";
                affAuditResult.style.color = "var(--color-accent)";
            }
        });
    }

    // Tool 43: Joint Application Intake Deficiency Checker
    const btnCheckIntake = document.getElementById('btnCheckIntake');
    const intakeSign = document.getElementById('intakeSign');
    const chkIntakePee = document.getElementById('chkIntakePee');
    const chkIntakeObs = document.getElementById('chkIntakeObs');
    const intakeResult = document.getElementById('intakeResult');

    if (btnCheckIntake) {
        btnCheckIntake.addEventListener('click', () => {
            const joint = intakeSign.value === "joint";
            const pee = chkIntakePee.checked;
            const obs = chkIntakeObs.checked;

            if (joint && pee && obs) {
                intakeResult.textContent = "INSPECTED (PASS TO HEARINGS)";
                intakeResult.style.color = "#10B981";
            } else {
                intakeResult.textContent = "DEFICIENT (REJECTION RISK)";
                intakeResult.style.color = "var(--color-accent)";
            }
        });
    }

    // Tool 45: Weighted Criteria Score Sensitivity Simulator
    const btnSimSens = document.getElementById('btnSimSens');
    const sensPriceRange = document.getElementById('sensPriceRange');
    const sensPriceVal = document.getElementById('sensPriceVal');
    const sensResult = document.getElementById('sensResult');
    const sensGencoATotal = document.getElementById('sensGencoATotal');
    const sensGencoBTotal = document.getElementById('sensGencoBTotal');
    const sensWinner = document.getElementById('sensWinner');

    if (sensPriceRange && sensPriceVal) {
        sensPriceRange.addEventListener('input', () => {
            sensPriceVal.textContent = sensPriceRange.value;
        });
    }

    if (btnSimSens) {
        btnSimSens.addEventListener('click', () => {
            const wPrice = parseFloat(sensPriceRange.value) / 100;
            const wTech = 1 - wPrice;

            // GenCo A: Price Score 95, Technical Score 70
            // GenCo B: Price Score 75, Technical Score 95
            const totalA = 95 * wPrice + 70 * wTech;
            const totalB = 75 * wPrice + 95 * wTech;

            sensGencoATotal.textContent = totalA.toFixed(2);
            sensGencoBTotal.textContent = totalB.toFixed(2);

            if (totalA > totalB) {
                sensWinner.textContent = "GenCo A (Least Cost Winner)";
                sensWinner.style.color = "#10B981";
            } else {
                sensWinner.textContent = "GenCo B (Best Tech Winner)";
                sensWinner.style.color = "var(--color-accent)";
            }

            sensResult.style.display = "flex";
        });
    }

    // Tool 39: GenCo Financial Leverage Ratios Auditor
    const btnCalcRatio = document.getElementById('btnCalcRatio');
    const ratioDebt = document.getElementById('ratioDebt');
    const ratioEquity = document.getElementById('ratioEquity');
    const ratioResult = document.getElementById('ratioResult');
    const ratioVal = document.getElementById('ratioVal');
    const ratioStatus = document.getElementById('ratioStatus');

    if (btnCalcRatio) {
        btnCalcRatio.addEventListener('click', () => {
            const debt = parseFloat(ratioDebt.value) || 0;
            const equity = parseFloat(ratioEquity.value) || 0;
            const total = debt + equity;

            if (total <= 0) return alert("Please enter valid positive debt and equity values.");

            const debtPct = (debt / total) * 100;
            const equityPct = (equity / total) * 100;

            ratioVal.textContent = `${debtPct.toFixed(1)}:${equityPct.toFixed(1)}`;

            if (debtPct <= 70.0) {
                ratioStatus.textContent = "COMPLIANT (Debt <= 70%)";
                ratioStatus.style.color = "#10B981";
            } else {
                ratioStatus.textContent = "NON-COMPLIANT (Excess Leverage)";
                ratioStatus.style.color = "var(--color-accent)";
            }

            ratioResult.style.display = "flex";
        });
    }

    // Tool 36: Peak vs Off-Peak Load Curve Analyzer
    const btnAnalyzeLoad = document.getElementById('btnAnalyzeLoad');
    const peakLoadMw = document.getElementById('peakLoadMw');
    const baseLoadMw = document.getElementById('baseLoadMw');
    const loadResult = document.getElementById('loadResult');
    const loadRatio = document.getElementById('loadRatio');
    const loadRec = document.getElementById('loadRec');

    if (btnAnalyzeLoad) {
        btnAnalyzeLoad.addEventListener('click', () => {
            const peak = parseFloat(peakLoadMw.value) || 0;
            const base = parseFloat(baseLoadMw.value) || 0;

            if (base <= 0) return alert("Please enter a valid positive base load.");

            const ratio = peak / base;
            loadRatio.textContent = `${ratio.toFixed(2)}x`;

            if (ratio > 2.0) {
                loadRec.textContent = "Peaking / Intermediate blocks suggested";
                loadRec.style.color = "var(--color-accent)";
            } else {
                loadRec.textContent = "Steady baseload contract suggested";
                loadRec.style.color = "#10B981";
            }

            loadResult.style.display = "flex";
        });
    }

    // Tool 38: WESM Secondary Price Cap (SPC) Trigger Auditor
    const btnAuditSpc = document.getElementById('btnAuditSpc');
    const spcRollingAvg = document.getElementById('spcRollingAvg');
    const spcAuditResult = document.getElementById('spcAuditResult');

    if (btnAuditSpc) {
        btnAuditSpc.addEventListener('click', () => {
            const avg = parseFloat(spcRollingAvg.value) || 0;
            if (avg >= 9.0) {
                spcAuditResult.textContent = "SPC ACTIVE (₱6.25/kWh cap enforced)";
                spcAuditResult.style.color = "#10B981";
            } else {
                spcAuditResult.textContent = "SPC INACTIVE (Normal Market clearing)";
                spcAuditResult.style.color = "var(--text-muted)";
            }
        });
    }

    // Tool 37: CO2 Emissions Tariff Estimator
    const btnCalcCo2 = document.getElementById('btnCalcCo2');
    const co2Tech = document.getElementById('co2Tech');
    const co2TaxRate = document.getElementById('co2TaxRate');
    const co2Results = document.getElementById('co2Results');
    const co2Intensity = document.getElementById('co2Intensity');
    const co2Levy = document.getElementById('co2Levy');

    if (btnCalcCo2) {
        btnCalcCo2.addEventListener('click', () => {
            const tech = co2Tech.value;
            const tax = parseFloat(co2TaxRate.value) || 0;

            let intensity = 0.0;
            if (tech === "coal") intensity = 0.95;
            if (tech === "gas") intensity = 0.45;

            const levy = intensity * (tax / 1000);

            co2Intensity.textContent = `${intensity.toFixed(2)} kg/kWh`;
            co2Levy.textContent = `₱${levy.toFixed(4)}/kWh`;
            co2Results.style.display = "flex";
        });
    }

    // Tool 40: Annual Energy Yield Calculator for Solar PSAs
    const btnCalcYield = document.getElementById('btnCalcYield');
    const yieldMw = document.getElementById('yieldMw');
    const yieldSun = document.getElementById('yieldSun');
    const yieldResults = document.getElementById('yieldResults');
    const yieldAnnualMwh = document.getElementById('yieldAnnualMwh');
    const yield10YearMwh = document.getElementById('yield10YearMwh');

    if (btnCalcYield) {
        btnCalcYield.addEventListener('click', () => {
            const mw = parseFloat(yieldMw.value) || 0;
            const sun = parseFloat(yieldSun.value) || 0;

            const annual = mw * sun * 365;
            const y10 = annual * Math.pow(0.995, 10);

            yieldAnnualMwh.textContent = `${annual.toLocaleString(undefined, {maximumFractionDigits: 0})} MWh`;
            yield10YearMwh.textContent = `${y10.toLocaleString(undefined, {maximumFractionDigits: 0})} MWh`;
            yieldResults.style.display = "flex";
        });
    }

    // Tool 42: Bid Bond Forfeiture Risk Assessor
    const btnAuditBond = document.getElementById('btnAuditBond');
    const chkBondWithdraw = document.getElementById('chkBondWithdraw');
    const chkBondRefuse = document.getElementById('chkBondRefuse');
    const chkBondLate = document.getElementById('chkBondLate');
    const bondAuditResult = document.getElementById('bondAuditResult');

    if (btnAuditBond) {
        btnAuditBond.addEventListener('click', () => {
            const w = chkBondWithdraw.checked;
            const r = chkBondRefuse.checked;
            const l = chkBondLate.checked;

            if (w || r || l) {
                bondAuditResult.textContent = "HIGH RISK OF FORFEITURE";
                bondAuditResult.style.color = "var(--color-accent)";
            } else {
                bondAuditResult.textContent = "NO IMMEDIATE RISK";
                bondAuditResult.style.color = "#10B981";
            }
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (successModal) successModal.classList.remove('show');
        });
    }

    function showModal(title, message) {
        if (!successModal || !modalIcon || !modalSub || !modalTitle || !modalMessage) return;
        modalIcon.textContent = "✓";
        modalIcon.style.color = "var(--color-accent)";
        modalIcon.style.backgroundColor = "var(--color-accent-light)";
        modalIcon.style.border = "1px solid var(--color-accent)";
        modalSub.style.display = "none";
        
        modalTitle.textContent = title;
        modalMessage.innerHTML = message;
        successModal.classList.add('show');
    }

});
