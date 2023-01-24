export const useLocalStorage = (name) => {
  const getLocalStorage = () => {
    const local = localStorage.getItem(name);
    if (local != null) {
      return JSON.parse(local);
    }
    return [null];
  };
  const setLocalStorage = (item) => {
    localStorage.setItem(name, JSON.stringify(item));
  };
  const removeLocalStorage = () => {
    return localStorage.removeItem(name);
  };
  return [getLocalStorage, setLocalStorage, removeLocalStorage];
};

// import { useState, useEffect } from 'react';

// function MyComponent() {
//   const [name, setName] = useState('');

//   useEffect(() => {
//     // retrieve the name from local storage
//     const storedName = localStorage.getItem('name');
//     if (storedName) {
//       setName(storedName);
//     }
//   }, []);

//   useEffect(() => {
//     // update the local storage when the name state changes
//     localStorage.setItem('name', name);
//   }, [name]);

//   return (
//     <div>
//       <input
//         type="text"
//         value={name}
//         onChange={e => setName(e.target.value)}
//       />
//     </div>
//   );
// }

// escrowContract.on("Approved", () => {
//   document.getElementById(escrowContract.address).className =
//     "complete";
//   document.getElementById(escrowContract.address).innerText =
//     "✓ It's been approved!";
// });
