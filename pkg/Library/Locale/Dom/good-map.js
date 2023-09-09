/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const GoodMap = (() => {
  // resolves when window.__initGoodMap is called via JSONP protocol in dynamic script tag
  const callbackPromise = new Promise(resolve => window.__initGoodMap = resolve);
  // semaphore
  let initCalled;
  // api bootstrapping
  function loadGoogleMaps(apiKey) {
    if (!initCalled) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__initGoodMap`;
      document.head.appendChild(script);
      initCalled = true;
    }
    return callbackPromise;
  }
  // define custom element
  return class extends HTMLElement {
    static get observedAttributes() {
      return ['api-key', 'zoom', 'latitude', 'longitude', 'map-options', 'markers'];
    }
    attributeChangedCallback(name, oldVal, val) {
      switch (name) {
        case 'api-key':
          this.apiKey = val;
          break;
        case 'zoom':
        case 'latitude':
        case 'longitude':
          this[name] = parseFloat(val);
          break;
        case 'map-options':
          this.extraOptions = JSON.parse(val);
          break;
      }
      if (this.map) {
        this.map.setOptions(this.constructMapOptions());
        if (this.markersChanged()) {
          this.markerElems.forEach(marker => marker.setMap(null));
          this.markerElems = [];
          this.markers?.forEach?.(coord => {
            const marker = new window.google.maps.Marker(this.constructMarkerOptions(coord));
            this.markerElems.push(marker);
            const infowindow = new window.google.maps.InfoWindow({content: coord.title});
            marker.addListener("click", () => {
              this.infowindow?.close();
              this.key = marker.key;
              this.dispatchEvent(new CustomEvent('marker-clicked'));
              infowindow.open({anchor: marker, map: this.map});
              this.infowindow = infowindow;
              this.zoom = this.map.zoom;
              this.latitude = marker.getPosition().lat();
              this.longitude = marker.getPosition().lng();
            });
          });
        }
      }
    }
    markersChanged() {
      if (this.markers?.length !== this.markerElems.length) {
        return true;
      }
      return !this.markers.every(({key, latitude, longitude}, index) => {
        const elem = this.markerElems[index];
        return (key === elem.key) && (latitude === elem.getPosition().lat()) && (longitude === elem.getPosition().lng());
      });
    }
    constructor() {
      super();
      this.apiKey = globalThis?.config?.firebaseConfig?.apiKey;
      this.map = null;
      this.zoom = 8;
      // this.latitude = 48.8589384;
      // this.longitude = 2.264635;
      this.extraOptions = {};
      this.markerElems = [];
    }
    connectedCallback() {
      loadGoogleMaps(this.apiKey).then(() => {
        this.map = new window.google.maps.Map(this, this.constructMapOptions());
        this.dispatchEvent(new CustomEvent('google-map-ready', {detail: this.map}));
      });
    }
    constructMapOptions() {
      const mapOptions = {...this.extraOptions};
      if (this.zoom) {
        mapOptions.zoom = this.zoom || 0;
      }
      if (this.latitude || this.longitude) {
        mapOptions.center = {
          lat: this.latitude ?? 0,
          lng: this.longitude ?? 0
        };
      }
      //console.log('[good-map] mapOptions:', mapOptions);
      return mapOptions;
    }
    constructMarkerOptions({latitude, longitude, title, key}) {
      return {
        map: this.map,
        position: {lat: latitude ?? 0, lng: longitude ?? 0},
        title,
        key
      };
    }
  };
})();

// define custom element
customElements.define('good-map', GoodMap);
