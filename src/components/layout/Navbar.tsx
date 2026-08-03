import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Download, ShieldCheck, Swords, Trophy, Users, Info, HelpCircle, Star } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Início", icon: Swords },
    { to: "/cadastro", label: "Cadastro", icon: ShieldCheck },
    { to: "/downloads", label: "Downloads", icon: Download },
    { to: "/rankings", label: "Rankings", icon: Trophy },
    { to: "/personagens", label: "Personagens", icon: Users },
    { to: "/vip", label: "VIP", icon: Star },
    { to: "/suporte", label: "Suporte", icon: HelpCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-mu-gold/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-mu-stone-dark to-mu-gold/20" />
            <span className="absolute inset-0 flex items-center justify-center font-bold text-mu-gold">MK</span>
          </div>
          <span className="text-xl font-bold tracking-tighter text-mu-gold text-shadow-gold uppercase">MU KAME</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group flex items-center gap-1.5 text-sm font-medium text-stone-300 transition-colors hover:text-mu-gold"
            >
              <link.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="ml-4 rounded-md bg-mu-gold px-4 py-2 text-sm font-bold text-mu-stone-dark shadow-[0_0_10px_rgba(234,179,8,0.4)] transition-all hover:scale-105 hover:bg-mu-gold/90 active:scale-95"
          >
            LOGIN
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="rounded-md p-2 text-stone-300 hover:bg-white/5 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="border-t border-white/5 bg-mu-stone-dark/95 p-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-base font-medium text-stone-300 hover:text-mu-gold"
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="mt-2 block w-full rounded-md bg-mu-gold py-3 text-center text-sm font-bold text-mu-stone-dark"
            >
              LOGIN
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
