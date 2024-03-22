export const isAlpha = (value) => {
    return /^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value);
  };
  
export const isNumeric = (value) => {
    return /^[0-9]+$/.test(value);
  };
  
 export const isAlphaNumeric = (value) => {
    return /(?=.*[a-zA-Z])(?=.*[0-9]).+/.test(value);
  };