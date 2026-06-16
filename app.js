/**
 * 資產智能 — 主應用程式
 *
 * 資料流：latest.json → manifest.json → 各區塊 JSON 檔案
 * 圖表：Apache ECharts（從 CDN 載入，見 index.html）
 *
 * 連接 WordPress/ACF：將 BASE_URL 替換為您的 ACF REST 端點，例如：
 *   const BASE_URL = 'https://yoursite.com/wp-json/acf/v3/asset-data/';
 * 並將 REST 回應對應至此處使用的相同 JSON 格式。
 */

'use strict';

/* ── Page-specific i18n keys (interface only — content stays as data) ───────── */
if (window.bpmI18nAdd) bpmI18nAdd({
  /* tabs / breadcrumb / header */
  'a.tabOverview': '總覽', 'a.tabOwnership': '持有人與資本', 'a.tabFinancial': '財務與估值',
  'a.tabRisk': '風險分析', 'a.tabOperations': '營運管理', 'a.tabDocuments': '文件', 'a.tabMarket': '市場',
  'a.lastUpdated': '最後更新', 'a.printConfidential': '機密 CONFIDENTIAL',
  'a.period': '期間', 'a.assetValuation': '資產估值', 'a.totalGba': '總建築面積',
  'a.loadFailed': '資料載入失敗：',
  /* overview — card titles */
  'a.execSummary': '執行摘要', 'a.basicInfo': '資產基本資訊', 'a.actionsTitle': '待決事項與建議行動',
  'a.keyDocs': '重要文件', 'a.topRisks': '主要風險', 'a.marketSnapshot': '市場快照',
  /* overview — basic info labels */
  'a.assetName': '資產名稱', 'a.assetType': '資產類型', 'a.address': '地址', 'a.submarket': '次市場',
  'a.yearBuiltAcquired': '建設年份 / 取得年份', 'a.totalUnits': '總戶數',
  'a.unitsResidential': '住宅', 'a.unitsCommercial': '商業',
  'a.currentStatus': '目前狀態', 'a.reportingPeriod': '報告期間', 'a.ownershipSummary': '持有結構',
  /* overview — action card labels */
  'a.priHigh': '高優先', 'a.priMedium': '中優先', 'a.priLow': '低優先',
  'a.decisionNeeded': '待決事項：', 'a.owner': '負責人：', 'a.deadline': '截止日期：',
  'a.colOwner2': '負責人', 'a.colDeadline': '截止日期',
  /* overview — linked docs / market snapshot table */
  'a.colDocument': '文件', 'a.colCategory': '類別', 'a.colDate': '日期', 'a.colType': '類型',
  'a.medianRentPM2': '中位數租金/m²', 'a.vacancyRate': '空置率', 'a.yoyRentGrowth': '年租金成長',
  'a.assetVsMarket': '資產 vs. 市場', 'a.capRateBenchmark': '資本化率基準',
  /* ownership — entity */
  'a.legalEntity': '法律實體', 'a.ownersStructure': '持有人結構', 'a.ownershipDist': '持股比例分佈',
  'a.capitalStructure': '資本結構', 'a.netEquityPos': '淨權益部位', 'a.debtSummary': '負債摘要',
  'a.contributions': '出資紀錄',
  'a.entityName': '實體名稱', 'a.entityType': '實體類型', 'a.entityRegistered': '登記地',
  'a.taxElection': '稅務性質', 'a.entityFormed': '成立日期',
  /* ownership — owners table */
  'a.colOwner': '持有人', 'a.colRole': '角色', 'a.colOwnershipPct': '持股比例',
  'a.colContribution': '出資金額', 'a.colCurrentEquity': '目前權益價值', 'a.colSince': '起始日',
  /* ownership — contributions table */
  'a.colContributor': '出資人', 'a.colAmount': '金額', 'a.colNote': '備註',
  /* ownership — capital stack */
  'a.csDebt': '負債', 'a.csEquity': '權益', 'a.seniorLoan': '優先貸款', 'a.netEquity': '淨權益',
  'a.amount': '金額', 'a.stackSenior': '優先貸款', 'a.stackContributed': '出資金額',
  'a.stackRetained': '累計保留盈餘', 'a.stackNetEquity': '淨權益',
  /* ownership — debt table */
  'a.colLender': '貸款機構', 'a.colLoanBalance': '貸款餘額', 'a.colInterestRate': '利率',
  'a.colMaturity': '到期日', 'a.colDscr': 'DSCR', 'a.colLtv': 'LTV', 'a.colStatus': '狀態',
  /* ownership — net equity cards */
  'a.assetValue': '資產價值', 'a.neAppraised': '估算，2026年5月',
  'a.neLtv': '貸款成數', 'a.neOfAssetValue': '占資產價值', 'a.neTotalInvested': '總投入資本',
  /* ownership — guarantee */
  'a.guaranteeTitle': '有效保證 / 義務', 'a.gObligor': '保證人', 'a.gBeneficiary': '受益人',
  'a.gExpiry': '到期日', 'a.gDescription': '說明',
  /* financial — income statement */
  'a.incomeStmtTitle': '損益表 — 實際 vs. 預算 vs. 去年同期',
  'a.incomeStmtSub': '過去12個月（2025年6月 – 2026年5月）· 新台幣（NTD）',
  'a.valuationHistory': '歷史估值', 'a.valueProjection': '五年價值預測 — 情境分析',
  'a.capexSummary': '資本支出摘要',
  'a.colItem': '項目', 'a.colActualTtm': '實際（TTM）', 'a.colBudget': '預算',
  'a.colPriorYear': '去年同期', 'a.colVariance': '差異',
  /* financial — valuation cards */
  'a.purchasePrice': '取得價格', 'a.lastAppraisal': '最近鑑價', 'a.currentEstValue': '目前估計價值',
  'a.valueChange': '增值幅度', 'a.capRate': '資本化率', 'a.sinceAcq': '自取得以來',
  'a.valuePM2': '每m²均價', 'a.blendedPM2': '綜合 NT$/m²', 'a.ownerNetEquity': '業主淨權益',
  'a.afterSeniorDebt': '扣除優先貸款後',
  /* financial — charts */
  'a.tipValuation': '估值', 'a.markMax': '最高',
  /* financial — capex table */
  'a.colProject': '計畫名稱', 'a.colYear': '年份', 'a.colActualSpent': '實際 / 已支出',
  'a.colRemaining': '剩餘',
  /* risk — summary */
  'a.overallRisk': '整體風險', 'a.asOf': '截至', 'a.highRisk': '高風險', 'a.mediumRisk': '中風險',
  'a.lowRisk': '低風險', 'a.highRiskOpen': '待處理高風險項目', 'a.mediumRiskOpen': '待處理中風險項目',
  'a.lowRiskOpen': '待處理低風險項目',
  'a.probImpactMatrix': '機率 / 影響矩陣',
  'a.matrixHint': 'X軸 = 影響程度 (1–5) · Y軸 = 發生機率 (1–5) · 圓點 = 風險代碼',
  'a.riskRegister': '風險登記冊', 'a.stressTest': '情境壓力測試',
  'a.stressTestSub': '各壓力情境下對現金流或資產價值的影響',
  'a.threeScenarioCf': '三情境現金流量預測', 'a.mitigationPlan': '風險緩解行動計畫',
  /* risk — register table */
  'a.colCode': '代碼', 'a.colRiskItem': '風險事項', 'a.colProbability': '機率',
  'a.colImpact': '影響', 'a.colScore': '評分', 'a.colLevel': '等級',
  /* risk — scenario cards */
  'a.baseCashFlow': '基本現金流', 'a.scenarioCashFlow': '情境現金流', 'a.change': '變動',
  'a.perYear': '/年', 'a.newDscr': '新 DSCR', 'a.baseAssetValue': '基本資產價值',
  'a.scenarioAssetValue': '情境資產價值', 'a.scenarioLtv': '情境 LTV',
  /* risk — matrix tooltip */
  'a.tipProbability': '發生機率', 'a.tipImpact': '影響程度', 'a.tipLevel': '等級',
  /* risk — mitigation table */
  'a.colRiskCode': '風險代碼', 'a.colMitAction': '緩解行動',
  /* operations — titles */
  'a.priorityMatrix': '事項優先順序矩陣', 'a.highUrgency': '← 高緊急度', 'a.lowUrgency': '低緊急度 →',
  'a.capexProjects': '資本支出計畫', 'a.recurringOpex': '定期營運費用', 'a.suppliers': '廠商與供應商',
  'a.serviceHistory': '服務紀錄',
  /* operations — priority quadrant labels */
  'a.pmQ1': '立即處理（緊急 + 重要）', 'a.pmQ2': '排程規劃（重要，不緊急）',
  'a.pmQ3': '委外處理（緊急，較不重要）', 'a.pmQ4': '委外 / 取消',
  /* operations — capex table */
  'a.colSpent': '已支出', 'a.colProgress': '進度', 'a.colContractor': '承包商',
  'a.colEstCompletion': '預計完工',
  /* operations — opex table */
  'a.colVendor': '廠商', 'a.colAnnualCost': '年度費用', 'a.colFrequency': '頻率',
  'a.colContractExpiry': '合約到期',
  /* operations — suppliers table */
  'a.colContact': '聯絡人', 'a.colContractPeriod': '合約期間', 'a.colSlaWarranty': 'SLA / 保固',
  /* operations — service history table */
  'a.colWorkDesc': '作業說明', 'a.colCost': '費用',
  /* documents */
  'a.docLibrary': '文件庫',
  'a.colDocName': '文件名稱', 'a.colDocId': '編號', 'a.colSource': '來源', 'a.colRelatedSection': '相關區塊',
  'a.filterAll': '全部',
  /* market */
  'a.localMarketSummary': '當地市場摘要 — 大安/信義, 台北市',
  'a.competitiveness': '資產競爭力分析 (SWOT)', 'a.compSales': '可比較交易案例',
  'a.capRateTrend': '資本化率趨勢 — 次市場', 'a.compRents': '租金比較案例',
  'a.vacancyTrend': '空置率趨勢 — 次市場 vs. 資產', 'a.marketRisks': '市場風險', 'a.marketOpps': '市場機會',
  'a.swotStrengths': '優勢', 'a.swotWeaknesses': '劣勢', 'a.swotOpportunities': '機會', 'a.swotThreats': '威脅',
  /* market — comp sales table */
  'a.colUnits': '戶數', 'a.colYearBuilt': '建設年', 'a.colSoldDate': '成交日',
  'a.colSalePrice': '成交價', 'a.colPricePerUnit': '每戶單價', 'a.colPricePM2': '每m²單價',
  'a.colCapRate': '資本化率', 'a.colOccupancy': '入住率',
  /* market — rent comps table */
  'a.colUnitType': '戶型', 'a.colAreaM2': '面積(m²)', 'a.colAskingRent': '開價租金',
  'a.colRentPM2': '租金/m²', 'a.colAmenities': '設施', 'a.perMonth': '/月',
  /* market — charts */
  'a.tipCapRate': '資本化率', 'a.legendSubmarket': '次市場',
  /* status labels (derived) — Complete/In Progress/Not Started/Open use shared status.* */
  'a.stProposed': '提案中', 'a.stMonitoring': '監控中',
  'a.stActive': '有效', 'a.stRenewalDue': '待續約', 'a.stUnderConsideration': '考量中'
  /* level labels (High/Medium/Low) use shared lvl.* */
}, {
  /* tabs / breadcrumb / header */
  'a.tabOverview': 'Overview', 'a.tabOwnership': 'Ownership & capital', 'a.tabFinancial': 'Financials & valuation',
  'a.tabRisk': 'Risk', 'a.tabOperations': 'Operations', 'a.tabDocuments': 'Documents', 'a.tabMarket': 'Market',
  'a.lastUpdated': 'Last updated', 'a.printConfidential': 'CONFIDENTIAL',
  'a.period': 'Period', 'a.assetValuation': 'Valuation', 'a.totalGba': 'Total GBA',
  'a.loadFailed': 'Failed to load data: ',
  /* overview — card titles */
  'a.execSummary': 'Executive summary', 'a.basicInfo': 'Asset profile', 'a.actionsTitle': 'Action items & recommendations',
  'a.keyDocs': 'Key documents', 'a.topRisks': 'Top risks', 'a.marketSnapshot': 'Market snapshot',
  /* overview — basic info labels */
  'a.assetName': 'Asset name', 'a.assetType': 'Asset type', 'a.address': 'Address', 'a.submarket': 'Submarket',
  'a.yearBuiltAcquired': 'Year built / acquired', 'a.totalUnits': 'Total units',
  'a.unitsResidential': 'residential', 'a.unitsCommercial': 'commercial',
  'a.currentStatus': 'Current status', 'a.reportingPeriod': 'Reporting period', 'a.ownershipSummary': 'Ownership structure',
  /* overview — action card labels */
  'a.priHigh': 'High priority', 'a.priMedium': 'Medium priority', 'a.priLow': 'Low priority',
  'a.decisionNeeded': 'Decision needed: ', 'a.owner': 'Owner: ', 'a.deadline': 'Deadline: ',
  'a.colOwner2': 'Owner', 'a.colDeadline': 'Deadline',
  /* overview — linked docs / market snapshot table */
  'a.colDocument': 'Document', 'a.colCategory': 'Category', 'a.colDate': 'Date', 'a.colType': 'Type',
  'a.medianRentPM2': 'Median rent/m²', 'a.vacancyRate': 'Vacancy', 'a.yoyRentGrowth': 'YoY rent growth',
  'a.assetVsMarket': 'Asset vs. market', 'a.capRateBenchmark': 'Cap rate benchmark',
  /* ownership — entity */
  'a.legalEntity': 'Legal entity', 'a.ownersStructure': 'Ownership structure', 'a.ownershipDist': 'Ownership split',
  'a.capitalStructure': 'Capital structure', 'a.netEquityPos': 'Net equity position', 'a.debtSummary': 'Debt summary',
  'a.contributions': 'Capital contributions',
  'a.entityName': 'Entity name', 'a.entityType': 'Entity type', 'a.entityRegistered': 'Registered',
  'a.taxElection': 'Tax election', 'a.entityFormed': 'Formed',
  /* ownership — owners table */
  'a.colOwner': 'Owner', 'a.colRole': 'Role', 'a.colOwnershipPct': 'Ownership %',
  'a.colContribution': 'Contribution', 'a.colCurrentEquity': 'Current equity value', 'a.colSince': 'Since',
  /* ownership — contributions table */
  'a.colContributor': 'Contributor', 'a.colAmount': 'Amount', 'a.colNote': 'Note',
  /* ownership — capital stack */
  'a.csDebt': 'Debt', 'a.csEquity': 'Equity', 'a.seniorLoan': 'Senior loan', 'a.netEquity': 'Net equity',
  'a.amount': 'Amount', 'a.stackSenior': 'Senior loan', 'a.stackContributed': 'Contribution',
  'a.stackRetained': 'Accum. retained earnings', 'a.stackNetEquity': 'Net equity',
  /* ownership — debt table */
  'a.colLender': 'Lender', 'a.colLoanBalance': 'Loan balance', 'a.colInterestRate': 'Rate',
  'a.colMaturity': 'Maturity', 'a.colDscr': 'DSCR', 'a.colLtv': 'LTV', 'a.colStatus': 'Status',
  /* ownership — net equity cards */
  'a.assetValue': 'Asset value', 'a.neAppraised': 'Estimated, May 2026',
  'a.neLtv': 'LTV', 'a.neOfAssetValue': 'of asset value', 'a.neTotalInvested': 'Total invested capital',
  /* ownership — guarantee */
  'a.guaranteeTitle': 'Active guarantee / obligation', 'a.gObligor': 'Obligor', 'a.gBeneficiary': 'Beneficiary',
  'a.gExpiry': 'Expiry', 'a.gDescription': 'Description',
  /* financial — income statement */
  'a.incomeStmtTitle': 'Income statement — Actual vs. Budget vs. Prior year',
  'a.incomeStmtSub': 'Trailing 12 months (Jun 2025 – May 2026) · NTD',
  'a.valuationHistory': 'Valuation history', 'a.valueProjection': 'Five-year value projection — Scenarios',
  'a.capexSummary': 'Capex summary',
  'a.colItem': 'Item', 'a.colActualTtm': 'Actual (TTM)', 'a.colBudget': 'Budget',
  'a.colPriorYear': 'Prior year', 'a.colVariance': 'Variance',
  /* financial — valuation cards */
  'a.purchasePrice': 'Purchase price', 'a.lastAppraisal': 'Last appraisal', 'a.currentEstValue': 'Current estimated value',
  'a.valueChange': 'Value change', 'a.capRate': 'cap rate', 'a.sinceAcq': 'since acquisition',
  'a.valuePM2': 'Value per m²', 'a.blendedPM2': 'Blended NT$/m²', 'a.ownerNetEquity': 'Owner net equity',
  'a.afterSeniorDebt': 'after senior debt',
  /* financial — charts */
  'a.tipValuation': 'Valuation', 'a.markMax': 'Max',
  /* financial — capex table */
  'a.colProject': 'Project', 'a.colYear': 'Year', 'a.colActualSpent': 'Actual / spent',
  'a.colRemaining': 'Remaining',
  /* risk — summary */
  'a.overallRisk': 'Overall risk', 'a.asOf': 'As of', 'a.highRisk': 'High risk', 'a.mediumRisk': 'Medium risk',
  'a.lowRisk': 'Low risk', 'a.highRiskOpen': 'Open high-risk items', 'a.mediumRiskOpen': 'Open medium-risk items',
  'a.lowRiskOpen': 'Open low-risk items',
  'a.probImpactMatrix': 'Probability / impact matrix',
  'a.matrixHint': 'X = Impact (1–5) · Y = Probability (1–5) · Dot = risk code',
  'a.riskRegister': 'Risk register', 'a.stressTest': 'Scenario stress test',
  'a.stressTestSub': 'Impact on cash flow or asset value under each stress scenario',
  'a.threeScenarioCf': 'Three-scenario cash-flow projection', 'a.mitigationPlan': 'Risk mitigation action plan',
  /* risk — register table */
  'a.colCode': 'Code', 'a.colRiskItem': 'Risk item', 'a.colProbability': 'Prob.',
  'a.colImpact': 'Impact', 'a.colScore': 'Score', 'a.colLevel': 'Level',
  /* risk — scenario cards */
  'a.baseCashFlow': 'Base cash flow', 'a.scenarioCashFlow': 'Scenario cash flow', 'a.change': 'Change',
  'a.perYear': '/yr', 'a.newDscr': 'New DSCR', 'a.baseAssetValue': 'Base asset value',
  'a.scenarioAssetValue': 'Scenario asset value', 'a.scenarioLtv': 'Scenario LTV',
  /* risk — matrix tooltip */
  'a.tipProbability': 'Probability', 'a.tipImpact': 'Impact', 'a.tipLevel': 'Level',
  /* risk — mitigation table */
  'a.colRiskCode': 'Risk code', 'a.colMitAction': 'Mitigation action',
  /* operations — titles */
  'a.priorityMatrix': 'Priority matrix', 'a.highUrgency': '← High urgency', 'a.lowUrgency': 'Low urgency →',
  'a.capexProjects': 'Capex projects', 'a.recurringOpex': 'Recurring opex', 'a.suppliers': 'Vendors & suppliers',
  'a.serviceHistory': 'Service history',
  /* operations — priority quadrant labels */
  'a.pmQ1': 'Do first (urgent + important)', 'a.pmQ2': 'Schedule (important, not urgent)',
  'a.pmQ3': 'Delegate (urgent, less important)', 'a.pmQ4': 'Delegate / eliminate',
  /* operations — capex table */
  'a.colSpent': 'Spent', 'a.colProgress': 'Progress', 'a.colContractor': 'Contractor',
  'a.colEstCompletion': 'Est. completion',
  /* operations — opex table */
  'a.colVendor': 'Vendor', 'a.colAnnualCost': 'Annual cost', 'a.colFrequency': 'Frequency',
  'a.colContractExpiry': 'Contract expiry',
  /* operations — suppliers table */
  'a.colContact': 'Contact', 'a.colContractPeriod': 'Contract period', 'a.colSlaWarranty': 'SLA / warranty',
  /* operations — service history table */
  'a.colWorkDesc': 'Work description', 'a.colCost': 'Cost',
  /* documents */
  'a.docLibrary': 'Document library',
  'a.colDocName': 'Document name', 'a.colDocId': 'ID', 'a.colSource': 'Source', 'a.colRelatedSection': 'Related section',
  'a.filterAll': 'All',
  /* market */
  'a.localMarketSummary': 'Local market summary — Da’an/Xinyi, Taipei',
  'a.competitiveness': 'Asset competitiveness (SWOT)', 'a.compSales': 'Comparable sales',
  'a.capRateTrend': 'Cap rate trend — Submarket', 'a.compRents': 'Rent comparables',
  'a.vacancyTrend': 'Vacancy trend — Submarket vs. asset', 'a.marketRisks': 'Market risks', 'a.marketOpps': 'Market opportunities',
  'a.swotStrengths': 'Strengths', 'a.swotWeaknesses': 'Weaknesses', 'a.swotOpportunities': 'Opportunities', 'a.swotThreats': 'Threats',
  /* market — comp sales table */
  'a.colUnits': 'Units', 'a.colYearBuilt': 'Year built', 'a.colSoldDate': 'Sold date',
  'a.colSalePrice': 'Sale price', 'a.colPricePerUnit': 'Price/unit', 'a.colPricePM2': 'Price/m²',
  'a.colCapRate': 'Cap rate', 'a.colOccupancy': 'Occupancy',
  /* market — rent comps table */
  'a.colUnitType': 'Unit type', 'a.colAreaM2': 'Area (m²)', 'a.colAskingRent': 'Asking rent',
  'a.colRentPM2': 'Rent/m²', 'a.colAmenities': 'Amenities', 'a.perMonth': '/mo',
  /* market — charts */
  'a.tipCapRate': 'Cap rate', 'a.legendSubmarket': 'Submarket',
  /* status labels (derived) — Complete/In Progress/Not Started/Open use shared status.* */
  'a.stProposed': 'Proposed', 'a.stMonitoring': 'Monitoring',
  'a.stActive': 'Active', 'a.stRenewalDue': 'Renewal due', 'a.stUnderConsideration': 'Under consideration'
  /* level labels (High/Medium/Low) use shared lvl.* */
});

/* ── Configuration ───────────────────────────────────────── */
const BASE_URL = './data/assets/';
const ASSET_ID = new URLSearchParams(window.location.search).get('id') || 'asset-001';

/* ── Global state ────────────────────────────────────────── */
const state = {
  latest: null,
  manifest: null,
  data: {}          // section id → parsed JSON
};

/* ── Chart registry — all instances resize together ─────── */
const chartInstances = [];
function initChart(domId) {
  const dom = el(domId);
  if (!dom) return null;
  const chart = echarts.init(dom, null, { renderer: 'svg' });
  chartInstances.push(chart);
  return chart;
}
window.addEventListener('resize', () => chartInstances.forEach(c => c.resize()));

/* ── ECharts base theme (BPM palette) ────────────────────── */
/* BPM data-viz palette — order: you/portfolio, peer/market, benchmark, forecast, mute */
const BPM_SERIES = ['#8E1B1F', '#33547A', '#1F5C4A', '#B5832A', '#8A8A8F'];
const CHART_COLORS = { blue: '#8E1B1F', green: '#1F5C4A', red: '#8E1B1F', amber: '#B5832A', gray: '#8A8A8F' };
const BPM = { ink:'#0B0B0C', ink3:'#5C5C61', rule:'#D8D5CE', grid:'#E5E5E7', paper:'#F5F1EA', bone:'#FBF8F2' };
const BPM_FONT = "'Inter','Noto Sans TC',system-ui,sans-serif";
const BPM_MONO = "'JetBrains Mono',ui-monospace,monospace";

const ECHARTS_BASE = {
  color: BPM_SERIES,
  textStyle: { fontFamily: BPM_FONT, fontSize: 11, color: BPM.ink3 },
  tooltip: {
    backgroundColor: BPM.bone, borderColor: BPM.rule, borderWidth: 1,
    textStyle: { color: BPM.ink, fontFamily: BPM_FONT, fontSize: 12 },
    extraCssText: 'border-radius:2px;box-shadow:0 8px 24px -12px rgba(11,11,12,0.15);'
  }
};
function bpmAxis(extra = {}) {
  return Object.assign({
    axisLine:  { lineStyle: { color: BPM.rule } },
    axisTick:  { show: false },
    axisLabel: { color: BPM.ink3, fontSize: 10, fontFamily: BPM_FONT },
    splitLine: { lineStyle: { color: BPM.grid, type: 'solid' } },
    nameTextStyle: { color: BPM.ink3, fontSize: 10 }
  }, extra);
}

/* ── Utility helpers ─────────────────────────────────────── */
function fmt(n, decimals = 0) {
  if (n == null) return '—';
  return new Intl.NumberFormat('zh-TW', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
}
function fmtNTD(n) {
  if (n == null) return '—';
  return 'NT$' + fmt(Math.abs(n));
}
function fmtNTDSign(n) {
  if (n == null) return '—';
  const s = fmtNTD(n);
  return n < 0 ? `(${s})` : s;
}
function fmtCompact(n) {
  if (n == null) return '—';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e9) return sign + '$' + (abs / 1e9).toFixed(1) + 'B';
  if (abs >= 1e6) return sign + '$' + (abs / 1e6).toFixed(1) + 'M';
  if (abs >= 1e3) return sign + '$' + Math.round(abs / 1e3) + 'K';
  return sign + '$' + Math.round(abs);
}
function fmtPct(n) { return n == null ? '—' : n.toFixed(1) + '%'; }
function escHtml(s) {
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function el(id) { return document.getElementById(id); }

function statusBadgeHtml(s) {
  const clsMap = {
    'Complete': 'complete', 'In Progress': 'in-progress', 'Not Started': 'not-started',
    'Proposed': 'proposed', 'Open': 'open', 'Monitoring': 'monitoring',
    'Active': 'active', 'Renewal Due': 'renewal-due', 'Current': 'active',
    'Under Consideration': 'proposed'
  };
  const labelMap = {
    'Complete': t('status.complete'), 'In Progress': t('status.inProgress'), 'Not Started': t('status.notStarted'),
    'Proposed': t('a.stProposed'), 'Open': t('status.open'), 'Monitoring': t('a.stMonitoring'),
    'Active': t('a.stActive'), 'Renewal Due': t('a.stRenewalDue'), 'Current': t('a.stActive'),
    'Under Consideration': t('a.stUnderConsideration')
  };
  const cls = clsMap[s] || 'not-started';
  const label = labelMap[s] || escHtml(s);
  return `<span class="status-badge ${cls}">${label}</span>`;
}

function riskLevelHtml(level) {
  const labels = { 'High': t('lvl.high'), 'Medium': t('lvl.medium'), 'Low': t('lvl.low') };
  const label = labels[level] || level;
  return `<span class="risk-badge ${level.toLowerCase()}">${label}</span>`;
}

/* ── Data loading ────────────────────────────────────────── */
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.json();
}

async function loadData() {
  showLoading(true);
  try {
    if (window.requireAuth) { const s = await window.requireAuth(); if (!s) return; }
    const res = await bpmLoadAsset(ASSET_ID);
    state.latest = res.latest;
    state.manifest = res.manifest;
    state.data = res.data;
    renderAll();
  } catch (err) {
    console.error(err);
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

function showLoading(v) { el('loading-overlay').style.display = v ? 'flex' : 'none'; }
function showError(msg)  { const b = el('error-banner'); b.textContent = '⚠ ' + t('a.loadFailed') + msg; b.style.display = 'block'; }

/* ── Render orchestrator ─────────────────────────────────── */
function renderAll() {
  renderNav();
  renderAssetHeader();
  renderOverview();
  renderOwnership();
  renderFinancial();
  renderRisk();
  renderOperations();
  renderDocuments();
  renderMarket();
}

/* ── Navigation ──────────────────────────────────────────── */
function renderNav() {
  const m = state.manifest;
  const updated = new Date(m.lastUpdated).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
  const updatedEl = el('nav-updated-date');
  if (updatedEl) updatedEl.textContent = updated;
  const periodSelect = el('nav-period-select');
  if (periodSelect) periodSelect.value = m.period;
  const periodDisplay = el('nav-period-display');
  if (periodDisplay) periodDisplay.textContent = m.period;
  // Mark the matching asset row active in the sidebar
  document.querySelectorAll('.side-row[data-asset]').forEach(row => {
    row.classList.toggle('active', row.getAttribute('data-asset') === ASSET_ID);
  });
}

/* ── Asset Header ────────────────────────────────────────── */
function renderAssetHeader() {
  const l = state.latest;
  const ov  = state.data['overview'];
  const fin = state.data['financial'];

  el('asset-name').textContent = l.assetName;
  el('asset-type-badge').textContent = l.assetType;
  el('asset-location-meta').textContent = l.location;
  el('asset-ownership-meta').textContent = state.latest?.ownershipMeta ?? '';
  el('asset-period-badge').textContent = state.manifest.periodLabel;

  const bcName = el('bc-asset-name');
  if (bcName) bcName.textContent = l.assetName;

  const pill = el('asset-status-pill');
  const cls = l.statusColor === 'amber' ? 'hold' : l.statusColor === 'green' ? 'active' : 'vacant';
  pill.className = `status-pill ${cls}`;
  pill.textContent = l.status;

  if (fin?.valuation) {
    el('hdr-value').textContent = fmtCompact(fin.valuation.currentEstimatedValue);
  }
  if (ov?.basicInfo) {
    el('hdr-gba').textContent = fmt(Math.round(ov.basicInfo.totalGSF * 0.0929)) + ' m²';
  }
}

/* ── Tab switching ───────────────────────────────────────── */
function initTabs() {
  const tabNames = {
    'panel-overview':    t('a.tabOverview'),
    'panel-ownership':   t('a.tabOwnership'),
    'panel-financial':   t('a.tabFinancial'),
    'panel-risk':        t('a.tabRisk'),
    'panel-operations':  t('a.tabOperations'),
    'panel-documents':   t('a.tabDocuments'),
    'panel-market':      t('a.tabMarket')
  };
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      el(btn.dataset.panel).classList.add('active');
      const bcTab = el('bc-current-tab');
      if (bcTab) bcTab.textContent = tabNames[btn.dataset.panel] || btn.textContent.trim();
      // Charts in previously-hidden panels were 0×0 at init; resize now that panel is visible
      requestAnimationFrame(() => chartInstances.forEach(c => c.resize()));
    });
  });
}

/* ============================================================
   OVERVIEW TAB
   ============================================================ */
function renderOverview() {
  const d = state.data['overview'];

  /* Summary */
  el('ov-summary-narrative').textContent = d.summary.narrative;
  el('ov-summary-keymessage').textContent = d.summary.keyMessage;

  /* Basic Info */
  const bi = d.basicInfo;
  el('ov-basic-info').innerHTML = `
    <table class="info-table">
      <tr><td class="info-label">${t('a.assetName')}</td><td class="info-value">${escHtml(bi.assetName)}</td></tr>
      <tr><td class="info-label">${t('a.assetType')}</td><td class="info-value">${escHtml(bi.assetType)}</td></tr>
      <tr><td class="info-label">${t('a.address')}</td><td class="info-value">${escHtml(bi.location)}</td></tr>
      <tr><td class="info-label">${t('a.submarket')}</td><td class="info-value">${escHtml(bi.submarket)}</td></tr>
      <tr><td class="info-label">${t('a.yearBuiltAcquired')}</td><td class="info-value">${bi.yearBuilt} / ${bi.yearAcquired}</td></tr>
      <tr><td class="info-label">${t('a.totalUnits')}</td><td class="info-value">${bi.totalUnits}（${bi.residentialUnits} ${t('a.unitsResidential')} + ${bi.commercialUnits} ${t('a.unitsCommercial')}）</td></tr>
      <tr><td class="info-label">${t('a.totalGba')}</td><td class="info-value">${fmt(Math.round(bi.totalGSF * 0.0929))} m²</td></tr>
      <tr><td class="info-label">${t('a.currentStatus')}</td><td class="info-value">${escHtml(bi.currentStatus)}</td></tr>
      <tr><td class="info-label">${t('a.reportingPeriod')}</td><td class="info-value">${escHtml(bi.reportingPeriod)}</td></tr>
      <tr><td class="info-label">${t('a.ownershipSummary')}</td><td class="info-value">${escHtml(bi.ownershipSummary)}</td></tr>
    </table>`;

  /* Key Figures Strip */
  el('ov-key-figures').innerHTML = d.keyFigures.map(kf => `
    <div class="kf-item">
      <div class="kf-label">${escHtml(kf.label)}</div>
      <div class="kf-value">${escHtml(kf.value)}</div>
      <div class="kf-sub">
        <span>${escHtml(kf.subLabel)}</span>
        ${kf.trend ? `<span class="kf-trend ${kf.trend}">${escHtml(kf.trendValue)}</span>` : ''}
      </div>
    </div>`).join('');

  /* KPI Cards */
  el('ov-kpi-cards').innerHTML = d.kpiCards.map(k => `
    <div class="kpi-card">
      <div class="kpi-label">${escHtml(k.title)}</div>
      <div class="kpi-value">${escHtml(k.value)}</div>
      <div class="kpi-period">${escHtml(k.period)}</div>
      <div class="kpi-trend ${k.trendDir}">${escHtml(k.trend)}</div>
      <div class="kpi-chart" id="kpi-chart-${k.id}"></div>
    </div>`).join('');

  /* Defer init to rAF so grid layout is computed and clientWidth is available */
  requestAnimationFrame(() => d.kpiCards.forEach(k => renderKpiChart(k)));

  /* Actions */
  el('ov-actions').innerHTML = d.actions.map(a => `
    <div class="card action-card ${a.priority.toLowerCase()} mb-12">
      <div class="action-header">
        <div class="action-title">${escHtml(a.title)}</div>
        <span class="priority-badge ${a.priority.toLowerCase()}">${priorityLabel(a.priority)}</span>
        ${statusBadgeHtml(a.status)}
      </div>
      <div class="action-body">${escHtml(a.recommendation)}</div>
      <div class="action-meta">
        <div class="action-meta-item"><strong>${t('a.decisionNeeded')}</strong> ${escHtml(a.decisionNeeded)}</div>
        <div class="action-meta-item"><strong>${t('a.owner')}</strong> ${escHtml(a.owner)}</div>
        <div class="action-meta-item"><strong>${t('a.deadline')}</strong> ${escHtml(a.deadline)}</div>
      </div>
    </div>`).join('');

  /* Linked Documents */
  el('ov-linked-docs').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>${t('a.colDocument')}</th><th>${t('a.colCategory')}</th><th>${t('a.colDate')}</th><th>${t('a.colType')}</th>
      </tr></thead>
      <tbody>${d.linkedDocuments.map(doc => `
        <tr>
          <td><a href="#" class="doc-link">${escHtml(doc.name)}</a></td>
          <td><span class="doc-category-badge">${escHtml(doc.category)}</span></td>
          <td class="text-muted">${escHtml(doc.date)}</td>
          <td><span class="doc-type-badge">${escHtml(doc.type)}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Top Risks */
  el('ov-top-risks').innerHTML = d.topRisks.map(r => `
    <div class="row-between mb-8" style="border-bottom:1px solid var(--border);padding-bottom:8px;">
      <div>
        ${riskLevelHtml(r.level)}
        <span style="font-size:13px;font-weight:600;margin-left:8px;">${escHtml(r.title)}</span>
      </div>
    </div>
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;">${escHtml(r.impact)}</div>
  `).join('');

  /* Market Snapshot */
  const ms = d.marketSnapshot;
  el('ov-market-snapshot').innerHTML = `
    <table class="info-table">
      <tr><td class="info-label">${t('a.submarket')}</td><td class="info-value">${escHtml(ms.submarket)}</td></tr>
      <tr><td class="info-label">${t('a.medianRentPM2')}</td><td class="info-value">${escHtml(ms.medianRentPM2)}</td></tr>
      <tr><td class="info-label">${t('a.vacancyRate')}</td><td class="info-value">${escHtml(ms.vacancyRate)}</td></tr>
      <tr><td class="info-label">${t('a.yoyRentGrowth')}</td><td class="info-value">${escHtml(ms.yoyRentGrowth)}</td></tr>
      <tr><td class="info-label">${t('a.assetVsMarket')}</td><td class="info-value">${escHtml(ms.assetVsMarket)}</td></tr>
      <tr><td class="info-label">${t('a.capRateBenchmark')}</td><td class="info-value">${escHtml(ms.capRateBenchmark)}</td></tr>
    </table>`;
}

function priorityLabel(p) {
  const map = { 'High': t('a.priHigh'), 'Medium': t('a.priMedium'), 'Low': t('a.priLow') };
  return map[p] || p;
}

function renderKpiChart(kpi) {
  const chart = initChart(`kpi-chart-${kpi.id}`);
  if (!chart) return;
  const cd = kpi.chartData;
  const isLine = kpi.chartType === 'line';
  chart.setOption({
    ...ECHARTS_BASE,
    grid: { top: 4, bottom: 20, left: 0, right: 0, containLabel: false },
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', confine: true },
    xAxis: bpmAxis({ type: 'category', data: cd.labels, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 9, color: BPM.ink3, fontFamily: BPM_FONT }, splitLine: { show: false } }),
    yAxis: { type: 'value', show: false },
    series: [{
      type: isLine ? 'line' : 'bar',
      data: cd.values,
      smooth: true,
      symbol: 'none',
      itemStyle: { color: CHART_COLORS.red, borderRadius: 0 },
      lineStyle: { width: 2 },
      areaStyle: isLine ? { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(142,27,31,0.2)' }, { offset: 1, color: 'rgba(142,27,31,0)' }] } } : null
    }]
  });
}

/* ============================================================
   OWNERSHIP & CAPITAL STRUCTURE TAB
   ============================================================ */
function renderOwnership() {
  const d = state.data['ownership-capital'];

  /* Entity info */
  el('ow-entity-info').innerHTML = `
    <table class="info-table">
      <tr><td class="info-label">${t('a.entityName')}</td><td class="info-value">${escHtml(d.entity.name)}</td></tr>
      <tr><td class="info-label">${t('a.entityType')}</td><td class="info-value">${escHtml(d.entity.type)}</td></tr>
      <tr><td class="info-label">${t('a.entityRegistered')}</td><td class="info-value">${escHtml(d.entity.registered)}</td></tr>
      <tr><td class="info-label">${t('a.taxElection')}</td><td class="info-value">${escHtml(d.entity.taxElection)}</td></tr>
      <tr><td class="info-label">${t('a.entityFormed')}</td><td class="info-value">${escHtml(d.entity.formed)}</td></tr>
    </table>`;

  /* Ownership table */
  el('ow-owners-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>${t('a.colOwner')}</th><th>${t('a.colType')}</th><th>${t('a.colRole')}</th>
        <th class="num">${t('a.colOwnershipPct')}</th>
        <th class="num">${t('a.colContribution')}</th>
        <th class="num">${t('a.colCurrentEquity')}</th>
        <th>${t('a.colSince')}</th>
      </tr></thead>
      <tbody>${d.owners.map(o => `
        <tr>
          <td class="font-bold">${escHtml(o.name)}</td>
          <td class="text-secondary">${escHtml(o.type)}</td>
          <td>${escHtml(o.role)}</td>
          <td class="num font-bold">${fmtPct(o.ownershipPct)}</td>
          <td class="num">${fmtNTD(o.equityContributed)}</td>
          <td class="num font-bold">${fmtNTD(o.currentEquityValue)}</td>
          <td class="text-muted">${escHtml(o.since)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Ownership donut chart */
  const ownershipChart = initChart('ow-donut-chart');
  ownershipChart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'item', formatter: '{b}: {d}%' },
    legend: { bottom: 0, textStyle: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 } },
    series: [{
      type: 'pie', radius: ['40%', '68%'], center: ['50%', '45%'],
      data: d.owners.map((o, i) => ({ name: o.name, value: o.ownershipPct, itemStyle: { color: BPM_SERIES[i % BPM_SERIES.length] } })),
      label: { fontSize: 11, color: BPM.ink3, formatter: '{b}\n{d}%' },
      itemStyle: { borderWidth: 2, borderColor: '#FBF8F2' }
    }]
  });

  /* Equity contributions */
  el('ow-contributions-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>${t('a.colDate')}</th><th>${t('a.colContributor')}</th><th>${t('a.colType')}</th>
        <th class="num">${t('a.colAmount')}</th><th>${t('a.colNote')}</th>
      </tr></thead>
      <tbody>${d.capitalContributions.map(c => `
        <tr>
          <td class="text-muted">${escHtml(c.date)}</td>
          <td>${escHtml(c.contributor)}</td>
          <td><span class="doc-category-badge">${escHtml(c.type)}</span></td>
          <td class="num">${fmtNTD(c.amount)}</td>
          <td class="text-secondary">${escHtml(c.note)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Capital Stack */
  const cs = d.capitalStack;
  const debtPct = cs.seniorDebtPct;
  const eqPct   = cs.equityPct;
  el('ow-capital-stack').innerHTML = `
    <div class="capital-stack-bar">
      <div class="cs-segment cs-debt"  style="width:${debtPct}%">${t('a.csDebt')} ${debtPct.toFixed(1)}%</div>
      <div class="cs-segment cs-equity"style="width:${eqPct}%">${t('a.csEquity')} ${eqPct.toFixed(1)}%</div>
    </div>
    <div class="cs-legend mb-12">
      <div class="cs-legend-item"><div class="cs-legend-dot" style="background:var(--red)"></div>${t('a.seniorLoan')} — ${fmtNTD(cs.seniorDebt)}</div>
      <div class="cs-legend-item"><div class="cs-legend-dot" style="background:var(--info)"></div>${t('a.netEquity')} — ${fmtNTD(cs.netEquity)}</div>
    </div>`;

  /* Capital stack waterfall chart */
  const stackChart = initChart('ow-stack-chart');
  stackChart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', confine: true, formatter: (p) => p.map(s => `${s.seriesName}: ${fmtCompact(s.value)}`).join('<br>') },
    legend: { bottom: 0, textStyle: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 } },
    grid: { top: 10, bottom: 40, left: 80, right: 20 },
    xAxis: bpmAxis({ type: 'category', data: [t('a.stackSenior'), t('a.stackContributed'), t('a.stackRetained'), t('a.stackNetEquity')], splitLine: { show: false } }),
    yAxis: bpmAxis({ type: 'value', axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 10, formatter: v => '$' + (v/1e6).toFixed(0) + 'M' } }),
    series: [{
      name: t('a.amount'), type: 'bar', barWidth: '50%',
      data: [cs.seniorDebt, cs.equityContributed, cs.accumulatedRetainedEarnings, cs.netEquity],
      itemStyle: { color: (params) => [BPM_SERIES[0], BPM_SERIES[1], BPM_SERIES[2], BPM_SERIES[3]][params.dataIndex], borderRadius: 0 },
      label: { show: true, position: 'top', color: BPM.ink3, formatter: p => '$' + (p.value/1e6).toFixed(0) + 'M', fontSize: 10 }
    }]
  });

  /* Debt table */
  el('ow-debt-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>${t('a.colLender')}</th><th>${t('a.colType')}</th><th>${t('a.colLoanBalance')}</th>
        <th>${t('a.colInterestRate')}</th><th>${t('a.colMaturity')}</th><th>${t('a.colDscr')}</th><th>${t('a.colLtv')}</th><th>${t('a.colStatus')}</th>
      </tr></thead>
      <tbody>${d.debtSummary.map(loan => `
        <tr>
          <td class="font-bold">${escHtml(loan.lender)}</td>
          <td class="text-secondary">${escHtml(loan.type)}</td>
          <td class="num">${fmtNTD(loan.currentBalance)}</td>
          <td>${escHtml(loan.interestRate)} <span class="text-muted">${escHtml(loan.rateType)}</span></td>
          <td>${escHtml(loan.maturityDate)}</td>
          <td class="num font-bold">${escHtml(loan.dscr)}</td>
          <td class="num">${escHtml(loan.ltv)}</td>
          <td>${statusBadgeHtml(loan.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Net equity */
  el('ow-net-equity').innerHTML = `
    <div class="grid-4">
      <div class="card val-card">
        <div class="val-label">${t('a.assetValue')}</div>
        <div class="val-value">${fmtNTD(cs.assetValue)}</div>
        <div class="val-sub">${t('a.neAppraised')}</div>
      </div>
      <div class="card val-card">
        <div class="val-label">${t('a.seniorLoan')}</div>
        <div class="val-value" style="color:var(--red)">${fmtNTD(cs.seniorDebt)}</div>
        <div class="val-sub">${fmtPct(cs.seniorDebtPct)} ${t('a.neLtv')}</div>
      </div>
      <div class="card val-card">
        <div class="val-label">${t('a.netEquity')}</div>
        <div class="val-value" style="color:var(--green)">${fmtNTD(cs.netEquity)}</div>
        <div class="val-sub">${fmtPct(cs.equityPct)} ${t('a.neOfAssetValue')}</div>
      </div>
      <div class="card val-card">
        <div class="val-label">${t('a.stackContributed')}</div>
        <div class="val-value">${fmtNTD(cs.equityContributed)}</div>
        <div class="val-sub">${t('a.neTotalInvested')}</div>
      </div>
    </div>`;

  /* Guarantee */
  el('ow-guarantee').innerHTML = d.guaranteesObligations.map(g => `
    <div class="guarantee-card mb-12">
      <div class="guarantee-title">${t('a.guaranteeTitle')}</div>
      <table class="info-table">
        <tr><td class="info-label">${t('a.colType')}</td><td class="info-value">${escHtml(g.type)}</td></tr>
        <tr><td class="info-label">${t('a.gObligor')}</td><td class="info-value">${escHtml(g.obligor)}</td></tr>
        <tr><td class="info-label">${t('a.gBeneficiary')}</td><td class="info-value">${escHtml(g.beneficiary)}</td></tr>
        <tr><td class="info-label">${t('a.colAmount')}</td><td class="info-value">${fmtNTD(g.amount)}</td></tr>
        <tr><td class="info-label">${t('a.gExpiry')}</td><td class="info-value">${escHtml(g.expiryDate)}</td></tr>
        <tr><td class="info-label">${t('a.gDescription')}</td><td class="info-value">${escHtml(g.description)}</td></tr>
      </table>
    </div>`).join('');
}

/* ============================================================
   FINANCIAL STATEMENT & VALUATION TAB
   ============================================================ */
function renderFinancial() {
  const d = state.data['financial'];

  /* Income Statement */
  const typeMap = {
    income:    '',
    deduction: 'neg',
    expense:   'neg',
    subtotal:  'row-subtotal',
    noi:       'row-noi',
    total:     'row-total'
  };
  el('fin-income-statement').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>${t('a.colItem')}</th>
        <th class="num">${t('a.colActualTtm')}</th>
        <th class="num">${t('a.colBudget')}</th>
        <th class="num">${t('a.colPriorYear')}</th>
        <th class="num">${t('a.colVariance')}</th>
      </tr></thead>
      <tbody>${d.incomeStatement.rows.map(row => {
        const rowClass = typeMap[row.type] || '';
        const indentClass = row.indent > 0 ? 'indent' : '';
        const actual = row.actual;
        const budget = row.budget;
        const variance = actual - budget;
        const isNeg = actual < 0;
        const varClass = variance >= 0 ? 'pos' : 'neg';
        return `<tr class="${rowClass}">
          <td class="${indentClass}">${escHtml(row.label)}</td>
          <td class="num ${isNeg ? 'neg' : ''}">${fmtNTDSign(actual)}</td>
          <td class="num text-muted">${fmtNTDSign(budget)}</td>
          <td class="num text-muted">${fmtNTDSign(row.priorYear)}</td>
          <td class="num ${varClass}">${variance >= 0 ? '+' : ''}${fmtNTDSign(variance)}</td>
        </tr>`;
      }).join('')}
      </tbody>
    </table>`;

  /* Valuation cards */
  const v = d.valuation;
  el('fin-valuation-cards').innerHTML = `
    <div class="grid-4 mb-16">
      <div class="card val-card">
        <div class="val-label">${t('a.purchasePrice')}</div>
        <div class="val-value">${fmtNTD(v.purchasePrice)}</div>
        <div class="val-sub">${escHtml(v.purchaseDate)}</div>
      </div>
      <div class="card val-card">
        <div class="val-label">${t('a.lastAppraisal')}</div>
        <div class="val-value">${fmtNTD(v.lastAppraisalValue)}</div>
        <div class="val-sub">${escHtml(v.lastAppraisalDate)}</div>
      </div>
      <div class="card val-card">
        <div class="val-label">${t('a.currentEstValue')}</div>
        <div class="val-value">${fmtNTD(v.currentEstimatedValue)}</div>
        <div class="val-sub">${escHtml(v.impliedCapRate)} ${t('a.capRate')}</div>
      </div>
      <div class="card val-card">
        <div class="val-label">${t('a.valueChange')}</div>
        <div class="val-value val-delta pos">+${fmtNTD(v.valueChange)}</div>
        <div class="val-sub">+${fmtPct(v.valueChangePct)} ${t('a.sinceAcq')}</div>
      </div>
    </div>
    <div class="grid-2 mb-16">
      <div class="card val-card">
        <div class="val-label">${t('a.valuePM2')}</div>
        <div class="val-value">NT$${fmt(v.valuePM2)}</div>
        <div class="val-sub">${t('a.blendedPM2')}</div>
      </div>
      <div class="card val-card">
        <div class="val-label">${t('a.ownerNetEquity')}</div>
        <div class="val-value" style="color:var(--green)">${fmtNTD(v.netEquity)}</div>
        <div class="val-sub">${t('a.afterSeniorDebt')}</div>
      </div>
    </div>`;

  /* Valuation history chart */
  const vhChart = initChart('fin-valuation-chart');
  vhChart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', formatter: p => `${p[0].axisValue}<br>${t('a.tipValuation')}：${fmtCompact(p[0].value)}` },
    grid: { top: 10, bottom: 30, left: 90, right: 20 },
    xAxis: bpmAxis({ type: 'category', data: v.history.map(h => h.date.substr(0,7)), splitLine: { show: false } }),
    yAxis: bpmAxis({ type: 'value', axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 10, formatter: val => '$' + (val/1e6).toFixed(0)+'M' } }),
    series: [{
      type: 'line', data: v.history.map(h => h.value),
      smooth: true, symbol: 'circle', symbolSize: 6,
      itemStyle: { color: CHART_COLORS.red },
      lineStyle: { width: 2.5 },
      areaStyle: { color: { type:'linear', x:0,y:0,x2:0,y2:1, colorStops:[{offset:0,color:'rgba(142,27,31,0.18)'},{offset:1,color:'rgba(142,27,31,0)'}] } },
      markPoint: { data: [{ type: 'max', name: t('a.markMax') }], symbolSize: 36, label: { color: '#FBF8F2', fontSize: 10 } }
    }]
  });

  /* Projection chart */
  const proj = d.projections;
  const projChart = initChart('fin-projection-chart');
  projChart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', formatter: (p) => `${p[0].axisValue}<br>${p.map(s=>`${s.seriesName}: ${fmtCompact(s.value)}`).join('<br>')}` },
    legend: { bottom: 0, textStyle: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 } },
    grid: { top: 10, bottom: 40, left: 90, right: 20 },
    xAxis: bpmAxis({ type: 'category', data: proj.years, axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 }, splitLine: { show: false } }),
    yAxis: bpmAxis({ type: 'value', axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 10, formatter: v => '$' + (v/1e6).toFixed(0)+'M' } }),
    series: [
      { name: t('sc.downside'), type: 'line', data: proj.value.Downside, smooth: true, symbol: 'none', lineStyle: { color: '#8E1B1F', type: 'dashed', width: 1.5 }, itemStyle: { color: '#8E1B1F' } },
      { name: t('sc.base'), type: 'line', data: proj.value.Base,     smooth: true, symbol: 'none', lineStyle: { color: '#0B0B0C', width: 2.5 }, itemStyle: { color: '#0B0B0C' } },
      { name: t('sc.upside'), type: 'line', data: proj.value.Upside,   smooth: true, symbol: 'none', lineStyle: { color: '#1F5C4A', type: 'dashed', width: 1.5 }, itemStyle: { color: '#1F5C4A' } }
    ]
  });

  /* Capex table */
  el('fin-capex-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>${t('a.colProject')}</th><th>${t('a.colYear')}</th>
        <th class="num">${t('a.colBudget')}</th><th class="num">${t('a.colActualSpent')}</th><th class="num">${t('a.colRemaining')}</th>
        <th>${t('a.colStatus')}</th><th>${t('a.colNote')}</th>
      </tr></thead>
      <tbody>${d.capex.map(c => `
        <tr>
          <td class="font-bold">${escHtml(c.project)}</td>
          <td class="text-muted">${c.year}</td>
          <td class="num">${fmtNTD(c.budgeted)}</td>
          <td class="num">${c.actual > 0 ? fmtNTD(c.actual) : '<span class="text-muted">—</span>'}</td>
          <td class="num">${c.budgeted - c.actual > 0 ? fmtNTD(c.budgeted - c.actual) : '<span class="text-muted">—</span>'}</td>
          <td>${statusBadgeHtml(c.status)}</td>
          <td class="text-secondary">${escHtml(c.notes)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

/* ============================================================
   RISK & SCENARIO ANALYSIS TAB
   ============================================================ */
function renderRisk() {
  const d = state.data['risk'];

  /* Summary cards */
  el('risk-summary-cards').innerHTML = `
    <div class="grid-4">
      <div class="card val-card">
        <div class="val-label">${t('a.overallRisk')}</div>
        <div class="val-value" style="color:var(--amber)">${escHtml(d.summary.overallRiskLevel)}</div>
        <div class="val-sub">${t('a.asOf')} ${escHtml(d.summary.lastReviewed)}</div>
      </div>
      <div class="card val-card">
        <div class="val-label" style="color:var(--red)">${t('a.highRisk')}</div>
        <div class="val-value" style="color:var(--red)">${d.summary.highRisks}</div>
        <div class="val-sub">${t('a.highRiskOpen')}</div>
      </div>
      <div class="card val-card">
        <div class="val-label" style="color:var(--amber)">${t('a.mediumRisk')}</div>
        <div class="val-value" style="color:var(--amber)">${d.summary.mediumRisks}</div>
        <div class="val-sub">${t('a.mediumRiskOpen')}</div>
      </div>
      <div class="card val-card">
        <div class="val-label" style="color:var(--green)">${t('a.lowRisk')}</div>
        <div class="val-value" style="color:var(--green)">${d.summary.lowRisks}</div>
        <div class="val-sub">${t('a.lowRiskOpen')}</div>
      </div>
    </div>`;

  /* Risk register */
  el('risk-register-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>${t('a.colCode')}</th><th>${t('a.colCategory')}</th><th>${t('a.colRiskItem')}</th>
        <th class="num">${t('a.colProbability')}</th><th class="num">${t('a.colImpact')}</th><th class="num">${t('a.colScore')}</th>
        <th>${t('a.colLevel')}</th><th>${t('a.colOwner2')}</th><th>${t('a.colStatus')}</th>
      </tr></thead>
      <tbody>${d.register.map(r => `
        <tr>
          <td class="text-muted font-mono">${r.id}</td>
          <td><span class="doc-category-badge">${escHtml(r.category)}</span></td>
          <td>
            <div class="font-bold">${escHtml(r.title)}</div>
            <div class="text-secondary text-sm">${escHtml(r.description)}</div>
          </td>
          <td class="num">${r.probability}</td>
          <td class="num">${r.impact}</td>
          <td class="num font-bold">${r.riskScore}</td>
          <td>${riskLevelHtml(r.level)}</td>
          <td class="text-secondary">${escHtml(r.owner)}</td>
          <td>${statusBadgeHtml(r.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Risk matrix chart */
  renderRiskMatrix(d.register);

  /* Scenario cards */
  el('risk-scenarios').innerHTML = d.scenarios.map(s => `
    <div class="scenario-card">
      <div class="scenario-title">${escHtml(s.name)}</div>
      ${s.scenarioCashFlow != null ? `
        <div class="scenario-stat"><span class="s-label">${t('a.baseCashFlow')}</span><span class="s-val">${fmtNTD(s.baseCashFlow)}</span></div>
        <div class="scenario-stat"><span class="s-label">${t('a.scenarioCashFlow')}</span><span class="s-val" style="color:var(--red)">${fmtNTD(s.scenarioCashFlow)}</span></div>
        <div class="scenario-stat"><span class="s-label">${t('a.change')}</span><span class="s-val neg">${fmtNTDSign(s.cashFlowDelta)}${t('a.perYear')}</span></div>
        ${s.newDSCR ? `<div class="scenario-stat"><span class="s-label">${t('a.newDscr')}</span><span class="s-val">${s.newDSCR}</span></div>` : ''}
      ` : `
        <div class="scenario-stat"><span class="s-label">${t('a.baseAssetValue')}</span><span class="s-val">${fmtNTD(s.baseValue)}</span></div>
        <div class="scenario-stat"><span class="s-label">${t('a.scenarioAssetValue')}</span><span class="s-val" style="color:var(--red)">${fmtNTD(s.scenarioValue)}</span></div>
        <div class="scenario-stat"><span class="s-label">${t('a.scenarioLtv')}</span><span class="s-val">${fmtPct(s.scenarioLTV)}</span></div>
      `}
      <div class="scenario-verdict">${escHtml(s.verdict)}</div>
    </div>`).join('');

  /* Scenario cash flow chart */
  const sc = d.scenarioChart;
  const scenChart = initChart('risk-scenario-chart');
  scenChart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', formatter: p => `${p[0].axisValue}<br>${p.map(s=>`${s.seriesName}: ${fmtCompact(s.value)}`).join('<br>')}` },
    legend: { bottom: 0, textStyle: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 } },
    grid: { top: 10, bottom: 40, left: 90, right: 20 },
    xAxis: bpmAxis({ type: 'category', data: sc.labels, splitLine: { show: false } }),
    yAxis: bpmAxis({ type: 'value', axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 10, formatter: v => fmtCompact(v) } }),
    series: [
      { name: t('sc.downside'), type: 'line', data: sc.cashFlow.Downside, smooth: true, symbol: 'none', lineStyle: { color: '#8E1B1F', type: 'dashed', width: 1.5 }, itemStyle: { color: '#8E1B1F' } },
      { name: t('sc.base'), type: 'line', data: sc.cashFlow.Base,     smooth: true, symbol: 'none', lineStyle: { color: '#0B0B0C', width: 2.5 }, itemStyle: { color: '#0B0B0C' } },
      { name: t('sc.upside'), type: 'line', data: sc.cashFlow.Upside,   smooth: true, symbol: 'none', lineStyle: { color: '#1F5C4A', type: 'dashed', width: 1.5 }, itemStyle: { color: '#1F5C4A' } }
    ]
  });

  /* Mitigation plan */
  el('risk-mitigation-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>${t('a.colRiskCode')}</th><th>${t('a.colMitAction')}</th><th>${t('a.colOwner')}</th><th>${t('a.colDeadline')}</th><th>${t('a.colStatus')}</th>
      </tr></thead>
      <tbody>${d.mitigationPlan.map(m => `
        <tr>
          <td class="text-muted font-mono">${m.riskId}</td>
          <td>${escHtml(m.action)}</td>
          <td class="text-secondary">${escHtml(m.owner)}</td>
          <td class="text-muted">${escHtml(m.deadline)}</td>
          <td>${statusBadgeHtml(m.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function renderRiskMatrix(register) {
  /* ECharts scatter plot as probability/impact matrix */
  const chart = initChart('risk-matrix-chart');
  const colorMap = { High: '#8E1B1F', Medium: '#B5832A', Low: '#1F5C4A' };
  const levelLabel = { High: t('lvl.high'), Medium: t('lvl.medium'), Low: t('lvl.low') };
  chart.setOption({
    ...ECHARTS_BASE,
    tooltip: {
      ...ECHARTS_BASE.tooltip,
      trigger: 'item',
      formatter: p => {
        const r = register.find(x => x.id === p.data[2]);
        return r ? `<b>${r.id} — ${r.title}</b><br>${t('a.tipProbability')}：${r.probability} / ${t('a.tipImpact')}：${r.impact}<br>${t('a.tipLevel')}：${levelLabel[r.level] || r.level}` : '';
      }
    },
    xAxis: bpmAxis({ type: 'value', name: t('a.tipImpact'), min: 0, max: 6, nameLocation: 'middle', nameGap: 25 }),
    yAxis: bpmAxis({ type: 'value', name: t('a.tipProbability'), min: 0, max: 6, nameLocation: 'middle', nameGap: 30 }),
    grid: { top: 20, bottom: 50, left: 60, right: 20 },
    series: [{
      type: 'scatter',
      symbolSize: 32,
      data: register.map(r => [r.impact, r.probability, r.id]),
      itemStyle: { color: p => colorMap[register.find(x => x.id === p.data[2])?.level] || CHART_COLORS.gray, opacity: 0.85 },
      label: { show: true, formatter: p => p.data[2], fontSize: 9, fontWeight: 700, color: '#FBF8F2' }
    }]
  });
}

/* ============================================================
   OPERATIONS & SUPPLIERS TAB
   ============================================================ */
function renderOperations() {
  const d = state.data['operations'];

  /* Priority matrix quadrants */
  const quadrantMap = { 'Do First': 'q1', 'Schedule': 'q2', 'Delegate': 'q4', 'Eliminate': 'q3' };
  const quadrantLabels = {
    q1: { label: t('a.pmQ1'),     el: 'pm-q1' },
    q2: { label: t('a.pmQ2'),      el: 'pm-q2' },
    q3: { label: t('a.pmQ3'),    el: 'pm-q3' },
    q4: { label: t('a.pmQ4'),                  el: 'pm-q4' }
  };

  const qItems = { q1: [], q2: [], q3: [], q4: [] };
  d.priorityMatrix.items.forEach(item => {
    const q = quadrantMap[item.quadrant] || 'q4';
    qItems[q].push(item);
  });

  Object.entries(quadrantLabels).forEach(([q, meta]) => {
    el(meta.el).innerHTML = `
      <div class="pm-quadrant-label">${meta.label}</div>
      ${qItems[q].map(item => `
        <div class="pm-item">
          <div class="pm-item-title">${escHtml(item.title)}</div>
          <div class="pm-item-meta">${escHtml(item.owner)} · ${escHtml(item.deadline)} · ${statusBadgeHtml(item.status)}</div>
        </div>`).join('')}`;
  });

  /* Capex projects table */
  el('ops-capex-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>${t('a.colProject')}</th><th class="num">${t('a.colBudget')}</th><th class="num">${t('a.colSpent')}</th>
        <th>${t('a.colProgress')}</th><th>${t('a.colContractor')}</th><th>${t('a.colEstCompletion')}</th><th>${t('a.colStatus')}</th>
      </tr></thead>
      <tbody>${d.capexProjects.map(c => `
        <tr>
          <td>
            <div class="font-bold">${escHtml(c.project)}</div>
            <div class="text-secondary text-sm">${escHtml(c.expectedROI)}</div>
          </td>
          <td class="num">${fmtNTD(c.budgeted)}</td>
          <td class="num">${c.spent > 0 ? fmtNTD(c.spent) : '<span class="text-muted">—</span>'}</td>
          <td style="min-width:120px">
            <div class="progress-bar-wrap">
              <div class="progress-bar"><div class="progress-bar-fill" style="width:${c.pctComplete}%"></div></div>
              <span class="progress-label">${c.pctComplete}%</span>
            </div>
          </td>
          <td class="text-secondary">${escHtml(c.contractor)}</td>
          <td class="text-muted">${escHtml(c.estCompletion)}</td>
          <td>${statusBadgeHtml(c.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* OpEx recurring */
  el('ops-opex-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>${t('a.colCategory')}</th><th>${t('a.colVendor')}</th><th class="num">${t('a.colAnnualCost')}</th>
        <th>${t('a.colFrequency')}</th><th>${t('a.colContractExpiry')}</th><th>${t('a.colStatus')}</th><th>${t('a.colNote')}</th>
      </tr></thead>
      <tbody>${d.opexRecurring.map(o => `
        <tr>
          <td><span class="doc-category-badge">${escHtml(o.category)}</span></td>
          <td>${escHtml(o.vendor)}</td>
          <td class="num">${fmtNTD(o.annualCost)}</td>
          <td class="text-secondary">${escHtml(o.frequency)}</td>
          <td class="text-muted">${escHtml(o.contractExpiry)}</td>
          <td>${statusBadgeHtml(o.status || 'Active')}</td>
          <td class="text-secondary">${escHtml(o.notes)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Suppliers */
  el('ops-suppliers-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>${t('a.colVendor')}</th><th>${t('a.colCategory')}</th><th>${t('a.colContact')}</th>
        <th>${t('a.colContractPeriod')}</th><th>${t('a.colSlaWarranty')}</th><th>${t('a.colStatus')}</th><th>${t('a.colNote')}</th>
      </tr></thead>
      <tbody>${d.suppliers.map(s => `
        <tr>
          <td class="font-bold">${escHtml(s.name)}</td>
          <td><span class="doc-category-badge">${escHtml(s.category)}</span></td>
          <td class="text-secondary text-sm">${escHtml(s.contact)}</td>
          <td class="text-muted">${escHtml(s.contractPeriod)}</td>
          <td class="text-secondary">${escHtml(s.warrantyOrSLA)}</td>
          <td>${statusBadgeHtml(s.status)}</td>
          <td class="text-secondary">${escHtml(s.notes)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Service history */
  el('ops-service-history').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>${t('a.colDate')}</th><th>${t('a.colVendor')}</th><th>${t('a.colWorkDesc')}</th>
        <th>${t('a.colCategory')}</th><th class="num">${t('a.colCost')}</th><th>${t('a.colStatus')}</th>
      </tr></thead>
      <tbody>${d.serviceHistory.map(s => `
        <tr>
          <td class="text-muted">${escHtml(s.date)}</td>
          <td>${escHtml(s.vendor)}</td>
          <td>${escHtml(s.description)}</td>
          <td><span class="doc-category-badge">${escHtml(s.category)}</span></td>
          <td class="num">${fmtNTD(s.cost)}</td>
          <td>${statusBadgeHtml(s.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

/* ============================================================
   DOCUMENTS TAB
   ============================================================ */
function renderDocuments() {
  const d = state.data['documents'];
  let activeFilter = 'All';

  /* Important docs */
  el('docs-important').innerHTML = `
    <table class="data-table">
      <thead><tr><th>${t('a.colDocName')}</th><th>${t('a.colCategory')}</th><th>${t('a.colDate')}</th><th>${t('a.colType')}</th><th>${t('a.colNote')}</th></tr></thead>
      <tbody>${d.importantDocuments.map(doc => `
        <tr>
          <td><a href="${doc.url || '#'}" class="doc-link">${escHtml(doc.name)}</a></td>
          <td><span class="doc-category-badge">${escHtml(doc.category)}</span></td>
          <td class="text-muted">${escHtml(doc.date)}</td>
          <td><span class="doc-type-badge">${escHtml(doc.type)}</span></td>
          <td class="text-secondary">${escHtml(doc.notes)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Category filter buttons */
  const categories = ['All', ...new Set(d.library.map(doc => doc.category))];
  const catLabel = (c) => c === 'All' ? t('a.filterAll') : c;
  el('docs-filter-bar').innerHTML = categories.map(cat => `
    <button class="doc-filter-btn ${cat === 'All' ? 'active' : ''}" data-cat="${escHtml(cat)}">${escHtml(catLabel(cat))}</button>`
  ).join('');

  function renderDocTable(filter) {
    const rows = filter === 'All' ? d.library : d.library.filter(doc => doc.category === filter);
    el('docs-library-table').innerHTML = `
      <table class="data-table">
        <thead><tr>
          <th>${t('a.colDocId')}</th><th>${t('a.colDocName')}</th><th>${t('a.colCategory')}</th>
          <th>${t('a.colDate')}</th><th>${t('a.colSource')}</th><th>${t('a.colRelatedSection')}</th><th>${t('a.colType')}</th><th>${t('a.colNote')}</th>
        </tr></thead>
        <tbody>${rows.map(doc => `
          <tr>
            <td class="text-muted font-mono">${escHtml(doc.id)}</td>
            <td><a href="${doc.url || '#'}" class="doc-link">${escHtml(doc.name)}</a></td>
            <td><span class="doc-category-badge">${escHtml(doc.category)}</span></td>
            <td class="text-muted">${escHtml(doc.date)}</td>
            <td class="text-secondary">${escHtml(doc.source)}</td>
            <td class="text-secondary">${escHtml(doc.relatedSection)}</td>
            <td><span class="doc-type-badge">${escHtml(doc.type)}</span></td>
            <td class="text-secondary">${escHtml(doc.notes)}</td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  }

  renderDocTable('All');

  el('docs-filter-bar').addEventListener('click', e => {
    const btn = e.target.closest('.doc-filter-btn');
    if (!btn) return;
    activeFilter = btn.dataset.cat;
    document.querySelectorAll('.doc-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderDocTable(activeFilter);
  });
}

/* ============================================================
   MARKET TAB
   ============================================================ */
function renderMarket() {
  const d = state.data['market'];

  /* Narrative */
  el('mkt-narrative').innerHTML = `
    <p class="market-narrative">${escHtml(d.summary.narrative)}</p>
    <ul class="market-theme-list">${d.summary.keyThemes.map(t => `<li>${escHtml(t)}</li>`).join('')}</ul>`;

  /* Asset competitiveness */
  el('mkt-competitiveness').innerHTML = `
    <div class="grid-2">
      <div>
        <div class="section-title mb-8" style="color:var(--green)">${t('a.swotStrengths')}</div>
        <ul class="market-theme-list">${d.assetCompetitiveness.strengths.map(s => `<li>${escHtml(s)}</li>`).join('')}</ul>
        <div class="section-title mb-8 mb-12" style="margin-top:14px;color:var(--blue)">${t('a.swotOpportunities')}</div>
        <ul class="market-theme-list">${d.assetCompetitiveness.opportunities.map(s => `<li>${escHtml(s)}</li>`).join('')}</ul>
      </div>
      <div>
        <div class="section-title mb-8" style="color:var(--amber)">${t('a.swotWeaknesses')}</div>
        <ul class="market-theme-list">${d.assetCompetitiveness.weaknesses.map(s => `<li>${escHtml(s)}</li>`).join('')}</ul>
        <div class="section-title mb-8" style="margin-top:14px;color:var(--red)">${t('a.swotThreats')}</div>
        <ul class="market-theme-list">${d.assetCompetitiveness.threats.map(s => `<li>${escHtml(s)}</li>`).join('')}</ul>
      </div>
    </div>`;

  /* Comparable sales */
  el('mkt-comp-sales').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>${t('a.address')}</th><th>${t('a.colType')}</th><th class="num">${t('a.colUnits')}</th>
        <th>${t('a.colYearBuilt')}</th><th>${t('a.colSoldDate')}</th>
        <th class="num">${t('a.colSalePrice')}</th><th class="num">${t('a.colPricePerUnit')}</th><th class="num">${t('a.colPricePM2')}</th>
        <th class="num">${t('a.colCapRate')}</th><th class="num">${t('a.colOccupancy')}</th><th>${t('a.colNote')}</th>
      </tr></thead>
      <tbody>${d.comparables.map(c => `
        <tr>
          <td>${escHtml(c.address)}</td>
          <td class="text-secondary">${escHtml(c.type)}</td>
          <td class="num">${c.units}</td>
          <td class="text-muted">${c.yearBuilt}</td>
          <td class="text-muted">${escHtml(c.soldDate)}</td>
          <td class="num">${fmtNTD(c.salePrice)}</td>
          <td class="num">${fmtNTD(c.pricePerUnit)}</td>
          <td class="num">NT$${fmt(c.pricePM2)}</td>
          <td class="num">${escHtml(c.capRate)}</td>
          <td class="num">${escHtml(c.occupancy)}</td>
          <td class="text-secondary">${escHtml(c.notes)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Rent comparables */
  el('mkt-comp-rents').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>${t('a.address')}</th><th>${t('a.colUnitType')}</th><th class="num">${t('a.colAreaM2')}</th>
        <th class="num">${t('a.colAskingRent')}</th><th class="num">${t('a.colRentPM2')}</th>
        <th class="num">${t('a.colOccupancy')}</th><th>${t('a.colAmenities')}</th>
      </tr></thead>
      <tbody>${d.rentComparables.map(r => {
        const isSubject = r.address.includes('本案');
        return `<tr ${isSubject ? 'style="background:var(--bpm-red-tint);font-weight:600;"' : ''}>
          <td>${escHtml(r.address)} ${isSubject ? '<span class="comp-badge">本案</span>' : ''}</td>
          <td>${escHtml(r.unitType)}</td>
          <td class="num">${r.areaM2}</td>
          <td class="num">NT$${fmt(r.askingRent)}${t('a.perMonth')}</td>
          <td class="num">NT$${fmt(r.rentPM2)}/m²</td>
          <td class="num">${escHtml(r.occupancy)}</td>
          <td class="text-secondary">${escHtml(r.amenities)}</td>
        </tr>`;
      }).join('')}
      </tbody>
    </table>`;

  /* Cap rate trend chart */
  const crChart = initChart('mkt-caprate-chart');
  const crt = d.capRateTrend;
  crChart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', formatter: p => `${p[0].axisValue}<br>${t('a.tipCapRate')}：${p[0].value}%` },
    grid: { top: 10, bottom: 30, left: 44, right: 20 },
    xAxis: bpmAxis({ type: 'category', data: crt.labels, axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 9, rotate: 30 }, splitLine: { show: false } }),
    yAxis: bpmAxis({ type: 'value', name: '', min: 2.0, max: 3.5, axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 10, formatter: v => v.toFixed(1)+'%' } }),
    series: [{
      type: 'line', data: crt.values, smooth: true, symbol: 'none',
      lineStyle: { color: CHART_COLORS.red, width: 2 },
      itemStyle: { color: CHART_COLORS.red },
      areaStyle: { color: { type:'linear', x:0,y:0,x2:0,y2:1, colorStops:[{offset:0,color:'rgba(142,27,31,0.15)'},{offset:1,color:'rgba(142,27,31,0)'}] } }
    }]
  });

  /* Vacancy trend chart */
  const vcChart = initChart('mkt-vacancy-chart');
  const vt = d.vacancyTrend;
  vcChart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', formatter: p => `${p[0].axisValue}<br>${p.map(s=>`${s.seriesName}: ${s.value}%`).join('<br>')}` },
    legend: { bottom: 0, textStyle: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 } },
    grid: { top: 10, bottom: 40, left: 44, right: 20 },
    xAxis: bpmAxis({ type: 'category', data: vt.labels, axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 9, rotate: 30 }, splitLine: { show: false } }),
    yAxis: bpmAxis({ type: 'value', axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 10, formatter: v => v+'%' } }),
    series: [
      { name: t('a.legendSubmarket'), type: 'line', data: vt.submarket, smooth: true, symbol: 'none', lineStyle: { color: '#8A8A8F', width: 2 }, itemStyle: { color: '#8A8A8F' } },
      { name: '港景', type: 'line', data: vt.asset, smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: '#8E1B1F', width: 2 }, itemStyle: { color: '#8E1B1F' } }
    ]
  });

  /* Market risks and opportunities */
  el('mkt-risks').innerHTML = d.marketRisks.map(r => `
    <div class="row-between mb-8" style="border-bottom:1px solid var(--border);padding-bottom:8px;">
      ${riskLevelHtml(r.level)}
      <span style="font-size:13px;font-weight:600;flex:1;margin-left:8px;">${escHtml(r.title)}</span>
    </div>
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;">${escHtml(r.description)}</div>
  `).join('');

  el('mkt-opportunities').innerHTML = d.marketOpportunities.map(o => `
    <div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border);">
      <div style="font-size:13px;font-weight:700;color:var(--green);margin-bottom:3px;">${escHtml(o.title)}</div>
      <div style="font-size:12px;color:var(--text-secondary);">${escHtml(o.description)}</div>
    </div>`).join('');

  /* Implication */
  el('mkt-implication').innerHTML = `
    <div class="implication-card">
      <div class="implication-title">${escHtml(d.marketImplication.title)}</div>
      <div class="implication-body">${escHtml(d.marketImplication.body)}</div>
    </div>`;
}

/* ── PDF export (print stylesheet → browser Save as PDF) ──── */
function exportAssetPdf() {
  document.body.classList.add('print-prep');   // reveal all tabs so charts size correctly
  requestAnimationFrame(() => {
    chartInstances.forEach(c => { try { c.resize(); } catch (e) {} });
    setTimeout(() => { window.print(); }, 300);
  });
}
window.addEventListener('afterprint', () => {
  document.body.classList.remove('print-prep');
  requestAnimationFrame(() => chartInstances.forEach(c => { try { c.resize(); } catch (e) {} }));
});

/* ── Boot ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  loadData();
  const ex = el('export-pdf');
  if (ex) ex.addEventListener('click', exportAssetPdf);
});
