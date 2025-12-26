"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Lock,
  User,
  Globe,
  FileText,
  Calendar,
  GitBranch,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Zap,
} from "lucide-react";
import {
  BUSINESS_TYPES,
  INDIAN_STATES,
  validateEmail,
  validatePhone,
  validateGST,
  validatePAN,
  validatePinCode,
  validatePassword,
} from "@/lib/auth";

type Step = 1 | 2 | 3 | 4;

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassKey, setShowPassKey] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    // Business Information
    businessName: "",
    businessType: "",
    branches: "",
    dateOfEstablishment: "",
    gstNumber: "",
    panNumber: "",

    // Contact Information
    email: "",
    phone: "",
    alternativePhone: "",
    telephone: "",
    website: "",

    // Address Information
    address: "",
    city: "",
    state: "",
    pinCode: "",

    // Account Credentials
    username: "",
    password: "",
    confirmPassword: "",
    passKey: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
        if (!formData.businessType) newErrors.businessType = "Please select a business type";
        if (!formData.gstNumber.trim()) {
          newErrors.gstNumber = "GST number is required";
        } else if (!validateGST(formData.gstNumber)) {
          newErrors.gstNumber = "Invalid GST number format";
        }
        if (!formData.panNumber.trim()) {
          newErrors.panNumber = "PAN number is required";
        } else if (!validatePAN(formData.panNumber.toUpperCase())) {
          newErrors.panNumber = "Invalid PAN number format";
        }
        break;

      case 2:
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
          newErrors.email = "Invalid email format";
        }
        if (!formData.phone.trim()) {
          newErrors.phone = "Phone number is required";
        } else if (!validatePhone(formData.phone)) {
          newErrors.phone = "Invalid phone number (10 digits)";
        }
        if (formData.alternativePhone && !validatePhone(formData.alternativePhone)) {
          newErrors.alternativePhone = "Invalid phone number format";
        }
        break;

      case 3:
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state) newErrors.state = "Please select a state";
        if (!formData.pinCode.trim()) {
          newErrors.pinCode = "Pin code is required";
        } else if (!validatePinCode(formData.pinCode)) {
          newErrors.pinCode = "Invalid pin code (6 digits)";
        }
        break;

      case 4:
        if (!formData.username.trim()) {
          newErrors.username = "Username is required";
        } else if (formData.username.length < 4) {
          newErrors.username = "Username must be at least 4 characters";
        }
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else {
          const passwordValidation = validatePassword(formData.password);
          if (!passwordValidation.valid) {
            newErrors.password = passwordValidation.message;
          }
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        if (!formData.passKey.trim()) {
          newErrors.passKey = "Pass key is required";
        } else if (formData.passKey.length < 6) {
          newErrors.passKey = "Pass key must be at least 6 characters";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4) as Step);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handleSubmit = () => {
    if (validateStep(4)) {
      // Store registration data in localStorage for demo
      localStorage.setItem("billease_user", JSON.stringify(formData));
      localStorage.setItem("billease_registered", "true");
      router.push("/workspace");
    }
  };

  const steps = [
    { number: 1, title: "Business Info", icon: Building2 },
    { number: 2, title: "Contact", icon: Phone },
    { number: 3, title: "Address", icon: MapPin },
    { number: 4, title: "Credentials", icon: Lock },
  ];

  const inputClass =
    "w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";
  const selectClass =
    "w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";
  const labelClass = "block text-sm font-medium text-foreground mb-2";
  const errorClass = "text-xs text-destructive mt-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">BillEase Suite</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: currentStep >= step.number ? 1 : 0.8,
                      backgroundColor:
                        currentStep >= step.number
                          ? "hsl(var(--primary))"
                          : "hsl(var(--muted))",
                    }}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground"
                  >
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= step.number
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-24 md:w-32 h-1 mx-4 rounded-full ${
                      currentStep > step.number ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-card rounded-2xl border border-border p-8 shadow-lg"
        >
          {/* Step 1: Business Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Business Information</h2>
                <p className="text-muted-foreground mt-1">Tell us about your business</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Business Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    className={inputClass}
                  />
                  {errors.businessName && <p className={errorClass}>{errors.businessName}</p>}
                </div>

                <div>
                  <label className={labelClass}>
                    <FileText className="w-4 h-4 inline mr-2" />
                    Type of Business *
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => updateField("businessType", e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select business type</option>
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.businessType && <p className={errorClass}>{errors.businessType}</p>}
                </div>

                <div>
                  <label className={labelClass}>
                    <GitBranch className="w-4 h-4 inline mr-2" />
                    Number of Branches
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1, 2, 5"
                    min="1"
                    value={formData.branches}
                    onChange={(e) => updateField("branches", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date of Establishment
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfEstablishment}
                    onChange={(e) => updateField("dateOfEstablishment", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <FileText className="w-4 h-4 inline mr-2" />
                    GST Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 22AAAAA0000A1Z5"
                    value={formData.gstNumber}
                    onChange={(e) => updateField("gstNumber", e.target.value.toUpperCase())}
                    maxLength={15}
                    className={inputClass}
                  />
                  {errors.gstNumber && <p className={errorClass}>{errors.gstNumber}</p>}
                </div>

                <div>
                  <label className={labelClass}>
                    <FileText className="w-4 h-4 inline mr-2" />
                    PAN Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ABCDE1234F"
                    value={formData.panNumber}
                    onChange={(e) => updateField("panNumber", e.target.value.toUpperCase())}
                    maxLength={10}
                    className={inputClass}
                  />
                  {errors.panNumber && <p className={errorClass}>{errors.panNumber}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
                <p className="text-muted-foreground mt-1">How can we reach you?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="business@example.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={inputClass}
                  />
                  {errors.email && <p className={errorClass}>{errors.email}</p>}
                </div>

                <div>
                  <label className={labelClass}>
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))}
                    maxLength={10}
                    className={inputClass}
                  />
                  {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                </div>

                <div>
                  <label className={labelClass}>
                    <Phone className="w-4 h-4 inline mr-2" />
                    Alternative Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543211"
                    value={formData.alternativePhone}
                    onChange={(e) => updateField("alternativePhone", e.target.value.replace(/\D/g, ""))}
                    maxLength={10}
                    className={inputClass}
                  />
                  {errors.alternativePhone && <p className={errorClass}>{errors.alternativePhone}</p>}
                </div>

                <div>
                  <label className={labelClass}>
                    <Phone className="w-4 h-4 inline mr-2" />
                    Telephone (Landline)
                  </label>
                  <input
                    type="tel"
                    placeholder="022-12345678"
                    value={formData.telephone}
                    onChange={(e) => updateField("telephone", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <Globe className="w-4 h-4 inline mr-2" />
                    Website / App URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourbusiness.com"
                    value={formData.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Address Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Address Information</h2>
                <p className="text-muted-foreground mt-1">Where is your business located?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Full Address *
                  </label>
                  <textarea
                    placeholder="Enter your complete business address"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                  {errors.address && <p className={errorClass}>{errors.address}</p>}
                </div>

                <div>
                  <label className={labelClass}>City *</label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className={inputClass}
                  />
                  {errors.city && <p className={errorClass}>{errors.city}</p>}
                </div>

                <div>
                  <label className={labelClass}>State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className={errorClass}>{errors.state}</p>}
                </div>

                <div>
                  <label className={labelClass}>Pin Code *</label>
                  <input
                    type="text"
                    placeholder="400001"
                    value={formData.pinCode}
                    onChange={(e) => updateField("pinCode", e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    className={inputClass}
                  />
                  {errors.pinCode && <p className={errorClass}>{errors.pinCode}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Account Credentials */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Create Your Account</h2>
                <p className="text-muted-foreground mt-1">Set up your login credentials</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    <User className="w-4 h-4 inline mr-2" />
                    Username *
                  </label>
                  <input
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => updateField("username", e.target.value.toLowerCase().replace(/\s/g, "_"))}
                    className={inputClass}
                  />
                  {errors.username && <p className={errorClass}>{errors.username}</p>}
                </div>

                <div>
                  <label className={labelClass}>
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className={errorClass}>{errors.password}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    Min 8 chars, uppercase, lowercase, number & special char
                  </p>
                </div>

                <div>
                  <label className={labelClass}>
                    <Lock className="w-4 h-4 inline mr-2" />
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    className={inputClass}
                  />
                  {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>
                    <Lock className="w-4 h-4 inline mr-2" />
                    Pass Key (Recovery Key) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassKey ? "text" : "password"}
                      placeholder="Create a memorable pass key for account recovery"
                      value={formData.passKey}
                      onChange={(e) => updateField("passKey", e.target.value)}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassKey(!showPassKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.passKey && <p className={errorClass}>{errors.passKey}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    This will be used to recover your account if you forget your password
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-success text-success-foreground font-medium hover:bg-success/90 transition-colors"
              >
                <Check className="w-5 h-5" />
                Complete Registration
              </button>
            )}
          </div>
        </motion.div>

        {/* Already have account */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
