import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      } else {
        navigate("/");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSave = async () => {
    if (!profileData) return;

    setSaving(true);

    let avatarURL = profileData.avatar || null;

    if (avatarFile) {
      const storageRef = ref(storage, `avatars/${user?.uid}`);
      await uploadBytes(storageRef, avatarFile);
      avatarURL = await getDownloadURL(storageRef);
    }

    await updateDoc(doc(db, "users", user!.uid), {
      displayName: profileData.displayName,
      anime: profileData.anime || null,
      classe: profileData.classe || null,
      avatar: avatarURL,
    });

    setProfileData({ ...profileData, avatar: avatarURL });
    setAvatarFile(null);
    setSaving(false);
    alert("Profil mis à jour !");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-900 text-white">
        Chargement...
      </div>
    );
  }

  const formattedDate = new Date(profileData.createdAt).toLocaleDateString();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-900 p-4">
      <div className=" p-8 w-full max-w-md text-white flex flex-col items-center">
        {/* Avatar */}
        <div className="relative mb-6">
          <img
            src={
              avatarFile
                ? URL.createObjectURL(avatarFile)
                : profileData.avatar ||
                  "https://i.pinimg.com/736x/f7/82/c8/f782c8360e890a8d488eeda004b26bde.jpg"
            }
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
          />
          <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setAvatarFile(e.target.files[0]);
                }
              }}
            />
            📸
          </label>
        </div>

        {/* Infos modifiables */}
        <div className="w-full flex flex-col gap-4">
          <input
            type="text"
            className="w-full p-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none"
            value={profileData.displayName}
            onChange={(e) =>
              setProfileData({ ...profileData, displayName: e.target.value })
            }
            placeholder="Nom du guerrier"
          />

          {profileData.role === "Etudiant" && (
            <>
              <input
                type="text"
                className="w-full p-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none"
                value={profileData.anime}
                onChange={(e) =>
                  setProfileData({ ...profileData, anime: e.target.value })
                }
                placeholder="Anime préféré"
              />

              <input
                type="text"
                className="w-full p-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none"
                value={profileData.classe}
                onChange={(e) =>
                  setProfileData({ ...profileData, classe: e.target.value })
                }
                placeholder="Classe"
              />
            </>
          )}

          <div className="text-sm text-white/70">
            XP Total : <span className="font-semibold">{profileData.xpTotal}</span>
          </div>
          <div className="text-sm text-white/70">
            Niveau : <span className="font-semibold">{profileData.level}</span>
          </div>
          <div className="text-sm text-white/70">
            Inscrit le : <span className="font-semibold">{formattedDate}</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
