import { useState } from "react";
import { useApp } from "../context/AppContext";
import StatusBadge from "./StatusBadge";
import { formatDate, formatCurrency } from "../utils/Invoice";
import styles from "./InvoiceList.module.css";

const FILTERS = ["all", "draft", "pending", "paid"];

export default function InvoiceList({ onSelect, onNew }) {
  const { invoices } = useApp();
  const [filter, setFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered =
    filter === "all"
      ? invoices
      : invoices.filter((inv) => inv.status === filter);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Invoices</h1>
          <p className={styles.subtitle}>
            {filtered.length === 0
              ? "No invoices"
              : `${filtered.length} invoice${filtered.length !== 1 ? "s" : ""}${filter !== "all" ? ` (${filter})` : ""}`}
          </p>
        </div>

        <div className={styles.controls}>
          {/* Filter dropdown */}
          <div className={styles.filterWrap}>
            <button
              className={styles.filterBtn}
              onClick={() => setFilterOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={filterOpen}
            >
              <span>Filter{window.innerWidth > 600 ? " by status" : ""}</span>
              <svg
                className={`${styles.chevron} ${filterOpen ? styles.open : ""}`}
                width="10"
                height="7"
                viewBox="0 0 10 7"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="#7c5dfa"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {filterOpen && (
              <div
                className={styles.filterDropdown}
                role="listbox"
                aria-label="Filter by status"
              >
                {FILTERS.map((f) => (
                  <label
                    key={f}
                    className={styles.filterOption}
                    role="option"
                    aria-selected={filter === f}
                  >
                    <input
                      type="checkbox"
                      checked={filter === f}
                      onChange={() => {
                        setFilter(f);
                        setFilterOpen(false);
                      }}
                      className={styles.filterCheck}
                    />
                    <span className={styles.customCheck} aria-hidden="true">
                      {filter === f && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* New invoice */}
          <button
            className={styles.newBtn}
            onClick={onNew}
            aria-label="Create new invoice"
          >
            <span className={styles.plusIcon} aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path
                  d="M5.5 0V11M0 5.5H11"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            New{window.innerWidth > 600 ? " Invoice" : ""}
          </button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIllustration} aria-hidden="true">
            <svg width="242" height="200" viewBox="0 0 242 200" fill="none">
              <ellipse
                cx="121"
                cy="188"
                rx="80"
                ry="12"
                fill="rgba(99,102,241,0.05)"
              />
              <rect
                x="61"
                y="40"
                width="120"
                height="148"
                rx="8"
                fill="var(--surface-2)"
              />
              <rect
                x="76"
                y="60"
                width="90"
                height="8"
                rx="4"
                fill="var(--surface-3)"
              />
              <rect
                x="76"
                y="80"
                width="60"
                height="6"
                rx="3"
                fill="var(--surface-3)"
              />
              <rect
                x="76"
                y="100"
                width="75"
                height="6"
                rx="3"
                fill="var(--surface-3)"
              />
              <circle cx="121" cy="28" r="20" fill="#7c5dfa" opacity="0.2" />
              <text
                x="121"
                y="34"
                textAnchor="middle"
                fontSize="20"
                fill="#7c5dfa"
              >
                ?
              </text>
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>Nothing here</h2>
          <p className={styles.emptyText}>
            Create an invoice by clicking the <strong>New Invoice</strong>{" "}
            button
          </p>
        </div>
      ) : (
        <ul className={styles.list} role="list">
          {filtered.map((inv, i) => (
            <li
              key={inv.id}
              className={styles.card}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <button
                className={styles.cardBtn}
                onClick={() => onSelect(inv.id)}
                aria-label={`View invoice ${inv.id} for ${inv.clientName}`}
              >
                <span className={styles.cardId}>
                  <span className={styles.hash} aria-hidden="true">
                    #
                  </span>
                  {inv.id}
                </span>
                <span className={styles.cardDue}>
                  Due {formatDate(inv.paymentDue)}
                </span>
                <span className={styles.cardClient}>{inv.clientName}</span>
                <span className={styles.cardAmount}>
                  {formatCurrency(inv.total)}
                </span>
                <StatusBadge status={inv.status} />
                <svg
                  className={styles.arrow}
                  width="7"
                  height="10"
                  viewBox="0 0 7 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 1L5 5L1 9"
                    stroke="#7c5dfa"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
