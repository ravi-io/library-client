import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export type OnboardingStep = 'university' | 'department' | 'course' | 'id-card';

export interface OnboardingData {
  university: string;
  department: string;
  course: string;
  frontFile: File | null;
  frontPreview: string | null;
  backFile: File | null;
  backPreview: string | null;
}

const STEPS: OnboardingStep[] = [
  'university',
  'department',
  'course',
  'id-card',
];

export function useOnboardingForm() {
  const { data: session } = authClient.useSession();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('university');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<OnboardingData>({
    university: 'VTU',
    department: '',
    course: '',
    frontFile: null,
    frontPreview: null,
    backFile: null,
    backPreview: null,
  });

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      setData((current) => {
        if (current.frontPreview) URL.revokeObjectURL(current.frontPreview);
        if (current.backPreview) URL.revokeObjectURL(current.backPreview);
        return current;
      });
    };
  }, []);

  const currentStepIndex = STEPS.indexOf(currentStep);
  const totalSteps = STEPS.length;

  const update = (partial: Partial<OnboardingData>) => {
    setData((prev) => {
      // Revoke old object URLs to avoid memory leaks
      if (
        Object.prototype.hasOwnProperty.call(partial, 'frontPreview') &&
        prev.frontPreview &&
        partial.frontPreview !== prev.frontPreview
      ) {
        URL.revokeObjectURL(prev.frontPreview);
      }
      if (
        Object.prototype.hasOwnProperty.call(partial, 'backPreview') &&
        prev.backPreview &&
        partial.backPreview !== prev.backPreview
      ) {
        URL.revokeObjectURL(prev.backPreview);
      }
      return { ...prev, ...partial };
    });
    setError(null);
  };

  const goNext = () => {
    setError(null);

    // Validate current step before advancing
    if (currentStep === 'university') {
      if (!data.university.trim()) {
        setError('Please enter your university name.');
        return;
      }
    }
    if (currentStep === 'department') {
      if (!data.department) {
        setError('Please select your department.');
        return;
      }
    }
    if (currentStep === 'course') {
      if (!data.course) {
        setError('Please select the course you are enrolled in.');
        return;
      }
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < totalSteps) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const goBack = () => {
    setError(null);
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.frontFile || !data.backFile) {
      setError('Please upload both the Front and Back sides of your ID Card.');
      toast.error('Please upload both sides of your ID Card.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      // Upload Front
      const frontFormData = new FormData();
      frontFormData.append('idCard', data.frontFile);
      if (session?.user?.idCardIds?.[0]) {
        frontFormData.append('oldFileId', session.user.idCardIds[0]);
      }

      // Upload Back
      const backFormData = new FormData();
      backFormData.append('idCard', data.backFile);
      if (session?.user?.idCardIds?.[1]) {
        backFormData.append('oldFileId', session.user.idCardIds[1]);
      }

      const [frontResult, backResult] = await Promise.all([
        fetch(`${apiUrl}/auth/upload-id`, {
          method: 'POST',
          body: frontFormData,
        }).then(async (res) => {
          if (!res.ok)
            throw new Error(
              (await res.json().catch(() => ({}))).message ||
                'Failed to upload Front side.'
            );
          return res.json();
        }),
        fetch(`${apiUrl}/auth/upload-id`, {
          method: 'POST',
          body: backFormData,
        }).then(async (res) => {
          if (!res.ok)
            throw new Error(
              (await res.json().catch(() => ({}))).message ||
                'Failed to upload Back side.'
            );
          return res.json();
        }),
      ]);

      // Persist all fields at once
      const { error: authError } = await authClient.updateUser({
        university: data.university.trim(),
        department: data.department,
        course: data.course,
        idCardUrls: [frontResult.url, backResult.url],
        idCardIds: [frontResult.fileId, backResult.fileId],
      });

      if (authError) {
        const msg = authError.message || 'Failed to save onboarding details.';
        setError(msg);
        toast.error(msg);
      } else {
        toast.success('Onboarding completed! Welcome to BeaconLibrary 🎉');
        window.location.href = '/';
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
}
