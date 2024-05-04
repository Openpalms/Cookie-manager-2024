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
    const { name, value } = e.target;
    setEditedCookie({ ...editedCookie, [name]: value });
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
              <label>is Secure:</label>
              <input
                type={'checkbox'}
                name={'secure'}
                checked={editedCookie['secure']}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <div className="w-1/2 flex items-center justify-start gap-4">
              <label>is HttpOnly:</label>
              <input
                type={'checkbox'}
                name={'httpOnly'}
                checked={editedCookie['httpOnly']}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
          </div>
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
