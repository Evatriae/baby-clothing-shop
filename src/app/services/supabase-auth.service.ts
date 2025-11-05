import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseAuthService {
  private supabase: any;
  private _currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
    this.supabase = createClient(
      environment.supabase.url, 
      environment.supabase.anonKey
    );

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((event: string, session: any) => {
      this._currentUser.next(session?.user ?? null);
    });
  }

  get currentUser() {
    return this._currentUser.asObservable();
  }

  async signUp(email: string, password: string, firstName: string, lastName: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) throw error;

      // User created successfully - profile should be created by database trigger
      if (data.user && data.user.id) {
        console.log('User created successfully:', {
          id: data.user.id,
          email: data.user.email,
          confirmed_at: data.user.confirmed_at
        });
        console.log('Profile should be created automatically by database trigger');
      } else {
        console.log('User creation result:', data);
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Create user profile in the database
  private async createProfile(userId: string, firstName: string, lastName: string, email: string) {
    try {
      console.log('Creating profile for user:', userId);
      
      const profileData = {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Profile data:', profileData);

      const { data, error } = await this.supabase
        .from('profiles')
        .insert(profileData)
        .select();

      if (error) {
        console.error('Database error creating profile:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('Profile created successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Failed to create profile:', {
        error,
        userId,
        firstName,
        lastName,
        email
      });
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async getSession() {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async getUser() {
    try {
      const { data, error } = await this.supabase.auth.getUser();
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Get user profile from database
  async getProfile(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Update user profile in database
  async updateProfile(userId: string, profileData: any) {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
}