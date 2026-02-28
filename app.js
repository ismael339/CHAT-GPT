const countryConfig = {
  es: { locale: "es-ES", currency: "EUR", taxLabel: "IVA" },
  mx: { locale: "es-MX", currency: "MXN", taxLabel: "IVA" },
  ar: { locale: "es-AR", currency: "ARS", taxLabel: "IVA" },
  co: { locale: "es-CO", currency: "COP", taxLabel: "IVA" },
  cl: { locale: "es-CL", currency: "CLP", taxLabel: "IVA" },
  us: { locale: "en-US", currency: "USD", taxLabel: "Sales tax" },
};

const defaultValues = {
  basePrice: 100,
  country: "es",
  commissionPercent: 3,
  commissionFixed: 1.5,
  extraCosts: 4.95,
};

const form = document.getElementById("price-form");
const finalPriceEl = document.getElementById("finalPrice");
const breakdownBaseEl = document.getElementById("breakdownBase");
const breakdownTaxEl = document.getElementById("breakdownTax");
const breakdownCommissionPercentEl = document.getElementById("breakdownCommissionPercent");
const breakdownCommissionFixedEl = document.getElementById("breakdownCommissionFixed");
const breakdownExtrasEl = document.getElementById("breakdownExtras");
const breakdownTaxLabelEl = document.getElementById("breakdownTaxLabel");
const clearFormButton = document.getElementById("clearForm");
const fillExampleButton = document.getElementById("fillExample");

function readNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function getFormatter(countryCode) {
  const config = countryConfig[countryCode] ?? countryConfig.es;
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
    minimumFractionDigits: 2,
  });
}

function calculateFinalPrice() {
  const selectedCountry = form.country.value;
  const taxRate = readNumber(form.country.selectedOptions[0].dataset.tax) / 100;
  const basePrice = readNumber(form.basePrice.value);
  const commissionPercent = readNumber(form.commissionPercent.value) / 100;
  const commissionFixed = readNumber(form.commissionFixed.value);
  const extraCosts = readNumber(form.extraCosts.value);

  const taxAmount = basePrice * taxRate;
  const commissionPercentAmount = basePrice * commissionPercent;
  const total = basePrice + taxAmount + commissionPercentAmount + commissionFixed + extraCosts;

  const formatter = getFormatter(selectedCountry);
  const taxName = countryConfig[selectedCountry]?.taxLabel ?? "Impuestos";

  finalPriceEl.textContent = formatter.format(total);
  breakdownBaseEl.textContent = formatter.format(basePrice);
  breakdownTaxLabelEl.textContent = `${taxName} (${(taxRate * 100).toFixed(0)}%)`;
  breakdownTaxEl.textContent = formatter.format(taxAmount);
  breakdownCommissionPercentEl.textContent = formatter.format(commissionPercentAmount);
  breakdownCommissionFixedEl.textContent = formatter.format(commissionFixed);
  breakdownExtrasEl.textContent = formatter.format(extraCosts);
}

function applyValues(values) {
  form.basePrice.value = values.basePrice;
  form.country.value = values.country;
  form.commissionPercent.value = values.commissionPercent;
  form.commissionFixed.value = values.commissionFixed;
  form.extraCosts.value = values.extraCosts;
  calculateFinalPrice();
}

form.addEventListener("input", calculateFinalPrice);
form.addEventListener("change", calculateFinalPrice);

clearFormButton.addEventListener("click", () => {
  applyValues({
    basePrice: 0,
    country: form.country.value,
    commissionPercent: 0,
    commissionFixed: 0,
    extraCosts: 0,
  });
});

fillExampleButton.addEventListener("click", () => {
  applyValues(defaultValues);
});

calculateFinalPrice();
