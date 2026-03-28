import React from 'react';
import useSWR from 'swr';
import './App.css';

const COUNTRIES_ENDPOINT = 'https://openholidaysapi.org/Countries';

async function fetcher(endpoint) {
  const response = await fetch(endpoint);
  const json = await response.json();

  return json;
}

function App() {
  // State management for country for selector.
  const [country, setCountry] = React.useState('NL');

  // Use the API to get list of countries.
  const { data, error } = useSWR(COUNTRIES_ENDPOINT, fetcher);

  const { data: holidayData, error: errorData } = useSWR(
    country
      ? `https://openholidaysapi.org/PublicHolidays?countryIsoCode=${country}&validFrom=2026-01-01&validTo=2026-12-31`
      : null,
    fetcher
  );

  // "Safety Gate" per Gemini:
  if (error) return <div>Failed to load </div>;
  if (!data) return <div>Loading...</div>;

  // Parse with a map to get EN iso code and country name:
  const countries = data.map((entry) => [entry.isoCode, entry.name[0].text]);

  const cleanHolidayData = holidayData
    ? holidayData.map((holiday) => {
        //1. Find the name object that is english
        const englishEntry = holiday.name.find((n) => n.language === 'EN');

        // 2. Return simple object with just what i need.
        return {
          date: holiday.startDate,
          name: englishEntry ? englishEntry.text : 'Unknown Name',
        };
      })
    : [];

  console.log(cleanHolidayData);

  return (
    <>
      <form>
        <fieldset>
          <legend>Select Country: </legend>
          <label htmlFor="country">Country:</label>
          <select
            required
            id="country"
            name="country"
            value={country}
            onChange={(event) => {
              setCountry(event.target.value);
            }}
          >
            <option value="">-Select Country-</option>
            <optgroup label="Countries">
              {countries.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </optgroup>
          </select>
        </fieldset>
      </form>
      <ol>
        {cleanHolidayData.map(({ date, name }) => (
          <li key={date}>
            {date} {name}
          </li>
        ))}
      </ol>
    </>
  );
}

export default App;
