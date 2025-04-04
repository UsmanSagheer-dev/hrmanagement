// hooks/useEmployeeForm.ts
'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import {
  updatePersonalInfo,
  updateProfessionalInfo,
  updateDocumentInfo,
  updateAccountInfo,
  setActiveTab,
  submitFormStart,
  submitFormSuccess,
  submitFormFailure,
} from '../redux/slices/employeeFormSlice';
import { useRouter } from 'next/navigation';

export const useEmployeeForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { personal, professional, documents, account, activeTab, isLoading, formError } = useSelector(
    (state: RootState) => state.employeeForm
  );

  // File conversion with error handling
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.match(/^image\/(png|jpeg|jpg)|application\/pdf$/)) {
        reject(new Error('Invalid file type. Only images (PNG, JPEG, JPG) and PDFs are allowed.'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('File size too large. Maximum allowed size is 5MB.'));
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error reading file. Please try again.'));
    });
  };

  // Enhanced form submission handler
  const submitEmployeeData = async () => {
    dispatch(submitFormStart());
    
    try {
      const employeeData = {
        personal: { ...personal },
        professional: { ...professional },
        documents: { ...documents },
        account: { ...account },
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest' // CSRF protection
        },
        credentials: 'include',
        body: JSON.stringify(employeeData),
        signal: AbortSignal.timeout(20000) // 10-second timeout
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle session expiration
        if (response.status === 401) {
          router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
          throw new Error('Session expired. Please login again.');
        }

        // Handle validation errors
        if (response.status === 400) {
          throw new Error(errorData.errors?.join(', ') || 'Invalid input data');
        }

        throw new Error(errorData.message || 'Request failed');
      }

      // Handle successful response
      const result = await response.json();
      dispatch(submitFormSuccess());
      router.push(`/employee/${result.id}/confirmation`);

    } catch (error: any) {
      // Handle different error types
      let errorMessage = 'Submission failed. Please try again.';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Check your network connection.';
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch(submitFormFailure(errorMessage));
      console.error('Submission Error:', error);
    }
  };

  // Form field validators
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^\+?[1-9]\d{1,14}$/; 
    return re.test(phone);
  };

  const updatePersonal = async (data: any) => {
    if (!validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    if (!validatePhone(data.phone)) {
      throw new Error('Invalid phone number format');
    }

    // File processing
    let updatedData = { ...data };
    if (data.profileImage instanceof File) {
      try {
        updatedData.profileImage = await fileToBase64(data.profileImage);
      } catch (error: any) {
        throw new Error(`Profile image: ${error.message}`);
      }
    }

    dispatch(updatePersonalInfo(updatedData));
  };

  // Return public API
  return {
    personal,
    professional,
    documents,
    account,
    activeTab,
    isLoading,
    formError,
    handleTabChange: (tabName: string) => dispatch(setActiveTab(tabName)),
    updatePersonal,
    updateProfessional: (data: any) => dispatch(updateProfessionalInfo(data)),
    updateDocuments: async (fileType: string, file: File) => {
      try {
        const base64File = await fileToBase64(file);
        dispatch(updateDocumentInfo({ [fileType]: base64File }));
      } catch (error: any) {
        throw new Error(`${fileType}: ${error.message}`);
      }
    },
    updateAccount: (data: any) => {
      if (data.password && data.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      dispatch(updateAccountInfo(data));
    },
    submitEmployeeData
  };
};