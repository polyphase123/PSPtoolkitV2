document.addEventListener('DOMContentLoaded', () => {



    // ==========================================
    // 2. Mobile Drawer Navigation Menu
    // ==========================================
    const mobMenuBtn = document.getElementById('mobMenuBtn');
    const navLinks = document.querySelector('.nav-links');

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

    // ==========================================
    // 3. Scroll Progress Indicator & Back-To-Top (Feature 16, 19)
    // ==========================================
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const circleProgressPath = document.getElementById('circleProgressPath');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressPercent = Math.min((scrollTop / docHeight) * 100, 100);
        
        scrollProgress.style.width = `${progressPercent}%`;

        if (scrollTop > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        const offset = 132 - (progressPercent / 100) * 132;
        circleProgressPath.style.strokeDashoffset = offset;
        
        highlightSidebarOnScroll();
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

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
    // 4. Milestone Deadline Calculator (Feature 1)
    // ==========================================
    const calcMilestonesBtn = document.getElementById('calcMilestonesBtn');
    const bidStartDateInput = document.getElementById('bidStartDate');
    const milestoneResults = document.getElementById('milestoneResults');

    bidStartDateInput.value = new Date().toISOString().split('T')[0];

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
        document.getElementById('mAward').textContent = formatDate(awardDate);
        document.getElementById('mFiling').textContent = formatDate(filingDate);

        milestoneResults.style.display = 'flex';
        milestoneResults.style.animation = 'fadeIn 0.5s ease forwards';
    });

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
    // 5. Exemption Eligibility Wizard (Feature 2)
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

    wizardPrev.addEventListener("click", () => {
        if (wizardHistory.length > 0) {
            currentWizardNode = wizardHistory.pop();
            renderWizardNode();
        }
    });

    wizardReset.addEventListener("click", () => {
        wizardHistory = [];
        currentWizardNode = wizardTree;
        renderWizardNode();
    });

    renderWizardNode();

    // ==========================================
    // 6. Appendix Database Explorer (Feature 4)
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

    explorerSearch.addEventListener("input", (e) => {
        renderAppendices(e.target.value);
    });

    renderAppendices();

    // ==========================================
    // 7. Persistent Joint Filing Checklist (Feature 5)
    // ==========================================
    const jointChecklist = document.getElementById('jointChecklist');
    const checklistProgress = document.getElementById('checklistProgress');
    const resetChecklistBtn = document.getElementById('resetChecklistBtn');

    let checkStates = JSON.parse(localStorage.getItem('cspCheckStates')) || {};

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
        const total = checkItems.length;
        const checked = jointChecklist.querySelectorAll('.checklist-item.checked').length;
        const percent = total > 0 ? (checked / total) * 100 : 0;
        checklistProgress.style.width = `${percent}%`;
    }

    resetChecklistBtn.addEventListener('click', () => {
        checkItems.forEach(item => item.classList.remove('checked'));
        checkStates = {};
        localStorage.removeItem('cspCheckStates');
        updateChecklistProgress();
    });

    updateChecklistProgress();

    // ==========================================
    // 8. Ceiling Price Comparison Simulator (Feature 6)
    // ==========================================
    const ceilingRange = document.getElementById('ceilingRange');
    const ceilingVal = document.getElementById('ceilingVal');
    const bidRateRange = document.getElementById('bidRateRange');
    const bidRateVal = document.getElementById('bidRateVal');
    const simStatus = document.getElementById('simStatus');
    const simDetails = document.getElementById('simDetails');

    function runSimulation() {
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

    ceilingRange.addEventListener('input', runSimulation);
    bidRateRange.addEventListener('input', runSimulation);
    runSimulation();



    // ==========================================
    // 10. Bid Document Fee Estimator (Feature 12)
    // ==========================================
    const calcFeeBtn = document.getElementById('calcFeeBtn');
    const capacityMwInput = document.getElementById('capacityMw');
    const feeResult = document.getElementById('feeResult');

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

    // ==========================================
    // 11. GenCo Pre-Qualification Validator (Feature 13)
    // ==========================================
    const chkLegal = document.getElementById('chkLegal');
    const chkTech = document.getElementById('chkTech');
    const chkFin = document.getElementById('chkFin');
    const qualificationStatus = document.getElementById('qualificationStatus');

    function checkQualification() {
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

    chkLegal.addEventListener('change', checkQualification);
    chkTech.addEventListener('change', checkQualification);
    chkFin.addEventListener('change', checkQualification);
    checkQualification();

    // ==========================================
    // 12. Observer Sworn Form Builder (Feature 7)
    // ==========================================
    const generateDocBtn = document.getElementById('generateDocBtn');
    const mockDocOutput = document.getElementById('mockDocOutput');

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

    // ==========================================
    // 13. Searchable Glossary (Feature 9 - Expanded to 22 Terms)
    // ==========================================
    const glossary = [
        { term: "DU", def: "Distribution Utility - An electric cooperative or private corporation owned by stakeholders, responsible for distribution of electricity to captive consumers (e.g. Meralco, Batelec)." },
        { term: "GenCo", def: "Generation Company - An entity authorized by the ERC to operate facilities for generation of electricity." },
        { term: "PSA", def: "Power Supply Agreement - A contract executed between a DU and a GenCo for electricity supply, requiring joint approval by the ERC." },
        { term: "Captive Market", def: "Electricity end-users who do not have choice of supplier under Retail Competition, sourcing power directly from their franchise DU." },
        { term: "TPBAC", def: "Third Party Bids and Awards Committee - The independent panel formed by DUs, responsible for administering and supervising the CSP bidding cycle." },
        { term: "TOR", def: "Terms of Reference - The technical and financial guidelines stating the specifications and ceiling price for power procurement." },
        { term: "EPSA", def: "Emergency Power Supply Agreement - Negotiated supply agreement bypassed from CSP during grid deficits, restricted to 1 year duration max." },
        { term: "DOE", def: "Department of Energy - The government department setting policies and approving DUs' Power Supply Procurement Plans (PSPP)." },
        { term: "ERC", def: "Energy Regulatory Commission - The independent regulator enforcing power rates, grid codes, and joint PSA evaluations in the Philippines." },
        { term: "WESM", def: "Wholesale Electricity Spot Market - The centralized spot market where electricity is traded in real-time, functioning as a price reference." },
        { term: "RPS", def: "Renewable Portfolio Standards - A policy requiring DUs to source a minimum percentage of their electricity from renewable energy generators." },
        { term: "AS", def: "Ancillary Services - Support services necessary to sustain the transmission system reliability, grid stability, and voltage metrics." },
        { term: "ASPA", def: "Ancillary Services Procurement Agreement - The supply contract executed between the System Operator (NGCP) and a qualified generator for AS." },
        { term: "NGCP", def: "National Grid Corporation of the Philippines - The private concessionaire operating the nationwide transmission highway, acting as the System Operator." },
        { term: "SO", def: "System Operator - The entity (NGCP) responsible for managing grid power flows, frequency controls, and dispatching reserve capacities." },
        { term: "PEE", def: "Professional Electrical Engineer - The highest engineering license issued by the PRC, mandatory for certifying electrical drawings and grid studies." },
        { term: "GIS", def: "Grid Impact Study - The technical study evaluating the feasibility and stability impact of connecting a new generation plant to the grid network." },
        { term: "SLD", def: "Single-Line Diagram - The schematic diagram showing the electrical paths and components of a generator connection, certified by a PEE." },
        { term: "LCOE", def: "Levelized Cost of Electricity - The average lifetime cost of building and operating a generation facility per unit of electricity generated." },
        { term: "FIT", def: "Feed-in Tariff - The premium tariff scheme encouraging renewable energy developers by offering long-term guaranteed rates." },
        { term: "Observer Sworn Undertaking", def: "The mandatory Annex A affidavit executed by citizen observers to declare zero conflict of interest before auditing bids." },
        { term: "Joint PSA Filing", def: "The mandatory Section 10 filing procedure requiring both the DU and the GenCo to sign and submit applications together." }
    ];

    const glossarySearch = document.getElementById('glossarySearch');
    const glossaryList = document.getElementById('glossaryList');

    function renderGlossary(filter = "") {
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

    glossarySearch.addEventListener('input', (e) => {
        renderGlossary(e.target.value);
    });

    renderGlossary();

    // ==========================================
    // 14. Simulated Q&A Assistant (Feature 14)
    // ==========================================
    const qaMessages = document.getElementById('qaMessages');
    const qaInput = document.getElementById('qaInput');
    const qaSendBtn = document.getElementById('qaSendBtn');

    const qaDatabase = {
        "what is the maximum timeline for a csp?": "Under the 2026 Amended Guidelines, the entire Competitive Selection Process (CSP) has a strict maximum timeline of 180 calendar days. Any delays beyond this period require immediate notification to the ERC with justification.",
        "who is responsible for filing the psa application?": "Unlike older guidelines where only the DU filed, the 2026 rules mandate a Joint DU-GenCo PSA Filing. Both the Distribution Utility and the winning Generation Company must file the joint application under Appendix A requirements.",
        "what happens if the timeline is violated?": "If the 180-day timeline limit is violated without prior ERC approval, the resulting Power Supply Agreement (PSA) may be subject to summary disapproval, and DUs may face regulatory administrative fines.",
        "is emergency procurement exempt from csp?": "Yes. Negotiated procurements for Emergency Power Supply Agreements (EPSAs) are exempt from CSP under specific conditions: (1) official DOE declaration of emergency, (2) maximum period of 1 year, and (3) joint filing with the ERC within 10 days of execution.",
        "who can be a csp observer?": "CSP Observers must represent consumer advocacy groups, local chambers of commerce, or civil society groups. They must execute a Sworn Undertaking of Compliance (Annex A) and submit an independent report directly to the ERC."
    };

    function handleQASubmit(userQuery) {
        if (!userQuery.trim()) return;

        const userBubble = document.createElement("div");
        userBubble.className = "qa-msg user";
        userBubble.textContent = userQuery;
        qaMessages.appendChild(userBubble);
        qaMessages.scrollTop = qaMessages.scrollHeight;

        qaInput.value = "";

        setTimeout(() => {
            const cleanQuery = userQuery.toLowerCase().trim().replace(/[?.]/g, "");
            let response = "I'm sorry, I don't have simulated guidance on that specific query. Please try clicking one of the preset questions above, or ask about timelines, joint filings, emergency exceptions, or observer rules.";
            
            for (let key in qaDatabase) {
                if (cleanQuery.includes(key) || key.includes(cleanQuery)) {
                    response = qaDatabase[key];
                    break;
                }
            }

            const botBubble = document.createElement("div");
            botBubble.className = "qa-msg bot";
            botBubble.innerHTML = response;
            qaMessages.appendChild(botBubble);
            qaMessages.scrollTop = qaMessages.scrollHeight;
        }, 500);
    }

    qaSendBtn.addEventListener('click', () => {
        handleQASubmit(qaInput.value);
    });

    qaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleQASubmit(qaInput.value);
        }
    });

    document.querySelectorAll('.qa-suggest-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleQASubmit(btn.getAttribute('data-q'));
        });
    });

    // ==========================================
    // 15. Compliance Knowledge Quiz (Feature 10)
    // ==========================================
    const quizQuestions = [
        {
            q: "What is the maximum calendar duration permitted for the entire CSP cycle under Resolution No. 07, Series of 2026?",
            options: ["90 calendar days", "120 calendar days", "180 calendar days", "365 calendar days"],
            correct: 2,
            reason: "Under Section 5 of the Amended Implementing Guidelines, the CSP process, from publication of Invitation to Bid up to the joint filing, must not exceed 180 calendar days."
        },
        {
            q: "Who is responsible for submitting the joint PSA application to the ERC under the 2026 rules?",
            options: ["The Distribution Utility only", "The winning GenCo only", "The DU and winning GenCo jointly", "The Department of Energy"],
            correct: 2,
            reason: "The 2026 Amended Guidelines mandate that DUs and winning Generation Companies must jointly file the application for approval, sharing liability."
        },
        {
            q: "Which template must a citizen observer execute before participating in bidding sessions?",
            options: ["Appendix C1 Terms of Reference", "Annex A Sworn Undertaking", "Appendix F Filing Checklist", "Appendix D-2 Financial Matrix"],
            correct: 1,
            reason: "All invited observers must execute a Sworn Undertaking of Compliance (Annex A) declaring zero conflict of interest."
        },
        {
            q: "What is the maximum validity term allowed for an Emergency Power Supply Agreement (EPSA)?",
            options: ["6 months", "1 year", "2 years", "5 years"],
            correct: 1,
            reason: "Under emergency exemptions, negotiated EPSAs have a maximum validity duration limit of 1 year."
        },
        {
            q: "Within how many days from contract signing must an Emergency PSA be filed with the ERC?",
            options: ["5 days", "10 days", "30 days", "45 days"],
            correct: 1,
            reason: "DUs must file the executed Emergency PSA jointly with the winning supplier within 10 calendar days of signing to retain emergency status."
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
                
                quizNextBtn.style.display = "inline-flex";
            });
            qOptions.appendChild(btn);
        });
    }

    quizNextBtn.addEventListener('click', () => {
        currentQuizIndex++;
        renderQuizQuestion();
    });

    quizRestartBtn.addEventListener('click', () => {
        currentQuizIndex = 0;
        quizScore = 0;
        qScore.textContent = 0;
        renderQuizQuestion();
    });

    renderQuizQuestion();

    // ==========================================
    // 16. Visual 10-Phase Stepper (Feature 11)
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
    // 17. JavaScript Logic for 10 Previous Features (Tools 21 - 30)
    // ==========================================

    // Feature 21: Captive Market PSA Eligibility Checker
    const chkRes07Joint = document.getElementById('chkRes07Joint');
    const chkRes07Lcoe = document.getElementById('chkRes07Lcoe');
    const chkRes07Obs = document.getElementById('chkRes07Obs');
    const psaStatus = document.getElementById('psaStatus');

    function checkPsaEligibility() {
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
    chkRes07Joint.addEventListener('change', checkPsaEligibility);
    chkRes07Lcoe.addEventListener('change', checkPsaEligibility);
    chkRes07Obs.addEventListener('change', checkPsaEligibility);
    checkPsaEligibility();

    // Feature 22: PEE Joint Certification Checklist
    const chkPeeGis = document.getElementById('chkPeeGis');
    const chkPeeSld = document.getElementById('chkPeeSld');
    const chkPeeCompl = document.getElementById('chkPeeCompl');
    const peeAuditStatus = document.getElementById('peeAuditStatus');

    function checkPeeAudit() {
        if (chkPeeGis.checked && chkPeeSld.checked && chkPeeCompl.checked) {
            peeAuditStatus.textContent = "PEE VERIFIED";
            peeAuditStatus.style.color = "#10B981";
        } else {
            peeAuditStatus.textContent = "INCOMPLETE";
            peeAuditStatus.style.color = "var(--color-accent)";
        }
    }
    chkPeeGis.addEventListener('change', checkPeeAudit);
    chkPeeSld.addEventListener('change', checkPeeAudit);
    chkPeeCompl.addEventListener('change', checkPeeAudit);

    // Feature 23: LCOE Calculator
    const calcLcoeBtn = document.getElementById('calcLcoeBtn');
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

    // Feature 25: CSP Bidding Simulator Game
    const gameRunBtn = document.getElementById('gameRunBtn');
    const gameLog = document.getElementById('gameLog');
    let gameStep = 0;

    gameRunBtn.addEventListener('click', () => {
        const logs = [
            "[System] Initiating bid opening process for CSP Case CSP-2026-001...",
            "[TPBAC] 3 technical envelopes opened. Observers verified (Annex A verified).",
            "[Auditor] Technical score verification complete. GenCo B disqualified (no grid study certification).",
            "[TPBAC] Opening financial bids: GenCo A (PHP 6.10/kWh) vs GenCo C (PHP 5.80/kWh).",
            "[Compliance] GenCo C Bid is within TOR ceiling price (PHP 6.50/kWh). Approved.",
            "[System] Bidding simulation complete. Lowest Calculated Compliant Bidder: GenCo C."
        ];

        if (gameStep < logs.length) {
            const p = document.createElement('div');
            p.textContent = logs[gameStep];
            gameLog.appendChild(p);
            gameLog.scrollTop = gameLog.scrollHeight;
            gameStep++;
        } else {
            gameLog.innerHTML = "[System] Restarting simulation...<br>[System] Idle. Ready to simulate bid opening...";
            gameStep = 0;
        }
    });

    // Feature 26: Multi-Criteria Weighted Evaluation Calculator
    const calcWeightedBtn = document.getElementById('calcWeightedBtn');
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

    // Feature 27: WESM Spot Price Simulator
    const wesmSimBtn = document.getElementById('wesmSimBtn');
    wesmSimBtn.addEventListener('click', () => {
        const bars = document.querySelectorAll('.wesm-bar');
        bars.forEach(bar => {
            const h = Math.floor(Math.random() * 80) + 20; 
            bar.style.height = `${h}%`;
            
            if (h > 75) {
                bar.classList.add('peak');
            } else {
                bar.classList.remove('peak');
            }
        });
        showModal("Spot Prices Updated", "Simulated spot prices shifted. Notice peak pricing periods requiring contractual hedges.");
    });

    // Feature 28: Observer Report Template Generator
    const genReportBtn = document.getElementById('genReportBtn');
    const mockReportOutput = document.getElementById('mockReportOutput');
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

    // Feature 29: CSP Timeline Breach Fines Estimator
    const calcBreachBtn = document.getElementById('calcBreachBtn');
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

    // Feature 30: RPS Target Sourcing Calculator
    const calcRpsBtn = document.getElementById('calcRpsBtn');
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

    // ==========================================
    // 18. JavaScript Logic for 5 New Regulator Tools (Tools 31 - 35)
    // ==========================================

    // Feature 31: TPBAC Composition Auditor (Section 4.2)
    const btnAuditTpbac = document.getElementById('btnAuditTpbac');
    const tpbacSeat1 = document.getElementById('tpbacSeat1');
    const tpbacSeat2 = document.getElementById('tpbacSeat2');
    const tpbacSeat3 = document.getElementById('tpbacSeat3');
    const tpbacSeat4 = document.getElementById('tpbacSeat4');
    const tpbacSeat5 = document.getElementById('tpbacSeat5');
    const tpbacAuditStatus = document.getElementById('tpbacAuditStatus');

    btnAuditTpbac.addEventListener('click', () => {
        const s1 = tpbacSeat1.value;
        const s2 = tpbacSeat2.value;
        const s3 = tpbacSeat3.value;
        const s4 = tpbacSeat4.value;
        const s5 = tpbacSeat5.value;

        // Check for any invalid role
        if (s1 === "invalid" || s2 === "invalid" || s3 === "invalid" || s4 === "invalid" || s5 === "invalid") {
            tpbacAuditStatus.textContent = "INCOMPLETE CONFIGURATION";
            tpbacAuditStatus.style.color = "var(--color-accent)";
            return;
        }

        // Count DU seats vs Independent seats
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

        // Rules check
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

    // Feature 32: Fuel Indexation & Pass-Through Simulator (Section 6.5)
    const fuelCoalRange = document.getElementById('fuelCoalRange');
    const coalVal = document.getElementById('coalVal');
    const fuelOilRange = document.getElementById('fuelOilRange');
    const oilVal = document.getElementById('oilVal');
    const fuelBaseRate = document.getElementById('fuelBaseRate');
    const chkFuelCap = document.getElementById('chkFuelCap');
    const btnSimFuel = document.getElementById('btnSimFuel');
    const fuelResultRate = document.getElementById('fuelResultRate');
    const fuelResultSavings = document.getElementById('fuelResultSavings');

    fuelCoalRange.addEventListener('input', () => {
        coalVal.textContent = fuelCoalRange.value;
    });

    fuelOilRange.addEventListener('input', () => {
        oilVal.textContent = fuelOilRange.value;
    });

    btnSimFuel.addEventListener('click', () => {
        const coalPrice = parseFloat(fuelCoalRange.value);
        const oilPrice = parseFloat(fuelOilRange.value);
        const baseRate = parseFloat(fuelBaseRate.value) || 0;

        if (baseRate <= 0) {
            fuelResultRate.textContent = "PHP 0.00/kWh";
            return;
        }

        // Newcastle baseline = $150/ton, Brent baseline = $80/bbl
        const coalIndexRatio = coalPrice / 150;
        const oilIndexRatio = oilPrice / 80;

        // Coal weighting = 60%, Oil weighting = 40%
        const rateFactor = (0.6 * coalIndexRatio) + (0.4 * oilIndexRatio);
        const rawRate = baseRate * rateFactor;

        if (chkFuelCap.checked) {
            // Apply ERC 20% cap (factor must sit between 0.8 and 1.2)
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

    // Feature 33: Outage Allowance & Penalty Calculator (Section 12)
    const btnCalcOutage = document.getElementById('btnCalcOutage');
    const outageUnplanned = document.getElementById('outageUnplanned');
    const outagePlanned = document.getElementById('outagePlanned');
    const outageCapacity = document.getElementById('outageCapacity');
    const outagePremium = document.getElementById('outagePremium');
    const outageDaysExcess = document.getElementById('outageDaysExcess');
    const outageFineResult = document.getElementById('outageFineResult');

    btnCalcOutage.addEventListener('click', () => {
        const unplan = parseInt(outageUnplanned.value) || 0;
        const plan = parseInt(outagePlanned.value) || 0;
        const cap = parseFloat(outageCapacity.value) || 0;
        const premium = parseFloat(outagePremium.value) || 0;

        // ERC Limit is 15 planned, 15 unplanned outage days max per year
        const excessUnplan = Math.max(0, unplan - 15);
        const excessPlan = Math.max(0, plan - 15);
        const totalExcessDays = excessUnplan + excessPlan;

        outageDaysExcess.textContent = `${totalExcessDays} Excess Days`;

        if (totalExcessDays <= 0) {
            outageFineResult.textContent = "PHP 0.00 (No Penalties)";
            outageFineResult.style.color = "#10B981";
            return;
        }

        // Replacement Energy (kWh) = excess days * 24hrs * capacityMW * 1000 * 85% capacity factor
        const repEnergyKwh = totalExcessDays * 24 * cap * 1000 * 0.85;
        const fineVal = repEnergyKwh * premium;

        outageFineResult.textContent = `PHP ${fineVal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        outageFineResult.style.color = "var(--color-accent)";
    });

    // Feature 34: Market Price Reference (MPR) Benchmark Validator (Section 6.3)
    const btnCalcMpr = document.getElementById('btnCalcMpr');
    const mprProposedRate = document.getElementById('mprProposedRate');
    const mprReferenceRate = document.getElementById('mprReferenceRate');
    const mprTerm = document.getElementById('mprTerm');
    const mprValidationResult = document.getElementById('mprValidationResult');
    const mprSavingsResult = document.getElementById('mprSavingsResult');

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
            
            // Savings = (ref - prop) * 10MW * 8760 * 85% capacity factor * term years * 1000
            const annualSavings = (ref - prop) * 10 * 1000 * 8760 * 0.85;
            const lifetimeSavings = annualSavings * term;
            
            mprSavingsResult.textContent = `PHP ${lifetimeSavings.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            mprSavingsResult.style.color = "#10B981";
        }
    });

    // Feature 35: Post-Filing Case Hearing Tracker (Section 10.4)
    const hearingSteps = document.querySelectorAll('.hearing-step');
    const hearingStepDetails = document.getElementById('hearingStepDetails');

    const hearingPhaseTexts = {
        "1": "<strong>Filing Phase Checklist:</strong> Verify joint signatures. ERC will audit documents and assign a Docket Case Number within 15 calendar days of receiving the petition.",
        "2": "<strong>Publication Checklist:</strong> Order of Hearing must be published in full once a week for 2 consecutive weeks in a general circulation newspaper. File Affidavit of Publication immediately.",
        "3": "<strong>Expository Checklist:</strong> DU and GenCo present the levelized tariff components under oath to the public. Intervenors have 5 days to file written oppositions.",
        "4": "<strong>Evidentiary Checklist:</strong> DU planning engineers and PEE consultants defend grid studies and price forecasting calculations under cross-examination by ERC legal staff.",
        "5": "<strong>Briefs Checklist:</strong> Parties submit final written briefs and summaries within 30 days of the last evidentiary hearing. Case is taken for rate review audits."
    };

    hearingSteps.forEach(step => {
        step.addEventListener('click', () => {
            hearingSteps.forEach(s => s.classList.remove('active'));
            step.classList.add('active');
            const phase = step.getAttribute('data-phase');
            hearingStepDetails.innerHTML = hearingPhaseTexts[phase] || "Select a step.";
        });
    });

    // ==========================================
    // 19. Interactive Info Popups (All 35 Triggers Mapped)
    // ==========================================
    const infoPopups = {
        // Core Popups
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

        // Mapped Popups
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

        // 5 New Regulator Tools Popups (popups on everything)
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
            desc: "Guides teams through the legal consult timelines. ERC requires public notification, expository runs, and evidentiary depositions."
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
            desc: "Capped at 15 days max per year. Unscheduled outages beyond this limit require replacement power purchases paid by the GenCo."
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
        }
    };

    // Bind triggers
    document.querySelectorAll('.info-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const popId = trigger.getAttribute('data-popup');
            const data = infoPopups[popId];
            if (data) {
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
    // 20. Franz Tobias PEE Sidequest Unlock
    // ==========================================
    const sqUnlockBtn = document.getElementById('sqUnlockBtn');
    
    sqUnlockBtn.addEventListener('click', () => {
        modalIcon.textContent = "✓";
        modalIcon.style.color = "var(--color-accent)";
        modalIcon.style.backgroundColor = "var(--color-accent-light)";
        modalIcon.style.border = "1px solid var(--color-accent)";
        
        modalSub.style.display = "block";
        modalSub.textContent = "SIDEQUEST COMPLETED";
        
        modalTitle.textContent = "Methodology: Engr. Tobias, PEE";
        modalMessage.innerHTML = `
            <strong>Principal Electrical Engineer:</strong> Engr. Franz Xyrlo I. Tobias, PEE<br>
            <strong>Project Scope:</strong> Solar PV grid integration and tariff design.<br><br>
            <strong>PEE Engineering Methodology:</strong><br>
            1. <strong>Grid connection study (GIS)</strong>: Performed load-flow, transient stability, and short-circuit simulations to confirm grid compliance.<br>
            2. <strong>PEE Certification</strong>: Signed and sealed single-line connection layouts, substation schematics, and GIS reports required for ERC filing.<br>
            3. <strong>Timeline Compression</strong>: Bypassed normal 180-day bottlenecks, completing the Batelec II 45 MW Solar joint filing within 135 days.<br>
            4. <strong>LCOE tariff structuring</strong>: Optimized pricing parameters under Appendix D-2 criteria, securing consumer savings.
        `;
        
        successModal.classList.add('show');
    });

    // ==========================================
    // 21. Inquiry Form Submission & Modal (Feature 20)
    // ==========================================
    const feedbackForm = document.getElementById('feedbackForm');

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('feedEmail').value;
        const msg = document.getElementById('feedMessage').value;

        if (!email || !msg) return;

        modalIcon.textContent = "✓";
        modalIcon.style.color = "var(--color-accent)";
        modalIcon.style.backgroundColor = "var(--color-accent-light)";
        modalIcon.style.border = "1px solid var(--color-accent)";
        modalSub.style.display = "none";
        
        modalTitle.textContent = "Inquiry Sent!";
        modalMessage.innerHTML = `Your regulatory question has been simulated and saved successfully.<br><br><strong>Email:</strong> ${email}<br><strong>Inquiry Length:</strong> ${msg.length} characters.<br><br>This educational sandbox portal mimics active feedback logging.`;

        successModal.classList.add('show');
        feedbackForm.reset();
    });

    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('show');
    });

    function showModal(title, message) {
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
