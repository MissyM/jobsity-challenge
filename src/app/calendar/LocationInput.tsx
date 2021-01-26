import React, { useEffect, useRef, useState } from 'react';
import { Box, Input, BoxProps, Flex, Image } from '@chakra-ui/react';
import { Location } from './api';

const apiKey = '6f2938e6fae5cd744b897d9098df7e78';

export interface LocationInputProps extends BoxProps {
  location?: Location;
  onLocationChange: (location: Location) => void;
}

export default function LocationInput({
  location = { place: '', lat: 0, lng: 0 },
  onLocationChange,
  ...rest
}: LocationInputProps) {
  const inputRef = useRef<any>();

  const [temperature, setTemperature] = useState();
  const [icon, setIcon] = useState();
  const [forecast, setForecast] = useState<string>();

  useEffect(() => {
    const autocomplete = new (window as any).google.maps.places.Autocomplete(
      inputRef.current
    );
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (place.name === '') {
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      onLocationChange({ place: place.name, lat, lng });
    });
  }, [onLocationChange]);

  useEffect(() => {
    if (location.place === '') {
      return;
    }

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&units=metric&appid=${apiKey}`
    )
      .then((r) => r.json())
      .then((result) => {
        setIcon(result.weather[0].icon);
        setTemperature(result.main.temp);
        setForecast(result.weather[0].description);
      })
      .catch((err) => {
        throw err;
      });
  }, [location]);

  return (
    <Flex {...rest} flexDirection="column">
      <Input
        overflow="hidden"
        textOverflow="ellipsis"
        ref={inputRef}
        defaultValue={location.place}
        w="100%"
        marginRight="5px"
      />
      {location.place !== '' && (
        <>
          <Flex align="center">
            <Box fontWeight="600" paddingRight="10px">
              Today:{' '}
            </Box>{' '}
            {temperature} °C
            {icon && (
              <Image src={`http://openweathermap.org/img/wn/${icon}.png`} />
            )}
          </Flex>
          <Flex>
            <Box fontWeight="600" paddingRight="10px">
              Forecast:{' '}
            </Box>
            {forecast && capitalizeFirsLetter(forecast)}
          </Flex>
        </>
      )}
    </Flex>
  );
}

function capitalizeFirsLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}
