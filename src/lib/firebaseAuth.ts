// src/lib/firebaseAuth.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  user_metadata?: { name?: string };
}
export interface AuthSession {
  user: AuthUser;
}
export interface AuthResponse {
  data: { session: AuthSession | null; user: AuthUser | null };
  error: Error | null;
}

function toUser(u: User): AuthUser {
  const name = u.displayName || (u.email ? u.email.split("@")[0] : "User");
  return { id: u.uid, email: u.email || "", name, user_metadata: { name } };
}

async function ensureUserDoc(u: AuthUser) {
  try {
    await setDoc(
      doc(db, "users", u.id),
      { email: u.email, name: u.name, updatedAt: new Date().toISOString() },
      { merge: true }
    );
  } catch {
    // don't block auth on Firestore failures
  }
}

class FirebaseAuthService {
  // ---------- Email / Password ----------
  async signUp({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
    try {
      if (!email || !password) throw new Error("Email and password are required.");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = toUser(cred.user);

        // don't block auth on Firestore transport
      ensureUserDoc(user).catch(() => {});      // <-- fire-and-forget

      return { data: { session: { user }, user }, error: null };

    } catch (e: any) {
      let msg = e.message;
      if (e.code === "auth/email-already-in-use") msg = "An account with this email already exists. Please sign in.";
      if (e.code === "auth/invalid-email") msg = "Please enter a valid email address.";
      if (e.code === "auth/weak-password") msg = "Password is too weak.";
      return { data: { session: null, user: null }, error: new Error(msg) };
    }
  }

  async signInWithPassword({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = toUser(cred.user);
      return { data: { session: { user }, user }, error: null };
    } catch (e: any) {
      let msg = e.message;
      if (e.code === "auth/user-not-found") msg = "No account found with this email.";
      if (e.code === "auth/wrong-password" || e.code === "auth/invalid-credential") msg = "Invalid email or password.";
      return { data: { session: null, user: null }, error: new Error(msg) };
    }
  }

  // ---------- Google OAuth (use REDIRECT to avoid COOP/popup issues) ----------
  async signInWithOAuth(): Promise<{ error: Error | null }> {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
      return { error: null };
    } catch (e: any) {
      return { error: e as Error };
    }
  }

  // Complete redirect after returning from Google
  async resolveRedirectResult(): Promise<AuthResponse> {
    try {
      const res = await getRedirectResult(auth);
      if (!res?.user) return { data: { session: null, user: null }, error: null };
      const user = toUser(res.user);

// don't block on Firestore here either
      ensureUserDoc(user).catch(() => {});

      return { data: { session: { user }, user }, error: null };

    } catch (e: any) {
      return { data: { session: null, user: null }, error: e as Error };
    }
  }

  // ---------- Session ----------
  async getSession(): Promise<{ data: { session: AuthSession | null } }> {
    const u = auth.currentUser;
    return u ? { data: { session: { user: toUser(u) } } } : { data: { session: null } };
  }

  // ---------- Misc ----------
  async signOut(): Promise<{ error: Error | null }> {
    try {
      await fbSignOut(auth);
      return { error: null };
    } catch (e: any) {
      return { error: e as Error };
    }
  }

  async updateUserName(name: string): Promise<{ error: Error | null }> {
    try {
      if (!auth.currentUser) return { error: new Error("Not signed in") };
      await updateProfile(auth.currentUser, { displayName: name });
      await ensureUserDoc({ id: auth.currentUser.uid, email: auth.currentUser.email || "", name });
      return { error: null };
    } catch (e: any) {
      return { error: e as Error };
    }
  }

  onAuthStateChange(cb: (ev: "SIGNED_IN" | "SIGNED_OUT", s: AuthSession | null) => void) {
    const unsubscribe = onAuthStateChanged(auth, (u) =>
      cb(u ? "SIGNED_IN" : "SIGNED_OUT", u ? { user: toUser(u) } : null)
    );
    return { unsubscribe };
  }
}

export const firebaseAuth = new FirebaseAuthService();
export default firebaseAuth;
