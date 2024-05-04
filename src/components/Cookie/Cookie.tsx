import { FC, useState } from 'react';
import { Accordion } from '../Accordion';

type Props = {
  cookie: chrome.cookies.Cookie;
  url: string;
};

type CookieProperty = {
  name: keyof chrome.cookies.Cookie;
  label: string;
  type?: 'text' | 'checkbox';
};

const cookieProperties: CookieProperty[] = [
  { name: 'name', label: 'Name' },
  { name: 'value', label: 'Value' },
  { name: 'domain', label: 'Domain' },
  { name: 'path', label: 'Path' },
  { name: 'expirationDate', label: 'Expires' },
];

export const CookieToRender: FC<Props> = ({ cookie, url }) => {
  const { name, domain, expirationDate } = cookie;
  const [editedCookie, setEditedCookie] = useState(cookie);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setEditedCookie({ ...editedCookie, [name]: newValue });
  };

  const onUpdateCookie = () => {
    const updatedCookie: chrome.cookies.SetDetails = {
      url,
      name: editedCookie.name,
      value: editedCookie.value,
      domain: editedCookie.domain,
      path: editedCookie.path,
      secure: editedCookie.secure,
      httpOnly: editedCookie.httpOnly,
      expirationDate: editedCookie.expirationDate,
    };

    chrome.cookies.set(updatedCookie, (cookie) => {
      if (cookie) {
        console.log('Cookie updated successfully:', cookie);
      } else {
        console.error('Failed to update cookie');
      }
    });
  };
  const onDeleteCookie = () => {
    chrome.cookies.remove({ url: url, name: editedCookie.name }, (details) => {
      if (details) {
        console.log('Cookie deleted successfully:', details);
      } else {
        console.error('Failed to delete cookie');
      }
    });
  };

  return (
    <div>
      <Accordion title={`${domain} | ${name}`} mainText={''}>
        <div className="flex gap-2 items-center "></div>
        <div className="flex flex-col gap-2 items-center">
          {cookieProperties.map((property) => (
            <div
              key={property.name}
              className="w-full flex items-center justify-between gap-2"
            >
              <label htmlFor={property.name}>{property.label}:</label>
              <input
                type={property.type}
                name={property.name}
                value={editedCookie[property.name] as string}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-[80%] ml-auto"
              />
            </div>
          ))}
          <p className="flex w-full">
            Expire Date:{' '}
            {new Date(Number(expirationDate) * 1000).toLocaleString()}
          </p>
          <div className="flex flex-col gap-2 w-full">
            <div className="w-1/2 flex items-center justify-start gap-4">
              <label>Secure:</label>
              <input
                type={'checkbox'}
                name={'secure'}
                checked={editedCookie['secure']}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <div className="w-1/2 flex items-center justify-start gap-4">
              <label>HttpOnly:</label>
              <input
                type={'checkbox'}
                name={'httpOnly'}
                checked={editedCookie['httpOnly']}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={onUpdateCookie}
              className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white px-4 py-2 rounded transition duration-300"
            >
              Save
            </button>
            <button
              onClick={onDeleteCookie}
              className="bg-red-500 hover:bg-red-600 outline-none border-none active:scale-95 text-white px-4 py-2 rounded transition duration-300"
            >
              Delete cookie
            </button>
          </div>
        </div>
      </Accordion>
    </div>
  );
};
