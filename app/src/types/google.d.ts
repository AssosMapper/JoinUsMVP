declare namespace google.maps {
  namespace places {
    class Autocomplete {
      constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions);
      addListener(eventName: string, handler: Function): void;
      getPlace(): PlaceResult;
    }
    
    interface AutocompleteOptions {
      types?: string[];
      componentRestrictions?: {
        country: string | string[];
      };
    }

    interface PlaceResult {
      formatted_address?: string;
    }
  }
} 