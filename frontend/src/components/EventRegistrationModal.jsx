import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, AlertCircle, Sparkles, CreditCard, ShieldCheck, 
  QrCode, Ticket, ArrowRight, ArrowLeft, Loader2, DollarSign, Crown, Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const EventRegistrationModal = ({ event, isOpen, onClose, onSuccess, onUpgradeClick }) => {
  const { user, showToast, refreshNotifications } = useApp();

  const [step, setStep] = useState(1); // 1: Info & Premium Perks, 2: Payment, 3: Success Pass
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'paypal'
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8829');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('389');
  const [upiId, setUpiId] = useState('member@gpay');

  const [submitting, setSubmitting] = useState(false);
  const [registrationReceipt, setRegistrationReceipt] = useState(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phone_number || '');
    }
  }, [user]);

  if (!isOpen || !event) return null;

  const isPremium = user?.membership_tier === 'premium';
  const isPrivateGated = event.is_private && !isPremium;

  const basePrice = Number(event.ticket_price || 0);
  const discountAmount = isPremium && basePrice > 0 ? Number((basePrice * 0.15).toFixed(2)) : 0;
  const finalPrice = Math.max(0, Number((basePrice - discountAmount).toFixed(2)));

  const handleNextToPayment = (e) => {
    e.preventDefault();
    if (isPrivateGated) {
      showToast('This private event requires Premium VIP status', 'error');
      return;
    }
    if (!fullName.trim() || !phoneNumber.trim()) {
      showToast('Please fill in your contact information', 'error');
      return;
    }
    setStep(2);
  };

  const handleConfirmRegistration = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        fullName,
        phoneNumber,
        paymentMethod,
      };

      const res = await api.registerEvent(event.id, payload);
      setRegistrationReceipt(res);
      refreshNotifications();
      showToast('Ticket booked successfully!', 'success');
      setStep(3);
      if (onSuccess) onSuccess(res);
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glass-card rounded-3xl p-6 md:p-8 border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden my-8"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/60 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center text-white shadow-md">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight truncate max-w-[240px]">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  {step === 1 && 'Attendee & Ticket Details'}
                  {step === 2 && 'Secure Payment Checkout'}
                  {step === 3 && 'Confirmed Ticket Pass'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STEP 1: Attendee Info & Premium Perks */}
          {step === 1 && (
            <form onSubmit={handleNextToPayment} className="space-y-4">
              {/* Private Event Gating Alert */}
              {isPrivateGated ? (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold space-y-3 text-left">
                  <div className="flex items-center gap-2 text-sm font-black text-amber-600 dark:text-amber-400">
                    <Lock className="w-5 h-5" />
                    Exclusive Private VIP Event
                  </div>
                  <p className="font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                    This event is reserved exclusively for YNC Premium VIP Members. Upgrade to Premium to unlock access and get 15% off all event tickets!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onUpgradeClick) onUpgradeClick();
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4" /> Upgrade to Premium VIP
                  </button>
                </div>
              ) : (
                <>
                  {/* Event Price Tag */}
                  <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Standard Ticket</span>
                      <p className="text-sm font-black text-slate-800 dark:text-white">{event.venue}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-primary dark:text-primary-light">
                        {basePrice > 0 ? `₹${basePrice.toFixed(2)}` : 'FREE'}
                      </span>
                    </div>
                  </div>

                  {/* Premium VIP Discount Status */}
                  {isPremium ? (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Crown className="w-4.5 h-4.5 text-amber-500" />
                        Premium VIP Status Active
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-extrabold">
                        15% Off Applied
                      </span>
                    </div>
                  ) : (
                    basePrice > 0 && (
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-amber-500" /> Save 15% with Premium VIP
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            if (onUpgradeClick) onUpgradeClick();
                          }}
                          className="text-xs font-extrabold text-primary hover:underline"
                        >
                          Upgrade Now
                        </button>
                      </div>
                    )
                  )}

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300 pl-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-sm font-semibold text-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300 pl-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-sm font-semibold text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Price Calculation Summary */}
                  {basePrice > 0 && (
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2 text-xs font-bold">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Base Price</span>
                        <span>₹{basePrice.toFixed(2)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                          <span>Premium VIP 15% Discount</span>
                          <span>-₹{discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-primary/20 pt-2 flex justify-between text-sm font-extrabold text-slate-800 dark:text-white">
                        <span>Total Amount Payable</span>
                        <span className="text-primary dark:text-primary-light">₹{finalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Action */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-primary via-secondary to-accent shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </form>
          )}

          {/* STEP 2: Payment Gateway Simulation */}
          {step === 2 && (
            <form onSubmit={handleConfirmRegistration} className="space-y-4">
              {/* Payment Methods */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 pl-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {[
                    { id: 'card', name: 'Credit/Debit', icon: CreditCard },
                    { id: 'upi', name: 'UPI Pay', icon: ShieldCheck },
                    { id: 'paypal', name: 'PayPal', icon: DollarSign }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === m.id
                          ? 'border-primary bg-primary/10 text-primary dark:text-primary-light'
                          : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-slate-500'
                      }`}
                    >
                      <m.icon className="w-4 h-4" />
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Details Input */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-sm font-semibold text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Expires</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-sm font-semibold text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-sm font-semibold text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="pt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">VPA / UPI ID</label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="name@okaxis"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-sm font-semibold text-slate-800 dark:text-white"
                  />
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-500 text-center">
                  You will be redirected to PayPal to authorize the payment of <strong>₹{finalPrice.toFixed(2)}</strong>.
                </div>
              )}

              {/* Total Payable Badge */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 flex justify-between items-center text-xs font-extrabold">
                <span className="text-slate-500">Payable Amount</span>
                <span className="text-base text-primary dark:text-primary-light">₹{finalPrice.toFixed(2)}</span>
              </div>

              {/* Navigation Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-primary via-secondary to-accent shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : `Pay ₹${finalPrice.toFixed(2)} & Confirm`}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Confirmed Ticket Pass & QR Code */}
          {step === 3 && registrationReceipt && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-800 dark:text-white">Registration Confirmed!</h4>
                <p className="text-xs text-slate-400 font-bold mt-1">Your ticket pass has been generated and emailed.</p>
              </div>

              {/* QR Code Pass Box */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center gap-3 relative overflow-hidden">
                <div className="p-3 bg-white rounded-xl shadow-md border border-slate-100">
                  <QrCode className="w-32 h-32 text-slate-900" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary dark:text-primary-light">
                    Ref ID: {registrationReceipt.payment_id || 'PAY-2026-CONFIRMED'}
                  </span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    Attendee: {fullName}
                  </p>
                  {registrationReceipt.is_premium_discount && (
                    <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      👑 15% Premium VIP Discount Applied
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                Close & View My Passes
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
