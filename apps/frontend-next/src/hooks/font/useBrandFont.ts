import { Yeseva_One } from 'next/font/google'

const yesevaOne = Yeseva_One({
  weight: "400",
  subsets: ["latin"],
  variable: '--brand-font',
})

export function useBrandFont() {
  return yesevaOne;
}
