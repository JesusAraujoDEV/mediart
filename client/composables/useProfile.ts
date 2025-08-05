import { ref } from "vue";
import type { Playlist } from "~/types/Playlist";
import type { UserProfile as UserProfileType } from "~/types/User";

export interface FollowEntry {
  createdAt: string;
  updatedAt: string;
  id: number;
  followerUserId: number;
  followedUserId: number;
}

export interface FriendActionResponse {
  message: string;
  followEntry?: FollowEntry;
}

export interface UserProfile extends UserProfileType {
  followersUsers?: any[];
  followingUsers?: any[];
  playlists?: Playlist[];
}

function getCurrentUserIdSafe(): number | null {
  if (typeof localStorage === "undefined") return null;
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    const parsed = JSON.parse(user);
    return parsed?.id ?? null;
  } catch {
    return null;
  }
}

export function useProfile() {
  const config = useRuntimeConfig();
  const userProfile = ref<UserProfile>({
    username: "Cargando...",
    email: "cargando@ejemplo.com",
    profilePictureUrl: "/resources/studio/previewProfile.webp",
    bio: "Cargando biografía del estudio...",
    id: -1,
    followersUsers: [],
    followingUsers: [],
  });

  const isLoading = ref(true);
  const isOwner = ref(false);
  const isFriend = ref(false);
  const isFriendActionLoading = ref(false);
  const friendActionMessage = ref<string | null>(null);
  const friendActionError = ref(false);

  const createdPlaylists = ref<Playlist[]>([]);
  const savedPlaylistsIds = ref<number[]>([]);
  const isSavingPlaylist = ref<Record<number, boolean>>({});

  const currentUserId = ref<number | null>(getCurrentUserIdSafe());

  const defaultProfile: UserProfile = {
    id: -1,
    username: "Usuario Anónimo",
    email: "anonimo@example.com",
    profilePictureUrl: "/resources/studio/previewProfile.webp",
    bio: "Este es un perfil predeterminado o no encontrado. Crea o edita tu perfil para mostrar tu trabajo.",
    followersUsers: [],
    followingUsers: [],
  };

  async function fetchProfileByUsername(username: string) {
    try {
      const { data, error } = await useFetch<UserProfile>(
        `${config.public.backend}/api/users/by-username/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (error.value) {
        console.error("Error al cargar el perfil del usuario:", error.value);
        userProfile.value = defaultProfile;
        return;
      }
      if (data.value) {
        userProfile.value = {
          ...data.value,
          profilePictureUrl:
            data.value.profilePictureUrl || "/resources/studio/previewProfile.webp",
          bio: data.value.bio || "Este usuario no ha proporcionado una biografía.",
          followersUsers: data.value.followersUsers || [],
          followingUsers: data.value.followingUsers || [],
        };
      } else {
        userProfile.value = defaultProfile;
      }
    } catch (e) {
      console.error("Excepción inesperada al cargar el perfil:", e);
      userProfile.value = defaultProfile;
    }
  }

  async function checkFriendshipStatus() {
    if (!currentUserId.value || !userProfile.value?.id || userProfile.value.id <= 0) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${config.public.backend}/api/profile/my-followings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!resp.ok) throw new Error("No se pudo obtener la lista de seguidos");
      const data = await resp.json();
      isFriend.value = Array.isArray(data) && data.some((u: any) => u.id === userProfile.value.id);
    } catch (e) {
      console.error("Error al verificar si ya sigues a este usuario:", e);
      isFriend.value = false;
    }
  }

  async function refreshProfile(username: string) {
    await fetchProfileByUsername(username);
    isOwner.value = !!currentUserId.value && currentUserId.value === userProfile.value.id;
    if (!isOwner.value) {
      await checkFriendshipStatus();
    }
  }

  async function fetchSavedPlaylistsIds() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await fetch(
        `${config.public.backend}/api/users/by-username/${currentUser.username}?include=savedPlaylists`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) return;
      const data = await response.json();
      savedPlaylistsIds.value = (data.savedPlaylists || []).map((p: Playlist) => p.id);
    } catch {
      savedPlaylistsIds.value = [];
    }
  }

  async function savePlaylist(playlistId: number) {
    isSavingPlaylist.value[playlistId] = true;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${config.public.backend}/api/profile/saved-playlists/${playlistId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("No se pudo guardar la playlist");
      savedPlaylistsIds.value.push(playlistId);
      try {
        const Swal = (await import("sweetalert2")).default as any;
        Swal.fire({
          icon: "success",
          title: "Playlist guardada en tu biblioteca",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
        // no-op
      }
    } catch (e) {
      try {
        const Swal = (await import("sweetalert2")).default as any;
        Swal.fire({
          icon: "error",
          title: "Error al guardar la playlist",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch {
        // no-op
      }
    } finally {
      isSavingPlaylist.value[playlistId] = false;
    }
  }

  async function sendFriendAction(action: "add" | "remove") {
    if (!userProfile.value?.id || userProfile.value.id <= 0) {
      friendActionError.value = true;
      friendActionMessage.value = "Error: ID de usuario no disponible.";
      return;
    }
    isFriendActionLoading.value = true;
    friendActionMessage.value = null;
    friendActionError.value = false;

    const endpoint = `${config.public.backend}/api/profile/follow/${userProfile.value.id}`;
    const method = action === "add" ? "POST" : "DELETE";
    try {
      const { data, error } = await useFetch<FriendActionResponse>(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (error.value) {
        console.error(`Error al ${action === "add" ? "agregar" : "eliminar"} amigo:`, error.value);
        friendActionError.value = true;
        friendActionMessage.value =
          (error.value as any).data?.message ||
          `Error al ${action === "add" ? "agregar" : "eliminar"} amigo.`;
        isFriend.value = action === "remove";
        return;
      }
      await refreshProfile(String(userProfile.value.username));
      if (data.value && data.value.followEntry) {
        isFriend.value = true;
        friendActionMessage.value = data.value.message || "Amigo agregado correctamente.";
        try {
          const Swal = (await import("sweetalert2")).default as any;
          Swal.fire({
            toast: true,
            position: "top-end",
            heightAuto: false,
            icon: "success",
            title: friendActionMessage.value,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        } catch {
          // no-op
        }
      } else if (data.value && !data.value.followEntry) {
        isFriend.value = false;
        friendActionMessage.value = data.value.message || "Amigo eliminado correctamente.";
        try {
          const Swal = (await import("sweetalert2")).default as any;
          Swal.fire({
            toast: true,
            position: "top-end",
            heightAuto: false,
            icon: "success",
            title: friendActionMessage.value,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        } catch {
          // no-op
        }
      }
    } catch (e) {
      console.error(`Excepción al ${action === "add" ? "agregar" : "eliminar"} amigo:`, e);
      friendActionError.value = true;
      friendActionMessage.value = `Error inesperado al ${action === "add" ? "agregar" : "eliminar"} amigo.`;
      isFriend.value = action === "remove";
    } finally {
      isFriendActionLoading.value = false;
    }
  }

  return {
    // state
    userProfile,
    isLoading,
    isOwner,
    isFriend,
    isFriendActionLoading,
    friendActionMessage,
    friendActionError,
    createdPlaylists,
    savedPlaylistsIds,
    isSavingPlaylist,
    currentUserId,

    // defaults
    defaultProfile,

    // methods
    fetchProfileByUsername,
    refreshProfile,
    checkFriendshipStatus,
    savePlaylist,
    fetchSavedPlaylistsIds,
    sendFriendAction,
  };
}