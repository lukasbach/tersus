import { initializeApp } from "firebase/app";
import {
  CollectionReference,
  DocumentReference,
  addDoc,
  collection,
  deleteDoc,
  doc,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  updateDoc,
} from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { DashboardConfig } from "../types.ts";

const app = initializeApp({
  apiKey: "AIzaSyBPVQiEgPARgc8Rnc2Kjt85HFPRVsK4DE0",
  authDomain: "tersus-dashboard.firebaseapp.com",
  projectId: "tersus-dashboard",
  storageBucket: "tersus-dashboard.appspot.com",
  messagingSenderId: "830406896410",
  appId: "1:830406896410:web:7bda3a7530fb7bf7845aa3",
});

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

export const dashboardsCollection = collection(
  db,
  "boards",
) as CollectionReference<DashboardConfig>;
export const getDashboardDoc = (id: string) =>
  doc(db, "boards", id) as DocumentReference<DashboardConfig>;

export const useDashboardData = (id: string | null) =>
  useDocument<DashboardConfig>(id ? getDashboardDoc(id) : null);

export const createDashboard = (dashboard: DashboardConfig) =>
  addDoc(dashboardsCollection, dashboard);

export const deleteDashboard = (id: string) => deleteDoc(getDashboardDoc(id));
export const updateDashboard = (id: string, data: DashboardConfig) =>
  updateDoc(getDashboardDoc(id), data);
