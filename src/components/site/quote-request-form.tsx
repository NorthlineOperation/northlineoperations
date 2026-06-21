"use client";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronUp,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileText,
  HardHat,
  HelpCircle,
  Home,
  KeyRound,
  Mail,
  Phone,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  SprayCan,
  ThumbsUp,
  Upload,
  User,
  Warehouse,
} from "lucide-react";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { LandingPageContent } from "@/lib/cms/landing-page-content";
import { cn } from "@/lib/utils";

type QuoteContent = LandingPageContent["quote"];
type FooterContent = LandingPageContent["footer"];

type ContactInfo = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  referralSource: string;
};

type PropertyInfo = {
  propertyName: string;
  propertyType: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  buildingSize: string;
  floors: string;
  onSiteContact: string;
  onSitePhone: string;
  bestContactTime: string;
  preferredStartDate: string;
  notes: string;
};

type CleaningNeeds = {
  selectedServiceIds: string[];
  frequency: string;
  suppliesProvided: string;
  urgency: string;
  serviceNotes: string;
};

type AdditionalInfo = {
  accessStart: string;
  accessEnd: string;
  accessProvider: string;
  accessOther: string;
  elevatorAccess: string;
  loadingDock: string;
  restrooms: string;
  breakRooms: string;
  privateOffices: string;
  specialConsiderations: string;
  afterHours: string;
  weekendService: string;
};

type QuoteFormState = {
  contact: ContactInfo;
  property: PropertyInfo;
  cleaningNeeds: CleaningNeeds;
  additionalInfo: AdditionalInfo;
};

type QuoteStep = {
  id: number;
  label: string;
  title: string;
  description: string;
  icon: typeof User;
};

type ServiceWorkflow = {
  id: string;
  title: string;
  description: string;
  icon: typeof Home;
  steps: Array<{
    label: string;
    icon: typeof KeyRound;
  }>;
  outcome: string;
};

const quoteSteps: QuoteStep[] = [
  {
    id: 1,
    label: "Your Information",
    title: "Your Information",
    description: "Let's start with a few details about you.",
    icon: User,
  },
  {
    id: 2,
    label: "Property Details",
    title: "Property Details",
    description: "Tell us about the property you'd like us to service.",
    icon: Building2,
  },
  {
    id: 3,
    label: "Cleaning Needs",
    title: "Cleaning Needs",
    description: "Select the service you need and review how the work flows.",
    icon: SprayCan,
  },
  {
    id: 4,
    label: "Additional Info",
    title: "Additional Information",
    description: "A few more details help us tailor your quote.",
    icon: ClipboardList,
  },
  {
    id: 5,
    label: "Review & Submit",
    title: "Review Your Quote Request",
    description: "Review your information before submitting the request.",
    icon: ClipboardCheck,
  },
];

const serviceWorkflows: ServiceWorkflow[] = [
  {
    id: "move-out-cleaning",
    title: "Move-Out Cleaning",
    description:
      "Perfect for tenants, landlords, and property managers. We leave the space spotless and move-out ready.",
    icon: Home,
    outcome: "Move-out ready and guaranteed satisfaction.",
    steps: [
      { label: "Access Confirmed", icon: KeyRound },
      { label: "Unit Walkthrough", icon: Search },
      { label: "Deep Cleaning", icon: Sparkles },
      { label: "Final Quality Check", icon: ShieldCheck },
      { label: "Turn-Ready Completion", icon: Home },
    ],
  },
  {
    id: "post-construction-cleaning",
    title: "Post-Construction Cleaning",
    description:
      "Specialized cleaning for new construction, renovations, and project turnover.",
    icon: HardHat,
    outcome: "Project ready for inspection and occupancy.",
    steps: [
      { label: "Scope Review", icon: ClipboardList },
      { label: "Rough Cleanup", icon: SprayCan },
      { label: "Detail Cleaning", icon: Sparkles },
      { label: "Final Touch-Up", icon: ShieldCheck },
      { label: "Turnover-Ready Walkthrough", icon: CheckCircle2 },
    ],
  },
  {
    id: "janitorial-services",
    title: "Janitorial Services",
    description:
      "Regular, reliable cleaning to keep your facility clean, healthy, and professional every day.",
    icon: Warehouse,
    outcome: "A clean, healthy facility every day.",
    steps: [
      { label: "Site Walkthrough", icon: Building2 },
      { label: "Custom Cleaning Plan", icon: ClipboardList },
      { label: "Scheduled Service", icon: CalendarDays },
      { label: "Quality Inspections", icon: ShieldCheck },
      { label: "Monthly Service Review", icon: ClipboardCheck },
    ],
  },
  {
    id: "commercial-cleaning",
    title: "Commercial Cleaning",
    description:
      "Professional cleaning for offices, retail, medical, and other commercial spaces.",
    icon: Building2,
    outcome: "A professional clean space that represents your business.",
    steps: [
      { label: "Facility Review", icon: Building2 },
      { label: "Scope Confirmation", icon: ClipboardList },
      { label: "Service Execution", icon: SprayCan },
      { label: "Quality Control", icon: ShieldCheck },
      { label: "Client Follow-Up", icon: User },
    ],
  },
  {
    id: "property-cleaning-services",
    title: "Property Cleaning Services",
    description:
      "Comprehensive cleaning solutions for property managers, HOAs, and real estate professionals.",
    icon: Home,
    outcome: "Well-maintained properties and happy tenants.",
    steps: [
      { label: "Property Assessment", icon: Building2 },
      { label: "Turnover or Cleaning Plan", icon: FileText },
      { label: "Service Scheduling", icon: CalendarDays },
      { label: "Completion Photos", icon: Camera },
      { label: "Manager Approval", icon: User },
    ],
  },
];

const whyChooseItems = [
  {
    icon: User,
    title: "Experienced & Professional Team",
    description: "Trained professionals you can count on.",
  },
  {
    icon: Clock,
    title: "Reliable & On-Time Service",
    description: "We show up when we say we will.",
  },
  {
    icon: BadgeCheck,
    title: "High-Quality Standards",
    description: "Consistent, detailed cleaning every time.",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description: "General liability coverage for your peace of mind.",
  },
  {
    icon: ThumbsUp,
    title: "Customer Satisfaction Guaranteed",
    description: "We're not happy unless you are.",
  },
];

const initialFormState: QuoteFormState = {
  contact: {
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    jobTitle: "",
    referralSource: "",
  },
  property: {
    propertyName: "",
    propertyType: "",
    streetAddress: "",
    city: "",
    state: "OH",
    zipCode: "",
    buildingSize: "",
    floors: "",
    onSiteContact: "",
    onSitePhone: "",
    bestContactTime: "",
    preferredStartDate: "",
    notes: "",
  },
  cleaningNeeds: {
    selectedServiceIds: [],
    frequency: "one-time",
    suppliesProvided: "not-sure",
    urgency: "within-30-days",
    serviceNotes: "",
  },
  additionalInfo: {
    accessStart: "",
    accessEnd: "",
    accessProvider: "on-site-contact",
    accessOther: "",
    elevatorAccess: "not-sure",
    loadingDock: "not-sure",
    restrooms: "",
    breakRooms: "",
    privateOffices: "",
    specialConsiderations: "",
    afterHours: "not-sure",
    weekendService: "not-sure",
  },
};

const propertyTypes = [
  "Commercial Office",
  "Retail Space",
  "Medical Facility",
  "Apartment Community",
  "Industrial / Warehouse",
  "Construction Site",
  "Other Commercial Property",
];

const buildingSizes = [
  "Under 5,000 sq ft",
  "5,000 - 10,000 sq ft",
  "10,000 - 25,000 sq ft",
  "25,000 - 50,000 sq ft",
  "50,000+ sq ft",
];

const contactTimes = ["Morning", "Afternoon", "Evening", "Any time"];

const referralSources = [
  "Google Search",
  "Referral",
  "Social Media",
  "Existing Client",
  "Jobsite / Signage",
  "Other",
];

const frequencies = [
  { value: "one-time", label: "One-time project" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "bi-weekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "as-needed", label: "As needed" },
];

const urgencyOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "within-7-days", label: "Within 7 days" },
  { value: "within-30-days", label: "Within 30 days" },
  { value: "planning-ahead", label: "Planning ahead" },
];

const accessProviders = [
  { value: "on-site-contact", label: "On-site contact" },
  { value: "lockbox-key", label: "Lockbox / key left on site" },
  { value: "client-provided", label: "We will provide access" },
  { value: "other", label: "Other" },
];

type QuoteRequestFormProps = {
  quote: QuoteContent;
  footer: FooterContent;
};

export function QuoteRequestForm({ quote, footer }: QuoteRequestFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState(initialFormState);
  const [floorPlan, setFloorPlan] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(
    null,
  );

  const selectedServices = useMemo(
    () =>
      serviceWorkflows.filter((service) =>
        formState.cleaningNeeds.selectedServiceIds.includes(service.id),
      ),
    [formState.cleaningNeeds.selectedServiceIds],
  );
  const estimate = useMemo(() => calculateEstimate(formState), [formState]);
  const progress = (currentStep / quoteSteps.length) * 100;
  const currentStepMeta = quoteSteps[currentStep - 1];
  const CurrentStepIcon = currentStepMeta.icon;

  function updateSection<TSection extends keyof QuoteFormState>(
    section: TSection,
    field: keyof QuoteFormState[TSection],
    value: string,
  ) {
    setFormState((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  }

  function toggleService(serviceId: string) {
    setFormState((current) => {
      const selected = current.cleaningNeeds.selectedServiceIds;
      const nextSelected = selected.includes(serviceId)
        ? selected.filter((id) => id !== serviceId)
        : [...selected, serviceId];

      return {
        ...current,
        cleaningNeeds: {
          ...current.cleaningNeeds,
          selectedServiceIds: nextSelected,
        },
      };
    });
  }

  function goToStep(step: number) {
    setError(null);
    setCurrentStep(Math.min(Math.max(step, 1), quoteSteps.length));
  }

  function nextStep() {
    const validationError = validateStep(currentStep, formState);

    if (validationError) {
      setError(validationError);
      return;
    }

    goToStep(currentStep + 1);
  }

  function previousStep() {
    goToStep(currentStep - 1);
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFloorPlan(event.target.files?.[0] ?? null);
  }

  async function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError =
      validateStep(1, formState) ||
      validateStep(2, formState) ||
      validateStep(3, formState);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        ...formState,
        estimate,
      };
      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));

      if (floorPlan) {
        formData.append("floorPlan", floorPlan);
      }

      const response = await fetch("/api/quote-requests", {
        method: "POST",
        body: formData,
      });
      const body = (await response.json().catch(() => ({}))) as {
        id?: string;
        error?: string;
      };

      if (!response.ok || !body.id) {
        throw new Error(body.error ?? "Unable to submit quote request.");
      }

      setSubmittedRequestId(body.id);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to submit quote request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isExpanded) {
    return (
      <section id="quote" className="scroll-mt-24">
        <QuoteCallToAction
          quote={quote}
          onRequestQuote={() => setIsExpanded(true)}
        />
      </section>
    );
  }

  return (
    <section id="quote" className="scroll-mt-24 bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4">
                <div className="text-xs font-bold tracking-[0.25em] text-gold">
                  GET A QUOTE
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground transition hover:border-gold/50 hover:text-ink"
                >
                  <ChevronUp className="size-4" />
                  Collapse
                </button>
              </div>
              <h2 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
                {quote.title}
              </h2>
              <div className="mt-4 flex max-w-2xl flex-wrap items-center gap-x-3 gap-y-2">
                <span className="inline-flex shrink-0 items-center rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">
                  Step {currentStep} of {quoteSteps.length}
                </span>
                <p className="text-sm text-muted-foreground">
                  {currentStepMeta.description || quote.description}
                </p>
              </div>
            </div>

            <QuoteStepper currentStep={currentStep} onStepClick={goToStep} />

            <form
              onSubmit={submitQuote}
              className="mt-8 rounded-lg border bg-white shadow-sm"
            >
              <div className="border-b p-6">
                <div className="flex items-start gap-4">
                  <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
                    <CurrentStepIcon className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold">
                      {submittedRequestId
                        ? "Quote Request Submitted"
                        : currentStepMeta.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {submittedRequestId
                        ? "Our team will review your request and follow up with a custom quote."
                        : currentStepMeta.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {submittedRequestId ? (
                  <QuoteSuccess
                    requestId={submittedRequestId}
                    footer={footer}
                    onReset={() => {
                      setSubmittedRequestId(null);
                      setCurrentStep(1);
                      setFormState(initialFormState);
                      setFloorPlan(null);
                    }}
                  />
                ) : (
                  <>
                    {error ? (
                      <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                        {error}
                      </div>
                    ) : null}

                    {currentStep === 1 ? (
                      <ContactStep
                        value={formState.contact}
                        onChange={(field, value) =>
                          updateSection("contact", field, value)
                        }
                      />
                    ) : null}

                    {currentStep === 2 ? (
                      <PropertyStep
                        value={formState.property}
                        onChange={(field, value) =>
                          updateSection("property", field, value)
                        }
                      />
                    ) : null}

                    {currentStep === 3 ? (
                      <CleaningNeedsStep
                        value={formState.cleaningNeeds}
                        selectedServices={selectedServices}
                        onChange={(field, value) =>
                          updateSection("cleaningNeeds", field, value)
                        }
                        onToggleService={toggleService}
                      />
                    ) : null}

                    {currentStep === 4 ? (
                      <AdditionalInfoStep
                        value={formState.additionalInfo}
                        floorPlan={floorPlan}
                        onFileChange={onFileChange}
                        onChange={(field, value) =>
                          updateSection("additionalInfo", field, value)
                        }
                      />
                    ) : null}

                    {currentStep === 5 ? (
                      <ReviewStep
                        formState={formState}
                        selectedServices={selectedServices}
                        floorPlan={floorPlan}
                        onEdit={goToStep}
                      />
                    ) : null}
                  </>
                )}
              </div>

              {!submittedRequestId ? (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t p-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(event) => {
                      event.preventDefault();
                      previousStep();
                    }}
                    disabled={currentStep === 1 || isSubmitting}
                  >
                    <ArrowLeft data-icon="inline-start" />
                    Previous Step
                  </Button>
                  {currentStep < quoteSteps.length ? (
                    <Button
                      key="next-step"
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        nextStep();
                      }}
                      className="bg-ink text-white hover:bg-ink/90"
                    >
                      Next Step
                      <ArrowRight data-icon="inline-end" />
                    </Button>
                  ) : (
                    <Button
                      key="submit-quote"
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gold text-ink hover:bg-gold/90"
                    >
                      {isSubmitting
                        ? "Submitting..."
                        : quote.cta.label || "Submit Quote Request"}
                      <ArrowRight data-icon="inline-end" />
                    </Button>
                  )}
                </div>
              ) : null}
            </form>
          </div>

          <aside className="flex flex-col gap-4 lg:pt-[168px]">
            {currentStep === quoteSteps.length ? (
              <QuoteSummaryCard
                formState={formState}
                selectedServices={selectedServices}
              />
            ) : currentStep > 1 ? (
              <QuoteProgressCard
                currentStep={currentStep}
                progress={progress}
                selectedServices={selectedServices}
              />
            ) : null}
            {currentStep === 3 ? <HowItWorksCard /> : null}
            <WhyChooseCard />
            {currentStep === 3 ? <NeedHelpCard footer={footer} /> : null}
          </aside>
        </div>

        <QuoteBottomStrip />
        <QuoteCallout footer={footer} />
      </div>
    </section>
  );
}

function QuoteCallToAction({
  quote,
  onRequestQuote,
}: {
  quote: QuoteContent;
  onRequestQuote: () => void;
}) {
  return (
    <div className="bg-gold-gradient">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-14 sm:px-8 md:flex-row md:justify-between md:gap-12">
        <div className="flex flex-1 items-center gap-7">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-gold shadow-[0_14px_34px_-14px_rgba(0,0,0,0.55)]">
            <Phone className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold uppercase leading-none tracking-tight text-ink sm:text-3xl">
              {quote.title}
            </h2>
            <p className="mt-2.5 text-sm leading-snug text-ink/80">
              {quote.description}
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={onRequestQuote}
          className="h-12 shrink-0 bg-ink px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-ink/90"
        >
          {quote.cta.label || "Request a Quote"}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}

function QuoteStepper({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <ol className="grid gap-3 sm:grid-cols-5">
      {quoteSteps.map((step) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onStepClick(step.id)}
              aria-current={isActive ? "step" : undefined}
              className="group flex w-full items-center gap-3 rounded-lg border bg-white p-3 text-left transition hover:border-gold/50"
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full border text-sm font-bold",
                  isCompleted || isActive
                    ? "border-gold bg-gold text-ink"
                    : "border-border bg-secondary text-muted-foreground",
                )}
              >
                {isCompleted ? <Check className="size-4" /> : step.id}
              </span>
              <span className="min-w-0 text-xs font-bold">{step.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function ContactStep({
  value,
  onChange,
}: {
  value: ContactInfo;
  onChange: (field: keyof ContactInfo, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <TwoColumn>
        <TextField
          label="Full Name"
          required
          value={value.fullName}
          placeholder="John Doe"
          onChange={(nextValue) => onChange("fullName", nextValue)}
        />
        <TextField
          label="Email Address"
          type="email"
          required
          value={value.email}
          placeholder="john.doe@company.com"
          onChange={(nextValue) => onChange("email", nextValue)}
        />
      </TwoColumn>
      <TwoColumn>
        <TextField
          label="Phone Number"
          type="tel"
          required
          value={value.phone}
          placeholder="(513) 555-1234"
          onChange={(nextValue) => onChange("phone", nextValue)}
        />
        <TextField
          label="Company Name"
          value={value.companyName}
          placeholder="Your Company"
          onChange={(nextValue) => onChange("companyName", nextValue)}
        />
      </TwoColumn>
      <TwoColumn>
        <TextField
          label="Job Title"
          value={value.jobTitle}
          placeholder="Property Manager"
          onChange={(nextValue) => onChange("jobTitle", nextValue)}
        />
        <SelectField
          label="How did you hear about us?"
          value={value.referralSource}
          placeholder="Select an option"
          options={referralSources}
          onChange={(nextValue) => onChange("referralSource", nextValue)}
        />
      </TwoColumn>
      <SecurityNote />
    </div>
  );
}

function PropertyStep({
  value,
  onChange,
}: {
  value: PropertyInfo;
  onChange: (field: keyof PropertyInfo, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <TwoColumn>
        <TextField
          label="Property or Building Name"
          required
          value={value.propertyName}
          placeholder="Example Office Building"
          onChange={(nextValue) => onChange("propertyName", nextValue)}
        />
        <SelectField
          label="Property Type"
          required
          value={value.propertyType}
          placeholder="Select property type"
          options={propertyTypes}
          onChange={(nextValue) => onChange("propertyType", nextValue)}
        />
      </TwoColumn>
      <TextField
        label="Street Address"
        required
        value={value.streetAddress}
        placeholder="1234 Main Street, Suite 200"
        onChange={(nextValue) => onChange("streetAddress", nextValue)}
      />
      <div className="grid gap-x-4 gap-y-6 md:grid-cols-[1fr_140px_160px]">
        <TextField
          label="City"
          required
          value={value.city}
          placeholder="Columbus"
          onChange={(nextValue) => onChange("city", nextValue)}
        />
        <TextField
          label="State"
          required
          value={value.state}
          placeholder="OH"
          onChange={(nextValue) => onChange("state", nextValue)}
        />
        <TextField
          label="ZIP Code"
          required
          value={value.zipCode}
          placeholder="43215"
          onChange={(nextValue) => onChange("zipCode", nextValue)}
        />
      </div>
      <TwoColumn>
        <SelectField
          label="Building Size (Approx.)"
          required
          value={value.buildingSize}
          placeholder="Select size range"
          options={buildingSizes}
          onChange={(nextValue) => onChange("buildingSize", nextValue)}
        />
        <TextField
          label="Number of Floors"
          value={value.floors}
          placeholder="e.g., 5"
          onChange={(nextValue) => onChange("floors", nextValue)}
        />
      </TwoColumn>
      <TwoColumn>
        <TextField
          label="Primary Contact On Site"
          value={value.onSiteContact}
          placeholder="Name of on-site contact"
          onChange={(nextValue) => onChange("onSiteContact", nextValue)}
        />
        <TextField
          label="On-Site Contact Phone"
          type="tel"
          value={value.onSitePhone}
          placeholder="(513) 555-1234"
          onChange={(nextValue) => onChange("onSitePhone", nextValue)}
        />
      </TwoColumn>
      <TwoColumn>
        <SelectField
          label="Best Time to Contact You"
          value={value.bestContactTime}
          placeholder="Select best time"
          options={contactTimes}
          onChange={(nextValue) => onChange("bestContactTime", nextValue)}
        />
        <TextField
          label="Preferred Start Date"
          type="date"
          value={value.preferredStartDate}
          onChange={(nextValue) => onChange("preferredStartDate", nextValue)}
        />
      </TwoColumn>
      <TextareaField
        label="Additional Notes"
        value={value.notes}
        placeholder="Any additional information about the property that would help us?"
        onChange={(nextValue) => onChange("notes", nextValue)}
      />
    </div>
  );
}

function CleaningNeedsStep({
  value,
  selectedServices,
  onChange,
  onToggleService,
}: {
  value: CleaningNeeds;
  selectedServices: ServiceWorkflow[];
  onChange: (field: keyof CleaningNeeds, value: string) => void;
  onToggleService: (serviceId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {serviceWorkflows.map((service) => {
          const isSelected = value.selectedServiceIds.includes(service.id);
          const Icon = service.icon;

          return (
            <article
              key={service.id}
              className={cn(
                "rounded-lg border bg-white p-4 transition",
                isSelected
                  ? "border-gold shadow-[0_18px_44px_-32px_var(--gold)]"
                  : "hover:border-gold/50",
              )}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4">
                  <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-bold">
                      {service.title}
                    </h4>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => onToggleService(service.id)}
                  className={isSelected ? "bg-ink text-white" : undefined}
                >
                  {isSelected ? "Selected" : "Select Service"}
                  {isSelected ? (
                    <Check data-icon="inline-end" />
                  ) : (
                    <ArrowRight data-icon="inline-end" />
                  )}
                </Button>
              </div>
              <div className="mt-4 border-t pt-4">
                <div className="mb-3 text-xs font-bold tracking-wider text-gold">
                  WORKFLOW
                </div>
                <div className="flex flex-wrap items-center gap-y-3">
                  {service.steps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={step.label} className="flex items-center">
                        <div className="flex items-center gap-2">
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-gold">
                            <StepIcon className="size-4" />
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">
                            {step.label}
                          </span>
                        </div>
                        {index < service.steps.length - 1 ? (
                          <ArrowRight className="mx-2 size-4 shrink-0 text-gold/40" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {selectedServices.length > 0 ? (
        <div className="rounded-lg border bg-secondary/60 p-4">
          <div className="font-display text-lg font-bold">
            Selected workflow outcome
          </div>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            {selectedServices.map((service) => (
              <li key={service.id} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" />
                <span>
                  <strong className="text-ink">{service.title}:</strong>{" "}
                  {service.outcome}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <TwoColumn>
        <SelectField
          label="Service Frequency"
          required
          value={value.frequency}
          options={frequencies}
          optionValue={(option) => option.value}
          optionLabel={(option) => option.label}
          onChange={(nextValue) => onChange("frequency", nextValue)}
        />
        <SelectField
          label="Timeline"
          required
          value={value.urgency}
          options={urgencyOptions}
          optionValue={(option) => option.value}
          optionLabel={(option) => option.label}
          onChange={(nextValue) => onChange("urgency", nextValue)}
        />
      </TwoColumn>

      <div>
        <Label>Supplies & Consumables</Label>
        <RadioGroup
          value={value.suppliesProvided}
          onValueChange={(nextValue) => onChange("suppliesProvided", nextValue)}
          className="mt-3 grid gap-3 md:grid-cols-3"
        >
          {[
            { value: "included", label: "Northline provides supplies" },
            { value: "client-provided", label: "Client provides supplies" },
            { value: "not-sure", label: "Not sure yet" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 text-sm"
            >
              <RadioGroupItem value={option.value} />
              {option.label}
            </label>
          ))}
        </RadioGroup>
      </div>

      <TextareaField
        label="Special Instructions"
        value={value.serviceNotes}
        placeholder="Tell us about priorities, problem areas, access constraints, or cleaning standards."
        onChange={(nextValue) => onChange("serviceNotes", nextValue)}
      />
    </div>
  );
}

function AdditionalInfoStep({
  value,
  floorPlan,
  onFileChange,
  onChange,
}: {
  value: AdditionalInfo;
  floorPlan: File | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onChange: (field: keyof AdditionalInfo, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-3 text-sm font-semibold">Building Access</div>
        <TwoColumn>
          <TextField
            label="Start Time"
            type="time"
            value={value.accessStart}
            onChange={(nextValue) => onChange("accessStart", nextValue)}
          />
          <TextField
            label="End Time"
            type="time"
            value={value.accessEnd}
            onChange={(nextValue) => onChange("accessEnd", nextValue)}
          />
        </TwoColumn>
      </div>

      <TwoColumn>
        <div>
          <Label>Key / Access Provided By</Label>
          <RadioGroup
            value={value.accessProvider}
            onValueChange={(nextValue) => onChange("accessProvider", nextValue)}
            className="mt-3"
          >
            {accessProviders.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 text-sm"
              >
                <RadioGroupItem value={option.value} />
                {option.label}
              </label>
            ))}
          </RadioGroup>
          {value.accessProvider === "other" ? (
            <Input
              className="mt-3"
              value={value.accessOther}
              placeholder="Please specify"
              onChange={(event) => onChange("accessOther", event.target.value)}
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-4">
          <YesNoToggle
            label="Elevator Access"
            value={value.elevatorAccess}
            onChange={(nextValue) => onChange("elevatorAccess", nextValue)}
          />
          <YesNoToggle
            label="Loading Dock"
            value={value.loadingDock}
            onChange={(nextValue) => onChange("loadingDock", nextValue)}
          />
        </div>
      </TwoColumn>

      <div>
        <div className="mb-3 text-sm font-semibold">Facility Details</div>
        <div className="grid gap-x-4 gap-y-6 md:grid-cols-3">
          <TextField
            label="Restrooms"
            value={value.restrooms}
            placeholder="Approx. number"
            onChange={(nextValue) => onChange("restrooms", nextValue)}
          />
          <TextField
            label="Break Rooms / Kitchens"
            value={value.breakRooms}
            placeholder="Approx. number"
            onChange={(nextValue) => onChange("breakRooms", nextValue)}
          />
          <TextField
            label="Private Offices"
            value={value.privateOffices}
            placeholder="Approx. number"
            onChange={(nextValue) => onChange("privateOffices", nextValue)}
          />
        </div>
      </div>

      <TextareaField
        label="Special Considerations"
        value={value.specialConsiderations}
        placeholder="High-traffic areas, sensitive equipment, clean rooms, restricted areas, etc."
        onChange={(nextValue) => onChange("specialConsiderations", nextValue)}
      />

      <TwoColumn>
        <YesNoToggle
          label="After-Hours Service"
          value={value.afterHours}
          onChange={(nextValue) => onChange("afterHours", nextValue)}
        />
        <YesNoToggle
          label="Weekend Service"
          value={value.weekendService}
          onChange={(nextValue) => onChange("weekendService", nextValue)}
        />
      </TwoColumn>

      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <div>
          <Label htmlFor="floor-plan">Upload Floor Plan (Optional)</Label>
          <label
            htmlFor="floor-plan"
            className="mt-2 grid min-h-28 cursor-pointer place-items-center rounded-lg border border-dashed bg-white p-5 text-center text-sm text-muted-foreground transition hover:border-gold"
          >
            <Upload className="mb-2 size-6 text-gold" />
            <span className="font-medium text-ink">
              {floorPlan ? floorPlan.name : "Drag & drop your file here"}
            </span>
            <span>PDF, JPG, PNG, or WEBP. Max 10MB.</span>
            <Input
              id="floor-plan"
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={onFileChange}
            />
          </label>
        </div>
        <div className="rounded-lg border bg-secondary p-4">
          <HelpCircle className="size-6 text-gold" />
          <div className="mt-3 font-semibold">Why a floor plan helps</div>
          <p className="mt-1 text-sm text-muted-foreground">
            A floor plan helps us estimate access, room counts, and service
            zones more accurately.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({
  formState,
  selectedServices,
  floorPlan,
  onEdit,
}: {
  formState: QuoteFormState;
  selectedServices: ServiceWorkflow[];
  floorPlan: File | null;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <ReviewSection
        title="Your Information"
        icon={User}
        onEdit={() => onEdit(1)}
      >
        <ReviewGrid>
          <ReviewItem label="Full Name" value={formState.contact.fullName} />
          <ReviewItem label="Email" value={formState.contact.email} />
          <ReviewItem label="Phone Number" value={formState.contact.phone} />
          <ReviewItem
            label="Company Name"
            value={formState.contact.companyName}
          />
          <ReviewItem label="Job Title" value={formState.contact.jobTitle} />
          <ReviewItem
            label="Referral"
            value={formState.contact.referralSource}
          />
        </ReviewGrid>
      </ReviewSection>

      <ReviewSection
        title="Property Details"
        icon={Building2}
        onEdit={() => onEdit(2)}
      >
        <ReviewGrid>
          <ReviewItem
            label="Property Name"
            value={formState.property.propertyName}
          />
          <ReviewItem
            label="Property Type"
            value={formState.property.propertyType}
          />
          <ReviewItem
            label="Address"
            value={`${formState.property.streetAddress}, ${formState.property.city}, ${formState.property.state} ${formState.property.zipCode}`}
          />
          <ReviewItem
            label="Building Size"
            value={formState.property.buildingSize}
          />
          <ReviewItem label="Floors" value={formState.property.floors} />
          <ReviewItem
            label="On-Site Contact"
            value={formatContact(
              formState.property.onSiteContact,
              formState.property.onSitePhone,
            )}
          />
        </ReviewGrid>
      </ReviewSection>

      <ReviewSection
        title="Cleaning Needs"
        icon={SprayCan}
        onEdit={() => onEdit(3)}
      >
        <ReviewGrid>
          <ReviewItem
            label="Selected Services"
            value={selectedServices.map((service) => service.title).join(", ")}
          />
          <ReviewItem
            label="Frequency"
            value={labelForValue(
              frequencies,
              formState.cleaningNeeds.frequency,
            )}
          />
          <ReviewItem
            label="Supplies"
            value={formatValue(formState.cleaningNeeds.suppliesProvided)}
          />
          <ReviewItem
            label="Timeline"
            value={labelForValue(
              urgencyOptions,
              formState.cleaningNeeds.urgency,
            )}
          />
          <ReviewItem
            label="Special Instructions"
            value={formState.cleaningNeeds.serviceNotes}
          />
        </ReviewGrid>
      </ReviewSection>

      <ReviewSection
        title="Additional Information"
        icon={ClipboardList}
        onEdit={() => onEdit(4)}
      >
        <ReviewGrid>
          <ReviewItem
            label="Building Access"
            value={formatTimeRange(
              formState.additionalInfo.accessStart,
              formState.additionalInfo.accessEnd,
            )}
          />
          <ReviewItem
            label="Access Provided By"
            value={formatValue(formState.additionalInfo.accessProvider)}
          />
          <ReviewItem
            label="Elevator Access"
            value={formatValue(formState.additionalInfo.elevatorAccess)}
          />
          <ReviewItem
            label="Loading Dock"
            value={formatValue(formState.additionalInfo.loadingDock)}
          />
          <ReviewItem
            label="Room Counts"
            value={[
              formState.additionalInfo.restrooms
                ? `${formState.additionalInfo.restrooms} restrooms`
                : "",
              formState.additionalInfo.breakRooms
                ? `${formState.additionalInfo.breakRooms} break rooms`
                : "",
              formState.additionalInfo.privateOffices
                ? `${formState.additionalInfo.privateOffices} offices`
                : "",
            ]
              .filter(Boolean)
              .join(", ")}
          />
          <ReviewItem
            label="Floor Plan"
            value={floorPlan ? floorPlan.name : "Not uploaded"}
          />
        </ReviewGrid>
      </ReviewSection>

      <SecurityNote />
    </div>
  );
}

function QuoteProgressCard({
  currentStep,
  progress,
  selectedServices,
}: {
  currentStep: number;
  progress: number;
  selectedServices: ServiceWorkflow[];
}) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-lg bg-gold/15 text-gold">
          <ClipboardCheck className="size-5" />
        </div>
        <div>
          <div className="font-display text-lg font-bold">
            Your Quote Progress
          </div>
          <div className="text-sm text-muted-foreground">
            {currentStep} of {quoteSteps.length} completed
          </div>
        </div>
      </div>
      <Progress value={progress} className="mt-4 bg-secondary" />
      <div className="mt-5 flex flex-col gap-3">
        {quoteSteps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-3 rounded-lg p-3 text-sm",
                isActive && "bg-secondary",
              )}
            >
              <div
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                  isCompleted
                    ? "bg-gold text-ink"
                    : isActive
                      ? "bg-ink text-white"
                      : "bg-secondary text-muted-foreground",
                )}
              >
                {isCompleted ? <Check className="size-4" /> : step.id}
              </div>
              <div>
                <div className="font-semibold">{step.label}</div>
                <div className="text-xs text-muted-foreground">
                  {isCompleted
                    ? "Completed"
                    : isActive
                      ? "In progress"
                      : "Upcoming"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {selectedServices.length > 0 ? (
        <div className="mt-5 rounded-lg bg-secondary p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-gold">
            Selected
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedServices.map((service) => (
              <span
                key={service.id}
                className="rounded-md bg-white px-2 py-1 text-xs font-medium"
              >
                {service.title}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function WhyChooseCard() {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="font-display text-lg font-bold">
        Why Choose Northline?
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {whyChooseItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                <Icon className="size-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">{item.title}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NeedHelpCard({ footer }: { footer: FooterContent }) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <div className="font-semibold">Need help?</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Our team can help you choose the right service for your needs.
          </p>
          <a
            href={`tel:${footer.phone}`}
            className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-gold"
          >
            <Phone className="size-4" />
            {footer.phone}
          </a>
        </div>
      </div>
    </div>
  );
}

function HowItWorksCard() {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
          <Sparkles className="size-5" />
        </div>
        <div className="font-display text-lg font-bold">How It Works</div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Select a service to see how the work flows. Each service follows a
        proven process, so you know exactly what to expect — and we can build
        the most accurate quote for your needs.
      </p>
    </div>
  );
}

function QuoteSummaryCard({
  formState,
  selectedServices,
}: {
  formState: QuoteFormState;
  selectedServices: ServiceWorkflow[];
}) {
  const rows = [
    { label: "Property Type", value: formState.property.propertyType },
    { label: "Building Size", value: formState.property.buildingSize },
    {
      label: "Frequency",
      value: labelForValue(frequencies, formState.cleaningNeeds.frequency),
    },
    { label: "Services Selected", value: String(selectedServices.length) },
    {
      label: "Supplies",
      value: formatValue(formState.cleaningNeeds.suppliesProvided),
    },
    {
      label: "After-Hours Service",
      value: formatValue(formState.additionalInfo.afterHours),
    },
  ];

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
          <ClipboardCheck className="size-5" />
        </div>
        <div>
          <div className="font-display text-lg font-bold">Quote Summary</div>
          <div className="text-sm text-muted-foreground">
            A summary of what you&apos;ve requested.
          </div>
        </div>
      </div>
      <dl className="mt-4 flex flex-col gap-2.5 text-sm">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 border-b pb-2.5 last:border-0 last:pb-0"
          >
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="text-right font-semibold text-ink">
              {row.value || "—"}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="size-4 shrink-0 text-gold" />
        You&apos;ll receive your customized quote within 1 business day.
      </div>
    </div>
  );
}

function QuoteBottomStrip() {
  const metrics = [
    {
      icon: Clock,
      title: "Quick Response",
      description: "Usually within 24 hours",
    },
    {
      icon: FileText,
      title: "Customized Quote",
      description: "Tailored to your specific needs",
    },
    {
      icon: ThumbsUp,
      title: "No Obligation",
      description: "Free quote with no commitment",
    },
  ];

  return (
    <div className="mt-8 grid gap-6 rounded-lg border bg-white p-5 lg:grid-cols-[1.1fr_2fr] lg:items-center lg:gap-8">
      <div className="flex gap-4 lg:border-r lg:pr-8">
        <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
          <ClipboardCheck className="size-5" />
        </div>
        <div>
          <div className="font-display text-lg font-bold">
            What Happens Next?
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Once you complete all {quoteSteps.length} steps, our team reviews
            your details and sends a customized quote within 1 business day.
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex gap-3">
              <Icon className="size-7 shrink-0 text-gold" />
              <div>
                <div className="text-sm font-bold">{item.title}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuoteCallout({ footer }: { footer: FooterContent }) {
  return (
    <div className="mt-8 flex flex-col gap-4 rounded-lg bg-ink-gradient p-6 text-white md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-gold text-ink">
          <Phone className="size-5" />
        </div>
        <div>
          <div className="font-display text-xl font-bold">
            Prefer to speak with our team?
          </div>
          <p className="mt-1 text-sm text-white/70">
            Call us today to discuss your cleaning needs.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="border-white/30 text-white"
          asChild
        >
          <a href={`tel:${footer.phone}`}>
            <Phone data-icon="inline-start" />
            Call {footer.phone}
          </a>
        </Button>
        <Button className="bg-gold text-ink hover:bg-gold/90" asChild>
          <a href={`mailto:${footer.email}`}>
            <Mail data-icon="inline-start" />
            Email Us
          </a>
        </Button>
      </div>
    </div>
  );
}

function QuoteSuccess({
  requestId,
  footer,
  onReset,
}: {
  requestId: string;
  footer: FooterContent;
  onReset: () => void;
}) {
  return (
    <div className="rounded-lg border bg-secondary p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-start">
        <div className="grid size-14 shrink-0 place-items-center rounded-full bg-gold text-ink">
          <CheckCircle2 className="size-7" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-display text-2xl font-bold">
            Your quote request is in.
          </h4>
          <p className="mt-2 text-sm text-muted-foreground">
            Reference ID:{" "}
            <span className="font-mono text-ink">{requestId}</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Northline will review your details and follow up with a custom
            quote. You can also contact us directly at {footer.phone}.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="button" onClick={onReset}>
              Submit Another Request
            </Button>
            <Button type="button" variant="outline" asChild>
              <a href={`tel:${footer.phone}`}>
                <Phone data-icon="inline-start" />
                Call {footer.phone}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TwoColumn({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-x-4 gap-y-6 md:grid-cols-2">{children}</div>;
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const id = labelToId(label);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = labelToId(label);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        rows={4}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function SelectField<
  TOption extends string | { value: string; label: string },
>({
  label,
  value,
  options,
  onChange,
  placeholder,
  required,
  optionValue,
  optionLabel,
}: {
  label: string;
  value: string;
  options: TOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  optionValue?: (option: TOption) => string;
  optionLabel?: (option: TOption) => string;
}) {
  const getValue =
    optionValue ??
    ((option: TOption) => (typeof option === "string" ? option : option.value));
  const getLabel =
    optionLabel ??
    ((option: TOption) => (typeof option === "string" ? option : option.label));

  return (
    <div className="flex flex-col gap-2">
      <Label>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={getValue(option)} value={getValue(option)}>
                {getLabel(option)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function YesNoToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "not-sure", label: "Not sure" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-medium transition",
              value === option.value
                ? "border-gold bg-gold/15 text-ink"
                : "bg-white text-muted-foreground hover:border-gold/50",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  icon: Icon,
  children,
  onEdit,
}: {
  title: string;
  icon: typeof User;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <section className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-gold/15 text-gold">
            <Icon className="size-4" />
          </div>
          <h4 className="font-display text-lg font-bold">{title}</h4>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ReviewGrid({ children }: { children: React.ReactNode }) {
  return <dl className="grid gap-4 text-sm md:grid-cols-2">{children}</dl>;
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 break-words text-ink">{value || "Not provided"}</dd>
    </div>
  );
}

function SecurityNote() {
  return (
    <div className="flex gap-3 rounded-lg border bg-secondary p-4 text-sm">
      <ShieldCheck className="size-5 shrink-0 text-gold" />
      <div>
        <div className="font-semibold">Your information is safe with us.</div>
        <p className="mt-1 text-muted-foreground">
          We respect your privacy and will never share your information.
        </p>
      </div>
    </div>
  );
}

function validateStep(step: number, formState: QuoteFormState) {
  if (step === 1) {
    if (!formState.contact.fullName.trim()) return "Full name is required.";
    if (!formState.contact.email.trim()) return "Email address is required.";
    if (!formState.contact.phone.trim()) return "Phone number is required.";
  }

  if (step === 2) {
    if (!formState.property.propertyName.trim()) {
      return "Property or building name is required.";
    }
    if (!formState.property.propertyType.trim()) {
      return "Property type is required.";
    }
    if (!formState.property.streetAddress.trim()) {
      return "Street address is required.";
    }
    if (!formState.property.city.trim()) return "City is required.";
    if (!formState.property.state.trim()) return "State is required.";
    if (!formState.property.zipCode.trim()) return "ZIP code is required.";
    if (!formState.property.buildingSize.trim()) {
      return "Building size is required.";
    }
  }

  if (step === 3) {
    if (formState.cleaningNeeds.selectedServiceIds.length === 0) {
      return "Select at least one cleaning service.";
    }
  }

  return null;
}

function calculateEstimate(formState: QuoteFormState) {
  const sizeBase =
    {
      "Under 5,000 sq ft": 850,
      "5,000 - 10,000 sq ft": 1400,
      "10,000 - 25,000 sq ft": 2400,
      "25,000 - 50,000 sq ft": 3800,
      "50,000+ sq ft": 5600,
    }[formState.property.buildingSize] ?? 1200;
  const serviceCount = Math.max(
    formState.cleaningNeeds.selectedServiceIds.length,
    1,
  );
  const frequencyMultiplier =
    {
      "one-time": 1,
      daily: 1.55,
      weekly: 1.15,
      "bi-weekly": 1,
      monthly: 0.85,
      "as-needed": 0.75,
    }[formState.cleaningNeeds.frequency] ?? 1;
  const serviceMultiplier = 1 + (serviceCount - 1) * 0.18;
  const min =
    Math.round((sizeBase * frequencyMultiplier * serviceMultiplier) / 50) * 50;
  const max = Math.round((min * 1.25) / 50) * 50;

  return { min, max };
}

function labelForValue(
  options: Array<{ value: string; label: string }>,
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function formatValue(value: string) {
  if (!value) return "";
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatTimeRange(start: string, end: string) {
  if (!start && !end) return "";
  return [start, end].filter(Boolean).join(" - ");
}

function formatContact(name: string, phone: string) {
  return [name, phone].filter(Boolean).join(" / ");
}

function labelToId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
