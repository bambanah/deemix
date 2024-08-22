/**
 * @typedef {object} AppInfo
 * @property {string} currentCommit
 * @property {string} latestCommit
 * @property {boolean} updateAvailable
 * @property {string} deemixVersion
 * @property {number} previewVolume
 * @property {boolean} hasSlimDownloads
 * @property {boolean} hasSlimSidebar
 * @property {boolean} showBitrateTags
 * @property {boolean} showSearchButton
 */

import {
  getInitialPreviewVolume,
  checkInitialSlimDownloads,
  checkInitialSlimSidebar,
  checkInitialShowBitrateTags,
  checkInitialShowSearchButton,
} from "@/data/settings";

/**
 * @returns {AppInfo}
 */
const state = () => ({
  currentCommit: null,
  latestCommit: null,
  updateAvailable: false,
  deemixVersion: null,
  previewVolume: getInitialPreviewVolume(),
  hasSlimDownloads: checkInitialSlimDownloads(),
  hasSlimSidebar: checkInitialSlimSidebar(),
  showBitrateTags: checkInitialShowBitrateTags(),
  showSearchButton: checkInitialShowSearchButton(),
});

const actions = {
  /**
   * @param {any} action
   * * @param {AppInfo}payload
   */
  setAppInfo({ commit }, payload) {
    commit("SET_CURRENT_COMMIT", payload.currentCommit);
    commit("SET_DEEMIX_VERSION", payload.deemixVersion);
  },
  setUpdateInfo({ commit }, payload) {
    commit("SET_LATEST_COMMIT", payload.latestCommit);
    commit("SET_UPDATE_AVAILABLE", payload.updateAvailable);
  },
  /**
   * @param {any} action
   * @param {AppInfo['previewVolume']} payload
   */
  setPreviewVolume({ commit }, payload) {
    commit("SET_PREVIEW_VOLUME", payload);
    window.localStorage.setItem("previewVolume", payload.toString());
  },
  /**
   * @param {any} action
   * @param {AppInfo['hasSlimDownloads']} payload
   */
  setSlimDownloads({ commit }, payload) {
    commit("SET_SLIM_DOWNLOADS", payload);
    window.localStorage.setItem("slimDownloads", payload.toString());
  },
  /**
   * @param {any} action
   * @param {AppInfo['hasSlimSidebar']} payload
   */
  setSlimSidebar({ commit }, payload) {
    commit("SET_SLIM_SIDEBAR", payload);
    window.localStorage.setItem("slimSidebar", payload.toString());

    // Moves all toast messages when the option changes
    Array.from(document.getElementsByClassName("toastify")).forEach((toast) => {
      toast.style.transform = `translate(${payload ? "3rem" : "14rem"}, 0)`;
    });
  },
  /**
   * @param {any} action
   * @param {AppInfo['showBitrateTags']} payload
   */
  setShowBitrateTags({ commit }, payload) {
    commit("SET_SHOW_BITRATE_TAGS", payload);
    window.localStorage.setItem("showBitrateTags", payload.toString());
  },
  /**
   * @param {any} action
   * @param {AppInfo['showBitrateTags']} payload
   */
  setShowSearchButton({ commit }, payload) {
    commit("SET_SHOW_SEARCH_BUTTON", payload);
    window.localStorage.setItem("showSearchButton", payload.toString());
  },
};

const getters = {
  /**
   * @param {AppInfo} state
   * @returns {AppInfo}
   */
  getAppInfo: (state) => state,
  /**
   * @param  {AppInfo}          state
   * @returns {AppInfo['previewVolume']}
   */
  getPreviewVolume: (state) => state.previewVolume,
  /**
   * @param  {AppInfo}           state
   * @returns {AppInfo['hasSlimDownloads']}
   */
  getSlimDownloads: (state) => state.hasSlimDownloads,
  /**
   * @param  {AppInfo}          state
   * @returns {AppInfo['hasSlimSidebar']}
   */
  getSlimSidebar: (state) => state.hasSlimSidebar,
  /**
   * @param  {AppInfo}          state
   * @returns {AppInfo['showBitrateTags']}
   */
  getShowBitrateTags: (state) => state.showBitrateTags,
  /**
   * @param  {AppInfo}          state
   * @returns {AppInfo['showSearchButton']}
   */
  getShowSearchButton: (state) => state.showSearchButton,
};

const mutations = {
  /**
   * @param {AppInfo}          state
   * @param {AppInfo['currentCommit']} payload
   */
  SET_CURRENT_COMMIT(state, payload) {
    state.currentCommit = payload;
  },
  /**
   * @param {AppInfo}         state
   * @param {AppInfo['latestCommit']} payload
   */
  SET_LATEST_COMMIT(state, payload) {
    state.latestCommit = payload;
  },
  /**
   * @param {AppInfo}           state
   * @param {AppInfo['updateAvailable']} payload
   */
  SET_UPDATE_AVAILABLE(state, payload) {
    state.updateAvailable = payload;
  },
  /**
   * @param {AppInfo}          state
   * @param {AppInfo['deemixVersion']} payload
   */
  SET_DEEMIX_VERSION(state, payload) {
    state.deemixVersion = payload;
  },
  /**
   * @param {AppInfo}          state
   * @param {AppInfo['previewVolume']} payload
   */
  SET_PREVIEW_VOLUME(state, payload) {
    state.previewVolume = payload;
  },
  /**
   * @param {AppInfo}           state
   * @param {AppInfo['hasSlimDownloads']} payload
   */
  SET_SLIM_DOWNLOADS(state, payload) {
    state.hasSlimDownloads = payload;
  },
  /**
   * @param {AppInfo}          state
   * @param {AppInfo['hasSlimSidebar']} payload
   */
  SET_SLIM_SIDEBAR(state, payload) {
    state.hasSlimSidebar = payload;
  },
  /**
   * @param {AppInfo}          state
   * @param {AppInfo['showBitrateTags']} payload
   */
  SET_SHOW_BITRATE_TAGS(state, payload) {
    state.showBitrateTags = payload;
  },
  /**
   * @param {AppInfo}          state
   * @param {AppInfo['showSearchButton']} payload
   */
  SET_SHOW_SEARCH_BUTTON(state, payload) {
    state.showSearchButton = payload;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
