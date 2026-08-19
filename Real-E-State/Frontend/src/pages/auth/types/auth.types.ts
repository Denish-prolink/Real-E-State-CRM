// pages/auth/types/auth.types.ts

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role?: string;
      agencyId?: {
        _id: string;
        name: string;
        gst?: string;
        pan?: string;
        sences?: string;
        members?: number;
        email?: string;
        contactNumber?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        country?: string;
        pincode?: string;
        logo?: string;
      };
      permissions?: Record<string, string>;
    };
  };
}


export interface GoogleLoginPayload {
  email: string;
  firstName: string;
  lastName: string;
}