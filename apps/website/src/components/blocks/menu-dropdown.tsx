'use client';

import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@monorepo/ui/button';
import { cn } from '@monorepo/ui/cn';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@monorepo/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@monorepo/ui/dropdown-menu';
import { ChevronRightIcon, CircleSmallIcon, MenuIcon } from 'lucide-react';

export type NavigationItem = {
  title: string;
  href: string;
};

export type NavigationSection = {
  title: string;
  icon?: ReactNode;
} & (
    | {
      items: NavigationItem[];
      href?: never;
    }
    | {
      items?: never;
      href: string;
    }
  );

type Props = {
  navigationData: NavigationSection[];
  activeSection?: string;
  align?: 'center' | 'end' | 'start';
};

const MenuDropdown = ({ navigationData, activeSection, align = 'start' }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" className="lg:hidden" />}>
        <MenuIcon />
        <span className="sr-only">Menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="mx-3 w-[min(93vw,500px)] sm:ml-8 md:w-[min(93vw,250px)] max-lg:md:mr-0"
        align={align}
      >
        {navigationData.map((navItem) => {
          if (navItem.href) {
            // Extract section ID from href (e.g., "/#categories" -> "categories", "/#" -> "home")
            const sectionFromHref = navItem.href === '/#' ? 'home' : navItem.href.replace('/#', '');
            const isActive = sectionFromHref === activeSection;

            return (
              <DropdownMenuItem
                key={navItem.title}
                render={
                  <Link
                    to={navItem.href}
                    className={cn(isActive && 'bg-accent font-medium text-accent-foreground')}
                  >
                    {navItem.icon}
                    {navItem.title}
                  </Link>
                }
              />
            );
          }

          return (
            <Collapsible
              key={navItem.title}
              render={
                <DropdownMenuGroup>
                  <CollapsibleTrigger
                    render={
                      <DropdownMenuItem
                        onSelect={(event) => event.preventDefault()}
                        className="justify-between"
                      >
                        {navItem.icon}
                        <span className="flex-1">{navItem.title}</span>
                        <ChevronRightIcon className="shrink-0 transition-transform [[data-state=open]>&]:rotate-90" />
                      </DropdownMenuItem>
                    }
                  />

                  <CollapsibleContent className="pl-2">
                    {navItem.items?.map((item) => (
                      <DropdownMenuItem
                        key={item.title}
                        render={
                          <Link to={item.href}>
                            <CircleSmallIcon />
                            <span>{item.title}</span>
                          </Link>
                        }
                      />
                    ))}
                  </CollapsibleContent>
                </DropdownMenuGroup>
              }
            />
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuDropdown;
