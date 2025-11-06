import type { SVGProps } from "react"

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 7h12M8 17h12M8 12h12M4 7l-2 2 2 2" />
      <path d="M20 17l2-2-2-2" />
    </svg>
  ),
};
