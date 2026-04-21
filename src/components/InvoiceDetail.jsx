import { useState } from "react";
import { useApp } from "../context/AppContext";
import StatusBadge from "./StatusBadge";
import { formatDate, formatCurrency } from "../utils/Invoice";
import styles from "./InvoiceDetail.module.css";

export default function InvoiceDetail({ invoiceId, onBack, onEdit }) {
  const { invoices, markAsPaid, deleteInvoice } = useApp();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const invoice = invoices.find((inv) => inv.id === invoiceId);
  if (!invoice) return null;

  function handleDelete() {
    deleteInvoice(invoice.id);
    onBack();
  }

  function handleDeleteModalKeyDown(e) {
    if (e.key === "Escape") {
      setShowDeleteModal(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Back */}
      <button
        className={styles.backBtn}
        onClick={onBack}
        aria-label="Go back to invoice list"
      >
        <svg
          width="7"
          height="10"
          viewBox="0 0 7 10"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 1L2 5L6 9"
            stroke="#7c5dfa"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Go back
      </button>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span className={styles.statusLabel}>Status</span>
          <StatusBadge status={invoice.status} />
        </div>

        <div className={styles.actions}>
          {invoice.status !== "paid" && (
            <button
              className={styles.editBtn}
              onClick={() => onEdit(invoice.id)}
            >
              Edit
            </button>
          )}
          <button
            className={styles.deleteBtn}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
          {invoice.status === "pending" && (
            <button
              className={styles.paidBtn}
              onClick={() => markAsPaid(invoice.id)}
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Detail card */}
      <div className={styles.card}>
        {/* Top */}
        <div className={styles.top}>
          <div>
            <p className={styles.invoiceId}>
              <span className={styles.hash}>#</span>
              {invoice.id}
            </p>
            <p className={styles.description}>{invoice.description}</p>
          </div>
          <address className={styles.senderAddr}>
            <span>{invoice.senderAddress?.street}</span>
            <span>{invoice.senderAddress?.city}</span>
            <span>{invoice.senderAddress?.postCode}</span>
            <span>{invoice.senderAddress?.country}</span>
          </address>
        </div>

        {/* Meta grid */}
        <div className={styles.metaGrid}>
          <div className={styles.metaGroup}>
            <p className={styles.metaLabel}>Invoice Date</p>
            <p className={styles.metaValue}>{formatDate(invoice.createdAt)}</p>
          </div>
          <div className={styles.metaGroup}>
            <p className={styles.metaLabel}>Payment Due</p>
            <p className={styles.metaValue}>{formatDate(invoice.paymentDue)}</p>
          </div>
          <div className={styles.metaGroup}>
            <p className={styles.metaLabel}>Bill To</p>
            <p className={styles.metaValue}>{invoice.clientName}</p>
            <address className={styles.clientAddr}>
              <span>{invoice.clientAddress?.street}</span>
              <span>{invoice.clientAddress?.city}</span>
              <span>{invoice.clientAddress?.postCode}</span>
              <span>{invoice.clientAddress?.country}</span>
            </address>
          </div>
          <div className={styles.metaGroup}>
            <p className={styles.metaLabel}>Sent To</p>
            <p className={styles.metaValue}>{invoice.clientEmail}</p>
          </div>
        </div>

        {/* Items table */}
        <div className={styles.itemsWrap}>
          <div className={styles.itemsTable}>
            <div className={styles.tableHead}>
              <span>Item Name</span>
              <span>QTY.</span>
              <span>Price</span>
              <span>Total</span>
            </div>
            {invoice.items?.map((item, i) => (
              <div key={i} className={styles.tableRow}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemQty}>{item.quantity}</span>
                <span className={styles.itemPrice}>
                  {formatCurrency(item.price)}
                </span>
                <span className={styles.itemTotal}>
                  {formatCurrency(item.total || item.quantity * item.price)}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.totalBar}>
            <span>Amount Due</span>
            <span className={styles.grandTotal}>
              {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          onClick={(e) =>
            e.target === e.currentTarget && setShowDeleteModal(false)
          }
          onKeyDown={handleDeleteModalKeyDown}
        >
          <div className={styles.modal}>
            <h2 id="delete-title" className={styles.modalTitle}>
              Confirm Deletion
            </h2>
            <p className={styles.modalText}>
              Are you sure you want to delete invoice{" "}
              <strong>#{invoice.id}</strong>? This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.deleteConfirmBtn}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
