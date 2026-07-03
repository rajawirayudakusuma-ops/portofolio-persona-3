import { useContext } from 'react';
import { useMedia as useMediaContext } from '../context/MediaProvider';

export default function useMedia() {
  return useMediaContext();
}
