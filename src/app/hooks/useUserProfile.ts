'use client';
import { useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchUserProfile, updateUserProfile, clearUserProfile, setInitialUserData } from '../redux/slices/userProfileSlice';
import { UserData } from '../types/types';

export const useUserProfile = (initialUserData?: UserData | null) => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const { userData, isLoading, error } = useAppSelector((state) => state.userProfile);
  // Keep track of the previous `status` so we can avoid noisy toasts when the
  // auth state briefly goes through 'loading' -> 'unauthenticated' during
  // login flows.
  const prevStatusRef = useRef<string | undefined>(undefined);

  const fetchUserData = useCallback(async () => {
    if (status !== 'authenticated' || !session?.user?.id) {
      dispatch(clearUserProfile());
      toast.error('No user ID found in session');
      return;
    }
    await dispatch(fetchUserProfile());
  }, [dispatch, session, status]);

  const updateUser = useCallback(
    async (updates: { name?: string; role?: string; avatar?: string }) => {
      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }
      const result = await dispatch(updateUserProfile(updates));
      if (updateUserProfile.rejected.match(result)) {
        const msg = result.payload || 'Failed to update profile';
        toast.error(msg);
        throw new Error(msg);
      }
      toast.success('Profile updated successfully');
      return result.payload;
    },
    [dispatch, session]
  );

  useEffect(() => {
    // Track previous status to avoid showing a "Not authenticated" toast
    // during transient session state changes (common during login flow).
    const prevStatus = prevStatusRef.current;

    if (initialUserData) {
      dispatch(setInitialUserData(initialUserData));
    } else if (status === 'authenticated') {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      // If we transitioned from 'loading' -> 'unauthenticated' during the
      // initial session check, don't show the toast (it would be noisy when
      // the auth flow soon becomes 'authenticated'). Only show the toast if
      // the previous status was not 'loading' (e.g., user explicitly signed
      // out or an auth error occurred after initial load).
      dispatch(clearUserProfile());
      if (prevStatus !== 'loading') {
        toast.error('Not authenticated');
      }
    }

    // Update previous status for next run
    prevStatusRef.current = status;
  }, [status, fetchUserData, initialUserData, dispatch]);

  return { userData, isLoading, error, fetchUserData, updateUser };
};