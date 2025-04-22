'use client';
import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchUserProfile, updateUserProfile, clearUserProfile, setInitialUserData } from '../redux/slices/userProfileSlice';
import { UserData } from '../types/types';

export const useUserProfile = (initialUserData?: UserData | null) => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const { userData, isLoading, error } = useAppSelector((state) => state.userProfile);

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
    if (initialUserData) {
      dispatch(setInitialUserData(initialUserData));
    } else if (status === 'authenticated') {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      dispatch(clearUserProfile());
      toast.error('Not authenticated');
    }
  }, [status, fetchUserData, initialUserData, dispatch]);

  return { userData, isLoading, error, fetchUserData, updateUser };
};