import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button, buttonVariants } from "@monorepo/ui/button";
import { cn } from "@monorepo/ui/cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "@monorepo/ui/tooltip";
import { MailIcon, MenuIcon } from "lucide-react";
import InkLogo from "@/assets/svg/logo";
import MenuDropdown from "@/components/blocks/menu-dropdown";
import type { NavigationSection } from "@/components/blocks/menu-navigation";
import MenuNavigation from "@/components/blocks/menu-navigation";
import { ThemeToggle } from "./theme-toggle";

type HeaderProps = {
  navigationData: NavigationSection[];
  className?: string;
};

const Header = ({ navigationData, className }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // If no sections exist on the page, clear active section
      if (sections.length === 0) {
        if (activeSection !== "") {
          setActiveSection("");
        }

        return;
      }

      let foundSection = false;

      for (const section of sections) {
        const element = section as HTMLElement;
        const { offsetTop, offsetHeight } = element;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          if (element.id !== activeSection) {
            setActiveSection(element.id);
          }

          foundSection = true;
          break;
        }
      }

      // If no section matched, clear active section
      if (!foundSection && activeSection !== "") {
        setActiveSection("");
      }
    };

    // Initial check
    handleScroll();

    // Listen for scroll events
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeSection]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 w-full bg-background transition-all duration-300",
        {
          "shadow-sm": isScrolled,
        },
        className,
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <InkLogo />
          <span className="font-semibold text-[20px] text-primary">INK</span>
        </Link>

        {/* Navigation */}
        <MenuNavigation
          navigationData={navigationData}
          activeSection={activeSection}
          className="max-lg:hidden"
        />

        {/* Actions */}
        <div className="flex gap-3">
          <ThemeToggle />

          {/* Navigation for small screens */}
          <div className="flex gap-3">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link
                    to="/"
                    className={buttonVariants({ variant: "outline", className: "max-sm:hidden" })}
                  >
                    Get in Touch
                  </Link>
                }
              />
              <TooltipContent>Get in Touch</TooltipContent>
            </Tooltip>

            <MenuDropdown
              align="end"
              navigationData={navigationData}
              activeSection={activeSection}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
