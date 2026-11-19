// Integração com o Firebase (Authentication + Firestore).
// As chaves vêm de variáveis de ambiente VITE_* — nenhuma chave privada
// administrativa é embutida no código. Sem configuração, o app continua
// funcionando no modo local de demonstração.
const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigurado = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

export const variaveisPendentes = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
].filter((nome) => !env[nome]);

let appPromessa = null;

async function app() {
  if (!firebaseConfigurado) throw new Error("Firebase não configurado.");
  if (!appPromessa) {
    appPromessa = (async () => {
      const { initializeApp, getApps, getApp } = await import("firebase/app");
      return getApps().length ? getApp() : initializeApp(firebaseConfig);
    })();
  }
  return appPromessa;
}

export async function obterAuth() {
  const { getAuth } = await import("firebase/auth");
  return getAuth(await app());
}

export async function obterDb() {
  const { getFirestore } = await import("firebase/firestore");
  return getFirestore(await app());
}

export async function firebaseLerPerfil(uid) {
  const { doc, getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(await obterDb(), "usuarios", uid));
  return snap.exists() ? snap.data() : null;
}

export async function firebaseGravarPerfil(uid, dados) {
  const { doc, setDoc } = await import("firebase/firestore");
  await setDoc(doc(await obterDb(), "usuarios", uid), dados, { merge: true });
}