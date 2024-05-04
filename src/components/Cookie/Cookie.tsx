import { FC, useState } from 'react';
import { Accordion } from '../Accordion';

type Props = {
  cookie: chrome.cookies.Cookie;
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
  { name: 'expirationDate', label: 'Expiration Date' },
  { name: 'secure', label: 'Secure', type: 'checkbox' },
  { name: 'httpOnly', label: 'HttpOnly', type: 'checkbox' },
];

export const CookieToRender: FC<Props> = ({ cookie }) => {
  const { name, domain, secure, httpOnly, expirationDate } = cookie;
  const [editedCookie, setEditedCookie] = useState(cookie);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCookie({ ...editedCookie, [name]: value });
  };

  const onUpdateCookie = () => {
    chrome.cookies.set(editedCookie, (cookie) => {
      if (cookie) {
        console.log('Cookie updated successfully:', cookie);
      } else {
        console.error('Failed to update cookie');
      }
    });
  };

  const isSecure = secure ? 'Secure' : '';
  const isHttpOnly = httpOnly ? 'HttpOnly' : '';

  return (
    <div>
      <Accordion title={`${domain} | ${name}`} mainText={''}>
        <div className="flex gap-2 items-center ">
          <p>{isSecure}</p>
          <p>{isHttpOnly}</p>
          <p>
            Expires:
            {new Date(Number(expirationDate) * 1000).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          {cookieProperties.map((property) => (
            <div key={property.name}>
              <label htmlFor={property.name}>{property.label}:</label>
              <input
                type={property.type || 'text'}
                name={property.name}
                value={editedCookie[property.name] as string}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
          ))}
          <button
            onClick={onUpdateCookie}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </Accordion>
    </div>
  );
};
