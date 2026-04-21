import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import {
  generateId,
  addDays,
  calcTotal,
  validateInvoice,
  EMPTY_INVOICE,
  formatCurrency,
} from "../utils/Invoice";
import styles from "./InvoiceForm.module.css";

const TERMS = [1, 7, 14, 30];

function emptyItem() {
  return { name: "", quantity: 1, price: 0, total: 0 };
}

export default function InvoiceForm({ invoiceId, onClose }) {
  const { invoices, addInvoice, updateInvoice } = useApp();
  const existing = invoiceId
    ? invoices.find((inv) => inv.id === invoiceId)
    : null;
  const isEdit = Boolean(existing);

  const [form, setForm] = useState(() =>
    existing
      ? { ...existing, items: existing.items.map((i) => ({ ...i })) }
      : { ...EMPTY_INVOICE, items: [] },
  );
  const [errors, setErrors] = useState({});
  const firstInputRef = useRef(null);

  useEffect(() => {
    firstInputRef.current?.focus();
    const modal = document.querySelector('[role="dialog"]');
    
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      
      // Tab trap inside modal
      if (e.key === "Tab" && modal) {
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Sync total on item change */
  function updateItem(index, field, value) {
    setForm((prev) => {
      const items = prev.items.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        updated.total =
          (Number(updated.quantity) || 0) * (Number(updated.price) || 0);
        return updated;
      });
      return { ...prev, items };
    });
  }

  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));
  }

  function removeItem(index) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  function setField(path, value) {
    setForm((prev) => {
      if (!path.includes(".")) return { ...prev, [path]: value };
      const [obj, key] = path.split(".");
      return { ...prev, [obj]: { ...prev[obj], [key]: value } };
    });
  }

  function buildInvoice(status) {
    const paymentDue = addDays(form.createdAt, form.paymentTerms);
    const items = form.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      price: Number(item.price),
      total: Number(item.quantity) * Number(item.price),
    }));
    return {
      ...form,
      id: existing?.id || generateId(),
      status,
      paymentDue,
      items,
      total: calcTotal(items),
    };
  }

  function handleSave(asDraft = false) {
    if (asDraft) {
      const invoice = buildInvoice("draft");
      isEdit ? updateInvoice(invoice.id, invoice) : addInvoice(invoice);
      onClose();
      return;
    }
    const errs = validateInvoice(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to first error
      const firstErr = document.querySelector('[data-error="true"]');
      firstErr?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const invoice = buildInvoice(isEdit ? existing.status : "pending");
    isEdit ? updateInvoice(invoice.id, invoice) : addInvoice(invoice);
    onClose();
  }

  const E = ({ field }) =>
    errors[field] ? (
      <span className={styles.errMsg} role="alert">
        {errors[field]}
      </span>
    ) : null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit invoice" : "New invoice"}
    >
      <div className={styles.drawer}>
        <div className={styles.drawerInner}>
          <h2 className={styles.heading}>
            {isEdit ? (
              <>
                Edit <span className={styles.hash}>#</span>
                {existing.id}
              </>
            ) : (
              "New Invoice"
            )}
          </h2>

          <div className={styles.form}>
            {/* ── Bill From ── */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Bill From</legend>

              <div
                className={styles.formGroup}
                data-error={!!errors.senderStreet}
              >
                <label htmlFor="senderStreet" className={styles.label}>
                  Street Address
                </label>
                <input
                  ref={firstInputRef}
                  id="senderStreet"
                  className={`${styles.input} ${errors.senderStreet ? styles.inputError : ""}`}
                  value={form.senderAddress?.street || ""}
                  onChange={(e) =>
                    setField("senderAddress.street", e.target.value)
                  }
                />
                <E field="senderStreet" />
              </div>

              <div className={styles.row3}>
                <div
                  className={styles.formGroup}
                  data-error={!!errors.senderCity}
                >
                  <label htmlFor="senderCity" className={styles.label}>
                    City
                  </label>
                  <input
                    id="senderCity"
                    className={`${styles.input} ${errors.senderCity ? styles.inputError : ""}`}
                    value={form.senderAddress?.city || ""}
                    onChange={(e) =>
                      setField("senderAddress.city", e.target.value)
                    }
                  />
                  <E field="senderCity" />
                </div>
                <div
                  className={styles.formGroup}
                  data-error={!!errors.senderPostCode}
                >
                  <label htmlFor="senderPostCode" className={styles.label}>
                    Post Code
                  </label>
                  <input
                    id="senderPostCode"
                    className={`${styles.input} ${errors.senderPostCode ? styles.inputError : ""}`}
                    value={form.senderAddress?.postCode || ""}
                    onChange={(e) =>
                      setField("senderAddress.postCode", e.target.value)
                    }
                  />
                  <E field="senderPostCode" />
                </div>
                <div
                  className={styles.formGroup}
                  data-error={!!errors.senderCountry}
                >
                  <label htmlFor="senderCountry" className={styles.label}>
                    Country
                  </label>
                  <input
                    id="senderCountry"
                    className={`${styles.input} ${errors.senderCountry ? styles.inputError : ""}`}
                    value={form.senderAddress?.country || ""}
                    onChange={(e) =>
                      setField("senderAddress.country", e.target.value)
                    }
                  />
                  <E field="senderCountry" />
                </div>
              </div>
            </fieldset>

            {/* ── Bill To ── */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Bill To</legend>

              <div
                className={styles.formGroup}
                data-error={!!errors.clientName}
              >
                <label htmlFor="clientName" className={styles.label}>
                  Client's Name
                </label>
                <input
                  id="clientName"
                  className={`${styles.input} ${errors.clientName ? styles.inputError : ""}`}
                  value={form.clientName}
                  onChange={(e) => setField("clientName", e.target.value)}
                />
                <E field="clientName" />
              </div>

              <div
                className={styles.formGroup}
                data-error={!!errors.clientEmail}
              >
                <label htmlFor="clientEmail" className={styles.label}>
                  Client's Email
                </label>
                <input
                  id="clientEmail"
                  type="email"
                  className={`${styles.input} ${errors.clientEmail ? styles.inputError : ""}`}
                  value={form.clientEmail}
                  onChange={(e) => setField("clientEmail", e.target.value)}
                  placeholder="e.g. email@example.com"
                />
                <E field="clientEmail" />
              </div>

              <div
                className={styles.formGroup}
                data-error={!!errors.clientStreet}
              >
                <label htmlFor="clientStreet" className={styles.label}>
                  Street Address
                </label>
                <input
                  id="clientStreet"
                  className={`${styles.input} ${errors.clientStreet ? styles.inputError : ""}`}
                  value={form.clientAddress?.street || ""}
                  onChange={(e) =>
                    setField("clientAddress.street", e.target.value)
                  }
                />
                <E field="clientStreet" />
              </div>

              <div className={styles.row3}>
                <div
                  className={styles.formGroup}
                  data-error={!!errors.clientCity}
                >
                  <label htmlFor="clientCity" className={styles.label}>
                    City
                  </label>
                  <input
                    id="clientCity"
                    className={`${styles.input} ${errors.clientCity ? styles.inputError : ""}`}
                    value={form.clientAddress?.city || ""}
                    onChange={(e) =>
                      setField("clientAddress.city", e.target.value)
                    }
                  />
                  <E field="clientCity" />
                </div>
                <div
                  className={styles.formGroup}
                  data-error={!!errors.clientPostCode}
                >
                  <label htmlFor="clientPostCode" className={styles.label}>
                    Post Code
                  </label>
                  <input
                    id="clientPostCode"
                    className={`${styles.input} ${errors.clientPostCode ? styles.inputError : ""}`}
                    value={form.clientAddress?.postCode || ""}
                    onChange={(e) =>
                      setField("clientAddress.postCode", e.target.value)
                    }
                  />
                  <E field="clientPostCode" />
                </div>
                <div
                  className={styles.formGroup}
                  data-error={!!errors.clientCountry}
                >
                  <label htmlFor="clientCountry" className={styles.label}>
                    Country
                  </label>
                  <input
                    id="clientCountry"
                    className={`${styles.input} ${errors.clientCountry ? styles.inputError : ""}`}
                    value={form.clientAddress?.country || ""}
                    onChange={(e) =>
                      setField("clientAddress.country", e.target.value)
                    }
                  />
                  <E field="clientCountry" />
                </div>
              </div>
            </fieldset>

            {/* ── Invoice Info ── */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Invoice Details</legend>

              <div className={styles.row2}>
                <div
                  className={styles.formGroup}
                  data-error={!!errors.createdAt}
                >
                  <label htmlFor="createdAt" className={styles.label}>
                    Invoice Date
                  </label>
                  <input
                    id="createdAt"
                    type="date"
                    className={`${styles.input} ${errors.createdAt ? styles.inputError : ""}`}
                    value={form.createdAt}
                    onChange={(e) => setField("createdAt", e.target.value)}
                  />
                  <E field="createdAt" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="paymentTerms" className={styles.label}>
                    Payment Terms
                  </label>
                  <select
                    id="paymentTerms"
                    className={styles.select}
                    value={form.paymentTerms}
                    onChange={(e) =>
                      setField("paymentTerms", Number(e.target.value))
                    }
                  >
                    {TERMS.map((t) => (
                      <option key={t} value={t}>
                        Net {t} {t === 1 ? "Day" : "Days"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                className={styles.formGroup}
                data-error={!!errors.description}
              >
                <label htmlFor="description" className={styles.label}>
                  Project Description
                </label>
                <input
                  id="description"
                  className={`${styles.input} ${errors.description ? styles.inputError : ""}`}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="e.g. Graphic Design Service"
                />
                <E field="description" />
              </div>
            </fieldset>

            {/* ── Item List ── */}
            <fieldset className={styles.fieldset}>
              <legend className={`${styles.legend} ${styles.itemsLegend}`}>
                Item List
              </legend>

              {form.items.length > 0 && (
                <div className={styles.itemsHead} aria-hidden="true">
                  <span>Item Name</span>
                  <span>Qty.</span>
                  <span>Price</span>
                  <span>Total</span>
                  <span />
                </div>
              )}

              <div className={styles.itemsList}>
                {form.items.map((item, i) => (
                  <div key={i} className={styles.itemRow}>
                    <div
                      className={styles.formGroup}
                      data-error={!!errors[`item_${i}_name`]}
                    >
                      <label
                        htmlFor={`item_name_${i}`}
                        className={`${styles.label} ${styles.mobileLabel}`}
                      >
                        Item Name
                      </label>
                      <input
                        id={`item_name_${i}`}
                        className={`${styles.input} ${errors[`item_${i}_name`] ? styles.inputError : ""}`}
                        value={item.name}
                        onChange={(e) => updateItem(i, "name", e.target.value)}
                        placeholder="Item name"
                        aria-label="Item name"
                      />
                    </div>

                    <div
                      className={styles.formGroup}
                      data-error={!!errors[`item_${i}_qty`]}
                    >
                      <label
                        htmlFor={`item_qty_${i}`}
                        className={`${styles.label} ${styles.mobileLabel}`}
                      >
                        Qty.
                      </label>
                      <input
                        id={`item_qty_${i}`}
                        type="number"
                        min="1"
                        className={`${styles.input} ${errors[`item_${i}_qty`] ? styles.inputError : ""}`}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(i, "quantity", e.target.value)
                        }
                        aria-label="Quantity"
                      />
                    </div>

                    <div
                      className={styles.formGroup}
                      data-error={!!errors[`item_${i}_price`]}
                    >
                      <label
                        htmlFor={`item_price_${i}`}
                        className={`${styles.label} ${styles.mobileLabel}`}
                      >
                        Price
                      </label>
                      <input
                        id={`item_price_${i}`}
                        type="number"
                        min="0"
                        step="0.01"
                        className={`${styles.input} ${errors[`item_${i}_price`] ? styles.inputError : ""}`}
                        value={item.price}
                        onChange={(e) => updateItem(i, "price", e.target.value)}
                        aria-label="Price"
                      />
                    </div>

                    <div className={styles.itemTotal}>
                      <span className={`${styles.label} ${styles.mobileLabel}`}>
                        Total
                      </span>
                      <span className={styles.itemTotalValue}>
                        {formatCurrency(item.quantity * item.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() => removeItem(i)}
                      aria-label={`Remove item ${item.name || i + 1}`}
                    >
                      <svg
                        width="13"
                        height="16"
                        viewBox="0 0 13 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M11.583 3.556h-2.361V2.278A2.278 2.278 0 0 0 6.944 0H5.667a2.278 2.278 0 0 0-2.278 2.278v1.278H1.028a.639.639 0 1 0 0 1.278H1.5l.85 9.083A1.917 1.917 0 0 0 4.261 15.5h4.089a1.917 1.917 0 0 0 1.911-1.583l.85-9.083h.472a.639.639 0 1 0 0-1.278zM4.667 2.278A1 1 0 0 1 5.667 1.278H6.944a1 1 0 0 1 1 1V3.556H4.667V2.278zm5.167 12.028a.639.639 0 0 1-.638.527H4.26a.639.639 0 0 1-.638-.527L2.783 4.833h7.045l-.994 9.473z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {errors.items && (
                <p
                  className={styles.errMsg}
                  role="alert"
                  style={{ marginTop: "8px" }}
                >
                  {errors.items}
                </p>
              )}

              <button
                type="button"
                className={styles.addItemBtn}
                onClick={addItem}
              >
                + Add New Item
              </button>
            </fieldset>
          </div>
          {/* /.form */}
        </div>
        {/* /.drawerInner */}

        {/* Footer */}
        <div className={styles.footer}>
          {!isEdit && (
            <button
              type="button"
              className={styles.discardBtn}
              onClick={onClose}
            >
              Discard
            </button>
          )}

          <div className={styles.footerRight}>
            {!isEdit && (
              <button
                type="button"
                className={styles.draftBtn}
                onClick={() => handleSave(true)}
              >
                Save as Draft
              </button>
            )}
            {isEdit && (
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              className={styles.saveBtn}
              onClick={() => handleSave(false)}
            >
              {isEdit ? "Save Changes" : "Save & Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
