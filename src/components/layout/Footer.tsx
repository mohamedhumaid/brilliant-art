import Link from 'next/link'
import Image from 'next/image'

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Career', href: '/career' },
  { label: 'Contact', href: '/contact' },
]

const socials = [
  { label: 'Facebook', href: 'https://facebook.com/brilliantartjo' },
  { label: 'Instagram', href: 'https://instagram.com/brilliantartjo' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/brilliantartjo' },
  { label: 'X / Twitter', href: 'https://x.com/brilliantartjo' },
  { label: 'YouTube', href: 'https://youtube.com/@brilliantartjo' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface-dim">
      <div className="max-w-[1440px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Image
              src="/images/logo.webp"
              alt="Brilliant Art"
              width={140}
              height={40}
              className="h-9 w-auto object-contain mb-4"
            />
            <p className="text-body-md text-on-surface-variant max-w-xs mb-6">
              A full-service digital and branding agency empowering ambitious businesses since 2016.
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <span className="text-label-sm text-on-surface-variant">Al Jubeiha — Amman</span>
              </li>
              <li>
                <a href="tel:+962795271157" className="text-label-sm text-on-surface-variant hover:text-white transition-colors">
                  +962 795 271 157
                </a>
              </li>
              <li>
                <a href="mailto:Hello@brilliantartjo.com" className="text-label-sm text-on-surface-variant hover:text-white transition-colors">
                  Hello@brilliantartjo.com
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-label-bold uppercase tracking-widest text-on-surface-variant mb-4">Navigation</p>
            <ul className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-body-md text-on-surface-variant hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-label-bold uppercase tracking-widest text-on-surface-variant mb-4">Follow Us</p>
            <ul className="flex flex-col gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-body-md text-on-surface-variant hover:text-white transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-label-sm text-on-surface-variant">
            &copy; {new Date().getFullYear()} Brilliant Art. All rights reserved.
          </p>
          <p className="text-label-sm text-on-surface-variant">
            Crafted with precision & passion.
          </p>
        </div>
      </div>
    </footer>
  )
}
