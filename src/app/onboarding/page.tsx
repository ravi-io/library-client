'use client';

import React, { useRef, useState } from 'react';
import { useOnboardingForm } from '@/modules/auth/hooks/useOnboardingForm';
import { authClient } from '@/lib/auth-client';
import {
  Upload,
  Loader2,
  ShieldAlert,
  Trash2,
  LogOut,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Building2,
  GraduationCap,
  BookMarked,
  Check,
  IdCard,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// ── Static data ───────────────────────────────────────────────────────────────

const UNIVERSITIES = [
  { value: 'VTU', label: 'VTU', full: 'Visvesvaraya Technological University' },
  { value: 'BCU', label: 'BCU', full: 'Bangalore City University' },
  { value: 'other', label: 'Other', full: 'Other University' },
];

const DEPARTMENTS = [
  { value: 'cs', label: 'Computer Science', icon: '💻' },
  { value: 'commerce', label: 'Commerce', icon: '📊' },
  { value: 'science', label: 'Science', icon: '🔬' },
  { value: 'arts', label: 'Arts & Humanities', icon: '🎨' },
  { value: 'engineering', label: 'Engineering', icon: '⚙️' },
  { value: 'management', label: 'Management', icon: '📈' },
];

const COURSES_BY_DEPT: Record<string, { value: string; label: string }[]> = {
  cs: [
    { value: 'bca', label: 'BCA – Bachelor of Computer Applications' },
    { value: 'mca', label: 'MCA – Master of Computer Applications' },
    { value: 'bsc-cs', label: 'BSc Computer Science' },
    { value: 'msc-cs', label: 'MSc Computer Science' },
    { value: 'bsc-it', label: 'BSc Information Technology' },
    { value: 'msc-it', label: 'MSc Information Technology' },
  ],
  commerce: [
    { value: 'bcom', label: 'BCom – Bachelor of Commerce' },
    { value: 'mcom', label: 'MCom – Master of Commerce' },
    { value: 'bba', label: 'BBA – Bachelor of Business Administration' },
    { value: 'mba', label: 'MBA – Master of Business Administration' },
  ],
  science: [
    { value: 'bsc-physics', label: 'BSc Physics' },
    { value: 'bsc-chemistry', label: 'BSc Chemistry' },
    { value: 'bsc-maths', label: 'BSc Mathematics' },
    { value: 'msc-physics', label: 'MSc Physics' },
    { value: 'msc-maths', label: 'MSc Mathematics' },
  ],
  arts: [
    { value: 'ba', label: 'BA – Bachelor of Arts' },
    { value: 'ma', label: 'MA – Master of Arts' },
    { value: 'ba-english', label: 'BA English Literature' },
    { value: 'ba-history', label: 'BA History' },
  ],
  engineering: [
    { value: 'be-cs', label: 'BE Computer Science' },
    { value: 'be-ec', label: 'BE Electronics & Communication' },
    { value: 'be-mech', label: 'BE Mechanical' },
    { value: 'be-civil', label: 'BE Civil' },
    { value: 'mtech', label: 'MTech' },
  ],
  management: [
    { value: 'mba-fin', label: 'MBA Finance' },
    { value: 'mba-hr', label: 'MBA Human Resources' },
    { value: 'mba-mkt', label: 'MBA Marketing' },
    { value: 'pgdm', label: 'PGDM' },
  ],
};

// ── Step indicator ────────────────────────────────────────────────────────────

const STEPS = [
  { key: 'university', label: 'University', icon: Building2 },
  { key: 'department', label: 'Department', icon: GraduationCap },
  { key: 'course', label: 'Course', icon: BookMarked },
  { key: 'id-card', label: 'ID Card', icon: IdCard },
];

function StepIndicator({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, idx) => {
        const isDone = idx < currentIndex;
        const isActive = idx === currentIndex;
        const Icon = step.icon;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                  isDone
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                    : isActive
                      ? 'bg-primary/15 border-primary text-primary-light shadow-md shadow-primary/10'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <p
                className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-primary-light' : isDone ? 'text-slate-400' : 'text-slate-600'}`}
              >
                {step.label}
              </p>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-px w-8 mb-5 mx-1 transition-all duration-500 ${idx < currentIndex ? 'bg-primary' : 'bg-slate-800'}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── File drop zone ────────────────────────────────────────────────────────────

function DropZone({
  label,
  preview,
  inputRef,
  isDragActive,
  onDrag,
  onDrop,
  onChange,
  onRemove,
}: {
  label: string;
  preview: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isDragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
        {label}
      </label>
      {preview ? (
        <div className="relative border border-slate-800 rounded-2xl overflow-hidden aspect-video bg-slate-900/60 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={onRemove}
              className="rounded-full shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={onDrag}
          onDragOver={onDrag}
          onDragLeave={onDrag}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 min-h-[110px] ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-slate-800/80 bg-slate-950/20 hover:border-slate-700 hover:bg-slate-900/20'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onChange}
            className="hidden"
          />
          <Upload className="w-4 h-4 text-slate-500" />
          <div className="text-center">
            <p className="text-[11px] font-semibold text-slate-400">
              Drop here or <span className="text-primary">browse</span>
            </p>
            <p className="text-[9px] text-slate-600 mt-0.5">
              JPEG, PNG, WEBP · Max 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const [isFrontDrag, setIsFrontDrag] = useState(false);
  const [isBackDrag, setIsBackDrag] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    data,
    update,
    goNext,
    goBack,
    error,
    isLoading,
    onSubmit,
  } = useOnboardingForm();

  // Drag helpers
  const makeDragHandler =
    (setter: (v: boolean) => void) => (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setter(e.type === 'dragenter' || e.type === 'dragover');
    };

  const makeDropHandler =
    (
      setter: (v: boolean) => void,
      fileKey: 'frontFile',
      previewKey: 'frontPreview'
    ) =>
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setter(false);
      const file = e.dataTransfer.files?.[0];
      if (file?.type.startsWith('image/')) {
        update({ [fileKey]: file, [previewKey]: URL.createObjectURL(file) });
      } else {
        toast.error('Only image files are supported.');
      }
    };

  const makeDropHandlerBack =
    (
      setter: (v: boolean) => void,
      fileKey: 'backFile',
      previewKey: 'backPreview'
    ) =>
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setter(false);
      const file = e.dataTransfer.files?.[0];
      if (file?.type.startsWith('image/')) {
        update({ [fileKey]: file, [previewKey]: URL.createObjectURL(file) });
      } else {
        toast.error('Only image files are supported.');
      }
    };

  const makeFileChangeHandler =
    (
      fileKey: 'frontFile' | 'backFile',
      previewKey: 'frontPreview' | 'backPreview'
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file?.type.startsWith('image/')) {
        update({ [fileKey]: file, [previewKey]: URL.createObjectURL(file) });
      } else {
        toast.error('Only image files are supported.');
      }
    };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Signed out');
            router.push('/login');
            router.refresh();
          },
          onError: () => {
            document.cookie = 'better-auth.session_token=; Max-Age=0; path=/';
            document.cookie =
              '__secure-better-auth.session_token=; Max-Age=0; path=/';
            router.push('/login');
            router.refresh();
          },
        },
      });
    } catch {
      document.cookie = 'better-auth.session_token=; Max-Age=0; path=/';
      document.cookie =
        '__secure-better-auth.session_token=; Max-Age=0; path=/';
      router.push('/login');
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const courses = data.department
    ? (COURSES_BY_DEPT[data.department] ?? [])
    : [];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 pt-24 pb-12 overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        <Image
          src="/library_bg.png"
          alt="Library Background"
          fill
          priority
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,#020617_88%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/80" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 h-16 border-b border-slate-800/40 bg-slate-950/20 backdrop-blur-md z-20 px-6 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <BookOpen className="w-4.5 h-4.5 text-primary-light" />
          </div>
          <span className="text-sm font-bold bg-linear-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            BeaconLibrary
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          disabled={isLoggingOut}
          onClick={handleSignOut}
          className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-slate-800/40 bg-slate-900/20 hover:border-red-500/20 px-3.5 h-8 gap-1.5 cursor-pointer transition-all"
        >
          {isLoggingOut ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LogOut className="w-3.5 h-3.5" />
          )}
          <span>Log Out</span>
        </Button>
      </header>

      {/* Card */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="w-full max-w-[440px] bg-slate-950/50 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-3xl p-7">
          {/* Title */}
          <div className="text-center mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              Step {currentStepIndex + 1} of {totalSteps}
            </p>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              {currentStep === 'university' && 'Your University'}
              {currentStep === 'department' && 'Your Department'}
              {currentStep === 'course' && 'Your Course'}
              {currentStep === 'id-card' && 'Upload ID Card'}
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xs mx-auto">
              {currentStep === 'university' &&
                'Tell us which university or institution you are enrolled in.'}
              {currentStep === 'department' &&
                'Select the academic department that best matches your program.'}
              {currentStep === 'course' &&
                'Pick the exact degree or diploma you are currently pursuing.'}
              {currentStep === 'id-card' &&
                'Upload a clear photo of both sides of your student ID card.'}
            </p>
          </div>

          {/* Step indicator */}
          <StepIndicator currentIndex={currentStepIndex} />

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-3 p-3 mb-5 text-xs rounded-xl bg-red-500/10 border border-red-500/25 text-red-200">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* ── Step: University ── */}
          {currentStep === 'university' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2.5">
                {UNIVERSITIES.map((uni) => {
                  const isPreset = uni.value !== 'other';
                  const isSelected = isPreset
                    ? data.university === uni.value
                    : !UNIVERSITIES.filter((u) => u.value !== 'other').find(
                        (u) => u.value === data.university
                      ) && data.university !== '';
                  return (
                    <button
                      key={uni.value}
                      type="button"
                      onClick={() =>
                        update({ university: isPreset ? uni.value : '' })
                      }
                      className={`flex flex-col items-start px-3.5 py-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-primary/15 border-primary/60 text-white shadow-md shadow-primary/10'
                          : 'bg-slate-900/50 border-slate-800/60 text-slate-400 hover:bg-slate-800/50 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-sm font-extrabold text-white leading-none">
                        {uni.label}
                      </span>
                      <span className="text-[9px] text-slate-500 mt-0.5 leading-tight line-clamp-2">
                        {uni.full}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom input shown when "Other" tile is active (no preset matched) */}
              {!UNIVERSITIES.filter((u) => u.value !== 'other').find(
                (u) => u.value === data.university
              ) && (
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={data.university}
                    onChange={(e) => update({ university: e.target.value })}
                    placeholder="Type your university name…"
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>
              )}

              <Button
                onClick={goNext}
                disabled={!data.university.trim()}
                className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary-dark font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* ── Step: Department ── */}
          {currentStep === 'department' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2.5">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.value}
                    type="button"
                    onClick={() => {
                      update({ department: dept.value, course: '' });
                    }}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      data.department === dept.value
                        ? 'bg-primary/15 border-primary/60 text-white shadow-md shadow-primary/10'
                        : 'bg-slate-900/50 border-slate-800/60 text-slate-400 hover:bg-slate-800/50 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-base leading-none">{dept.icon}</span>
                    <span className="text-xs font-semibold leading-tight">
                      {dept.label}
                    </span>
                    {data.department === dept.value && (
                      <Check className="w-3.5 h-3.5 text-primary ml-auto shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  onClick={goBack}
                  variant="outline"
                  className="flex-1 h-10 bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  onClick={goNext}
                  disabled={!data.department}
                  className="flex-1 h-10 bg-primary text-primary-foreground hover:bg-primary-dark font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step: Course ── */}
          {currentStep === 'course' && (
            <div className="space-y-4">
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {courses.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => update({ course: c.value })}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      data.course === c.value
                        ? 'bg-primary/15 border-primary/60 text-white shadow-md shadow-primary/10'
                        : 'bg-slate-900/50 border-slate-800/60 text-slate-400 hover:bg-slate-800/50 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-semibold">{c.label}</span>
                    {data.course === c.value && (
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    )}
                  </button>
                ))}
                {courses.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-4">
                    No courses found for this department.
                  </p>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  onClick={goBack}
                  variant="outline"
                  className="flex-1 h-10 bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  onClick={goNext}
                  disabled={!data.course}
                  className="flex-1 h-10 bg-primary text-primary-foreground hover:bg-primary-dark font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step: ID Card ── */}
          {currentStep === 'id-card' && (
            <form onSubmit={onSubmit} className="space-y-4">
              <DropZone
                label="ID Card — Front Side"
                preview={data.frontPreview}
                inputRef={frontInputRef}
                isDragActive={isFrontDrag}
                onDrag={makeDragHandler(setIsFrontDrag)}
                onDrop={makeDropHandler(
                  setIsFrontDrag,
                  'frontFile',
                  'frontPreview'
                )}
                onChange={makeFileChangeHandler('frontFile', 'frontPreview')}
                onRemove={() => update({ frontFile: null, frontPreview: null })}
              />
              <DropZone
                label="ID Card — Back Side"
                preview={data.backPreview}
                inputRef={backInputRef}
                isDragActive={isBackDrag}
                onDrag={makeDragHandler(setIsBackDrag)}
                onDrop={makeDropHandlerBack(
                  setIsBackDrag,
                  'backFile',
                  'backPreview'
                )}
                onChange={makeFileChangeHandler('backFile', 'backPreview')}
                onRemove={() => update({ backFile: null, backPreview: null })}
              />
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  onClick={goBack}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1 h-10 bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !data.frontFile || !data.backFile}
                  className="flex-1 h-10 bg-primary text-primary-foreground hover:bg-primary-dark font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-primary/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />{' '}
                      Completing...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" /> Complete
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
