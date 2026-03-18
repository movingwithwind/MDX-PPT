type Props = { href?: string, children?: React.ReactNode };
export default function SlideLink({ href = '', children }: Props) {
  return ( 
            <a href={href} className="inline-block transition-transform duration-200
            text-blue-400 hover:text-blue-450 hover:scale-105" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
  );
}