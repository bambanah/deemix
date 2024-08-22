import { SPOTIFY_STATUS } from "@/constants";
import { fetchData } from "@/utils/api";

const getDefaultState = () => ({
  arl: window.localStorage.getItem("arl") || "",
  accessToken: window.localStorage.getItem("accessToken") || "",
  status: null,
  user: {
    id: null,
    name: "",
    picture: "",
  },
  spotifyUser: {
    id: window.localStorage.getItem("spotifyUser"),
    name: null,
    picture: null,
  },
  // This does not always represent the truth because the status update on the server is async
  // and at the moment there's no way to notice the status change. Therefore a fetch of the status
  // is needed everytime we need to use it
  spotifyStatus: SPOTIFY_STATUS.DISABLED,
  clientMode: false,
});

const state = () => {
  return getDefaultState();
};

const actions = {
  login({ commit, dispatch }, payload) {
    const { arl, user, status } = payload;

    dispatch("setARL", { arl });
    commit("SET_USER", user);
    commit("SET_STATUS", status);
  },
  logout({ commit }) {
    window.localStorage.removeItem("arl");
    window.localStorage.removeItem("accessToken");
    commit("RESET_LOGIN");
  },
  setARL({ commit }, payload) {
    let { saveOnLocalStorage } = payload;
    const { arl } = payload;
    saveOnLocalStorage =
      typeof saveOnLocalStorage === "undefined" ? true : saveOnLocalStorage;
    commit("SET_ARL", arl);
    if (saveOnLocalStorage) {
      window.localStorage.setItem("arl", arl);
    }
  },
  setAccessToken({ commit }, payload) {
    let { saveOnLocalStorage } = payload;
    const { accessToken } = payload;
    saveOnLocalStorage =
      typeof saveOnLocalStorage === "undefined" ? true : saveOnLocalStorage;
    commit("SET_ACCESS_TOKEN", accessToken);
    if (saveOnLocalStorage) {
      window.localStorage.setItem("accessToken", accessToken);
    }
  },
  removeARL({ commit }) {
    commit("SET_ARL", "");
    window.localStorage.removeItem("arl");
  },
  removeAccessToken({ commit }) {
    commit("SET_ACCESS_TOKEN", "");
    window.localStorage.removeItem("accessToken");
  },
  setUser({ commit }, payload) {
    commit("SET_USER", payload);
  },
  setClientMode({ commit }, payload) {
    commit("SET_CLIENT_MODE", payload);
  },
  setSpotifyStatus({ commit }, newSpotifyStatus) {
    commit("SET_SPOTIFY_STATUS", newSpotifyStatus);
  },
  setSpotifyUserId({ commit }, newSpotifyUserId) {
    commit("SET_SPOTIFY_USER_ID", newSpotifyUserId);
  },
  /**
   * Returning a Promise so that who calls this action is sure that
   * the fetching is complete after the statement
   *
   * @example
   * await store.dispatch('refreshSpotifyStatus')
   * // From here the status is refreshed
   */
  refreshSpotifyStatus({ commit }) {
    return fetchData("spotifyStatus").then((response) => {
      commit(
        "SET_SPOTIFY_STATUS",
        response.spotifyEnabled
          ? SPOTIFY_STATUS.ENABLED
          : SPOTIFY_STATUS.DISABLED,
      );
    });
  },
};

const getters = {
  getARL: (state) => state.arl,
  getAccessToken: (state) => state.accessToken,
  getUser: (state) => state.user,
  getSpotifyUser: (state) => state.spotifyUser,
  getClientMode: (state) => state.clientMode,

  isLoggedIn: (state) => !!state.arl,
  isLoggedWithSpotify: (state) =>
    !!state.spotifyUser.id && state.spotifyStatus === SPOTIFY_STATUS.ENABLED,
};

const mutations = {
  SET_ARL(state, payload) {
    state.arl = payload;
  },
  SET_ACCESS_TOKEN(state, payload) {
    state.accessToken = payload;
  },
  SET_STATUS(state, payload) {
    state.status = payload;
  },
  SET_USER(state, payload) {
    state.user = payload;
  },
  SET_CLIENT_MODE(state, payload) {
    state.clientMode = payload;
  },
  RESET_LOGIN(state) {
    // Needed for reactivity
    const clientMode = state.clientMode;
    Object.assign(state, getDefaultState());
    state.clientMode = clientMode;
  },
  SET_SPOTIFY_STATUS(state, newSpotifyStatus) {
    state.spotifyStatus = newSpotifyStatus;
  },
  SET_SPOTIFY_USER_ID(state, newSpotifyUserId) {
    state.spotifyUser = {
      ...state.spotifyUser,
      id: newSpotifyUserId,
    };
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
