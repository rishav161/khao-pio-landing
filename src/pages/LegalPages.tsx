import type { ReactNode } from 'react'
import { ArrowLeft, Flame } from 'lucide-react'

function LegalHeader() {
  return (
    <header className="border-b border-white/5 bg-bg-surface/40">
      <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="text-2xl">
            <Flame size={22} className="text-brand-primary" />
          </span>
          <span className="font-heading font-black text-lg text-white tracking-tight">
            KHAO<span className="text-brand-primary">PIO</span>
          </span>
        </a>
        <a
          href="#"
          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to home
        </a>
      </div>
    </header>
  )
}

function LegalFooter() {
  return (
    <footer className="mt-auto bg-[#05070a] border-t border-white/5 py-8">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} KhaoPio Restaurant Point of Sale. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-heading font-bold text-white">{title}</h2>
      <div className="flex flex-col gap-3 text-sm md:text-base text-text-secondary leading-relaxed">
        {children}
      </div>
    </section>
  )
}

const LAST_UPDATED = 'August 19, 2026'

export function PrivacyPolicy() {
  return (
    <div className="bg-bg-deep min-h-screen flex flex-col font-body antialiased">
      <LegalHeader />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-brand-primary tracking-widest uppercase">Legal</span>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">Privacy Policy</h1>
            <p className="text-sm text-text-muted">Last updated: {LAST_UPDATED}</p>
          </div>

          <p className="text-sm md:text-base text-text-secondary leading-relaxed">
            KhaoPio ("we," "us," or "our") provides point-of-sale software for restaurants, covering
            waiter ordering, kitchen ticketing, cashier billing, and staff administration. This policy
            explains what information we collect through the KhaoPio POS application and this website,
            how we use it, and the choices you have.
          </p>

          <Section title="1. Information We Collect">
            <p><b className="text-white">Account and staff information</b> — name, email address, role
              (waiter, kitchen chef, cashier, admin), and login credentials for staff you invite into
              your restaurant's KhaoPio account.</p>
            <p><b className="text-white">Restaurant and business information</b> — restaurant name,
              address, menu items, pricing, and tax configuration entered into the POS.</p>
            <p><b className="text-white">Transaction and order data</b> — order tickets (KOTs), table
              assignments, item quantities, applied discounts, and bill totals generated during normal
              use of the POS.</p>
            <p><b className="text-white">Payment information</b> — we record the payment method used
              (cash, card, or UPI) and the amount charged. Card and UPI payments are processed by our
              third-party payment processors; KhaoPio does not store full card numbers or bank
              credentials.</p>
            <p><b className="text-white">Usage and device data</b> — browser type, IP address, and
              general usage patterns collected automatically when you use our website or POS
              application, to help us diagnose issues and improve reliability.</p>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc list-inside flex flex-col gap-1.5">
              <li>Operate and maintain the POS: syncing orders between waiters, kitchen, and cashier in real time</li>
              <li>Authenticate staff logins and enforce role-based permissions</li>
              <li>Generate bills, receipts, and shift/sales reports for your restaurant</li>
              <li>Send transactional emails, such as staff invitation links and account notifications</li>
              <li>Monitor system performance, detect abuse, and fix bugs</li>
              <li>Respond to support requests submitted through our contact form</li>
            </ul>
          </Section>

          <Section title="3. How We Share Information">
            <p>We do not sell your data. We share information only with:</p>
            <ul className="list-disc list-inside flex flex-col gap-1.5">
              <li>Payment processors, to complete card and UPI transactions</li>
              <li>Infrastructure providers (hosting, email delivery) who process data on our behalf under contract</li>
              <li>Authorities, where required by law or to protect the rights and safety of KhaoPio, our customers, or the public</li>
            </ul>
          </Section>

          <Section title="4. Data Retention">
            <p>
              We retain order, billing, and account data for as long as your restaurant maintains an
              active KhaoPio account, and for a reasonable period afterward to meet accounting,
              tax, and legal obligations. You may request deletion of your restaurant's account data
              by contacting us, subject to any records we are legally required to keep.
            </p>
          </Section>

          <Section title="5. Data Security">
            <p>
              Staff passwords are stored using industry-standard hashing (bcrypt), and staff sessions
              are authenticated via signed tokens (JWT). We use encryption in transit for all data sent
              to and from the POS. No system is perfectly secure, and we encourage restaurant admins to
              use strong, unique passwords and to revoke access promptly when staff leave.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>
              Depending on your location, you may have the right to access, correct, or delete personal
              information we hold about you, or to object to certain processing. Restaurant admins can
              manage and remove staff accounts directly from the Admin console; for other requests,
              contact us using the details below.
            </p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>
              KhaoPio is intended for use by restaurant businesses and their staff. It is not directed
              at children, and we do not knowingly collect personal information from anyone under 16.
            </p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>
              We may update this policy as KhaoPio evolves. Material changes will be reflected by
              updating the "Last updated" date above, and significant changes will be communicated to
              restaurant admins directly.
            </p>
          </Section>

          <Section title="9. Contact Us">
            <p>
              Questions about this policy can be sent to{' '}
              <a href="mailto:contact@khaopio.com" className="text-brand-primary hover:underline">contact@khaopio.com</a>{' '}
              or to our Tech District, New Delhi office.
            </p>
          </Section>
        </div>
      </main>
      <LegalFooter />
    </div>
  )
}

export function TermsOfService() {
  return (
    <div className="bg-bg-deep min-h-screen flex flex-col font-body antialiased">
      <LegalHeader />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-brand-primary tracking-widest uppercase">Legal</span>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">Terms of Service</h1>
            <p className="text-sm text-text-muted">Last updated: {LAST_UPDATED}</p>
          </div>

          <p className="text-sm md:text-base text-text-secondary leading-relaxed">
            These Terms of Service ("Terms") govern access to and use of KhaoPio's point-of-sale
            software and website (the "Service"), provided by KhaoPio ("we," "us," or "our"). By
            creating an account or using the Service, you agree to these Terms on behalf of yourself
            and, if applicable, the restaurant business you represent.
          </p>

          <Section title="1. The Service">
            <p>
              KhaoPio provides restaurant point-of-sale software, including waiter ordering, kitchen
              order ticketing, cashier billing, and staff administration and invitations. We may add,
              change, or remove features over time to improve reliability and functionality.
            </p>
          </Section>

          <Section title="2. Accounts and Staff Access">
            <p>
              A restaurant admin creates the primary KhaoPio account and is responsible for inviting
              and managing staff (waiters, kitchen chefs, cashiers). Admins are responsible for the
              accuracy of information provided, for maintaining the confidentiality of login
              credentials, and for promptly revoking access when a staff member leaves.
            </p>
          </Section>

          <Section title="3. Subscription and Fees">
            <p>
              Access to KhaoPio is provided under the subscription plan selected at sign-up. Fees are
              billed in advance on a recurring basis unless otherwise agreed in writing. Failure to pay
              may result in suspension of access to the Service until payment is resolved.
            </p>
          </Section>

          <Section title="4. Acceptable Use">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside flex flex-col gap-1.5">
              <li>Use the Service for any unlawful purpose or in violation of applicable regulations</li>
              <li>Attempt to bypass role-based permissions or access another restaurant's data without authorization</li>
              <li>Reverse engineer, decompile, or attempt to extract the source code of the Service, except as permitted by law</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
            </ul>
          </Section>

          <Section title="5. Payments Processing">
            <p>
              Card and UPI payments taken through KhaoPio are processed by third-party payment
              processors. Your use of those payment methods is also subject to the applicable
              processor's terms. KhaoPio is not a party to the underlying transaction between you and
              your customer and is not liable for processor outages or disputes.
            </p>
          </Section>

          <Section title="6. Your Data">
            <p>
              You retain ownership of your restaurant's menu, order, and business data entered into
              KhaoPio. You grant us a limited license to process that data solely to provide and
              improve the Service. See our{' '}
              <a href="#/privacy" className="text-brand-primary hover:underline">Privacy Policy</a>{' '}
              for details on how data is handled.
            </p>
          </Section>

          <Section title="7. Service Availability">
            <p>
              We aim for high uptime and reliable real-time sync between waiter, kitchen, and cashier
              devices, but the Service is provided on an "as available" basis. We do not guarantee
              uninterrupted or error-free operation, and scheduled maintenance may occasionally affect
              access.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, KhaoPio will not be liable for indirect,
              incidental, or consequential damages, including lost revenue or lost data, arising from
              your use of the Service. Our total liability for any claim will not exceed the fees you
              paid us in the three months preceding the claim.
            </p>
          </Section>

          <Section title="9. Termination">
            <p>
              You may cancel your subscription at any time. We may suspend or terminate access if
              these Terms are violated, or if fees remain unpaid after notice. Upon termination, you
              may request an export of your restaurant's data within a reasonable period.
            </p>
          </Section>

          <Section title="10. Governing Law">
            <p>
              These Terms are governed by the laws of India, without regard to conflict-of-law
              principles, and any disputes will be subject to the exclusive jurisdiction of the courts
              in New Delhi, India.
            </p>
          </Section>

          <Section title="11. Changes to These Terms">
            <p>
              We may update these Terms from time to time. Continued use of the Service after changes
              take effect constitutes acceptance of the revised Terms.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>
              Questions about these Terms can be sent to{' '}
              <a href="mailto:contact@khaopio.com" className="text-brand-primary hover:underline">contact@khaopio.com</a>.
            </p>
          </Section>
        </div>
      </main>
      <LegalFooter />
    </div>
  )
}
