export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  bio: string;
  isEmailVerified: boolean;
  isActive?: boolean;
  provider?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileApiResponse {
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
  };
}
