import React, { useState,useEffect } from 'react'
import search_icon from '../assets/img/search.png'
import humidit from '../assets/img/humidity.png'
import wind from '../assets/img/wind.png'
import clsx from 'clsx'

export const Weather = () => {
  const[weather, setWeather] = useState({});
  const[query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const {
    location: { name } = { name: 'City Name' },
    current: {
      humidity = 0,
      wind_mph = 0,
      temp_c = 0,
      condition: { icon = 'https://cdn.weatherapi.com/weather/64x64/day/113.png' } = {},
    } = {}
  } = weather;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) return;
    async function fetchData() {
      try {
        const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_APP_ID}&q=${debouncedQuery}`);
        if (!res.ok) {
          throw new Error('Network response was not ok ' + res.statusText);
        }
        const data = await res.json();
        setWeather(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
    ;
    fetchData();
  }, [debouncedQuery]);
 
  
  return (
    <div className='text-black bg-slate-900 rounded-lg px-10 py-10'>
      <div className="flex">
        <input
        placeholder="Search location..."
        onChange={ (e) => setQuery(e.target.value)}
          className={clsx(
            'block w-72 rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )}
        />
        <div className='bg-white rounded-md	p-2.5 ml-3'>
          <img src={search_icon} alt="" />
        </div>
      </div>
      <div className='flex justify-center'>
        <img src={icon} alt="" className='h-32 mt-3' />
      </div>
      <div className='text-center mb-12'>
        <p className='text-7xl'>{temp_c}C</p>
        <p className='text-2xl'>{name}</p>
      </div>
      <div className='grid grid-cols-2 gap-12'>
        <div className='flex'>
          <div>
            <img src={humidit} className="mr-3 mt-2 h-7" alt="" />
          </div>
          <div>
            <p>Humidity</p>
            <p>{humidity}%</p>
          </div>
        </div>
        <div className='flex'>
          <div>
            <img src={wind}  className="mr-3 mt-2 h-7" alt="" />
          </div>
          <div>
            <p>Wind Speed</p>
            <p>{wind_mph} mph</p>
          </div>
        </div>
      </div>
    </div>
  )
}
