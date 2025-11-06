'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Menu, Repeat, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from '../icons';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
  { href: '/requests', icon: Repeat, label: 'Requests' },
];

export default function Header() {
    const pathname = usePathname();
    const currentPage = navItems.find(item => pathname.startsWith(item.href));
    const pageTitle = currentPage ? currentPage.label : "SlotSwapper";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Icons.logo className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">SlotSwapper</span>
            </Link>
            {navItems.map(item => (
                <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-2.5 ${pathname.startsWith(item.href) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <h1 className="text-xl font-semibold">{pageTitle}</h1>
    </header>
  );
}
