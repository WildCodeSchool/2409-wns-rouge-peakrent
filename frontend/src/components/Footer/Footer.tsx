import { CiFacebook, CiInstagram, CiMail } from "react-icons/ci";

const Footer = () => {
  return (
    <footer className="hidden md:flex bg-white gap-5 border-t border-light-gray w-full min-h-36 p-4 text-sm">
      <div className="w-1/5">
        <ul className="flex gap-2">
          <li className="btn-secondary">
            <CiFacebook size={25} />
          </li>
          <li className="btn-secondary">
            <CiMail size={25} />
          </li>
          <li className="btn-secondary">
            <CiInstagram size={25} />
          </li>
        </ul>
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
