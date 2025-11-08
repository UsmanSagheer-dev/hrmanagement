import { UserData } from '@/app/types/types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


interface UserProfileState {
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserProfileState = {
  userData: null,
  isLoading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk<UserData, void, { rejectValue: string }>(
  'userProfile/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        // ensure the browser sends NextAuth cookies with the request
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || `Server error: ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message || 'An error occurred while fetching user data');
    }
  }
);

export const updateUserProfile = createAsyncThunk<UserData, { name?: string; role?: string; avatar?: string }, { rejectValue: string }>(
  'userProfile/updateUserProfile',
  async (updates, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        // ensure the browser sends NextAuth cookies with the request
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Update failed');
      }

      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update profile');
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.userData = null;
      state.isLoading = false;
      state.error = null;
    },
    setInitialUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.isLoading = false;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch user data';
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.isLoading = true;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update profile';
      });
  },
});

export const { clearUserProfile, setInitialUserData } = userProfileSlice.actions;
export default userProfileSlice.reducer;