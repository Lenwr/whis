import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export interface Coach {
  id: string;
  name: string;
  avatarUrl: string;
  students: number;
  note: number; // sur 5
}

export function useCoachs() {
  const [coachs, setCoachs] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoachs = async () => {
      const q = query(collection(db, "users"), where("role", "==", "Maitre"));
      const querySnapshot = await getDocs(q);

      const coachsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.displayName || "Coach",
          avatarUrl: data.avatarUrl || "/default-avatar.png",
          students: data.students || 0,
          note: data.note || 0,
        };
      });

      setCoachs(coachsData);
      setLoading(false);
    };

    fetchCoachs();
  }, []);

  return { coachs, loading };
}
