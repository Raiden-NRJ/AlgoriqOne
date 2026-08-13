'use client';

/**
 * §8 The permission reveal — the most persuasive interaction on the site
 * (docs/09 §5). Pick a role, and the mock interface beside the matrix loses the
 * navigation items and buttons that role cannot use.
 *
 * Every permission key below is a real key from the platform's catalog. The
 * roles are illustrative examples of how a tenant might configure them.
 *
 * Accessibility: a real <table> with scoped headers and a caption, plus a live
 * region announcing the selected role's effect. Keyboard-operable throughout.
 */

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/components/site/primitives';

interface Role {
  id: string;
  name: string;
  /** Permission keys this role holds. */
  grants: string[];
}

const ACTIONS = [
  { key: 'crm.lead.read', label: 'View leads' },
  { key: 'sales.deal.approve', label: 'Approve deals' },
  { key: 'timesheet.timesheet.approve', label: 'Approve timesheets' },
  { key: 'employee.employee.read', label: 'View employees' },
  { key: 'billing.invoice.refund', label: 'Refund invoices' },
  { key: 'platform.workflow.manage', label: 'Edit workflows' },
] as const;

const ROLES: Role[] = [
  { id: 'sales-rep', name: 'Sales Rep', grants: ['crm.lead.read'] },
  {
    id: 'delivery-lead',
    name: 'Delivery Lead',
    grants: ['crm.lead.read', 'timesheet.timesheet.approve', 'employee.employee.read'],
  },
  { id: 'hr-partner', name: 'HR Partner', grants: ['employee.employee.read'] },
  {
    id: 'finance',
    name: 'Finance',
    grants: ['billing.invoice.refund', 'employee.employee.read'],
  },
  {
    id: 'tenant-admin',
    name: 'Tenant Admin',
    grants: ACTIONS.map((a) => a.key),
  },
];

/** Navigation items, and the permission each one requires. */
const NAV_ITEMS = [
  { label: 'Leads', permission: 'crm.lead.read' },
  { label: 'Deals', permission: 'sales.deal.approve' },
  { label: 'Timesheets', permission: 'timesheet.timesheet.approve' },
  { label: 'Employees', permission: 'employee.employee.read' },
  { label: 'Invoices', permission: 'billing.invoice.refund' },
  { label: 'Workflows', permission: 'platform.workflow.manage' },
];

export function PermissionMatrix() {
  const [roleId, setRoleId] = useState(ROLES[1]!.id);
  const role = ROLES.find((r) => r.id === roleId)!;
  const visible = NAV_ITEMS.filter((item) => role.grants.includes(item.permission));
  const reduced = useReducedMotion();

  return (
    <div className="flex flex-col gap-6">
      {/* Role selector */}
      <div className="flex flex-wrap gap-2">
        {ROLES.map((option) => {
          const selected = option.id === roleId;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setRoleId(option.id)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                selected
                  ? 'border-[var(--color-brand-400)] bg-[var(--color-brand-600)] text-white'
                  : 'border-[var(--color-band-border)] bg-[var(--color-band-surface)] text-[var(--color-band-fg-muted)] hover:text-[var(--color-band-fg)]',
              )}
            >
              {option.name}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.35fr_1fr]">
        {/* The matrix */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Permission matrix, scrollable table"
          className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-band-border)] bg-[var(--color-band-surface)]"
        >
          <table className="w-full min-w-[22rem] border-collapse text-left">
            <caption className="sr-only">
              Permissions held by the {role.name} role. Each row is a permission key from the
              Algoryq One catalog.
            </caption>
            <thead>
              <tr className="border-b border-[var(--color-band-border)]">
                <th scope="col" className="px-4 py-2.5 text-label text-[var(--color-band-fg-muted)]">
                  Permission
                </th>
                <th scope="col" className="px-4 py-2.5 text-label text-[var(--color-band-fg-muted)]">
                  {role.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {ACTIONS.map((action) => {
                const granted = role.grants.includes(action.key);
                return (
                  <tr
                    key={action.key}
                    className="border-b border-[var(--color-band-border)] last:border-b-0"
                  >
                    <th scope="row" className="px-4 py-3 font-normal">
                      <span className="block text-sm text-[var(--color-band-fg)]">
                        {action.label}
                      </span>
                      <code className="mt-0.5 block font-mono text-xs text-[var(--color-band-fg-muted)]">
                        {action.key}
                      </code>
                    </th>
                    <td className="px-4 py-3">
                      {/*
                        key={granted} forces a clean remount instead of an
                        AnimatePresence exit/enter pair — an earlier version
                        used mode="wait" here and, on this React 19 + framer-
                        motion combination, the exit-complete callback never
                        fired: the badge froze on its first value and never
                        updated on later role clicks (confirmed live). This
                        version has no exit lifecycle to get stuck in; the old
                        badge just disappears and the new one fades in.
                      */}
                      {granted ? (
                        <motion.span
                          key="allowed"
                          initial={reduced ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: reduced ? 0 : 0.12 }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-success-band)]"
                        >
                          <Check className="size-4" aria-hidden />
                          Allowed
                        </motion.span>
                      ) : (
                        <motion.span
                          key="denied"
                          initial={reduced ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: reduced ? 0 : 0.12 }}
                          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-band-fg-muted)]"
                        >
                          <Minus className="size-4" aria-hidden />
                          Denied
                        </motion.span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* The consequence, rendered */}
        <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-band-border)] bg-[var(--color-band-surface)] p-4">
          <p className="text-label text-[var(--color-band-fg-muted)]">
            What {role.name} sees in the portal
          </p>

          {/*
            No AnimatePresence here either, for the same reason as the badge
            above: mode="popLayout" has the identical exit-complete problem on
            this React 19 + framer-motion pairing — removed items never
            actually unmounted, so switching roles kept accumulating every
            item ever granted instead of showing only the current role's set
            (confirmed live: Sales Rep, who holds one permission, showed all
            six). React's own key-based reconciliation removes the old items
            instantly and mounts the new ones, which still fade/grow in.
          */}
          <ul className="flex flex-col gap-1.5">
              {visible.map((item) => (
                <motion.li
                  key={item.label}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: reduced ? 0 : 0.16 }}
                  className="overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-band)] px-3 py-2 text-sm text-[var(--color-band-fg)]"
                >
                  {item.label}
                </motion.li>
              ))}
            {visible.length === 0 ? (
              <li className="rounded-[var(--radius-sm)] border border-dashed border-[var(--color-band-border)] px-3 py-2 text-sm text-[var(--color-band-fg-muted)]">
                Nothing in this set
              </li>
            ) : null}
          </ul>

          <p aria-live="polite" className="mt-auto text-xs leading-relaxed text-[var(--color-band-fg-muted)]">
            {role.name} holds {role.grants.length} of {ACTIONS.length} permissions. Hidden items are
            also refused at the API — a direct call returns 403, not data.
          </p>
        </div>
      </div>
    </div>
  );
}
