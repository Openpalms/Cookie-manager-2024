import { useEffect, useState } from 'react';
import './App.css';
import { Cookie } from './components/Cookie';

function App() {
  const [cookies, setCookies] = useState<chrome.cookies.Cookie[]>([]);
  const [url, setUrl] = useState('');

  useEffect(() => {
    const getCookies = async () => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;
        setUrl(currentUrl as string);
        chrome.cookies.getAll({ url: currentUrl }, function (tabCookie) {
          setCookies(tabCookie);
        });
      });
    };
    getCookies();
  }, []);

  return (
    <>
      <div className="w-[500px]">
        <h1 className="text-xl">Cookies for</h1>
        <p className="text-sm  break-words">{url}</p>
        <div className="cookie_list">
          {cookies.map((cookie) => (
            <Cookie cookie={cookie} url={url} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
