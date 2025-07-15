import { cn } from "@/lib/utils";
import { CiFacebook, CiInstagram, CiMail } from "react-icons/ci";
import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";

const Footer = () => {
  return (
    <footer className="hidden md:flex bg-white gap-5 border-t border-light-gray w-full min-h-36 p-4 text-sm">
      <div className="w-1/5">
        <div className="flex gap-2">
          <Link
            to=""
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "py-2 px-4 cursor-pointer text-center"
            )}
            aria-label="Navigation page FaceBook"
          >
            <CiFacebook size={25} />
          </Link>
          <Link
            to=""
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "py-2 px-4 cursor-pointer text-center"
            )}
            aria-label="Contact par mail"
          >
            <CiMail size={25} />
          </Link>
          <Link
            to=""
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "py-2 px-4 cursor-pointer text-center"
            )}
            aria-label="Navigation page Instagram"
          >
            <CiInstagram size={25} />
          </Link>
        </div>
      </div>
      <div className="w-1/4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat rem
      </div>
      <div className="w-1/4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat rem
      </div>
    </footer>
  );
};

export default Footer;
