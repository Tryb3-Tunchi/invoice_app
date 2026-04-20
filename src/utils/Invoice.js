/** Generate invoice ID like "RT3080" */
export function generateId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const l1 = letters[Math.floor(Math.random() * 26)];
  const l2 = letters[Math.floor(Math.random() * 26)];
  const nums = String(Math.floor(Math.random() * 9000) + 1000);
  return `${l1}${l2}${nums}`;
}

/** Format date to "DD MMM YYYY" */
export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Add payment terms days to a date */
export function addDays(dateStr, days) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().split("T")[0];
}

/** Format currency */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(amount || 0);
}

/** Calculate total from items */
export function calcTotal(items = []) {
  return items.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
    0,
  );
}

/** Validate invoice form */
export function validateInvoice(data) {
  const errors = {};

  if (!data.clientName?.trim()) errors.clientName = "Client name is required";
  if (!data.clientEmail?.trim())
    errors.clientEmail = "Client email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail))
    errors.clientEmail = "Enter a valid email";
  if (!data.createdAt) errors.createdAt = "Invoice date is required";
  if (!data.description?.trim())
    errors.description = "Project description is required";
  if (!data.senderAddress?.street?.trim())
    errors.senderStreet = "Street address is required";
  if (!data.senderAddress?.city?.trim()) errors.senderCity = "City is required";
  if (!data.senderAddress?.postCode?.trim())
    errors.senderPostCode = "Post code is required";
  if (!data.senderAddress?.country?.trim())
    errors.senderCountry = "Country is required";
  if (!data.clientAddress?.street?.trim())
    errors.clientStreet = "Client's street is required";
  if (!data.clientAddress?.city?.trim())
    errors.clientCity = "Client's city is required";
  if (!data.clientAddress?.postCode?.trim())
    errors.clientPostCode = "Client's post code is required";
  if (!data.clientAddress?.country?.trim())
    errors.clientCountry = "Client's country is required";

  if (!data.items || data.items.length === 0) {
    errors.items = "At least one item is required";
  } else {
    data.items.forEach((item, i) => {
      if (!item.name?.trim()) errors[`item_${i}_name`] = "Item name required";
      if (!item.quantity || Number(item.quantity) <= 0)
        errors[`item_${i}_qty`] = "Qty must be > 0";
      if (!item.price || Number(item.price) <= 0)
        errors[`item_${i}_price`] = "Price must be > 0";
    });
  }

  return errors;
}

export const EMPTY_INVOICE = {
  clientName: "",
  clientEmail: "",
  createdAt: new Date().toISOString().split("T")[0],
  paymentTerms: 30,
  description: "",
  senderAddress: { street: "", city: "", postCode: "", country: "" },
  clientAddress: { street: "", city: "", postCode: "", country: "" },
  items: [],
  status: "draft",
};
