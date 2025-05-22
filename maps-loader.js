
const MapsLoader = (function () {
  let isLoaded = false;
  let loadPromise = null;

  return {
    load: async function () {
      if (isLoaded) return;
      if (loadPromise) return loadPromise;

      loadPromise = new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.maps) {
          isLoaded = true;
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBYrV0Xt_2V6ubqMKfk8UoVpfiRcimlwHE&libraries=places';
        script.defer = true;
        script.async = true;
        script.onload = () => {
          if (typeof google !== 'undefined' && google.maps) {
            isLoaded = true;
            resolve();
          } else {
            reject(new Error('Google Mapsのロードに失敗しました'));
          }
        };
        script.onerror = () => reject(new Error('Google Mapsスクリプトの読み込みエラー'));
        document.head.appendChild(script);
      });

      return loadPromise;
    },

    initializePlacesAutocomplete: function (inputId) {
      return new Promise((resolve, reject) => {
        const input = document.getElementById(inputId);
        if (!input) {
          reject(new Error(`ID '${inputId}' のinput要素が見つかりません`));
          return;
        }
        const autocomplete = new google.maps.places.Autocomplete(input, {
          types: ['geocode'],
          componentRestrictions: { country: 'jp' }
        });
        resolve(autocomplete);
      });
    },

    initializeMap: function (elementId, options) {
      const mapElement = document.getElementById(elementId);
      if (!mapElement) {
        throw new Error(`ID '${elementId}' の地図要素が見つかりません`);
      }
      return new google.maps.Map(mapElement, options);
    }
  };
})();
