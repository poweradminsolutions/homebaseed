'use client';

import { useState } from 'react';
import { states, StateInfo, regulationLabels, getStateBySlug } from '@/data/states';
import Link from 'next/link';

type AgeRange = 'prek' | 'elementary' | 'middle' | 'high';
type Priority = 'religious' | 'classical' | 'stem' | 'arts' | 'nature' | 'special-needs' | 'college' | 'flexible' | 'budget' | 'dual';
type ExperienceLevel = 'new' | 'switching' | 'experienced' | 'exploring';

interface WizardData {
  state: StateInfo | null;
  childCount: number;
  ageRanges: AgeRange[];
  priorities: Priority[];
  experienceLevel: ExperienceLevel | null;
}

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'religious', label: 'Religious/Faith-Based' },
  { value: 'classical', label: 'Classical Education' },
  { value: 'stem', label: 'STEM Focus' },
  { value: 'arts', label: 'Arts & Creativity' },
  { value: 'nature', label: 'Nature-Based/Outdoor' },
  { value: 'special-needs', label: 'Special Needs Accommodations' },
  { value: 'college', label: 'College Prep' },
  { value: 'flexible', label: 'Flexible Schedule' },
  { value: 'budget', label: 'Budget-Friendly' },
  { value: 'dual', label: 'Dual Enrollment' },
];

const ageRangeOptions: { value: AgeRange; label: string }[] = [
  { value: 'prek', label: 'Pre-K (3-5)' },
  { value: 'elementary', label: 'Elementary (6-10)' },
  { value: 'middle', label: 'Middle School (11-13)' },
  { value: 'high', label: 'High School (14-18)' },
];

const experienceLevelOptions: { value: ExperienceLevel; label: string; description: string }[] = [
  { value: 'new', label: 'Brand New', description: 'Never homeschooled before' },
  { value: 'switching', label: 'Switching', description: 'From public/private school' },
  { value: 'experienced', label: 'Experienced', description: 'Already homeschooling' },
  { value: 'exploring', label: 'Exploring', description: 'Just researching options' },
];

function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-foreground">
          Step {currentStep} of {totalSteps}
        </h2>
        <div className="text-sm text-muted">{Math.round(progress)}% complete</div>
      </div>
      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function Step1StateSelection({ data, onUpdate }: { data: WizardData; onUpdate: (data: WizardData) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Where are you located?</h2>
        <p className="text-lg text-muted">
          We'll provide information specific to your state's homeschooling regulations and resources.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">Select Your State</label>
        <select
          value={data.state?.abbreviation || ''}
          onChange={(e) => {
            const selectedState = states.find((s) => s.abbreviation === e.target.value);
            onUpdate({ ...data, state: selectedState || null });
          }}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
        >
          <option value="">Choose a state...</option>
          {states.map((state) => (
            <option key={state.abbreviation} value={state.abbreviation}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      {data.state && (
        <div className="bg-primary-light border border-primary rounded-lg p-4">
          <p className="text-sm text-primary-dark">
            Selected: <strong>{data.state.name}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

function Step2Children({ data, onUpdate }: { data: WizardData; onUpdate: (data: WizardData) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Tell us about your children</h2>
        <p className="text-lg text-muted">
          This helps us recommend resources and curriculum that fit your needs.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          How many children will you homeschool?
        </label>
        <input
          type="number"
          min="1"
          max="12"
          value={data.childCount || ''}
          onChange={(e) => onUpdate({ ...data, childCount: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
          placeholder="Enter number of children"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground mb-3">Age Ranges (Select all that apply)</label>
        <div className="space-y-2">
          {ageRangeOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-3 border border-border rounded-lg hover:bg-primary-light transition-colors">
              <input
                type="checkbox"
                checked={data.ageRanges.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onUpdate({ ...data, ageRanges: [...data.ageRanges, option.value] });
                  } else {
                    onUpdate({
                      ...data,
                      ageRanges: data.ageRanges.filter((ar) => ar !== option.value),
                    });
                  }
                }}
                className="w-5 h-5 text-primary rounded cursor-pointer"
              />
              <span className="text-foreground font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3Priorities({ data, onUpdate }: { data: WizardData; onUpdate: (data: WizardData) => void }) {
  const remaining = 3 - data.priorities.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">What are your priorities?</h2>
        <p className="text-lg text-muted">
          Select up to 3 priorities to help us find the best resources for your family.
        </p>
      </div>

      {remaining > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Select {remaining} more</strong> priority option{remaining !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {priorityOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              if (data.priorities.includes(option.value)) {
                onUpdate({
                  ...data,
                  priorities: data.priorities.filter((p) => p !== option.value),
                });
              } else if (data.priorities.length < 3) {
                onUpdate({ ...data, priorities: [...data.priorities, option.value] });
              }
            }}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              data.priorities.includes(option.value)
                ? 'bg-primary border-primary text-white'
                : 'bg-background border-border text-foreground hover:border-primary'
            } ${data.priorities.length >= 3 && !data.priorities.includes(option.value) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={data.priorities.length >= 3 && !data.priorities.includes(option.value)}
          >
            <div className="font-medium">{option.label}</div>
          </button>
        ))}
      </div>

      {data.priorities.length > 0 && (
        <div className="bg-primary-light border border-primary rounded-lg p-4">
          <p className="text-sm text-primary-dark font-medium mb-2">Selected Priorities:</p>
          <div className="flex flex-wrap gap-2">
            {data.priorities.map((priority) => {
              const label = priorityOptions.find((o) => o.value === priority)?.label;
              return (
                <span key={priority} className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Step4ExperienceLevel({ data, onUpdate }: { data: WizardData; onUpdate: (data: WizardData) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">What's your experience level?</h2>
        <p className="text-lg text-muted">
          This helps us tailor recommendations and resources to your needs.
        </p>
      </div>

      <div className="space-y-3">
        {experienceLevelOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onUpdate({ ...data, experienceLevel: option.value })}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              data.experienceLevel === option.value
                ? 'bg-primary border-primary text-white'
                : 'bg-background border-border text-foreground hover:border-primary'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-1 flex-shrink-0">
                {data.experienceLevel === option.value ? (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth="2" />
                  </svg>
                )}
              </div>
              <div>
                <div className="font-semibold">{option.label}</div>
                <div className={`text-sm ${data.experienceLevel === option.value ? 'text-primary-light' : 'text-muted'}`}>
                  {option.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step5Results({ data }: { data: WizardData }) {
  const selectedState = data.state;
  const regulationLevel = selectedState?.regulationLevel || 'moderate';
  const regulationLabel = regulationLabels[regulationLevel];

  const regulationDescriptions = {
    none: 'Your state has no mandatory homeschooling regulations. You have tremendous freedom in how you structure your homeschool.',
    low: 'Your state has minimal homeschooling regulations. You have considerable flexibility while maintaining some basic requirements.',
    moderate: 'Your state has moderate homeschooling regulations. You\'ll need to follow some guidelines while maintaining good educational standards.',
    high: 'Your state has comprehensive homeschooling regulations. You\'ll need to follow detailed requirements including testing, curriculum approval, or teacher qualifications.',
  };

  const nextStepsGuide: { title: string; description: string; link: string; linkText: string }[] = [];

  // Add state-specific legal guide
  nextStepsGuide.push({
    title: `Read ${selectedState?.name} Legal Guide`,
    description: 'Get detailed information about your state\'s specific homeschooling laws, requirements, and regulations.',
    link: `/states/${selectedState?.slug}`,
    linkText: 'View Legal Guide',
  });

  // Add curriculum browsing
  nextStepsGuide.push({
    title: 'Browse Curriculum',
    description: 'Explore curriculum options that match your priorities and your children\'s age ranges.',
    link: '/curriculum',
    linkText: 'Browse Curriculum',
  });

  // Add community/co-ops
  nextStepsGuide.push({
    title: 'Find Local Co-ops & Communities',
    description: 'Connect with other homeschooling families in your area for support, resources, and enrichment activities.',
    link: '/community',
    linkText: 'Find Co-ops',
  });

  // Add special needs resources if selected
  if (data.priorities.includes('special-needs')) {
    nextStepsGuide.push({
      title: 'Special Needs Resources',
      description: 'Access specialized resources and guides for homeschooling children with special needs.',
      link: '/special-needs',
      linkText: 'View Resources',
    });
  }

  // Add college prep if selected
  if (data.priorities.includes('college')) {
    nextStepsGuide.push({
      title: 'College Prep Planning',
      description: 'Learn about transcript requirements, dual enrollment, and preparing for college admission.',
      link: '/college-prep',
      linkText: 'College Prep Guide',
    });
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-block bg-primary rounded-full p-4 mb-4">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">You're all set!</h2>
        <p className="text-lg text-muted">
          Here's your personalized homeschooling roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Card 1: State & Regulations */}
        <div className="border border-border rounded-lg p-6 bg-background">
          <h3 className="text-lg font-semibold text-foreground mb-3">Your State</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted mb-1">State</p>
              <p className="text-xl font-bold text-primary">{selectedState?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-2">Regulation Level</p>
              <div className="inline-block">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  regulationLevel === 'low' ? 'bg-green-50 text-green-700' :
                  regulationLevel === 'moderate' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {regulationLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card 2: Family Profile */}
        <div className="border border-border rounded-lg p-6 bg-background">
          <h3 className="text-lg font-semibold text-foreground mb-3">Your Family Profile</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted mb-1">Children</p>
              <p className="text-xl font-bold text-primary">{data.childCount} child{data.childCount !== 1 ? 'ren' : ''}</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-2">Age Ranges</p>
              <p className="text-foreground">
                {ageRangeOptions
                  .filter((ar) => data.ageRanges.includes(ar.value))
                  .map((ar) => ar.label)
                  .join(', ') || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Regulation Summary */}
      <div className="bg-primary-light border border-primary rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">Homeschooling in {selectedState?.name}</h3>
        <p className="text-foreground mb-4">{regulationDescriptions[regulationLevel as keyof typeof regulationDescriptions]}</p>
        <Link
          href={`/states/${selectedState?.slug}`}
          className="inline-block text-primary font-semibold hover:text-primary-dark transition-colors"
        >
          Learn more about {selectedState?.name} regulations →
        </Link>
      </div>

      {/* Priorities Summary */}
      {data.priorities.length > 0 && (
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Your Selected Priorities</h3>
          <div className="flex flex-wrap gap-2">
            {data.priorities.map((priority) => {
              const label = priorityOptions.find((o) => o.value === priority)?.label;
              return (
                <span key={priority} className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div>
        <h3 className="text-2xl font-semibold text-foreground mb-4">Recommended Next Steps</h3>
        <div className="space-y-4">
          {nextStepsGuide.map((step, index) => (
            <div key={index} className="border border-border rounded-lg p-6 bg-background hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">{step.title}</h4>
                  <p className="text-muted">{step.description}</p>
                </div>
                <Link
                  href={step.link}
                  className="whitespace-nowrap px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  {step.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restart Button */}
      <div className="text-center pt-4">
        <p className="text-sm text-muted mb-4">Want to start over or explore different options?</p>
      </div>
    </div>
  );
}

export default function GetStartedWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    state: null,
    childCount: 0,
    ageRanges: [],
    priorities: [],
    experienceLevel: null,
  });

  const totalSteps = 5;

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return data.state !== null;
      case 2:
        return data.childCount > 0 && data.ageRanges.length > 0;
      case 3:
        return data.priorities.length > 0;
      case 4:
        return data.experienceLevel !== null;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setData({
      state: null,
      childCount: 0,
      ageRanges: [],
      priorities: [],
      experienceLevel: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Getting Started with Homeschooling</h1>
          <p className="text-lg text-muted">
            Let's find the right resources and information for your homeschool journey.
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        {/* Step Content */}
        <div className="bg-white border border-border rounded-lg p-8 mb-8 shadow-sm">
          {currentStep === 1 && <Step1StateSelection data={data} onUpdate={setData} />}
          {currentStep === 2 && <Step2Children data={data} onUpdate={setData} />}
          {currentStep === 3 && <Step3Priorities data={data} onUpdate={setData} />}
          {currentStep === 4 && <Step4ExperienceLevel data={data} onUpdate={setData} />}
          {currentStep === 5 && <Step5Results data={data} />}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {currentStep === totalSteps ? (
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              Start Over
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Validation Message */}
        {!canProceed() && currentStep < totalSteps && (
          <div className="mt-4 text-center text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            Please complete this step to continue.
          </div>
        )}
      </div>
    </div>
  );
}
