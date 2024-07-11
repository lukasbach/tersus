import { initializeApp } from "firebase/app";
import {
  CollectionReference,
  DocumentReference,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  initializeFirestore,
  onSnapshot,
  persistentLocalCache,
  persistentMultipleTabManager,
  updateDoc,
} from "firebase/firestore";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { DashboardConfig } from "../types.ts";
import { useStableHandler } from "../utils.ts";
import { useDashboardList } from "../use-dashboard-list.ts";

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
  ignoreUndefinedProperties: true,
});

export const dashboardsCollection = collection(
  db,
  "boards",
) as CollectionReference<DashboardConfig>;
export const getDashboardDoc = (id: string) =>
  doc(db, "boards", id) as DocumentReference<DashboardConfig>;

export const createDashboard = (
  dashboard: Omit<
    DashboardConfig,
    "lastEdit" | "createdAt" | "editedAfterWeek"
  >,
) =>
  addDoc(dashboardsCollection, {
    ...dashboard,
    lastEdit: Date.now(),
    createdAt: Date.now(),
    editedAfterWeek: false,
  });
export const createDashboardFromTemplate = async (
  template: string,
  navigate = false,
) => {
  const response = await fetch(`/samples/${template}.json`);
  const { id: dashboardId } = await createDashboard(await response.json());
  if (navigate) window.open(`#/board/${dashboardId}`, "_blank");
};

export const deleteDashboard = (id: string) => deleteDoc(getDashboardDoc(id));
export const updateDashboard = (id: string, data: DashboardConfig) => {
  console.log("Updating dashboard", id, data);
  return updateDoc(getDashboardDoc(id), data);
};

export const useSyncDashboardData = (id: string | null) => {
  const localList = useDashboardList();
  const [localData, setLocalData] = useLocalStorage<
    DashboardConfig | "online" | null
  >({
    key: `dashboard-${id}`,
  });
  const [onlineData, setOnlineData] = useState<DashboardConfig | null>(null);
  const localOnly = !!localData && typeof localData !== "object";

  useEffect(() => {
    if (onlineData || localOnly || !id) return () => {};
    const ref = getDashboardDoc(id);
    (async () => {
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      setOnlineData(snap.data());
    })();
    return onSnapshot(
      ref,
      { source: "default" },
      (doc) => {
        console.log("Received new snapshot");
        const newData = doc.data();
        if (!newData) return;
        setOnlineData(newData);
      },
      console.error,
    );
  }, [id, localData, localOnly, onlineData]);

  const update = useStableHandler((data: DashboardConfig) => {
    if (!id) return;
    console.log("Updating dashboard:", id, data);
    const lastEdit = Date.now();
    // eslint-disable-next-line no-param-reassign
    data.lastEdit = lastEdit;
    // eslint-disable-next-line no-param-reassign
    data.editedAfterWeek = lastEdit - data.createdAt > 7 * 24 * 60 * 60 * 1000;

    if (!localOnly) {
      setOnlineData(data);
    } else {
      setLocalData(data);
    }
  });

  const data = !localOnly || localData === "online" ? onlineData : localData;

  const persist = useStableHandler(async () => {
    if (!id || !data) return;
    console.log("Persisting dashboard:", id, data);
    await updateDashboard(id, data);
    localList.updateDashboardName(id, data.title);
  });

  return { data, update, persist, localOnly };
};
