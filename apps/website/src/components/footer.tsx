import { Link } from "@tanstack/react-router";
import { Separator } from "@monorepo/ui/separator";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "lucide-react";
import Logo from "@/components/logo";

const Footer = () => {
  return (
    <footer>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8 lg:px-8">
        <Link to="/">
          <div className="flex items-center gap-3">
            <Logo className="gap-3" />
          </div>
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 whitespace-nowrap sm:gap-5">
          <Link
            to="/"
            className="text-muted-foreground opacity-80 transition-opacity duration-300 hover:text-foreground hover:opacity-100"
          >
            Support
          </Link>
          <Link
            to="/"
            className="text-muted-foreground opacity-80 transition-opacity duration-300 hover:text-foreground hover:opacity-100"
          >
            Terms & Conditions
          </Link>
          <Link
            to="/"
            className="text-muted-foreground opacity-80 transition-opacity duration-300 hover:text-foreground hover:opacity-100"
          >
            Privacy Policy
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <FacebookIcon className="size-5" />
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <InstagramIcon className="size-5" />
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <TwitterIcon className="size-5" />
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <YoutubeIcon className="size-5" />
          </Link>
        </div>
      </div>

      <Separator />

      <div className="mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6 lg:px-8">
        <p className="flex items-center gap-1 text-balance text-center font-medium max-sm:flex-col">
          <span>
            {`©${new Date().getFullYear()}`}{" "}
            <Link to="/" className="hover:underline">
              INK,
            </Link>
          </span>
          <span> Made with ❤️ for better web.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
