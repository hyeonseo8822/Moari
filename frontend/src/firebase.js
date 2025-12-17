import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_NFDJDKC6Nf-6Nu3Eh-qN3nLlmBNxvUY",
  authDomain: "moari2.firebaseapp.com",
  projectId: "moari2",
  storageBucket: "moari2.firebasestorage.app",
  messagingSenderId: "240395549518",
  appId: "1:240395549518:web:1c40aca58d4537b0c5bc1f",
  measurementId: "G-NH515CLM1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// 로그인 기능을 다른 파일에서 쓸 수 있게 내보내기
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();