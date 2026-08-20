import { useState, useEffect, useRef } from 'react'
import './App.css'
import { PrivacyPolicy, TermsOfService } from './pages/LegalPages'
import {
  Flame,
  Shield,
  Zap,
  CircleDollarSign,
  CookingPot,
  Utensils,
  Receipt,
  Check,
  Users,
  ArrowRight,
  Menu,
  X,
  Star,
  Mail,
  Phone,
  MapPin,
  Send,
  RefreshCw,
  LayoutDashboard,
  LayoutGrid,
  BarChart3
} from 'lucide-react'

// Mock Initial Data
const INITIAL_CART = [
  { id: '1', name: 'Paneer Butter Masala', price: 280, qty: 1 },
  { id: '2', name: 'Butter Naan', price: 50, qty: 2 },
  { id: '3', name: 'Jeera Rice', price: 160, qty: 1 }
]

const INITIAL_KOTS = [
  { id: 'KOT-849', table: 'Table 4', items: '2x Butter Naan, 1x Paneer Butter Masala', status: 'preparing' },
  { id: 'KOT-850', table: 'Table 9', items: '1x Jeera Rice, 1x Dal Fry', status: 'preparing' }
]

const INITIAL_INVITES = [
  { email: 'rohan.waiter@khaopio.com', role: 'Waiter', status: 'Pending', token: 'tok_8d92a1' },
  { email: 'meera.chef@khaopio.com', role: 'Kitchen Chef', status: 'Active', token: 'tok_5b17c9' }
]

const ORDER_PIPELINE = [
  { icon: Utensils, label: 'Order Placed', count: 4, ticket: '#102 · Takeaway · ₹547.80' },
  { icon: CookingPot, label: 'In Kitchen', count: 3, ticket: '#108 · Table 6 · Firing 3 items' },
  { icon: Receipt, label: 'At Checkout', count: 2, ticket: '#105 · Table 2 · Awaiting UPI' },
  { icon: Check, label: 'Completed', count: 24, ticket: '#107 · Takeaway · Paid ₹1,283.70' }
]

const MODULE_FEATURES = [
  {
    icon: Utensils,
    title: 'Menu Configuration',
    description: 'Organize dishes into categories, price each one, and mark anything Sold Out in one tap — it disappears from every waiter\'s screen instantly, not just the kitchen\'s.'
  },
  {
    icon: Users,
    title: 'Staff & Roles',
    description: 'Five permission tiers, Super Admin down to Kitchen Chef, so a waiter can fire tickets but never touch pricing. Invite a hire by email and they\'re active before their first shift.'
  },
  {
    icon: BarChart3,
    title: 'Reports & Tax Logs',
    description: 'Filter by date range and payment method down to a dish-level transaction log, with tax and service charge broken out per order — everything a GST return needs, already itemized.'
  }
]

function App() {
  const POS_URL = import.meta.env.VITE_RESTURANT_POS
  const INQUIRY_EMAIL = import.meta.env.VITE_INQUIRY_EMAIL || import.meta.env.INQUIRY_EMAIL || 'contact@khaopio.com'

  // Full-page legal routes (hash-based, no router dependency needed)
  const [route, setRoute] = useState(() => window.location.hash)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      setRoute(hash)
      if (hash.startsWith('#/')) window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Navigation & Scroll State
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Interactive Role Tabs
  const [activeTab, setActiveTab] = useState<'waiter' | 'chef' | 'cashier' | 'admin'>('waiter')

  // Waiter Simulator State
  const [cart, setCart] = useState(INITIAL_CART)

  // Chef Simulator State
  const [kots, setKots] = useState(INITIAL_KOTS)

  // Cashier Simulator State
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'UPI'>('UPI')
  const [couponCode, setCouponCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  // Admin Simulator State
  const [invites, setInvites] = useState(INITIAL_INVITES)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Waiter')

  // Contact Form State
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; message?: string; submit?: string }>({})
  const [formSuccess, setFormSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Scroll reveal trigger
  const revealRefs = useRef<HTMLDivElement[]>([])

  const addToRevealRefs = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el)
    }
  }

  // Handle header scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 55) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        });
      },
      { threshold: 0.1 }
    )

    revealRefs.current.forEach((ref) => observer.observe(ref))
    return () => observer.disconnect()
  }, [])

  // Waiter Actions
  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item))
        .filter((item) => item.qty > 0)
    )
  }

  // Subtotal Calculation (BigJS mock for landing demonstration)
  const getSubtotal = () => cart.reduce((acc, item) => acc + item.price * item.qty, 0)
  const taxRate = 0.05 // 5% GST
  const serviceRate = 0.05 // 5% Service Charge
  const subtotal = getSubtotal()
  const taxTotal = Math.round(subtotal * taxRate)
  const serviceTotal = Math.round(subtotal * serviceRate)
  const discountTotal = Math.round(subtotal * appliedDiscount)
  const grandTotal = subtotal + taxTotal + serviceTotal - discountTotal

  // Chef Actions
  const markKotReady = (id: string) => {
    setKots((prev) =>
      prev.map((kot) => (kot.id === id ? { ...kot, status: 'ready' } : kot))
    )
    setTimeout(() => {
      // Auto-clear ready orders after 2 seconds for visual interest
      setKots((prev) => prev.filter((kot) => kot.id !== id))
    }, 2000)
  }

  const resetKots = () => {
    setKots(INITIAL_KOTS)
  }

  // Cashier Actions
  const applyCoupon = () => {
    setCouponError('')
    if (couponCode.toUpperCase() === 'KHAOPIO10') {
      setAppliedDiscount(0.1) // 10% discount
    } else if (couponCode.trim() === '') {
      setCouponError('Please enter a coupon code.')
    } else {
      setCouponError('Invalid coupon code. Try KHAOPIO10')
    }
  }

  const resetCheckout = () => {
    setCart(INITIAL_CART)
    setAppliedDiscount(0)
    setCouponCode('')
    setCheckoutSuccess(false)
  }

  // Admin Actions
  const sendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail) return
    const newToken = 'tok_' + Math.random().toString(36).substr(2, 6)
    setInvites((prev) => [
      ...prev,
      { email: inviteEmail, role: inviteRole, status: 'Pending', token: newToken }
    ])
    setInviteEmail('')
  }

  // Contact Form Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: { name?: string; email?: string; message?: string; submit?: string } = {}

    if (!formName.trim()) errors.name = 'Name is required'
    if (!formEmail.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formEmail)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!formMessage.trim()) errors.message = 'Message is required'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${INQUIRY_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          message: formMessage,
          _subject: `New Setup Inquiry from ${formName}`,
          _template: 'table'
        })
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok || data.success === 'true' || data.success === true) {
        setFormSuccess(true)
        setFormName('')
        setFormEmail('')
        setFormMessage('')
      } else {
        setFormErrors({ submit: data.message || 'Failed to send inquiry email. Please try again.' })
      }
    } catch {
      setFormErrors({ submit: 'Network error. Please check your connection and try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (route === '#/privacy') return <PrivacyPolicy />
  if (route === '#/terms') return <TermsOfService />

  return (
    <div className="bg-bg-deep min-h-screen flex flex-col font-body antialiased selection:bg-brand-primary selection:text-white">

      {/* 1. Header & Navigation */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-bg-deep/95 border-b border-brand-primary/20 shadow-2xl backdrop-blur-md' : 'bg-transparent border-b border-white/5'}`}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="logo-fire-anim text-2xl filter drop-shadow-[0_0_8px_rgba(255,92,53,0.6)]">🔥</span>
            <span className="font-heading font-black text-xl text-white tracking-tight">
              KHAO<span className="text-brand-primary">PIO</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-text-secondary hover:text-white transition-colors relative py-2 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brand-primary after:transition-all hover:after:w-full">Features</a>
            <a href="#workflow" className="text-sm font-medium text-text-secondary hover:text-white transition-colors relative py-2 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brand-primary after:transition-all hover:after:w-full">Interactive Demo</a>
            <a href="#benefits" className="text-sm font-medium text-text-secondary hover:text-white transition-colors relative py-2 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brand-primary after:transition-all hover:after:w-full">Benefits</a>
            <a href="#metrics" className="text-sm font-medium text-text-secondary hover:text-white transition-colors relative py-2 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brand-primary after:transition-all hover:after:w-full">Metrics</a>
            <a href="#testimonials" className="text-sm font-medium text-text-secondary hover:text-white transition-colors relative py-2 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brand-primary after:transition-all hover:after:w-full">Testimonials</a>
          </nav>

          {/* Header Action Button */}
          <div className="hidden md:flex items-center">
            <a
              href={POS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full font-heading font-semibold text-sm bg-brand-primary hover:bg-brand-primary-hover text-white transition-all shadow-[0_0_15px_rgba(255,92,53,0.3)] hover:shadow-[0_0_20px_rgba(255,92,53,0.55)] hover:-translate-y-0.5"
            >
              Launch POS App
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-brand-primary transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed top-20 left-0 w-full h-[calc(100vh-80px)] bg-bg-deep/98 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8 animate-[fadeIn_0.2s_ease-out]">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-heading text-text-secondary hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-heading text-text-secondary hover:text-white transition-colors"
            >
              Interactive Demo
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-heading text-text-secondary hover:text-white transition-colors"
            >
              Benefits
            </a>
            <a
              href="#metrics"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-heading text-text-secondary hover:text-white transition-colors"
            >
              Metrics
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-heading text-text-secondary hover:text-white transition-colors"
            >
              Testimonials
            </a>
            <a
              href={POS_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-8 py-3 rounded-full font-heading font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg transition-all mt-4"
            >
              Launch POS App
            </a>
          </div>
        )}
      </header>

      {/* Main Content Sections */}
      <main className="pt-20">

        {/* 2. Hero Section (Product Introduction) */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Subtle glowing backgrounds */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-primary/10 rounded-full filter blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-secondary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left side copy */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-semibold self-start tracking-wider uppercase">
                <Flame size={12} className="animate-pulse" /> Streamlining Restaurant Operations
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white leading-[1.08] tracking-tight">
                The Lightning-Fast <br className="hidden md:inline" />
                POS That Keeps Your <br />
                <span className="text-brand-primary">Kitchen in Sync.</span>
              </h1>
              <p className="text-text-secondary text-lg md:text-xl max-w-xl font-normal leading-relaxed">
                Connect waiters, kitchen chefs, and cashiers seamlessly. Boost ordering speeds by 10x, eliminate billing discrepancies, and run table operations with pixel-perfect control.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#workflow"
                  className="px-8 py-4 rounded-full font-heading font-bold text-sm bg-brand-primary hover:bg-brand-primary-hover text-white transition-all shadow-[0_0_20px_rgba(255,92,53,0.4)] hover:shadow-[0_0_30px_rgba(255,92,53,0.65)] hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Try Interactive POS Demo <ArrowRight size={16} />
                </a>
                <a
                  href={POS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full font-heading font-bold text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-brand-primary/30 transition-all hover:-translate-y-0.5"
                >
                  Enter POS System
                </a>
              </div>
            </div>

            {/* Right side floating mockup dashboard */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[420px] aspect-[4/3] perspective-[1200px]">
                {/* Main panel */}
                <div className="w-full h-full bg-gradient-to-br from-[#1c1512] to-[#0a0806] border border-white/10 rounded-2xl shadow-3xl p-6 rotate-y-[-10deg] rotate-x-[10deg] hover:rotate-y-[-3deg] hover:rotate-x-[3deg] transition-all duration-700 ease-out transform-3d hover:scale-[1.02] group">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-5">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#ff5f56]"></span>
                      <span className="w-2 h-2 rounded-full bg-[#ffbd2e]"></span>
                      <span className="w-2 h-2 rounded-full bg-[#27c93f]"></span>
                    </div>
                    <span className="font-heading text-[10px] text-text-muted uppercase tracking-widest font-bold">KhaoPio POS Dashboard</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/2 p-4 rounded-xl border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] text-text-muted font-semibold uppercase">Total Sales Today</span>
                      <span className="text-white font-heading font-bold text-lg">₹48,930.00</span>
                      <span className="text-xs text-[#27c93f] flex items-center gap-1">↑ 14.2%</span>
                    </div>
                    <div className="bg-white/2 p-4 rounded-xl border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] text-text-muted font-semibold uppercase">Active Orders</span>
                      <span className="text-white font-heading font-bold text-lg">12 KOTs</span>
                      <span className="text-xs text-brand-secondary">4 in Preparation</span>
                    </div>
                    <div className="col-span-2 bg-white/2 p-4 rounded-xl border border-white/5 flex flex-col gap-2">
                      <span className="text-[10px] text-text-muted font-semibold uppercase">Table Occupancy Map</span>
                      <div className="grid grid-cols-6 gap-2">
                        {['T1', 'T2', 'T3', 'T4', 'T5', 'T6'].map((t, idx) => (
                          <span
                            key={t}
                            className={`text-[9px] font-bold py-1.5 rounded text-center transition-all ${idx % 3 === 0 ? 'bg-[#27c93f]/20 text-[#27c93f] border border-[#27c93f]/40' : idx % 3 === 1 ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/40' : 'bg-white/5 text-text-secondary border border-white/5'}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating badge 1 */}
                  <div className="absolute -bottom-6 -left-8 bg-[#181d28] border border-brand-primary/30 shadow-[0_10px_25px_rgba(255,92,53,0.15)] rounded-xl p-3 flex items-center gap-3 animate-float-1 transform-3d translate-z-10">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                      <Utensils size={14} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-text-muted font-bold uppercase leading-none">Table 4 Order</span>
                      <span className="text-[11px] text-white font-semibold mt-1">2x Paneer Butter Masala</span>
                    </div>
                  </div>

                  {/* Floating badge 2 */}
                  <div className="absolute -top-8 -right-8 bg-[#181d28] border border-[#27c93f]/30 shadow-[0_10px_25px_rgba(39,201,99,0.12)] rounded-xl p-3 flex items-center gap-3 animate-float-2 transform-3d translate-z-12">
                    <div className="w-8 h-8 rounded-full bg-[#27c93f]/20 flex items-center justify-center text-[#27c93f]">
                      <Check size={14} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-text-muted font-bold uppercase leading-none">Cashier Billing</span>
                      <span className="text-[11px] text-white font-semibold mt-1">Bill Printed & Paid</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Core Modules Section */}
        <section id="features" className="py-20 max-w-6xl mx-auto px-6">
          {/* Header intro */}
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4 items-center">
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
              Core Modules
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">
              Built Around How a Service Actually Runs
            </h2>
            <p className="text-text-secondary text-base">
              Not a single screen bolted onto a till — six connected modules covering the floor, the pass, and the register, so every role sees exactly what their job needs and nothing else.
            </p>
          </div>

          {/* Signature moment: live order pipeline */}
          <div ref={addToRevealRefs} className="reveal bg-bg-card border border-white/5 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-8">
              <div>
                <p className="text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Order Lifecycle</p>
                <h3 className="text-xl font-heading font-bold text-white">Every Ticket Moves Through One Pipeline — Live</h3>
              </div>
              <span className="text-xs text-text-muted font-medium">Order Placed → In Kitchen → At Checkout → Completed</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {ORDER_PIPELINE.map((stage, idx) => (
                <div key={stage.label} className="relative bg-white/2 border border-white/5 rounded-xl p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center">
                      <stage.icon size={16} />
                    </div>
                    <span className="text-lg font-heading font-bold text-white">{stage.count}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{stage.label}</p>
                  <p className="text-xs text-text-muted font-mono leading-relaxed">{stage.ticket}</p>
                  {idx < ORDER_PIPELINE.length - 1 && (
                    <ArrowRight size={16} className="hidden md:block absolute top-1/2 -right-[22px] -translate-y-1/2 text-white/15 z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Module bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Live Ops Dashboard - wide card */}
            <div ref={addToRevealRefs} className="reveal glass-card md:col-span-2 flex flex-col text-left bg-bg-card border border-white/5 rounded-2xl p-8 hover:border-brand-primary/20 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center mb-6">
                <LayoutDashboard size={22} />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">Live Ops Dashboard</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                Sales trend, top dishes, payment-method split, and peak-hour traffic — filterable by day, week, or a custom range. Every tile updates the second a bill clears.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-auto pt-6 border-t border-white/5">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Sales</p>
                  <p className="text-lg font-heading font-bold text-white">₹52,480</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Paid Orders</p>
                  <p className="text-lg font-heading font-bold text-white">68</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Avg Ticket</p>
                  <p className="text-lg font-heading font-bold text-white">₹771</p>
                </div>
              </div>
            </div>

            {/* Table Management + Kitchen Display - stacked column */}
            <div className="flex flex-col gap-6 h-full">
              <div ref={addToRevealRefs} className="reveal glass-card flex-1 flex flex-col text-left bg-bg-card border border-white/5 rounded-2xl p-6 hover:border-brand-primary/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center mb-4">
                  <LayoutGrid size={18} />
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-2">Table Management</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Every table — Free, Busy, Reserved — updates live as waiters seat guests, with bookings feeding into the same view so nobody double-books a table.
                </p>
              </div>
              <div ref={addToRevealRefs} className="reveal glass-card flex-1 flex flex-col text-left bg-bg-card border border-white/5 rounded-2xl p-6 hover:border-brand-primary/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center mb-4">
                  <CookingPot size={18} />
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-2">Kitchen Display System</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Tickets fire the moment checkout sends them, filterable by Pending and Preparing, so the pass always knows what's next.
                </p>
              </div>
            </div>

            {/* Remaining module cards */}
            {MODULE_FEATURES.map((feature) => (
              <div key={feature.title} ref={addToRevealRefs} className="reveal glass-card flex flex-col items-start text-left bg-bg-card border border-white/5 rounded-2xl p-8 hover:border-brand-primary/20 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center mb-6">
                  <feature.icon size={22} />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Interactive Features Simulator Section (Workflow Hub) */}
        <section id="workflow" className="py-20 bg-bg-surface/40 border-y border-white/5">
          <div className="max-w-6xl mx-auto px-6">

            {/* Header intro */}
            <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">
                Experience KhaoPio in Real-Time
              </h2>
              <p className="text-text-secondary text-base">
                KhaoPio runs specialized dashboards custom-tuned for every restaurant role. Tap a role below to play with the simulated interfaces and watch the POS react.
              </p>
            </div>

            {/* Role Tab selection row */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <button
                onClick={() => { setActiveTab('waiter'); resetCheckout(); }}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-heading font-semibold text-sm transition-all duration-300 border ${activeTab === 'waiter' ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/25' : 'bg-white/2 border-white/5 text-text-secondary hover:bg-white/5 hover:text-white'}`}
              >
                <Utensils size={16} /> Waiter Tablet
              </button>
              <button
                onClick={() => { setActiveTab('chef'); resetKots(); }}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-heading font-semibold text-sm transition-all duration-300 border ${activeTab === 'chef' ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/25' : 'bg-white/2 border-white/5 text-text-secondary hover:bg-white/5 hover:text-white'}`}
              >
                <CookingPot size={16} /> Kitchen Chef Board
              </button>
              <button
                onClick={() => { setActiveTab('cashier'); resetCheckout(); }}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-heading font-semibold text-sm transition-all duration-300 border ${activeTab === 'cashier' ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/25' : 'bg-white/2 border-white/5 text-text-secondary hover:bg-white/5 hover:text-white'}`}
              >
                <Receipt size={16} /> Cashier Terminal
              </button>
              <button
                onClick={() => { setActiveTab('admin'); }}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-heading font-semibold text-sm transition-all duration-300 border ${activeTab === 'admin' ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/25' : 'bg-white/2 border-white/5 text-text-secondary hover:bg-white/5 hover:text-white'}`}
              >
                <Users size={16} /> Admin invites console
              </button>
            </div>

            {/* Split Grid for Content and Interactive Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

              {/* Left Column: Role Details Info */}
              <div className="lg:col-span-5 text-left flex flex-col gap-5">
                {activeTab === 'waiter' && (
                  <div className="flex flex-col gap-4 animate-[fadeIn_0.4s_ease-out]">
                    <span className="text-xs font-bold text-brand-primary tracking-widest uppercase">Waiter Ordering Module</span>
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight">Table-side Ordering & Cart</h3>
                    <p className="text-text-secondary text-sm md:text-base">
                      Waiters navigate categories on any tablet or mobile device, selecting dining tables and adding items to the cart instantly.
                    </p>
                    <ul className="flex flex-col gap-3 text-sm text-text-secondary">
                      <li className="flex items-start gap-2.5"><Check size={16} className="text-brand-primary mt-1" /> Dynamic categories list</li>
                      <li className="flex items-start gap-2.5"><Check size={16} className="text-brand-primary mt-1" /> Automatic math validation using Big.js</li>
                      <li className="flex items-start gap-2.5"><Check size={16} className="text-brand-primary mt-1" /> Tap to dispatch KOT instantly to the kitchen</li>
                    </ul>
                    <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-xl p-4 mt-2">
                      <p className="text-xs text-brand-primary font-bold">💡 Try it now!</p>
                      <p className="text-xs text-text-secondary mt-1">Use the <b>+</b> and <b>-</b> buttons on the screen to change item quantities. Watch the bill update instantly.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'chef' && (
                  <div className="flex flex-col gap-4 animate-[fadeIn_0.4s_ease-out]">
                    <span className="text-xs font-bold text-brand-primary tracking-widest uppercase">Chef Kitchen Board</span>
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight">Real-Time Kitchen Order Tickets</h3>
                    <p className="text-text-secondary text-sm md:text-base">
                      Chefs get an interactive live board. No more messy paper tickets or lost notes. Orders appear the split second the waiter taps dispatch.
                    </p>
                    <ul className="flex flex-col gap-3 text-sm text-text-secondary">
                      <li className="flex items-start gap-2.5"><Check size={16} className="text-brand-primary mt-1" /> Live status indicators (Preparing / Ready)</li>
                      <li className="flex items-start gap-2.5"><Check size={16} className="text-brand-primary mt-1" /> Auto-timed order tickets to monitor prep delays</li>
                      <li className="flex items-start gap-2.5"><Check size={16} className="text-brand-primary mt-1" /> Single-click notification back to the waiter when food is ready</li>
                    </ul>
                    <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-xl p-4 mt-2">
                      <p className="text-xs text-brand-primary font-bold">💡 Try it now!</p>
                      <p className="text-xs text-text-secondary mt-1">Click <b>Mark as Ready</b> on the active tickets. The state will transition smoothly and clear the board.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'cashier' && (
                  <div className="flex flex-col gap-4 animate-[fadeIn_0.4s_ease-out]">
                    <span className="text-xs font-bold text-brand-primary tracking-widest uppercase">Cashier Billing Terminal</span>
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight">Lightning-Fast Invoice Checkout</h3>
                    <p className="text-text-secondary text-sm md:text-base">
                      Cashiers review tables requesting bills, apply custom coupon discounts, capture payment types, and print high-quality invoices.
                    </p>
                    <ul className="flex flex-col gap-3 text-sm text-text-secondary">
                      <li className="flex items-start gap-2.5"><Check size={16} className="text-brand-primary mt-1" /> UPI, Card, and Cash split-payments</li>
                      <li className="flex items-start gap-2.5"><Check size={16} className="text-brand-primary mt-1" /> Dynamic coupon validator engine</li>
                      <li className="flex items-start gap-2.5"><Check size={16} className="text-brand-primary mt-1" /> Auto-checkout to release tables instantly</li>
                    </ul>
                    <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-xl p-4 mt-2">
                      <p className="text-xs text-brand-primary font-bold">💡 Try it now!</p>
                      <p className="text-xs text-text-secondary mt-1">Enter <b>KHAOPIO10</b> in the coupon box and click Apply. Select a payment method, then click <b>Confirm Payment & Print</b>.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'admin' && (
                  <div className="flex flex-col gap-4 animate-[fadeIn_0.4s_ease-out]">
                    <span className="text-xs font-bold text-brand-primary tracking-widest uppercase">Admin Management Panel</span>
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight">Staff Invitations & Role Controls</h3>
                    <p className="text-text-secondary text-sm md:text-base">
                      Secure onboarding workflow. Send cryptographic email invitations to staff members to grant precise dashboard permissions.
                    </p>
                    <ul className="flex flex-col gap-3 text-sm text-text-secondary">
                      <li className="flex items-start gap-2.5"><Check size={16} className="text-brand-primary mt-1" /> Cryptographic invitation tokens for verification</li>
                      <li className="flex items-start gap-2.5"><Check size={16} className="text-brand-primary mt-1" /> Dynamic sidebar views matching role access</li>
                      <li className="flex items-start gap-2.5"><Check size={16} className="text-brand-primary mt-1" /> Staff login protection using Bcrypt and JWT</li>
                    </ul>
                    <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-xl p-4 mt-2">
                      <p className="text-xs text-brand-primary font-bold">💡 Try it now!</p>
                      <p className="text-xs text-text-secondary mt-1">Type an email, choose a role, and click <b>Send Invite</b> to see the security log update in real-time.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Simulated Screen Display */}
              <div className="lg:col-span-7 flex justify-center w-full">
                <div className="w-full max-w-[480px] bg-[#11141b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[400px] relative">

                  {/* Screen Header bar */}
                  <div className="bg-[#181d28] px-5 py-3 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
                    </div>
                    <span className="text-xs font-heading font-semibold text-text-secondary">
                      {activeTab === 'waiter' && 'POS Terminal — Table 4 Order'}
                      {activeTab === 'chef' && 'Kitchen Monitor — Active Tickets'}
                      {activeTab === 'cashier' && 'Billing Desk — Checkout'}
                      {activeTab === 'admin' && 'Admin Console — Invite Panel'}
                    </span>
                    <span className="w-3 h-3"></span>
                  </div>

                  {/* Screen Content Body */}
                  <div className="p-5 flex-1 flex flex-col overflow-y-auto">

                    {/* Waiter Interface simulation */}
                    {activeTab === 'waiter' && (
                      <div className="flex-1 flex flex-col justify-between animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex flex-col gap-2">
                          <div className="text-xs text-text-secondary text-left font-semibold pb-1 border-b border-white/5 uppercase tracking-wider">Cart Items</div>

                          {cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-2.5 border-b border-white/5">
                              <span className="text-sm font-medium text-white">{item.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-text-secondary font-mono">₹{item.price}</span>
                                <div className="flex items-center gap-2.5 bg-white/2 rounded-lg px-2 py-1 border border-white/5">
                                  <button
                                    onClick={() => updateCartQty(item.id, -1)}
                                    className="w-5 h-5 rounded-md bg-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white flex items-center justify-center font-bold text-xs transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-mono font-bold text-white min-w-[12px] text-center">{item.qty}</span>
                                  <button
                                    onClick={() => updateCartQty(item.id, 1)}
                                    className="w-5 h-5 rounded-md bg-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white flex items-center justify-center font-bold text-xs transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {cart.length === 0 && (
                            <div className="py-10 text-center text-text-muted text-sm flex flex-col items-center gap-2">
                              <p>Your cart is empty.</p>
                              <button onClick={() => setCart(INITIAL_CART)} className="text-xs text-brand-primary underline hover:text-brand-primary-hover font-semibold">
                                Reload Sample Menu Items
                              </button>
                            </div>
                          )}
                        </div>

                        {cart.length > 0 && (
                          <div className="border-t border-dashed border-white/10 pt-3 flex flex-col gap-1.5 text-left">
                            <div className="flex justify-between text-xs text-text-secondary">
                              <span>Subtotal</span>
                              <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-text-secondary">
                              <span>Taxes (5% GST + 5% Service)</span>
                              <span className="font-mono">₹{(taxTotal + serviceTotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-white/5">
                              <span>Grand Total</span>
                              <span className="font-mono text-brand-primary">₹{grandTotal.toFixed(2)}</span>
                            </div>

                            <button
                              onClick={() => setActiveTab('chef')}
                              className="mt-3 w-full py-2.5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-heading font-semibold tracking-wide transition-all uppercase flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/10"
                            >
                              Dispatch KOT to Kitchen <ArrowRight size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Chef Interface simulation */}
                    {activeTab === 'chef' && (
                      <div className="flex-1 flex flex-col justify-between animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Active KOT Tickets</span>
                            {kots.length < INITIAL_KOTS.length && (
                              <button
                                onClick={resetKots}
                                className="text-[10px] text-brand-primary font-semibold flex items-center gap-1 hover:underline"
                              >
                                <RefreshCw size={10} /> Reload Tickets
                              </button>
                            )}
                          </div>

                          {kots.map((kot) => (
                            <div
                              key={kot.id}
                              className="bg-white/2 border border-white/5 rounded-xl p-3 flex flex-col gap-2.5 text-left transition-all"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-heading font-bold text-white">{kot.id}</span>
                                  <span className="text-[10px] bg-white/5 text-text-secondary px-1.5 py-0.5 rounded font-medium">{kot.table}</span>
                                </div>
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${kot.status === 'ready' ? 'bg-[#27c93f]/10 text-[#27c93f]' : 'bg-brand-secondary/10 text-brand-secondary'}`}>
                                  {kot.status}
                                </span>
                              </div>

                              <p className="text-xs text-text-secondary italic font-mono">{kot.items}</p>

                              {kot.status === 'preparing' && (
                                <button
                                  onClick={() => markKotReady(kot.id)}
                                  className="w-full py-1.5 rounded-lg bg-brand-primary text-white text-[10px] font-bold uppercase tracking-wider hover:bg-brand-primary-hover transition-colors flex items-center justify-center gap-1"
                                >
                                  <Check size={10} /> Mark as Ready
                                </button>
                              )}
                            </div>
                          ))}

                          {kots.length === 0 && (
                            <div className="py-12 text-center text-text-muted text-sm flex flex-col items-center gap-3">
                              <span className="text-2xl">🍽️</span>
                              <p>All active tickets prepared! Kitchen clear.</p>
                              <button
                                onClick={resetKots}
                                className="px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold rounded-lg hover:bg-brand-primary hover:text-white transition-colors"
                              >
                                Simulate New Orders
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Cashier Interface simulation */}
                    {activeTab === 'cashier' && (
                      <div className="flex-1 flex flex-col justify-between animate-[fadeIn_0.3s_ease-out] text-left relative">
                        {checkoutSuccess ? (
                          <div className="receipt-printed-overlay">
                            <span className="text-5xl animate-bounce">🎉</span>
                            <span className="text-emerald-500 font-heading font-bold text-lg flex items-center gap-1.5">
                              <Check size={20} className="border-2 border-emerald-500 rounded-full p-0.5" /> Receipt Paid & Printed!
                            </span>
                            <div className="bg-[#181d28] border border-white/5 rounded-xl p-4 w-full text-center text-xs font-mono text-text-secondary leading-relaxed">
                              <p className="font-bold text-white border-b border-white/5 pb-2 mb-2 uppercase">KhaoPio Restaurant</p>
                              <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
                              {appliedDiscount > 0 && <p className="text-brand-secondary">Coupon Applied (10%): -₹{discountTotal.toFixed(2)}</p>}
                              <p>Taxes (10%): ₹{(taxTotal + serviceTotal).toFixed(2)}</p>
                              <p className="text-white font-bold border-t border-white/5 pt-2 mt-2">Grand Total Paid: ₹{grandTotal.toFixed(2)}</p>
                              <p className="text-[10px] text-text-muted mt-2">Paid via {paymentMethod} • Cashier: PIN_9381</p>
                            </div>
                            <button
                              onClick={resetCheckout}
                              className="px-6 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-lg transition-colors mt-2"
                            >
                              Checkout Next Bill
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col justify-between flex-1">
                            <div className="flex flex-col gap-3">
                              <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider pb-1 border-b border-white/5">Billing Checkout</span>

                              <div className="flex justify-between items-center">
                                <span className="text-xs text-text-secondary font-medium">Pending Bill Amount</span>
                                <span className="text-sm font-mono font-bold text-white">₹{(subtotal + taxTotal + serviceTotal).toFixed(2)}</span>
                              </div>

                              {/* Payment selector buttons */}
                              <div className="flex flex-col gap-2 mt-1">
                                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Payment Mode</span>
                                <div className="grid grid-cols-3 gap-2">
                                  {(['UPI', 'CARD', 'CASH'] as const).map((method) => (
                                    <button
                                      key={method}
                                      onClick={() => setPaymentMethod(method)}
                                      className={`py-2 rounded-lg border text-xs font-semibold tracking-wide transition-all ${paymentMethod === method ? 'bg-brand-primary/15 border-brand-primary text-white' : 'bg-white/2 border-white/5 text-text-secondary hover:bg-white/5'}`}
                                    >
                                      {method}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Coupon code validator */}
                              <div className="flex flex-col gap-2 mt-2">
                                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Discount Coupon</span>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Enter KHAOPIO10"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="flex-1 bg-white/2 border border-white/5 px-3 py-1.5 rounded-lg text-xs text-white focus:outline-none focus:border-brand-primary"
                                  />
                                  <button
                                    onClick={applyCoupon}
                                    className="px-4 py-1.5 rounded-lg bg-brand-secondary/15 border border-brand-secondary/30 text-brand-secondary text-xs font-bold hover:bg-brand-secondary hover:text-black transition-colors"
                                  >
                                    Apply
                                  </button>
                                </div>
                                {appliedDiscount > 0 && (
                                  <p className="text-[10px] text-[#27c93f] font-semibold">✓ Coupon applied successfully! 10% Discount deducted.</p>
                                )}
                                {couponError && (
                                  <p className="text-[10px] text-[#ff5f56] font-semibold">{couponError}</p>
                                )}
                              </div>
                            </div>

                            <div className="border-t border-white/5 pt-3 mt-4 flex flex-col gap-3">
                              {appliedDiscount > 0 && (
                                <div className="flex justify-between text-xs text-brand-secondary">
                                  <span>Coupon Discount</span>
                                  <span className="font-mono">-₹{discountTotal.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-sm font-bold text-white">
                                <span>Total to Collect</span>
                                <span className="font-mono text-brand-primary">₹{grandTotal.toFixed(2)}</span>
                              </div>
                              <button
                                onClick={() => setCheckoutSuccess(true)}
                                className="w-full py-2.5 bg-[#27c93f] hover:bg-[#20a332] text-white text-xs font-heading font-bold uppercase tracking-wide rounded-lg transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Check size={14} /> Confirm Payment & Print Receipt
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Admin Interface simulation */}
                    {activeTab === 'admin' && (
                      <div className="flex-1 flex flex-col justify-between animate-[fadeIn_0.3s_ease-out] text-left">
                        <div className="flex flex-col gap-4">
                          <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider pb-1 border-b border-white/5">Send Cryptographic Invite Link</span>

                          <form onSubmit={sendInvite} className="flex flex-col gap-2.5">
                            <div className="flex gap-2">
                              <input
                                type="email"
                                placeholder="waiter-email@khaopio.com"
                                required
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="flex-1 bg-white/2 border border-white/5 px-3 py-1.5 rounded-lg text-xs text-white focus:outline-none focus:border-brand-primary"
                              />
                              <select
                                value={inviteRole}
                                onChange={(e) => setInviteRole(e.target.value)}
                                className="bg-white/2 border border-white/5 px-2 py-1.5 rounded-lg text-xs text-text-secondary focus:outline-none focus:border-brand-primary"
                              >
                                <option className="bg-[#181d28]" value="Waiter">Waiter</option>
                                <option className="bg-[#181d28]" value="Kitchen Chef">Chef</option>
                                <option className="bg-[#181d28]" value="Cashier">Cashier</option>
                              </select>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                            >
                              Send Invitation Link
                            </button>
                          </form>

                          <div className="flex flex-col gap-2 mt-2">
                            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Invitation Logs (RBAC Verification)</span>
                            <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto">
                              {invites.map((invite, idx) => (
                                <div key={idx} className="bg-white/2 border border-white/5 p-2 rounded-lg flex justify-between items-center text-[10px]">
                                  <div className="flex flex-col">
                                    <span className="text-white font-medium">{invite.email}</span>
                                    <span className="text-text-muted text-[9px] font-mono mt-0.5">{invite.role} • token: {invite.token}</span>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded font-semibold ${invite.status === 'Active' ? 'bg-[#27c93f]/10 text-[#27c93f]' : 'bg-brand-secondary/10 text-brand-secondary'}`}>
                                    {invite.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 5. Core Benefits Section */}
        <section id="benefits" className="py-20 max-w-6xl mx-auto px-6">
          {/* Header intro */}
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">
              Designed to Maximize Turnaround & Accuracy
            </h2>
            <p className="text-text-secondary text-base">
              KhaoPio features a high-performance system layer built to solve the traditional headaches of chaotic dining workflows.
            </p>
          </div>

          {/* 3-column benefits grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div ref={addToRevealRefs} className="reveal glass-card flex flex-col items-start text-left bg-bg-card border border-white/5 rounded-2xl p-8 hover:border-brand-primary/20 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center mb-6">
                <CircleDollarSign size={22} />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">Zero Billing Flaws</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                By integrating <code>big.js</code> logic, KhaoPio guarantees that tax rates, discounts, and menu prices sum with absolute precision, avoiding costly floating-point billing calculations.
              </p>
            </div>

            {/* Card 2 */}
            <div ref={addToRevealRefs} className="reveal glass-card flex flex-col items-start text-left bg-bg-card border border-white/5 rounded-2xl p-8 hover:border-brand-primary/20 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center mb-6">
                <Zap size={22} />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">Sub-Second Syncing</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Waiter KOT submissions, kitchen cooking ticks, and cashier checkout billing request states sync in real-time, reducing customer wait times and maximizing table turn rates.
              </p>
            </div>

            {/* Card 3 */}
            <div ref={addToRevealRefs} className="reveal glass-card flex flex-col items-start text-left bg-bg-card border border-white/5 rounded-2xl p-8 hover:border-brand-primary/20 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center mb-6">
                <Shield size={22} />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">Granular Authorization</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Protect your margins. Granular role permissions restrict checkout actions to cashiers, live logs to chefs, and email invites exclusively to master administrators.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Trust & Metrics Section */}
        <section id="metrics" className="py-20 max-w-6xl mx-auto px-6">
          <div ref={addToRevealRefs} className="reveal bg-bg-card border border-white/5 rounded-2xl px-8 py-12 md:px-12">
            <div className="text-center max-w-xl mx-auto mb-10 flex flex-col gap-3 items-center">
              <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
                By The Numbers
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
                The Same Claims, Measured
              </h2>
              <p className="text-text-secondary text-sm">
                What the modules above actually deliver once they're running a real shift.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-0 md:divide-x md:divide-white/5">
              {[
                { value: '10x', label: 'Faster KOT Dispatch' },
                { value: '0%', label: 'Calculation Discrepancy' },
                { value: '<1.8s', label: 'KOT Delivery Latency' },
                { value: '99.9%', label: 'Real-time Uptime Sync' }
              ].map((metric) => (
                <div key={metric.label} className="flex flex-col items-center gap-1 px-4">
                  <span className="text-4xl md:text-5xl font-heading font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,92,53,0.25)]">{metric.value}</span>
                  <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mt-1 text-center">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Testimonials Section */}
        <section id="testimonials" className="py-20 max-w-6xl mx-auto px-6">
          {/* Header intro */}
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">
              Loved by Restaurant Teams
            </h2>
            <p className="text-text-secondary text-base">
              Here is what owners, chefs, and cashier crews say about their switch to the KhaoPio POS platform.
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Testimonial 1 */}
            <div ref={addToRevealRefs} className="reveal glass-card bg-bg-card border border-white/5 rounded-2xl p-8 hover:border-brand-primary/20 flex flex-col gap-5 text-left h-full transition-all duration-300">
              <div className="flex gap-1 text-brand-secondary">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-text-secondary text-sm italic leading-relaxed">
                "Sending cryptographic invite links to staff saved us hours. We invited our cashier and 4 waiters, and they logged in with quick staff PINs in minutes. Highly secure!"
              </p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-heading font-bold text-sm">
                  AS
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-white">Aniket Sharma</h4>
                  <p className="text-[10px] text-text-muted">Restaurant Owner, Spice Garden</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div ref={addToRevealRefs} className="reveal glass-card bg-bg-card border border-white/5 rounded-2xl p-8 hover:border-brand-primary/20 flex flex-col gap-5 text-left h-full transition-all duration-300">
              <div className="flex gap-1 text-brand-secondary">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-text-secondary text-sm italic leading-relaxed">
                "The live kitchen order screen is beautiful. No more lost paper tickets! The moment the waiter takes an order, it appears on my screen with a status timer. Clean and simple."
              </p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-heading font-bold text-sm">
                  MD
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-white">Maninder Dev</h4>
                  <p className="text-[10px] text-text-muted">Head Chef, The Royal Bistro</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div ref={addToRevealRefs} className="reveal glass-card bg-bg-card border border-white/5 rounded-2xl p-8 hover:border-brand-primary/20 flex flex-col gap-5 text-left h-full transition-all duration-300">
              <div className="flex gap-1 text-brand-secondary">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-text-secondary text-sm italic leading-relaxed">
                "Billing precision is perfect. In past systems we had rounding errors, but KhaoPio is completely accurate. Applying discounts and printing invoices is an absolute breeze."
              </p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-heading font-bold text-sm">
                  RP
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-white">Ritu Patel</h4>
                  <p className="text-[10px] text-text-muted">Chief Cashier, Noodle Town</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 8. Contact / Get Started Form Section */}
        <section id="contact" className="py-20 bg-bg-surface/20 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start text-left">

              {/* Left Column: contact details */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <span className="text-xs font-bold text-brand-primary tracking-widest uppercase">Start Today</span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white leading-tight">
                  Deploy KhaoPio in Your Restaurant
                </h2>
                <p className="text-text-secondary text-base leading-relaxed">
                  Ready to upgrade your restaurant point of sale? Contact our engineering team for a customized setup or monorepo migration plan.
                </p>

                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex items-center gap-4 bg-white/2 border border-white/5 p-4 rounded-xl">
                    <Mail size={18} className="text-brand-primary" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-muted font-semibold uppercase">Email Support</span>
                      <span className="text-sm text-white font-medium">contact@khaopio.com</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/2 border border-white/5 p-4 rounded-xl">
                    <Phone size={18} className="text-brand-primary" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-muted font-semibold uppercase">Call Helpline</span>
                      <span className="text-sm text-white font-medium">+91 98765-43210</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/2 border border-white/5 p-4 rounded-xl">
                    <MapPin size={18} className="text-brand-primary" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-muted font-semibold uppercase">Headquarters</span>
                      <span className="text-sm text-white font-medium">Tech District, New Delhi, India</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Lead Capture Form */}
              <div className="lg:col-span-7 w-full bg-bg-card border border-white/5 rounded-2xl p-8 relative">
                {formSuccess ? (
                  <div className="py-16 text-center flex flex-col items-center gap-4 animate-[scaleBounce_0.4s_ease-out]">
                    <span className="text-5xl">✉️</span>
                    <h3 className="text-2xl font-heading font-bold text-[#27c93f]">Inquiry Received!</h3>
                    <p className="text-text-secondary text-sm max-w-sm">
                      Thank you for reaching out. Our POS deployment specialists will contact you in under 12 hours.
                    </p>
                    <button
                      onClick={() => setFormSuccess(false)}
                      className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-full transition-colors mt-2"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="flex flex-col gap-6">
                    {/* Name input */}
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder=" "
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-white/2 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-brand-primary focus:bg-brand-primary/[0.02] focus:shadow-[0_0_12px_rgba(255,92,53,0.1)] transition-all peer"
                      />
                      <label className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none transition-all duration-200 peer-focus:top-0 peer-focus:text-[10px] peer-focus:bg-bg-deep peer-focus:text-brand-primary peer-focus:px-1.5 peer-focus:translate-y-[-50%] peer-focus:translate-x-0.5 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:bg-bg-deep peer-[:not(:placeholder-shown)]:text-brand-primary peer-[:not(:placeholder-shown)]:px-1.5 peer-[:not(:placeholder-shown)]:translate-y-[-50%]">
                        Your Full Name
                      </label>
                      {formErrors.name && (
                        <span className="text-[10px] text-[#ff5f56] font-semibold mt-1 block">{formErrors.name}</span>
                      )}
                    </div>

                    {/* Email input */}
                    <div className="relative w-full">
                      <input
                        type="email"
                        placeholder=" "
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full bg-white/2 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-brand-primary focus:bg-brand-primary/[0.02] focus:shadow-[0_0_12px_rgba(255,92,53,0.1)] transition-all peer"
                      />
                      <label className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none transition-all duration-200 peer-focus:top-0 peer-focus:text-[10px] peer-focus:bg-bg-deep peer-focus:text-brand-primary peer-focus:px-1.5 peer-focus:translate-y-[-50%] peer-focus:translate-x-0.5 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:bg-bg-deep peer-[:not(:placeholder-shown)]:text-brand-primary peer-[:not(:placeholder-shown)]:px-1.5 peer-[:not(:placeholder-shown)]:translate-y-[-50%]">
                        Email Address
                      </label>
                      {formErrors.email && (
                        <span className="text-[10px] text-[#ff5f56] font-semibold mt-1 block">{formErrors.email}</span>
                      )}
                    </div>

                    {/* Message textarea */}
                    <div className="relative w-full">
                      <textarea
                        placeholder=" "
                        rows={4}
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        className="w-full bg-white/2 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-brand-primary focus:bg-brand-primary/[0.02] focus:shadow-[0_0_12px_rgba(255,92,53,0.1)] transition-all peer resize-none"
                      ></textarea>
                      <label className="absolute left-4 top-6 text-text-muted pointer-events-none transition-all duration-200 peer-focus:top-0 peer-focus:text-[10px] peer-focus:bg-bg-deep peer-focus:text-brand-primary peer-focus:px-1.5 peer-focus:translate-y-[-50%] peer-focus:translate-x-0.5 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:bg-bg-deep peer-[:not(:placeholder-shown)]:text-brand-primary peer-[:not(:placeholder-shown)]:px-1.5 peer-[:not(:placeholder-shown)]:translate-y-[-50%]">
                        Message Details (E.g. Table capacity, setup requests)
                      </label>
                      {formErrors.message && (
                        <span className="text-[10px] text-[#ff5f56] font-semibold mt-1 block">{formErrors.message}</span>
                      )}
                    </div>

                    {formErrors.submit && (
                      <div className="bg-[#ff5f56]/10 border border-[#ff5f56]/20 text-[#ff5f56] text-xs p-3 rounded-xl font-medium">
                        {formErrors.submit}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-heading font-bold text-sm tracking-wide transition-all shadow-[0_0_15px_rgba(255,92,53,0.2)] hover:shadow-[0_0_20px_rgba(255,92,53,0.45)] flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" /> Sending Inquiry...
                        </>
                      ) : (
                        <>
                          <Send size={14} /> Send Setup Inquiry
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* 9. Footer */}
      <footer className="mt-auto bg-[#05070a] border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="font-heading font-black text-sm text-white tracking-wider">
              KHAO<span className="text-brand-primary">PIO</span> POS
            </span>
          </div>

          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} KhaoPio Restaurant Point of Sale. All Rights Reserved. Built with React & Tailwind CSS.
          </p>

          <div className="flex gap-4">
            <a href="#/privacy" className="text-xs text-text-muted hover:text-brand-primary transition-colors">Privacy Policy</a>
            <span className="text-text-muted/30">•</span>
            <a href="#/terms" className="text-xs text-text-muted hover:text-brand-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default App
