import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Plane, MapPin, CalendarDays, Search, ShieldCheck, Headphones,
  Sparkles, BadgeDollarSign, ArrowRight, Star, ChevronDown, Mail, Phone,
  Clock3, Globe2, Send, Compass, Check, CheckCircle2, Users, ArrowUpRight,
  Heart, Filter, SlidersHorizontal, ArrowUpDown, Luggage, ShieldAlert,
  CreditCard, Ticket, AlertCircle, RefreshCw, Layers
} from 'lucide-react';
import './styles.css';
import {
  currencies, formatPrice, airports, flightsDatabase,
  destinations, flashDeals, journeyPlannerPresets
} from './data/travelData.js';

// Logo
function Logo({ setPage }) {
  return (
    <a className="logo" href="#home" onClick={(e) => { e.preventDefault(); setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
      <span><Plane size={18} /></span>
      Fares<span>Finders</span>
    </a>
  );
}

// Navigation Header
function Nav({ page, setPage, activeCurrency, setActiveCurrency, wishlist, setWishlist, setIsWishlistOpen }) {
  const [open, setOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCurrencyOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const go = (p) => {
    setPage(p);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Logo setPage={setPage} />
        
        <nav className="desktop-nav">
          <button onClick={() => go('home')} style={{ color: page === 'home' ? '#2563eb' : '' }}>Explore</button>
          <button onClick={() => go('deals')} style={{ color: page === 'deals' ? '#2563eb' : '' }}>Flash Deals</button>
          <button onClick={() => go('planner')} style={{ color: page === 'planner' ? '#2563eb' : '' }}>Journey Planner</button>
          <button onClick={() => go('about')} style={{ color: page === 'about' ? '#2563eb' : '' }}>Our Story</button>
          <button onClick={() => go('contact')} style={{ color: page === 'contact' ? '#2563eb' : '' }}>Contact</button>
        </nav>

        <div className="nav-controls">
          {/* Currency Switcher */}
          <div className="currency-selector" ref={dropdownRef}>
            <button className="currency-btn" onClick={() => setCurrencyOpen(!currencyOpen)} aria-label="Select Currency">
              <Globe2 size={15} />
              <span>{activeCurrency.code}</span>
              <ChevronDown size={13} />
            </button>
            <AnimatePresence>
              {currencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="currency-dropdown"
                >
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      className={curr.code === activeCurrency.code ? 'active' : ''}
                      onClick={() => { setActiveCurrency(curr); setCurrencyOpen(false); }}
                    >
                      <span>{curr.label}</span>
                      {curr.code === activeCurrency.code && <Check size={14} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wishlist Saved Trips Pill */}
          <button className="wishlist-pill-btn" onClick={() => setIsWishlistOpen(true)} aria-label="View Saved Trips">
            <Heart size={16} fill={wishlist.length > 0 ? '#2563eb' : 'none'} />
            <span className="desktop-only">Saved</span>
            {wishlist.length > 0 && <span className="wishlist-count">{wishlist.length}</span>}
          </button>

          <button className="nav-cta desktop-only" onClick={() => go('planner')}>
            Plan a Trip <ArrowUpRight size={15} />
          </button>

          <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle Navigation Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mobile-nav">
            <button onClick={() => go('home')}>Explore Destinations</button>
            <button onClick={() => go('deals')}>Flash Deals</button>
            <button onClick={() => go('planner')}>Custom Journey Planner</button>
            <button onClick={() => go('about')}>Our Story</button>
            <button onClick={() => go('contact')}>Contact Us</button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// Airport Selector Input with Dropdown Autocomplete
function AirportField({ label, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef(null);

  const selectedAirport = airports.find(a => a.code === value) || { code: value, city: value, name: 'Select Airport' };

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = airports.filter(a =>
    a.city.toLowerCase().includes(query.toLowerCase()) ||
    a.code.toLowerCase().includes(query.toLowerCase()) ||
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`field-box ${open ? 'active-dropdown' : ''}`} ref={wrapperRef}>
      <label>{label}</label>
      <div className="field-input-val" onClick={() => setOpen(!open)}>
        <MapPin size={16} />
        <div>
          <b>{selectedAirport.city} ({selectedAirport.code})</b>
          <small>{selectedAirport.name}</small>
        </div>
      </div>

      {open && (
        <div className="airport-dropdown">
          <input
            type="text"
            placeholder="Type city or airport code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{ width: '100%', padding: '8px', marginBottom: '6px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
          />
          {filtered.map((ap) => (
            <button
              key={ap.code}
              type="button"
              className="airport-option"
              onClick={() => { onChange(ap.code); setOpen(false); setQuery(''); }}
            >
              <div>
                <strong>{ap.city}, {ap.country}</strong>
                <small>{ap.name}</small>
              </div>
              <span className="airport-code">{ap.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Search Card & Engine Component
function SearchCard({ onPerformSearch, initialSearch }) {
  const [tripType, setTripType] = useState(initialSearch?.tripType || 'Round trip');
  const [fromCode, setFromCode] = useState(initialSearch?.fromCode || 'JFK');
  const [toCode, setToCode] = useState(initialSearch?.toCode || 'LHR');
  const [depDate, setDepDate] = useState('2026-10-15');
  const [retDate, setRetDate] = useState('2026-10-22');
  const [passengers, setPassengers] = useState('1 Adult');
  const [cabinClass, setCabinClass] = useState('Economy');
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onPerformSearch({ fromCode, toCode, depDate, retDate, passengers, cabinClass, tripType });
    }, 700);
  };

  return (
    <form className="search-card" onSubmit={handleSubmit}>
      <div className="trip-tabs">
        <button
          type="button"
          className={tripType === 'Round trip' ? 'active' : ''}
          onClick={() => setTripType('Round trip')}
        >
          Round trip
        </button>
        <button
          type="button"
          className={tripType === 'One way' ? 'active' : ''}
          onClick={() => setTripType('One way')}
        >
          One way
        </button>

        <div className="search-options">
          <select
            className="option-select"
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
          >
            <option value="1 Adult">1 Passenger</option>
            <option value="2 Adults">2 Passengers</option>
            <option value="3+ Family">3+ Family</option>
          </select>

          <select
            className="option-select"
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value)}
          >
            <option value="Economy">Economy</option>
            <option value="Premium Economy">Premium Economy</option>
            <option value="Business Class">Business Class</option>
            <option value="First Class">First Class</option>
          </select>
        </div>
      </div>

      <div className="fields">
        <AirportField label="From" value={fromCode} onChange={setFromCode} />
        <AirportField label="To" value={toCode} onChange={setToCode} />

        <div className="field-box">
          <label>Departure</label>
          <div className="field-input-val">
            <CalendarDays size={16} />
            <input
              type="date"
              value={depDate}
              onChange={(e) => setDepDate(e.target.value)}
              required
            />
          </div>
        </div>

        {tripType === 'Round trip' && (
          <div className="field-box">
            <label>Return</label>
            <div className="field-input-val">
              <CalendarDays size={16} />
              <input
                type="date"
                value={retDate}
                onChange={(e) => setRetDate(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <button type="submit" className="search-btn" disabled={isScanning}>
          {isScanning ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <>
              <Search size={18} />
              <span>Find Flights</span>
            </>
          )}
        </button>
      </div>

      {isScanning && (
        <div className="loading-box">
          <div className="loading-spinner" />
          <b>Scanning 45+ partner airlines for real-time fares...</b>
        </div>
      )}
    </form>
  );
}

// Flight Booking Modal Checkout Component
function BookingModal({ flight, activeCurrency, onClose, onBookingSuccess }) {
  const [step, setStep] = useState(1);
  const [fareTier, setFareTier] = useState('Standard');
  const [passengerName, setPassengerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [seatPref, setSeatPref] = useState('Window');
  const [addons, setAddons] = useState({ extraBag: false, travelInsurance: false, priorityBoarding: false });
  const [bookingRef, setBookingRef] = useState('');

  const calculateTotalUSD = () => {
    let base = flight.priceUSD;
    if (fareTier === 'Flex') base += 85;
    if (addons.extraBag) base += 45;
    if (addons.travelInsurance) base += 35;
    if (addons.priorityBoarding) base += 25;
    return base;
  };

  const handleComplete = (e) => {
    e.preventDefault();
    const pnr = 'FF-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(pnr);
    setStep(4);
    if (onBookingSuccess) onBookingSuccess(pnr);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-card"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* Progress bar */}
        <div className="booking-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-num">{step > 1 ? '✓' : '1'}</div>
            <label>Fare Tier</label>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-num">{step > 2 ? '✓' : '2'}</div>
            <label>Passenger Details</label>
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            <div className="step-num">{step > 3 ? '✓' : '3'}</div>
            <label>Add-ons</label>
          </div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-num">4</div>
            <label>Confirmation</label>
          </div>
        </div>

        {/* Step 1: Fare Tiers */}
        {step === 1 && (
          <div>
            <div className="eyebrow"><Plane size={14} /> {flight.airline} {flight.flightNumber}</div>
            <h2 style={{ fontSize: '22px', margin: '4px 0 12px' }}>Choose your fare option</h2>
            <p style={{ color: '#64748b', fontSize: '13px' }}>{flight.fromCity} ({flight.fromCode}) → {flight.toCity} ({flight.toCode})</p>

            <div className="fare-tier-grid">
              <div className={`fare-tier-card ${fareTier === 'Light' ? 'selected' : ''}`} onClick={() => setFareTier('Light')}>
                <h4>Saver Light</h4>
                <b>{formatPrice(flight.priceUSD - 30, activeCurrency)}</b>
                <ul>
                  <li>1 Personal item</li>
                  <li>Standard seat</li>
                  <li>Non-refundable</li>
                </ul>
              </div>

              <div className={`fare-tier-card ${fareTier === 'Standard' ? 'selected' : ''}`} onClick={() => setFareTier('Standard')}>
                <h4>Standard Flex</h4>
                <b>{formatPrice(flight.priceUSD, activeCurrency)}</b>
                <ul>
                  <li>1 Carry-on + Personal item</li>
                  <li>Seat selection included</li>
                  <li>Change fee $50</li>
                </ul>
              </div>

              <div className={`fare-tier-card ${fareTier === 'Flex' ? 'selected' : ''}`} onClick={() => setFareTier('Flex')}>
                <h4>Full Freedom</h4>
                <b>{formatPrice(flight.priceUSD + 85, activeCurrency)}</b>
                <ul>
                  <li>1 Checked bag + Carry-on</li>
                  <li>Free changes & cancellation</li>
                  <li>Priority check-in</li>
                </ul>
              </div>
            </div>

            <button className="select-flight-btn" style={{ padding: '12px', marginTop: '14px' }} onClick={() => setStep(2)}>
              Continue to Passenger Details <ArrowRight size={16} style={{ display: 'inline', marginLeft: '6px' }} />
            </button>
          </div>
        )}

        {/* Step 2: Passenger Info */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '22px', margin: '0 0 12px' }}>Passenger Information</h2>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>Please enter details as they appear on your government ID or passport.</p>

            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
              <div className="booking-form-grid">
                <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Full Legal Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Eleanor Vance"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="eleanor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Seat Preference</label>
                  <select value={seatPref} onChange={(e) => setSeatPref(e.target.value)}>
                    <option value="Window">Window Seat (A/F)</option>
                    <option value="Aisle">Aisle Seat (C/D)</option>
                    <option value="Extra Legroom">Extra Legroom Exit Row (+ $20)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="currency-btn" onClick={() => setStep(1)}>Back</button>
                <button type="submit" className="select-flight-btn" style={{ padding: '12px' }}>
                  Continue to Add-ons <ArrowRight size={16} style={{ display: 'inline', marginLeft: '6px' }} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Add-ons */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '22px', margin: '0 0 12px' }}>Enhance Your Journey</h2>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>Optional extras for maximum comfort and security.</p>

            <div style={{ display: 'grid', gap: '12px' }}>
              <label className="checkbox-item" style={{ border: '1px solid #e2e8f0', padding: '14px', borderRadius: '12px' }}>
                <input
                  type="checkbox"
                  checked={addons.extraBag}
                  onChange={(e) => setAddons({ ...addons, extraBag: e.target.checked })}
                />
                <Luggage size={20} style={{ color: '#2563eb' }} />
                <div style={{ flex: 1 }}>
                  <b>Additional Checked Bag (23kg)</b>
                  <small style={{ display: 'block', color: '#64748b' }}>Includes hassle-free baggage drop</small>
                </div>
                <strong style={{ color: '#2563eb' }}>+{formatPrice(45, activeCurrency)}</strong>
              </label>

              <label className="checkbox-item" style={{ border: '1px solid #e2e8f0', padding: '14px', borderRadius: '12px' }}>
                <input
                  type="checkbox"
                  checked={addons.travelInsurance}
                  onChange={(e) => setAddons({ ...addons, travelInsurance: e.target.checked })}
                />
                <ShieldAlert size={20} style={{ color: '#2563eb' }} />
                <div style={{ flex: 1 }}>
                  <b>Comprehensive Travel Protection</b>
                  <small style={{ display: 'block', color: '#64748b' }}>Medical coverage, trip delay & luggage protection</small>
                </div>
                <strong style={{ color: '#2563eb' }}>+{formatPrice(35, activeCurrency)}</strong>
              </label>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', margin: '20px 0', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '800' }}>
                <span>Total Amount:</span>
                <span style={{ color: '#2563eb', fontSize: '18px' }}>{formatPrice(calculateTotalUSD(), activeCurrency)}</span>
              </div>
              <small style={{ color: '#64748b', display: 'block', marginTop: '4px' }}>Includes all taxes, fees, and carrier surcharges.</small>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="currency-btn" onClick={() => setStep(2)}>Back</button>
              <button type="button" className="select-flight-btn" style={{ padding: '12px' }} onClick={handleComplete}>
                Confirm Reservation <CheckCircle2 size={16} style={{ display: 'inline', marginLeft: '6px' }} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Boarding Pass Confirmation */}
        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
              <CheckCircle2 size={28} />
            </div>
            <h2 style={{ fontSize: '24px', margin: '0 0 6px' }}>Reservation Request Confirmed!</h2>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Your travel itinerary details are ready below.</p>

            <div className="boarding-pass">
              <div className="pass-header">
                <div>
                  <strong style={{ fontSize: '15px' }}>{flight.airline}</strong>
                  <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8' }}>PNR: {bookingRef}</span>
                </div>
                <Ticket size={24} style={{ color: '#93c5fd' }} />
              </div>

              <div className="pass-body">
                <div>
                  <label>Passenger</label>
                  <b>{passengerName || 'Eleanor Vance'}</b>
                </div>
                <div>
                  <label>Flight</label>
                  <b>{flight.flightNumber}</b>
                </div>
                <div>
                  <label>Class / Seat</label>
                  <b>{flight.cabinClass} ({seatPref[0]}4)</b>
                </div>
                <div>
                  <label>Status</label>
                  <b style={{ color: '#4ade80' }}>CONFIRMED</b>
                </div>

                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #334155', paddingTop: '10px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <label>Route</label>
                    <b>{flight.fromCity} ({flight.fromCode}) → {flight.toCity} ({flight.toCode})</b>
                  </div>
                  <div>
                    <label>Departure</label>
                    <b>{flight.depTime}</b>
                  </div>
                </div>
              </div>
            </div>

            <button className="select-flight-btn" style={{ marginTop: '20px', padding: '12px' }} onClick={onClose}>
              Done & Return to Main Page
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Destination Spotlight Detail Modal
function DestinationModal({ dest, activeCurrency, onClose, onSelectFlightSearch }) {
  if (!dest) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-card"
        style={{ width: 'min(750px, 100%)' }}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div style={{ height: '240px', borderRadius: '16px', overflow: 'hidden', position: 'relative', marginBottom: '20px' }}>
          <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 30%, rgba(15,23,42,0.85))', padding: '20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', color: '#fff' }}>
            <div>
              <span className="dest-tag">{dest.category}</span>
              <h2 style={{ fontSize: '30px', margin: '4px 0 0', fontWeight: '800' }}>{dest.name}, {dest.country}</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <small style={{ fontSize: '10px', opacity: 0.8 }}>Starting return fare</small>
              <b style={{ fontSize: '22px', display: 'block', color: '#93c5fd' }}>{formatPrice(dest.startingPriceUSD, activeCurrency)}</b>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <small style={{ color: '#64748b', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}>Best Time to Visit</small>
            <b style={{ display: 'block', fontSize: '13px', color: '#0f172a', marginTop: '2px' }}>{dest.bestMonths}</b>
          </div>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <small style={{ color: '#64748b', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}>Avg Temperature</small>
            <b style={{ display: 'block', fontSize: '13px', color: '#0f172a', marginTop: '2px' }}>{dest.avgTemp}</b>
          </div>
        </div>

        <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>{dest.description}</p>

        <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '10px', color: '#0f172a' }}>Top Curated Experiences</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
          {dest.highlights.map((h) => (
            <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#eff6ff', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', color: '#1e40af' }}>
              <CheckCircle2 size={16} />
              <span>{h}</span>
            </div>
          ))}
        </div>

        <button
          className="select-flight-btn"
          style={{ width: '100%', padding: '14px', fontSize: '14px' }}
          onClick={() => {
            onClose();
            onSelectFlightSearch('JFK', dest.code);
          }}
        >
          Search Flights to {dest.name} ({dest.code}) <ArrowRight size={16} style={{ display: 'inline', marginLeft: '6px' }} />
        </button>
      </motion.div>
    </div>
  );
}

// Saved Trips / Wishlist Drawer Component
function WishlistDrawer({ wishlist, activeCurrency, onClose, onRemove, onSelectDestination }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="wishlist-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} fill="#2563eb" color="#2563eb" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Saved Destinations</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={16} /></button>
        </div>

        {wishlist.length === 0 ? (
          <div style={{ textBaseline: 'center', textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <Heart size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: '14px' }}>Your saved list is currently empty.</p>
            <small>Click the heart icon on any destination or deal to bookmark it!</small>
          </div>
        ) : (
          <div className="wishlist-items-list">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-item-card">
                <img src={item.image} alt={item.name} />
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: '13px', display: 'block' }}>{item.name}, {item.country}</b>
                  <small style={{ color: '#2563eb', fontWeight: '800' }}>From {formatPrice(item.startingPriceUSD, activeCurrency)}</small>
                </div>
                <button
                  style={{ color: '#ef4444', padding: '6px' }}
                  onClick={() => onRemove(item.id)}
                  title="Remove"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Custom Journey Planner Wizard
function JourneyPlanner({ activeCurrency, onSelectFlightSearch }) {
  const [selectedMood, setSelectedMood] = useState(journeyPlannerPresets[0]);
  const [budgetUSD, setBudgetUSD] = useState(1500);

  return (
    <div className="journey-planner container">
      <div className="section-heading centered">
        <div className="eyebrow"><Sparkles size={14} /> Custom Itinerary Wizard</div>
        <h2>Build Your <i>Custom Journey.</i></h2>
        <p>Select your travel mood and ideal budget to calculate tailored recommendations.</p>
      </div>

      <div className="planner-steps-grid">
        {journeyPlannerPresets.map((p) => (
          <div
            key={p.id}
            className={`planner-option-card ${selectedMood.id === p.id ? 'selected' : ''}`}
            onClick={() => setSelectedMood(p)}
          >
            <b style={{ fontSize: '14px', display: 'block', marginBottom: '6px', color: '#0f172a' }}>{p.mood}</b>
            <small style={{ color: '#64748b', display: 'block' }}>Ideal: {p.idealDuration}</small>
          </div>
        ))}
      </div>

      <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 16px', color: '#0f172a' }}>Recommended Destinations for {selectedMood.mood}</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
          {selectedMood.destinations.map((d) => (
            <div key={d} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '12px', fontWeight: '700', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} />
              <span>{d}</span>
            </div>
          ))}
        </div>

        <h4 style={{ fontSize: '14px', fontWeight: '800', margin: '16px 0 8px', color: '#0f172a' }}>Curated Highlights Included</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {selectedMood.highlights.map((h) => (
            <span key={h} className="amenity-tag" style={{ padding: '6px 12px', fontSize: '11px' }}>✨ {h}</span>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <div>
            <small style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Estimated Package Cost</small>
            <b style={{ fontSize: '22px', color: '#2563eb' }}>{formatPrice(selectedMood.avgBudgetUSD, activeCurrency)}</b>
          </div>
          <button className="select-flight-btn" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => onSelectFlightSearch('JFK', 'HND')}>
            Find Flights for This Journey <ArrowRight size={16} style={{ display: 'inline', marginLeft: '6px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Search Results Filtered Page
function SearchResultsView({ searchParams, activeCurrency, onBookFlight }) {
  const [stopsFilter, setStopsFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('price');

  const filtered = flightsDatabase.filter(f => {
    if (stopsFilter === 'nonstop' && f.stops !== 0) return false;
    if (stopsFilter === '1stop' && f.stops > 1) return false;
    if (f.priceUSD > maxPrice) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price') return a.priceUSD - b.priceUSD;
    if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
    return b.rating - a.rating;
  });

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      <div className="results-header">
        <div>
          <span>Available Flights: {searchParams.fromCode} → {searchParams.toCode}</span>
          <small style={{ display: 'block', color: '#64748b', fontSize: '11px' }}>{filtered.length} flight options found</small>
        </div>

        <div className="sort-tabs">
          <button className={sortBy === 'price' ? 'active' : ''} onClick={() => setSortBy('price')}>Cheapest</button>
          <button className={sortBy === 'duration' ? 'active' : ''} onClick={() => setSortBy('duration')}>Fastest</button>
          <button className={sortBy === 'rating' ? 'active' : ''} onClick={() => setSortBy('rating')}>Best Rated</button>
        </div>
      </div>

      <div className="search-results-layout">
        {/* Sidebar Filters */}
        <aside className="filter-sidebar">
          <h3>
            <span>Filters</span>
            <button className="reset-link" onClick={() => { setStopsFilter('all'); setMaxPrice(1000); }}>Reset</button>
          </h3>

          <div className="filter-group">
            <label className="group-title">Stops</label>
            <label className="checkbox-item">
              <input type="radio" name="stops" checked={stopsFilter === 'all'} onChange={() => setStopsFilter('all')} />
              <span>All Flights</span>
            </label>
            <label className="checkbox-item">
              <input type="radio" name="stops" checked={stopsFilter === 'nonstop'} onChange={() => setStopsFilter('nonstop')} />
              <span>Nonstop Only</span>
            </label>
          </div>

          <div className="filter-group">
            <label className="group-title">Max Price: {formatPrice(maxPrice, activeCurrency)}</label>
            <input
              type="range"
              min="200"
              max="1000"
              step="25"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb' }}
            />
          </div>
        </aside>

        {/* Flight Cards List */}
        <div className="flight-cards-list">
          {filtered.length === 0 ? (
            <div style={{ background: '#fff', padding: '40px', borderRadius: '18px', textAlign: 'center', color: '#64748b' }}>
              <AlertCircle size={36} style={{ margin: '0 auto 12px' }} />
              <h3>No flights matched your filter criteria.</h3>
              <p style={{ fontSize: '13px' }}>Try adjusting your price slider or stops filter.</p>
            </div>
          ) : (
            filtered.map((fl) => (
              <motion.article key={fl.id} className="flight-card" layout>
                <div className="flight-main">
                  <div className="airline-info">
                    <div className="airline-logo-badge">{fl.logo}</div>
                    <div className="airline-details">
                      <b>{fl.airline}</b>
                      <small>{fl.flightNumber} · {fl.aircraft}</small>
                    </div>
                  </div>

                  <div className="flight-times">
                    <div className="time-node">
                      <b>{fl.depTime}</b>
                      <small>{fl.fromCode}</small>
                    </div>

                    <div className="flight-duration-line">
                      <small>{fl.duration}</small>
                      <div className="line-visual" />
                      <small style={{ fontSize: '9px', color: fl.stops === 0 ? '#16a34a' : '#d97706', marginTop: '2px' }}>{fl.stopDetails}</small>
                    </div>

                    <div className="time-node">
                      <b>{fl.arrTime}</b>
                      <small>{fl.toCode}</small>
                    </div>
                  </div>

                  <div className="price-booking-action">
                    <b>{formatPrice(fl.priceUSD, activeCurrency)}</b>
                    <small>per passenger</small>
                    <button className="select-flight-btn" onClick={() => onBookFlight(fl)}>
                      Select Flight
                    </button>
                  </div>
                </div>

                <div className="flight-footer-amenities">
                  <div className="amenities-pills">
                    {fl.amenities.map(a => <span key={a} className="amenity-tag">{a}</span>)}
                  </div>
                  <span>★ {fl.rating} / 5.0 rating</span>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Main Home Page View
function Home({ activeCurrency, onPerformSearch, onOpenDestModal, wishlist, onToggleWishlist, onClaimDeal, setPage }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredDestinations = activeCategory === 'All'
    ? destinations
    : destinations.filter(d => d.category === activeCategory);

  return (
    <main id="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-orbs-wrap">
          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />
        </div>
        <div className="container hero-grid">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="eyebrow"><Sparkles size={14} /> A more thoughtful way to fly</div>
            <h1>Go further.<br /><i>Feel lighter.</i></h1>
            <p className="hero-copy">Find your next escape with clear choices, lovely details, and fares worth getting excited about.</p>
            <div className="hero-trust">
              <span><Check /> Clear, considered choices</span>
              <span><Check /> Live currency conversion</span>
              <span><Check /> Instant reservation confirmation</span>
            </div>
          </motion.div>

          <motion.div className="hero-photo" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }}>
            <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85" alt="Airplane above clouds" />
            <div className="photo-note">
              <span className="note-icon"><Plane size={18} /></span>
              <div>
                <b>Next stop: wonder</b>
                <small>Thoughtful trips, beautifully simple</small>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="container search-wrap">
          <SearchCard onPerformSearch={onPerformSearch} />
        </div>
      </section>

      {/* Features */}
      <section className="section container">
        <div className="section-heading centered">
          <div className="eyebrow">Why FaresFinders</div>
          <h2>The good kind of <i>travel planning.</i></h2>
          <p>Made for people who want less noise and more of the world.</p>
        </div>
        <div className="features">
          {[
            [ShieldCheck, 'Clear from the start', 'Simple fare ideas and no mystery language.'],
            [BadgeDollarSign, 'Value you can feel', 'Smart options that make your budget go further.'],
            [Headphones, 'Humanly helpful', 'Friendly support when your itinerary needs a second pair of eyes.'],
            [Sparkles, 'Made for discovery', 'Fresh inspiration for your next brilliant escape.']
          ].map(([Icon, title, text], i) => (
            <motion.article className="feature-card" key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <span className="feature-icon"><Icon /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Destinations Spotlight */}
      <section className="section destination-section">
        <div className="container">
          <div className="split" style={{ marginBottom: '20px' }}>
            <div>
              <div className="eyebrow">Go somewhere beautiful</div>
              <h2>Dream in <i>departure boards.</i></h2>
            </div>

            <div className="dest-category-tabs">
              {['All', 'Beach & Coast', 'Cultural & Historic', 'Nature & Mountains', 'Luxury & Wellness'].map((cat) => (
                <button
                  key={cat}
                  className={activeCategory === cat ? 'active' : ''}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="destinations">
            {filteredDestinations.map((d, i) => {
              const isFav = wishlist.some(item => item.id === d.id);
              return (
                <motion.article
                  className="destination-card"
                  key={d.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => onOpenDestModal(d)}
                >
                  <img src={d.image} alt={d.name} />
                  <div className="dest-content">
                    <div className="dest-header">
                      <span className="dest-tag">{d.category}</span>
                      <button
                        className={`fav-btn ${isFav ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); onToggleWishlist(d); }}
                        title={isFav ? 'Remove from saved' : 'Save destination'}
                      >
                        <Heart size={16} fill={isFav ? '#fff' : 'none'} />
                      </button>
                    </div>

                    <h3>{d.name}, {d.country}</h3>
                    <small>{d.bestMonths}</small>

                    <div className="dest-footer">
                      <span>Return fares from</span>
                      <b>{formatPrice(d.startingPriceUSD, activeCurrency)}</b>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Flash Deals Grid */}
      <section className="section container" id="deals">
        <div className="section-heading split">
          <div>
            <div className="eyebrow">Curated fare ideas</div>
            <h2>Flash Airline Deals,<br /><i>without the clutter.</i></h2>
          </div>
          <p className="side-copy">A few routes we’re watching for travelers ready to make a move.</p>
        </div>

        <div className="deal-grid">
          {flashDeals.map((deal, i) => (
            <motion.article className="deal-card" key={deal.id} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <span className={`airline-mark mark-${i % 3}`}>{deal.airlineCode}</span>
              <div className="deal-info">
                <h3>
                  {deal.route}
                  <span className="deal-badge">{deal.discountBadge}</span>
                </h3>
                <small>{deal.airline} · Fly in {deal.departureMonth}</small>
              </div>

              <div className="price">
                <small>Return from</small>
                <b>{formatPrice(deal.priceUSD, activeCurrency)}</b>
              </div>

              <button className="claim-deal-btn" onClick={() => onClaimDeal(deal)}>
                Claim Deal
              </button>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Custom Journey Planner */}
      <JourneyPlanner activeCurrency={activeCurrency} onSelectFlightSearch={(from, to) => onPerformSearch({ fromCode: from, toCode: to })} />

      {/* Process */}
      <section className="process" style={{ marginTop: '90px' }}>
        <div className="container process-grid">
          <div>
            <div className="eyebrow light">Simple by design</div>
            <h2>Less searching.<br /><i>More going.</i></h2>
            <p>Three small steps between the first spark and a trip worth remembering.</p>
          </div>
          <div className="steps">
            {[
              ['01', 'Share your spark', 'Tell us where your mind keeps wandering.'],
              ['02', 'See the good options', 'Compare flight ideas that feel clear, not endless.'],
              ['03', 'Choose your way forward', 'Move ahead with confidence and help close by.']
            ].map(([n, t, x]) => (
              <div className="step" key={n}>
                <b>{n}</b>
                <div>
                  <h3>{t}</h3>
                  <p>{x}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section container">
        <div className="section-heading centered">
          <div className="eyebrow">Traveller notes</div>
          <h2>Loved by people who <i>like to go.</i></h2>
        </div>
        <div className="reviews">
          {[
            ['“The whole experience felt considered, calm, and genuinely helpful. Our honeymoon route was effortless.”', 'Sofia M.', 'Chicago, IL'],
            ['“Clear options, great value, and a real person when I had a question. Exactly what travel planning should be.”', 'Daniel R.', 'Austin, TX'],
            ['“We found a brilliant fare for our family trip without the usual sea of confusing tabs.”', 'Aisha K.', 'New York, NY']
          ].map(([quote, name, city]) => (
            <article className="review" key={name}>
              <div className="stars">
                {[1, 2, 3, 4, 5].map(x => <Star key={x} size={14} fill="currentColor" />)}
              </div>
              <p>{quote}</p>
              <div className="reviewer">
                <span>{name[0]}</span>
                <div>
                  <b>{name}</b>
                  <small style={{ display: 'block', color: '#94a3b8' }}>{city}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="section faq-section container">
        <div className="faq-title">
          <div className="eyebrow">A little clarity</div>
          <h2>Questions,<br /><i>answered.</i></h2>
          <p>Can’t see what you need? <button onClick={() => setPage('contact')}>Talk to us.</button></p>
        </div>
        <div className="faq-list">
          {[
            ['How does FaresFinders help me find flights?', 'We surface thoughtful flight ideas and clear fare options with live client-side currency switching and reservation preview.'],
            ['Are the fares shown guaranteed?', 'Displayed prices reflect current static database estimates. Instant booking confirmation is rendered directly in our interactive demo.'],
            ['Can I get help choosing an itinerary?', 'Absolutely. Use our Custom Journey Planner wizard or contact our travel team directly.'],
            ['Do you charge a fee to search?', 'No. Exploring destinations and searching fares is 100% free.']
          ].map(([q, a], i) => (
            <article className={`faq ${openFaq === i ? 'expanded' : ''}`} key={q}>
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                {q}
                <ChevronDown size={20} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    {a}
                  </motion.p>
                )}
              </AnimatePresence>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container">
        <div className="cta">
          <div>
            <div className="eyebrow light">Your next chapter is waiting</div>
            <h2>Ready when<br /><i>you are.</i></h2>
            <p>Start collecting the moments you’ll talk about for years.</p>
            <button onClick={() => setPage('contact')} className="cta-button">
              Start planning <ArrowRight size={17} />
            </button>
          </div>
          <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=85" alt="Mountain road at sunset" />
        </div>
      </section>
    </main>
  );
}

// Static Subpages (About, Contact, Privacy, Terms)
function StaticPage({ type, setPage }) {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const data = {
    about: ['Travel should feel like the beginning of something good.', 'FaresFinders LLC was created for curious people who value both the destination and the way they get there. We believe great travel starts with a clear mind, an open map, and someone in your corner.', 'We make the early stages of planning feel more human: less frantic comparison, more helpful perspective.'],
    contact: ['Let’s plan a little magic.', 'Whether you have a route in mind or just a feeling you want to follow, we’d love to hear from you.', 'hello@faresfindersllc.com'],
    planner: ['Custom Itinerary Planner', 'Design your dream itinerary with our smart recommendation engine.', 'Pick your parameters and let us suggest the best routes.'],
    deals: ['Curated Flash Sales', 'Handpicked flight deals updated regularly.', 'Save up to 35% on international departures.'],
    privacy: ['Privacy, plainly put.', 'FaresFinders LLC respects your privacy. This demonstration site does not create accounts, collect payment details, or track browser fingerprints. Contact submissions are held in local state only.', 'We do not sell personal information.'],
    terms: ['Terms & conditions.', 'This website is an informational showcase of FaresFinders LLC. Fares and flight schedules are simulated for demonstration purposes.', 'Please confirm travel details with relevant airlines prior to travel.']
  };

  const [title, body, extra] = data[type] || data.about;

  return (
    <main className="inner-page">
      <div className="container">
        <div className="eyebrow">FaresFinders LLC</div>
        <h1>{title}</h1>
        <div className="page-grid">
          <div>
            <p>{body}</p>
            <p>{extra}</p>

            {type === 'contact' && (
              <div style={{ marginTop: '24px' }}>
                {!formSubmitted ? (
                  <form
                    style={{ display: 'grid', gap: '12px', background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}
                    onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); }}
                  >
                    <div className="form-field">
                      <label>Your Name</label>
                      <input type="text" placeholder="John Doe" required />
                    </div>
                    <div className="form-field">
                      <label>Email Address</label>
                      <input type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="form-field">
                      <label>How can we help?</label>
                      <select>
                        <option>Flight Inquiry & Booking Support</option>
                        <option>Custom Itinerary Planning</option>
                        <option>Group Travel Discount</option>
                      </select>
                    </div>
                    <button type="submit" className="select-flight-btn" style={{ padding: '12px', marginTop: '8px' }}>
                      Send Message
                    </button>
                  </form>
                ) : (
                  <div style={{ background: '#dcfce7', color: '#16a34a', padding: '20px', borderRadius: '14px', textAlign: 'center' }}>
                    <CheckCircle2 size={32} style={{ margin: '0 auto 8px' }} />
                    <b>Message Received!</b>
                    <p style={{ fontSize: '13px', margin: '4px 0 0' }}>Our travel specialists will reach out within 2 hours.</p>
                  </div>
                )}

                <div className="contact-details" style={{ marginTop: '24px' }}>
                  <span><Mail /> hello@faresfindersllc.com</span>
                  <span><Phone /> +1 (800) 555-0148</span>
                  <span><Clock3 /> Mon–Fri, 9am–6pm ET</span>
                </div>
              </div>
            )}
          </div>

          <aside>
            <b>Looking for a new perspective?</b>
            <p>Explore the world with a little more ease.</p>
            <button onClick={() => setPage('home')}>Back to exploring <ArrowRight size={16} /></button>
          </aside>
        </div>
      </div>
    </main>
  );
}

// Footer
function Footer({ setPage }) {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer>
      <div className="container footer-main">
        <div>
          <Logo setPage={setPage} />
          <p style={{ marginTop: '12px' }}>Better beginnings for every journey.</p>
          <div className="social">
            <Globe2 size={18} />
            <Send size={18} />
            <Compass size={18} />
          </div>
        </div>

        <div>
          <b>Explore</b>
          <button onClick={() => setPage('home')}>Destinations</button>
          <button onClick={() => setPage('deals')}>Flash Deals</button>
          <button onClick={() => setPage('planner')}>Journey Planner</button>
          <button onClick={() => setPage('about')}>Our Story</button>
          <button onClick={() => setPage('contact')}>Contact</button>
        </div>

        <div>
          <b>Stay in the loop</b>
          <p>Small notes on big horizons.</p>
          {!subscribed ? (
            <form className="email" onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit" aria-label="Subscribe"><ArrowRight size={17} /></button>
            </form>
          ) : (
            <small style={{ color: '#16a34a', fontWeight: '800', display: 'block', marginTop: '8px' }}>✓ Subscribed!</small>
          )}
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 FaresFinders LLC. All rights reserved.</span>
        <div>
          <button onClick={() => setPage('privacy')}>Privacy Policy</button>
          <button onClick={() => setPage('terms')}>Terms & Conditions</button>
        </div>
      </div>
    </footer>
  );
}

// Root App Component
function App() {
  const [page, setPage] = useState('home');
  const [activeCurrency, setActiveCurrency] = useState(currencies[0]);
  const [searchParams, setSearchParams] = useState(null);
  const [selectedDestModal, setSelectedDestModal] = useState(null);
  const [bookingFlightModal, setBookingFlightModal] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Saved Wishlist State stored in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('faresfinders_wishlist');
      return saved ? JSON.parse(saved) : [destinations[0]];
    } catch {
      return [destinations[0]];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('faresfinders_wishlist', JSON.stringify(wishlist));
    } catch (err) {
      console.error(err);
    }
  }, [wishlist]);

  const toggleWishlist = (dest) => {
    if (wishlist.some(item => item.id === dest.id)) {
      setWishlist(wishlist.filter(item => item.id !== dest.id));
    } else {
      setWishlist([...wishlist, dest]);
    }
  };

  const handlePerformSearch = (params) => {
    setSearchParams(params);
    setPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClaimDeal = (deal) => {
    handlePerformSearch({ fromCode: 'JFK', toCode: 'LHR' });
  };

  return (
    <>
      <Nav
        page={page}
        setPage={setPage}
        activeCurrency={activeCurrency}
        setActiveCurrency={setActiveCurrency}
        wishlist={wishlist}
        setWishlist={setWishlist}
        setIsWishlistOpen={setIsWishlistOpen}
      />

      {page === 'home' && (
        <Home
          activeCurrency={activeCurrency}
          onPerformSearch={handlePerformSearch}
          onOpenDestModal={(dest) => setSelectedDestModal(dest)}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          onClaimDeal={handleClaimDeal}
          setPage={setPage}
        />
      )}

      {page === 'results' && searchParams && (
        <SearchResultsView
          searchParams={searchParams}
          activeCurrency={activeCurrency}
          onBookFlight={(flight) => setBookingFlightModal(flight)}
        />
      )}

      {page === 'planner' && (
        <div className="inner-page">
          <JourneyPlanner activeCurrency={activeCurrency} onSelectFlightSearch={(from, to) => handlePerformSearch({ fromCode: from, toCode: to })} />
        </div>
      )}

      {['about', 'contact', 'deals', 'privacy', 'terms'].includes(page) && (
        <StaticPage type={page} setPage={setPage} />
      )}

      <Footer setPage={setPage} />

      {/* Modals & Overlays */}
      <AnimatePresence>
        {selectedDestModal && (
          <DestinationModal
            dest={selectedDestModal}
            activeCurrency={activeCurrency}
            onClose={() => setSelectedDestModal(null)}
            onSelectFlightSearch={(from, to) => {
              setSelectedDestModal(null);
              handlePerformSearch({ fromCode: from, toCode: to });
            }}
          />
        )}

        {bookingFlightModal && (
          <BookingModal
            flight={bookingFlightModal}
            activeCurrency={activeCurrency}
            onClose={() => setBookingFlightModal(null)}
          />
        )}

        {isWishlistOpen && (
          <WishlistDrawer
            wishlist={wishlist}
            activeCurrency={activeCurrency}
            onClose={() => setIsWishlistOpen(false)}
            onRemove={(id) => setWishlist(wishlist.filter(w => w.id !== id))}
          />
        )}
      </AnimatePresence>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
