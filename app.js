/**
 * RADHVENA TECHNOLOGIES - INVOICE MAKER WEBTOOL
 * Blue & White brand theme.
 * Clean, simplified workflow without bank details, SAC, QR, or stamp.
 * When GST is 0%, CGST, SGST, and IGST rows are completely hidden.
 * Client GST and details are completely optional.
 */

// Indian State Codes mapping (Optional selection)
const INDIAN_STATES = [
  { code: "", name: "-- Optional / Not Specified --" },
  { code: "36", name: "Telangana (36)" },
  { code: "37", name: "Andhra Pradesh (37)" },
  { code: "29", name: "Karnataka (29)" },
  { code: "27", name: "Maharashtra (27)" },
  { code: "33", name: "Tamil Nadu (33)" },
  { code: "07", name: "Delhi (07)" },
  { code: "06", name: "Haryana (06)" },
  { code: "09", name: "Uttar Pradesh (09)" },
  { code: "24", name: "Gujarat (24)" },
  { code: "19", name: "West Bengal (19)" },
  { code: "32", name: "Kerala (32)" },
  { code: "08", name: "Rajasthan (08)" },
  { code: "23", name: "Madhya Pradesh (23)" },
  { code: "03", name: "Punjab (03)" },
  { code: "21", name: "Odisha (21)" },
  { code: "10", name: "Bihar (10)" },
  { code: "20", name: "Jharkhand (20)" },
  { code: "22", name: "Chhattisgarh (22)" },
  { code: "30", name: "Goa (30)" },
  { code: "05", name: "Uttarakhand (05)" },
  { code: "02", name: "Himachal Pradesh (02)" },
  { code: "01", name: "Jammu and Kashmir (01)" },
  { code: "18", name: "Assam (18)" },
  { code: "99", name: "Other / Overseas (99)" }
];

// Radhvena Service Presets from radhvena.tech (Clean - No SAC)
const RADHVENA_SERVICE_PRESETS = [
  {
    title: "Web Application Development",
    desc: "Custom high-performance web platform development with modern frontend, secure API architecture, responsive design, and database integration.",
    rate: 45000,
    taxRate: 18
  },
  {
    title: "Website Design & Development",
    desc: "Corporate responsive website design, CMS integration, fast loading optimization, and mobile-friendly user experience.",
    rate: 30000,
    taxRate: 18
  },
  {
    title: "Mobile App Development",
    desc: "Cross-platform mobile application development (iOS & Android) with clean UI, push notifications, and offline caching.",
    rate: 65000,
    taxRate: 18
  },
  {
    title: "Business Automation & AI Solutions",
    desc: "Workflow automation, third-party API webhooks, automated reporting, CRM pipelines, and AI operational scripts.",
    rate: 35000,
    taxRate: 18
  },
  {
    title: "SEO & Google Business Profile Optimization",
    desc: "Comprehensive on-page & technical SEO audit, local search ranking, keyword optimization, and Google Business profile management.",
    rate: 18000,
    taxRate: 18
  },
  {
    title: "Digital Marketing & Performance Ads",
    desc: "Targeted Meta & Google Ads campaign setup, audience segmentation, conversion tracking, ad creative design, and analytics reporting.",
    rate: 25000,
    taxRate: 18
  },
  {
    title: "E-Commerce Development & Shopify Setup",
    desc: "Custom Shopify store build, product catalog setup, payment gateway integration, shipping rules, and custom retail features.",
    rate: 40000,
    taxRate: 18
  },
  {
    title: "Amazon & Marketplace Management",
    desc: "E-commerce catalog management, inventory sync, A+ content creation, listing optimization, and order flow automation.",
    rate: 22000,
    taxRate: 18
  },
  {
    title: "Cloud Infrastructure & Maintenance Retainer",
    desc: "Monthly server monitoring, security updates, database backups, SSL maintenance, uptime guarantee, and dev support.",
    rate: 15000,
    taxRate: 18
  }
];

// Helper: Format date as YYYY-MM-DD
function formatDate(d) {
  const pad = n => (n < 10 ? '0' + n : n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Initial default state
const DEFAULT_INVOICE = {
  // Company details
  company: {
    name: "Radhvena Technologies (OPC) Private Limited",
    tagline: "Technology • Automation • Growth",
    address: "B2, 6th Floor, Sumukhi Orbit, Madhapur",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
    country: "India",
    email: "contactus@radhvena.tech",
    phone: "+91 79897 58689",
    website: "www.radhvena.tech",
    gstin: "36AAQCR3137G1Z6",
    stateCode: "36"
  },

  // Invoice Meta
  meta: {
    invoiceNo: "RAD/2024-25/001",
    invoiceDate: formatDate(new Date()),
    dueDate: formatDate(new Date(Date.now() + 15 * 86400000)),
    poNumber: "",
    currency: "INR",
    currencySymbol: "₹",
    status: "unpaid", // unpaid, paid, overdue
    taxType: "intra" // intra (CGST+SGST 18%), inter (IGST 18%), none (0%), auto
  },

  // Client Details (All purely optional)
  client: {
    name: "Acme Innovations Ltd",
    contactPerson: "Rajesh Sharma",
    email: "accounts@acmeinnovations.com",
    phone: "+91 98765 43210",
    address: "Plot 42, Silicon Corridor, HITEC City",
    city: "Hyderabad",
    state: "Telangana",
    stateCode: "36",
    pincode: "500081",
    gstin: "",
    pan: ""
  },

  // Line items (Clean: No SAC)
  items: [
    {
      id: "item-1",
      title: "Web Application & Automation Platform",
      desc: "Custom cloud portal development, business process automation pipelines, user role management, and database synchronization.",
      qty: 1,
      rate: 55000,
      discountPercent: 0,
      taxRate: 18
    },
    {
      id: "item-2",
      title: "SEO & Digital Performance Optimization",
      desc: "Technical SEO overhaul, Google Business Profile enhancement, on-page optimization, and organic visibility setup.",
      qty: 1,
      rate: 15000,
      discountPercent: 0,
      taxRate: 18
    }
  ],

  // Extra discount on total
  extraDiscount: 0,

  // Simple Terms & Conditions
  terms: "1. Payment is due within 15 calendar days from the invoice date.\n2. This is a computer-generated invoice and does not require a physical signature.",

  // Simple Client Note
  notes: "Thank you for choosing Radhvena Technologies!"
};

// Current active state
let invoiceData = JSON.parse(JSON.stringify(DEFAULT_INVOICE));

// -------------------------------------------------------------
// NUMBER TO WORDS (Indian Lakhs & Crores + International)
// -------------------------------------------------------------
function numberToWordsIndian(num) {
  num = Math.round(num);
  if (num === 0) return "Zero";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertTwoDigits(n) {
    if (n === 0) return "";
    if (n < 20) return a[n];
    return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
  }

  function convertThreeDigits(n) {
    let str = "";
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n > 0) {
      str += convertTwoDigits(n);
    }
    return str.trim();
  }

  let words = "";
  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  const remainder = num;

  if (crore > 0) words += convertThreeDigits(crore) + " Crore ";
  if (lakh > 0) words += convertThreeDigits(lakh) + " Lakh ";
  if (thousand > 0) words += convertThreeDigits(thousand) + " Thousand ";
  if (remainder > 0) words += convertThreeDigits(remainder);

  return words.trim();
}

function getAmountInWords(amount, currencyCode) {
  const rounded = Math.round(amount);
  if (currencyCode === "INR") {
    return "INR " + numberToWordsIndian(rounded) + " Only";
  } else {
    return currencyCode + " " + numberToWordsIndian(rounded) + " Only";
  }
}

// -------------------------------------------------------------
// FINANCIAL CALCULATIONS (FIXED 0% GST HANDLING)
// -------------------------------------------------------------
function calculateTotals() {
  let subtotal = 0;
  let totalItemDiscount = 0;
  let taxableAmount = 0;

  let taxType = invoiceData.meta.taxType || "intra";
  
  // If auto-detect selected
  if (taxType === "auto") {
    const supplierStateCode = (invoiceData.company.stateCode || "36").trim();
    const clientStateCode = (invoiceData.client.stateCode || "").trim();
    if (!clientStateCode || clientStateCode === supplierStateCode) {
      taxType = "intra";
    } else {
      taxType = "inter";
    }
  }

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  invoiceData.items.forEach(item => {
    const gross = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
    const disc = gross * ((parseFloat(item.discountPercent) || 0) / 100);
    const itemTaxable = gross - disc;
    item.calculatedAmount = itemTaxable;

    subtotal += gross;
    totalItemDiscount += disc;
    taxableAmount += itemTaxable;

    // Parse item tax rate cleanly: 0 must stay 0!
    let rawRate = 18;
    if (typeof item.taxRate !== 'undefined' && item.taxRate !== null && item.taxRate !== '') {
      rawRate = parseFloat(item.taxRate);
    }
    const itemRate = (taxType === 'none' || isNaN(rawRate) || rawRate <= 0) ? 0 : rawRate;

    if (itemRate > 0) {
      if (taxType === 'intra') {
        cgst += itemTaxable * (itemRate / 200);
        sgst += itemTaxable * (itemRate / 200);
      } else if (taxType === 'inter') {
        igst += itemTaxable * (itemRate / 100);
      }
    }
  });

  const extraDisc = parseFloat(invoiceData.extraDiscount) || 0;
  taxableAmount = Math.max(0, taxableAmount - extraDisc);

  // If taxable value is 0, taxes are 0
  if (taxableAmount <= 0) {
    cgst = sgst = igst = 0;
  }

  const totalTax = cgst + sgst + igst;
  const rawTotal = taxableAmount + totalTax;
  const roundedGrandTotal = Math.round(rawTotal);
  const roundOff = roundedGrandTotal - rawTotal;

  // Determine effective display tax percentage
  let displayRate = 18;
  if (invoiceData.items.length > 0) {
    const firstRate = parseFloat(invoiceData.items[0].taxRate);
    if (!isNaN(firstRate) && firstRate > 0) displayRate = firstRate;
  }

  return {
    subtotal,
    totalItemDiscount,
    extraDiscount: extraDisc,
    taxableAmount,
    taxType,
    cgstRate: displayRate / 2,
    sgstRate: displayRate / 2,
    igstRate: displayRate,
    cgst,
    sgst,
    igst,
    totalTax,
    roundOff,
    grandTotal: roundedGrandTotal,
    words: getAmountInWords(roundedGrandTotal, invoiceData.meta.currency)
  };
}

// -------------------------------------------------------------
// RENDER UI & SYNC WITH PREVIEW
// -------------------------------------------------------------
function render() {
  const totals = calculateTotals();

  // 1. Sync Form Controls from State
  document.getElementById('input-invoice-no').value = invoiceData.meta.invoiceNo || '';
  document.getElementById('input-invoice-date').value = invoiceData.meta.invoiceDate || '';
  document.getElementById('input-due-date').value = invoiceData.meta.dueDate || '';
  document.getElementById('input-po-number').value = invoiceData.meta.poNumber || '';
  document.getElementById('input-currency').value = invoiceData.meta.currency || 'INR';
  document.getElementById('input-status').value = invoiceData.meta.status || 'unpaid';
  document.getElementById('input-tax-type').value = invoiceData.meta.taxType || 'intra';

  // Client (All optional)
  document.getElementById('input-client-name').value = invoiceData.client.name || '';
  document.getElementById('input-client-contact').value = invoiceData.client.contactPerson || '';
  document.getElementById('input-client-email').value = invoiceData.client.email || '';
  document.getElementById('input-client-phone').value = invoiceData.client.phone || '';
  document.getElementById('input-client-address').value = invoiceData.client.address || '';
  document.getElementById('input-client-city').value = invoiceData.client.city || '';
  document.getElementById('input-client-pincode').value = invoiceData.client.pincode || '';
  document.getElementById('input-client-state').value = invoiceData.client.stateCode || '';
  document.getElementById('input-client-gstin').value = invoiceData.client.gstin || '';
  document.getElementById('input-client-pan').value = invoiceData.client.pan || '';

  // Extra discount
  document.getElementById('input-extra-discount').value = invoiceData.extraDiscount || 0;

  // Simple Terms & Notes
  document.getElementById('input-terms').value = invoiceData.terms || '';
  document.getElementById('input-notes').value = invoiceData.notes || '';

  // Render Line Item Editors in Left Panel
  renderLineItemEditors();

  // 2. Sync Right A4 Preview
  syncInvoicePreview(totals);

  // 3. Auto-save current draft to local storage
  saveCurrentDraft();
}

function renderLineItemEditors() {
  const container = document.getElementById('line-items-container');
  container.innerHTML = '';

  invoiceData.items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-card-header">
        <span class="item-number">Item #${index + 1}</span>
        <div class="item-actions">
          <button type="button" class="btn btn-light btn-sm" onclick="duplicateItem(${index})" title="Duplicate item">📋</button>
          <button type="button" class="btn btn-danger-outline btn-sm" onclick="removeItem(${index})" title="Remove item">🗑️</button>
        </div>
      </div>
      <div class="form-group">
        <label>Service Title</label>
        <input type="text" class="input" value="${escapeHtml(item.title)}" onchange="updateItemField(${index}, 'title', this.value)" placeholder="e.g. Web Application Development" />
      </div>
      <div class="form-group">
        <label>Description / Deliverables (Optional)</label>
        <textarea class="input" rows="2" onchange="updateItemField(${index}, 'desc', this.value)" placeholder="Key scope, milestone details...">${escapeHtml(item.desc || '')}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Qty / Units</label>
          <input type="number" class="input" min="1" step="any" value="${item.qty}" onchange="updateItemField(${index}, 'qty', parseFloat(this.value) || 1)" />
        </div>
        <div class="form-group">
          <label>Unit Price (${invoiceData.meta.currencySymbol})</label>
          <input type="number" class="input" min="0" step="any" value="${item.rate}" onchange="updateItemField(${index}, 'rate', parseFloat(this.value) || 0)" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Discount (%)</label>
          <input type="number" class="input" min="0" max="100" value="${item.discountPercent || 0}" onchange="updateItemField(${index}, 'discountPercent', parseFloat(this.value) || 0)" />
        </div>
        <div class="form-group">
          <label>GST Rate (%)</label>
          <select class="input" onchange="updateItemField(${index}, 'taxRate', parseFloat(this.value))">
            <option value="18" ${item.taxRate == 18 ? 'selected' : ''}>18% GST</option>
            <option value="12" ${item.taxRate == 12 ? 'selected' : ''}>12% GST</option>
            <option value="5" ${item.taxRate == 5 ? 'selected' : ''}>5% GST</option>
            <option value="0" ${item.taxRate == 0 ? 'selected' : ''}>0% (No Tax)</option>
          </select>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function syncInvoicePreview(totals) {
  const sym = invoiceData.meta.currencySymbol;

  // Header & Company (Radhvena Technologies)
  document.getElementById('pv-company-name').textContent = invoiceData.company.name;
  document.getElementById('pv-company-tagline').textContent = invoiceData.company.tagline;
  document.getElementById('pv-company-address').textContent = `${invoiceData.company.address}, ${invoiceData.company.city}, ${invoiceData.company.state} - ${invoiceData.company.pincode}`;
  document.getElementById('pv-company-gstin').textContent = invoiceData.company.gstin;
  document.getElementById('pv-company-contact').textContent = `${invoiceData.company.phone} | ${invoiceData.company.email}`;
  document.getElementById('pv-company-web').textContent = invoiceData.company.website;

  // Invoice Meta
  document.getElementById('pv-invoice-no').textContent = invoiceData.meta.invoiceNo || 'INV-001';
  document.getElementById('pv-invoice-date').textContent = formatDateDisplay(invoiceData.meta.invoiceDate);
  document.getElementById('pv-due-date').textContent = formatDateDisplay(invoiceData.meta.dueDate);
  
  // PO Row
  const rowPo = document.getElementById('pv-row-po');
  if (invoiceData.meta.poNumber && invoiceData.meta.poNumber.trim()) {
    rowPo.style.display = 'contents';
    document.getElementById('pv-po-number').textContent = invoiceData.meta.poNumber;
  } else {
    rowPo.style.display = 'none';
  }

  // Status pill
  const statusPill = document.getElementById('pv-status-pill');
  statusPill.textContent = (invoiceData.meta.status || 'unpaid').toUpperCase();
  statusPill.className = `inv-status-pill ${invoiceData.meta.status}`;

  // Client Details (Cleanly omit any field not provided)
  const client = invoiceData.client;
  document.getElementById('pv-client-name').textContent = client.name || 'Client Name';

  // Contact person
  const elContact = document.getElementById('pv-client-contact');
  if (client.contactPerson && client.contactPerson.trim()) {
    elContact.style.display = 'block';
    elContact.textContent = `Attn: ${client.contactPerson}`;
  } else {
    elContact.style.display = 'none';
  }

  // Address
  const elAddress = document.getElementById('pv-client-address');
  const addressParts = [client.address, client.city, client.pincode].filter(Boolean);
  if (addressParts.length > 0) {
    elAddress.style.display = 'block';
    elAddress.textContent = addressParts.join(', ');
  } else {
    elAddress.style.display = 'none';
  }

  // Phone / Email
  const elPhoneEmail = document.getElementById('pv-client-phone-email');
  const contactParts = [client.phone, client.email].filter(Boolean);
  if (contactParts.length > 0) {
    elPhoneEmail.style.display = 'block';
    elPhoneEmail.textContent = contactParts.join(' | ');
  } else {
    elPhoneEmail.style.display = 'none';
  }

  // Optional Client GSTIN
  const rowGstin = document.getElementById('pv-row-client-gstin');
  if (client.gstin && client.gstin.trim()) {
    rowGstin.style.display = 'contents';
    document.getElementById('pv-client-gstin').textContent = client.gstin.trim();
  } else {
    rowGstin.style.display = 'none';
  }

  // Optional Client PAN
  const rowPan = document.getElementById('pv-row-client-pan');
  if (client.pan && client.pan.trim()) {
    rowPan.style.display = 'contents';
    document.getElementById('pv-client-pan').textContent = client.pan.trim();
  } else {
    rowPan.style.display = 'none';
  }

  // Optional Client State
  const rowState = document.getElementById('pv-row-client-state');
  if (client.stateCode && client.stateCode.trim()) {
    const sObj = INDIAN_STATES.find(s => s.code === client.stateCode);
    rowState.style.display = 'contents';
    document.getElementById('pv-client-state').textContent = sObj ? sObj.name : client.state;
  } else {
    rowState.style.display = 'none';
  }

  // Items Table (Clean: No SAC column)
  const tbody = document.getElementById('pv-items-body');
  tbody.innerHTML = '';

  invoiceData.items.forEach((item, i) => {
    const tr = document.createElement('tr');
    const gross = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
    const disc = gross * ((parseFloat(item.discountPercent) || 0) / 100);
    const lineTotal = gross - disc;

    tr.innerHTML = `
      <td class="text-center" style="width: 38px;">${i + 1}</td>
      <td>
        <div class="inv-item-name">${escapeHtml(item.title)}</div>
        ${item.desc && item.desc.trim() ? `<div class="inv-item-desc">${escapeHtml(item.desc)}</div>` : ''}
      </td>
      <td class="text-center" style="width: 55px;">${item.qty}</td>
      <td class="text-right" style="width: 90px;">${sym} ${formatCurrency(item.rate)}</td>
      <td class="text-center" style="width: 55px;">${item.discountPercent ? item.discountPercent + '%' : '-'}</td>
      <td class="text-right" style="width: 105px; font-weight: 700;">${sym} ${formatCurrency(lineTotal)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Totals
  document.getElementById('pv-subtotal').textContent = `${sym} ${formatCurrency(totals.subtotal)}`;
  
  const trDisc = document.getElementById('pv-row-discount');
  if (totals.totalItemDiscount > 0 || totals.extraDiscount > 0) {
    trDisc.style.display = 'table-row';
    document.getElementById('pv-discount').textContent = `-${sym} ${formatCurrency(totals.totalItemDiscount + totals.extraDiscount)}`;
  } else {
    trDisc.style.display = 'none';
  }

  document.getElementById('pv-taxable').textContent = `${sym} ${formatCurrency(totals.taxableAmount)}`;

  // Taxes: CRITICAL RULE: When GST is 0 (totalTax == 0), HIDE CGST, SGST, AND IGST!
  const trCgst = document.getElementById('pv-row-cgst');
  const trSgst = document.getElementById('pv-row-sgst');
  const trIgst = document.getElementById('pv-row-igst');

  if (totals.totalTax > 0.001) {
    if (totals.taxType === 'intra') {
      trCgst.style.display = 'table-row';
      trSgst.style.display = 'table-row';
      trIgst.style.display = 'none';
      document.getElementById('pv-cgst-label').textContent = `CGST (${totals.cgstRate}%):`;
      document.getElementById('pv-cgst').textContent = `${sym} ${formatCurrency(totals.cgst)}`;
      document.getElementById('pv-sgst-label').textContent = `SGST (${totals.sgstRate}%):`;
      document.getElementById('pv-sgst').textContent = `${sym} ${formatCurrency(totals.sgst)}`;
    } else if (totals.taxType === 'inter') {
      trCgst.style.display = 'none';
      trSgst.style.display = 'none';
      trIgst.style.display = 'table-row';
      document.getElementById('pv-igst-label').textContent = `IGST (${totals.igstRate}%):`;
      document.getElementById('pv-igst').textContent = `${sym} ${formatCurrency(totals.igst)}`;
    } else {
      trCgst.style.display = 'none';
      trSgst.style.display = 'none';
      trIgst.style.display = 'none';
    }
  } else {
    // Zero GST: completely hide CGST, SGST, IGST rows!
    trCgst.style.display = 'none';
    trSgst.style.display = 'none';
    trIgst.style.display = 'none';
  }

  // Round off
  const trRound = document.getElementById('pv-row-roundoff');
  if (Math.abs(totals.roundOff) > 0.001) {
    trRound.style.display = 'table-row';
    document.getElementById('pv-roundoff').textContent = `${totals.roundOff >= 0 ? '+' : ''}${sym} ${totals.roundOff.toFixed(2)}`;
  } else {
    trRound.style.display = 'none';
  }

  // Grand Total & Words
  document.getElementById('pv-grand-total').textContent = `${sym} ${formatCurrency(totals.grandTotal)}`;
  document.getElementById('pv-amount-words').textContent = totals.words;

  // Simple Terms and Notes
  document.getElementById('pv-terms').textContent = invoiceData.terms || 'Payment is due within 15 calendar days from the invoice date. This is a computer-generated invoice and requires no physical signature.';
  document.getElementById('pv-notes').textContent = invoiceData.notes || 'Thank you for choosing Radhvena Technologies!';
}

// -------------------------------------------------------------
// HELPERS & EVENT HANDLERS
// -------------------------------------------------------------
function formatCurrency(val) {
  const num = parseFloat(val) || 0;
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  return dateStr;
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// -------------------------------------------------------------
// FORM ACTIONS
// -------------------------------------------------------------
function updateInvoiceMeta(field, val) {
  invoiceData.meta[field] = val;
  if (field === 'currency') {
    const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'AED ' };
    invoiceData.meta.currencySymbol = symbols[val] || val + ' ';
  }
  if (field === 'taxType' && val === 'none') {
    // Set all items to 0% tax for consistency
    invoiceData.items.forEach(item => { item.taxRate = 0; });
  }
  render();
}

function updateClientField(field, val) {
  invoiceData.client[field] = val;

  // Auto-detect State if GSTIN changed
  if (field === 'gstin' && val.length >= 2) {
    const stateCode = val.substring(0, 2);
    const matchedState = INDIAN_STATES.find(s => s.code === stateCode);
    if (matchedState) {
      invoiceData.client.stateCode = matchedState.code;
      invoiceData.client.state = matchedState.name;
      document.getElementById('input-client-state').value = matchedState.code;
    }
    // Also extract PAN (chars 3 to 12)
    if (val.length >= 12) {
      const extractedPan = val.substring(2, 12).toUpperCase();
      invoiceData.client.pan = extractedPan;
      document.getElementById('input-client-pan').value = extractedPan;
    }
  }

  // If state dropdown changed
  if (field === 'stateCode') {
    const matchedState = INDIAN_STATES.find(s => s.code === val);
    if (matchedState) {
      invoiceData.client.state = matchedState.name;
    }
  }

  render();
}

function updateItemField(index, field, val) {
  if (invoiceData.items[index]) {
    invoiceData.items[index][field] = val;
    render();
  }
}

function addNewItem() {
  invoiceData.items.push({
    id: 'item-' + Date.now(),
    title: 'Custom Service / Deliverable',
    desc: '',
    qty: 1,
    rate: 10000,
    discountPercent: 0,
    taxRate: (invoiceData.meta.taxType === 'none') ? 0 : 18
  });
  render();
}

function duplicateItem(index) {
  const itemToCopy = invoiceData.items[index];
  if (itemToCopy) {
    const clone = JSON.parse(JSON.stringify(itemToCopy));
    clone.id = 'item-' + Date.now();
    clone.title += ' (Copy)';
    invoiceData.items.splice(index + 1, 0, clone);
    render();
  }
}

function removeItem(index) {
  if (invoiceData.items.length <= 1) {
    alert("Invoice must have at least one line item.");
    return;
  }
  invoiceData.items.splice(index, 1);
  render();
}

function addServicePreset(index) {
  const preset = RADHVENA_SERVICE_PRESETS[index];
  if (preset) {
    invoiceData.items.push({
      id: 'item-' + Date.now(),
      title: preset.title,
      desc: preset.desc,
      qty: 1,
      rate: preset.rate,
      discountPercent: 0,
      taxRate: (invoiceData.meta.taxType === 'none') ? 0 : preset.taxRate
    });
    render();
  }
}

function setDueDateOffset(days) {
  const base = new Date(invoiceData.meta.invoiceDate || new Date());
  base.setDate(base.getDate() + days);
  invoiceData.meta.dueDate = formatDate(base);
  render();
}

function autoIncrementInvoiceNo() {
  const current = invoiceData.meta.invoiceNo || 'RAD/2024-25/001';
  const match = current.match(/^(.*?)(\d+)$/);
  if (match) {
    const prefix = match[1];
    const num = parseInt(match[2], 10) + 1;
    const padded = String(num).padStart(match[2].length, '0');
    invoiceData.meta.invoiceNo = prefix + padded;
  } else {
    invoiceData.meta.invoiceNo += '-01';
  }
  render();
}

// -------------------------------------------------------------
// STORAGE & IMPORT / EXPORT
// -------------------------------------------------------------
const STORAGE_KEY_CURRENT = 'radhvena_invoice_current';
const STORAGE_KEY_SAVED = 'radhvena_invoice_saved_list';

function saveCurrentDraft() {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(invoiceData));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

function loadSavedDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (raw) {
      const parsed = JSON.parse(raw);
      delete parsed.bank;
      delete parsed.signatory;
      if (parsed.company && (!parsed.company.name || parsed.company.name === "Radhvena Technologies Private Limited")) {
        parsed.company.name = "Radhvena Technologies (OPC) Private Limited";
      }
      if (parsed.company && (!parsed.company.phone || parsed.company.phone.includes("87490"))) {
        parsed.company.phone = "+91 79897 58689";
      }
      invoiceData = Object.assign({}, DEFAULT_INVOICE, parsed);
    }
  } catch (e) {
    console.error("Failed to load draft:", e);
    invoiceData = JSON.parse(JSON.stringify(DEFAULT_INVOICE));
  }
}

function saveToInvoiceList() {
  const name = prompt("Enter a label/client reference to save this invoice:", `${invoiceData.meta.invoiceNo} - ${invoiceData.client.name || 'Client'}`);
  if (!name) return;

  const savedList = getSavedInvoices();
  savedList.push({
    id: 'inv-' + Date.now(),
    name: name,
    dateSaved: new Date().toISOString(),
    invoiceNo: invoiceData.meta.invoiceNo,
    clientName: invoiceData.client.name || 'Client',
    amount: calculateTotals().grandTotal,
    currencySymbol: invoiceData.meta.currencySymbol,
    data: JSON.parse(JSON.stringify(invoiceData))
  });

  localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedList));
  alert(`Invoice saved successfully!`);
  renderSavedInvoicesModal();
}

function getSavedInvoices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function openSavedModal() {
  renderSavedInvoicesModal();
  document.getElementById('saved-invoices-modal').classList.add('open');
}

function closeSavedModal() {
  document.getElementById('saved-invoices-modal').classList.remove('open');
}

function renderSavedInvoicesModal() {
  const list = getSavedInvoices();
  const container = document.getElementById('saved-invoices-list');
  if (list.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--slate-500)">No saved invoices found. Save your current invoice to access it anytime!</div>`;
    return;
  }

  container.innerHTML = list.map((item, index) => `
    <div class="saved-invoice-item">
      <div>
        <div style="font-weight:700;color:var(--navy-dark);">${escapeHtml(item.name)}</div>
        <div style="font-size:0.75rem;color:var(--slate-500)">${item.invoiceNo} • ${item.clientName} • ${item.currencySymbol} ${formatCurrency(item.amount)}</div>
      </div>
      <div style="display:flex;gap:0.4rem;">
        <button class="btn btn-primary btn-sm" onclick="loadSavedInvoice(${index})">Load</button>
        <button class="btn btn-danger-outline btn-sm" onclick="deleteSavedInvoice(${index})">Delete</button>
      </div>
    </div>
  `).join('');
}

function loadSavedInvoice(index) {
  const list = getSavedInvoices();
  if (list[index] && list[index].data) {
    invoiceData = JSON.parse(JSON.stringify(list[index].data));
    delete invoiceData.bank;
    delete invoiceData.signatory;
    render();
    closeSavedModal();
  }
}

function deleteSavedInvoice(index) {
  const list = getSavedInvoices();
  if (confirm(`Delete this saved invoice?`)) {
    list.splice(index, 1);
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(list));
    renderSavedInvoicesModal();
  }
}

function resetToDefault() {
  if (confirm("Reset current invoice to blank Radhvena template? Any unsaved edits will be cleared.")) {
    invoiceData = JSON.parse(JSON.stringify(DEFAULT_INVOICE));
    invoiceData.meta.invoiceDate = formatDate(new Date());
    invoiceData.meta.dueDate = formatDate(new Date(Date.now() + 15 * 86400000));
    render();
  }
}

function exportAsJson() {
  const jsonStr = JSON.stringify(invoiceData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Invoice_${invoiceData.meta.invoiceNo.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJson(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported.company && imported.items) {
        delete imported.bank;
        delete imported.signatory;
        invoiceData = imported;
        render();
        alert("Invoice imported successfully!");
      } else {
        alert("Invalid invoice JSON structure.");
      }
    } catch (err) {
      alert("Error reading JSON file: " + err.message);
    }
  };
  reader.readAsText(file);
}

// -------------------------------------------------------------
// PRINT / PDF HANDLER
// -------------------------------------------------------------
function triggerPrint() {
  window.print();
}

// -------------------------------------------------------------
// TABS SWITCHER
// -------------------------------------------------------------
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(tab.getAttribute('data-target'));
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

// -------------------------------------------------------------
// INITIALIZATION
// -------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  // Populate Indian State Dropdowns
  const stateSelect = document.getElementById('input-client-state');
  stateSelect.innerHTML = INDIAN_STATES.map(s => `
    <option value="${s.code}">${s.name}</option>
  `).join('');

  // Populate Radhvena Service Presets Pills
  const presetContainer = document.getElementById('preset-pills-list');
  presetContainer.innerHTML = RADHVENA_SERVICE_PRESETS.map((p, idx) => `
    <button type="button" class="preset-pill" onclick="addServicePreset(${idx})">
      + ${escapeHtml(p.title)}
    </button>
  `).join('');

  // Load existing draft if present
  loadSavedDraft();

  // Setup tabs
  setupTabs();

  // Initial render
  render();
});
